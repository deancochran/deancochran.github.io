<script lang="ts">

	import { createEventDispatcher } from "svelte";
    let unique = {}
    const dispatch = createEventDispatcher();

    const onClick = async () =>{
        dispatch('clicked')
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg on:click={onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="w-10 h-10 hover:stroke-2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
</svg>