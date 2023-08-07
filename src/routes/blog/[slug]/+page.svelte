<script>
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<br />
<p>This is apart of the page load</p>
<h1>{data.meta.title}</h1>
<!-- Post -->
<div class="prose">
	<svelte:component this={data.content} />
</div>
