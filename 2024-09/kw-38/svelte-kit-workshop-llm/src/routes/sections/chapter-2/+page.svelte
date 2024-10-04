<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Table from '$lib/components/ui/table';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Tabs from '$lib/components/ui/tabs';
	import LLMNext from '@/svelte/LLMNext.svelte';

	import Info from 'lucide-svelte/icons/info';
	import Reset from 'lucide-svelte/icons/rotate-ccw';
	import { Badge } from '@/ui/badge';
	import { ScrollArea } from '@/ui/scroll-area';
	import { Input } from '@/ui/input';
	import { formatSearch } from '$lib/ts/functions';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';

	const { data } = $props();

	let text = $state('');
	let searchValue = $state('');
	let selectedWord = $state('');
	let outputsHistory = $state([] as { word: string; abs: number; rel: number }[]);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);

	// TODO: Check if this is necessary
	$effect(() => {
		return handleReset;
	});

	$effect(() => {
		if (outputsHistory.length === 100) {
			toast(
				'Wow. Wenn das nicht der neuste Hit von Ed Sheeran wird, dann weiß ich auch nicht weiter.'
			);
		}
	});

	async function handleClick() {
		if (!hasBeenClicked) hasBeenClicked = true;

		const response = await fetch('/api/unigram?num_samples=1');
		const { data } = await response.json();

		const [key, abs, rel] = data[0];

		text = key;
		outputsHistory.push({ word: key, abs, rel });
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

	function handleReset() {
		text = '';
		searchValue = '';
		selectedWord = '';
		outputsHistory = [];
		hasBeenClicked = false;
		hasBeenReset = true;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(selectedWord).with(console.log);
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Unigramm</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Wahrsager ohne Kontext</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2 text-balance">
					Ein <HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse"
							>Unigramm <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-72">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p>
									Stelle dir ein Wörterbuch vor, in dem jedes Wort mit einer bestimmten
									Wahrscheinlichkeit vorkommt. Ein Unigramm-Modell wählt auf der Grundlage dieser
									Wahrscheinlichkeiten zufällig Wörter aus.
								</p>
								<div class="w-full">
									<Table.Root>
										<Table.Caption class="mb-4">Ohne Zeilenumbrüche</Table.Caption>
										<Table.Header>
											<Table.Row>
												<Table.Head class="w-16">Wort</Table.Head>
												<Table.Head class="text-right">Anzahl</Table.Head>
												<Table.Head class="text-right">%</Table.Head>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">i</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">1836</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(0.0413 * 100).toFixed(3)}</Table.Cell
												>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">you</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">1576</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(0.03545 * 100).toFixed(3)}</Table.Cell
												>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">the</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">1404</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(0.03158 * 100).toFixed(3)}</Table.Cell
												>
											</Table.Row>
											<Table.Row>
												<Table.Cell>...</Table.Cell>
												<Table.Cell class="text-right font-mono">...</Table.Cell>
												<Table.Cell class="text-right font-mono">...</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">un</Badge></Table.Cell>
												<Table.Cell class="text-right font-mono">4</Table.Cell>
												<Table.Cell class="text-right font-mono"
													>{(8.9975e-5 * 100).toFixed(3)}</Table.Cell
												>
											</Table.Row>
										</Table.Body>
									</Table.Root>
								</div>
								<p>
									In einem Unigramm-Modell basiert die Vorhersage eines Wortes nur auf dessen
									eigener Wahrscheinlichkeit im Gesamtkorpus, ohne den Kontext aus dem Satz oder den
									vorherigen Wörtern zu verwenden. Da Sprache normalerweise stark vom Kontext
									abhängt, sind die Vorhersagen eines Unigramm-Modells mehr oder weniger zufällig.
								</p>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> vertritt die einfachste Form kleiner Sprachmodelle, auch SLMs genannt, bei
					dem die Wörter unabhängig voneinander betrachtet werden. Es berücksichtigt keinen Kontext.
					Es bildet nur die Wahrscheinlichkeiten einzelner Wörter ab und ignoriert jegliche Abhängigkeiten
					zwischen Wörtern, was seine Anwendungsmöglichkeiten stark einschränkt.
				</p>

				<p>
					Dieses Modell hat unsere 100 ausgewählten Songs von Ed Sheeran analysiert. Gib
					Schlüsselwörter auf Englisch in Kleinschreibweise und ohne Sonderzeichen ein, wie sie in
					Ed Sheerans Songtexten vorkommen würden und generiere dann kontextlose Vorhersagen mit dem
					Modell.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<div class="mt-6 grid h-12 w-full place-items-center">
				{#if text}
					<span class="select-none text-lg font-bold">{text}</span>
				{:else}
					<span class="select-none text-sm text-muted-foreground"
						>Drücke den Button, um ein Wort zu generieren</span
					>
				{/if}
			</div>
			<Tabs.Root value="0" class="mt-6 w-full">
				<Tabs.List class="w-full">
					<Tabs.Trigger class="w-full" value="0">Unigramme</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="1">Output</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content class="h-full w-full" value="0">
					<ScrollArea class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0">
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#each outputsHistory as { word, rel }, i}
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Badge
											onclick={handleSelectedWord}
											data-word={word}
											variant="outline"
											class="box-border inline-block animate-bounceIn cursor-pointer text-base {selectedWord ===
											word
												? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
												: 'text-foreground'}">{word}</Badge
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
				<Tabs.Content class="h-full w-full max-w-full" value="1">
					<ScrollArea
						class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0"
						orientation="both"
					>
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#if selectedWord}
								<span class="w-full whitespace-nowrap"
									>{@html outputsHistory
										.map(({ word }) => {
											let w =
												word === selectedWord
													? `<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${word}</mark>`
													: word;

											if (word === '[end]')
												return word === selectedWord
													? `<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${word}</mark><br />`
													: '<br />';
											return w;
										})
										.join(' ')}</span
								>
							{:else}
								<span class="w-full whitespace-nowrap"
									>{@html outputsHistory
										.map(({ word }) => {
											if (word === '[end]') return `<br>`;
											return word;
										})
										.join(' ')}</span
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
							? '1 Unigramm'
							: `${outputsHistory.length} Unigramme`
						: 'Noch keine Unigramme'}</small
				>
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<div style="visibility: {!hasBeenReset && hasBeenClicked ? 'auto' : 'hidden'};">
				<Button class="px-5 py-6" onclick={handleReset} variant="outline"
					>Zurücksetzen<Reset class="ml-2 h-4 w-4" /></Button
				>
			</div>
			<Button
				class="px-5 py-6 transition-transform ease-out active:translate-y-0.5"
				onclick={handleClick}
			>
				{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}
			</Button>
		</Card.Footer>
	</Card.Root>

	<div class="relative mb-4 mt-10">
		<Input
			bind:value={searchValue}
			class="mb-2 w-full text-base md:w-1/2"
			placeholder="Historie durchsuchen"
			type="search"
			disabled={!hasBeenClicked}
		/>
		<ScrollArea class="relative h-[330px] w-full rounded-md border px-4 pt-4">
			<Table.Root>
				<Table.Caption>
					{#if !outputsHistory.length}
						Noch keine Historie verfügbar
					{/if}
				</Table.Caption>
				<Table.Header class="sticky top-0">
					<Table.Row>
						<Table.Head class="w-52">Wort</Table.Head>
						<Table.Head class="text-right">Anzahl</Table.Head>
						<Table.Head class="text-right">Wahrscheinlichkeit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body
					>{#if outputsHistory.length}
						{#each filterBy(outputsHistory, searchValue) as { word, abs, rel }, i}
							<Table.Row class="cursor-pointer" onclick={handleSelectedWord} data-word={word}>
								<Table.Cell>
									<Badge
										class="box-border cursor-pointer text-sm transition-none {selectedWord === word
											? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
											: 'text-foreground'}"
										variant="secondary">{@html formatSearch(word, searchValue)}</Badge
									>
								</Table.Cell>
								<Table.Cell class="text-right font-mono">{abs}</Table.Cell>
								<Table.Cell class="text-right font-mono">{(rel * 100).toFixed(3)} %</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</ScrollArea>
	</div>

	<LLMNext url={data.url} prev="Unigramm" next="Bigramm" />
</section>

<Toaster position="bottom-right" />
