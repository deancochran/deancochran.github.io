<script lang="ts">
  import { page } from "$app/stores";
  import { MetaTags } from "svelte-meta-tags";
  import { onMount } from "svelte";
  import { localStorageStore } from "@skeletonlabs/skeleton";
  import { blogPostStore } from "$lib/stores/blog";
  import { get, type Writable } from "svelte/store";

  let data = $page.data;
</script>

<MetaTags
  title={data.meta.title}
  titleTemplate="{data.meta.title}, by Dean Cochran"
  description={data.meta.description}
  canonical="https://www.deancochran.net/blog/{data.meta.slug}"
  openGraph={{
    url: "https://www.deancochran.net/blog/{data.meta.slug}",
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
    site_name: "Dean Cochran's Portfolio",
  }}
  twitter={{
    handle: "@deancochran_",
    // site: '@site',
    cardType: "summary_large_image",
    title: data.meta.title,
    description: data.meta.description,
    // image: 'https://www.example.ie/twitter-image.jpg', GET URL PATH NAME
    imageAlt: data.meta.title,
  }}
/>
<slot />
