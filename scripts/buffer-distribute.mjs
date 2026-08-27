import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'

const execFile = promisify(execFileCallback)
const BUFFER_API_URL = 'https://api.buffer.com'
const PAGE_SIZE = 20
const MAX_HISTORY_PAGES = 10
const MAX_TEXT_LENGTH = 280
const ZERO_SHA = /^0+$/
const SHA = /^[0-9a-f]{40}$/i

class BufferMutationError extends Error {}

function requiredEnvironment(name) {
    const value = process.env[name]?.trim()
    if (!value) throw new Error(`Missing required environment variable ${name}`)
    return value
}

export function parseChannelIds(value) {
    const ids = [...new Set(value.split(',').map((id) => id.trim()))].filter(
        Boolean
    )
    if (ids.length === 0) {
        throw new Error(
            'BUFFER_CHANNEL_IDS must contain at least one channel ID'
        )
    }
    return ids
}

function parseArguments(arguments_) {
    const values = new Map()
    for (let index = 0; index < arguments_.length; index += 2) {
        const name = arguments_[index]
        const value = arguments_[index + 1]
        if (!name?.startsWith('--') || !value) {
            throw new Error('Usage: --before <git-sha> --after <git-sha>')
        }
        values.set(name.slice(2), value)
    }
    const before = values.get('before')
    const after = values.get('after')
    if (!SHA.test(before ?? '') || !SHA.test(after ?? '')) {
        throw new Error('--before and --after must be full Git SHAs')
    }
    return { before, after }
}

export function parseNameStatus(output) {
    const fields = output.split('\0')
    if (fields.at(-1) === '') fields.pop()
    const changes = []
    for (let index = 0; index < fields.length; ) {
        const status = fields[index++]
        if (!status)
            throw new Error('Git returned malformed name-status output')
        if (/^[RC]\d+$/.test(status)) {
            changes.push({
                status: status[0],
                oldPath: fields[index++],
                path: fields[index++],
            })
        } else {
            const path = fields[index++]
            changes.push({ status: status[0], oldPath: path, path })
        }
    }
    if (changes.some(({ path }) => typeof path !== 'string')) {
        throw new Error('Git returned incomplete name-status output')
    }
    return changes
}

export function isInitialPushBefore(before) {
    return ZERO_SHA.test(before)
}

async function changedPostPaths(before, after) {
    if (isInitialPushBefore(before)) {
        console.log(
            'Initial push has no prior revision; skipping archive distribution.'
        )
        return []
    }
    const { stdout } = await execFile('git', [
        'diff',
        '--name-status',
        '-z',
        '--find-renames',
        before,
        after,
        '--',
        'src/posts',
    ])
    return parseNameStatus(stdout).filter(
        ({ status, path }) => status !== 'D' && path.endsWith('.md')
    )
}

export function frontmatterPublished(source) {
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
    if (!frontmatter) return false
    const match = frontmatter[1].match(
        /^published:[ \t]*(true|false)[ \t]*\r?$/m
    )
    return match?.[1] === 'true'
}

async function wasPreviouslyPublished(before, path) {
    try {
        const { stdout } = await execFile('git', ['show', `${before}:${path}`])
        return frontmatterPublished(stdout)
    } catch (error) {
        if (error?.code === 128) return false
        throw error
    }
}

function validateFeedPost(post, index) {
    if (!post || typeof post !== 'object' || Array.isArray(post)) {
        throw new Error(`Feed item ${index} must be an object`)
    }
    for (const field of ['title', 'description', 'image', 'relativePath']) {
        if (typeof post[field] !== 'string' || post[field].trim() === '') {
            throw new Error(`Feed item ${index} has an invalid ${field}`)
        }
    }
    if (post.published !== true) {
        throw new Error(`Feed item ${index} is not explicitly published`)
    }
    if (
        post.relativePath.startsWith('/') ||
        post.relativePath.includes('..') ||
        post.relativePath.includes('\\')
    ) {
        throw new Error(`Feed item ${index} has an unsafe relativePath`)
    }
    return post
}

