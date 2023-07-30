<script lang="ts">
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	const t:ToastSettings = {
		message: 'Welcome to my porfolio!',
		background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white',
		// Add your custom classes here:
		classes: 'border-4 border-purple-500',
                timeout: 2000
	};

	onMount(async () => {
		toastStore.trigger(t);
	});
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li>
				<code class="code">/src/routes/+layout.svelte</code> - barebones layout, the CSS import order
				is critical!
			</li>
			<li>
				<code class="code">/src/app.postcss</code> - minimal css to make the page full screen, may not
				be relevant for your project
			</li>
			<li>
				<code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
			</li>
		</ul>
	</div>
</div>
