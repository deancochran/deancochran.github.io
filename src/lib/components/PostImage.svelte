<script lang="ts">
    import type { Picture } from '@sveltejs/enhanced-img'

    interface Props {
        image: Picture
        alt: string
        class?: string
        sizes: string
        loading?: 'eager' | 'lazy'
        fetchpriority?: 'high' | 'low' | 'auto'
        style?: string
    }

    let {
        image,
        alt,
        class: className,
        sizes,
        loading,
        fetchpriority,
        style,
    }: Props = $props()
</script>

<picture>
    {#each Object.entries(image.sources) as [format, srcset]}
        <source {srcset} {sizes} type={`image/${format}`} />
    {/each}
    <img
        src={image.img.src}
        width={image.img.w}
        height={image.img.h}
        {alt}
        class={className}
        {loading}
        {fetchpriority}
        {style}
    />
</picture>
