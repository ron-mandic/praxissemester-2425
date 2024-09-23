<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Textarea } from '@/ui/textarea';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Table from '$lib/components/ui/table';
	import { toast } from 'svelte-sonner';
	import LLMNext from '@/svelte/LLMNext.svelte';

	import Info from 'lucide-svelte/icons/info';
	import Reset from 'lucide-svelte/icons/rotate-ccw';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { tick } from 'svelte';
	import { Label } from '@/ui/label';
	import { ScrollArea } from '@/ui/scroll-area';

	const { data } = $props();

	let seed = $state(null as number | null);
	let text = $state('' as string | number | string[] | null);
	let inputs = $state([] as { id: number; seed: number | string; text: string }[]);
	let hasBeenReset = $state(false);
	let hasBeenClicked = $state(false);

	function getModelName(text: string) {
		if (!text) return;
		const numWhitespaces = text.trim().split(' ').length - 1;
		switch (numWhitespaces) {
			case 0:
				return 'Bigramm (Kontext: 1 Wort)';
			case 1:
				return 'Trigramm (Kontext: 2 Wörter)';
			case 2:
				return 'Tetragramm (Kontext: 3 Wörter)';
			case 3:
				return 'Pentagramm (Kontext: 4 Wörter)';
			case 4:
				return 'Hexagramm (Kontext: 5 Wörter)';
			case 5:
				return 'Heptagramm (Kontext: 6 Wörter)';
			case 6:
				return 'Oktogramm (Kontext: 7 Wörter)';
			case 7:
				return 'Nonagramm (Kontext: 8 Wörter)';
			case 8:
				return 'Dezagramm (Kontext: 9 Wörter)';
			default:
				return 'Multigramm (Kontext: N-1 Wörter)';
		}
	}

	function handleClick() {
		// TODO: Request to server

		const alreadyAdded = inputs.some((input) => input.seed === seed && input.text === text);
		if (alreadyAdded) {
			toast(
				'Deine jetzigen Werte tauchen schon in der Historie auf. Versuche es erneut mit anderen Werten'
			);
			return;
		}

		if (!hasBeenClicked) hasBeenClicked = true;

		inputs.push({
			id: Date.now(),
			seed: (seed! > 0 ? seed : seed?.toFixed(3)) ?? 'N/A',
			text: (text as string).trim() ?? ''
		});
	}

	function handleInputOnInput() {
		tick().then(() => {
			if (seed && seed! > 9999) {
				seed = 9999;
			}
		});
	}

	function handleTextareaOnInput(e: Event) {
		tick().then(() => {
			console.log((e as KeyboardEvent).code);

			if ((e as KeyboardEvent).code === 'Enter') {
				e.preventDefault();
			}

			if ((e as KeyboardEvent).ctrlKey && (e as KeyboardEvent).code === 'Enter') {
				handleClick();
			}
		});
	}

	const increment = (e: MouseEvent) => {
		seed = seed! + 1;
	};

	const decrement = (e: MouseEvent) => {
		seed = seed! - 1;
	};

	function handleReset() {
		hasBeenReset = true;
		hasBeenClicked = false;
		seed = null;
		text = '';
		inputs = [];
		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(seed).with(console.log);
</script>

<section class="h-full w-full">
	<h2 class="mb-6 text-4xl font-bold">N-Gramm</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<div class="flex items-center justify-between">
				<Card.Title>Ed Sheeran</Card.Title>
				<div class="flex items-center gap-4">
					<p class="text-sm text-muted-foreground">
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
					</p>
					<div class="relative">
						<Button
							variant="outline"
							class="absolute right-0.5 top-0.5 h-2 w-2 p-2"
							onclick={increment}
						>
							<ChevronUp class="absolute h-4 w-4 text-foreground" />
						</Button>
						<Button
							variant="outline"
							class="absolute bottom-0.5 right-0.5 h-2 w-2 p-2"
							onclick={decrement}
						>
							<ChevronDown class="absolute h-4 w-4 text-foreground" />
						</Button>
						<Input
							bind:value={seed}
							class="max-w-32"
							type="number"
							placeholder="1234, ..."
							min={0}
							max={9999}
							maxlength={4}
							pattern="\d{4}"
							oninput={handleInputOnInput}
						/>
					</div>
				</div>
			</div>
			<Card.Description>
				<p class="mb-3 mt-2">
					Ein <HoverCard.Root>
						<HoverCard.Trigger class="hover:animate-pulse"
							>N-Gramm <Info class="inline-block h-4 w-4" /></HoverCard.Trigger
						>
						<HoverCard.Content class="w-80">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p class="text-balance">
									Ein N-Gramm ist das Ergebnis der Zerlegung eines Textes in Fragmente. Der Text
									wird zerlegt und die aufeinanderfolgenden Fragmente werden als N-Gramm
									zusammengefasst.
								</p>
								<p>
									Zum Beispiel bildet der Satz <em>Die Sonne scheint</em> bei einem 2-Gramm
									(Bigramm) <Badge class="px-1.5 py-0.5" variant="secondary">Die Sonne</Badge> und <Badge
										class="px-1.5 py-0.5"
										variant="secondary">Sonne scheint</Badge
									> als Paare. Der ganze Satz alleine würde ein 3-Gramm (Trigramm) bilden.
								</p>
								<p>
									Wenn <code class="bg-muted px-1 font-mono">N</code> also die Anzahl der Wörter
									ist, verwendet das Modell <code class="bg-muted px-1 font-mono">N-1</code> Wörter als
									Kontext, um das nächste Wort vorhersagen zu können.
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
					</HoverCard.Root> ist ein Grundkonzept in der Modellierung von Sprache und bezeichnet dabei
					eine Sequenz von
					<code class="bg-muted px-1 font-mono">N</code>
					Elementen, wobei <code class="bg-muted px-1 font-mono">N</code> für die Anzahl der Wörter oder
					Zeichen steht.
				</p>

				<p>
					Dieses N-Gramm-Modell hat 100 ausgewählte Songs von Ed Sheeran analysiert. Gib
					Schlüsselwörter auf Englisch in Kleinschreibweise und ohne Sonderzeichen ein, wie sie in
					Ed Sheerans Songtexten vorkommen würden und generiere dann Vorhersagen mit dem Modell.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="textarea" class="mb-2 block">
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
			<Textarea
				bind:value={text}
				class="h-28 w-full resize-none"
				id="textarea"
				maxlength={300}
				placeholder="im in love ..."
				onkeypress={handleTextareaOnInput}
			/>
			<div class="mt-1.5 flex items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(text as string).length || 0} / 300</small>
				<small>{`${getModelName(text as string) ?? 'Unigramm (Kontext: 0 Wörter)'}`}</small>
			</div>
			<div class="mt-6 h-32 w-full overflow-y-auto rounded-md bg-muted/30"></div>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<div style="visibility: {!hasBeenReset && hasBeenClicked ? 'auto' : 'hidden'};">
				<Button onclick={handleReset} variant="outline"
					>Zurücksetzen<Reset class="ml-2 h-4 w-4" /></Button
				>
			</div>
			<Button class="ease-out active:translate-y-0.5" onclick={handleClick} disabled={!text}
				>{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}</Button
			>
		</Card.Footer>
	</Card.Root>

	<div class="relative my-10">
		<ScrollArea class="h-[350px] w-full rounded-md border p-4">
			<Table.Root>
				<Table.Caption>
					{#if !inputs.length}Noch keine Historie verfügbar{/if}
				</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-24">Seed</Table.Head>
						<Table.Head>Input</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body
					>{#if inputs.length}
						{#each inputs as { id, seed, text } (id)}
							<Table.Row>
								<Table.Cell>{seed}</Table.Cell>
								<Table.Cell>{text}</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</ScrollArea>
	</div>

	<!-- <LLMNext url={data.url} prev="Bigramm" next="..." /> -->
</section>

<Toaster position="bottom-right" />
