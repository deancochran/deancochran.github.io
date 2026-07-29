<script lang="ts">
    interface Props {
        post: BlogPost & { relativePath: string }
    }

    let { post }: Props = $props()
</script>

<a
    href={'/blog/' + post.relativePath}
    class="card border-surface-200-800 divide-surface-200-800 preset-tonal-surface block overflow-hidden border active:scale-[1.01]"
>
    <header class="card-header">
        <img
            src={post.image ?? '/images/logo.webp'}
            class="aspect-21/9 w-full rounded-t-md object-cover"
            alt="banner"
            style={`view-transition-name: item-image-${post.relativePath};`}
        />
    </header>

    <article class="space-y-4 p-4">
        <div>
            <h2
                class="h2"
                style={`view-transition-name: item-title-${post.relativePath};`}
            >
                {post.title}
            </h2>
        </div>
        <p
            class="line-clamp-5 opacity-60"
            style={`view-transition-name: item-description-${post.relativePath};`}
        >
            {post.description}
        </p>
    </article>

    <footer class="card-footer flex items-center justify-between gap-4 p-4">
        <small class="opacity-60">{new Date(post.date).toDateString()}</small>
        <button type="button" class="btn preset-tonal-surface outline">
            <span>Read More</span>
            <span>&rarr;</span>
        </button>
    </footer>
</a>
