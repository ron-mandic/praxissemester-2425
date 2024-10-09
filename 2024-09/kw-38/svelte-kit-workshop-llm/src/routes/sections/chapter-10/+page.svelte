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
	import { Trigger } from '@/ui/collapsible';

	// TODO: Switch to UMAP one day
	// TODO: Add similarity scores and metrics (like euclidean distance)

	let contextValue = $state('');
	let output = $state({} as any);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasConfirmed = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	let inputValues = $state(['', '', ''] as string[]);
	let inputValues0 = [
		'In Shape of You, there is being taught the moral of love and attraction.',
		'In Perfect, the lyrics express unconditional love and commitment.',
		'Castle on the Hill narrates a nostalgic journey of youth and memories.',
		'Photograph captures the essence of preserving memories through love.',
		'Happier highlights the bittersweet feeling of seeing an ex move on.',
		"I Don't Care conveys a carefree attitude in the face of judgment.",
		'Bad Habits discusses the conflict between desires and personal flaws.'
	]; // Item 0
	let inputValues1 = [
		'The cat pounces playfully on the balcony.',
		'The elephant forages for food in the savanna.',
		'The donkey brays loudly in the farmyard.',
		'The buffalo grazes steadily in the vast grasslands.',
		'The dog barks happily in the backyard.',
		'The lion roars majestically in the grasslands.',
		'The zebra grazes peacefully under the sun.'
	]; // Item 1
	let inputValues2 = [
		'In a democracy, the people have the power to elect their leaders.',
		'A monarchy is a system of government where a king or queen rules the country.',
		'In a republic, the head of state is elected, rather than inheriting the position.',
		'A theocracy is a government ruled by religious leaders and based on religious law.',
		'Under a dictatorship, a single person holds absolute power, often gained through force.',
		'An oligarchy is a system where a small group of people control the government.',
		'A federation is a union of states with a central government, but states retain some independence.'
	]; // Item 2
	let inputValues3 = [
		'Joy: She feels pure joy as she celebrates her birthday with friends and family.',
		'Sadness: He sits alone in his room, feeling a deep sense of sadness after the loss of his pet.',
		"Anger: The loud noise outside makes her feel angry, and she can't concentrate on her work.",
		'Surprise: He was taken by surprise when his friends threw him a surprise party.',
		'Fear: As she walked through the dark alley, a feeling of fear washed over her.',
		'Energized: After a refreshing run in the morning, he feels energized and ready to take on the day.',
		'Contentment: She feels content as she sits by the fireplace, sipping hot cocoa on a cold winter night.'
	];
	let selectedView = $state() as Selected<string> | undefined;
	let selectValues = [
		{ value: '0', label: 'Songs' },
		{ value: '1', label: 'Tiere' },
		{ value: '2', label: 'Staatsformen' },
		{ value: '3', label: 'Gefühle' },
		{ value: '4', label: 'Neues Themenfeld' }
	];

	const { data } = $props();
	console.log(data);

	const MAX_INPUT_FIELDS = 7;

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
			inputValues = inputValues2;
			output = {};
		} else if (selectedView?.value === '3') {
			inputValues = inputValues3;
			output = {};
		} else {
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
					untersuchen wollen. Die Frage, die wir uns stellen, ist, wie die Punkte in der Nähe
					semantisch ähnlicher Punkte aussehen und zu Gruppen zusammengefasst werden könnten. Um das
					zu veranschaulichen, verwenden wir den t-SNE Algorithmus. Wähle beliebige Wörter oder
					ganze Sätze aus und schaue dir die Visualisierung der Embeddings an.
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
						<Select.Value placeholder="Thema auswählen" />
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
				<div
					class="relative h-[525px] w-full rounded-md bg-muted/50 p-10 transition-all {hasBeenClicked &&
						'coords'}"
				>
					{#if hasBeenClicked}
						<div
							id="grid"
							class="relative h-full w-full"
							in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
							out:fly={{ duration: 300, y: 10, opacity: 0, easing: quintOut }}
						>
							{#each output?.values?.coords as { x, y, top, left }, i}
								<HoverCard.Root>
									<HoverCard.Trigger
										class="absolute z-10 h-4 w-4 cursor-pointer rounded-full bg-white hover:animate-pulse"
										style="top: calc({top * 100}% - 8px); left: calc({left * 100}% - 8px);"
									></HoverCard.Trigger>
									<HoverCard.Content class="h-min w-min px-4 py-2 text-sm">
										<p
											class="w-full max-w-56 overflow-hidden text-ellipsis whitespace-nowrap font-bold"
										>
											{output.input[i]}
										</p>
										<div
											class="mt-2 grid min-w-14 max-w-14 grid-cols-2 whitespace-nowrap font-mono text-sm"
										>
											<span>x:</span>
											<span class="text-right">{Math.round(x)}</span>
											<span>y:</span>
											<span class="text-right">{Math.round(y)}</span>
										</div>
									</HoverCard.Content>
								</HoverCard.Root>
							{/each}
						</div>

						<div
							id="x-labels"
							class="pointer-events-none -my-2 px-2"
							in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
						>
							<span class="text-sm text-muted-foreground"
								>{Math.round(output?.values?.limes.x[0] * 1.16)}</span
							>
							<span class="text-sm text-muted-foreground"
								>{Math.round(output?.values?.limes.x[1] * 1.16)}</span
							>
						</div>

						<div
							id="y-labels"
							class="pointer-events-none px-2 py-2"
							in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
						>
							<span class="text-sm text-muted-foreground"
								>{Math.round(output?.values?.limes.y[0] * 1.164)}</span
							>
							<span class="text-sm text-muted-foreground"
								>{Math.round(output?.values?.limes.y[1] * 1.164)}</span
							>
						</div>
					{:else if isFetching}
						<LLMLoader
							in={{ start: 0, opacity: 0, duration: 1000, cssDelay: 1200 }}
							out={{ duration: 250 }}
						/>
					{:else}
						<p
							class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-muted-foreground"
							in:fly={{ delay: 550, duration: 300, y: -10, opacity: 0, easing: quintOut }}
						>
							Hier werden deine Wörter visualisiert
						</p>
					{/if}
				</div>
			</Card.Header>
		</Card.Root>
	</div>

	<LLMNext url={data.url} prev="Affixe" next="Generierung" />
</section>

<Toaster position="bottom-right" />

<style lang="scss">
	.coords {
		position: relative;
		&::before {
			// this will be the vertical line through the center from top to bottom
			content: '';
			position: absolute;
			top: 0;
			left: 50%;
			width: 1px;
			height: 100%;
			z-index: 0;
			@apply pointer-events-none bg-muted-foreground/40;
		}

		&::after {
			// this will be the horizontal line through the center from left to right
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			width: 100%;
			height: 1px;
			z-index: 0;
			@apply pointer-events-none bg-muted-foreground/40;
		}
	}

	#x-labels {
		position: absolute;
		top: calc(50% - 1rem);
		left: 50%;
		translate: -50% 0;
		height: 1rem;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	#y-labels {
		position: absolute;
		height: 100%;
		width: 15%;
		left: 50%;
		top: 50%;
		translate: 0 -50%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
