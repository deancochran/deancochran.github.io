<script>
    import { page } from '$app/state'
</script>

<div class="flex grow flex-col items-start justify-center gap-4 py-16">
    <p class="ui-muted text-sm font-medium">Error {page.status}</p>
    <h1 class="page-title">{page.error?.message ?? 'Something went wrong'}</h1>
    <p class="ui-muted max-w-md leading-7">
        The page could not be loaded. Return home and try another route.
    </p>
    <a class="ui-button ui-button-primary mt-2" href="/">Go home</a>
</div>
