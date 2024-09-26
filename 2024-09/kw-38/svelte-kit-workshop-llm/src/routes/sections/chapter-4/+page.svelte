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
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import { END_TOKEN, END_TOKEN_HTML } from '$lib/ts/constants.js';
	import { Textarea } from '@/ui/textarea';

	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { tick } from 'svelte';

	const { data } = $props();
	const MAX_CONTEXT_LENGTH = 4; // the maximum context length you can send to the server e.g. 4 for evaluating pentagrams

	let seed = $state(null as number | null);
	let contextValue = $state('');
	let contextWords = $state(0);
	let searchValueHistory = $state('');
	let searchValueNgrams = $state('');
	let selectedWord = $state('');
	let scene = $state(0);
	let outputStart = $state('');
	let outputsHistory = $state([] as { word: string; abs: number; rel: number }[]);
	let outputsNgrams = $state([] as { word: string; abs: number; rel: number }[]);
	let hasBeenReset = $state(false);
	let hasBeenClicked = $state(false);
	let hasWobble = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	const getNewContext = (words: string[], context_length: number) => {
		// e.g words = ['ich', 'bin', 'ein', 'test'] context_length = 4
		// result -> 'bin+ein+test'

		// e.g. words = ["im", "in", "love", "with", "your"] context_length = 4
		if (words.length > context_length) {
			return words.slice(words.length - context_length, words.length).join('+');
		}

		// e.g. words = ["im", "in", "love"] context_length = 4
		const newContext = words
			.slice(words.length - context_length - (context_length - 1), words.length)
			.join('+');
		return newContext;
	};

	function getModelName(contextValue: string) {
		if (!contextValue) return;
		const context_length = contextValue.trim().split(/[\s\+]/g).length;

		switch (context_length) {
			case 1:
				return 'Bigramm (Kontext: 1 Wort)';
			case 2:
				return 'Trigramm (Kontext: 2 Wörter)';
			case 3:
				return 'Tetragramm (Kontext: 3 Wörter)';
			case 4:
				return 'Pentagramm (Kontext: 4 Wörter)';
			default:
				return 'Multigramm (Kontext: N-1 Wörter)';
		}
	}

	function handleInputSeed() {
		tick().then(() => {
			if (seed && seed! > 9999) {
				seed = 9999;
			}
		});
	}
	const incrementSeed = (e: MouseEvent) => {
		seed = seed! + 1;
	};
	const decrementSeed = (e: MouseEvent) => {
		seed = seed! - 1;
	};

	async function handleClick() {
		// TODO: Check if duplicates are being creatd by the user
		// const alreadyAdded = inputs.some((input) => input.seed === seed && input.text === text);
		// if (alreadyAdded) {
		// 	toast(
		// 		'Deine jetzigen Werte tauchen schon in der Historie auf. Versuche es erneut mit anderen Werten'
		// 	);
		// 	return;
		// }

		const contexts = contextValue.trim().split(/[\s\+]/g); // .map(preformat); this would yield no error making the whole lecture non-educational
		const context_length = Math.min(MAX_CONTEXT_LENGTH, contexts.length);
		const context =
			contexts.length <= MAX_CONTEXT_LENGTH
				? contextValue.split(/[\s\+]/g).join('+')
				: getNewContext(contexts, context_length);

		if (!hasBeenClicked) {
			hasBeenClicked = true;
			// outputStart = `<span class="italic inline-block ${contexts.length > 1 ? 'mr-1' : 'mr-0'}">${contexts.slice(0, contexts.length - context_length - 1).join(' ')} </span>`;
		}

		if (!isFetching) isFetching = true;
		const [dataHistory, dataBigram] = await Promise.all([
			fetch(
				`/api/ngram?context=${context.replace(/[\s\+]/g, '%2B')}&context_length=${context_length}`
			).then((res) => res.json()),
			fetch(
				`/api/ngram?context=${context.replace(/[\s\+]/g, '%2B')}&context_length=${context_length}&num_samples=-1`
			).then((res) => res.json())
		]);

		if (dataHistory.data === null || dataBigram.data === null) {
			hasWobble = hasEnded = true;
			setTimeout(() => {
				hasWobble = false;
			}, 2000);
			toast.error('Deine Eingabe taucht im Wörterbuch nicht auf');
			return;
		}

		console.log(dataHistory, dataBigram);

		const [keyH, absH, , relH] = dataHistory.data;

		const keyHWords = keyH.split(/[\s\+]/g);
		contextValue = getNewContext(keyHWords, context_length);

		outputsHistory.push({
			word: keyHWords.join('+'),
			abs: absH,
			rel: relH
		});
		outputsNgrams = dataBigram.data.map(([key, abs, _, rel]) => ({ word: key, abs, rel }));
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

	const toRight = () => {
		scene = -1;
	};

	const toLeft = () => {
		scene = 0;
	};

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
		console.log(selectedUnigrams);

		const regNormal = new RegExp(`${selectedUnigrams.join(' ')}`, 'g');
		const coloredText = text.replace(regNormal, (match) =>
			containsEndToken
				? `<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${match.replace(END_TOKEN_HTML, '[end]<br/>')}</mark>`
				: `<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${match}</mark>`
		);

		return coloredText;
	}

	function handleReset() {
		seed = null;
		hasBeenClicked = false;
		hasBeenReset = true;
		hasEnded = false;
		contextValue = '';
		contextWords = 0;
		outputStart = '';
		outputsHistory = [];
		outputsNgrams = [];
		selectedWord = '';
		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(outputsNgrams);
</script>

<section class="h-full w-full">
	<h2 class="mb-6 px-2 text-4xl font-bold md:px-0">N-Gramm</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<div class="flex items-center justify-between">
				<Card.Title>Kontext <span class="whitespace-nowrap">gefällig?</span></Card.Title>
				<div class="flex items-center gap-3">
					<Label for="seed" class="text-sm text-muted-foreground">
						<HoverCard.Root>
							<HoverCard.Trigger class="hover:animate-pulse">
								<span class="inline-flex items-center justify-between gap-1"
									>Seed <Info class="inline-block h-4 w-4" /></span
								>
							</HoverCard.Trigger>
							<HoverCard.Content>
								<div class="flex flex-col items-start gap-2 text-sm">
									<p>
										Eine Seed ist ein Startwert, den ein Zufallsgenerator verwendet, um eine
										scheinbar zufällige Sequenz von Zahlen zu erzeugen.
									</p>
									<p>
										Stell dir vor, du mischst ein Kartendeck. Wenn du jedes Mal mit der gleichen
										Seed startest, wird das Deck immer auf genau die gleiche Weise gemischt. Ohne
										Seed würde die Reihenfolge der Karten jedes Mal anders sein. Die Seed sorgt also
										dafür, dass ein zufälliger Prozess reproduzierbar ist und bleibt.
									</p>
									<p>
										Wähle hier eine Seed von <code class="bg-muted px-1 font-mono">0</code> bis
										<code class="bg-muted px-1 font-mono">9999</code> aus, um die Vorhersagen mit einem
										Startwert zu versehen.
									</p>
									<Separator class="my-2" />
									<a
										class="flex items-center gap-2 text-muted-foreground"
										href="https://de.wikipedia.org/wiki/Seed_key"
										target="_blank"
										rel="noopener noreferrer"
										>Seed (key) <ExternalLink class="inline-block h-4 w-4" /></a
									>
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					</Label>
					<div class="relative">
						<Button
							variant="secondary"
							class="absolute right-[.25rem] top-[.25rem] h-1.5 w-1.5 rounded-sm p-2 transition-transform ease-out active:-translate-y-[.125rem]"
							onclick={incrementSeed}
						>
							<ChevronUp class="absolute h-[.875rem] w-[.875rem] text-foreground" />
						</Button>
						<Button
							variant="secondary"
							class="absolute bottom-[.25rem] right-[.25rem] h-1.5 w-1.5 rounded-[.75rem] p-2 transition-transform ease-out active:translate-y-[.125rem]"
							onclick={decrementSeed}
						>
							<ChevronDown class="absolute h-[.875rem] w-[.875rem] text-foreground" />
						</Button>
						<Input
							bind:value={seed}
							class="max-w-32"
							type="number"
							id="seed"
							min={0}
							max={9999}
							maxlength={4}
							pattern="\d{4}"
							oninput={handleInputSeed}
						/>
					</div>
				</div>
			</div>
			<Card.Description>
				<p class="mt-2">
					Sprachmodelle sagen das nächste Wort voraus, indem sie jedem möglichen nächsten Wort eine
					Wahrscheinlichkeit zuordnen. Das <HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse"
							>N-Gramm <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-80">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p class="text-balance">
									Ein N-Gramm ist das Ergebnis der Zerlegung eines Textes in einzelne Bausteine. Das
									zusammengefasste N-Gramm besteht aus <code class="bg-muted px-1 font-mono">N</code
									> einzelnen Wörtern oder auch kleineren Einheiten.
								</p>
								<p>
									Zum Beispiel bildet der Satz <em>Die Sonne scheint</em> bei einem 2-Gramm
									(Bigramm) <Badge class="px-1.5 py-0.5" variant="secondary">Die Sonne</Badge> und <Badge
										class="px-1.5 py-0.5"
										variant="secondary">Sonne scheint</Badge
									> als Paare. Der ganze Satz alleine würde ein 3-Gramm (Trigramm) bilden.
								</p>
								<p>
									Wenn <code class="bg-muted px-1 font-mono">N</code> also die Anzahl der Bausteine
									ist, verwendet das Modell <code class="bg-muted px-1 font-mono">N-1</code> Wörter als
									Kontext, um das nächste Wort vorhersagen zu können und das fertige N-Gramm zu bilden.
								</p>

								<div class="mt-3 grid w-full grid-cols-2 grid-rows-2 gap-x-2 gap-y-4">
									<div>
										<h3 class="font-bold">Bigramm</h3>
										<p class="mt-1">
											Die <span class="-mb-0.5 mr-1 inline-block h-4 w-2 bg-black"></span><span
												class="text-muted-foreground">Sonne</span
											>
										</p>
									</div>
									<div>
										<h3 class="font-bold">Trigramm</h3>
										<p class="mt-1">
											Die Sonne <span class="-mb-0.5 mr-1 inline-block h-4 w-2 bg-black"
											></span><span class="text-muted-foreground">scheint</span>
										</p>
									</div>
									<div>
										<h3 class="font-bold">Tetragramm</h3>
										<p class="mt-1">
											Die Sonne scheint<span class="mx-1 -mb-0.5 inline-block h-4 w-2 bg-black"
											></span><span class="text-muted-foreground">heute</span>
										</p>
									</div>
									<div>
										<h3 class="font-bold">Pentagramm</h3>
										<p class="mt-1">
											Die Sonne scheint heute <span
												class="-mb-0.5 mr-1 inline-block h-4 w-2 bg-black"
											></span><span class="text-muted-foreground">stark</span>
										</p>
									</div>
								</div>
								<Separator class="my-2" />
								<a
									class="flex items-center gap-2 text-muted-foreground"
									href="https://de.wikipedia.org/wiki/N-Gramm"
									target="_blank"
									rel="noopener noreferrer">N-Gramm <ExternalLink class="inline-block h-4 w-4" /></a
								>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> ist zwar immer noch nicht dasselbe wie große Sprachmodelle (LLMs), aber sie
					sind überraschend einfach und bieten ein gutes Modell, um zu verstehen, wie kontextbasierte
					Vorhersagen funktionieren.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="textarea" class="mb-2 block">
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
				class="w-full {hasWobble ? 'animate-wobble' : 'animate-none'}"
				type="text"
				placeholder="im in love with ..."
				pattern="[\w\s]+"
				maxlength={75}
				disabled={hasBeenClicked || hasEnded}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(contextValue as string).length || 0} / 75</small>
				<small>{`${getModelName(contextValue as string) ?? 'Unigramm (Kontext: 0 Wörter)'}`}</small>
			</div>
			<Tabs.Root value="0" class="mt-10 w-full">
				<Tabs.List class="w-full">
					<Tabs.Trigger class="w-full" value="0">N-Gramme</Tabs.Trigger>
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
							? '1 N-Gramm'
							: `${outputsHistory.length} N-Gramme`
						: 'Noch keine N-Gramme'}</small
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

	<div
		class="relative mb-4 mt-10 w-[calc(100%+16px)] -translate-x-3 -translate-y-3 overflow-clip py-3 pl-3 pr-5"
	>
		<div
			class="flex w-[calc(200%+8px+24px)] flex-row gap-x-4 {scene === -1
				? '-translate-x-[calc(50%+4px)]'
				: '-translate-x-0'} will-change duration-475 transition-transform ease-out"
		>
			<div class="left flex-1 flex-shrink-0">
				<div class="mb-2 flex w-full items-center justify-between">
					<Input
						bind:value={searchValueHistory}
						class="w-1/2"
						placeholder="Historie durchsuchen"
						type="search"
						disabled={!hasBeenClicked || hasEnded}
					/>
					<Button
						class="group px-3 py-2 transition-transform focus-visible:px-3 focus-visible:py-2"
						variant="secondary"
						onclick={toRight}
					>
						Alle N-Gramme
						<ChevronRight
							class="ml-2 h-4 w-4 transition-transform ease-in-out group-hover:translate-x-1"
						/></Button
					>
				</div>
				<ScrollArea class="relative h-[450px] w-full rounded-md border px-4 pt-4">
					<Table.Root>
						<Table.Caption>
							{#if !outputsHistory.length}Noch keine Historie verfügbar{/if}
						</Table.Caption>
						<Table.Header class="sticky top-0">
							<Table.Row>
								<Table.Head class="w-56">N-Gramm</Table.Head>
								<Table.Head class="text-right">Anzahl</Table.Head>
								<Table.Head class="text-right">
									<HoverCard.Root>
										<HoverCard.Trigger class="hover:animate-pulse"
											>Bedingte Wkt. <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
										>
										<HoverCard.Content class="w-72">
											<div class="flex flex-col items-start gap-2 text-sm">
												<p>
													Die bedingte Wahrscheinlichkeit ist die Wahrscheinlichkeit, dass ein
													Ereignis eintritt, unter der Bedingung, dass ein anderes Ereignis bereits
													eingetreten ist.
												</p>
												<p>
													Am Beispiel der N-Gramme ist der gebenene Kontext, sofern dieser in dem
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
													>Bedingte Wahrscheinlichkeit<ExternalLink
														class="inline-block h-4 w-4"
													/></a
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
												class="box-border cursor-pointer text-sm transition-none {selectedWord ===
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
			</div>
			<div class="right flex-1">
				<div class="mb-2 flex w-full items-center justify-between">
					<Button
						class="group px-3 py-2 pl-0 transition-transform focus-visible:px-3 focus-visible:py-2 focus-visible:pl-0"
						variant="secondary"
						onclick={toLeft}
						><ChevronLeft
							class="ml-2 h-4 w-4 transition-transform ease-in-out group-hover:-translate-x-1"
						/>Historie</Button
					>
					<Input
						bind:value={searchValueNgrams}
						class="w-1/2"
						placeholder="Nach Bigrammen suchen"
						type="search"
						disabled={!hasBeenClicked}
					/>
				</div>
				<ScrollArea class="relative h-[450px] w-full rounded-md border px-4 pt-4">
					<Table.Root>
						<Table.Caption>
							{#if !outputsNgrams.length}Noch keine N-Gramme verfügbar{/if}
						</Table.Caption>
						<Table.Header class="sticky top-0">
							<Table.Row>
								<Table.Head class="w-48">N-Gramm</Table.Head>
								<Table.Head class="text-right">Anzahl</Table.Head>
								<Table.Head class="text-right">Wahrscheinlichkeit</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body
							>{#if outputsNgrams.length}
								{#each filterBy(outputsNgrams, searchValueNgrams) as { word, abs, rel }, i}
									{@const words = word.split('+')}
									<Table.Row>
										<Table.Cell>
											<Tooltip.Root>
												<Tooltip.Trigger>
													<Badge
														onclick={handleSetContext}
														class="cursor-pointer text-sm hover:animate-pulse"
														variant="secondary"
														data-context={words[words.length - 1] ?? 'N/A'}
														>{@html formatSearch(word, searchValueNgrams)}</Badge
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
			</div>
		</div>
	</div>

	<LLMNext url={data.url} prev="Bigramm" next="N-Gramm" />
</section>

<Toaster position="bottom-right" />
