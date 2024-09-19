<script lang="ts">
	import { h2 as H2, img as Image, p as P } from '$lib/blogComponents';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-col gap-4">
	<header class="flex flex-col gap-4">
		<div>
			<H2 class="h2">{data.meta.title}</H2>
		</div>
		<small class="opacity-60">{new Date(data.meta.date).toDateString()}</small>
		<P class="opacity-60">
			{data.meta.description}
		</P>
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
