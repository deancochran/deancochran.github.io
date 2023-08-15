<script lang="ts">
  import { getImgPath, shortenText } from "$lib/utils/blog/formatting";
  import { getBlogPosts, type Post } from "$lib/utils/blog/posts";
  import { blur } from "svelte/transition";
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import PostDisplayCard from "$lib/components/blog/PostDisplayCard.svelte";

  let posts: Array<Post> = [];

  let show_placeholders = false;
  let showPosts: boolean = false;

  const fetchData = async () => {
    const res = await getBlogPosts();
    posts = await res.json();
    show_placeholders = false;
  };

  onMount(async () => {
    show_placeholders = true;
  });
</script>

<div class="w-full h-full grid grid-cols-1 p-4 gap-0">
  <div class="col-span-1 grid grid-cols-1">

      <h1 class="relative text-center text-5xl "> Hello, my name is <span class="relative p-0 m-0 hover:font-bold hover:font-serif bg-gradient-to-tr from-secondary-500 to-primary-500 bg-clip-text text-transparent box-decoration-clone" >Dean</span > </h1>
  </div>
  <div
    class="w-full h-full col-span-1 flex align-middle justify-center no-scrollbar overflow-x-clip"
  >
    <div
      class=" w-full h-full flex justify-center scroll-m-0 scroll-px-1 snap-both snap-mandatory scroll-smooth gap-4 overflow-aut p-4"
    >
      {#if show_placeholders}
        {#each Array(1) as _, i}
          <div
            on:introend={fetchData}
            on:outroend={() => {
              showPosts = true;
            }}
            in:blur={{ delay: 300 * i, duration: 300 }}
            out:blur={{ duration: 300 }}
            class="placeholder animate-pulse snap-center shrink-0 p-0 w-[60vw] h-fit md:w-[50vw] md:h-fit bg-surface-300 rounded-md shadow-lg drop-shadow-lg"
          />
        {/each}
      {:else if showPosts}
        {#each posts as post, i}
          <PostDisplayCard meta={post} classes="relative w-[60vw] h-fit md:w-[50vw] md:h-fit"/>
        {/each}
      {/if}
    </div>
  </div>
</div>
