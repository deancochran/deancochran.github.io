<script lang="ts">
    interface Props {
        compact?: boolean
    }

    let { compact = false }: Props = $props()
</script>

<section class="ui-card p-5 sm:p-6" aria-labelledby="newsletter-title">
    <div
        class={compact
            ? 'space-y-4'
            : 'grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end'}
    >
        <div class="space-y-1">
            <h2
                id="newsletter-title"
                class="!m-0 !border-0 !p-0 font-semibold tracking-tight"
            >
                Stay in the loop
            </h2>
            <p class="ui-muted text-sm leading-6">
                New articles on software engineering and machine learning,
                delivered occasionally.
            </p>
        </div>
        <form
            action="https://buttondown.com/api/emails/embed-subscribe/deancochran"
            method="post"
            target="popupwindow"
            onsubmit={() => {
                window.open('https://buttondown.com/deancochran', 'popupwindow')
            }}
            class="flex flex-col gap-2 min-[480px]:flex-row"
        >
            <label
                class="sr-only"
                for={compact ? 'article-email' : 'home-email'}
                >Email address</label
            >
            <input
                id={compact ? 'article-email' : 'home-email'}
                name="email"
                class="ui-input min-[480px]:w-64"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                required
            />
            <button type="submit" class="ui-button ui-button-primary"
                >Subscribe</button
            >
        </form>
    </div>
</section>
