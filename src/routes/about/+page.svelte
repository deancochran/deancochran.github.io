<script>
    import { page } from '$app/state'
    import Logo from '$lib/assets/Logo.svelte'
    import Seo from '$lib/components/Seo.svelte'
</script>

<Seo
    title="About Dean Cochran"
    description="About Dean Cochran, a full-stack software engineer working across data science, machine learning, and cloud computing"
    path={page.url.pathname}
    image="/images/logo.webp"
    type="profile"
/>

<!-- Main -->
<div class="flex flex-col gap-8">
    <header
        class="flex items-center gap-5 border-b border-[var(--border)] pb-8"
    >
        <div
            class="grid h-20 w-20 shrink-0 place-items-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]"
        >
            <Logo class="h-14 w-14" />
        </div>
        <div class="space-y-2">
            <h1 class="page-title">About</h1>
            <p class="ui-muted">
                Full-stack software engineer and lifelong learner.
            </p>
        </div>
    </header>

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
    </article>
</div>
