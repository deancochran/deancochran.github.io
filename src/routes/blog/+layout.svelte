<script lang="ts">
import { page } from "$app/stores";

  let crumbs: Array<{ label: string, href: string }> = [];
    $: {
        // Remove zero-length tokens.
        const tokens = $page.url.pathname.split('/').filter((t) => t !== '');

        // Create { label, href } pairs for each token.
        let tokenPath = '';
        crumbs = tokens.map((t) => {
        tokenPath += '/' + t;
        t = t.charAt(0).toUpperCase() + t.slice(1);
        return { label: t, href: tokenPath };
        });

        // Add a way to get home too.
        crumbs.unshift({ label: 'Home', href: '/' });
    }


</script>

<div class="relative p-4 hidden sm:flex">
    <ol class="breadcrumb">
      {#each crumbs as crumb, i}
          {#if i < crumbs.length - 1}
              <li class="crumb"><a class="anchor font-semibold text-lg" href={crumb.href}>{crumb.label}</a></li>
              <li class="crumb-separato text-lg" aria-hidden>&rsaquo;</li>
          {:else}
              <li class="crumb text-lg font-serif">{crumb.label}</li>
          {/if}
      {/each}
    </ol> 
</div>


<slot/>