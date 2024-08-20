<script lang="ts">
	import type { PageData } from '../$types';

	export let data: PageData;
	const { text, output } = data;
	console.log(text);
	console.log(output);

	let refInput: HTMLInputElement;
	let value = '';

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

	/**
	 * Remember: Good chunks of data for creating embeddings should only deal with one topic.
	 * Don't risk ahving chunks that are being polluted by unfamiliar or unrelated topics, otherweise
	 * the algorithm will have hard time to create meaningful vectors for the embeddings.
	 *
	 * Shorter chunks capture precise meanings but might not be enough to capture the context and thus
	 * miss wider context of the topic.
	 *
	 * Longer chunks grasp more context but can produce too broad a scope of information. This would
	 * influence the quality of the similarity search the vector database does.
	 *
	 * Hence: The best approach is to have a balance between the two. Optimize for the smallest size possible
	 * without losing the context of the topic.
	 */
</script>

<header id="header">
	<h1>Search</h1>
	<input
		bind:this={refInput}
		bind:value
		type="text"
		placeholder="Search all {output.length} documents"
	/>
</header>

{#each output.filter( ({ pageContent }) => includesValue(pageContent, value) ) as { pageContent, metadata }, i}
	<article>
		<div>
			<h3>Document {i + 1}</h3>
			{#if metadata.loc}
				<p>Lines from {metadata.loc.lines.from} to {metadata.loc.lines.to}</p>
			{/if}
		</div>
		<section>
			<p>{@html textReplace(pageContent, value)}</p>
		</section>
	</article>
{/each}

<style lang="scss">
	h1 {
		margin-bottom: 2rem;
	}

	#header {
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #13171f8e;
		backdrop-filter: blur(10px);
		padding-top: 20px;
	}

	section {
		padding: 1rem;
		background-color: hsla(220, 24%, 10%);
		margin-bottom: 0;
	}

	article div {
		display: flex;
		justify-content: space-between;
		align-items: center;

		p {
			opacity: 0.7;
		}
	}
</style>
