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
	import ExternalLink from 'lucide-svelte/icons/external-link';

	import { createSwapy } from 'swapy';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { EXAMPLE_OBJ_SONG, EXAMPLE_OBJ_SONG_PREFORMATTED } from '$lib/ts/constants.js';
	import { Label } from '@/ui/label/index.js';
	import Textarea from '@/ui/textarea/textarea.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { sparsevec } from 'drizzle-orm/pg-core';

	let contextValue = $state('');
	let selectedWord = $state('');
	let outputsTokens = $state([] as { details: any; fragments: any; word: string; nltk: any }[]);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	const { data } = $props();

	$effect(() => {
		return handleReset;
	});

	async function handlePress(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleClick();
		}
	}

	function handleSelect(event: Event) {
		const textContent = (event.target! as HTMLDivElement).textContent;

		if (textContent === selectedWord) {
			selectedWord = '';
		} else {
			selectedWord = textContent!;
		}
	}

	function toString(outputs: typeof outputsTokens, selectedWord: string) {
		return outputs
			.map(({ details, fragments: { prefix, infix, suffix }, nltk, word }) => {
				let arr = [prefix, infix, suffix].filter((x) => x);
				return arr.join('-');
			})
			.join(' ');
	}

	function highlightSelectedWord(str: string) {
		if (!selectedWord) return str;

		return str.replace(
			new RegExp(!/\w+/.test(selectedWord) ? '\\' + selectedWord : selectedWord, 'g'),
			`<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${selectedWord}</mark>`
		);
	}

	async function handleClick() {
		let body = JSON.stringify({ inputs: contextValue });
		let headers = { 'Content-Type': 'application/json' };

		isFetching = true;
		const response = await fetch('/api/tokenizer/affixes', { method: 'POST', body, headers });
		const data = await response.json();
		outputsTokens = data;
		console.log(data);

		isFetching = false;
	}

	function handleReset() {
		contextValue = '';
		selectedWord = '';
		outputsTokens = [];
		hasBeenClicked = false;
		hasBeenReset = true;
		hasEnded = false;
		isFetching = false;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(selectedWord);
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Affixe</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Aufbau von Wörtern</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2">
					<HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse"
							>Affixe <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-72">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p>
									Für die Tokenisierung in der Verarbeitung natürlicher Sprache (NLP) sind Affixe
									besonders wichtig, da sie helfen, die Struktur und Bedeutung von Wörtern zu
									erkennen. Eine effektive Tokenisierung muss oft Affixe korrekt identifizieren, um
									den Wortstamm herauszufiltern oder verwandte Wörter miteinander in Beziehung zu
									setzen.
								</p>
								<p>
									Das ist vor allem bei morphologisch reichen Sprachen von Bedeutung, wo ein
									einzelnes Wort durch verschiedene Affixe vielfältige Bedeutungen annehmen kann.
									Bei Techniken wie Byte-Pair Encoding (BPE) wird dies genutzt, um häufige
									Subwort-Einheiten, einschließlich Affixe, zu identifizieren, was die Modellierung
									von Wörtern effizienter macht.
								</p>
								<Separator class="my-2" />
								<a
									class="flex items-center gap-2 text-muted-foreground"
									href="https://de.wikipedia.org/wiki/Affix_(Linguistik)"
									target="_blank"
									rel="noopener noreferrer"
									>Affix (Linguistik) <ExternalLink class="inline-block h-4 w-4" /></a
								>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> sind sprachliche Elemente, die an den Wortstamm angefügt werden und dabei
					die Bedeutung oder grammatische Funktion eines Wortes verändern. Es gibt drei Hauptarten: Präfixe
					(am Wortanfang), Infixe (innerhalb eines Wortstamms) und Suffixe (am Wortende). Beispiele im
					Deutschen sind Präfixe wie "un-" (in "unglücklich") oder Suffixe wie "-heit" (in "Freiheit").
				</p>

				<p>
					Das Trennen von Wörtern anhand von den häufigsten Wortfragmenten ist oft effektiver als
					die bloße Trennung nach Leerzeichen oder Satzzeichen. Der Grund liegt in der besseren
					Erfassung der Wortbedeutung und Struktur, was besonders für die Verarbeitung natürlicher
					Sprache von Bedeutung ist.
				</p>
			</Card.Description>
		</Card.Header>
	</Card.Root>

	<Card.Root class="mt-6 w-full">
		<Card.Header class="gap-2">
			<Card.Title>Stamm- und Grundform</Card.Title>
			<Card.Description>
				<p>
					Um die Affixe herzuleiten, kann man sowohl regelbasierte Ansätze (Stemmer) als auch
					datenbankgestützte Methoden (Lemmatizer) nehmen. Der Stemmer entfernt die Affixe durch
					Anwendung von Regeln ohne Rücksicht auf sprachliche Korrektheit, während der Lemmatizer
					die Wörter in die korrekte Grundform zurückführt, indem es die Wörter sprachlich
					analysiert und in einer Datenbank nachschlägt.
				</p>

				<Accordion.Root class="-mb-2 mt-4">
					<Accordion.Item value="table" class="border-none">
						<Accordion.Trigger>
							<span class="flex items-center justify-start gap-x-2"
								><TableIcon class="h-4 w-4" /> Tabellenübersicht</span
							>
						</Accordion.Trigger>
						<Accordion.Content>
							<Table.Root class="mt-4">
								<Table.Header>
									<Table.Row>
										<Table.Head class="w-[40%]">Kriterien</Table.Head>
										<Table.Head>Stemmer</Table.Head>
										<Table.Head>Lemmatizer</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									<Table.Row>
										<Table.Cell>Funktionsbasis</Table.Cell>
										<Table.Cell>Regeln im Algorithmus</Table.Cell>
										<Table.Cell>Wörterbuch und linguistische Analysen</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Funktionsweise</Table.Cell>
										<Table.Cell>Regelbehaftetes Fragmentieren</Table.Cell>
										<Table.Cell>Analyse und Nachschlagen</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Ziel</Table.Cell>
										<Table.Cell>Kürzung auf eine Stamm- oder Basisform</Table.Cell>
										<Table.Cell>Finden der semantischen Grundform</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Genauigkeit</Table.Cell>
										<Table.Cell>Niedrig</Table.Cell>
										<Table.Cell>Hoch</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Schnelligkeit</Table.Cell>
										<Table.Cell>Schnell</Table.Cell>
										<Table.Cell>Langsam</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Vorteil</Table.Cell>
										<Table.Cell>Einfachheit</Table.Cell>
										<Table.Cell>Semantische Korrektheit</Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</Card.Description>
		</Card.Header>
	</Card.Root>

	<Card.Root class="dark my-8 w-full">
		<Card.Header class="gap-2 p-6">
			<div>
				<Card.Description>
					<p class="mb-3 text-muted-foreground">
						Die Trennung durch Leerzeichen und Satzzeichen ist mit dem Problem verbunden, dass man
						einzelne Fragmente wie n't oder 'll nicht als semantische Einheit erkennt. Das kann zu
						Problemen bei der Vorhersage oder Generierung von Texten führen.
					</p>

					<div class="relative my-8 h-full w-full rounded-md bg-muted/50 p-6">
						<LLMCode
							innerText={{
								text: 'low denser unhealthiest'
							}}
							language="json"
						/>
					</div>

					<p class="text-muted-foreground">
						Wenn man die Affixe einzelner Wörter analysiert, dann werden nicht nur Muster in dem
						Wortaufbau erkannt, die Bedeutung der Wörter besser verstanden, sondern auch das
						Vokabular kleiner ausfallen, da nur die wichtigsten Wortbausteine als Tokens genutzt
						werden müssen.
					</p>

					<ScrollArea
						class="relative my-8 h-[225px] w-full rounded-md bg-muted/50"
						orientation="vertical"
					>
						<div>
							<div class="h-full w-full p-6">
								<LLMCode
									innerText={{
										text: [['low'], ['dens', 'er'], ['un', 'health', 'iest']]
									}}
									language="json"
								/>
							</div>
						</div>
					</ScrollArea>

					<p class="text-muted-foreground">
						Wenn man für die Tokenisierung der Affixe auch noch den Stemmer und Lemmatizer
						heranzieht, dann kann man die Tokens noch weiter reduzieren und die semantische
						Bedeutung der Wörter besser erfassen. Im Hintergrund arbeitet man auch mit
						vorgespeicherten Listen mit den häufigsten Präfixen und Suffixen, um bei Bedarf die
						Tokens korrekt aufzuspalten.
					</p>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Wortbausteine mit großer Wirkung</Card.Title>
			<Card.Description>
				<p>
					Im unteren Eingabefeld kannst du einen beliebigen Text eingeben, um die Tokenisierung
					durch das dahitnerliegende Modell zu testen, welches die häufigsten Endungen gespeichert
					hat und sowohl Stamm- als auch Grundformen des Wortes mit angibt. <strong
						>Es kann vorkommen, dass einzelne Ausgaben grammatikalisch und sprachlich nicht korrekt
						sind</strong
					>
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="text" class="mb-2 block">Ausgangstext (en-US)</Label>
			<Textarea
				bind:value={contextValue}
				class="max-h-72 min-h-36 w-full text-base"
				id="text"
				placeholder="The unkindest, most disrespectful comments can unintentionally hurt someone's feelings."
				maxlength={512}
				disabled={hasBeenClicked}
				onkeypress={handlePress}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(contextValue as string).length || 0} / 512</small>
			</div>

			<Label for="text" class="mb-2 mt-8 block">Tokens</Label>
			<Tabs.Root value="0" class="w-full">
				<Tabs.List class="w-full">
					<Tabs.Trigger class="w-full" value="0">Tokens</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="1">Output</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content class="h-full w-full" value="0">
					<ScrollArea
						class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0"
						orientation="both"
					>
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#if outputsTokens.length === 0}
								<p
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
								>
									Hier werden die Tokens angezeigt
								</p>
							{:else}
								{#each outputsTokens as { details, fragments: { prefix, infix, suffix }, nltk, word }, i}
									<Tooltip.Root>
										<Tooltip.Trigger>
											<Badge
												class="group box-border flex animate-bounceIn cursor-pointer items-center justify-between gap-x-2 px-0.5 animate-delay-[{i *
													50}ms] pointer-events-auto whitespace-nowrap text-base"
												variant="outline"
											>
												{#if prefix}
													<Badge
														class="box-border whitespace-nowrap text-base {selectedWord === prefix
															? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
															: 'text-foreground'} group-hover:animate-pulse group-hover:bg-blue-100 group-hover:text-blue-700"
														variant="secondary"
														onclick={handleSelect}
													>
														{prefix}
													</Badge>
												{/if}

												{#if infix}
													<Badge
														class="box-border whitespace-nowrap text-base {selectedWord === infix
															? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
															: 'text-foreground'} group-hover:animate-pulse group-hover:bg-blue-100 group-hover:text-blue-700"
														variant="secondary"
														onclick={handleSelect}
													>
														{infix}
													</Badge>
												{/if}

												{#if suffix}
													<Badge
														class="box-border whitespace-nowrap text-base {selectedWord === suffix
															? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
															: 'text-foreground'} group-hover:animate-pulse group-hover:bg-blue-100 group-hover:text-blue-700"
														variant="secondary"
														onclick={handleSelect}
													>
														{suffix}
													</Badge>
												{/if}
											</Badge>
										</Tooltip.Trigger>
										<Tooltip.Content class="p-0">
											<Table.Root class="m-0 p-0 text-sm">
												<Table.Caption class="mb-4">Für Auswahl klicken</Table.Caption>
												<Table.Body>
													<Table.Row>
														<Table.Cell>Wort</Table.Cell>
														<Table.Cell>{word}</Table.Cell>
													</Table.Row>
													<Table.Row>
														<Table.Cell>Wortart</Table.Cell>
														<Table.Cell>{details.group}</Table.Cell>
													</Table.Row>
													<Table.Row>
														<Table.Cell>Stammform</Table.Cell>
														<Table.Cell>{nltk.stem ? nltk.stem : 'N/A'}</Table.Cell>
													</Table.Row>
													<Table.Row>
														<Table.Cell>Grundform (Lemma)</Table.Cell>
														<Table.Cell>{nltk.lemma ? nltk.lemma : 'N/A'}</Table.Cell>
													</Table.Row>
													<Table.Row>
														<Table.Cell>Großbuchstaben</Table.Cell>
														<Table.Cell>
															{#if !details.capitalizations.some(Boolean)}
																<span>Keine</span>
															{:else}
																<span class="font-mono"
																	>{details.capitalizations.length > 15
																		? details.capitalizations.slice(0, 14).concat('...').join('-')
																		: details.capitalizations.join('-')}</span
																>
															{/if}
														</Table.Cell>
													</Table.Row>
												</Table.Body>
											</Table.Root>
										</Tooltip.Content>
									</Tooltip.Root>
								{/each}
							{/if}
						</div>
					</ScrollArea>
				</Tabs.Content>
				<Tabs.Content class="h-full w-full" value="1">
					<ScrollArea
						class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0"
						orientation="both"
					>
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#if outputsTokens.length === 0}
								<p
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
								>
									Hier wird der Output angezeigt
								</p>
							{:else}
								<span>{@html highlightSelectedWord(toString(outputsTokens, selectedWord))}</span>
							{/if}
						</div>
					</ScrollArea>
				</Tabs.Content>
			</Tabs.Root>
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
				disabled={!contextValue.trim()}
				onclick={handleClick}
			>
				{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}
			</Button>
		</Card.Footer>
	</Card.Root>

	<LLMNext url={data.url} prev="Zeichensetzung" next="Byte-Pair" />
</section>

<Toaster position="bottom-right" />
