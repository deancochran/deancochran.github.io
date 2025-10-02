<script lang="ts">
    import { base } from '$app/paths'

    // get all props
    let { src, absolute = false, ...rest } = $props()

    const siteUrl = import.meta.env.PUBLIC_SITE_URL || ''
    const resolvedSrc = absolute
        ? `${siteUrl}${base}${src.startsWith('/') ? src : '/' + src}`
        : `${base}${src.startsWith('/') ? src : '/' + src}`
</script>

<img src={resolvedSrc} {...rest} />
