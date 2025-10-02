// src/routes/rss.xml/+server.ts
import { getPosts } from '$lib/utils/getPosts';
import { env } from '$env/dynamic/public';
import { base } from '$app/paths';

const siteURL = env.PUBLIC_SITE_URL;        // GH Pages or localhost via env
const siteTitle = "Dean's List";
const siteDescription = 'An opinionated list of my favorite things.';

export const prerender = true;

export const GET = async () => {
    // Fetch posts directly from the file system / data source
    const allPosts = await getPosts();
    
    const publishedPosts = allPosts
        .filter(post => post.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const body = renderRSS(publishedPosts);

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600',
        },
    });
};

function renderRSS(posts: (BlogPost & { relativePath: string })[]) {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteTitle}</title>
<description>${siteDescription}</description>
<link>${siteURL}</link>
<atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
    .map(post => `
<item>
  <guid isPermaLink="true">${siteURL}${base}/blog/${post.relativePath}</guid>
  <title>${post.title}</title>
  <link>${siteURL}${base}/blog/${post.relativePath}</link>
  <description>${post.description}</description>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`).join('')}
</channel>
</rss>`;
}

