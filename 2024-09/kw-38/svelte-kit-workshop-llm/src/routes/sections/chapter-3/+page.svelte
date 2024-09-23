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

	const { data } = $props();

	let text = $state('');
	let searchValue = $state('');
	let inputs = $state([] as { word: string; abs: number; rel: number }[]);
	let hasBeenReset = $state(false);
	let hasBeenClicked = $state(false);

	async function handleClick() {
		if (!hasBeenClicked) hasBeenClicked = true;

		const response = await fetch('/api/chapter-1?num_samples=1');
		const data = await response.json();

		const [key, abs, rel] = data.data[0];

		text = key;
		inputs.push({ word: key, abs, rel });
	}

	function filterBy(arr: typeof inputs, value: string) {
		if (!value) return arr;

		const filteredInputs = arr.filter(({ word }) => word.includes(value));
		return filteredInputs;
	}

	function handleReset() {
		hasBeenClicked = false;
		hasBeenReset = true;
		text = '';
		inputs = [];
		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}
</script>

<section class="h-full w-full">
	<h2 class="mb-6 text-4xl font-bold">Bigramm</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Ed Sheeran</Card.Title>
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
					Dieses Modell hat 100 ausgewählte Songs von Ed Sheeran analysiert. Gib Schlüsselwörter auf
					Englisch in Kleinschreibweise und ohne Sonderzeichen ein, wie sie in Ed Sheerans
					Songtexten vorkommen würden und generiere dann Vorhersagen mit dem Modell.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="text" class="mb-2 block">
				<HoverCard.Root>
					<HoverCard.Trigger class="hover:animate-pulse"
						>Kontext <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
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
				bind:value={text}
				id="text"
				class="w-full"
				type="text"
				placeholder="i, shape, of, ..."
				pattern="[\w]+"
			/>
			<ScrollArea class="mt-6 h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0">
				<div
					class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
				>
					{#each inputs as { word, rel }, i}
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
				<Button onclick={handleReset} variant="outline"
					>Zurücksetzen<Reset class="ml-2 h-4 w-4" /></Button
				>
			</div>
			<Button class="ease-out active:translate-y-0.5" onclick={handleClick}>
				{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}
			</Button>
		</Card.Footer>
	</Card.Root>

	<div class="relative mb-4 mt-10">
		<Input
			bind:value={searchValue}
			class="mb-2 w-1/2"
			placeholder="Nach Wörtern suchen"
			type="search"
		/>
		<ScrollArea class="relative h-[330px] w-full rounded-md border px-4 pt-4">
			<Table.Root>
				<Table.Caption>
					{#if !inputs.length}Noch keine Historie verfügbar{/if}
				</Table.Caption>
				<Table.Header class="sticky top-0">
					<Table.Row>
						<Table.Head class="w-48">Wort</Table.Head>
						<Table.Head class="text-right">Anzahl</Table.Head>
						<Table.Head class="text-right">Wahrscheinlichkeit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body
					>{#if inputs.length}
						{#each filterBy(inputs, searchValue) as { word, abs, rel }, i}
							<Table.Row>
								<Table.Cell>
									<Badge class="text-sm" variant="secondary"
										>{@html formatSearch(word, searchValue)}</Badge
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

	<LLMNext url={data.url} prev="Bigramm" next="N-Gramm" />
</section>
