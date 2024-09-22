import { email_schema } from '$lib/utils/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const response = await event.fetch(`/api/posts`);
	const posts = (await response.json()) as (BlogPost & { relativePath: string })[];
	const form = await superValidate(zod(email_schema));

	return { posts: posts, form };
};
