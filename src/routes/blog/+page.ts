import type { Post } from "$lib/utils/blog/posts";
import { getBlogPosts } from "$lib/utils/blog/posts";

export async function load() {
  const response = await getBlogPosts();
  const posts: Post[] = await response.json();
  return { posts };
}
