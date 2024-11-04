<script lang="ts">
	import { page } from '$app/stores'
	import Image from '$lib/blogComponents/img.svelte'
	import { email_schema } from '$lib/utils/schema'
	import SvelteSeo from 'svelte-seo'
	import { fade } from 'svelte/transition'
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
	async function randomPost(): Promise<BlogPost & { relativePath: string }> {
		return data.posts[Math.floor(Math.random() * data.posts.length)];
	}
</script>

<SvelteSeo
	title="Dean Cochran's Blog"
	description="Dean Cochran's Blog Wesbite"
	canonical={$page.url.href}
	openGraph={{
		title: "Dean Cochran's Blog",
		url: $page.url.href,
		type: 'website',
		site_name: 'Dean Cochran',
		images: [
			{
				url: '/images/logo..webpp'
			}
		]
	}}
	twitter={{
		card: 'summary_large_image',
		creator: '@deancochran_',
		title: "Dean Cochran's Blog",
		image: '/images/logo.webp'
	}}
/>

<form
	action="https://buttondown.com/api/emails/embed-subscribe/deancochran"
	method="post"
	target="popupwindow"
	onsubmit={() => {
		window.open('https://buttondown.com/deancochran', 'popupwindow');
	}}
	class="embeddable-buttondown-form"
>
	<label for="bd-email" class="label">
		<span class="label-text px-1">Subscribe to my newsletter</span>
		<div class="flex flex-row items-center justify-center gap-4 align-middle">
			<input name="bd-email" class="input" type="email" placeholder="janedoe@example.com" />
			<button type="submit" class="btn preset-tonal-surface outline">Subscribe</button>
		</div>
	</label>
</form>

<br />

<div class="flex h-full w-full flex-col items-center justify-start gap-4 align-middle">
	{#await randomPost()}
		<div
			class="card card-hover flex h-3/4 w-full flex-col justify-between gap-4 border"
		>
			<div class="placeholder h-1/2 animate-pulse"></div>
			<div class="flex flex-col gap-4 p-4">
				<div class="placeholder animate-pulse p-2"></div>
			</div>
			<article class="flex flex-col gap-4 p-4">
				<div class="placeholder animate-pulse"></div>
				<div class="placeholder animate-pulse"></div>
				<div class="placeholder animate-pulse"></div>
				<div class="placeholder animate-pulse"></div>
				<footer class="card-footer flex items-center justify-between gap-4 pt-8">
					<div class="placeholder w-1/5 animate-pulse"></div>
					<button type="button" class="btn preset-tonal-surface outline">
						<span>Read More</span>
						<span>&rarr;</span>
					</button>
				</footer>
			</article>
		</div>
	{:then post}
		<a
			in:fade={{ duration: 300 }}
			href={'/posts/' + post.relativePath}
			class="card card-hover block overflow-hidden border border-surface-200-800 divide-surface-200-800 preset-tonal-surface active:scale-[1.01]"
		>
			<header class="card-header">
				<Image src={post.image??'/images/logo.webp'} class="aspect-[21/9] rounded-t-md w-full object-cover" alt="banner" />
			</header>

			<article class="space-y-4 p-4">
				<div>
					<h2 class="h2">{post.title}</h2>
				</div>
				<p class="line-clamp-5 opacity-60">
					{post.description}
				</p>
			</article>

			<footer class="card-footer flex items-center justify-between gap-4 p-4">
				<small class="opacity-60">{new Date(post.date).toDateString()}</small>
				<button type="button" class="btn preset-tonal-surface outline">
					<span>Read More</span>
					<span>&rarr;</span>
				</button>
			</footer>
		</a>
	{/await}
</div>
