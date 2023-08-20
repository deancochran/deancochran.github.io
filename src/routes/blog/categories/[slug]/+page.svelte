<script lang="ts">
  import PostDisplayCard from "$lib/components/blog/PostDisplayCard.svelte";
  export let data;
</script>

<div class="relative w-full h-full">
  <div class="relative grid sm:grid-cols-4 md:grid-cols-6 p-4">
    <!-- Dummy -->
    <div class="relative w-full h-full col-span-1" />
    <div class="relative w-full h-full col-span-4">
      <div class="relative h-full grid grid-cols-1 gap-4">
        <div class="relative w-full h-full col-span-1">
          <h1 class="font-semibold text-6xl">
            <span
              class="hover:font-serif bg-gradient-to-tr from-secondary-500 to-primary-500 bg-clip-text text-transparent decoration-current"
            >
              {data.category}
            </span> posts
          </h1>
        </div>
        {#if data.posts.length}
          {#each data.posts as post, i}
            <PostDisplayCard meta={post} classes="relative w-full h-full" />
          {/each}
        {:else}
          <h1>So Empty..</h1>
        {/if}
      </div>
    </div>
    <!-- Dummy -->
    <div class="relative w-full h-full col-span-1" />
  </div>
</div>
