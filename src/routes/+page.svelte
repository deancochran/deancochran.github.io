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
</script>

<Seo
    title="Dean Cochran's Blog"
    description="Dean Cochran's personal software engineering and machine learning blog"
    path={page.url.pathname}
    image="/images/logo.webp"
/>

<header class="max-w-2xl space-y-4">
    <p class="ui-muted text-sm font-medium">Software engineering notes</p>
    <h1 class="page-title">
        Practical ideas for building thoughtful software.
    </h1>
    <p class="ui-muted text-base leading-7 sm:text-lg">
        Writing about software engineering, machine learning, cloud systems, and
        the tools behind the work.
    </p>
</header>

<Newsletter />

<section class="space-y-4" aria-labelledby="latest-post">
    <div class="flex items-center justify-between gap-4">
        <h2 id="latest-post" class="text-lg font-semibold tracking-tight">
            Latest post
        </h2>
        <a
            class="ui-muted text-sm font-medium transition-colors hover:text-[var(--foreground)]"
            href="/blog"
        >
            View all
        </a>
    </div>
    {#if data.post}
        <Post post={data.post} variant="featured" />
    {:else}
        <p class="ui-muted text-sm">No published posts yet.</p>
    {/if}
</section>
