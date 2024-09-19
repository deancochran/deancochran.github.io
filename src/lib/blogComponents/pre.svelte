<script lang="ts">
	import type { Component } from 'svelte';
	export let code: string;
	export let language: string;
	export let component: Component;
</script>

<h1 class="h1">HELLLL</h1>
<pre class="overflow-scroll">
    <code class="language-{language}" use:component>
        {code}
    </code>

</pre>
