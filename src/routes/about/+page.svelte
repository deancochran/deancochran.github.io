<script>
	import { page } from '$app/stores'
	import Logo from '$lib/assets/Logo.svelte'
	import SvelteSeo from 'svelte-seo'
</script>

<SvelteSeo
	title="About Dean Cochran"
	canonical={$page.url.href}
	openGraph={{
		title: 'About Dean Cochran',
		url: $page.url.href,
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
		title: 'About Dean Cochran',
		image: '/images/logo.webp'
	}}
/>

<div class="flex flex-col gap-4">
	<header class="flex flex-col gap-4">
		<div class="flex flex-row items-center justify-center gap-4 align-middle">
			<Logo class="h-32 w-32" />
			<h2 class="h2 text-center">About</h2>
		</div>
	</header>
	<br />

	<article class="prose flex flex-col gap-4 text-pretty">
		<p>
			Hi, I’m Dean Cochran, a full-stack software engineer with a passion for building innovative
			solutions that solve real-world problems. With a background in data science, machine learning,
			and cloud computing, I thrive at the intersection of technology and creativity. I enjoy
			working on projects that challenge me to think critically and continue evolving my skills.
		</p>

		<p>
			When I’m not coding, you’ll find me outdoors, cycling, running, or taking part in endurance
			sports like triathlons. As a remote software engineer, I value a healthy work-life balance
			that allows me to pursue my passion for nature and adventure while still delivering
			high-quality work. This balance fuels my creativity and keeps me at my best.
		</p>

		<p>
			Thanks for stopping by—feel free to connect or explore my work further! If you enjoyed this
			page or found it helpful, consider donating to support future content <a
				class="anchor"
				href="https://buymeacoffee.com/deancochran">here</a
			>.
		</p>
	</article>
</div>
