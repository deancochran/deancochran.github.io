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

<div class="w-full h-full aign-middle flex flex-row flex-wrap items-center justify-center gap-4">
	{#each data.posts as post}
		<a
			href={'/posts/' + post.relativePath}
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
