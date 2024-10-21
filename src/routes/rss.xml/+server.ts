import { getPosts } from '$lib/utils/getPosts'

const siteURL = 'https://dean-cochran.com'
const siteTitle = "Dean's List"
const siteDescription = 'An opinionated list of my favorite things.'

export const prerender = true

export const GET = async () => {
	const allPosts = await getPosts()
	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	})
	const filteredPosts = sortedPosts.filter((post) => post.published)

	const body = render(filteredPosts)
	const options = {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml',
		},
	}

	return new Response(body, options)
}

const render = (posts: (BlogPost & { relativePath: string })[]) =>
	`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
	.map(
		(post) =>
			`<item>
<guid isPermaLink="true">${siteURL}/posts/${post.relativePath}</guid>
<title>${post.title}</title>
<link>${siteURL}/posts/${post.relativePath}</link>
<description>${post.description}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`
	)
	.join('')}
</channel>
</rss>
`
