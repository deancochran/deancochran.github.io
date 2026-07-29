import { getPostPath, parsePostMetadata } from '$lib/utils/posts'
import { error } from '@sveltejs/kit'
export const prerender = true
export const load = async (event) => {
    const posts = import.meta.glob('/src/posts/**/*.md')
    for (const [path, resolver] of Object.entries(posts)) {
        const relativePath = getPostPath(path)
        if (relativePath === event.params.path) {
            const file = (await resolver()) as MdsvexFile
            const meta = parsePostMetadata(file?.metadata, path)
            if (!meta.published || !file.default) {
                throw error(404, `Post ${path} found, but could not be loaded`) // Couldn't resolve the post
            }
            return {
                component: file.default,
                meta,
                relativePath,
            }
        }
    }

    throw error(404, `Post: '${event.params.path}' not found`) // Couldn't resolve the post
}
