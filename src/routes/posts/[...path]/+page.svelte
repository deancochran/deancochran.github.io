<script lang="ts">
	// eslint-disable-file no-use-before-define
	import { page } from '$app/stores'
	import { img as Image } from '$lib/blogComponents'
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
	title={data.meta.title}
	description={data.meta.description}
	canonical={$page.url.href}
	openGraph={{
		title: data.meta.title,
		description: data.meta.description,
		url:  $page.url.href,
		type: 'website',
		site_name: 'Dean Cochran',
		images: [
			{
				url: data.meta.image
			}
		]
	}}
	twitter={{
		card: 'summary_large_image',
		creator: '@deancochran_',
		title: data.meta.title,
		description: data.meta.description,
		image: data.meta.image
	}}
/>

<div class="flex flex-col gap-8 ">
	<header class="flex flex-col gap-8">
		<h2 class="h2">{data.meta.title}</h2>
		<Image src={data.meta.image} alt={data.meta.title} loading="eager" />
		<div class="flex flex-col gap-4">
			<div class="flex flex-row items-center justify-between gap-2 align-middle">
				<small>{new Date(data.meta.date).toDateString()}</small>
			</div>
			<p>
				{data.meta.description}
			</p>
		</div>
	</header>

	<article class="flex flex-col gap-4">
		<data.component/>
	</article>

	<footer class="card-footer flex flex-col items-center gap-2 align-middle">
		<form
			action="https://buttondown.com/api/emails/embed-subscribe/deancochran"
			method="post"
			target="popupwindow"
			onsubmit={() => {
				window.open('https://buttondown.com/deancochran', 'popupwindow');
			}}
			class="embeddable-buttondown-form w-full"
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

		<script
			src="https://utteranc.es/client.js"
			data-repo="deancochran/deancochran"
			data-issue-term="pathname"
			data-theme="preferred-color-scheme"
			data-crossorigin="anonymous"
			async
		></script>
	</footer>
</div>
