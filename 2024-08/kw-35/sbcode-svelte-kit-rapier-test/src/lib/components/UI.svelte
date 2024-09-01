<script lang="ts">
	import { getContext } from 'svelte';

	let { ...props } = $props();
	const obj = getContext('three');
	console.log(obj);
</script>

<button {...props}>Click me</button>

<style>
	button {
		position: fixed;
		z-index: 999;
		background-color: rgb(187, 230, 124);
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.75rem 1.5rem;
		border-radius: 1.25rem;
		transition: all 0.2s ease;
		transform-origin: center center;

		&:hover {
			transition: all 0.2s ease;
			scale: 1.1;
		}
	}
</style>
