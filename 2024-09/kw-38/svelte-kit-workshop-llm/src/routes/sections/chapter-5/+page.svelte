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
	import { formatSearch, preprocess } from '$lib/ts/functions';
	import { Toaster } from '@/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	import { createSwapy } from 'swapy';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// let container: HTMLDivElement;
	// onMount(() => {
	// 	if (container) {
	// 		const swapy = createSwapy(container, {
	// 			animation: 'dynamic'
	// 		});
	// 	}
	// });

	const colors = [
		'#f1cfc6',
		'#cbf2bd',
		'#bbdaf1',
		'#d9e8a2',
		'#eff1b6',
		'#d7b0ec',
		'#efe8af',
		'#e4d59a',
		'#f4ddcf',
		'#e4f8d5',
		'#d68ca8',
		'#91c2dd'
	];

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

	const gen = generator(colors);

	let result = $state('');
	let chunks = $state([] as any[]);

	async function handleClick() {
		const response = await fetch('http://192.168.0.203:8000/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: 'What is the meaning of life?'
			})
		});

		const reader = response.body!.getReader();
		const decoder = new TextDecoder('utf-8');

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = JSON.parse(decoder.decode(value, { stream: true }));
			chunks.push(chunk);
			result += chunk.response;
		}
	}

	// $inspect(chunks).with(console.log);

	const { data } = $props();
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Leerzeichen</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Leerzeichen ohne Ende</Card.Title>
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
		<Separator class="mb-6" />
		<Card.Content>
			<Button onclick={handleClick}>Hello World</Button>

			{#if chunks[chunks.length - 1]?.done}
				{@const {
					eval_count,
					eval_duration,
					prompt_eval_count,
					prompt_eval_duration,
					load_duration,
					total_duration
				} = chunks[chunks.length - 1]}
				<p>Generierungs-Evaluierung pro Sekunde</p>
				<p class="font-mono">{((eval_count / eval_duration) * 1e9).toFixed(2)} tokens / sec</p>
				<p>Prompt-Evaluierung pro Sekunde</p>
				<p class="font-mono">
					{((prompt_eval_count / prompt_eval_duration) * 1e9).toFixed(2)} prompt tokens / sec
				</p>
				<p>Prompt-Evaluierungsanteil an dem Gesamtzeitverhältnis</p>
				<p class="font-mono">{((prompt_eval_duration / total_duration) * 100).toFixed(2)} %</p>
				<p>Generierungsanteil an dem Gesamtzeitverhältnis</p>
				<p class="font-mono">{((eval_duration / total_duration) * 100).toFixed(2)} %</p>
				<p>Durchschnittliche Token-Evaluierungsdauer</p>
				<p class="font-mono">{(eval_duration / eval_count / 1e6).toFixed(2)} ms</p>
				<p>Modell-Ladezeit als Anteil der Gesamtzeit</p>
				<p class="font-mono">{((load_duration / total_duration) * 100).toFixed(2)} %</p>
				<p>Gesamtzeit pro Token (ms)</p>
				<p class="font-mono">
					{(total_duration / (eval_count + prompt_eval_count) / 1e6).toFixed(2)} ms
				</p>
				<p>Gesamtgeschwindigkeit (Token / s)</p>
				<p class="font-mono">
					{(((eval_count + prompt_eval_count) / total_duration) * 1e9).toFixed(2)} tokens / s
				</p>
			{/if}

			<!-- <div class="bg-muted p-3">
				<span>{result}</span>
				<span class="inline-block h-4 w-4 translate-y-0.5 rounded-full bg-black"></span>
			</div> -->

			<div class="whitespace-break-spaces bg-muted/40 p-3 font-mono">
				{#each chunks as chunk, i (chunk)}
					<span
						style="background-color: {gen.next().value};"
						class="my-1 inline-block animate-flyIn cursor-pointer select-none selection:bg-black selection:text-white"
						>{chunk.response}</span
					>
				{/each}
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-between"></Card.Footer>
	</Card.Root>

	<LLMNext url={data.url} prev="N-Gramm" next="Zeichensetzung" />
</section>

<Toaster position="bottom-right" />
