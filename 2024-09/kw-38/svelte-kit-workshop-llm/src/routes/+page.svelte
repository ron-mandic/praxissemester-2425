<script lang="ts">
	import Example from '@/svelte/Example.svelte';
</script>

<svelte:head>
	<title>Example</title>
</svelte:head>

<main class="flex h-screen w-screen items-center justify-center">
	<Example
		list={[
			{
				value: 'sveltekit',
				label: 'SvelteKit'
			},
			{
				value: 'next',
				label: 'Next.js'
			},
			{
				value: 'astro',
				label: 'Astro'
			},
			{
				value: 'nuxt',
				label: 'Nuxt.js'
			}
		]}
	/>
</main>
