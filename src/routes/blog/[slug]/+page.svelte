<script>
	import { page } from '$app/stores';
  import { readTime } from '$lib/utils/blog/readtime';
  import { onMount } from 'svelte';
  import { MetaTags } from 'svelte-meta-tags';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<MetaTags
title={data.meta.title}
titleTemplate="%s, by Dean Cochran"
description={data.meta.description}
canonical="https://www.deancochran.net/blog/{data.meta.slug}"
openGraph={{
  url: 'https://www.deancochran.net/blog/{data.meta.slug}',
  title: data.meta.title,
  description: data.meta.description,
  // images: [ 
  // USE a utility function that build image paths and loop through them onMount.
  //  Make a array of obj of those paths for this
  //
	// {
  // 	url: 'https://www.example.ie/og-image-01.jpg',
  // 	width: 800,
  // 	height: 600,
  // 	alt: 'Og Image Alt'
	// },
	// {
  // 	url: 'https://www.example.ie/og-image-02.jpg',
  // 	width: 900,
  // 	height: 800,
  // 	alt: 'Og Image Alt Second'
	// },
	// { url: 'https://www.example.ie/og-image-03.jpg' },
	// { url: 'https://www.example.ie/og-image-04.jpg' }
  // ],
  site_name: "Dean Cochran's Portfolio"
}}
twitter={{
  handle: '@deancochran_',
  // site: '@site',
  cardType: 'summary_large_image',
  title: data.meta.title,
  description: data.meta.description,
  // image: 'https://www.example.ie/twitter-image.jpg', GET URL PATH NAME
  imageAlt: data.meta.title
}}
/>

<div class="relative grid grid-cols-8 pb-12">
	<div class="relative col-span-1"> </div>
	<div class="relative col-span-6 grid grid-cols-1 card p-8 shadow-lg">
		<div class="relative w-full h-full grid grid-cols-1 bg-surface-backdrop-token shadow-lg rounded-lg">
			
			<div class="hero overflow-visible col-span-1 grid grid-cols-1 md:grid-cols-2">

				<div class='relative col-span-1 p-4 grid-cols-1 align-middle justify-center items-center'>
					<!-- Hero -->
					<div class='relative  p-4 overflow-visible'>
						<span class="h1 flex justify-center text-center md:text-left text-shadow font-bold text-7xl bg-gradient-to-tr from-error-500 to-warning-500 bg-clip-text text-transparent box-decoration-clone">{data.meta.title}</span>
					</div>
					<!-- Meta -->
					<div class="date  p-4 relative col-span-1 grid grid-cols-1 gap-2 w-full">
						<div class="col-span-1">
							<p>
								Written: {data.meta.date}
							</p>
						</div>
						<div class="col-span-1">
							<p>
								{#await readTime(data.params.slug)}
									Read Time: Loading...
								{:then min} 
									Read Time: {min} min
								{/await}
							</p>
						</div>	
					</div>
					<!-- Tags -->
					<div class="tags col-span-1 relative p-4 grid-cols-1 md:grid-cols-2">
						<div class="tags col-span-1 relative">
							{#each data.meta.categories as category}
								<a href="/blog/categories/{category}" class="chip variant-filled m-px">{category}</a>
							{/each}		
						</div>
						
					</div>
					<div class="tags col-span-1 relative p-4 grid-cols-1">
						<div class="description relative col-span-1 w-full flex text-left">
							<div class="description relative  ">
								<span class="">{data.meta.description}</span>
							</div>
						</div>
					</div>

				</div>
				<div class='relative overflow-visible col-span-1 flex align-middle justify-center items-start'>
					<!-- Img -->
					<div class="img h-full rounded-lg inline-flex p-4">
						<img class="object-cover max-h-full rounded-lg" src={data.meta.img_url} alt="{data.meta.title}"/>
					</div>
				</div>
				
			</div>
	
			
	
			
		</div>

		<div class="relative col-span-6 grid grid-cols-1 py-4">


			<!-- <Post content={data.content}/> -->
			<svelte:component this={data.content}/>
		</div>



		<!-- Post -->
	</div>
	<div class="col-span-1"> </div>
</div>
	





