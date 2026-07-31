<script lang="ts">
    import { getPostImage } from '$lib/utils/post-images'
    import PostImage from './PostImage.svelte'

    interface Props {
        post: BlogPostSummary
        variant?: 'featured' | 'archive'
    }

    let { post, variant = 'featured' }: Props = $props()
    const image = $derived(getPostImage(post.image))

    const fullDate = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    })
    const shortDate = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    })

    function parseDate(date: string) {
        return new Date(`${date}T00:00:00.000Z`)
    }
</script>

{#if variant === 'featured'}
    <article>
        <a
            href={'/blog/' + post.relativePath}
            class="ui-card group grid overflow-hidden transition-colors hover:bg-[var(--accent)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        >
            <div
                class="overflow-hidden border-b border-[var(--border)] md:border-r md:border-b-0"
            >
                <PostImage
                    image={image.source}
                    class="aspect-video h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] md:aspect-16/10"
                    alt={image.alt ?? post.title}
                    sizes="(min-width: 1152px) 616px, (min-width: 1024px) calc((100vw - 80px) * 0.575), (min-width: 768px) calc((100vw - 64px) * 0.575), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                    loading="eager"
                    fetchpriority="high"
                    style={`view-transition-name: item-image-${post.relativePath};`}
                />
            </div>

            <div class="flex flex-col justify-center gap-4 p-5 sm:p-7">
                <p class="archive-meta flex flex-wrap items-center gap-2">
                    <time
                        datetime={post.date}
                        title={fullDate.format(parseDate(post.date))}
                    >
                        {fullDate.format(parseDate(post.date))}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingMinutes} min read</span>
                </p>
                <h2
                    class="max-w-[18ch] text-2xl leading-tight font-semibold tracking-[-0.035em] sm:text-3xl"
                    style={`view-transition-name: item-title-${post.relativePath};`}
                >
                    {post.title}
                </h2>
                <p
                    class="ui-muted line-clamp-3 text-sm leading-6 sm:text-base"
                    style={`view-transition-name: item-description-${post.relativePath};`}
                >
                    {post.description}
                </p>
                <span class="text-sm font-semibold"
                    >Read article <span aria-hidden="true">→</span></span
                >
            </div>
        </a>
    </article>
{:else}
    <article>
        <a
            href={'/blog/' + post.relativePath}
            class="group grid gap-4 py-7 md:grid-cols-[11.25rem_minmax(0,1fr)_auto] md:items-start md:gap-6"
        >
            <div
                class="overflow-hidden rounded-[var(--radius)] bg-[var(--muted)]"
            >
                <PostImage
                    image={image.source}
                    class="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                    alt={image.alt ?? post.title}
                    sizes="(min-width: 768px) 180px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                    loading="lazy"
                    style={`view-transition-name: item-image-${post.relativePath};`}
                />
            </div>

            <div class="space-y-2">
                <p class="archive-meta flex items-center gap-2 md:hidden">
                    <time datetime={post.date}>
                        {shortDate.format(parseDate(post.date))}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingMinutes} min read</span>
                </p>
                <h3
                    class="line-clamp-3 text-xl leading-tight font-semibold tracking-[-0.025em] transition-colors group-hover:text-[var(--muted-foreground)] sm:text-2xl"
                    style={`view-transition-name: item-title-${post.relativePath};`}
                >
                    {post.title}
                </h3>
                <p
                    class="ui-muted line-clamp-2 text-sm leading-6"
                    style={`view-transition-name: item-description-${post.relativePath};`}
                >
                    {post.description}
                </p>
                <span class="inline-block pt-1 text-sm font-semibold md:hidden"
                    >Read article <span aria-hidden="true">→</span></span
                >
            </div>

            <p
                class="archive-meta hidden text-right whitespace-nowrap md:flex md:flex-col md:gap-1"
            >
                <time
                    datetime={post.date}
                    title={fullDate.format(parseDate(post.date))}
                >
                    {shortDate.format(parseDate(post.date))}
                </time>
                <span>{post.readingMinutes} min read</span>
            </p>
        </a>
    </article>
{/if}