async function fetchPublishedFeed(origin) {
    const response = await fetch(new URL('/api/posts', origin), {
        cache: 'no-store',
        headers: { accept: 'application/json', 'cache-control': 'no-cache' },
        redirect: 'error',
        signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) {
        throw new Error(
            `Canonical feed request failed with HTTP ${response.status}`
        )
    }
    let body
    try {
        body = await response.json()
    } catch (error) {
        throw new Error('Canonical feed did not contain valid JSON', {
            cause: error,
        })
    }
    if (!Array.isArray(body))
        throw new Error('Canonical feed must contain an array')
    return body.map(validateFeedPost)
}

export async function selectNewlyPublicPosts(feed, changes, previousPublished) {
    const byPath = new Map(
        feed.map((post) => [`src/posts/${post.relativePath}.md`, post])
    )
    const selected = []
    for (const change of changes) {
        const post = byPath.get(change.path)
        if (!post) continue
        const priorPath = change.status === 'R' ? change.oldPath : change.path
        if (!(await previousPublished(priorPath))) selected.push(post)
    }
    return selected
}

function normalizedCanonicalUrl(value) {
    try {
        const url = new URL(value)
        url.hash = ''
        if (url.pathname !== '/')
            url.pathname = url.pathname.replace(/\/+$/, '')
        return url.href
    } catch {
        return null
    }
}

export function textContainsCanonicalUrl(text, canonicalUrl) {
    if (typeof text !== 'string') return false
    const identity = normalizedCanonicalUrl(canonicalUrl)
    const urls = text.match(/https?:\/\/[^\s<>]+/g) ?? []
    return urls.some(
        (value) =>
            normalizedCanonicalUrl(value.replace(/[),.;!?]+$/, '')) === identity
    )
}

export function composePostText(post, canonicalUrl) {
    const prefix = `${post.title}\n\n`
    const suffix = `\n\n${canonicalUrl}`
    const available = MAX_TEXT_LENGTH - [...prefix].length - [...suffix].length
    if (available < 1)
        throw new Error(`Title and URL exceed text limit: ${canonicalUrl}`)
    const description = [...post.description]
    const summary =
        description.length <= available
            ? post.description
            : available === 1
              ? '…'
              : `${description
                    .slice(0, available - 1)
                    .join('')
                    .trimEnd()}…`
    return `${prefix}${summary}${suffix}`
}

export function composeImageAsset(post, imageUrl) {
    return { image: { url: imageUrl, metadata: { altText: post.title } } }
}

function retryAfterSeconds(response) {
    const value = response.headers.get('retry-after')
    if (!/^\d+$/.test(value ?? '')) {
        throw new Error('Buffer HTTP 429 omitted a valid Retry-After header')
    }
    return Number(value)
}

export async function bufferRequest(
    apiKey,
    query,
    variables,
    {
        fetchImplementation = fetch,
        sleep = (milliseconds) =>
            new Promise((resolve) => setTimeout(resolve, milliseconds)),
    } = {}
) {
    for (let attempt = 0; ; attempt += 1) {
        const response = await fetchImplementation(BUFFER_API_URL, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${apiKey}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
            signal: AbortSignal.timeout(30_000),
        })
        let result
        try {
            result = await response.json()
        } catch (error) {
            throw new Error(
                `Buffer returned non-JSON HTTP ${response.status}`,
                {
                    cause: error,
                }
            )
        }
        if (response.status === 429) {
            const seconds = retryAfterSeconds(response)
            if (seconds > 60 || attempt >= 2) {
                throw new Error(
                    `Buffer rate limit retry refused after ${seconds}s`
                )
            }
            await sleep(seconds * 1000)
            continue
        }
        if (!response.ok || result.errors?.length) {
            const messages = result.errors
                ?.map((error) => error.message)
                .join('; ')
            throw new Error(
                `Buffer API request failed (HTTP ${response.status}): ${messages || 'unknown error'}`
            )
        }
        if (!result.data || typeof result.data !== 'object') {
            throw new Error('Buffer API response did not contain data')
        }
        return result.data
    }
}

async function validateChannels(apiKey, organizationId, channelIds) {
    const data = await bufferRequest(
        apiKey,
        `query DistributionChannels($organizationId: OrganizationId!) {
            channels(input: { organizationId: $organizationId }) {
                id name service isDisconnected isLocked
            }
        }`,
        { organizationId }
    )
    if (!Array.isArray(data.channels)) {
        throw new Error('Buffer channels query returned malformed data')
    }
    const channels = new Map(
        data.channels.map((channel) => [channel.id, channel])
    )
    return channelIds.map((id) => {
        const channel = channels.get(id)
        if (!channel || typeof channel.name !== 'string') {
            throw new Error(`Configured Buffer channel ${id} was not found`)
        }
        if (channel.isDisconnected || channel.isLocked) {
            throw new Error(`Configured Buffer channel ${id} is unavailable`)
        }
        return channel
    })
}

