
import { json } from '@sveltejs/kit'

export type Categories = 'sveltekit' | 'svelte' | 'typescript' | 'aws' | 'skeleton' | 's3' | 'route53' | 'cloudfront'
export const category_list:string[] =['sveltekit', 'svelte', 'typescript', 'aws', 'skeleton', 's3', 'route53', 'cloudfront']

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	categories: string[]
	published: boolean
	img_url:string|undefined
}

async function getBlogPaths() {
	const paths = import.meta.glob('/src/lib/blog/content/*.md', { eager: true })
	return paths
	
}




export async function getBlogPosts(search_categories:string[]=[]) {
	let posts: Post[] = []

	const paths = await getBlogPaths()
	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const post:Post = { ...metadata, slug }
			if(post.published){
				if(search_categories.length>0){
					if (post.categories.some((post_cat:Categories)=> (search_categories.indexOf(post_cat) > -1))){
						posts.push(post)
					}
				}else{
					posts.push(post)
				}
				
			}
		}
		
	}

	posts = posts.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())

	return json(posts)
}


