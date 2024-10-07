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

	let contextValue = $state('');
	let outputs = $state([] as string[]);
	let outputsHistory = $state([] as { word: string; abs: number; rel: number }[]);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);

	const { data } = $props();

	$effect(() => {
		return () => {
			contextValue = '';
			outputsHistory = [];
		};
	});

	function handleOnKeypress() {
		outputs = contextValue.trim().split(' ');
	}
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Leerzeichen</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Tokenisierung</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2">
					Die Tokenisierung ist ein Prozess, bei dem eine Eingabe von Wörtern oder Buchstaben in
					sogenannte Unterheiten namens Tokens aufgeteilt wird. Ein <HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse"
							>Token <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-72">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p>
									Tokens sind die Einheiten, mit denen ein Sprachmodell wie GPT oder BERT arbeitet,
									um Vorhersagen zu treffen oder einen Text zu generieren.
								</p>
								<p>
									Tokens können Paragraphen, Sätze, Wörter oder sogar einzelne Silben oder
									Wortbausteine sein. Es kommt auf das Modell an, ob es ganze Wörter oder doch
									einzelne Bestandteile des Wortes als Tokens nutzt.
								</p>
								<Separator class="my-2" />
								<a
									class="flex items-center gap-2 text-muted-foreground"
									href="https://de.wikipedia.org/wiki/Tokenisierung"
									target="_blank"
									rel="noopener noreferrer"
									>Tokenisierung <ExternalLink class="inline-block h-4 w-4" /></a
								>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> wiederum ist wie eine kleine Einheit, die eine semantische Bedeutung mit
					sich führt und vom Modell verarbeitet wird.
				</p>

				<p>
					Der einfachste Tokenizer zerlegt eine Zeicheneingabe an den Leerzeichen. Es achtet nicht
					darauf, ob Wörter Satzzeichen oder Sonderzeichen mit sich führen.
				</p>
			</Card.Description>
		</Card.Header>
	</Card.Root>

	<Card.Root class="dark my-8 w-full">
		<Card.Header class="gap-2 p-6">
			<div>
				<Card.Description>
					<p class="mb-3 text-muted-foreground">
						Nehmen wir andere alltägliche Texte wie Nachrichtenartikel oder Anzeigen aus dem
						Internet. Neben den Wörtern finden wir auch Satzzeichen, Zahlen und Sonderzeichen. Diese
						Zeichen sind genauso wichtig wie die Wörter selbst, weil sie die Bedeutung des Textes
						verändern können.
					</p>

					<div class="relative my-8 h-full w-full rounded-md bg-muted/50 p-6">
						<LLMCode
							innerText={{
								input: '“This is your reminder that we previously notified you,” reads the first line of Ring’s email to me today. When? I certainly don’t remember ever getting an email telling me about a 100 percent price hike before...'
							}}
							language="json"
						/>
					</div>

					<p class="text-muted-foreground">
						Nachdem der Text an den Leerzeichen aufgeteilt wurde, können wir die fertigen Tokens
						sehen, die unser Modell verarbeiten würde. Achte auch besonders darauf, dass die Tokens
						auch Satzzeichen und Sonderzeichen enthalten können.
					</p>

					<ScrollArea class="relative my-8 h-[225px] w-full rounded-md bg-muted/50">
						<div>
							<div class="h-full w-full p-6">
								<LLMCode
									innerText={{
										output: '“This is your reminder that we previously notified you,” reads the first line of Ring’s email to me today. When? I certainly don’t remember ever getting an email telling me about a 100 percent price hike before...'.split(
											' '
										)
									}}
									language="json"
								/>
							</div>
						</div>
					</ScrollArea>

					<p class="text-muted-foreground">
						Wie man sehen kann, führt diese Tokenisierungsart Probleme mit sich, da einzelne Tokens
						vom Wortinhalt identisch sein mögen, aber in ihrer Bedeutung unterschiedlich sind. Wie
						kann das Modell den Unterschied zwischen denselben Tokens mit und ohne Sonderzeichen
						erkennen?
					</p>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Leerzeichen ohne Ende</Card.Title>
			<Card.Description>
				<p>
					Im unteren Textfeld kannst du einen beliebigen Text einfügen. Im Outputfenster kannst du
					dann die unterschiedlichen Tokens angezeigt bekommen. Achte dabei besonders darauf, welche
					Tokens mit und ohne Sonderzeichen vorkommen und inwiefern sie in ihrer semantischen
					Bedeutung unterschiedlich sein können.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="text" class="mb-2 block">Ausgangstext</Label>
			<Textarea
				bind:value={contextValue}
				class="max-h-72 min-h-36 w-full text-base"
				id="text"
				placeholder="Can't complain, this tokenizer ain't that bad though ..."
				maxlength={512}
				disabled={hasBeenClicked}
				oninput={handleOnKeypress}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(contextValue as string).length || 0} / 512</small>
			</div>

			<Label for="text" class="mb-2 mt-8 block">Tokens</Label>
			<ScrollArea
				class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0"
				orientation="vertical"
			>
				<div
					class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
				>
					{#if outputs.length === 0}
						<p
							class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
						>
							Hier werden die Tokens angezeigt
						</p>
					{:else}
						{#each outputs as output, i}
							<Badge
								class="box-border animate-bounceIn select-none text-base transition-none"
								variant="secondary">{output}</Badge
							>
						{/each}
					{/if}
				</div>
			</ScrollArea>
		</Card.Content>
	</Card.Root>

	<LLMNext url={data.url} prev="N-Gramm" next="Zeichensetzung" />
</section>

<Toaster position="bottom-right" />
