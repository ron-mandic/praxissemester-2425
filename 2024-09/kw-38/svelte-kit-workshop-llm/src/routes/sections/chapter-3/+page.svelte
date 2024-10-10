<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import LLMNext from '@/svelte/LLMNext.svelte';

	import Info from 'lucide-svelte/icons/info';
	import Reset from 'lucide-svelte/icons/rotate-ccw';
	import { Badge } from '@/ui/badge';
	import { ScrollArea } from '@/ui/scroll-area';
	import { Input } from '@/ui/input';
	import { Label } from '@/ui/label';
	import { formatSearch } from '$lib/ts/functions';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import { END_TOKEN, END_TOKEN_HTML } from '$lib/ts/constants.js';

	const { data } = $props();

	let contextValue = $state('im in');
	let searchValueHistory = $state('');
	let searchValueBigrams = $state('');
	let selectedWord = $state('');
	let currentView = $state('3');
	let outputStart = $state('');
	let outputsHistory = $state([] as { word: string; abs: number; rel: number }[]);
	let outputsBigrams = $state([] as { word: string; abs: number; rel: number }[]);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasWobble = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	// TODO: Check if this is necessary
	$effect(() => {
		return handleReset;
	});

	$effect(() => {
		if (outputsHistory.length === 100) {
			toast('Ganz schön ambitioniert. Ed Sheeran würde sich bestimmt über die Zeilen freuen!');
		}
	});

	function handlePressEnter(event: KeyboardEvent) {
		if (event.key === 'Enter') handleClick();
	}

	function getContextWindow(searchValue: string) {
		if (!searchValue) return 'Kein Kontext';

		const words = searchValue.trim().split(' ');
		const context = words[words.length - 1] || words[0];
		return context + ' (Kontext)';
	}

	async function handleClick() {
		const contexts = contextValue.trim().split(' '); // .map(preformat); this would yield no error making the whole lecture non-educational
		if (!hasBeenClicked) {
			hasBeenClicked = true;
			outputStart = `<span class="italic inline-block ${contexts.length > 1 ? 'mr-1' : 'mr-0'}">${contexts.slice(0, contexts.length - 1).join(' ')} </span>`;
		}

		const context = contexts[contexts.length - 1] || contextValue.trim();

		if (!isFetching) isFetching = true;
		const [dataHistory, dataBigram] = await Promise.all([
			fetch(`/api/bigram?context=${context}`).then((res) => res.json()),
			fetch(`/api/bigram?context=${context}&num_samples=-1`).then((res) => res.json())
		]);

		if (dataHistory.data === null || dataBigram.data === null) {
			hasWobble = hasEnded = true;
			setTimeout(() => {
				hasWobble = false;
			}, 2000);
			toast.error('Deine Eingabe taucht im Wörterbuch nicht auf');
			return;
		}

		const [keyH, absH, , relH] = dataHistory.data[0];
		const newContext = keyH.split('+')[1];
		contextValue = newContext;
		outputsHistory.push({ word: keyH, abs: absH, rel: relH });

		outputsBigrams = dataBigram.data.map(
			([key, abs, _, rel]: [string, number, number, number]) => ({ word: key, abs, rel })
		);
		isFetching = false;
	}

	function handleSetContext(event: MouseEvent) {
		// TODO: Check usability
		// const target = event.currentTarget as HTMLElement;
		// const context = target.dataset.context;
		// contextValue = context;
	}

	function handleSelectedWord(e: any) {
		const target = e.currentTarget as HTMLElement;
		const { word } = target.dataset;
		// selectedWord = word as string;

		if (selectedWord && selectedWord === word) {
			selectedWord = '';
		} else {
			selectedWord = word as string;
		}
	}

	function filterBy(arr: typeof outputsHistory, value: string) {
		if (!value) return arr;

		const filteredInputs = arr.filter(({ word }) => word.includes(value));
		return filteredInputs;
	}

	function ngramToText(outputsHistory: { word: string; abs: number; rel: number }[]) {
		const text = outputsHistory
			.map(({ word: ngram }, i, arr) => {
				const unigrams = ngram.split('+');

				const regEndToken = new RegExp(`\\[end\\]`, 'g');

				const context = !i
					? unigrams.join(' ').replace(regEndToken, END_TOKEN_HTML).trim()
					: unigrams[unigrams.length - 1];

				if (context === END_TOKEN) return END_TOKEN_HTML;
				return context;
			})
			.join(' ');
		return text;
	}

	function textToColoredNgrams(text: string, selectedWord: string) {
		const containsEndToken = selectedWord.includes('[end]');
		const selectedUnigrams = selectedWord
			.split('+')
			.map((unigram) => unigram.replace(/\[end\]/g, END_TOKEN_HTML));

		const regNormal = new RegExp(`${selectedUnigrams.join(' ')}`, 'g');
		const coloredText = text.replace(regNormal, (match) =>
			containsEndToken
				? `<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${match.replace(END_TOKEN_HTML, '[end]<br/>')}</mark>`
				: `<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${match}</mark>`
		);

		return coloredText;
	}

	function handleReset() {
		contextValue = '';
		searchValueHistory = '';
		searchValueBigrams = '';
		selectedWord = '';
		// currentView = '3';
		outputStart = '';
		outputsHistory = [];
		outputsBigrams = [];
		hasBeenClicked = false;
		hasBeenReset = true;
		hasWobble = false;
		hasEnded = false;
		isFetching = false;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Bigramm</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Gedächtniskünstler mit kurzem Gedächtnis</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2">
					Ein <HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse"
							>Bigramm <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-80">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p>
									Stelle dir nun ein Wörterbuch vor, in welchem Wortpaare eingetragen sind. Die
									Przentzahl davon gibt jetzt an, wie wahrscheinlich es ist, dass das zweite Wort
									auf das erste folgt.
								</p>
								<div class="w-full">
									<Table.Root>
										<Table.Caption class="mb-4">Ohne Zeilenumbrüche</Table.Caption>
										<Table.Header>
											<Table.Row>
												<Table.Head class="w-16">Bigramm</Table.Head>
												<Table.Head class="text-right">Anzahl</Table.Head>
												<Table.Head class="text-right">%</Table.Head>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">i+dont</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">201</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(0.00453 * 100).toFixed(3)}</Table.Cell
												>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">and+i</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">178</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(0.00401 * 100).toFixed(3)}</Table.Cell
												>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">in+love</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">153</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(0.00345 * 100).toFixed(3)}</Table.Cell
												>
											</Table.Row>
											<Table.Row>
												<Table.Cell>...</Table.Cell>
												<Table.Cell class="text-right font-mono">...</Table.Cell>
												<Table.Cell class="text-right font-mono">...</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">today+hold</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">1</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(2.2544e-5 * 100).toFixed(4)}</Table.Cell
												>
											</Table.Row>
										</Table.Body>
									</Table.Root>
								</div>
								<p>
									Um das zu veranschaulichen, klicke auf den Button unten, um zu sehen, welches Wort
									das Modell aus dem gegebenen Kontext vorhersagt und mit welcher Wahrscheinlichkeit
									dieses Wortpaar vorkommt.
								</p>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> ist das nächstgrößere Sprachmodell, bei dem die Wahrscheinlichkeit eines
					Wortes basierend auf dem vorhergehenden Wort berechnet wird. Im Vergleich zum Unigramm, das
					jedes Wort unabhängig von den vorherigen Wörtern betrachtet, sieht das Bigramm immer das letzte
					Wort als Kontext an, was zu sinnvolleren Vorhersagen führt.
				</p>

				<p>
					Unten ist dasselbe Modell wie vorhin verknüpft, nur mit dem Unterschied, dass es für die
					Vorhersage das letzte Wort als Kontext heranzieht. Das Modell beantwortet dir die Frage,
					welches Wort am wahrscheinlichsten auf das letzte Wort folgt.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="text" class="mb-2 block">
				<HoverCard.Root>
					<HoverCard.Trigger class="hover:animate-pulse"
						>Startkontext <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
					>
					<HoverCard.Content class="w-72">
						<div class="flex flex-col items-start gap-2 text-sm">
							<p>
								Ein Kontextfenster bezieht sich auf die Menge an Informationen, die ein Sprachmodell
								gleichzeitig betrachten kann, um Vorhersagen zu treffen oder eine Antwort zu
								generieren.
							</p>
							<p>
								Stell dir vor, du liest einen Text durch ein Schiebefenster. Du kannst immer nur
								einen bestimmten Teil des Textes auf einmal sehen. Dieser sichtbare Teil ist dein
								Kontextfenster. Wenn das Fenster zu klein ist, verlierst du den Überblick über den
								Zusammenhang. Ein größeres Fenster hingegen ermöglicht es dir, mehr Informationen
								gleichzeitig zu sehen und zu verstehen.
							</p>
							<Separator class="my-2" />
							<a
								class="flex items-center gap-2 text-muted-foreground"
								href="https://blog.google/technology/ai/long-context-window-ai-models/"
								target="_blank"
								rel="noopener noreferrer"
								>What is a long context window?<ExternalLink class="inline-block h-4 w-4" /></a
							>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			</Label>
			<Input
				bind:value={contextValue}
				id="text"
				class="w-full text-base {hasWobble ? 'animate-wobble' : 'animate-none'}"
				type="text"
				placeholder="i, shape, of, ..."
				pattern="[\w\s]+"
				maxlength={75}
				disabled={hasBeenClicked || hasEnded}
				onkeypress={handlePressEnter}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(contextValue as string).length || 0} / 75</small>
				<small>{getContextWindow(contextValue)}</small>
			</div>
			<Tabs.Root value="0" class="mt-10 w-full">
				<Tabs.List class="w-full">
					<Tabs.Trigger class="w-full" value="0">Bigramme</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="1">Output</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content class="h-full w-full" value="0">
					<ScrollArea class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0">
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#each outputsHistory as { word: ngram, rel }, i}
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Badge
											onclick={handleSelectedWord}
											data-word={ngram}
											variant="outline"
											class="box-border inline-block animate-bounceIn cursor-pointer text-base {selectedWord ===
											ngram
												? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
												: 'text-foreground'}">{ngram}</Badge
										>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p class="font-mono">{(rel * 100).toFixed(3)}%</p>
									</Tooltip.Content>
								</Tooltip.Root>
							{/each}
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
							{#if selectedWord}
								<span class="w-full whitespace-nowrap"
									>{@html outputStart +
										textToColoredNgrams(ngramToText(outputsHistory), selectedWord)}</span
								>
							{:else}
								<span class="w-full whitespace-nowrap"
									>{@html outputStart + ngramToText(outputsHistory)}</span
								>
							{/if}
						</div>
					</ScrollArea>
				</Tabs.Content>
			</Tabs.Root>
			<div class="mt-2 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs"
					>{outputsHistory.length
						? outputsHistory.length === 1
							? '1 Bigramm'
							: `${outputsHistory.length} Bigramme`
						: 'Noch keine Bigramme'}</small
				>
			</div>
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
				disabled={!contextValue.trim() || hasWobble}
				onclick={handleClick}
			>
				{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}
			</Button>
		</Card.Footer>
	</Card.Root>

	<div class="mt-10 w-full">
		{#if currentView === '3'}
			<div class="mb-2 flex w-full items-center justify-between">
				<Input
					bind:value={searchValueHistory}
					class="w-full text-base md:w-1/2"
					placeholder="Historie durchsuchen"
					type="search"
					disabled={!hasBeenClicked || hasEnded}
				/>
			</div>
		{:else if currentView === '4'}
			<div class="mb-2 flex w-full items-center justify-between">
				<Input
					bind:value={searchValueBigrams}
					class="w-full text-base md:w-1/2"
					placeholder="Nach Bigrammen suchen"
					type="search"
					disabled={!hasBeenClicked}
				/>
			</div>
		{/if}
	</div>

	<Tabs.Root class="w-full" bind:value={currentView}>
		<Tabs.List class="w-full">
			<Tabs.Trigger class="w-full" value="3">Historie</Tabs.Trigger>
			<Tabs.Trigger class="w-full" value="4">Alle Bigramme</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class="h-full w-full" value="3">
			<ScrollArea class="relative h-[450px] w-full rounded-md border px-4 pt-4" orientation="both">
				<Table.Root>
					<Table.Caption>
						{#if !outputsHistory.length}Noch keine Historie verfügbar{/if}
					</Table.Caption>
					<Table.Header class="sticky top-0">
						<Table.Row>
							<Table.Head>Bigramm</Table.Head>
							<Table.Head class="text-right">Anzahl</Table.Head>
							<Table.Head class="text-right">
								<HoverCard.Root>
									<HoverCard.Trigger class="whitespace-nowrap hover:animate-pulse"
										>Bedingte Wkt. <Info class="-mt-1 inline-block h-4 w-4" /></HoverCard.Trigger
									>
									<HoverCard.Content class="w-72">
										<div class="flex flex-col items-start gap-2 text-sm">
											<p>
												Die bedingte Wahrscheinlichkeit ist die Wahrscheinlichkeit, dass ein
												Ereignis eintritt, unter der Bedingung, dass ein anderes Ereignis bereits
												eingetreten ist.
											</p>
											<p>
												Am Beispiel der Bigramme ist der gebenene Kontext, sofern dieser in dem
												Wörterbuch vorhanden ist, immer das letzte Wort, welches das nächste
												bedingt. Diese Zahl orientiert sich nicht mehr an den Häufigkeiten des
												einzelnen Wortes, sondern sie gibt an, wie wahrscheinlich es ist, dass das
												nächste Wort auf das gegebene folgt.
											</p>
											<Separator class="my-2" />
											<a
												class="flex items-center gap-2 text-muted-foreground"
												href="https://de.wikipedia.org/wiki/Bedingte_Wahrscheinlichkeit"
												target="_blank"
												rel="noopener noreferrer"
												>Bedingte Wahrscheinlichkeit<ExternalLink class="inline-block h-4 w-4" /></a
											>
										</div>
									</HoverCard.Content>
								</HoverCard.Root>
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body
						>{#if outputsHistory.length}
							{#each filterBy(outputsHistory, searchValueHistory) as { word: ngram, abs, rel }, i}
								<Table.Row class="cursor-pointer" onclick={handleSelectedWord} data-word={ngram}>
									<Table.Cell>
										<Badge
											class="box-border cursor-pointer whitespace-nowrap text-sm transition-none {selectedWord ===
											ngram
												? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
												: 'text-foreground'}"
											variant="secondary">{@html formatSearch(ngram, searchValueHistory)}</Badge
										>
									</Table.Cell>
									<Table.Cell class="text-right font-mono">{abs}</Table.Cell>
									<Table.Cell class="text-right font-mono">{(rel * 100).toFixed(3)}</Table.Cell>
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
						{#if !outputsBigrams.length}Noch keine Bigramme verfügbar{/if}
					</Table.Caption>
					<Table.Header class="sticky top-0">
						<Table.Row>
							<Table.Head>Bigramm</Table.Head>
							<Table.Head class="text-right">Anzahl</Table.Head>
							<Table.Head class="text-right">
								<HoverCard.Root>
									<HoverCard.Trigger class="whitespace-nowrap hover:animate-pulse"
										>Bedingte Wkt. <Info class="-mt-1 inline-block h-4 w-4" /></HoverCard.Trigger
									>
									<HoverCard.Content class="w-72">
										<div class="flex flex-col items-start gap-2 text-sm">
											<p>
												Die bedingte Wahrscheinlichkeit ist die Wahrscheinlichkeit, dass ein
												Ereignis eintritt, unter der Bedingung, dass ein anderes Ereignis bereits
												eingetreten ist.
											</p>
											<p>
												Am Beispiel der Bigramme ist der gebenene Kontext, sofern dieser in dem
												Wörterbuch vorhanden ist, immer das letzte Wort, welches das nächste
												bedingt. Diese Zahl orientiert sich nicht mehr an den Häufigkeiten des
												einzelnen Wortes, sondern sie gibt an, wie wahrscheinlich es ist, dass das
												nächste Wort auf das gegebene folgt.
											</p>
											<Separator class="my-2" />
											<a
												class="flex items-center gap-2 text-muted-foreground"
												href="https://de.wikipedia.org/wiki/Bedingte_Wahrscheinlichkeit"
												target="_blank"
												rel="noopener noreferrer"
												>Bedingte Wahrscheinlichkeit<ExternalLink class="inline-block h-4 w-4" /></a
											>
										</div>
									</HoverCard.Content>
								</HoverCard.Root>
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body
						>{#if outputsBigrams.length}
							{#each filterBy(outputsBigrams, searchValueBigrams) as { word, abs, rel }, i}
								{@const words = word.split('+')}
								<Table.Row>
									<Table.Cell>
										<Tooltip.Root>
											<Tooltip.Trigger>
												<Badge
													onclick={handleSetContext}
													class="cursor-pointer whitespace-nowrap text-sm hover:animate-pulse"
													variant="secondary"
													data-context={words[words.length - 1] ?? 'N/A'}
													>{@html formatSearch(word, searchValueBigrams)}</Badge
												>
											</Tooltip.Trigger>
											<Tooltip.Content>
												<p class="flex items-center justify-between gap-x-1">
													<span>{words[0]} bedingt {words[words.length - 1]}</span>
													<!-- <Sparkles class="h-4 w-4 text-muted-foreground" /> -->
												</p>
											</Tooltip.Content>
										</Tooltip.Root>
									</Table.Cell>
									<Table.Cell class="text-right font-mono">{abs}</Table.Cell>
									<Table.Cell class="text-right font-mono">{(rel * 100).toFixed(3)}</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</ScrollArea>
		</Tabs.Content>
	</Tabs.Root>

	<LLMNext url={data.url} prev="Bigramm" next="N-Gramm" />
</section>

<Toaster position="bottom-right" />
