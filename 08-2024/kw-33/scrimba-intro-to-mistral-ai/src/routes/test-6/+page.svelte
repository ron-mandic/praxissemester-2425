<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from '../$types';
	import { delay, formatDate } from '$lib';
	export let data: PageServerData;

	console.log(data);

	let refInput: HTMLInputElement;
	let value = 'December 25th is on a Sunday, do I get any extra time off to account for that?';
	let responses: { value: string; response: any }[] = [];
	let loadingIndex: number | null = null; // Um den aktuellen Ladezustand zu verfolgen

	onMount(() => {
		refInput.focus();
	});

	async function handleChange(_: Event) {
		if (!value.trim()) return;
		if (loadingIndex !== null) return;

		const val = value;
		value = '';

		let d = new Date();

		responses = [...responses, { value: val, response: null }];
		loadingIndex = responses.length - 1;

		try {
			const response = await fetch(`/api/test6?content=${val}`, {
				method: 'POST',
				body: JSON.stringify({ content: val }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const responseData = await response.json();
				console.log(responseData);

				responses[loadingIndex] = {
					value: val + `<span style="margin-left: .75rem; opacity: .75;">${formatDate(d)}</span>`,
					response: responseData
				};
			} else {
				responses[loadingIndex] = { value: val, response: 'Fehler beim Abrufen der Antwort' };
			}
		} catch (error) {
			responses[loadingIndex] = { value: val, response: error.message };
		} finally {
			loadingIndex = null; // Ladeindikator zurücksetzen
		}
	}
</script>

<header>
	<h1>Chat</h1>
	<form on:submit|preventDefault={handleChange}>
		<input
			bind:this={refInput}
			bind:value
			type="text"
			placeholder="Sende eine Nachricht an Mistral"
		/>
		<button type="submit" disabled={loadingIndex !== null}>
			<span>&#8658;</span>
		</button>
	</form>
</header>

{#if responses.length > 0}
	{#each responses as { value, response }, index}
		<article>
			<details open={true}>
				<summary>
					<span class="value" aria-busy={loadingIndex === index}>{@html value}</span>
				</summary>
				{#if response}
					<p class="answer">{response}</p>
				{/if}
			</details>
		</article>
	{/each}
{/if}

<style lang="scss">
	h1 {
		margin-bottom: 2rem;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 999;
		background-color: #13171f8e;
		backdrop-filter: blur(10px);
		padding-top: 20px;
	}

	form {
		position: relative;
		display: flex;
		input {
			padding-right: calc(3rem + 0.5rem);
		}

		button {
			position: absolute;
			right: 0.25rem;
			top: 0.25rem;
			bottom: 0.25rem;
			width: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	details summary {
		position: relative;
		&::after {
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	.answer {
		margin-bottom: 0;
	}
</style>
