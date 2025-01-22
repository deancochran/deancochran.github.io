<script lang="ts">
	import { page } from '$app/stores'
	import Post from '$lib/components/Post.svelte'
	import { email_schema } from '$lib/utils/schema'
	import SvelteSeo from 'svelte-seo'
	import { superForm } from 'sveltekit-superforms'
	import { zod } from 'sveltekit-superforms/adapters'
	import type { PageData } from './$types'

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { form, enhance, delayed } = superForm(data.form, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(email_schema),
		delayMs: 0,
		timeoutMs: 5000
	});
</script>

<SvelteSeo
	title="Dean Cochran's Blog Posts"
	description="Dean Cochran's Blog Posts"
	canonical={$page.url.href}
	themeColor= "#000000"
	openGraph={{
		title: "Dean Cochran's Posts",
		url:  $page.url.href,
		type: 'article',
		site_name: 'Dean Cochran',
		images: [
			{
				url: '/images/logo.webp'
			}
		]
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@deancochran_',
		creator: '@deancochran_',
		title: "Dean Cochran's Posts",
		image: '/images/logo.webp',
		
	}}
/>

<h1 class="h1">Posts</h1>

<div class="aign-middle flex h-full w-full flex-row flex-wrap items-start justify-center gap-4">
	{#each data.posts as post}
		<Post post={post} />
	{/each}
</div>
