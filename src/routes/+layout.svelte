<script lang="ts">
  // Your selected Skeleton theme:
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";

  // This contains the bulk of Skeletons required styles:
  import "@skeletonlabs/skeleton/styles/skeleton.css";

  // Finally, your application's global stylesheet (sometimes labeled 'app.css')
  import "../app.postcss";

  import "iconify-icon";

  import hljs from "highlight.js";
  import "highlight.js/styles/github-dark.css";

  import {
    Drawer,
    LightSwitch,
    Modal,
    Toast,
    drawerStore,
    type ModalComponent,
  } from "@skeletonlabs/skeleton";
  // import { storePopup } from '@skeletonlabs/skeleton';
  import { AppShell, AppBar } from "@skeletonlabs/skeleton";
  import Navigation from "$lib/components/AppLayout/Navigation.svelte";
  import NavigationLogo from "$lib/components/AppLayout/NavigationLogo.svelte";
  // Modal Components
  // import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import type { ComponentEvents } from "svelte";
  import Search from "$lib/components/modals/Search.svelte";
  import { storeHighlightJs } from "@skeletonlabs/skeleton";

  storeHighlightJs.set(hljs);

  // storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  function scrollHandler(event: ComponentEvents<AppShell>["scroll"]) {
    // console.log(event.currentTarget.scrollTop);
  }

  // Registered list of Components for Modals
  const modalComponentRegistry: Record<string, ModalComponent> = {
    modalSearch: { ref: Search },
    // exampleList: { ref: ModalExampleList },
    // exampleEmbed: { ref: ModalExampleEmbed },
    // exampleImage: { ref: ModalExampleImage }
  };

  import { fly } from "svelte/transition";
  import { MetaTags } from 'svelte-meta-tags';
  


  export let data;
</script>

<MetaTags
  title="Using More of Config"
  titleTemplate=", by Dean Cochran"
  description="This example uses more of the available config options."
  canonical="https://www.canonical.ie/"
  openGraph={{
    url: 'https://www.url.ie/a',
    title: 'Open Graph Title',
    description: 'Open Graph Description',
    images: [
      {
        url: 'https://www.example.ie/og-image-01.jpg',
        width: 800,
        height: 600,
        alt: 'Og Image Alt'
      },
      {
        url: 'https://www.example.ie/og-image-02.jpg',
        width: 900,
        height: 800,
        alt: 'Og Image Alt Second'
      },
      { url: 'https://www.example.ie/og-image-03.jpg' },
      { url: 'https://www.example.ie/og-image-04.jpg' }
    ],
    site_name: 'SiteName'
  }}
  twitter={{
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
    title: 'Using More of Config',
    description: 'This example uses more of the available config options.',
    image: 'https://www.example.ie/twitter-image.jpg',
    imageAlt: 'Twitter image alt'
  }}
/>


<!-- Overlays -->
<Modal components={modalComponentRegistry} />
<Toast />

<AppShell
  on:scroll={scrollHandler}
  regionpage="relative"
  slotpageheader="sticky top-0 z-10"
>
  <svelte:fragment slot="header">
    <AppBar
      background="!py-2"
      gridColumns="grid-cols-3 gap-0"
      slotDefault="place-self-start"
      slotTrail="place-content-end"
      shadow=""
      
      
    >
      <svelte:fragment slot="lead">
        <NavigationLogo />
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <Navigation />
      </svelte:fragment>
      <!-- <svelte:fragment slot="headline"></svelte:fragment> -->
    </AppBar>
  </svelte:fragment>

  {#key data.url}
    <div
      in:fly={{ duration: 300, delay: 300 }}
      out:fly={{ duration: 300 }}
    >
      <slot />
    </div>
  {/key}

  <svelte:fragment slot="pageFooter">
    <div class="bg-surface grid grid-cols-1 gap-4 p-4 rounded-none">
      <div class="col-span-1 flex items-center align-middle justify-center">
        <hr class=" bg-current rounded-md h-1 w-full" />
      </div>
      <div
        class=" col-span-1 logo-cloud grid-cols-5 gap-2 bg-transparent rounded-none"
      >
        <a
          class="logo-item !bg-transparent hover:variant-ghost-surface rounded-md"
          href="https://github.com/deancochran"
        >
          <span> <iconify-icon icon="mdi:github" /></span>
          <span class="hidden sm:block">Github</span>
        </a>
        <a
          class="logo-item !bg-transparent hover:variant-ghost-surface rounded-md"
          href="https://twitter.com/deancochran_"
        >
          <span> <iconify-icon icon="ri:twitter-x-fill" /></span>
          <span class="hidden sm:block"> Twitter</span>
        </a>
        <a
          class="logo-item !bg-transparent hover:variant-ghost-surface rounded-md"
          href="https://www.linkedin.com/in/dean-cochran/"
        >
          <span> <iconify-icon icon="bi:linkedin" /></span>
          <span class="hidden sm:block"> Linkedin</span>
        </a>
        <a
          class="logo-item !bg-transparent hover:variant-ghost-surface rounded-md"
          href="https://www.komoot.com/user/2745892364182"
        >
          <span> <iconify-icon icon="simple-icons:komoot" /></span>
          <span class="hidden sm:block"> Komoot</span>
        </a>
        <a
          class="logo-item !bg-transparent hover:variant-ghost-surface rounded-md"
          href="https://www.instagram.com/deancochran/"
        >
          <span> <iconify-icon icon="bi:instagram" /></span>
          <span class="hidden sm:block"> Instagram</span>
        </a>
      </div>
    </div>
  </svelte:fragment>
</AppShell>
