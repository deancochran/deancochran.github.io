<script lang="ts">
	import { getImgPath, shortenText } from '$lib/utils/blog/formatting';
	import { getBlogPosts, type Post } from '$lib/utils/blog/posts';
	import { blur } from 'svelte/transition';
	import { onMount } from 'svelte';




	let posts: Array<Post> = []; 
	
	let show_placeholders = false
	let showPosts: boolean = false

	const fetchData = async () => {
		const res = await getBlogPosts()
		posts = await res.json()
		show_placeholders = false
	};
	
	onMount(async ()=>{
		show_placeholders=true
	})
</script>

<div class="w-full h-full grid grid-cols-1 px-4 gap-0">
	<div class=" col-span-1 !h-fit grid grid-cols-1 gap-4 p-[2vh]">
		<h1 class="text-center text-5xl p-0">
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
			class=" w-full h-full flex justify-center scroll-m-0 scroll-px-1 snap-both snap-mandatory scroll-smooth	 gap-4 overflow-auto"
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
						class="placeholder animate-pulse snap-center shrink-0 p-0 w-[55vw] h-[40vh] bg-surface-100 rounded-md shadow-lg drop-shadow-lg "
					/>
				{/each}
			{:else if showPosts}
			{#each posts as post, i}
					<a
						href="/blog/{post.slug}"
						in:blur={{ delay: 100 * i, duration: 1000 }}
						class="relative overflow-hidden snap-center shrink-0 card p-0 w-[55vw] h-[40vh] md:w-[30vw] md:h-[45vh] shadow-lg bg-cover bg-local"
						style="background-image: url({getImgPath(post.img_url)})"	

					>
						<div class="grid grid-rows-4 gap-0 h-full w-full overflow-hidden backdrop-filter backdrop-brightness-50 hover:backdrop-blur">
							<header class="row-span-1 w-full h-24 card-header overflow-hidden">
								<h1 class="text-3xl font-extrabold text-surface-100 text-shadow">
									{post.title}
								</h1>
							</header>
							<section class="row-span-2 w-full mt-1 p-4 ">
								<h1 class="hidden xxs:flex text-md text-surface-100 ">
									
									{shortenText(post.description, 75)}
								</h1>
							</section>
							<footer class="row-span-1 card-footer !p-4 m-0 bg-current opacity-75 flex "> 
								<div class="w-full h-full grid grid-cols-3 justify-between">
									<div class="col-span-2 w-full h-full grid grid-row-1 overflow-scroll no-scrollbar whitespace-nowrap rounded-md">
										<div class="row-span-1 w-full h-full flex align-middle gap-1 rounded-md">
											{#each post.categories as category, i}
												<a href='/blog/categories/{category}' class="flex-inline overscroll-contain py-2 min-w-[4px] chip font-bold text-lg variant-filled">{category}</a>
											{/each}
										</div>
									</div>
									<div class="w-full h-full col-span-1">
										<h1 class="w-full h-full text-xl font-bold text-surface-100 dark:text-surface-900  flex items-center align-middle justify-end  text-right">
											{post.date} 
										</h1>
									</div>
								</div>
								
							</footer>
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</div>
</div>
