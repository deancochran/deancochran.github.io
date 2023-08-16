import { browser } from "$app/environment";
import type { Post } from "$lib/utils/blog/posts";
import { error } from "@sveltejs/kit";

export async function load({ params }): Promise<{ content: any; meta: Post }> {
  try {
    const post = await import(`../../../lib/blog/content/${params.slug}.md`);

    return {
      content: post.default,
      meta: post.metadata,
    };
  } catch (e) {
    throw error(404, `Could not find ${params.slug}`);
  }
}
