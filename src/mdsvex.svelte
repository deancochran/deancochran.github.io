<script module lang="ts">
	import { img } from '$lib/blogComponents'
	export { img }
</script>

<script lang="ts">
	import type { Snippet } from 'svelte'
	interface Props {
		children: Snippet<[]>
	}
	let { children }:Props = $props();
</script>


{@render children?.()}
