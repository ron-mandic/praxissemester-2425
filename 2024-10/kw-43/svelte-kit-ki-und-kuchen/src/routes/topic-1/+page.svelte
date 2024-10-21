<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import LLMCode from '@/svelte/LLMCode.svelte';
	import LLMLoader from '@/svelte/LLMLoader.svelte';
	import LLMNext from '@/svelte/LLMNext.svelte';
	import { formatSearch, preformat, preprocess } from '$lib/ts/functions';

	import Info from 'lucide-svelte/icons/info';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { ScrollArea } from '@/ui/scroll-area/index.js';
	import * as Table from '@/ui/table';
	import { Input } from '@/ui/input';
	import * as Command from '$lib/components/ui/command';
	const { data } = $props();

	// TODO: Check if this is necessary
	$effect(() => {
		return () => {
			searchValueTable = '';
			selectedRow = null;
		};
	});

	$effect(() => {
		if (searchValueTable === '') selectedRow = null;
	});

	let searchValueTable = $state('');
	let selectedRow = $state(null);
</script>

<section class="h-full w-full max-w-[605px] max-sm:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Daten</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Korpus</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2">
					Chatbots, Textvervollständigung und Sprachassistenten wie Alexa basieren alle auf
					Sprachmodellen. Je nach Anwendungsfall gibt es Unterschiede in der Struktur dieser
					Modelle, aber grundsätzlich wandeln sie alle Sprache in Zahlen und dann wieder in Sprache
					um.
				</p>

				<p class="mb-3 mt-2">
					Diese Modelle speichern Wahrscheinlichkeiten darüber, welche Wörter in Abhängigkeit von
					den benachbarten Wörtern als nächstes kommen könnten. Sie berechnen diese
					Wahrscheinlichkeiten auf der Grundlage von Wortfolgen, die im <HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse" data-trigger="corpus"
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
			<ScrollArea class="relative mb-4 h-[325px] w-full rounded-md bg-muted/50">
				<div>
					<div class="h-full w-full p-6"></div>
				</div>
			</ScrollArea>

			<Card.Title class="pl-[1.125rem]">Vorbearbeitung des Datensatzes</Card.Title>
			<div class="px-[1.125rem] pb-[1.125rem] pt-2">
				<Card.Description>
					<p class="mb-3 text-muted-foreground">
						Man kann gut erkennen, dass die Songtexte nicht gerade bestens formatiert sind. Das
						Problem dabei ist, dass unser Modell mit der jetzigen Formatierung Titel, Songtexte und
						Sonderformatierung gleichzeitig lernen würde.
					</p>

					<div class="relative my-8 h-full w-full rounded-md bg-muted/50 p-6"></div>

					<p class="text-muted-foreground">
						Mit nur 100 Liedern haben wir auch eine relativ begrenzte Datenmenge. Um
						sicherzustellen, dass unser Modell die Lieder trotzdem gut lernen kann, müssen wir die
						Daten bereinigen. Das Modell lernt in unserem Fall am besten, wenn sie in
						Kleinbuchstaben und ohne Sonderzeichen geschrieben sind.
					</p>

					<div class="relative my-8 h-full w-full rounded-md bg-muted/50 p-6"></div>

					<p class="text-muted-foreground">
						Gleichzeitig behalten wir die Zeilenumbrüche bei, weil sie für die Liedstrophen
						charakteristisch sind. Wir kennzeichnen sie dann mit einem separaten Symbol.
					</p>

					<div
						class="relative mb-8 mt-6 h-56 w-full overflow-clip rounded-md bg-muted/50 p-6"
					></div>

					<p class="mb-3 text-muted-foreground">
						Mit diesem Bereinigungsschritt stellen wir sicher, dass unser Modell mehr Beispiele von
						denselben Wortfolgen erhält. Bliebe der Datensatz unbereinigt, würde es auch die
						Sonderzeichen und Großschreibung als Wortfolgen mit lernen, was unsere Lernerfolge bei
						der Datenknappheit schmälert.
					</p>

					<p class="mb-3 text-muted-foreground">
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
								<Table.Cell class="text-right font-mono">49</Table.Cell>
								<Table.Cell>Shape of You</Table.Cell>
								<Table.Cell>Duplikat</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="text-right font-mono">50</Table.Cell>
								<Table.Cell>You Need Me, I Don’t Need You</Table.Cell>
								<Table.Cell>Duplikat</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="text-right font-mono">70</Table.Cell>
								<Table.Cell>Dive</Table.Cell>
								<Table.Cell>Duplikat</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="text-right font-mono">76</Table.Cell>
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

	<LLMNext url={data.url} prev="Einleitung" next="Unigramm" />
</section>
