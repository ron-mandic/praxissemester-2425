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
	import MoveRight from 'lucide-svelte/icons/move-right';
	import * as Accordion from '$lib/components/ui/accordion';
	import { sparsevec } from 'drizzle-orm/pg-core';

	let contextValue = $state('');
	let currentView = $state('3');
	let searchValueAll = $state('');
	let searchValueOpen = $state('');
	let selectedWord = $state('');
	let iterations = $state(0);
	let outputsTokens = $state(
		{} as {
			tokens: { token: string; count: number }[];
			stats: { token: string; count: number }[];
			iterations: number;
			rules: any[];
		}
	);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	const { data } = $props();
	const END_TOKEN = '</w>';

	$effect(() => {
		return handleReset;
	});

	const filterBy = (outputTokens: any[], searchValue: string) => {
		if (!searchValue) return outputTokens;
		return outputTokens.filter(({ token }) =>
			token.toLowerCase().includes(searchValue.toLowerCase())
		);
	};

	const getState = (str: string) => {
		// Check if the token has no whitespace, other symbols are allowed
		if (!/\s+/.test(str)) {
			return 'Abgearbeitet';
		}

		return 'In Bearbeitung';
	};

	async function handlePress(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleClick();
		}
	}

	function handleSelectedWord(event: Event) {
		const word = (event.currentTarget! as HTMLDivElement).dataset.token;

		if (word === selectedWord) {
			selectedWord = '';
		} else {
			selectedWord = word!;
		}
	}

	function toString(outputs: typeof outputsTokens, selectedWord: string) {
		// Provided that selectedWord does not contain the END_TOKEN anymore
		return outputs.tokens
			.map(({ token }) => {
				return token;
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
		if (hasBeenClicked && !hasEnded) {
			iterations += 1;
		}
		if (!hasBeenClicked) {
			hasBeenClicked = true;
		}

		let body = JSON.stringify({ inputs: contextValue, iterations });
		let headers = { 'Content-Type': 'application/json' };

		isFetching = true;
		const response = await fetch('/api/tokenizer/bpe', { method: 'POST', body, headers });
		const data = await response.json();

		if (data.info !== undefined) {
			if (!hasEnded) {
				toast(
					'Es gibt keine freien Tokens mehr, die weiterverarbeitet werden können. Bitte starte den Prozess erneut.'
				);
				hasEnded = true;
				outputsTokens = data;
			}
		} else {
			outputsTokens = data;
		}

		isFetching = false;
	}

	function handleReset() {
		contextValue = '';
		// currentView = '3';
		selectedWord = '';
		searchValueAll = '';
		searchValueOpen = '';
		iterations = 0;
		outputsTokens = {} as {
			tokens: { token: string; count: number }[];
			stats: { token: string; count: number }[];
			iterations: number;
			rules: any[];
		};
		hasBeenClicked = false;
		hasBeenReset = false;
		hasEnded = false;
		isFetching = false;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(outputsTokens);
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">
		Byte-Pair <span class="hidden whitespace-nowrap md:inline-block">Encoding</span>
	</h2>

	<Card.Root class="mt-6 w-full">
		<Card.Header class="gap-2">
			<Card.Title>Fortführung der Affixmethode</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2">
					Affixe zeigten uns, dass die Tokenisierung von Wörtern und Sätzen nicht nur auf
					Leerzeichen basieren sollte. Dennoch stoßen auch sie an ihre Grenzen, wenn es um die
					Handhabung seltener, unbekannter oder sogar neuer Wörter geht, da sie oft nicht in der
					Lage sind, die Vielfalt und Variabilität der Sprache vollständig abzubilden.
				</p>

				<p>
					Hier kommt
					<HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse"
							>Byte Pair Encoding <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-72">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p>
									Der Algorithmus beginnt mit allen einzigartigen Zeichen als 1-Zeichen N-Grammen
									und fügt dann schrittweise die häufigsten benachbarten Zeichenpaare zu neuen
									N-Grammen zusammen.
								</p>
								<p>
									Dieser Prozess wird wiederholt, bis eine festgelegte Bedingung erreicht ist, wobei
									neue Wörter jederzeit aus den finalen Vokabeltokens und den ursprünglichen Zeichen
									gebildet werden können.
								</p>

								<div
									class="mt-3 flex h-12 w-full flex-col items-center justify-center rounded-xl bg-muted"
								>
									<span class="font-mono text-sm">{'M i s s i s s i p p i </w>'}</span>
									<span class="font-mono text-sm">{'i s -> is'}</span>
								</div>
								<div
									class="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-muted"
								>
									<span class="font-mono text-sm">{'M is s is s i p p i </w>'}</span>
									<span class="font-mono text-sm">{'is s -> iss'}</span>
								</div>
								<div
									class="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-muted"
								>
									<span class="font-mono text-sm">{'M iss iss i p p i </w>'}</span>
									<span class="font-mono text-sm">{'M iss -> Miss'}</span>
								</div>
								<div
									class="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-muted"
								>
									<span class="font-mono text-sm">{'Miss iss i p p i </w>'}</span>
									<span class="font-mono text-sm">{'Miss iss -> Mississ'}</span>
								</div>
								<div class="mb-3 flex h-12 w-full items-center justify-center rounded-xl bg-muted">
									<span class="font-mono text-sm">{'...'}</span>
								</div>
								<p>
									Man hört nach einer festgelegten Anzahl von Iterationen oder Vokabeln auf, da man
									bis zum Ende wieder zur Ausgangsgröße zurückkehren würde. Expert:innen sind sich
									uneins darüber, welche Maßnahme die beste ist.
								</p>

								<Separator class="my-2" />
								<a
									class="flex items-center gap-2 text-muted-foreground"
									href="https://en.wikipedia.org/wiki/Byte_pair_encoding"
									target="_blank"
									rel="noopener noreferrer"
									>Byte pair encoding <ExternalLink class="inline-block h-4 w-4" /></a
								>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> ins Spiel. BPE identifiziert häufige Buchstabenfolgen und fasst sie zu neuen
					Tokens in Form von
					<a
						class="inline-block items-center gap-2 text-muted-foreground"
						href="/sections/chapter-4"
						target="_blank"
						rel="noopener noreferrer"
						>N-Grammen <ExternalLink class="-mt-0.5 inline-block h-4 w-4" /></a
					> zusammen. Dadurch können sowohl gängige als auch weniger bekannte Wörter effektiv erfasst
					werden. Diese Methode überwindet die Einschränkungen der affixbasierten Tokenisierung, indem
					sie eine flexiblere und anpassungsfähigere Tokenisierung ermöglicht, die die Vielfalt der menschlichen
					Sprache besser berücksichtigt und leistungsfähigere Sprachmodelle unterstützt.
				</p>
			</Card.Description>
		</Card.Header>
	</Card.Root>

	<Card.Root class="dark my-8 w-full">
		<Card.Header class="gap-2 p-6">
			<div>
				<Card.Description>
					<p class="mb-3 text-muted-foreground">
						Wie in der Einleitung beschrieben, stoßen auch Affixe an ihre Grenzen, wenn es darum
						geht, seltene, unbekannte oder gar neue Wörter zu behandeln. Die Tokenisierung sollte
						daher nicht aus festen Mustern oder einer Datenbank generiert werden, sondern auf der
						Grundlage des Korpus selbst.
					</p>

					<div class="relative my-8 h-full w-full rounded-md bg-muted/50 p-6">
						<LLMCode
							innerText={{
								input: 'The small cat quickly sat on the wooliful mat in the mewiful corner of the room.'
							}}
							language="json"
						/>
					</div>

					<p class="text-muted-foreground">
						In diesem Satz sind "wooliful" und "mewiful" erfundene Wörter, die durch Kombinationen
						von existierenden Wörtern entstanden sind, was die Notwendigkeit von BPE unterstreicht.
						BPE kann diese neuen Wörter effizient verarbeiten, indem es die häufigsten Kombinationen
						analysiert und daraus neue Tokens generiert.
					</p>

					<ScrollArea
						class="relative my-8 h-[225px] w-full rounded-md bg-muted/50"
						orientation="vertical"
					>
						<div>
							<div class="h-full w-full p-6">
								<LLMCode
									innerText={{
										iterations: 20,
										tokens: {
											'The</w>': 1,
											'small</w>': 1,
											'cat</w>': 1,
											'quic k l y </w>': 1,
											's at</w>': 1,
											'o n</w>': 1,
											'the</w>': 3,
											'w oo l iful</w>': 1,
											'm at</w>': 1,
											'i n</w>': 1,
											'm e w iful</w>': 1,
											'c o r n e r </w>': 1,
											'o f </w>': 1,
											'r oo m </w>': 1
										},
										stats: '...'
									}}
									language="json"
								/>
							</div>
						</div>
					</ScrollArea>

					<p class="mb-3 text-muted-foreground">
						Durch das wiederholte Kombinieren von den häufigsten Wortteilen entstehen neue Tokens.
						Nach nur 20 Iterationen kann man schon erkennen, dass BPE die neuen Wörter "wooliful"
						und "mewiful" als Tokens entsprechend mit den anderen verarbeitet, indem es "iful" als
						häufigste Endung mit den Wörtern "wool" und "mew" kombiniert.
					</p>

					<p class="text-muted-foreground">
						BPE kann aber nur dann punkten, wenn es genügend Iterationen durchläuft und vortrainiert
						auf einem großen Korpus basiert. Die Anzahl der Iterationen ist ein wichtiger
						Hyperparameter, der je nach Korpus und Anwendungszweck variiert.
					</p>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Die Geschichte der Buchstaben-BFFs</Card.Title>
			<Card.Description>
				<p class="text-balance">
					Im unteren Eingabefeld wirst du deinen Korpus eingeben können, mit dessen Hilfe Byte-Pair
					ganz spezielle Wortkombinationen für dich identifizieren und zu neuen Tokens zusammenfügen
					wird. Durch Leerzeichen voneinander getrennt, kannst du dann die Buchstabengruppen als
					eigene Tokens verstehen und so die Vielfalt der Sprache besser abbilden - und das
					sprachübergreifend!
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
				placeholder="The small cat quickly sat on the wooliful mat in the mewiful corner of the room"
				maxlength={1024}
				disabled={hasBeenClicked}
				onkeypress={handlePress}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(contextValue as string).length || 0} / 1024</small>
				{#if hasBeenClicked}
					<small class="font-mono text-xs">
						{#if !iterations}
							Start
						{:else}
							Iterationen: {iterations}
						{/if}
					</small>
				{/if}
			</div>

			<Label for="text" class="mb-2 mt-8 block">Regel</Label>
			<div class="div flex h-20 w-full items-center justify-center rounded-md bg-muted/40">
				{#if outputsTokens?.rules && iterations}
					{@const rule = outputsTokens?.rules[outputsTokens?.rules.length - 1]}
					<HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse">
							<div class="flex items-center justify-center gap-x-2">
								<span>{rule?.old.join(' ')}</span>
								<MoveRight class="h-4 w-4" />
								<span>{rule?.new}</span>
							</div>
						</HoverCard.Trigger>
						<HoverCard.Content class="w-72">
							<p>
								Aus der Wortfolge <span>"{rule?.old.join(' ')}""</span>
								folgt das neue Token <span>"{rule?.new}"</span>
							</p>
						</HoverCard.Content>
					</HoverCard.Root>
				{:else}
					<p class="select-none whitespace-nowrap text-sm text-muted-foreground md:text-base">
						Noch keine Regel erfasst
					</p>
				{/if}
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
							{#if !outputsTokens?.tokens}
								<p
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
								>
									Hier werden die Tokens angezeigt
								</p>
							{:else}
								{#each outputsTokens.tokens! as { token, count }, i}
									{@const state = getState(token)}
									<Tooltip.Root>
										<Tooltip.Trigger>
											<Badge
												class="box-border whitespace-nowrap text-base {hasBeenClicked
													? 'animate-bounceIn'
													: 'animate-none'} {state === 'Abgearbeitet'
													? 'opacity-40'
													: 'opacity-100'} {selectedWord && token === selectedWord
													? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
													: 'text-foreground'} group-hover:animate-pulse group-hover:bg-blue-100 group-hover:text-blue-700"
												variant="secondary"
												onclick={handleSelectedWord}
												data-token={token}
											>
												{token}
											</Badge>
										</Tooltip.Trigger>
										<Tooltip.Content class="p-0">
											<Table.Root class="m-0 p-0 text-sm">
												<Table.Body>
													<Table.Row>
														<Table.Cell>Anzahl</Table.Cell>
														<Table.Cell>{count}</Table.Cell>
													</Table.Row>
													<Table.Row>
														<Table.Cell>Zustand</Table.Cell>
														<Table.Cell>{state}</Table.Cell>
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
						<!-- TODO: Make uniform colored output across all interfaces -->
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#if !outputsTokens.tokens}
								<p
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
								>
									Hier wird der Output angezeigt
								</p>
							{:else}
								<span
									>{@html highlightSelectedWord(
										toString(outputsTokens, selectedWord.replace(END_TOKEN, ''))
									)}</span
								>
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
				disabled={!contextValue.trim() || hasEnded}
				onclick={handleClick}
			>
				{#if hasBeenClicked}
					<span>Erneut <span class="hidden md:inline-block">zusammenführen</span></span>
				{:else}
					<span>Zusammenführen</span>
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>

	<div class="mt-10 w-full">
		{#if currentView === '3'}
			<div class="mb-2 flex w-full items-center justify-between">
				<Input
					bind:value={searchValueAll}
					class="w-full text-base md:w-1/2"
					placeholder="Alle Tokens durchsuchen"
					type="search"
					disabled={!hasBeenClicked || hasEnded}
				/>
			</div>
		{:else if currentView === '4'}
			<div class="mb-2 flex w-full items-center justify-between">
				<Input
					bind:value={searchValueOpen}
					class="w-full text-base md:w-1/2"
					placeholder="Alle offenen Tokens durchsuchen"
					type="search"
					disabled={!hasBeenClicked}
				/>
			</div>
		{/if}
	</div>

	<Tabs.Root class="w-full" bind:value={currentView}>
		<Tabs.List class="w-full">
			<Tabs.Trigger class="w-full" value="3">
				<HoverCard.Root>
					<HoverCard.Trigger class="whitespace-nowrap hover:animate-pulse"
						>Alle Tokens <Info class="-mt-1 inline-block h-4 w-4" /></HoverCard.Trigger
					>
					<HoverCard.Content class="w-72">
						<div class="flex flex-col items-start gap-2 text-sm">
							<p>
								In dieser Tabelle sind alle Tokens aufgeführt, die bereits von BPE verarbeitet
								wurden und noch verarbeitet werden können. BPE kann die Token-Strings nur
								verarbeiten, solange Leerzeichen vorhanden sind. Wenn diese nicht mehr vorhanden
								sind, können keine Wortkombinationen mehr gebildet werden.
							</p>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			</Tabs.Trigger>
			<Tabs.Trigger class="w-full" value="4">
				<HoverCard.Root>
					<HoverCard.Trigger class="whitespace-nowrap hover:animate-pulse"
						>Offene Tokens <Info class="-mt-1 inline-block h-4 w-4" /></HoverCard.Trigger
					>
					<HoverCard.Content class="w-72">
						<div class="flex flex-col items-start gap-2 text-sm">
							<p>
								In dieser Tabellenansicht werden die Wortkombinationen angezeigt, die noch
								Leerzeichen enthalten und somit weiterverarbeitet werden können. Die Token sind nach
								ihrer Häufigkeit sortiert und können auch durchsucht werden.
							</p>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class="h-full w-full" value="3">
			<ScrollArea class="relative h-[450px] w-full rounded-md border px-4 pt-4" orientation="both">
				<Table.Root>
					<Table.Caption>
						{#if !outputsTokens.tokens}Keine Tokens verfügbar{/if}
					</Table.Caption>
					<Table.Header class="sticky top-0">
						<Table.Row>
							<Table.Head class="md:w-1/2">Token</Table.Head>
							<Table.Head>Bearbeitungszustand</Table.Head>
							<Table.Head class="text-right">Anzahl</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body
						>{#if outputsTokens?.tokens?.length}
							{#each filterBy(outputsTokens?.tokens, searchValueAll) as { token, count }, i}
								{@const state = getState(token)}
								<Table.Row
									class="cursor-pointer {state === 'Abgearbeitet' ? 'opacity-40' : 'opacity-100'}"
									onclick={handleSelectedWord}
									data-token={token}
								>
									<Table.Cell>
										<Badge
											class="box-border cursor-pointer whitespace-break-spaces text-sm transition-none {selectedWord &&
											token === selectedWord
												? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
												: 'text-foreground'}"
											variant="secondary"
											>{@html formatSearch(token + '&lt;&#47;w&gt;', searchValueAll)}</Badge
										>
									</Table.Cell>
									<Table.Cell>{state}</Table.Cell>
									<Table.Cell class="text-right font-mono">{count}</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</ScrollArea>
		</Tabs.Content>
		<Tabs.Content class="h-full w-full" value="4">
			<ScrollArea class="relative h-[450px] w-full rounded-md border px-4 pt-4" orientation="both">
				<Table.Root>
					<Table.Caption>
						{#if !outputsTokens?.tokens?.length}Keine offenen Tokens verfügbar{/if}
						{#if hasEnded}
							<p class="text-muted-foreground">Keine weiteren Tokens mehr verfügbar</p>
						{/if}
					</Table.Caption>
					<Table.Header class="sticky top-0">
						<Table.Row>
							<Table.Head>Token</Table.Head>
							<Table.Head class="text-right">Anzahl</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body
						>{#if outputsTokens?.tokens?.length}
							{#each filterBy( outputsTokens?.tokens.filter(({ token }) => getState(token) === 'In Bearbeitung'), searchValueOpen ) as { token, count }, i}
								<Table.Row class="cursor-pointer" onclick={handleSelectedWord} data-token={token}>
									<Table.Cell>
										<Badge
											class="cursor-pointer whitespace-break-spaces text-sm {selectedWord &&
											token === selectedWord
												? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
												: 'text-foreground'}"
											variant="secondary"
											>{@html formatSearch(token + '&lt;&#47;w&gt;', searchValueOpen)}</Badge
										>
									</Table.Cell>
									<Table.Cell class="text-right">{count}</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>

	<LLMNext url={data.url} prev="Affixe" next="Generierung" />
</section>

<Toaster position="bottom-right" />
