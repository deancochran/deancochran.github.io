import type { Post } from "$lib/utils/blog/posts";
import { getBlogPosts } from "$lib/utils/blog/posts";

const render = (posts: Post[]) => {
  return `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <atom:link href="http:///www.deancochran.net/rss" rel="self" type="application/rss+xml" />
        <title>Dean Cochran</title>
        <link>https:///www.deancochran.net</link>
        <description>Dean Cochran's blog</description>
        ${posts
          .map(
            (post) => `<item>
            <guid>https://www.deancochran.net/blog/${post.slug}</guid>
            <title>${post.title}</title>
            <link>https:///www.deancochran.net/blog/${post.slug}</link>
            <description>${post.description}</description>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            </item>`
          )
          .join("")}
        </channel>
    </rss>
    `;
};

export async function GET(): Promise<{ headers: any; body }> {
  const res = await getBlogPosts();
  const posts: Post[] = await res.json();
  const body: BodyInit = render(posts);
  const options: ResponseInit = {
    headers: {
      "Cache-Control": `max-age=0, s-max-age=${600}`,
      "Content-Type": "application/xml",
    },
  };
  return new Response(body, options);
}