export async function collectExistingPosts({
    request,
    organizationId,
    channelIds,
    startDate,
}) {
    const posts = []
    let after = null
    for (let page = 1; page <= MAX_HISTORY_PAGES; page += 1) {
        const data = await request(
            `query DistributionHistory(
                $organizationId: OrganizationId!
                $channelIds: [ChannelId!]
                $startDate: DateTime!
                $after: String
            ) {
                posts(
                    first: ${PAGE_SIZE}
                    after: $after
                    input: {
                        organizationId: $organizationId
                        filter: { channelIds: $channelIds, startDate: $startDate }
                        sort: [{ field: createdAt, direction: desc }]
                    }
                ) {
                    edges { node { id text channelId status } }
                    pageInfo { hasNextPage endCursor }
                }
            }`,
            { organizationId, channelIds, startDate, after }
        )
        const result = data.posts
        if (!result || !Array.isArray(result.edges) || !result.pageInfo) {
            throw new Error(
                'Buffer posts query returned malformed pagination data'
            )
        }
        for (const edge of result.edges) {
            const post = edge?.node
            if (
                !post ||
                typeof post.id !== 'string' ||
                typeof post.text !== 'string' ||
                typeof post.channelId !== 'string'
            ) {
                throw new Error('Buffer posts query returned a malformed post')
            }
            posts.push(post)
        }
        if (!result.pageInfo.hasNextPage) return posts
        after = result.pageInfo.endCursor
        if (typeof after !== 'string' || after === '') {
            throw new Error('Buffer posts query omitted the next-page cursor')
        }
    }
    throw new Error('Buffer history bound reached; cannot prove URL absence')
}

async function usableImageUrl(imageUrl) {
    try {
        const response = await fetch(imageUrl, {
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(15_000),
        })
        return (
            response.ok &&
            response.headers.get('content-type')?.startsWith('image/')
        )
    } catch {
        return false
    }
}

async function createPost(apiKey, input) {
    const data = await bufferRequest(
        apiKey,
        `mutation DistributePost($input: CreatePostInput!) {
            createPost(input: $input) {
                ... on PostActionSuccess { post { id text channelId } }
                ... on MutationError { message }
            }
        }`,
        { input }
    )
    if (data.createPost?.post) return data.createPost.post
    if (typeof data.createPost?.message === 'string') {
        throw new BufferMutationError(data.createPost.message)
    }
    throw new Error('Buffer createPost returned an unknown result')
}

async function commitTimestamp(revision) {
    const { stdout } = await execFile('git', [
        'show',
        '-s',
        '--format=%cI',
        revision,
    ])
    const value = stdout.trim()
    if (Number.isNaN(Date.parse(value)))
        throw new Error('Invalid prior commit timestamp')
    return new Date(value).toISOString()
}

async function main() {
    const { before, after } = parseArguments(process.argv.slice(2))
    const changes = await changedPostPaths(before, after)
    if (changes.length === 0) {
        console.log('No changed post files; nothing to distribute.')
        return
    }

    const origin = new URL(requiredEnvironment('SITE_ORIGIN')).origin
    const feed = await fetchPublishedFeed(origin)
    const posts = await selectNewlyPublicPosts(feed, changes, (path) =>
        wasPreviouslyPublished(before, path)
    )
    if (posts.length === 0) {
        console.log('No posts became public in this push.')
        return
    }

    const apiKey = requiredEnvironment('BUFFER_API_KEY')
    const organizationId = requiredEnvironment('BUFFER_ORGANIZATION_ID')
    const channelIds = parseChannelIds(
        requiredEnvironment('BUFFER_CHANNEL_IDS')
    )
    const channels = await validateChannels(apiKey, organizationId, channelIds)
    const history = await collectExistingPosts({
        request: (query, variables) => bufferRequest(apiKey, query, variables),
        organizationId,
        channelIds,
        startDate: await commitTimestamp(before),
    })

    for (const post of posts) {
        const canonicalUrl = new URL(`/blog/${post.relativePath}`, origin).href
        const imageUrl = new URL(post.image, origin).href
        const text = composePostText(post, canonicalUrl)
        const attachImage = await usableImageUrl(imageUrl)
        for (const channel of channels) {
            if (
                history.some(
                    (item) =>
                        item.channelId === channel.id &&
                        textContainsCanonicalUrl(item.text, canonicalUrl)
                )
            ) {
                console.log(
                    `Skipping ${canonicalUrl} for ${channel.name}: duplicate.`
                )
                continue
            }
            const input = {
                text,
                channelId: channel.id,
                schedulingType: 'automatic',
                mode: 'addToQueue',
                ...(attachImage
                    ? { assets: [composeImageAsset(post, imageUrl)] }
                    : {}),
            }
            let created
            try {
                created = await createPost(apiKey, input)
            } catch (error) {
                if (!attachImage || !(error instanceof BufferMutationError))
                    throw error
                console.warn(
                    `Image rejected for ${channel.name}; retrying text-only: ${error.message}`
                )
                created = await createPost(apiKey, { ...input, assets: [] })
            }
            if (
                typeof created.id !== 'string' ||
                created.channelId !== channel.id ||
                typeof created.text !== 'string'
            ) {
                throw new Error('Buffer createPost returned a malformed post')
            }
            history.push(created)
            console.log(
                `Queued ${canonicalUrl} for ${channel.name} (${created.id}).`
            )
        }
    }
}

if (
    process.argv[1] &&
    import.meta.url === new URL(process.argv[1], 'file:').href
) {
    main().catch((error) => {
        console.error(`Buffer distribution failed: ${error.message}`)
        process.exitCode = 1
    })
}
