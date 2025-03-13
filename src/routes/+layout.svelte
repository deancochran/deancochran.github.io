<script lang="ts">
	import { onNavigate } from '$app/navigation'
	import BmcLogo from '$lib/assets/bmc-logo.svelte'
	import Logo from '$lib/assets/Logo.svelte'
	import { AppBar } from '@skeletonlabs/skeleton-svelte'
	import { GithubIcon, Linkedin, LucideTwitter, Rss, SunMoon } from 'lucide-svelte'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import '../app.css'
	let { data, children } = $props()

	onNavigate((navigation) => {
		if (!document.startViewTransition) return

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	})

	// Handle the change in state when toggled.
	function handleModeChange() {
		document.documentElement.classList.toggle('dark')
	}

	// Detect service worker updates
	// Identify the service worker and reload the page when a new version is available
	async function detectServiceWorkerUpdates() {
		const registration = await navigator.serviceWorker.ready
		registration.addEventListener('updatefound', () => {
			const serviceWorker = registration.installing
			if (!serviceWorker) return

			serviceWorker.addEventListener('statechange', () => {
				if (serviceWorker.state === 'installed') {
					if (confirm('New content available, reload to see it?')) {
						serviceWorker.postMessage({ type: 'SKIP_WAITING' })
						window.location.reload()
					}
				}
			})
		})
	}
	onMount(() => {
		detectServiceWorkerUpdates()
	})
</script>

<!-- Header -->
<div class="flex h-full min-h-screen w-full flex-col items-start justify-between align-middle">
	<AppBar
		trailClasses="flex items-center align-middle justify-between gap-2"
		centerClasses="flex items-center align-middle justify-between"
		classes="sticky top-0 z-10 p-2"
	>
		{#snippet lead()}
			<a href="/"><Logo class="h-12 w-12" /></a>
		{/snippet}
		<h6 class="h6">Dean's List</h6>
		{#snippet trail()}
			<a href="/about">About</a>
			<a href="/blog">Blog</a>

			<button class="btn-icon hover:preset-tonal" name="mode" onclick={(e) => handleModeChange()}>
				<SunMoon size="20" />
			</button>
		{/snippet}
	</AppBar>

	<!-- Content -->
	<div class="flex w-full grow">
		
        
    <aside class="transition-all duration-100 sm:w-1/4 lg:w-1/2"></aside>
    {#key data.pathname}
        <!-- Main -->
        <main class="flex flex-col w-full gap-4 p-4" in:fade={{duration: 200}}>
            <ol class="flex justify-start items-center text-xs gap-2">
                {#each data.pathname.split('/').splice(1) as path, i}
					{#if data.pathname.split('/').length > 2}
					{#if i === data.pathname.split('/').splice(1).length - 1}
					<li class="capitalize">{path}</li>
				{:else}
					<li>
						<a
							class="opacity-60 capitalize hover:underline"
							href={`/${data.pathname.split('/').slice(1, i + 2)}`}
						>
							{path}
						</a>
					</li>
					<li class="opacity-60" aria-hidden="true">&rsaquo;</li>
				{/if}
					{/if}
                    
                {/each}
            </ol>
            {@render children?.()}
        </main>
        {/key}
        <!-- Sidebar (Right) -->
        <aside class="transition-all duration-100 sm:w-1/4 lg:w-1/2"></aside>
	</div>
	

	{#key data.pathname}
		<!-- Footer -->
		<footer
			in:fade={{duration: 200, delay:200}}
			class="flex w-full items-center justify-between p-4 align-middle"
		>
			<div class="flex w-full flex-row items-center gap-4">
				<a class="transition-all duration-100 hover:scale-110" href="/">
					<Logo class="h-12 w-12" /></a
				>
				<div class="flex flex-col">
					<h6 class="h6">Dean's List</h6>

					<div class="flex w-full flex-row items-center gap-2">
						<a href="https://www.linkedin.com/in/dean-cochran/"><Linkedin size={20} /></a>
						<a href="https://github.com/deancochran"><GithubIcon size={20} class="font-light" /></a>
						<a href="https://twitter.com/deancochran_"
							><LucideTwitter size={20} class="font-light" /></a
						>
						<a href="https://buymeacoffee.com/deancochran"> <BmcLogo /></a>
						<a href="/rss.xml"> <Rss /></a>
					</div>
				</div>
			</div>
		</footer>
	{/key}
</div>