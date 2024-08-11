<script>
	export let data;
	const { post } = data;
</script>

<div>
	<h1>Post</h1>
	<article>
		<h2>{post.title}</h2>
		<p>{post.body}</p>
	</article>
</div>
