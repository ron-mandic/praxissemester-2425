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
	import { formatSearch, formatSearchToken, preprocess } from '$lib/ts/functions';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	import { createSwapy } from 'swapy';
	import { onMount, tick } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import {
		EXAMPLE_OBJ_SONG,
		EXAMPLE_OBJ_SONG_PREFORMATTED,
		TOKEN_COLORS
	} from '$lib/ts/constants.js';
	import { Label } from '@/ui/label/index.js';
	import Textarea from '@/ui/textarea/textarea.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import * as Accordion from '$lib/components/ui/accordion';
	import { sparsevec } from 'drizzle-orm/pg-core';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { Slider } from '$lib/components/ui/slider';
	import TemperatureRange from '@/svelte/TemperatureRange.svelte';
	import AnimatedBeamMultipleInput from '@/svelte/AnimatedBeamMultipleInput.svelte';
	import LLMLoader from '@/svelte/LLMLoader.svelte';

	let prompt = $state('The sky is');
	let seed = $state(null as number | null);
	let temperature = $state(7);
	let currentView = $state('3');
	let selectedToken = $state('');
	let outputs = $state(null);
	let outputTokens = $state([]);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	const { data } = $props();
	const END_TOKEN = '</w>';
	const LT = '&lt;';
	const SLASH = '&#47;';
	const GT = '&gt;';
	const END_TOKEN_ESCAPED = LT + SLASH + 'w' + GT;

	$effect(() => {
		return handleReset;
	});

	function* generator(colors: string[]) {
		let currentColor = '';

		while (true) {
			let color = colors[Math.floor(Math.random() * colors.length)];
			if (color !== currentColor) {
				currentColor = color;
				yield currentColor;
			}
		}
	}

	const gen = generator(TOKEN_COLORS);

	const filterBy = (outputTokens: any[], searchValue: string) => {
		if (!searchValue) return outputTokens;
		return outputTokens.filter(({ token }) =>
			token.toLowerCase().includes(searchValue.toLowerCase())
		);
	};

	function colorTokens(outputTokens: string[]) {
		return outputTokens.map((token) => {
			return `<span class="whitespace-break-spaces bg-[${gen.next().value}]">${token}</span>`;
		});
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
		if (seed) seed = seed! - 1;
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

	function handleSelectedToken(event: Event) {
		const word = (event.currentTarget! as HTMLDivElement).dataset.token;

		if (word === selectedToken) {
			selectedToken = '';
		} else {
			selectedToken = word!;
		}
	}

	function highlightSelectedWord(str: string) {
		if (!selectedToken) return str;

		return str.replace(
			new RegExp(!/\w+/.test(selectedToken) ? '\\' + selectedToken : selectedToken, 'g'),
			// then: just `<mark>${selectedWord}</mark>`
			(match) =>
				`<mark class="bg-blue-200 text-blue-700 rounded-[.25rem] px-1 py-0.5">${match}</mark>`
		);
	}

	async function handleClick() {
		let body = {
			prompt,
			temperature: (temperature / 10).toFixed(1),
			num_samples: 5
		};
		let headers = { 'Content-Type': 'application/json' };

		if (seed !== null) {
			body = { ...body, seed: seed };
		}

		isFetching = true;
		const response = await fetch('/api/gpt2', {
			method: 'POST',
			body: JSON.stringify(body),
			headers
		});
		const data = await response.json();
		outputs = data;

		outputTokens = data.stats.prompt_tokens;
		prompt += data.top_k_sample.token;

		if (!hasBeenClicked) {
			hasBeenClicked = true;
		}
		isFetching = false;
	}

	function handleReset() {
		prompt = '';
		selectedToken = '';
		outputs = null;
		outputTokens = [];
		hasBeenClicked = false;
		hasBeenReset = false;
		hasEnded = false;
		isFetching = false;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(outputs);
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Seed und Temperatur</h2>

	<Card.Root class="w-full">
		<Card.Header class="flex gap-y-6">
			<Card.Title>Der Mix für kontrolliertes Chaos!</Card.Title>
			<div class="flex flex-col items-center justify-between gap-x-6 gap-y-4 md:flex-row">
				<div class="flex w-full flex-1 items-center gap-x-4">
					<Label for="temperature" class="text-sm text-muted-foreground">
						<HoverCard.Root>
							<HoverCard.Trigger class="hover:animate-pulse">
								<span class="inline-flex items-center justify-between gap-1"
									>Temperatur <Info class="inline-block h-4 w-4" /></span
								>
							</HoverCard.Trigger>
							<HoverCard.Content>
								<div class="flex flex-col items-start gap-2 text-sm">
									<p>
										Die Temperatur ist ein Maß, wie stark die Ergebnisse des Modells untereinander
										gewichtet werden sollen. In anderen Worten stellt das Modell mit einer
										niedrigeren Temperatur eher konservative und deterministischere Vorhersagen auf,
										während es mit einer höheren Temperatur eher risikofreudige Vorhersagen macht,
										indem es auch weniger wahrscheinliche Tokens berücksichtigt.
									</p>
									<p>
										Hier kannst du eine Temperatur zwischen <code class="bg-muted px-1 font-mono"
											>0</code
										>
										und
										<code class="bg-muted px-1 font-mono">2</code> wählen.
									</p>
									<Separator class="my-2" />
									<a
										class="flex items-center gap-2 text-muted-foreground"
										href="https://medium.com/@weidagang/demystifying-temperature-in-machine-learning-ef6828ad4e2d"
										target="_blank"
										rel="noopener noreferrer"
										>Demystifying Temperature in Machine Learning <ExternalLink
											class="inline-block h-4 w-4"
										/></a
									>
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					</Label>
					<TemperatureRange bind:value={temperature} disabled={hasBeenClicked} />
				</div>
				<div class="flex w-full items-center justify-between gap-3 md:w-auto md:justify-stretch">
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
							class="min-w-20 max-w-20"
							type="number"
							id="seed"
							min={0}
							max={9999}
							maxlength={4}
							pattern="\d{4}"
							oninput={handleInputSeed}
							disabled={hasBeenClicked || hasEnded}
						/>
					</div>
				</div>
			</div>
			<Card.Description>
				<p class="text-balance">
					Seed und Temperaur sind zwei wichtige Parameter bei der Interaktion mit dem Modell, die
					die Generierung von Texten beeinflussen. Doch wie genau funktioniert das und was hat das
					mit der Ausgabe der Wahrscheinlichkeiten von Tokens zu tun? Dabei schauen wir uns hier
					auch genauer an, wie die Rohwerte aus dem Modell in Wahrscheinlichkeiten umgewandelt
					werden müssen.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="text" class="mb-2 block">Prompt (en-US)</Label>
			<Input
				bind:value={prompt}
				class="w-full text-base"
				id="text"
				placeholder="The sky is"
				maxlength={128}
				disabled={hasBeenClicked}
				onkeypress={handlePress}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(prompt as string).length || 0} / 128</small>
			</div>

			<Label for="text" class="mb-2 mt-10 block">Tokenvorhersage</Label>
			<div class="div flex h-20 w-full items-center justify-center rounded-md bg-muted/30">
				{#if outputs?.top_k_sample}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div class="animate-bounceIn">
								<Badge
									class="box-border w-full max-w-24 text-base {selectedToken &&
									outputs?.top_k_sample.token === selectedToken
										? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
										: 'text-foreground'}"
									variant="outline"
									data-token={outputs?.top_k_sample.token}
									onclick={handleSelectedToken}
								>
									<span class="max-w-24 overflow-hidden text-ellipsis whitespace-pre"
										>{outputs?.top_k_sample.token ?? 'Error'}</span
									>
								</Badge>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content class="p-0">
							<Table.Root class="m-0 p-0 text-sm">
								<Table.Body>
									<Table.Row>
										<Table.Cell>Wahrscheinlichkeit</Table.Cell>
										<Table.Cell class="font-mono"
											>{(outputs?.top_k_sample.probability * 100).toFixed(2) + ' %' ??
												'Error'}</Table.Cell
										>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Rohwert (Logit)</Table.Cell>
										<Table.Cell class="font-mono"
											>{outputs?.top_k_sample.logit.toFixed(2) ?? 'Error'}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				{:else}
					<p class="select-none whitespace-nowrap text-sm text-muted-foreground md:text-base">
						Noch keine Vorhersage gemacht
					</p>
				{/if}
			</div>

			<Label for="text" class="mb-2 mt-10 block">Tokens</Label>
			<Tabs.Root value="0" class="w-full">
				<Tabs.List class="w-full">
					<Tabs.Trigger class="w-full" value="0">Tokens</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="1">Output</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content class="h-full w-full" value="0">
					<ScrollArea
						class="max-h-[400px] min-h-[400px] w-full items-center justify-center rounded-md bg-muted/30 transition-all"
						orientation="both"
					>
						{#if !outputs}
							<p
								class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-center text-muted-foreground md:whitespace-nowrap md:text-center"
								in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
							>
								Hier werden deine Eingaben visualisiert
							</p>
						{:else}
							<div
								class="mx-auto flex h-full w-full items-center justify-center border-none bg-transparent px-8 py-8"
								in:fly={{ delay: 550, duration: 500, y: -10, opacity: 0, easing: quintOut }}
							>
								{#if outputs}
									<AnimatedBeamMultipleInput
										class="w-full"
										{outputs}
										{selectedToken}
										{handleSelectedToken}
									/>
								{/if}
							</div>
						{/if}
					</ScrollArea>
				</Tabs.Content>
				<Tabs.Content class="h-full w-full" value="1">
					<ScrollArea
						class="max-h-[400px] min-h-[400px] w-full rounded-md bg-muted/30 px-6 py-0"
						orientation="vertical"
					>
						<!-- TODO: Make uniform colored output across all interfaces -->
						<div class="h-full w-full py-6 debug">
							<div>
								{#if !outputs}
									<p
										class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
									>
										Hier wird der Output angezeigt
									</p>
								{:else}
									{#each outputTokens as { token, token_id }, i}
										{#if token_id}
											<Tooltip.Root>
												<Tooltip.Trigger class="mx-0 -mr-[0.275rem] py-0">
													<span
														class="inline-block bg-[{gen.next()
															.value}] mb-1 whitespace-break-spaces rounded-[2px]"
														style="background-color: {gen.next().value};">{token}</span
													>
												</Tooltip.Trigger>
												<Tooltip.Content class="p-0">
													<Table.Root class="m-0 p-0 text-sm">
														<Table.Body>
															<Table.Row>
																<Table.Cell>Token</Table.Cell>
																<Table.Cell class="text-right font-mono">{token}</Table.Cell>
															</Table.Row>
															<Table.Row>
																<Table.Cell>ID</Table.Cell>
																<Table.Cell class="text-right font-mono">{token_id}</Table.Cell>
															</Table.Row>
														</Table.Body>
													</Table.Root>
												</Tooltip.Content>
											</Tooltip.Root>
										{:else}
											<span
												class="mb-1 inline-block whitespace-break-spaces rounded-[2px]"
												style="background-color: {gen.next().value};">{token}</span
											>
										{/if}
									{/each}
								{/if}
							</div>
						</div>
					</ScrollArea>
				</Tabs.Content>
			</Tabs.Root>
		</Card.Content>

		<Accordion.Root
			class="mb-8 mt-2 px-6 {!hasBeenClicked
				? 'pointer-events-none opacity-40'
				: 'pointer-event-none opacity-100 transition-all'}"
		>
			<Accordion.Item value="table" class="border-none">
				<Accordion.Trigger>
					<span class="font-regular flex items-center justify-start gap-x-2 text-sm"
						><TableIcon class="h-4 w-4" /> Informationen</span
					>
				</Accordion.Trigger>
				<Accordion.Content>
					{#if outputs?.stats}
						{@const {
							temperature,
							seed,
							loss,
							prompt_length,
							vocab_size,
							entropy,
							avg_top_probability,
							avg_bottom_probability
						} = outputs?.stats}
						<Table.Root class="text-sm">
							<Table.Row>
								<Table.Cell>Temperatur</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{temperature}
								</Table.Cell>
							</Table.Row><Table.Row>
								<Table.Cell>Seed</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{seed ?? 'N/A'}
								</Table.Cell>
							</Table.Row><Table.Row>
								<Table.Cell>Verlustwert</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{loss.toFixed(2)}
								</Table.Cell>
							</Table.Row><Table.Row>
								<Table.Cell>Promptlänge</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{prompt_length}
								</Table.Cell>
							</Table.Row><Table.Row>
								<Table.Cell>Vokabelgröße</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{vocab_size}
								</Table.Cell>
							</Table.Row><Table.Row>
								<Table.Cell>Entropie</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{entropy.toFixed(2)}
								</Table.Cell>
							</Table.Row><Table.Row>
								<Table.Cell>Durchschn. Top-Wahrscheinlichkeit</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{(avg_top_probability * 100).toFixed(0)} %
								</Table.Cell>
							</Table.Row><Table.Row>
								<Table.Cell>Durchschn. Bottom-Wahrscheinlichkeit</Table.Cell>
								<Table.Cell class="text-right font-mono">
									{(avg_bottom_probability * 100).toFixed(0)} %
								</Table.Cell>
							</Table.Row>
						</Table.Root>
					{/if}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
		<Card.Footer class="flex justify-between">
			<div style="visibility: {!hasBeenReset && hasBeenClicked ? 'auto' : 'hidden'};">
				<Button
					class="px-5 py-6 {hasEnded ? 'duration-400 animate-bounce ease-in' : 'animate-none'}"
					onclick={handleReset}
					variant="outline">Zurücksetzen<Reset class="ml-2 h-4 w-4" /></Button
				>
			</div>
			<Button
				class="relative px-5 py-6 transition-transform ease-out active:translate-y-0.5"
				onclick={handleClick}
				disabled={!prompt.trim()}
			>
				{#if hasBeenClicked}
					<span>Weiter <span class="hidden md:inline-block">generieren</span></span>
				{:else}
					<span>Generieren</span>
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>

	<Tabs.Root class="mt-8 w-full" bind:value={currentView}>
		<Tabs.List class="w-full">
			<Tabs.Trigger class="w-full" value="3">
				<HoverCard.Root>
					<HoverCard.Trigger class="whitespace-nowrap hover:animate-pulse"
						>top_k <Info class="-mt-1 inline-block h-4 w-4" /></HoverCard.Trigger
					>
					<HoverCard.Content class="w-72">
						<div class="flex flex-col items-start gap-2 text-sm">
							<p>
								Dies beschreibt die fünf Ergebnisse des Modells, denen das Modell die höchste
								Wahrscheinlichkeit zugewiesen hat. Nun kann eine Stichprobe aus dem imaginären Topf
								gezogen werden, die zu dem Zeitpunkt unsere Vorhersage des nächsten Tokens für
								unseren Prompt darstellt.
							</p>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			</Tabs.Trigger>
			<Tabs.Trigger class="w-full" value="4">
				<HoverCard.Root>
					<HoverCard.Trigger class="whitespace-nowrap hover:animate-pulse"
						>bottom_k <Info class="-mt-1 inline-block h-4 w-4" /></HoverCard.Trigger
					>
					<HoverCard.Content class="w-72">
						<div class="flex flex-col items-start gap-2 text-sm">
							<p>
								Analog zu den Top-5-Ergebnissen zeigt diese Anzeige auch alle Token an, die vom
								Modell für die Prompt-Runde am schlechtesten bewertet wurden. Das bedeutet, dass die
								Wahrscheinlichkeit des Auftretens dieser Zeichen im gegebenen Kontext am geringsten
								ist.
							</p>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class="h-full w-full" value="3">
			{#if hasBeenClicked}
				<div class="relative grid h-[290px] w-full grid-cols-1 gap-y-6 rounded-md border p-6">
					{#if outputs?.top_k}
						{#each outputs['top_k'] as { token, probability }, i}
							<div
								class="grid w-full grid-cols-[2fr_8fr_2fr] grid-rows-1 items-center gap-x-6"
								in:fly={{ delay: i * 100, duration: 500, y: -10, opacity: 0, easing: quintOut }}
							>
								<Badge
									class="h-min max-h-[26px] w-min max-w-20 cursor-pointer {selectedToken &&
									token === selectedToken
										? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
										: 'text-foreground'}"
									variant="secondary"
									data-token={token}
									onclick={handleSelectedToken}
								>
									<span class="max-w-18 overflow-hidden text-ellipsis whitespace-pre text-sm">
										{token}</span
									>
								</Badge>
								<div
									class="scale-to-x h-3 w-full rounded-xl bg-gradient-to-r from-orange-300 to-purple-500 transition-all"
									style="width: {(probability * 100).toFixed(2)}%"
								></div>
								<span class="text-right font-mono text-sm">{(probability * 100).toFixed(2)}</span>
							</div>
						{/each}
					{/if}
				</div>
			{:else}
				<div class="relative grid h-[290px] w-full grid-cols-1 gap-y-6 rounded-md border p-6">
					<p
						class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
					>
						Hier werden die obersten Ergebnisse angezeigt
					</p>
				</div>
			{/if}
		</Tabs.Content>
		<Tabs.Content class="h-full w-full" value="4">
			{#if hasBeenClicked}
				<div class="relative grid h-[290px] w-full grid-cols-1 gap-y-6 rounded-md border p-6">
					{#if outputs?.bottom_k}
						{#each outputs['bottom_k']! as { token, probability }, i}
							<div
								class="grid w-full grid-cols-[2fr_8fr_2fr] grid-rows-1 items-center gap-x-6"
								in:fly={{ delay: i * 100, duration: 500, y: -10, opacity: 0, easing: quintOut }}
							>
								<Badge class="h-min max-h-[26px] w-min max-w-20 cursor-pointer" variant="secondary">
									<span class="max-w-18 overflow-hidden text-ellipsis whitespace-pre text-sm">
										{token}</span
									>
								</Badge>
								<div
									class="scale-to-x h-3 w-full rounded-xl bg-gradient-to-r from-orange-300 to-purple-500 transition-all"
									style="width: {(probability * 100).toFixed(2)}%"
								></div>
								<span class="text-right font-mono text-sm">{(probability * 100).toFixed(2)}</span>
							</div>
						{/each}
					{/if}
				</div>
			{:else}
				<div class="relative grid h-[290px] w-full grid-cols-1 gap-y-6 rounded-md border p-6">
					<p
						class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
					>
						Hier werden die obersten Ergebnisse angezeigt
					</p>
				</div>
			{/if}
		</Tabs.Content>
	</Tabs.Root>

	<LLMNext url={data.url} prev="Affixe" next="Generierung" />
</section>

<Toaster position="bottom-right" />

<style lang="scss">
	@keyframes scale-to-x {
		0% {
			scale: 0 1;
		}
		100% {
			scale: 1 1;
		}
	}

	.scale-to-x {
		animation: scale-to-x 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
		transform-origin: left;
	}
</style>
