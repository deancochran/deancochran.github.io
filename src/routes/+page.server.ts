import { base } from '$app/paths'

export const load = async (event) => {
    const response = await event.fetch(`${base}/api/posts`)
    const posts = (await response.json()) as BlogPostSummary[]

    return {
        post:
            posts.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0] ?? null,
    }
}
