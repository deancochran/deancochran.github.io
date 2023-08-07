<script lang="ts">
	import { formatDate } from '$lib/utils/blog/formatting';
	export let data
</script>

<h1>Welcome to the blog</h1>

<!-- Posts -->
<section>
	<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href=/blog/{post.slug} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
			<br/>
		{/each}
	</ul>
	<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href=/blog/{post.slug} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
			<br/>
		{/each}
	</ul>
<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href=/blog/{post.slug} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
			<br/>
		{/each}
	</ul>
</section>