import { getPosts } from '$lib/utils/getPosts'
import { json, type RequestHandler } from '@sveltejs/kit'
export const prerender = true

export const GET: RequestHandler = async () => {
    const allPosts = await getPosts()
    const sortedPosts = allPosts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    const filteredPosts = sortedPosts.filter((post) => post.published)

    return json(filteredPosts)
}
