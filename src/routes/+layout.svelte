<script>
	import Logo from '$lib/assets/Logo.svelte';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import '../app.css';

	let { data } = $props();

	import { GithubIcon, LucideTwitter, Moon, Sun } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	import BmcLogo from '$lib/assets/bmc-logo.svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let modeState = $state(false); // false = dark mode

	function handleModeChange() {
		modeState = !modeState;
		document.documentElement.classList.toggle('dark');
	}
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
		<h1 class="font-bold">Dean's List</h1>
		{#snippet trail()}
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
			<main class="w-full overflow-hidden p-4" in:fade={{ duration: 800 }}>
				<slot />
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
					<h1 class="font-bold">Dean's List</h1>

					<div class="flex w-full flex-row items-center gap-2">
						<a href="https://github.com/deancochran"><GithubIcon size={20} class="font-light" /></a>
						<a href="https://twitter.com/deancochran_"
							><LucideTwitter size={20} class="font-light" /></a
						>
						<a href="https://buymeacoffee.com/deancochran"> <BmcLogo /></a>
					</div>
				</div>
			</div>
		</footer>
	{/key}
</div>
