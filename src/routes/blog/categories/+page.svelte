<script lang="ts">
	import { formatDate } from '$lib/utils/blog/formatting';
	import { category_list, type Categories } from '$lib/utils/blog/posts';
	export let data
	
</script>

<h1>Welcome to blog categories</h1>



<!-- Posts -->
<section>
	<ul class="posts">
		{#each category_list as category}
			<li class="post">
					<a href={`/blog/categories/${category}`}>{category}</a>
			</li>
			<br/>
		{/each}
	</ul>
</section>