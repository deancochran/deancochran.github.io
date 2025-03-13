<script lang="ts">
    import { page } from '$app/state'
    import Post from '$lib/components/Post.svelte'
    import { email_schema } from '$lib/utils/schema'
    import SvelteSeo from 'svelte-seo'
    import { superForm } from 'sveltekit-superforms'
    import { zod } from 'sveltekit-superforms/adapters'
    import type { PageData } from './$types'

    interface Props {
        data: PageData
    }

    let { data }: Props = $props()
    const { form, enhance, delayed } = superForm(data.form, {
        applyAction: true,
        invalidateAll: true,
        resetForm: true,
        validators: zod(email_schema),
        delayMs: 0,
        timeoutMs: 5000,
    })
</script>

<SvelteSeo
    title="Dean Cochran's Blog"
    description="Dean Cochran's Blog Wesbite"
    canonical={page.url.href}
    openGraph={{
        title: "Dean Cochran's Blog",
        url: page.url.href,
        type: 'article',
        site_name: 'Dean Cochran',
        images: [
            {
                url: '/images/logo.webp',
            },
        ],
    }}
    twitter={{
        card: 'summary_large_image',
        site: '@deancochran_',
        creator: '@deancochran_',
        title: "Dean Cochran's Blog",
        image: '/images/logo.webp',
    }}
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
            <button
                type="submit"
                class="btn preset-tonal-surface outline">Subscribe</button
            >
        </div>
    </label>
</form>

<br />

<div
    class="flex h-full w-full flex-col items-center justify-start gap-4 align-middle"
>
    <Post post={data.post} />
</div>
