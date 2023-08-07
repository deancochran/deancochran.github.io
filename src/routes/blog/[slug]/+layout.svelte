<script lang="ts">
    import type { LayoutData } from './$types';
	import { formatDate } from '$lib/utils/blog/formatting';
    export let data: LayoutData;
</script>

<!-- SEO -->
<!-- <svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head> -->

<article>
  <!-- Title -->
	<hgroup>
		<h1>{data.meta.title}</h1>
		<p>Published at {formatDate(data.meta.date)}</p>
	</hgroup>

  <!-- Tags -->
	<div class="tags">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

    <slot/>
</article>


