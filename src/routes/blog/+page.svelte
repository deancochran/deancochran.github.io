<script lang="ts">
  import PostDisplayCard from "$lib/components/blog/PostDisplayCard.svelte";
  import { formatDate } from "$lib/utils/blog/formatting";
  import { category_list } from "$lib/utils/blog/posts.js";
  import { blur } from "svelte/transition";

  export let data;
</script>


<div class="relative w-full h-full">
  <div class="relative grid sm:grid-cols-4 md:grid-cols-6 p-4" >
    <!-- Dummy -->
    <div class="relative w-full h-full col-span-1" />
    <div class="relative w-full h-full col-span-4" >
      <div class="relative h-full grid grid-cols-1 gap-4">
        <div class="relative w-full h-full col-span-1">
          <h1 class="font-semibold text-6xl">My Blog</h1>
        </div>
        {#each data.posts as post, i}
					<PostDisplayCard meta={post} classes='relative w-full h-full'/>
			  {/each}
        
      </div>
    </div>
    <!-- Dummy -->
    <div class="relative w-full h-full col-span-1" />
  </div>
</div>
