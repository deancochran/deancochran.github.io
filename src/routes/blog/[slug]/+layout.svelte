
<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	$page.data.meta
	
</script>


<!-- SEO -->
<svelte:head>
	<title>{$page.data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={$page.data.meta.title} />
</svelte:head>

<!-- <article> -->
  <!-- Title -->
	<!-- <hgroup>
		<h1>{data.meta.title}</h1>
		<p>Published at {formatDate(data.meta.date)}</p>
	</hgroup> -->

  <!-- Tags -->
	<div class="tags">
		{#each $page.data.meta.categories as category}
			<span class="chip variant-filled mx-1">{category}</span>
		{/each}
	</div>

    <slot/>
<!-- </article> -->


