<script lang="ts">
    import { page } from '$app/state'
    import Post from '$lib/components/Post.svelte'
    import Seo from '$lib/components/Seo.svelte'
    import type { PageData } from './$types'

    interface Props {
        data: PageData
    }

    let { data }: Props = $props()
</script>

<Seo
    title="Dean Cochran's Blog Posts"
    description="Software engineering, machine learning, and development environment articles by Dean Cochran"
    path={page.url.pathname}
    image="/images/logo.webp"
/>

<h1 class="h1">Posts</h1>

<div
    class="aign-middle flex h-full w-full flex-row flex-wrap items-start justify-center gap-4"
>
    {#each data.posts as post}
        <Post {post} />
    {:else}
        <p>No published posts yet.</p>
    {/each}
</div>
