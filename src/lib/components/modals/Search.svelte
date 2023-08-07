<script lang="ts">
	import { getBlogPosts, type Post } from '$lib/utils/blog/posts';
	import { InputChip, LightSwitch, modalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Classes
	const cBase =
		'card bg-surface-100/60 dark:bg-surface-500/30 backdrop-blur-lg overflow-hidden w-full max-w-[800px] shadow-xl mt-8 mb-auto';
	const cHeader = 'bg-surface-300-600-token flex items-center';
	const cSearchInput =
		'bg-transparent border-0 ring-0 focus:ring-0 w-full p-2 m-0 text-lg !rounded-none';
	const cResults = 'overflow-x-auto max-h-[480px] hide-scrollbar';
	const cResultAnchor =
		'!rounded-none justify-between hover:!variant-filled-primary focus:!variant-filled-primary outline-0';
	const cFooter = '';

	// Local
	type List = Array<Post>;
	let searchTerm: string;
	let searchList: string[] = [];
	let resultsCopy: List = [];
	let posts: List = [];

	onMount(async () => {
		const res = await getBlogPosts();
		posts = await res.json();
		resultsCopy = posts;
		const heaederEl = elemDocSearch.querySelector('header');
		if (heaederEl) {
			const inputEl = heaederEl.querySelector('input');
			if (inputEl) inputEl.focus();
		}
	});

	// Elements
	let elemDocSearch: HTMLDivElement;

	function filterList(list: List) {
		return list.filter((post) => {
			const formattedSearchTerm =
				searchTerm.toLowerCase() || '' || searchList.join(' ').toLowerCase() || '';
			// console.log(formattedSearchTerm)
			const res = Object.values(post).join(' ').toLowerCase().includes(formattedSearchTerm);
			return res;
		});
	}

	function onInput(): void {
		let resultsDeepCopy = structuredClone(resultsCopy);
		posts = filterList(resultsDeepCopy);
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (['Enter', 'ArrowDown'].includes(event.code)) {
			const queryFirstAnchorElement = elemDocSearch.querySelector('a');
			if (queryFirstAnchorElement) queryFirstAnchorElement.focus();
		}
	}

	function shortenText(description: string, limit: number) {
		return description.slice(0, limit) + '... ';
	}
</script>

<div bind:this={elemDocSearch} class="modal-search {cBase}">
	<!-- Header -->
	<header id="header" class="modal-search-header {cHeader}">
		<InputChip
			duration={100}
			class={cSearchInput}
			bind:value={searchList}
			bind:input={searchTerm}
			name="chips"
			placeholder="Search..."
			on:input={onInput}
			on:keydown={onKeyDown}
		/>
	</header>
	<!-- Results -->
	{#if posts.length > 0}
		<nav class="list-nav {cResults}" tabindex="-1">
			<!-- {#each posts as post} -->
			<div class="text-xxl font-bold p-4">Blog</div>
			<ul>
				{#each posts as post}
					<li class="text-lg">
						<a
							class={cResultAnchor}
							href={`/blog/${post.slug}`}
							on:click={() => {
								modalStore.close();
							}}
						>
							<div class="grid grid-cols-1 w-full h-full">
								<div class="flex w-full h-full col-span-1 justify-between">
									<div class="flex flex-inline items-center">
										<!-- <i class="fa-regular fa-file" /> -->
										<span class=" w-full h-full pt-1 pr-1	"> <iconify-icon icon="ic:round-newspaper" /></span>
										<span class="flex flex-inline font-bold opacity-75 max-w-full"
											>{shortenText(post.description, 50)}</span
										>
									</div>
									<div class="flex flex-inline items-center text-xs opacity-50">/blog/{post.slug}</div>
								</div>
								
								<div class="w-full h-full col-span-1">

								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
			<!-- {/each} -->
		</nav>
	{:else}
		<div class="p-4">
			<p>No Results found for <code class="code">{searchTerm}</code>.</p>
		</div>
	{/if}
	<!-- Footer -->
	<footer
		class="modal-search-footer flex items-end gap-2 bg-surface-300-600-token p-4 text-xs font-bold"
	>
		<div class="w-full grid grid-cols-1 md:grid-cols-3">
			<div class="col-span-2 hidden md:flex flex-row items-center gap-4">
				<div><kbd class="kbd">Esc</kbd> to close</div>
				<div><kbd class="kbd">Tab</kbd> to navigate</div>
				<div><kbd class="kbd">Enter</kbd> to select</div>
			</div>

			<div
				class="col-span-1 flex flex-row justify-between md:justify-end items-center align-middle gap-4"
			>
				<a href="https://www.buymeacoffee.com/deancochran" target="_blank"
					><img
						src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
						alt="Buy Me A Coffee"
						style="height: 60px !important;width: 217px !important;"
					/></a
				>
				<div class="md:hidden flex items-center align-middle justify-center px-4">
					<LightSwitch />
				</div>
			</div>
		</div>
	</footer>
</div>
