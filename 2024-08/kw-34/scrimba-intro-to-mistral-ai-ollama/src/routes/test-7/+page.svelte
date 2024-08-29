<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from '../$types';
	export let data: PageServerData;

	console.log(data);

	let refInput: HTMLInputElement;
	let value = 'When was the transaction T1001 paid?';
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

		responses = [...responses, { value: val, response: null }];

		try {
			const response = await fetch(`/api/mistral?question=${val}`, {
				method: 'POST',
				body: JSON.stringify({ question: val }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Fehler beim Senden der Nachricht');
			}

			const responseData = await response.json();
			console.log(responseData);
		} catch (error) {
			console.error(error);
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
		<button type="submit">
			<span>&#8658;</span>
		</button>
	</form>
</header>

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
</style>
