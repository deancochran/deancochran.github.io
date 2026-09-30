<script lang="ts">
    interface Props {
        alt?: string
        size?: number
        class?: string
        loading?: 'eager' | 'lazy'
        fetchpriority?: 'high' | 'low' | 'auto'
    }

    let {
        alt = '',
        size = 80,
        class: className = '',
        loading = 'lazy',
        fetchpriority = 'auto',
    }: Props = $props()
</script>

<img
    src="/images/dean-cochran-headshot-80.webp"
    srcset="/images/dean-cochran-headshot-80.webp 80w, /images/dean-cochran-headshot-160.webp 160w, /images/dean-cochran-headshot-300.webp 300w, /images/dean-cochran-headshot-512.webp 512w"
    sizes={`${size}px`}
    width={size}
    height={size}
    {alt}
    {loading}
    {fetchpriority}
    decoding="async"
    style={`width: ${size}px; height: ${size}px; margin: 0; border-radius: 20%;`}
    class={`block shrink-0 rounded-[20%] border border-[var(--border)] object-cover ${className}`}
/>
