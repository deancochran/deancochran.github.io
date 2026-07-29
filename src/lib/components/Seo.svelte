<script lang="ts">
    import { absoluteUrl } from '$lib/config'

    interface Props {
        title: string
        description: string
        path: string
        image: string
        type?: 'article' | 'profile' | 'website'
    }

    let { title, description, path, image, type = 'website' }: Props = $props()

    const canonical = $derived(absoluteUrl(path))
    const socialImage = $derived(absoluteUrl(image))
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content={type} />
    <meta property="og:site_name" content="Dean Cochran" />
    <meta property="og:image" content={socialImage} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@deancochran_" />
    <meta name="twitter:creator" content="@deancochran_" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={socialImage} />
</svelte:head>
