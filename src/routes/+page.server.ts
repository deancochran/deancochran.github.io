import { email_schema } from '$lib/utils/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { base } from '$app/paths'; 

export const load = async (event) => {
    const response = await event.fetch(`${base}/api/posts`); 
    let posts: (BlogPost & { relativePath: string })[] = [];

    try {
        posts = (await response.json()) as (BlogPost & { relativePath: string })[];
    } catch (err) {
        console.error('Failed to fetch posts:', err);
    }

    const form = await superValidate(zod(email_schema));

    return {
        post: posts.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0],
        form,
    };
};
