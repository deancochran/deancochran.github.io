<script lang="ts">
	import { email_schema } from '$lib/utils/schema';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	export let data: PageData;
	const imgSrc =
		'https://images.unsplash.com/photo-1463171515643-952cee54d42a?q=80&w=450&h=190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	const { form, enhance, delayed } = superForm(data.form, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(email_schema),
		delayMs: 0,
		timeoutMs: 5000
	});
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

<div class="flex flex-col items-center justify-center gap-4">
	{#each data.posts as post}
		<a
			href={post.relativePath}
			class="card card-hover block overflow-hidden border border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900 active:scale-[1.01]"
		>
			<header class="card-header">
				<img src={imgSrc} class="aspect-[21/9] w-full object-fill" alt="banner" />
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
	{/each}
</div>
