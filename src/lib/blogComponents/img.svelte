<script lang="ts">
    interface Props {
        src: string
        alt: string
        absolute?: boolean // optional prop for full URLs
        [key: string]: any
    }

    let { src, alt, ...rest } = $props()

    const siteURL = import.meta.env.PUBLIC_SITE_URL
    const resolvedSrc = $derived(src.startsWith('/') ? siteURL + src : src)
</script>

<img src={resolvedSrc} {alt} {...rest} />
