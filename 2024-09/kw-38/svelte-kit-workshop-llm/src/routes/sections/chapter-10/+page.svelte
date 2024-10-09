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
	import * as Select from '$lib/components/ui/select';
	import { X, Plus } from 'lucide-svelte';
	import type { Selected } from 'bits-ui';

	let contextValue = $state('');
	let output = $state({} as any);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasConfirmed = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	let inputValues = $state(['', '', ''] as string[]);
	let inputValues0 = [
		'Shape of You',
		'End Game',
		'Cold Water',
		'Bad Habits',
		'Shivers',
		'Over Again',
		'Nothing on you'
	]; // Item 2
	let inputValues1 = ['Cat', 'Elephant', 'Donkey', 'Horse', 'Dog', 'Lion', 'Zebra']; // Item 1
	let selectedView = $state() as Selected<string> | undefined;
	let selectValues = [
		{ value: '0', label: 'Ed Sheeran Songs' },
		{ value: '1', label: 'Tiere' },
		{ value: '2', label: 'Eigene Labels' }
	];

	const { data } = $props();

	$effect(() => {
		return handleReset;
	});

	$effect(() => {
		if (selectedView?.value === '0') {
			inputValues = inputValues0;
			output = {};
		} else if (selectedView?.value === '1') {
			inputValues = inputValues1;
			output = {};
		} else if (selectedView?.value === '2') {
			inputValues = ['', '', ''];
			output = {};
		}
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
		if (inputValues.length >= 7) return;

		if (event.key === 'Enter' && event.ctrlKey) {
			inputValues.push('');
			tick().then(() => {
				const input = document.getElementById(`text-${inputValues.length - 1}`);
				input?.focus();
			});
		}
	}

	async function handleClick() {
		let body = JSON.stringify({
			input: inputValues
		});
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

	$inspect(output);
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Visualisierung</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Stochastische Nachbarschaftssuche</Card.Title>
			<Card.Description>
				<p>
					Wir befinden uns also im zweidimensionalen Raum und haben eine Menge von Punkten, die wir
					untersuchen wollen. Die Frage, die wir uns stellen, ist, wie wir semantisch ähnliche
					Punkte in die Nähe ähnlicher Punkte bringen. Dazu verwenden wir den t-SNE Algorithmus.
					Wähle beliebige Wörter und Sätze aus und schaue dir die Visualisierung der Embeddings an.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<div class="mb-8 flex w-full items-center justify-between">
				<h3>Inputfelder</h3>
				<Select.Root
					selected={selectedView}
					onSelectedChange={(v) => v && (selectedView = v)}
					disabled={hasBeenClicked}
				>
					<Select.Trigger class="w-48">
						<Select.Value placeholder="Themenfelder" />
					</Select.Trigger>
					<Select.Content>
						{#each selectValues as { value, label }}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			{#each inputValues as inputValue, i}
				<div class="mt-2 flex flex-col justify-between">
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
					class="w-10"
					variant="secondary"
					onclick={() => {
						if (inputValues.length <= 6) {
							inputValues.push('');
						}
					}}
					disabled={inputValues.length >= 7 || hasBeenClicked}
				>
					<span aria-hidden="true"> <Plus class="w-4- h-4" /> </span>
				</Button>
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
				disabled={(inputValues.length >= 3 &&
					inputValues.filter(Boolean).length !== inputValues.length) ||
					hasBeenClicked}
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
				<div class="relative h-[525px] w-full rounded-md bg-muted/50 p-10 transition-all" id="grid">
					{#if hasBeenClicked}
						<div
							class="relative h-full w-full"
							in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
							out:fly={{ duration: 300, y: 10, opacity: 0, easing: quintOut }}
						>
							{#each output?.coordinates as { x, y, top, left }, i}
								<HoverCard.Root>
									<HoverCard.Trigger
										class="absolute h-4 w-4 cursor-pointer rounded-full bg-white hover:animate-pulse"
										style="top: calc({top}% - 6px); left: calc({left}% - 6px);"
									></HoverCard.Trigger>
									<HoverCard.Content class="h-min w-min text-sm">
										<span>{output.input[i]}</span>
									</HoverCard.Content>
								</HoverCard.Root>
							{/each}
						</div>
					{:else}
						<LLMLoader
							in={{ start: 0, opacity: 0, duration: 1000, cssDelay: 1200 }}
							out={{ duration: 250 }}
						/>
					{/if}
				</div>

				<div class="flex h-16 w-full items-center justify-center">
					{#if !hasBeenClicked}
						<span class="font-regular select-none text-sm text-muted-foreground"
							>Bitte gib erst deine Texte ein</span
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

<style lang="scss">
	#grid {
		position: relative;
		&::before {
			// this will be the vertical line through the center from top to bottom
			content: '';
			position: absolute;
			top: 0;
			left: 50%;
			width: 1px;
			height: 100%;
			background-color: var(--color-muted-foreground);
			z-index: 1;
		}
	}
</style>
