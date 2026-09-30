<script lang="ts">
    interface Props {
        size?: number
        class?: string
    }

    let { size = 80, class: className = '' }: Props = $props()
</script>

<span
    aria-hidden="true"
    style={`width: ${size}px; height: ${size}px; font-size: ${Math.round(size * 0.72)}px;`}
    class={`inline-flex shrink-0 items-center justify-center rounded-[20%] border border-[var(--border)] bg-[var(--foreground)] font-serif leading-none font-bold text-[var(--background)] ${className}`}
    >D<span class="inline-block w-[0.015em]"></span>.</span
>
