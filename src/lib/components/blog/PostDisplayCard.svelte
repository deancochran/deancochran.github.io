<script lang="ts">
  import { shortenText } from "$lib/utils/blog/formatting";
  import { readTime } from "$lib/utils/blog/readtime";
  export let meta;
  export let classes;
</script>

<a
  href="/blog/{meta.slug}"
  class="card bg-cover shadow-lg card-hover {classes}"
  style="background-image: url({meta.img_url})"
>
  <div
    class="relative h-full w-full backdrop-filter backdrop-brightness-50 rounded-lg bg-transparent grid grid-cols-1"
  >
    <header class="card-header">
      <h1
        class="text-3xl text-shadow underline-offset-4 underline font-bold text-surface-100"
      >
        {meta.title}
      </h1>
    </header>
    <section class="p-4">
      <h2
        class="hidden text-shadow font-normal xxs:flex text-md text-surface-100"
      >
        {shortenText(meta.description)}
      </h2>
    </section>
    <footer
      class="card-footer max-h-full bg-secondary-backdrop-token p-4 no-scrollbar overflow-auto touch-auto scroll-smooth"
    >
      <div class="w-full h-full grid grid-cols-3 gap-4 justify-between">
        <div
          class="col-span-3 md:col-span-2 w-full h-full flex flex-wrap no-scrollbar overflow-auto touch-auto scroll-smooth whitespace-nowrap rounded-md"
        >
          <div
            class="row-span-1 flex flex-wrap w-full h-full align-middle gap-1 rounded-md"
          >
            {#each meta.categories as category, i}
              <a
                href="/blog/categories/{category}"
                class="text-shadow flex-inline py-2 min-w-[4px] chip font-bold text-lg variant-filled"
                >{category}</a
              >
            {/each}
          </div>
        </div>
        <div class="w-full h-full hidden md:visible md:flex md:flex-wrap gap-4">
          <div
            class="col-span-1 flex items-center align-middle justify-center overflow-auto"
          >
            <p
              class="text-clip w-full h-full text-shadow text-xl font-bold text-surface-100 dark:text-surface-100 flex items-center align-middle justify-end text-left"
            >
              {#await readTime(meta.slug)}
                Read Time:
                <br />
                Loading...
              {:then min}
                Read Time:
                <br />
                {min} min
              {/await}
            </p>
          </div>
          <div class="col-span-1 flex items-center align-middle justify-center">
            <h1
              class="w-full h-full text-shadow text-xl font-bold text-surface-100 dark:text-surface-100 flex items-center align-middle justify-end text-left"
            >
              Written:
              <br />
              {meta.date}
            </h1>
          </div>
        </div>
      </div>
    </footer>
  </div>
</a>
