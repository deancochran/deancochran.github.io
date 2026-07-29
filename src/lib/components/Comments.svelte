<script lang="ts">
    import { onMount } from 'svelte'

    let container: HTMLDivElement

    function getTheme() {
        return document.documentElement.classList.contains('dark')
            ? 'github-dark'
            : 'github-light'
    }

    onMount(() => {
        let frame: HTMLIFrameElement | null = null

        function syncTheme() {
            frame?.contentWindow?.postMessage(
                { type: 'set-theme', theme: getTheme() },
                'https://utteranc.es'
            )
        }

        function connectFrame() {
            const nextFrame =
                container.querySelector<HTMLIFrameElement>('.utterances-frame')
            if (!nextFrame || nextFrame === frame) return

            frame?.removeEventListener('load', syncTheme)
            frame = nextFrame
            frame.addEventListener('load', syncTheme)
            syncTheme()
        }

        const observer = new MutationObserver(() => {
            connectFrame()
            syncTheme()
        })
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })
        observer.observe(container, { childList: true, subtree: true })

        const script = document.createElement('script')
        script.src = 'https://utteranc.es/client.js'
        script.async = true
        script.crossOrigin = 'anonymous'
        script.dataset.repo = 'deancochran/deancochran'
        script.dataset.issueTerm = 'pathname'
        script.dataset.theme = getTheme()
        container.appendChild(script)

        return () => {
            observer.disconnect()
            frame?.removeEventListener('load', syncTheme)
        }
    })
</script>

<div class="w-full" bind:this={container}></div>
