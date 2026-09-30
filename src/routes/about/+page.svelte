<script>
    import { page } from '$app/state'
    import aboutPortrait from '$lib/assets/dean-cochran-about.jpeg?enhanced&format=avif;webp&w=1600;1200;900;640;480'
    import Seo from '$lib/components/Seo.svelte'
</script>

<Seo
    title="About Dean Cochran"
    description="About Dean Cochran, a full-stack software engineer working across data science, machine learning, and cloud computing"
    path={page.url.pathname}
    image={aboutPortrait.img.src}
    type="profile"
/>

<!-- Main -->
<div class="flex flex-col gap-8">
    <header class="space-y-2 border-b border-[var(--border)] pb-8">
        <h1 class="page-title">About</h1>
        <p class="ui-muted">
            Full-stack software engineer and lifelong learner.
        </p>
    </header>

    <figure>
        <picture>
            {#each Object.entries(aboutPortrait.sources) as [format, srcset]}
                <source
                    {srcset}
                    sizes="(min-width: 1152px) 1072px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                    type={`image/${format}`}
                />
            {/each}
            <img
                src={aboutPortrait.img.src}
                width={aboutPortrait.img.w}
                height={aboutPortrait.img.h}
                alt="Dean Cochran in a blue suit and yellow tie"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                class="w-full rounded-[var(--radius)] border border-[var(--border)]"
            />
        </picture>
    </figure>

    <article class="prose !max-w-none">
        <p>
            Hi, I’m Dean Cochran, a full-stack software engineer with a passion
            for building innovative solutions that solve real-world problems.
            With a background in data science, machine learning, and cloud
            computing, I thrive at the intersection of technology and
            creativity. I enjoy working on projects that challenge me to think
            critically and continue evolving my skills.
        </p>

        <p>
            When I’m not coding, you’ll find me outdoors, cycling, running, or
            taking part in endurance sports like triathlons. As a remote
            software engineer, I value a healthy work-life balance that allows
            me to pursue my passion for nature and adventure while still
            delivering high-quality work. This balance fuels my creativity and
            keeps me at my best.
        </p>

        <p>
            Thanks for stopping by—feel free to connect or explore my work
            further! If you enjoyed this page or found it helpful, consider
            donating to support future content <a
                href="https://buymeacoffee.com/deancochran">here</a
            >.
        </p>

        <p>
            Prefer to talk? <a href="/meet">Book a 1:1</a> at a time that works for
            you.
        </p>
    </article>
</div>
