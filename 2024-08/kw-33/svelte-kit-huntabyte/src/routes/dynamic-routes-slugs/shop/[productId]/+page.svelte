<script>
	export let data;
	const { product } = data;
	import Loader from '$lib/components/Loader.svelte';
</script>

{#await product}
	<Loader />
{:then product}
	<h1>{product.title}</h1>
	<p>{product.description}</p>
	<p>$ {product.price.toFixed(2)}</p>
{:catch error}
	<p>error loading comments: {error.message}</p>
{/await}
