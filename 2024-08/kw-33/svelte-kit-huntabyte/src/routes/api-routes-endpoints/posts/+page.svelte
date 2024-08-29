<script>
	export let data;
	const { posts } = data;
</script>

<h1>Posts</h1>

{#each posts as post}
	<article>
		<a href="/api-routes-endpoints/posts/{post.id}"><h2>{post.title}</h2></a>
		<p>{post.body}</p>
	</article>
{/each}
