import { email_schema } from '$lib/utils/schema'
import { error } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
export const prerender = true
export const load = async (event) => {
	const posts = import.meta.glob('/src/posts/**/*.md')
	for (const [path, resolver] of Object.entries(posts)) {
		const relativePath = path.split('.')[0].split('/').slice(3).join('/')
		if (relativePath === event.params.path) {
			const file = (await resolver()) as MdsvexFile
			if (!file || !file.metadata.published || !file.default) {
				throw error(404, `Post ${path} found, but could not be loaded`) // Couldn't resolve the post
			}
			const form = await superValidate(zod(email_schema))
			return {
				component: file.default,
				meta: file.metadata,
				form,
			}
		}
	}

	throw error(404, `Post: '${event.params.path}' not found`) // Couldn't resolve the post
}
