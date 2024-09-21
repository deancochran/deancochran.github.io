<script lang="ts">
	import { img as Image } from '$lib/blogComponents';
	import type { PageData } from './$types';
	import { Share2 } from 'lucide-svelte';
	export let data: PageData;
</script>

<div class="flex flex-col gap-4">
	<header class="flex flex-col gap-4">
		<h2 class="h2">{data.meta.title}</h2>
		<Image src={data.meta.image} alt={data.meta.title} loading="eager" />
		<div class="flex flex-col gap-2">
			<div class="flex flex-row items-center justify-between gap-2 align-middle">
				<small class="opacity-60">{new Date(data.meta.date).toDateString()}</small>
				<!-- <button type="button" class="btn btn-icon preset-filled">
					<Share2 />
				</button> -->
			</div>
			<p class="opacity-60">
				{data.meta.description}
			</p>
		</div>
	</header>

	<br />

	<article class="prose flex flex-col gap-4 text-pretty">
		<svelte:component this={data.component} />
	</article>

	<br />

	<footer class="card-footer flex flex-col items-center gap-4 align-middle">
		<div class="flex flex-row flex-wrap items-center justify-between gap-2 align-middle">
			<h5 class="h5 w-full">{data.meta.title}</h5>
			<div class="flex grow flex-row flex-nowrap items-center justify-between gap-2 align-middle">
				<small class="opacity-60">{new Date(data.meta.date).toDateString()}</small>
				<!-- <button type="button" class="btn btn-icon preset-filled">
					<Share2 />
				</button> -->
			</div>
		</div>
		<script
			src="https://utteranc.es/client.js"
			repo="deancochran/deancochran"
			issue-term="pathname"
			theme="preferred-color-scheme"
			crossorigin="anonymous"
			async
		>
		</script>
	</footer>
</div>
