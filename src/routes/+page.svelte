<script lang="ts">
	import { page } from '$app/state'
	import Post from '$lib/components/Post.svelte'
	import { email_schema } from '$lib/utils/schema'
	import SvelteSeo from 'svelte-seo'
	import { fade } from 'svelte/transition'
	import { superForm } from 'sveltekit-superforms'
	import { zod } from 'sveltekit-superforms/adapters'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
	const { form, enhance, delayed } = superForm(data.form, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(email_schema),
		delayMs: 0,
		timeoutMs: 5000,
	})
</script>

<SvelteSeo
	title="Dean Cochran's Blog"
	description="Dean Cochran's Blog Wesbite"
	canonical={page.url.href}
	openGraph={{
		title: "Dean Cochran's Blog",
		url: page.url.href,
		type: 'article',
		site_name: 'Dean Cochran',
		images: [
			{
				url: '/images/logo.webp',
			},
		],
	}}
	twitter={{
		card: 'summary_large_image',
		site: '@deancochran_',
		creator: '@deancochran_',
		title: "Dean Cochran's Blog",
		image: '/images/logo.webp',
	}}
/>

<!-- Content -->
<div class="flex w-full grow">

	<aside class="transition-all duration-100 sm:w-1/4"></aside>
	{#key data.pathname}

		<main class="flex flex-col w-full gap-4 p-2 transition-all" in:fade={{ duration: 200 }}>
			<ol class="flex justify-start items-center text-xs gap-2">
				{#each data.pathname.split('/').splice(1) as path, i}
					{#if i === data.pathname.split('/').splice(1).length - 1}
						<li class="capitalize">{path}</li>
					{:else}
						<li>
							<a
								class="opacity-60 capitalize hover:underline"
								href={`/${data.pathname.split('/').slice(1, i + 2)}`}
							>
								{path}
							</a>
						</li>
						<li class="opacity-60" aria-hidden="true">&rsaquo;</li>
					{/if}
				{/each}
			</ol>

			<form
				name="newsletter"
				action="https://buttondown.com/api/emails/embed-subscribe/deancochran"
				method="post"
				target="popupwindow"
				onsubmit={() => {
					window.open('https://buttondown.com/deancochran', 'popupwindow')
				}}
				class="embeddable-buttondown-form"
			>
				<label for="bd-email" class="label">
					<span class="label-text px-1">Subscribe to my newsletter</span>
					<div class="flex flex-row items-center justify-center gap-4 align-middle">
						<input name="bd-email" class="input" type="email" placeholder="janedoe@example.com" />
						<button form="newsletter" type="submit" class="btn preset-tonal-surface outline"
							>Subscribe</button
						>
					</div>
				</label>
			</form>

			<br />

			<div class="flex h-full w-full flex-col items-center justify-start gap-4 align-middle">
				<Post post={data.post} />
			</div>
		</main>
	{/key}

	<aside class="transition-all duration-100 sm:w-1/4"></aside>
</div>
