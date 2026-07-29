import { getPosts } from '$lib/utils/getPosts'
import { absoluteUrl, SITE_ORIGIN } from '$lib/config'
import { escapeXml } from '$lib/utils/xml'

const siteTitle = "Dean's List"
const siteDescription = 'An opinionated list of my favorite things.'

export const prerender = true

export const GET = async () => {
    const allPosts = await getPosts()
    const sortedPosts = allPosts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    const filteredPosts = sortedPosts.filter((p) => p.published)

    const body = render(filteredPosts)

    return new Response(body, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/rss+xml; charset=utf-8',
        },
    })
}

const render = (posts: (BlogPost & { relativePath: string })[]) =>
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(siteTitle)}</title>
<description>${escapeXml(siteDescription)}</description>
<link>${SITE_ORIGIN}</link>
<atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml"/>
${posts
    .map(
        (post) => `
<item>
<guid isPermaLink="true">${absoluteUrl(`/blog/${post.relativePath}`)}</guid>
<title>${escapeXml(post.title)}</title>
<link>${absoluteUrl(`/blog/${post.relativePath}`)}</link>
<description>${escapeXml(post.description)}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`
    )
    .join('')}
</channel>
</rss>`
