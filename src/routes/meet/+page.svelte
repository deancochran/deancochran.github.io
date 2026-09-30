<script lang="ts">
    import { page } from '$app/state'
    import CalendlyEmbed from '$lib/components/CalendlyEmbed.svelte'
    import Seo from '$lib/components/Seo.svelte'
</script>

<Seo
    title="Book a 1:1 with Dean Cochran"
    description="Choose a time for a 30-minute one-on-one meeting with Dean Cochran."
    path={page.url.pathname}
    image="/images/logo.webp"
/>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
    <header class="space-y-3 border-b border-[var(--border)] pb-8">
        <p class="archive-meta">30-minute meeting</p>
        <h1 class="page-title">Book a 1:1</h1>
        <p class="ui-muted max-w-2xl">
            Pick a time that works for you using the calendar below.
        </p>
    </header>

    <CalendlyEmbed />
</div>
