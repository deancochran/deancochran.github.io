<script lang="ts">
	import { getBlogPosts, type Post } from '$lib/utils/blog/posts';
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';
	import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
	import type { S3Config } from 'aws-sdk/clients/connect';
	const BUCKET_NAME  = "deancochran-sveltekit-portfolio";
	const obj_key = "MyObjectKey";
	const AWS_REGION = "us-east-2"; // AWS_REGION like "ap-southeast-1"



	let posts: Array<Post> = []; 
	
	let show_placeholders = false
	let showPosts: boolean = false

	onMount(async () => {
		const config ={
			apiVersion: 'latest',
			BucketName: "deancochran-sveltekit-portfolio",
			BucketPrefix: '',
    		region: 'us-east-2',
			
		}
		show_placeholders = !show_placeholders;
		const client = new S3Client(config)
		const command = new GetObjectCommand({
			Bucket: "deancochran-sveltekit-portfolio",
			Key: "profile.txt",
		});
		try {
			const response = await client.send(command);
			// The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
			console.log(response);
		} catch (err) {
			console.error(err);
		}


	});

	const fetchData = async () => {
		const res = await getBlogPosts()
		posts = await res.json()
		show_placeholders = false
	};
</script>

<div class="w-full h-full grid grid-cols-1 px-4 gap-0">
	<div class=" col-span-1 !h-fit grid grid-cols-1 gap-4">
		<h1 class="text-center text-6xl p-0">
			Hello, my name is <span
				class="relative hover:font-bold hover:font-serif bg-gradient-to-tr from-secondary-500 to-primary-500 bg-clip-text text-transparent box-decoration-clone"
				>Dean</span
			>
		</h1>
		<p class="text-center m-0 p-0">I edit text files for a living, and race bikes sometimes</p>
	</div>
	<div
		class="w-full h-full col-span-1 flex align-middle justify-center no-scrollbar overflow-x-clip"
	>
		<div
			class=" scroll-m-0 scroll-px-1 snap-both snap-mandatory scroll-smooth flex gap-4 overflow-auto py-10"
		>
			{#if show_placeholders}
				{#each Array(3) as _, i}
					<div
						on:introend={fetchData}
						on:outroend={() => {
							showPosts = true;
						}}
						in:blur={{ delay: 100 * i, duration: 1000 }}
						out:blur={{ duration: 1000 }}
						class="placeholder animate-pulse snap-center shrink-0 p-4 w-72 h-56 bg-surface-100 rounded-md shadow-lg drop-shadow-lg"
					/>
				{/each}
			{:else if showPosts}
				{#each posts as post, i}
					<a
						href="/blog/{post.slug}"
						in:blur={{ delay: 100 * i, duration: 1000 }}
						class="snap-center shrink-0 card p-4 w-72 h-56 shadow-lg drop-shadow-lg"
					>
						<header class="card-header">
							{post.title}
						</header>
						<section class="p-4">
							{post.description}
						</section>
						<img src="" />
						<footer class="card-footer">
							{post.date}
						</footer>
					</a>
				{/each}
			{/if}
		</div>
	</div>
</div>
