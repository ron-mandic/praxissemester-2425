<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from '../$types';
	import IconAbort from '$lib/components/IconAbort.svelte';
	import IconSend from '$lib/components/IconSend.svelte';
	import { formatDate } from '$lib';
	export let data: PageServerData;

	console.log(data);

	// Source: https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams#consuming_a_fetch_using_asynchronous_iteration

	let refInput: HTMLInputElement;
	let refSubmit: HTMLButtonElement;
	let value = '';
	let responses: { value: string; response: string; aborted: boolean; date: Date }[] = [];
	let loadingIndex: number | null = null;

	const aborter = new AbortController();

	onMount(() => {
		refInput.focus();
	});

	async function* streamToAsyncIterator(stream: ReadableStream<Uint8Array>) {
		const reader = stream.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				yield value;
			}
		} finally {
			reader.releaseLock();
		}
	}

	function getJSONObjects(str: string) {
		const regex = /(?<=\})(?=\{)/g;
		// @ts-ignore
		return str.split(regex).map(JSON.parse);
	}

	async function handleChange(event: Event) {
		event.preventDefault();
		if (!value.trim()) return;
		if (loadingIndex !== null) return; // Falls bereits eine Anfrage läuft

		const val = value;
		value = '';

		responses = [...responses, { value: val, response: '', aborted: false, date: new Date() }];
		loadingIndex = responses.length - 1;

		const decoder = new TextDecoder();

		try {
			const response = await fetch(`/api/test2?content=${val}`, {
				method: 'POST',
				body: JSON.stringify({ content: val }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.body) {
				let fullResponse = '';

				for await (const chunk of streamToAsyncIterator(response.body)) {
					if (aborter.signal.aborted) return;

					const decodedValue = decoder.decode(chunk);
					const lines = decodedValue.split('\n');

					for (const line of lines) {
						const jsonObjects = getJSONObjects(line);

						for (const { data } of jsonObjects) {
							try {
								const contentChunk = data.choices[0].delta.content;
								if (!contentChunk) continue;

								fullResponse += contentChunk;
								responses[loadingIndex].response = fullResponse;
								responses = [...responses];
							} catch (e) {
								console.error('Fehler beim Parsen des letzten Puffers:', e);
							}
						}
					}
				}
			} else {
				throw new Error('Keine Body-Daten gefunden');
			}
		} catch (error) {
			responses[loadingIndex] = {
				...responses[loadingIndex],
				response: 'Fehler beim Abrufen der Antwort'
			};
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
		<button
			bind:this={refSubmit}
			type="submit"
			on:click={() => {
				if (loadingIndex !== null) {
					aborter.abort();
					responses[loadingIndex].aborted = true;
				}
			}}
		>
			{#if loadingIndex !== null}
				<IconAbort />
			{:else}
				<IconSend />
			{/if}
		</button>
	</form>
</header>

{#if responses.length > 0}
	{#each responses as { value, response, date }, index}
		<article>
			<details open={true}>
				<summary>
					<span class="value" aria-busy={loadingIndex === index}>{value}</span>
					<span class="value-date">{formatDate(date)}</span>
				</summary>
				<p>
					{#if response}
						<span class="answer">{@html response}</span>
					{/if}
					{#if loadingIndex === index}
						<span class="ball pulsating"></span>
					{/if}
				</p>
			</details>
		</article>
	{/each}
{/if}

<style lang="scss">
	h1 {
		margin-bottom: 2rem;
	}

	article {
		position: relative;
		margin-bottom: 1rem;
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

	details {
		margin-bottom: 0;
		animation: height 0.3s ease;

		summary {
			position: relative;
			&::after {
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}

	.value-date {
		margin-left: 1rem;
		font-size: 0.8rem;
		opacity: 0.875;
	}

	.ball {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: white;
	}

	.pulsating {
		animation: pulsate 1s infinite cubic-bezier(0.55, 0.055, 0.675, 0.19);
	}

	@keyframes pulsate {
		0% {
			transform: scale(0.1, 0.1);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: scale(1.2, 1.2);
			opacity: 0;
		}
	}

	.answer {
		margin-bottom: 0;
	}
</style>
