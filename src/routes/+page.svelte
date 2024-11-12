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
		return data.post
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
				url: '/images/logo.webp'
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
		<a
			in:fade={{ duration: 300 }}
			href={'/posts/' + data.post.relativePath}
			class="card card-hover block overflow-hidden border border-surface-200-800 divide-surface-200-800 preset-tonal-surface active:scale-[1.01]"
		>
			<header class="card-header">
				<Image src={data.post.image??'/images/logo.webp'} class="aspect-[21/9] rounded-t-md w-full object-cover" alt="banner" />
			</header>

			<article class="space-y-4 p-4">
				<div>
					<h2 class="h2">{data.post.title}</h2>
				</div>
				<p class="line-clamp-5 opacity-60">
					{data.post.description}
				</p>
			</article>

			<footer class="card-footer flex items-center justify-between gap-4 p-4">
				<small class="opacity-60">{new Date(data.post.date).toDateString()}</small>
				<button type="button" class="btn preset-tonal-surface outline">
					<span>Read More</span>
					<span>&rarr;</span>
				</button>
			</footer>
		</a>
</div>
