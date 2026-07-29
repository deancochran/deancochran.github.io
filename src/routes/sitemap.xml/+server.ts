import { absoluteUrl } from '$lib/config'
import { getPosts } from '$lib/utils/getPosts'
import { escapeXml } from '$lib/utils/xml'

export const prerender = true

const staticPages = ['/', '/about', '/blog']

export const GET = async () => {
    const posts = (await getPosts())
        .filter((post) => post.published)
        .sort((a, b) => a.relativePath.localeCompare(b.relativePath))

    const urls = [
        ...staticPages.map(
            (path) => `<url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`
        ),
        ...posts.map(
            (post) =>
                `<url><loc>${escapeXml(absoluteUrl(`/blog/${post.relativePath}`))}</loc><lastmod>${post.date}</lastmod></url>`
        ),
    ]

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`,
        {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
            },
        }
    )
}
