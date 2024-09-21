<script lang="ts">
	import { email_schema } from '$lib/utils/schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import Image from '$lib/blogComponents/img.svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;
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

<form
	action="https://buttondown.com/api/emails/embed-subscribe/deancochran"
	method="post"
	target="popupwindow"
	on:submit|preventDefault={() => {
		window.open('https://buttondown.com/deancochran', 'popupwindow');
	}}
	class="embeddable-buttondown-form"
>
	<label for="bd-email" class="label">
		<span class="label-text px-1">Subscribe to my newsletter</span>
		<div class="flex flex-row items-center justify-center gap-4 align-middle">
			<input name="bd-email" class="input" type="email" placeholder="janedoe@example.com" />
			<button type="submit" class="btn preset-filled">Subscribe</button>
		</div>
	</label>
</form>

<br />

<div class="flex h-full w-full flex-col items-center justify-start gap-4 align-middle">
	{#await randomPost()}
		<div
			class="card card-hover flex h-3/4 w-full flex-col justify-between gap-4 border border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
		>
			<div class="placeholder h-1/2 animate-pulse"></div>
			<div class="flex flex-col gap-4 p-4">
				<div class="placeholder animate-pulse p-2"></div>
			</div>
			<article class="flex flex-col gap-4 p-4 ">
				<div class="placeholder animate-pulse"></div>
				<div class="placeholder animate-pulse"></div>
				<div class="placeholder animate-pulse"></div>
				<div class="placeholder animate-pulse"></div>
				<footer class="card-footer flex items-center justify-between gap-4 pt-8">
					<div class="placeholder w-1/5 animate-pulse"></div>
					<button type="button" class="btn preset-filled">
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
			class="card card-hover block overflow-hidden border border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900 active:scale-[1.01]"
		>
			<header class="card-header">
				<Image src={post.image} class="aspect-[21/9] w-full object-cover" alt="banner" />
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
				<button type="button" class="btn preset-filled">
					<span>Read More</span>
					<span>&rarr;</span>
				</button>
			</footer>
		</a>
	{/await}
</div>
