import type { Post } from "$lib/utils/blog/posts";
import { category_list, getBlogPosts } from "$lib/utils/blog/posts";

export async function load() {
  const categorized_posts = {};
  category_list.forEach(async (cat: string) => {
    const response = await getBlogPosts([cat]);
    const posts: Post[] = await response.json();
    categorized_posts[cat] = posts;
  });
  return { categorized_posts };
}
