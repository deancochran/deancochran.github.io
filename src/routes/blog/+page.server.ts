import type { PageLoadEvent } from './[...path]/$types'

export const load = async (event: PageLoadEvent) => {
    const response = await event.fetch(`/api/posts`)
    const posts = (await response.json()) as BlogPostSummary[]
    return { posts }
}
