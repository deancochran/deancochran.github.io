
import { json } from '@sveltejs/kit'

export type Categories = 'sveltekit' | 'svelte' | 'typescript' | 'aws' | 'skeleton' | 's3' | 'route53' | 'cloudfront'

async function getBlogPaths() {
	const paths = import.meta.glob('/src/lib/blog/content/*.md', { eager: true })
	return paths

}

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	categories: Categories[]
	published: boolean
	img_url:string|undefined
}

export async function getBlogPosts() {
	let posts: Post[] = []

	const paths = await getBlogPaths()
	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const post = { ...metadata, slug } satisfies Post
			post.published && posts.push(post)
		}
	}

	posts = posts.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())

	return json(posts)
}


