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

	let result = $state('');
	let chunks = $state([] as any[]);

	async function handleClick() {
		const response = await fetch('http://localhost:8000/generate', {
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
			console.log('{' + chunk.response + '}');
		}
	}

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
					</HoverCard.Root> wiederum ist wie eine kleine EInheit, die eine semantische Bedeutung mit
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

			<div class="whitespace-break-spaces bg-muted p-3">
				{#each chunks as chunk, i (chunk)}
					{@const current = chunk}
					{@const next = chunks[i + 1]}
					{#if next?.response.trim() !== next?.response}
						<div class="inline-block animate-flyIn">{chunk.response.trim() + ' '}</div>
					{:else}
						<div class="inline-block animate-flyIn">{chunk?.response.trim()}</div>
					{/if}
				{/each}

				<span class="inline-block h-4 w-4 translate-y-0.5 rounded-full bg-black"></span>
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-between"></Card.Footer>
	</Card.Root>

	<LLMNext url={data.url} prev="N-Gramm" next="Zeichensetzung" />
</section>

<Toaster position="bottom-right" />
