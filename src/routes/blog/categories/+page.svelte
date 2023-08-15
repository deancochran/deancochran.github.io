<script lang="ts">
	import { formatDate } from '$lib/utils/blog/formatting';
	import { category_list, type Categories } from '$lib/utils/blog/posts';
	import CategoryDisplayCard from '$lib/components/blog/CategoryDisplayCard.svelte';
	export let data
	
</script>


<div class="relative w-full h-full">
  <div class="relative grid sm:grid-cols-4 md:grid-cols-6 p-4" >
    <!-- Dummy -->
    <div class="relative w-full h-full col-span-1" />
    <div class="relative w-full h-full col-span-4" >
      <div class="relative h-full grid grid-cols-1 gap-4">
        <div class="relative w-full h-full col-span-1">
          <h1 class="font-semibold text-6xl">My Categories</h1>
        </div>
		
        {#each category_list as category}
			<CategoryDisplayCard {category} category_size={data.categorized_posts[category].length} classes="relative w-full h-full"/>
			
		{/each}
        
      </div>
    </div>
    <!-- Dummy -->
    <div class="relative w-full h-full col-span-1" />
  </div>
</div>

