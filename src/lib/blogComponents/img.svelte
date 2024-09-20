<script lang="ts">
	export let src: string;
	export let alt: string;
	src.replace('/static', '');
</script>

<img {src} {alt} class="max-h-[50vh] object-scale-down" loading="eager" {...$$restProps} />
