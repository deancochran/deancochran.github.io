<script lang="ts">
    import { page } from '$app/state'
    import Newsletter from '$lib/components/Newsletter.svelte'
    import Post from '$lib/components/Post.svelte'
    import Seo from '$lib/components/Seo.svelte'
    import type { PageData } from './$types'

    interface Props {
        data: PageData
    }

    let { data }: Props = $props()

    function groupPostsByYear(posts: BlogPostSummary[]) {
        const groups = new Map<string, BlogPostSummary[]>()

        for (const post of posts) {
            const year = post.date.slice(0, 4)
            groups.set(year, [...(groups.get(year) ?? []), post])
        }

        return Array.from(groups, ([year, posts]) => ({ year, posts }))
    }

    let featuredPost = $derived(data.posts[0] ?? null)
    let archiveGroups = $derived(groupPostsByYear(data.posts.slice(1)))
</script>

<Seo
    title="Dean Cochran's Blog Posts"
    description="Software engineering, machine learning, and development environment articles by Dean Cochran"
    path={page.url.pathname}
    image="/images/logo.webp"
/>

<header
    class="flex items-end justify-between gap-6 border-b border-[var(--border)] pb-5"
>
    <h1 class="page-title">Articles</h1>
    <p class="archive-meta whitespace-nowrap">
        {data.posts.length}
        {data.posts.length === 1 ? 'article' : 'articles'}
    </p>
</header>

{#if featuredPost}
    <section class="space-y-5" aria-labelledby="latest-article">
        <p id="latest-article" class="archive-meta">Latest</p>
        <Post post={featuredPost} variant="featured" />
    </section>

    {#if archiveGroups.length > 0}
        <div class="space-y-10" aria-labelledby="all-articles">
            <p id="all-articles" class="archive-meta">All articles</p>

            {#each archiveGroups as group}
                <section aria-labelledby={`year-${group.year}`}>
                    <h2
                        id={`year-${group.year}`}
                        class="border-b border-[var(--border)] pb-3 font-mono text-sm font-semibold tracking-[0.12em]"
                    >
                        {group.year}
                    </h2>
                    <div class="divide-y divide-[var(--border)]">
                        {#each group.posts as post}
                            <Post {post} variant="archive" />
                        {/each}
                    </div>
                </section>
            {/each}
        </div>
    {/if}
{:else}
    <section class="py-8" aria-labelledby="empty-archive">
        <h2 id="empty-archive" class="text-xl font-semibold">
            No articles published yet.
        </h2>
        <p class="ui-muted mt-2">Subscribe to hear when the first one lands.</p>
    </section>
{/if}

<Newsletter />
