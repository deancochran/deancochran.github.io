import assert from 'node:assert/strict'
import test from 'node:test'

import {
    bufferRequest,
    collectExistingPosts,
    composeImageAsset,
    composePostText,
    frontmatterPublished,
    isInitialPushBefore,
    parseChannelIds,
    parseNameStatus,
    selectNewlyPublicPosts,
    textContainsCanonicalUrl,
} from './buffer-distribute.mjs'

const post = {
    title: 'A new post',
    description: 'A useful description that can be shortened safely. '.repeat(
        10
    ),
    image: '/images/post.webp',
    published: true,
    relativePath: 'nested/post',
}

test('channel IDs are trimmed and deduplicated', () => {
    assert.deepEqual(parseChannelIds(' one, two,one '), ['one', 'two'])
    assert.throws(() => parseChannelIds(' , '), /at least one/)
})

test('zero before SHA is treated as an initial push', () => {
    assert.equal(isInitialPushBefore('0'.repeat(40)), true)
    assert.equal(isInitialPushBefore('a'.repeat(40)), false)
})

test('name-status parsing handles ordinary changes and renames', () => {
    assert.deepEqual(
        parseNameStatus(
            'A\0src/posts/new.md\0R100\0src/posts/old.md\0src/posts/renamed.md\0'
        ),
        [
            {
                status: 'A',
                oldPath: 'src/posts/new.md',
                path: 'src/posts/new.md',
            },
            {
                status: 'R',
                oldPath: 'src/posts/old.md',
                path: 'src/posts/renamed.md',
            },
        ]
    )
    assert.throws(() => parseNameStatus('A\0'), /incomplete/)
})

test('published is read only from boolean frontmatter', () => {
    assert.equal(frontmatterPublished('---\npublished: true\n---\n'), true)
    assert.equal(frontmatterPublished('---\npublished: false\n---\n'), false)
    assert.equal(frontmatterPublished('---\npublished: "true"\n---\n'), false)
})

test('only added or newly published feed entries are selected', async () => {
    const old = { ...post, relativePath: 'old' }
    const changes = [
        {
            status: 'A',
            oldPath: 'src/posts/nested/post.md',
            path: 'src/posts/nested/post.md',
        },
        { status: 'M', oldPath: 'src/posts/old.md', path: 'src/posts/old.md' },
    ]
    const selected = await selectNewlyPublicPosts(
        [post, old],
        changes,
        async (path) => path.endsWith('/old.md')
    )
    assert.deepEqual(selected, [post])
})

test('renaming an already public post does not redistribute it', async () => {
    const selected = await selectNewlyPublicPosts(
        [post],
        [
            {
                status: 'R',
                oldPath: 'src/posts/old-name.md',
                path: 'src/posts/nested/post.md',
            },
        ],
        async () => true
    )
    assert.deepEqual(selected, [])
})

test('post text includes title, description, and canonical URL within limit', () => {
    const url = 'https://example.com/blog/nested/post'
    const text = composePostText(post, url)
    assert.ok(text.startsWith(`${post.title}\n\nA useful description`))
    assert.ok(text.endsWith(url))
    assert.ok([...text].length <= 280)
})

test('image asset uses the post title as alt text', () => {
    assert.deepEqual(
        composeImageAsset(post, 'https://example.com/image.webp'),
        {
            image: {
                url: 'https://example.com/image.webp',
                altText: post.title,
            },
        }
    )
})

test('canonical URL identity tolerates slash and punctuation only', () => {
    const canonical = 'https://example.com/blog/post'
    assert.equal(
        textContainsCanonicalUrl(`Read ${canonical}/.`, canonical),
        true
    )
    assert.equal(
        textContainsCanonicalUrl(`Read ${canonical}-other`, canonical),
        false
    )
})

test('recent history follows cursor pagination', async () => {
    const seen = []
    const posts = await collectExistingPosts({
        request: async (_query, variables) => {
            seen.push(variables)
            const second = variables.after === 'next'
            return {
                posts: {
                    edges: [
                        {
                            node: {
                                id: second ? 'two' : 'one',
                                text: 'text',
                                channelId: 'channel',
                            },
                        },
                    ],
                    pageInfo: {
                        hasNextPage: !second,
                        endCursor: second ? null : 'next',
                    },
                },
            }
        },
        organizationId: 'organization',
        channelIds: ['channel'],
        startDate: '2026-08-26T00:00:00.000Z',
    })
    assert.deepEqual(
        posts.map(({ id }) => id),
        ['one', 'two']
    )
    assert.equal(seen[1].after, 'next')
})

test('history bound and malformed responses fail closed', async () => {
    let calls = 0
    await assert.rejects(
        collectExistingPosts({
            request: async () => {
                calls += 1
                return {
                    posts: {
                        edges: [],
                        pageInfo: { hasNextPage: true, endCursor: `${calls}` },
                    },
                }
            },
            organizationId: 'organization',
            channelIds: ['channel'],
            startDate: '2026-08-26T00:00:00.000Z',
        }),
        /cannot prove URL absence/
    )
    assert.equal(calls, 10)

    await assert.rejects(
        collectExistingPosts({
            request: async () => ({ posts: { edges: null } }),
            organizationId: 'organization',
            channelIds: ['channel'],
            startDate: '2026-08-26T00:00:00.000Z',
        }),
        /malformed pagination/
    )
})

test('Buffer 429 honors Retry-After and partial data fails closed', async () => {
    const responses = [
        new Response(JSON.stringify({ errors: [{ message: 'limited' }] }), {
            status: 429,
            headers: { 'retry-after': '2' },
        }),
        new Response(JSON.stringify({ data: { ok: true } })),
    ]
    const waits = []
    const data = await bufferRequest(
        'key',
        'query',
        {},
        {
            fetchImplementation: async () => responses.shift(),
            sleep: async (milliseconds) => waits.push(milliseconds),
        }
    )
    assert.equal(data.ok, true)
    assert.deepEqual(waits, [2000])

    await assert.rejects(
        bufferRequest(
            'key',
            'query',
            {},
            {
                fetchImplementation: async () => new Response('{}'),
            }
        ),
        /did not contain data/
    )
})
