<script>
	export let data;
	const { products, users } = data;
	import { navigating } from '$app/stores';

	import Loader from '$lib/components/Loader.svelte';
</script>

<h1>Shop</h1>

<div class="grid">
	<div class="left">
		{#each products as product (product)}
			<h2>{product.title}</h2>
			<p>{product.description}</p>
		{/each}
	</div>
	<div class="right">
		{#await users}
			<Loader />
		{:then users}
			{#each users as user}
				<p>{user.firstName}</p>
			{/each}
		{:catch error}
			<p>error loading comments: {error.message}</p>
		{/await}
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
