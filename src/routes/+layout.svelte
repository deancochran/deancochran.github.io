<script lang="ts">
	import Logo from '$lib/assets/Logo.svelte'
	import { AppBar } from '@skeletonlabs/skeleton-svelte'
	import '../app.css'

	import { GithubIcon, Linkedin, LucideTwitter, Moon, Rss, Sun } from 'lucide-svelte'
	import { fade } from 'svelte/transition'

	import BmcLogo from '$lib/assets/bmc-logo.svelte'
	import { Switch } from '@skeletonlabs/skeleton-svelte'
	import { onMount } from 'svelte'
	let { data, children } = $props();
	
	let modeState = $state(false); // false = dark mode

	function handleModeChange() {
		modeState = !modeState;
		document.documentElement.classList.toggle('dark');
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
		trailClasses="flex items-center align-middle justify-between"
		centerClasses="flex items-center align-middle justify-between"
		classes="sticky top-0 z-10 p-4"
	>
		{#snippet lead()}
			<a class="transition-all duration-100 hover:scale-110" href="/"><Logo class="h-12 w-12" /></a>
		{/snippet}
		<h6 class="h6">Dean's Spooky List</h6>
		{#snippet trail()}
			<a href="/about">About</a>
			<a href="/posts">Blog</a>
			<Switch
				name="mode"
				controlActive="bg-surface-200"
				bind:checked={modeState}
				onCheckedChange={handleModeChange}
			>
				{#snippet inactiveChild()}<Moon size="14" />{/snippet}
				{#snippet activeChild()}<Sun size="14" />{/snippet}
			</Switch>
		{/snippet}
	</AppBar>

	<!-- Content -->
	<div class="flex w-full grow">
		<!-- Sidebar (Left) -->
		<aside class="transition-all duration-100 sm:w-1/6 md:w-1/4 lg:w-1/2"></aside>
		{#key data.pathname}
			<!-- Main -->
			<main class="flex flex-grow flex-col w-full overflow-hidden p-4" in:fade={{ duration: 800 }}>
				{@render children?.()}
			</main>
		{/key}
		<!-- Sidebar (Right) -->
		<aside class="transition-all duration-100 sm:w-1/6 md:w-1/4 lg:w-1/2"></aside>
	</div>

	{#key data.pathname}
		<!-- Footer -->
		<footer
			in:fade={{ duration: 1000 }}
			class="flex w-full items-center justify-between p-4 align-middle"
		>
			<div class="flex w-full flex-row items-center gap-4">
				<a class="transition-all duration-100 hover:scale-110" href="/">
					<Logo class="h-12 w-12" /></a
				>
				<div class="flex flex-col">
					<h6 class="h6">Dean's Spooky List</h6>

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
