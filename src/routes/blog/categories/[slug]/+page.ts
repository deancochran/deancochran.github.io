import type { Categories, Post } from '$lib/utils/blog/posts'
import { category_list, getBlogPosts } from '$lib/utils/blog/posts'
import { error } from '@sveltejs/kit';

export async function load({ params } ):Promise<{posts:Post[], category:string}> {
    if(category_list.includes(params.slug)){

        const response = await getBlogPosts([params.slug])
        const posts: Post[] = await response.json()
        return { 
            posts,
            category:params.slug
        }
    }else{
        throw error(404, `Could not find the category: ${params.slug}`)
    }
 
}

