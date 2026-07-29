<script lang="ts">
    import { onNavigate } from '$app/navigation'
    import BmcLogo from '$lib/assets/bmc-logo.svelte'
    import Logo from '$lib/assets/Logo.svelte'
    import {
        GithubIcon,
        Linkedin,
        LucideTwitter,
        Moon,
        Rss,
        Sun,
    } from 'lucide-svelte'
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import '../app.css'

    let { data, children } = $props()
    let dark = $state(false)

    onNavigate((navigation) => {
        if (!document.startViewTransition) return

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete
            })
        })
    })

    function handleModeChange() {
        dark = !dark
        document.documentElement.classList.toggle('dark', dark)
        localStorage.setItem('theme', dark ? 'dark' : 'light')
        document
            .querySelector<HTMLIFrameElement>('.utterances-frame')
            ?.contentWindow?.postMessage(
                {
                    type: 'set-theme',
                    theme: dark ? 'github-dark' : 'github-light',
                },
                'https://utteranc.es'
            )
    }

    async function detectServiceWorkerUpdates() {
        const registration = await navigator.serviceWorker.ready
        registration.addEventListener('updatefound', () => {
            const serviceWorker = registration.installing
            if (!serviceWorker) return

            serviceWorker.addEventListener('statechange', () => {
                if (
                    serviceWorker.state === 'installed' &&
                    confirm('New content available, reload to see it?')
                ) {
                    serviceWorker.postMessage({ type: 'SKIP_WAITING' })
                    window.location.reload()
                }
            })
        })
    }

    onMount(() => {
        dark = document.documentElement.classList.contains('dark')
        detectServiceWorkerUpdates()
    })
</script>

<div
    class="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]"
>
    <header
        class="sticky top-0 z-20 w-full border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur"
    >
        <div
            class="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5 sm:px-8 lg:px-10"
        >
            <a
                href="/"
                class="flex items-center gap-2 font-semibold tracking-tight"
                aria-label="Dean's List home"
            >
                <Logo class="h-7 w-7" />
                <span class="hidden sm:inline">Dean's List</span>
            </a>

            <nav
                class="ml-auto flex items-center gap-1"
                aria-label="Main navigation"
            >
                <a
                    class:nav-active={data.pathname === '/about'}
                    class="ui-button border-transparent shadow-none"
                    href="/about"
                    aria-current={data.pathname === '/about'
                        ? 'page'
                        : undefined}>About</a
                >
                <a
                    class:nav-active={data.pathname.startsWith('/blog')}
                    class="ui-button border-transparent shadow-none"
                    href="/blog"
                    aria-current={data.pathname.startsWith('/blog')
                        ? 'page'
                        : undefined}>Blog</a
                >
                <button
                    class="ui-button ui-icon-button ml-1"
                    type="button"
                    aria-label={dark ? 'Use light theme' : 'Use dark theme'}
                    title={dark ? 'Use light theme' : 'Use dark theme'}
                    aria-pressed={dark}
                    onclick={handleModeChange}
                >
                    {#if dark}
                        <Sun size={16} />
                    {:else}
                        <Moon size={16} />
                    {/if}
                </button>
            </nav>
        </div>
    </header>

    <div
        class="mx-auto flex w-full max-w-6xl grow flex-col px-5 sm:px-8 lg:px-10"
    >
        {#key data.pathname}
            <main
                class="flex grow flex-col gap-14 py-10 sm:gap-20 sm:py-16"
                in:fade={{ duration: 150 }}
            >
                {#if data.pathname.split('/').filter(Boolean).length > 1}
                    <nav aria-label="Breadcrumb">
                        <ol
                            class="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
                        >
                            {#each data.pathname
                                .split('/')
                                .filter(Boolean) as path, i}
                                {#if i === data.pathname
                                        .split('/')
                                        .filter(Boolean).length - 1}
                                    <li
                                        class="truncate text-[var(--foreground)] capitalize"
                                        aria-current="page"
                                    >
                                        {path.replaceAll('-', ' ')}
                                    </li>
                                {:else}
                                    <li>
                                        <a
                                            class="transition-colors hover:text-[var(--foreground)]"
                                            href={`/${data.pathname
                                                .split('/')
                                                .filter(Boolean)
                                                .slice(0, i + 1)
                                                .join('/')}`}
                                        >
                                            {path.replaceAll('-', ' ')}
                                        </a>
                                    </li>
                                    <li aria-hidden="true">/</li>
                                {/if}
                            {/each}
                        </ol>
                    </nav>
                {/if}
                {@render children?.()}
            </main>
        {/key}
    </div>

    <footer class="border-t border-[var(--border)]">
        <div
            class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"
        >
            <div class="flex items-center gap-2 text-sm font-medium">
                <Logo class="h-6 w-6" />
                <span>Dean's List</span>
            </div>
            <nav class="flex items-center gap-1" aria-label="Social links">
                <a
                    class="ui-button ui-icon-button border-transparent shadow-none"
                    href="https://www.linkedin.com/in/dean-cochran/"
                    aria-label="LinkedIn"><Linkedin size={16} /></a
                >
                <a
                    class="ui-button ui-icon-button border-transparent shadow-none"
                    href="https://github.com/deancochran"
                    aria-label="GitHub"><GithubIcon size={16} /></a
                >
                <a
                    class="ui-button ui-icon-button border-transparent shadow-none"
                    href="https://twitter.com/deancochran_"
                    aria-label="X (formerly Twitter)"
                    ><LucideTwitter size={16} /></a
                >
                <a
                    class="ui-button ui-icon-button border-transparent shadow-none"
                    href="https://buymeacoffee.com/deancochran"
                    aria-label="Buy me a coffee"><BmcLogo /></a
                >
                <a
                    class="ui-button ui-icon-button border-transparent shadow-none"
                    href="/rss.xml"
                    aria-label="RSS feed"><Rss size={16} /></a
                >
            </nav>
        </div>
    </footer>
</div>
