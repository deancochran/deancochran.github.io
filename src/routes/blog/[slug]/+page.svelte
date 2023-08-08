<script>
	import { page } from '$app/stores';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<!-- Post -->
<div class="prose">
	<svelte:component this={data.content} />
</div>
