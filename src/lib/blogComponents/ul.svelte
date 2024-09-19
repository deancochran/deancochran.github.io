<ul class="list-inside list-disc space-y-2">
	<slot />
</ul>

<style lang="postcss">
    :global(ul) {
        ul{
            @apply pl-4
        }
    }
</style>