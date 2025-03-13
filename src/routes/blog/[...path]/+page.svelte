<script lang="ts">
    import { page } from '$app/state'
    import { email_schema } from '$lib/utils/schema'
    import { Avatar } from '@skeletonlabs/skeleton-svelte'
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
    title={data.meta.title}
    description={data.meta.description}
    canonical={page.url.href}
    openGraph={{
        title: data.meta.title,
        description: data.meta.description,
        url: page.url.href,
        type: 'article',
        site_name: 'Dean Cochran',
        images: [
            {
                url: data.meta.image,
            },
        ],
    }}
    twitter={{
        card: 'summary_large_image',
        site: '@deancochran_',
        creator: '@deancochran_',
        title: data.meta.title,
        description: data.meta.description,
        image: data.meta.image,
    }}
/>

<div class="prose dark:prose-invert !max-w-none">
    <header class="flex flex-col gap-4">
        <h1 class="!m-0 py-4"
        style={`view-transition-name: item-title-${data.meta.title};`}>{data.meta.title}</h1>
        <div
            class="flex flex-col items-stretch justify-between align-middle"
        >
            <div
                class="flex flex-row gap-2 items-center align-middle justify-between"
            >
                <div class="flex flex-row gap-2 items-center align-middle justify-start">
                    <a class="btn-icon w-auto h-auto" href="/about">
                        <Avatar name="Dean" src="/images/headshot.webp" classes={"w-12 h-12 !m-0"}/>
                    </a>
                    <div class="flex flex-col items-stretch align-middle">
                        <small>Written by: <a class="hover:underline no-underline underline-offset-1" href="/about">Dean Cochran</a></small>
                        <small>Published: {new Date(data.meta.date).toLocaleDateString()}</small>
                    </div>
                </div>
            </div>
        </div>
        <img
            src={data.meta.image}
            alt={data.meta.title}
            loading="eager"
            class="object-scale-down lg:max-h=[25vh] sm:max-h-[50vh] !m-0"
            style={`view-transition-name: item-image-${data.relativePath};`}
        />
        <p class=" !m-0"
        style={`view-transition-name: item-description-${data.meta.relativePath};`}>
            {data.meta.description}
        </p>
    </header>
    <hr/>

    <data.component />

    <footer class="flex flex-col items-center gap-2 align-middle">
        <form
            action="https://buttondown.com/api/emails/embed-subscribe/deancochran"
            method="post"
            target="popupwindow"
            onsubmit={() => {
                window.open('https://buttondown.com/deancochran', 'popupwindow')
            }}
            class="embeddable-buttondown-form w-full"
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
                        class="btn preset-tonal-surface outline"
                        >Subscribe</button
                    >
                </div>
            </label>
        </form>
        <br />

        <script
            src="https://utteranc.es/client.js"
            data-repo="deancochran/deancochran"
            data-issue-term="pathname"
            data-theme="preferred-color-scheme"
            data-crossorigin="anonymous"
            async
        ></script>
    </footer>
</div>
