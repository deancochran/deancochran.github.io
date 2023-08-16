<script lang="ts">
  import { getBlogPosts, type Post } from "$lib/utils/blog/posts";
  import {
    drawerStore,
    type DrawerSettings,
    LightSwitch,
    Drawer,
    type ModalSettings,
    modalStore,
  } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";

  let posts: Array<Post>;
  onMount(async () => {
    const res = await getBlogPosts();
    posts = await res.json();
  });

  // Search
  function triggerSearch(): void {
    const modal: ModalSettings = {
      type: "component",
      component: "modalSearch",
      position: "item-start",
    };
    modalStore.trigger(modal);
  }
  // // Keyboard Shortcut (CTRL/⌘+K) to Focus Search
  // function onWindowKeydown(e: KeyboardEvent): void {
  // 	if ((e.key == 'Escape' )) {
  // 		// Prevent default browser behavior of focusing URL bar
  // 		e.preventDefault();
  // 		// If modal currently open, close modal (allows to open/close search with CTRL/⌘+K)
  // 		$modalStore.length ? modalStore.close() : triggerSearch();
  // 	}
  // }
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<!-- <svelte:window on:keydown|stopPropagation={onWindowKeydown} /> -->
<div class="md:inline">
  <button
    class="btn variant-soft hover:variant-soft-primary"
    on:click={triggerSearch}
  >
    <span class=" h3 w-full h-full -mb-1">
      <iconify-icon icon="material-symbols:search" /></span
    >
    <span class="hidden md:visible h3 text-lg md:inline-block">Search</span>
  </button>
</div>
<div class="hidden md:flex">
  <LightSwitch />
</div>
