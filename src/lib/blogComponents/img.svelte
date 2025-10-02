<script lang="ts">
    interface Props {
        src: string
        alt: string
        absolute?: boolean // optional prop for full URLs
        [key: string]: any
    }

    let { src, alt, ...rest } = $props()

    const siteURL = import.meta.env.PUBLIC_SITE_URL

    // Prefix root-relative paths with PUBLIC_SITE_URL
    if (src.startsWith('/')) {
        src = siteURL + src
    }
</script>

<img {src} {alt} {...rest} />
