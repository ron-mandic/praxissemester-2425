<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import LLMCode from '@/svelte/LLMCode.svelte';
	import LLMLoader from '@/svelte/LLMLoader.svelte';
	import LLMNext from '@/svelte/LLMNext.svelte';
	import { formatSearch, preprocess } from '$lib/ts/functions';
	import { EXAMPLE_OBJ_SONG } from '$lib/ts/constants';

	import Info from 'lucide-svelte/icons/info';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import ChevronsDownUp from 'lucide-svelte/icons/chevrons-down-up';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { Skeleton } from '@/ui/skeleton/index.js';

	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { ScrollArea } from '@/ui/scroll-area/index.js';
	import * as Table from '@/ui/table';
	import { Input } from '@/ui/input';
	import { Badge } from '@/ui/badge';
	import { Button } from '@/ui/button';

	const { data } = $props();
	console.log(data);

	let searchValue = $state('');
	let selectedRow = $state(null) as (typeof data.fastapi.rows)[0];
	let enlarged = $state(false);

	function filterBy(arr: { row_idx: number; row: { text: string } }[], value: number | string) {
		let args = arr.map(({ row_idx, row }) => ({ row_idx, row, song: preprocess(row) }));
		if (!value) return args;

		return args.filter(({ song }) =>
			song.title.toLocaleLowerCase().includes((value as string).toLocaleLowerCase())
		);
	}

	function handleSelectRow(event: MouseEvent) {
		const target = event.currentTarget as HTMLElement;
		if (target.classList.contains('disabled')) return;

		const { idx } = target.dataset!;
		if (!idx) return;

		const { row } = data.fastapi.rows.find(
			({ row_idx }: { row_idx: number; row: { text: string } }) => row_idx === parseInt(idx)
		);
		selectedRow = preprocess(row);
		console.log(selectedRow.words.length, new Set(selectedRow.words).size);
	}

	$effect(() => {
		if (searchValue === '') selectedRow = null;
	});
</script>

