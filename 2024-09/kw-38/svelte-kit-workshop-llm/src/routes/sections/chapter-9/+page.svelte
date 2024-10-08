<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Table from '$lib/components/ui/table';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Tabs from '$lib/components/ui/tabs';
	import LLMNext from '@/svelte/LLMNext.svelte';
	import LLMCode from '@/svelte/LLMCode.svelte';

	import Info from 'lucide-svelte/icons/info';
	import TableIcon from 'lucide-svelte/icons/table';
	import Reset from 'lucide-svelte/icons/rotate-ccw';
	import { Badge } from '@/ui/badge';
	import { ScrollArea } from '@/ui/scroll-area';
	import { Input } from '@/ui/input';
	import { formatSearch, preprocess } from '$lib/ts/functions';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import LLMLoader from '@/svelte/LLMLoader.svelte';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	import { createSwapy } from 'swapy';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { EXAMPLE_OBJ_SONG, EXAMPLE_OBJ_SONG_PREFORMATTED } from '$lib/ts/constants.js';
	import { Label } from '@/ui/label/index.js';
	import Textarea from '@/ui/textarea/textarea.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import * as Accordion from '$lib/components/ui/accordion';
	import { sparsevec } from 'drizzle-orm/pg-core';
	import IconMistral from '@/svelte/IconMistral.svelte';

	let contextValue = $state('');
	let outputEmbedding = $state({} as any);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasConfirmed = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	const { data } = $props();

	$effect(() => {
		return handleReset;
	});

	function showEmbedding(embeddings: number[]) {
		if (!hasConfirmed) {
			return embeddings.slice(0, 256);
		}

		return embeddings;
	}

	function handleConfirm() {
		hasConfirmed = !hasConfirmed;
	}

	async function handlePress(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleClick();
		}
	}

	async function handleClick() {
		let body = JSON.stringify({ input: contextValue });
		let headers = { 'Content-Type': 'application/json' };

		isFetching = true;
		const response = await fetch('/api/embed/generate', { method: 'POST', body, headers });
		const data = await response.json();
		outputEmbedding = data;

		if (!hasBeenClicked) {
			hasBeenClicked = true;
		}
		isFetching = false;
	}

	function handleReset() {
		contextValue = '';
		hasBeenClicked = false;
		hasBeenReset = false;
		hasEnded = false;
		isFetching = false;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Embeddings</h2>

	<Card.Root class="mt-6 w-full">
		<Card.Header class="gap-2">
			<Card.Title>Numerische Abbildungen von Wörtern</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2">
					Stellt euch vor, ihr betretet eine Welt, in der Worte nicht nur Zeichen sind, sondern
					lebendige Entitäten, die miteinander kommunizieren.
					<HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse">
							Embeddings <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-72">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p>
									Maschinen können Texte nur dann gut verarbeiten, wenn sie in Zahlenform vorliegen.
									Embeddings verwandeln den Text in Zahlen, sodass Maschinen Bedeutungen erfassen
									können. Durch Embeddings verstehen Modelle, dass „König“ und „Königin“ ähnlich
									sind, aber auch Unterschiede aufweisen. Ohne sie könnten Maschinen keine tiefen
									Zusammenhänge zwischen Wörtern begreifen – und genau das macht sie so kraftvoll
									und spannend!
								</p>
								<p>
									Programme wie Word2Vec, GloVe und BERT nutzen komplexe Algorithmen, um diese
									Vektoren zu erstellen, die dann KI-Modellen helfen, menschliche Kommunikation
									besser zu verstehen und zu verarbeiten. Und KI-Modelle wie ChatGPT oder Mistral
									liefern auch eigene Schnittstellen, um auf das Modell zugeschnittene Embeddings zu
									erstellen.
								</p>

								<Separator class="my-2" />
								<a
									class="flex items-center gap-2 text-muted-foreground"
									href="https://en.wikipedia.org/wiki/Word_embedding"
									target="_blank"
									rel="noopener noreferrer"
									>Word embedding <ExternalLink class="inline-block h-4 w-4" /></a
								>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> machen genau das möglich, indem sie Wörter in eine Liste von Zahlen umwandeln,
					die die Bedeutungen und Beziehungen zwischen ihnen erfassen.
				</p>

				<p>
					Embeddings ermöglichen es KI-Modellen, den Kontext und die Bedeutung von Wörtern zu
					erkennen, was zu präziseren und nuancierteren Ergebnissen bei der Sprachverarbeitung
					führt.
				</p>
			</Card.Description>
		</Card.Header>
	</Card.Root>

	<Card.Root class="dark my-8 w-full">
		<Card.Header class="gap-2 p-6">
			<div>
				<Card.Description>
					<p class="mb-3 text-muted-foreground">
						Neben klassischen Tools wie <a
							class="inline-block items-center gap-2 text-muted-foreground hover:text-foreground"
							href="https://en.wikipedia.org/wiki/Word2vec"
							target="_blank"
							rel="noopener noreferrer"
							>Word2vec <ExternalLink class="-mt-0.5 inline-block h-4 w-4" /></a
						> gibt es auch spezielle Modelle, die extra für die Generierung von Embeddings entwickelt
						wurden. Einbettungsmodelle sind speziell für ihre Erzeugung trainiert worden - für lange
						Zahlenreihen, sogenannte Vektoren, die die semantische Bedeutung einer bestimmten Textsequenz
						darstellen sollen.
					</p>

					<div class="relative my-8 h-full w-full rounded-md bg-muted/50 p-6">
						<LLMCode
							innerText={{
								inputs:
									'Ollama is the easiest way to get up and running with large language models.'
							}}
							language="json"
						/>
					</div>

					<p class="text-muted-foreground">
						Es ist dann tatsächlich der Fall, dass die untere Liste von Zahlen die Bedeutung des
						obigen Satzes darstellt. Diese Zahlen repräsentieren die Wörter in einer Art und Weise,
						die es den Modellen ermöglicht, die Bedeutung und den Kontext des Satzes zu verstehen.
					</p>

					<ScrollArea
						class="relative my-8 h-[225px] w-full rounded-md bg-muted/50"
						orientation="vertical"
					>
						<div>
							<div class="h-full w-full p-6">
								<LLMCode
									innerText={{
										model: 'mistral-latest',
										embeddings: [
											[
												0.0024615687,
												-0.00262268,
												-0.00044705038,
												-0.0029358696,
												0.011503782,
												-0.01813703,
												0.003968112,
												0.012109445,
												'...',
												0.0076843863,
												-0.005280804,
												0.005898503,
												0.0035561488
											]
										],
										total_duration: 298061042,
										load_duration: 2866125,
										prompt_eval_count: 17
									}}
									language="json"
								/>
							</div>
						</div>
					</ScrollArea>

					<p class="mb-3 text-muted-foreground">
						Die resultierende Liste von Zahlen kann dann von KI-Modellen verwendet werden, um dann
						erst die Ähnlichkeit zwischen verwandten Wörtern zu berechnen oder auch die Bedeutung
						von Wörtern in einem Satz zu erfassen. Diese Embeddings können auch in einer Datenbank
						hinterlegt werden, um kontextbezogene Informationen aus einem eigenen Korpus zu
						speichern - sozusagen wie eine Wissensquelle, die die Modelle für genauere und präzisere
						Ergebnisse nutzen können.
					</p>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Text als wildes Zahlengeflecht</Card.Title>
			<Card.Description>
				<p>
					Du kennst das Spiel bereits - unten kannst du deine Eingabe tätigen und dabei ist es egal,
					ob es ein einzelnes Wort oder ein ganzer Satz ist. Hier geht es darum, die Wörter nur in
					Zahlen umzuwandeln, bevor im nächsten Kapitel die Ähnlichkeit zwischen den Wörtern
					untersucht werden kann, um so die semantische Bedeutung zu erfassen.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="text" class="mb-2 block">Ausgangstext (en-US)</Label>
			<Textarea
				bind:value={contextValue}
				class="max-h-72 min-h-52 w-full text-base"
				id="text"
				placeholder="Der Hund und die Katze sind beliebte Haustiere. Hunde sind treu und gesellig, während Katzen oft unabhängig und neugierig sind."
				maxlength={1024}
				disabled={hasBeenClicked}
				onkeypress={handlePress}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(contextValue as string).length || 0} / 1024</small>
			</div>

			<Accordion.Root
				class="-mb-2 mt-4 {!hasBeenClicked
					? 'pointer-events-none opacity-40'
					: 'pointer-event-none animate-pulse opacity-100 transition-all'}"
			>
				<Accordion.Item value="table" class="border-none">
					<Accordion.Trigger>
						<span class="font-regular flex items-center justify-start gap-x-2 text-sm"
							><TableIcon class="h-4 w-4" /> Informationen</span
						>
					</Accordion.Trigger>
					<Accordion.Content>
						{#if outputEmbedding}
							{@const { model, embeddings, prompt_eval_count, load_duration, total_duration } =
								outputEmbedding}
							<Table.Root class="text-sm">
								<Table.Row>
									<Table.Cell>Modellname</Table.Cell>
									<Table.Cell>
										<a
											class="flex items-center gap-2"
											href="https://ollama.com/library/mistral:latest"
											target="_blank"
											rel="noopener noreferrer"
											><span class="inline-flex items-center justify-between gap-x-2"
												><span class="inline-block h-4 w-4"><IconMistral /></span>{model}</span
											>
											<ExternalLink class="inline-block h-4 w-4" /></a
										>
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Tokenanzahl</Table.Cell>
									<Table.Cell class="font-mono">{prompt_eval_count}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Embeddinglänge</Table.Cell>
									<Table.Cell class="font-mono">{embeddings[0]?.length}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Ladedauer (ms)</Table.Cell>
									<Table.Cell class="font-mono">{(load_duration / 1e6).toFixed(0)}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Gesamtdauer (ms)</Table.Cell>
									<Table.Cell class="font-mono">{(total_duration / 1e6).toFixed(0)}</Table.Cell>
								</Table.Row>
							</Table.Root>
						{/if}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<div style="visibility: {!hasBeenReset && hasBeenClicked ? 'auto' : 'hidden'};">
				<Button
					class="px-5 py-6 {hasEnded ? 'duration-400 animate-bounce ease-in' : 'animate-none'}"
					onclick={handleReset}
					variant="outline">Zurücksetzen<Reset class="ml-2 h-4 w-4" /></Button
				>
			</div>
			<Button
				class="relative px-5 py-6 transition-transform ease-out active:translate-y-0.5 {isFetching
					? 'pointer-events-none'
					: 'pointer-events-auto'}"
				disabled={!contextValue.trim() || hasBeenClicked}
				onclick={handleClick}
			>
				{#if hasBeenClicked}
					<span>Erneut <span class="hidden md:inline-block">generieren</span></span>
				{:else}
					<span>Generieren</span>
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>

	<div class="mt-6">
		<Card.Root class="dark w-full">
			<Card.Header class="p-1.5">
				<ScrollArea
					class="relative h-[525px] w-full rounded-md bg-muted/50 transition-all"
					orientation="vertical"
				>
					<div>
						<div class="h-full w-full px-4 pb-8 pt-4">
							{#if hasBeenClicked}
								<div
									in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
									out:fly={{ duration: 300, y: 10, opacity: 0, easing: quintOut }}
								>
									<div
										class="mx-auto w-full columns-1 3xs:max-w-[375px] 3xs:columns-2 xs:max-w-full xs:columns-3 sm:columns-4"
									>
										{#each showEmbedding(outputEmbedding?.embeddings[0]) as num, i}
											<div
												class="mb-2.5 flex items-center justify-around gap-1 font-mono 3xs:justify-evenly"
											>
												<span class="select-none text-sm text-muted-foreground"
													>{i.toString().padStart(4, '0')}</span
												>
												<span
													class="select-none rounded-sm p-1 text-sm 3xs:hidden {num === 0
														? 'text-grey bg-white/10'
														: num > 0
															? 'bg-green-400/10 text-green-400'
															: 'bg-red-400/10 text-red-400'}"
													>{num.toFixed(num >= 0 ? 9 : 8).padEnd(25, '0')}</span
												>
												<span
													class="hidden select-none rounded-sm p-1 text-sm 3xs:block sm:hidden {num ===
													0
														? 'text-grey bg-white/10'
														: num > 0
															? 'bg-green-400/10 text-green-400'
															: 'bg-red-400/10 text-red-400'}">{num.toFixed(num >= 0 ? 9 : 8)}</span
												>
												<span
													class="hidden select-none rounded-sm p-1 text-sm sm:block {num === 0
														? 'text-grey bg-white/10'
														: num > 0
															? 'bg-green-400/10 text-green-400'
															: 'bg-red-400/10 text-red-400'}">{num.toFixed(num >= 0 ? 7 : 6)}</span
												>
											</div>
										{/each}
									</div>

									<div class="mt-8 flex w-full items-center justify-center">
										<Button variant="secondary" onclick={handleConfirm}>
											{#if hasConfirmed}
												<span>Nur 512 Werte anzeigen</span>
											{:else}
												<span>Alle 4096 Werte anzeigen</span>
											{/if}
										</Button>
									</div>
								</div>
							{:else}
								<LLMLoader
									in={{ start: 0, opacity: 0, duration: 1000, cssDelay: 1200 }}
									out={{ duration: 250 }}
								/>
							{/if}
						</div>
					</div>
				</ScrollArea>

				<div class="flex h-16 w-full items-center justify-center">
					{#if !hasBeenClicked}
						<span class="font-regular select-none text-sm text-muted-foreground"
							>Bitte gib erst einen Text ein</span
						>
					{:else}
						<Card.Title class="w-full max-w-96 mx-auto text-center">
							<span class="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap px-4"
								>{contextValue}</span
							>
						</Card.Title>
					{/if}
				</div>
			</Card.Header>
		</Card.Root>
	</div>

	<LLMNext url={data.url} prev="Affixe" next="Generierung" />
</section>

<Toaster position="bottom-right" />
