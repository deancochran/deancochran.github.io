<script lang="ts">
	import { page } from '$app/stores';
	import Image from '$lib/blogComponents/img.svelte';
	import { email_schema } from '$lib/utils/schema';
	import SvelteSeo from 'svelte-seo';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	export let data: PageData;
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
	title="Dean Cochran's Posts"
	canonical={$page.url.href}
	openGraph={{
		title: "Dean Cochran's Posts",
		url:  $page.url.href,
		type: 'website',
		site_name: 'Dean Cochran',
		images: [
			{
				url: '/images/logo.png'
			}
		]
	}}
	twitter={{
		card: 'summary_large_image',
		creator: '@deancochran_',
		title: "Dean Cochran's Posts",
		image: '/images/logo.png'
	}}
/>

<h1 class="h1">Posts</h1>

<div class="aign-middle flex h-full w-full flex-row flex-wrap items-start justify-center gap-4">
	{#each data.posts as post}
		<a
			href={'/posts/' + post.relativePath}
			class="card card-hover h-fit block overflow-hidden border border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900 active:scale-[1.01]"
		>
			<header class="card-header">
				<Image
					src={post.image ?? '/images/logo.png'}
					class="aspect-[21/9] w-full object-cover"
					alt="banner"
				/>
			</header>

			<div class="flex w-full h-full flex-col items-center justify-between gap-2 align-middle">
				<article class="w-full space-y-4 p-4">
						<h2 class="h2">{post.title}</h2>
					<p class="line-clamp-3 opacity-60">
						{post.description}
					</p>
				</article>
	
				<footer class="card-footer flex w-full items-center justify-between gap-4 p-4">
					<small class="opacity-60">{new Date(post.date).toDateString()}</small>
					<button type="button" class="btn preset-filled">
						<span>Read More</span>
						<span>&rarr;</span>
					</button>
				</footer>
			</div>
		</a>
	{/each}
</div>
