<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Table from '$lib/components/ui/table';
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
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import Sparkles from 'lucide-svelte/icons/sparkles';

	const { data } = $props();

	let contextValue = $state('');
	let searchValueHistory = $state('');
	let searchValueBigrams = $state('');
	let scene = $state(0);
	let outputsHistory = $state([] as { word: string; abs: number; rel: number }[]);
	let outputsBigrams = $state([] as { word: string; abs: number; rel: number }[]);
	let hasBeenReset = $state(false);
	let hasBeenClicked = $state(false);
	let hasWobble = $state(false);
	let hasEnded = $state(false);

	async function handleClick() {
		if (!hasBeenClicked) hasBeenClicked = true;
		const contexts = contextValue.trim().split(' ');
		const context = contexts[contexts.length - 1] || contextValue.trim();
		console.log(context);

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

		outputsBigrams = dataBigram.data.map(([key, abs, _, rel]) => ({ word: key, abs, rel }));
	}

	function handleSetContext(event: MouseEvent) {
		// TODO: Check usability
		// const target = event.currentTarget as HTMLElement;
		// const context = target.dataset.context;
		// contextValue = context;
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

	function handleReset() {
		hasBeenClicked = false;
		hasBeenReset = true;
		hasEnded = false;
		contextValue = '';
		outputsHistory = [];
		outputsBigrams = [];
		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(contextValue).with(console.log);
</script>

<section class="h-full w-full">
	<h2 class="mb-6 px-2 text-4xl font-bold md:px-0">Bigramm</h2>

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
					jedes Wort unabhängig von den vorherigen Wörtern betrachtet, sieht das Bigramm
					<strong>immer das letzte Wort als Kontext</strong> an, was zu sinnvolleren Vorhersagen führt.
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
				class="w-full {hasWobble ? 'animate-wobble' : 'animate-none'}"
				type="text"
				placeholder="i, shape, of, ..."
				pattern="[\w\s]+"
				disabled={hasBeenClicked || hasEnded}
			/>
			<ScrollArea class="mt-6 h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0">
				<div
					class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
				>
					{#each outputsHistory as { word, rel }, i}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Badge variant="outline" class="inline-block animate-bounceIn text-base"
									>{word}</Badge
								>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p class="font-mono">{(rel * 100).toFixed(3)}%</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/each}
				</div>
			</ScrollArea>
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
				class="px-5 py-6 transition-transform ease-out active:translate-y-0.5"
				disabled={!contextValue.trim() || hasWobble}
				onclick={handleClick}
			>
				{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}
			</Button>
		</Card.Footer>
	</Card.Root>

	<div
		class="relative mb-4 mt-10 w-[calc(100%+16px)] -translate-x-3 -translate-y-3 overflow-clip pl-3 pr-5 py-3"
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
						>Alle Bigramme<ChevronRight
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
								<Table.Head class="w-56">Bigramm</Table.Head>
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
								{#each filterBy(outputsHistory, searchValueHistory) as { word, abs, rel }, i}
									<Table.Row>
										<Table.Cell>
											<Badge class="text-sm" variant="secondary"
												>{@html formatSearch(word, searchValueHistory)}</Badge
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
						bind:value={searchValueBigrams}
						class="w-1/2"
						placeholder="Nach Bigrammen suchen"
						type="search"
						disabled={!hasBeenClicked}
					/>
				</div>
				<ScrollArea class="relative h-[450px] w-full rounded-md border px-4 pt-4">
					<Table.Root>
						<Table.Caption>
							{#if !outputsBigrams.length}Noch keine Bigramme verfügbar{/if}
						</Table.Caption>
						<Table.Header class="sticky top-0">
							<Table.Row>
								<Table.Head class="w-48">Bigramm</Table.Head>
								<Table.Head class="text-right">Anzahl</Table.Head>
								<Table.Head class="text-right">Wahrscheinlichkeit</Table.Head>
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
														class="cursor-pointer text-sm hover:animate-pulse"
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
			</div>
		</div>
	</div>

	<LLMNext url={data.url} prev="Bigramm" next="N-Gramm" />
</section>

<Toaster position="bottom-right" />
