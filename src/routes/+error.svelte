
<script lang="ts">
    import { page } from '$app/stores';
    $: error_msg = $page.error? $page.error.message : "No Error Message"
    const data=$page
</script>

<div class="w-full h-full relative grid grid-cols">
    <div class="flex w-full h-full items-center align-middle justify-center">
        <h1 class="h1 relative h-full w-full font-bold text-[30vw] text-center">{data.status}</h1>
    </div>
    <h1 class="flex w-full h-full items-center align-middle justify-center"> {error_msg}</h1>
</div>
    