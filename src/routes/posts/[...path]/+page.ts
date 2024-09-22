import { email_schema } from '$lib/utils/schema';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';
export const prerender = true;
export const load: PageLoad = async (event) => {
	const modules = import.meta.glob('/src/posts/**/*.md');
	let match: { path?: string; resolver: MdsvexResolver } | undefined;
	for (const [path, resolver] of Object.entries(modules)) {
		const relativePath = path.split('.')[0].split('/').slice(3).join('/');
		if (relativePath === event.params.path) {
			match = { path, resolver: resolver as unknown as MdsvexResolver };
			break;
		}
	}
	if (!match) {
		throw error(404, `Post: '${event.params.path}' not found`); // Couldn't resolve the post
	}

	const post = await match.resolver();
	if (!post || !post.metadata.published || !post.default) {
		throw error(404, `Post ${match.path} found, but could not be loaded`); // Couldn't resolve the post
	}

	const form = await superValidate(zod(email_schema));

	return {
		component: post.default,
		meta: post.metadata,
		form
	};
};
