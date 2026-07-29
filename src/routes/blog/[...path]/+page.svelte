<script lang="ts">
    import { page } from '$app/state'
    import Newsletter from '$lib/components/Newsletter.svelte'
    import Seo from '$lib/components/Seo.svelte'
    import type { PageData } from './$types'
    interface Props {
        data: PageData
    }

    let { data }: Props = $props()
</script>

<Seo
    title={data.meta.title}
    description={data.meta.description}
    path={page.url.pathname}
    image={data.meta.image}
    type="article"
/>

<article class="prose !max-w-none">
    <header
        class="not-prose mb-10 flex flex-col gap-5 border-b border-[var(--border)] pb-8"
    >
        <h1
            class="page-title max-w-3xl"
            style={`view-transition-name: item-title-${data.relativePath};`}
        >
            {data.meta.title}
        </h1>
        <div class="flex items-center gap-3">
            <a href="/about" aria-label="About Dean Cochran">
                <img
                    src="/images/headshot.webp"
                    alt=""
                    class="h-10 w-10 rounded-full border border-[var(--border)] object-cover"
                />
            </a>
            <div class="text-sm leading-5">
                <a class="font-medium hover:underline" href="/about"
                    >Dean Cochran</a
                >
                <p class="ui-muted">
                    <time datetime={data.meta.date}>
                        {new Date(data.meta.date).toLocaleDateString('en', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                </p>
            </div>
        </div>
        <img
            src={data.meta.image}
            alt={data.meta.title}
            loading="eager"
            class="max-h-[28rem] w-full rounded-[var(--radius)] border border-[var(--border)] object-cover"
            style={`view-transition-name: item-image-${data.relativePath};`}
        />
        <p
            class="ui-muted max-w-2xl text-lg leading-8"
            style={`view-transition-name: item-description-${data.relativePath};`}
        >
            {data.meta.description}
        </p>
    </header>

    <data.component />

    <footer
        class="not-prose mt-12 space-y-8 border-t border-[var(--border)] pt-8"
    >
        <Newsletter compact />
        <script
            src="https://utteranc.es/client.js"
            data-repo="deancochran/deancochran"
            data-issue-term="pathname"
            data-theme="preferred-color-scheme"
            data-crossorigin="anonymous"
            async
        ></script>
    </footer>
</article>