<section class="h-full w-full">
	<h2 class="mb-6 text-4xl font-bold">Daten</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Korpus</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2 text-balance">
					Chatbots, die Textvervollständigung auf deinem Handy und Sprachassistenten wie Alexa
					basieren alle auf Sprachmodellen. Je nach Anwendungsfall gibt es in dem Aufbau dieser
					Modelle Unterschiede, aber grundsätzlich <strong
						>verwandeln sie alle Sprache in Zahlen und dann wieder zurück in Sprache</strong
					>.
				</p>

				<p class="mb-3 mt-2">
					Diese Modelle speichern Wahrscheinlichkeiten darüber, welche Wörter in Abhängigkeit von
					den benachbarten Wörtern als nächstes kommen könnten. Sie berechnen diese
					<strong>Wahrscheinlichkeiten auf der Grundlage von Wortfolgen</strong>, die im <HoverCard.Root
					>
						<HoverCard.Trigger class="hover:animate-pulse"
							>Korpus <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-72">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p>
									Er dient als Trainings- und Testdatenbasis, um Algorithmen zu entwickeln, die
									verschiedene Sprachverarbeitungsaufgaben automatisieren und verbessern können.
								</p>
								<p>
									Je vielfältiger und qualitativ hochwertiger der Korpus ist, desto besser sind in
									der Regel die Ergebnisse der Modelle, die darauf trainiert werden.
								</p>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> auftreten.
				</p>
			</Card.Description>
		</Card.Header>
	</Card.Root>

	<Card.Root class="dark mt-6 w-full">
		<Card.Header class="gap-2 p-1.5">
			<ScrollArea class="relative mb-4 h-[525px] w-full rounded-md bg-muted/50">
				<div>
					<div class="h-full w-full p-6">
						<LLMCode
							innerText={data.fastapi.rows
								.slice(0, 10)
								.concat([{ row_idx: 10, row: { text: '...' }, truncated_cells: [] }])}
							language="json"
						/>
					</div>
				</div>
			</ScrollArea>

			<Card.Title class="pl-6">JSON-Ausgabe</Card.Title>
			<div class="px-6 pb-6 pt-2">
				<Card.Description>
					<p class="mb-3">
						Nach dem Herunterladen der JSON-Datei wird die Struktur des Datensatzes sichtbar. Wie du
						sehen kannst, sind die Songtexte nicht geeignet formatiert. Das Problem dabei ist, dass
						unser Modell mit der jetzigen Formatierung Wortfolgen lernen würde, die für uns keinen
						Sinn ergeben.
					</p>

					<ScrollArea class="relative my-8 w-full rounded-md bg-muted/50">
						<div class="h-full w-full p-6">
							<LLMCode innerText={EXAMPLE_OBJ_SONG} language="json" />
						</div>
					</ScrollArea>

					<p class="mb-3">
						Dadurch, dass wir nur mit 100 Songs arbeiten, sind wir von den Daten her verhältnismäßig
						eingeschränkt. Damit unser Modell die Songs trotzdem gut lernen kann, müssen wir die
						Daten bereinigen. Hier lernt es die Wörter am besten, wenn sie kleingeschrieben und ohne
						Sonderzeichen sind, damit wir sie nur noch an den Leerzeichen und Zeilenumbrüchen
						trennen müssen - jene Sonderzeichen, die einen Songtext auch so charakteristisch machen.
					</p>

					<ScrollArea class="relative my-8 max-h-72 rounded-md bg-muted/50">
						<div class="h-full w-full p-6">
							<LLMCode innerText={preprocess(EXAMPLE_OBJ_SONG)} language="json" />
						</div>
					</ScrollArea>

					<p class="mb-3">
						Mit diesem Bereinigungsschritt stellen wir sicher, dass unser Modell mehr Beispiele von
						denselben Wortfolgen erhält. Bliebe der Datensatz unbereinigt, würde es auch die
						Sonderzeichen und Großschreibung als Wortfolgen mit lernen, was unsere Lernerfolge bei
						der Datenknappheit schmälert.
					</p>

					<p class="mb-3">
						Hinzu kommt noch, dass in dem Datensatz insgesamt vier Duplikate auftauchen, was die
						Datenknappheit weiter verschärft. Diese Duplikate sind in der unteren Tabelle
						aufzusuchen, für die weiteren Trainings wird aber der vollständig bereinigte Datensatz
						verwendet.
					</p>

					<Table.Root class="mt-2">
						<Table.Header class="sticky top-0">
							<Table.Row>
								<Table.Head class="w-16 text-right">Index</Table.Head>
								<Table.Head>Songname</Table.Head>
								<Table.Head>Grund</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell class="text-right font-mono">049</Table.Cell>
								<Table.Cell>Shape of You</Table.Cell>
								<Table.Cell>Duplikat</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="text-right font-mono">050</Table.Cell>
								<Table.Cell>You Need Me, I Don’t Need You</Table.Cell>
								<Table.Cell>Duplikat</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="text-right font-mono">070</Table.Cell>
								<Table.Cell>Dive</Table.Cell>
								<Table.Cell>Duplikat</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="text-right font-mono">076</Table.Cell>
								<Table.Cell>Take Me Back to London</Table.Cell>
								<Table.Cell>Nicht identisch</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>

					<Separator class="my-6" />

					<a
						class="inline-block items-center gap-2 text-muted-foreground"
						href="https://huggingface.co/datasets/huggingartists/ed-sheeran?viewer_api=true"
						target="_blank"
						rel="noopener noreferrer"
						>huggingartists/ed-sheeran (API) <ExternalLink class="-mt-1 inline-block h-4 w-4" /></a
					>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<div class="w-full">
		<div class="relative mb-4 mt-10">
			<Input
				bind:value={searchValue}
				class="mb-2 w-1/2"
				placeholder="Nach Songtitel suchen"
				type="search"
			/>
			<ScrollArea class="relative h-[330px] w-full rounded-md border px-4 pt-4">
				<Table.Root>
					<Table.Header class="sticky top-0">
						<Table.Row>
							<Table.Head class="w-16 text-right">Index</Table.Head>
							<Table.Head class="w-48">Songtitel</Table.Head>
							<Table.Head class="cursor-pointer text-right">Wörter</Table.Head>
							<Table.Head class="text-right">Wörterbuch</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if data.fastapi.rows.length}
							{#each filterBy(data.fastapi.rows, searchValue) as { row_idx, song }, i}
								{@const className = data.fastapi.duplicates.includes(row_idx)
									? 'text-muted-foreground/30 disabled cursor-not-allowed'
									: 'text-foreground'}
								<Table.Row
									class="cursor-pointer select-none {className}"
									onclick={handleSelectRow}
									data-idx={row_idx}
								>
									<Table.Cell class="text-right font-mono">
										{row_idx.toString().padStart(3, '0')}
									</Table.Cell>
									<Table.Cell>{@html formatSearch(song?.title, searchValue)}</Table.Cell>
									<Table.Cell class="text-right font-mono">{song.words.length}</Table.Cell>
									<Table.Cell class="text-right font-mono">{new Set(song.words).size}</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</ScrollArea>
		</div>
	</div>

	<Card.Root class="dark mt-10 w-full">
		<Card.Header class="p-1.5">
			<ScrollArea class="relative h-[525px] w-full rounded-md bg-muted/50 transition-all">
				<div>
					<div class="h-full w-full p-6">
						{#if selectedRow !== null}
							<div in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}>
								<LLMCode innerText={selectedRow} language="json" />
							</div>
						{:else}
							<LLMLoader />
						{/if}
					</div>
				</div>
			</ScrollArea>

			<div class="grid h-16 w-full place-items-center">
				{#if !selectedRow}
					<span class="font-regular w-full text-center text-sm text-muted-foreground"
						>Wähle einen Song oben aus der Liste aus</span
					>
				{:else}
					<Card.Title>
						<span>{selectedRow.title}</span>
					</Card.Title>
				{/if}
			</div>
		</Card.Header>
	</Card.Root>

	<LLMNext url={data.url} prev="Einleitung" next="Unigramm" />
</section>
