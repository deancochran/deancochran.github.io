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
    title="Dean Cochran's Blog"
    description="Dean Cochran's personal software engineering and machine learning blog"
    path={page.url.pathname}
    image="/images/logo.webp"
/>

<form
    action="https://buttondown.com/api/emails/embed-subscribe/deancochran"
    method="POST"
    target="popupwindow"
    onsubmit={() => {
        window.open('https://buttondown.com/deancochran', 'popupwindow')
    }}
    class="embeddable-buttondown-form"
>
    <label for="bd-email" class="label">
        <span class="label-text px-1">Subscribe to my newsletter</span>
        <div
            class="flex flex-row items-center justify-center gap-4 align-middle"
        >
            <input
                name="bd-email"
                class="input"
                type="email"
                placeholder="janedoe@example.com"
            />
            <button type="submit" class="btn preset-tonal-surface outline"
                >Subscribe</button
            >
        </div>
    </label>
</form>

<br />

<div
    class="flex h-full w-full flex-col items-center justify-start gap-4 align-middle"
>
    {#if data.post}
        <Post post={data.post} />
    {:else}
        <p>No published posts yet.</p>
    {/if}
</div>
