<script>
	import { page } from '$app/state'
</script>

<div class="flex h-full w-full flex-col items-center justify-center align-middle">
	<h1 class="h1">{page.status}</h1>
	<span class="inline">{page.error?.message}</span>
	<br />
	<a class="btn preset-tonal-surface" href="/"><span>Go Home</span></a>
</div>
