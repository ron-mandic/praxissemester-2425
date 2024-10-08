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
	import { formatSearch, preprocess } from '$lib/ts/functions';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import LLMLoader from '@/svelte/LLMLoader.svelte';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	import { createSwapy } from 'swapy';
	import { onMount, tick } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintOut, backOut, backInOut, backIn } from 'svelte/easing';
	import { EXAMPLE_OBJ_SONG, EXAMPLE_OBJ_SONG_PREFORMATTED } from '$lib/ts/constants.js';
	import { Label } from '@/ui/label/index.js';
	import Textarea from '@/ui/textarea/textarea.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import * as Accordion from '$lib/components/ui/accordion';
	import { sparsevec } from 'drizzle-orm/pg-core';
	import IconMistral from '@/svelte/IconMistral.svelte';
	import { X } from 'lucide-svelte';

	let contextValue = $state('');
	let output = $state({} as any);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasConfirmed = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	let inputValues = $state(['', '', ''] as (null | string)[]);

	const { data } = $props();

	$effect(() => {
		return handleReset;
	});

	function showEmbedding(embeddings: number[]) {
		if (!hasConfirmed) {
			return embeddings.slice(0, 256);
		}

		return embeddings;
	}

	function getPlaceholder(i: number) {
		switch (i) {
			case 0:
				return 'Gib hier deinen Text ein';
			case 1:
				return 'Hier kann auch ein ganzer Satz stehen';
			case 2:
				return 'Hier könnte wieder eine ähnliche Bezeichnung stehen';
			case 3:
				return 'Oder du zählst zufällig einzelne Wörter auf';
			case 4:
				return 'Du kannst natürlich mehr eingeben';
			default:
				return `${i <= 5 ? 'Aber nicht mehr' : 'Und auch nicht mehr'} als ${i + 1} Eingaben`;
		}
	}

	function handleConfirm() {
		hasConfirmed = !hasConfirmed;
	}

	async function handlePress(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			inputValues.push('');
			tick().then(() => {
				const input = document.getElementById(`text-${inputValues.length - 1}`);
				input?.focus();
			});
		}
	}

	async function handleClick() {
		let body = JSON.stringify({ input: inputValues });
		let headers = { 'Content-Type': 'application/json' };

		isFetching = true;
		const response = await fetch('/api/embed/visualize', { method: 'POST', body, headers });
		const data = await response.json();
		output = data;

		if (!hasBeenClicked) {
			hasBeenClicked = true;
		}
		isFetching = false;
	}

	function handleReset() {
		contextValue = '';
		hasBeenClicked = false;
		hasBeenReset = false;
		hasEnded = false;
		isFetching = false;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Visualisierung</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Text als wildes Zahlengeflecht</Card.Title>
			<Card.Description>
				<p>
					Du kennst das Spiel bereits - unten kannst du deine Eingabe tätigen und dabei ist es egal,
					ob es ein einzelnes Wort oder ein ganzer Satz ist. Hier geht es darum, die Wörter nur in
					Zahlen umzuwandeln, bevor im nächsten Kapitel die Ähnlichkeit zwischen den Wörtern
					untersucht werden kann, um so die semantische Bedeutung zu erfassen.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			{#each inputValues as inputValue, i}
				<div class="mt-2 flex flex-col justify-between">
					{#if !i}
						<Label for="text-{i}" class="mb-4 mr-2 mt-4">Inputfelder</Label>
					{/if}
					<div class="flex gap-x-2" in:fly={{ y: -10, opacity: 0, easing: backOut }}>
						<Input
							id="text-{i}"
							bind:value={inputValues[i]}
							disabled={hasBeenClicked}
							maxlength={256}
							placeholder={getPlaceholder(i)}
							onkeydown={handlePress}
						/>
						<Button
							variant="outline"
							class="w-10"
							onclick={() => {
								if (inputValues.length > 1) {
									inputValues.splice(i, 1);
								}
							}}
							disabled={inputValues.length === 1}
						>
							<span class="sr-only">Reset</span>
							<span aria-hidden="true"> <X class="w-4- h-4" /> </span>
						</Button>
					</div>
				</div>
			{/each}

			<div class="mt-6 flex items-center justify-center">
				<Button
					variant="secondary"
					onclick={() => {
						if (inputValues.length <= 6) {
							inputValues.push('');
						}
					}}
					class={inputValues.length === 1 ? 'animate-pulse' : 'animate-none'}
					disabled={inputValues.length >= 7}>Inputfeld hinzufügen</Button
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
				disabled={inputValues.length >= 3 && inputValues.every((v) => v !== '')}
				onclick={handleClick}
			>
				{#if hasBeenClicked}
					<span>Erneut <span class="hidden md:inline-block">generieren</span></span>
				{:else}
					<span>Generieren</span>
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>

	<div class="mt-6">
		<Card.Root class="dark w-full">
			<Card.Header class="p-1.5">
				<ScrollArea
					class="relative h-[525px] w-full rounded-md bg-muted/50 transition-all"
					orientation="vertical"
				>
					<div>
						<div class="h-full w-full px-4 pb-8 pt-4">
							{#if hasBeenClicked}
								<div
									in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
									out:fly={{ duration: 300, y: 10, opacity: 0, easing: quintOut }}
								>
									<div
										class="mx-auto w-full columns-1 3xs:max-w-[375px] 3xs:columns-2 xs:max-w-full xs:columns-3 sm:columns-4"
									>
										{#each showEmbedding(output?.embeddings[0]) as num, i}
											<div
												class="mb-2.5 flex items-center justify-around gap-1 font-mono 3xs:justify-evenly"
											>
												<span class="select-none text-sm text-muted-foreground"
													>{i.toString().padStart(4, '0')}</span
												>
												<span
													class="select-none rounded-sm p-1 text-sm 3xs:hidden {num === 0
														? 'text-grey bg-white/10'
														: num > 0
															? 'bg-green-400/10 text-green-400'
															: 'bg-red-400/10 text-red-400'}"
													>{num.toFixed(num >= 0 ? 9 : 8).padEnd(25, '0')}</span
												>
												<span
													class="hidden select-none rounded-sm p-1 text-sm 3xs:block sm:hidden {num ===
													0
														? 'text-grey bg-white/10'
														: num > 0
															? 'bg-green-400/10 text-green-400'
															: 'bg-red-400/10 text-red-400'}">{num.toFixed(num >= 0 ? 9 : 8)}</span
												>
												<span
													class="hidden select-none rounded-sm p-1 text-sm sm:block {num === 0
														? 'text-grey bg-white/10'
														: num > 0
															? 'bg-green-400/10 text-green-400'
															: 'bg-red-400/10 text-red-400'}">{num.toFixed(num >= 0 ? 7 : 6)}</span
												>
											</div>
										{/each}
									</div>

									<div class="mt-8 flex w-full items-center justify-center">
										<Button variant="secondary" onclick={handleConfirm}>
											{#if hasConfirmed}
												<span>Nur 512 Werte anzeigen</span>
											{:else}
												<span>Alle 4096 Werte anzeigen</span>
											{/if}
										</Button>
									</div>
								</div>
							{:else}
								<LLMLoader
									in={{ start: 0, opacity: 0, duration: 1000, cssDelay: 1200 }}
									out={{ duration: 250 }}
								/>
							{/if}
						</div>
					</div>
				</ScrollArea>

				<div class="flex h-16 w-full items-center justify-center">
					{#if !hasBeenClicked}
						<span class="font-regular select-none text-sm text-muted-foreground"
							>Bitte gib erst einen Text ein</span
						>
					{:else}
						<Card.Title class="mx-auto w-full max-w-96 text-center">
							<span class="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap px-4"
								>{contextValue}</span
							>
						</Card.Title>
					{/if}
				</div>
			</Card.Header>
		</Card.Root>
	</div>

	<LLMNext url={data.url} prev="Affixe" next="Generierung" />
</section>

<Toaster position="bottom-right" />
