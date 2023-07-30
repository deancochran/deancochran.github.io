<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file

	import { Toast } from '@skeletonlabs/skeleton';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/AppLayout/Navigation.svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import type { ComponentEvents } from 'svelte';

	function scrollHandler(event: ComponentEvents<AppShell>['scroll']) {
		console.log(event.currentTarget.scrollTop);
	}
</script>
<Toast/>


<AppShell on:scroll={scrollHandler} regionpage="relative" slotpageheader="sticky top-0 z-10">
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<h1 class="h1 font-bold text-xxl">d.</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<Navigation />
			</svelte:fragment>
			<!-- <svelte:fragment slot="headline"></svelte:fragment> -->
		</AppBar>
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>

</AppShell>
