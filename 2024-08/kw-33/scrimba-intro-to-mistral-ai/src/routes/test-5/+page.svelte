<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from '../$types';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	export let data: PageServerData;

	type Embeddings = {
		embeddings: {
			content: string;
			embedding: number[];
		}[];
	};

	console.log(data);
	let refInput: HTMLInputElement;
	let value = '';
	let res: Promise<Embeddings>;

	onMount(() => {
		res = fetch('/api/test5').then((res) => res.json());
		// 	let response = await fetch('/api/test5');
		// 	let data = await response.json();
		// 	console.log(data);
	});

	const includesValue = (text: string, search: string) => {
		if (!value || !value.trim()) return true;
		return text.toLowerCase().includes(search.toLowerCase());
	};

	function textReplace(text: string, search: string) {
		// e.g. "Hello, world!", "ello" -> "H<mark>ello<mark>, world!"
		if (!value || !value.trim()) return text;

		const searchRegex = new RegExp(search, 'gi');
		return text.replace(searchRegex, (match) => `<mark>${match}</mark>`);
	}
</script>

{#await res}
	<div id="loader" aria-busy="true"></div>
{:then data}
	<header id="header">
		<h1>Search</h1>
		<input
			bind:this={refInput}
			bind:value
			type="text"
			placeholder="Search all {data?.embeddings.length ?? ''} documents"
		/>
	</header>
	{#if data?.embeddings}
		{#each data?.embeddings?.filter( ({ content }) => includesValue(content, value) ) as { content, embedding }, i}
			<article transition:slide|global={{ delay: 375, duration: 400, easing: quintOut, axis: 'y' }}>
				<div>
					<h3>Document {i + 1}</h3>
				</div>
				<section>
					{#if embedding}
						{@const arr = embedding.slice(0, 4)}
						{@const str = JSON.stringify(arr)}
						<code>{str.slice(0, str.length - 1) + ', ...]'}</code>
					{/if}
				</section>
				<section>
					<p>{@html textReplace(content, value)}</p>
				</section>
			</article>
		{/each}
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<style lang="scss">
	// :root {
	// 	// background-color: rgba(0, 0, 0, 0.5); // HINT: Favorite color combination
	// }

	:global(.layout) {
		::-webkit-scrollbar {
			display: none;
		}
		scrollbar-width: none;
	}

	#loader {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		scale: 1.25;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	h1 {
		margin-bottom: 2rem;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #13171f8e, rgba(0, 0, 0, 0.25);
		backdrop-filter: blur(10px);
		padding-top: 20px;
	}
</style>
