
<script lang="ts">
    import { page } from '$app/stores';
    $: error_msg = $page.error? $page.error.message : "No Error Message"
</script>

<h1>{$page.status}: {error_msg}</h1>
