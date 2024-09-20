<script lang="ts">
	import { img as Image } from '$lib/blogComponents';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-col gap-4">
	<header class="flex flex-col gap-4">
		<div>
			<h2 class="h2">{data.meta.title}</h2>
		</div>
		<small class="opacity-60">{new Date(data.meta.date).toDateString()}</small>
		<p class="opacity-60">
			{data.meta.description}
		</p>
		<Image
			src={data.meta.image}
			alt={data.meta.title}
			loading="eager"
		/>
	</header>

	<br />

	<article class="prose flex flex-col gap-4 text-pretty">
		<svelte:component this={data.component} />
	</article>
</div>
