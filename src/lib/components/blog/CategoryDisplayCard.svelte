<script lang="ts">
      export let category;
      export let category_size;
      export let classes;
    
    </script>
    
    <a href='/blog/categories/{category}'
      class="card bg-secondary-backdrop-token shadow-lg card-hover {classes}"
    >
      <div class="relative h-full w-full backdrop-filter backdrop-brightness-50 rounded-lg bg-transparent grid grid-cols-1">
    
    
        <header class="card-header ">
          <h1 class="text-3xl text-shadow underline-offset-4 underline font-bold text-surface-100">
            {category}
          </h1>
        </header>
        <section class="p-4">
          <h2 class="hidden text-shadow font-normal xxs:flex text-md text-surface-100">
            <!-- {shortenText(meta.description)} -->
            <h1>{category} has {category_size} posts</h1>
          </h2>
        </section>
      </div>
    
    
    </a>
    