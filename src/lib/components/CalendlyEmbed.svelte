<script lang="ts" module>
    const schedulingUrl = 'https://calendly.com/charles-dean-cochran/30min'
    const scriptId = 'calendly-widget-script'
    const scriptTimeout = 15_000

    type CalendlyApi = {
        initInlineWidget: (options: {
            url: string
            parentElement: HTMLElement
            resize: boolean
            utm?: Record<string, string>
        }) => void
    }

    let scriptPromise: Promise<void> | undefined

    function calendlyApi() {
        return (window as typeof window & { Calendly?: CalendlyApi }).Calendly
    }

    function loadWidget(): Promise<void> {
        if (calendlyApi()) return Promise.resolve()
        if (scriptPromise) return scriptPromise

        const pendingScript = new Promise<void>((resolve, reject) => {
            const existingScript = document.getElementById(
                scriptId
            ) as HTMLScriptElement | null
            const script = existingScript ?? document.createElement('script')
            let timeout: ReturnType<typeof setTimeout>

            const cleanup = () => {
                clearTimeout(timeout)
                script.removeEventListener('load', handleLoad)
                script.removeEventListener('error', handleError)
            }

            const fail = (message: string) => {
                cleanup()
                script.remove()
                reject(new Error(message))
            }

            const handleLoad = () => {
                cleanup()

                if (calendlyApi()) {
                    resolve()
                } else {
                    script.remove()
                    reject(new Error('Calendly did not initialize.'))
                }
            }

            const handleError = () => fail('Calendly could not be loaded.')

            script.addEventListener('load', handleLoad)
            script.addEventListener('error', handleError)
            timeout = setTimeout(
                () => fail('Calendly took too long to load.'),
                scriptTimeout
            )

            if (!existingScript) {
                script.id = scriptId
                script.src =
                    'https://assets.calendly.com/assets/external/widget.js'
                script.async = true
                document.head.append(script)
            }
        })

        scriptPromise = pendingScript
        return pendingScript.catch((error) => {
            if (scriptPromise === pendingScript) scriptPromise = undefined
            throw error
        })
    }
</script>

<script lang="ts">
    import { onMount } from 'svelte'

    let bookingContainer: HTMLDivElement
    let status = $state<'loading' | 'ready' | 'error'>('loading')

    function getUtmParameters() {
        const query = new URLSearchParams(window.location.search)
        const fields = {
            utmCampaign: 'utm_campaign',
            utmContent: 'utm_content',
            utmMedium: 'utm_medium',
            utmSource: 'utm_source',
            utmTerm: 'utm_term',
        }

        return Object.fromEntries(
            Object.entries(fields).flatMap(([key, queryKey]) => {
                const value = query.get(queryKey)
                return value ? [[key, value]] : []
            })
        )
    }

    onMount(() => {
        let active = true

        loadWidget()
            .then(() => {
                if (!active || !bookingContainer) return

                const api = calendlyApi()
                if (!api) throw new Error('Calendly did not initialize.')

                bookingContainer.replaceChildren()
                api.initInlineWidget({
                    url: schedulingUrl,
                    parentElement: bookingContainer,
                    resize: true,
                    utm: getUtmParameters(),
                })
                status = 'ready'
            })
            .catch(() => {
                if (active) status = 'error'
            })

        return () => {
            active = false
            bookingContainer?.replaceChildren()
        }
    })
</script>

<div class="ui-card overflow-hidden">
    <div class="border-b border-[var(--border)] px-5 py-4 text-sm">
        <a
            class="font-medium underline underline-offset-4"
            href={schedulingUrl}
            target="_blank"
            rel="noreferrer">Open the booking calendar in a new tab</a
        >
        <span class="ui-muted"> if it does not appear below.</span>
    </div>

    {#if status === 'loading'}
        <p
            class="px-5 pt-5 text-sm text-[var(--muted-foreground)]"
            role="status"
        >
            Loading the booking calendar…
        </p>
    {:else if status === 'error'}
        <p
            class="px-5 pt-5 text-sm text-[var(--muted-foreground)]"
            role="alert"
        >
            The calendar could not load. You can still book using the link
            above.
        </p>
    {/if}

    <div
        bind:this={bookingContainer}
        class={`calendly-embed w-full ${status === 'error' ? '' : 'min-h-[700px]'}`}
        aria-label="Book a 30 minute meeting"
    ></div>
</div>

<noscript>
    <p class="ui-card p-5 text-sm">
        JavaScript is required to show the calendar here. <a
            class="font-medium underline underline-offset-4"
            href={schedulingUrl}>Open the booking calendar</a
        >.
    </p>
</noscript>

<style>
    .calendly-embed :global(iframe) {
        max-width: 100%;
    }
</style>
