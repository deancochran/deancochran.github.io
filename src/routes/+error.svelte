<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col w-full h-full items-center align-middle justify-center">
	<h1 class="h1">{$page.status}</h1>
	<span class="inline">{$page.error?.message}</span>
	<br/>
	<a class="btn preset-filled" href="/"><span>Go Home</span></a>
</div>
