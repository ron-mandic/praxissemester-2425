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
	import type { Key } from 'lucide-svelte';
	import { is } from 'drizzle-orm';

	let contextValue = $state('');
	let selectedWord = $state('');
	let outputsWordPunct = $state([] as string[]);
	let outputsTreebankWord = $state([] as string[]);
	let hasBeenClicked = $state(false);
	let hasBeenReset = $state(false);
	let hasEnded = $state(false);
	let isFetching = $state(false);

	const { data } = $props();

	$effect(() => {
		return handleReset;
	});

	async function handlePress(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleClick();
		}
	}

	async function handleClick() {
		let headers = { 'Content-Type': 'application/json' };
		let bodyW = JSON.stringify({ inputs: contextValue, treebank: false });
		let bodyT = JSON.stringify({ inputs: contextValue, treebank: true });
		let payloadW = {
			method: 'POST',
			headers,
			body: bodyW
		};
		let payloadT = {
			method: 'POST',
			headers,
			body: bodyT
		};

		isFetching = true;
		const [dataW, dataT] = await Promise.all([
			fetch('/api/tokenizer/punctuation', payloadW).then((res) => res.json()),
			fetch('/api/tokenizer/punctuation', payloadT).then((res) => res.json())
		]);

		if (!dataW || !dataT) {
			toast.error('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
			isFetching = false;
			return;
		}

		outputsWordPunct = dataW;
		outputsTreebankWord = dataT;

		isFetching = false;
	}

	function handleSelectedWord(e: any) {
		const target = e.currentTarget as HTMLElement;
		const { word } = target.dataset;

		if (selectedWord && selectedWord === word) {
			selectedWord = '';
		} else {
			selectedWord = word as string;
		}
	}

	function handleHighlight(output: string, selected: string) {
		// e.g. "?" and "?!" or "t" and "though"

		const regNotAlphaNumeric = /^\W+$/;

		const isCaseA =
			regNotAlphaNumeric.test(output) &&
			regNotAlphaNumeric.test(selected) &&
			(selected.includes(output) || output.includes(selected));
		const isCaseB = output === selected;

		return isCaseA || isCaseB;
	}

	function handleReset() {
		contextValue = '';
		selectedWord = '';
		outputsWordPunct = [];
		outputsTreebankWord = [];
		hasBeenClicked = false;
		hasBeenReset = true;
		hasEnded = false;
		isFetching = false;

		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(selectedWord);
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Zeichensetzung</h2>

	<Card.Root class="dark my-8 w-full">
		<Card.Header class="gap-2 p-6">
			<div>
				<Card.Description>
					<p class="mb-3 text-muted-foreground">
						Im vorherigen Beispiel haben wir gesehen, dass die Aufteilung nach Leerzeichen alleine
						nicht ausreichen kann, um die Tokens mit semantisch hohem Wert zu extrahieren. In diesem
						Beispiel werden wir uns damit beschäftigen, wie die Tokenisierung auch auf Basis von
						Sonderzeichen erfolgen kann.
					</p>

					<div class="relative my-8 h-full w-full rounded-md bg-muted/50 p-6">
						<LLMCode
							innerText={{
								input:
									"Good muffins cost $3.88\nin New York.  Please buy me\ntwo of them.\nThanks. They'll save and invest more."
							}}
							language="json"
						/>
					</div>

					<p class="text-muted-foreground">
						Einerseits gibt es den <a
							class="inline-block items-center gap-2 text-muted-foreground hover:text-foreground"
							href="https://www.nltk.org/api/nltk.tokenize.regexp.html#nltk.tokenize.regexp.WordPunctTokenizer"
							target="_blank"
							rel="noopener noreferrer"
							>WordPunctTokenizer <ExternalLink class="-mt-0.5 inline-block h-4 w-4" /></a
						>, der die Tokenisierung auf Basis von alphanumerischen Zeichen und Sonderzeichen
						vornimmt. Der Text wird in einzelne Tokens aufgeteilt, von denen Buchstabenfolgen von
						ihren Sonderzeichen getrennt werden, was auf dem ersten Blick für eine bessere
						semantische Analyse sorgt.
					</p>

					<ScrollArea
						class="relative my-8 h-[225px] w-full rounded-md bg-muted/50"
						orientation="vertical"
					>
						<div>
							<div class="h-full w-full p-6">
								<LLMCode
									innerText={{
										output: [
											'Good',
											'muffins',
											'cost',
											'$',
											'3',
											'.',
											'88',
											'in',
											'New',
											'York',
											'.',
											'Please',
											'buy',
											'me',
											'two',
											'of',
											'them',
											'.',
											'Thanks',
											'.',
											'They',
											"'",
											'll',
											'save',
											'and',
											'invest',
											'more',
											'.'
										]
									}}
									language="json"
								/>
							</div>
						</div>
					</ScrollArea>

					<p class="text-muted-foreground">
						Jedoch gehen wieder einzelne semantische Informationen verloren, wenn zum Beispiel von
						Apostrophen getrennte Wörter wie they'll oder Sätze in der Mitte des Korpus von ihren
						Sonderzeichen getrennt werden. Der <a
							class="inline-block items-center gap-2 text-muted-foreground hover:text-foreground"
							href="https://www.nltk.org/api/nltk.tokenize.TreebankWordTokenizer.html"
							target="_blank"
							rel="noopener noreferrer"
							>TreebankWordTokenizer <ExternalLink class="-mt-0.5 inline-block h-4 w-4" /></a
						> hingegen ist in der Lage, Tokens so gut es geht kontextuell zu bewahren, indem es zum Beispiel
						die Standardkürzungen aus dem Englischen erkennt und nur Punktzeichen am Ende des Korpus
						isoliert, um das Ende eines Satzes zu markieren.
					</p>

					<ScrollArea
						class="relative my-8 h-[225px] w-full rounded-md bg-muted/50"
						orientation="vertical"
					>
						<div>
							<div class="h-full w-full p-6">
								<LLMCode
									innerText={{
										output: [
											'Good',
											'muffins',
											'cost',
											'$',
											'3.88',
											'in',
											'New',
											'York.',
											'Please',
											'buy',
											'me',
											'two',
											'of',
											'them.',
											'Thanks.',
											'They',
											"'ll",
											'save',
											'and',
											'invest',
											'more',
											'.'
										]
									}}
									language="json"
								/>
							</div>
						</div>
					</ScrollArea>

					<p class="text-muted-foreground">
						Es wird sich aber herausstellen, dass trotz der semantischen Bewahrung durch den
						TreebankWordTokenizer auch hier die Tokens nicht immer eindeutig oder nicht zwingend
						aussagekräftig genug sind. Es kann sein, dass die Tokens zu allgemein oder zu spezifisch
						sind, um Vorhersagen zu treffen oder auf Basis dessen einen Text zu generieren.
					</p>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Einmal mit und ohne Punkt, bitte</Card.Title>
			<Card.Description>
				<p>
					Im unteren Textfeld kannst du erneut einen beliebigen Text einfügen. Im Outputfenster
					kannst du dann im Reiter zwischen den beiden Tokenisierungsarten wechseln und die
					unterschiedlichen Tokens miteinander vergleichen. Achte dabei besonders darauf, welche
					Tokens semantisch sinnvoller erscheinen und welche nicht.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<Label for="text" class="mb-2 block">Ausgangstext (en-US)</Label>
			<Textarea
				bind:value={contextValue}
				class="max-h-72 min-h-36 w-full text-base"
				id="text"
				placeholder="This prompt contains a lot, I mean a ton of punctuation marks. Can you handle it?"
				maxlength={512}
				disabled={hasBeenClicked}
				onkeypress={handlePress}
			/>
			<div class="mt-1.5 flex select-none items-center justify-between text-muted-foreground">
				<small class="font-mono text-xs">{(contextValue as string).length || 0} / 512</small>
			</div>

			<Label for="text" class="mb-2 mt-8 block">Tokens</Label>
			<Tabs.Root value="0" class="w-full">
				<Tabs.List class="w-full">
					<Tabs.Trigger class="w-full" value="0"
						>WordPunct<span class="hidden whitespace-nowrap md:inline-block">Tokenizer</span
						></Tabs.Trigger
					>
					<Tabs.Trigger class="w-full" value="1"
						>TreebankWord<span class="hidden whitespace-nowrap md:inline-block">Tokenizer</span
						></Tabs.Trigger
					>
				</Tabs.List>
				<Tabs.Content class="h-full w-full" value="0">
					<ScrollArea
						class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0"
						orientation="vertical"
					>
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#if outputsWordPunct.length === 0}
								<p
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
								>
									Hier werden die Tokens angezeigt
								</p>
							{:else}
								{#each outputsWordPunct as output, i}
									<Badge
										class="box-border animate-bounceIn cursor-pointer animate-delay-[{i *
											50}ms] whitespace-nowrap text-base transition-none {handleHighlight(
											output,
											selectedWord
										)
											? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
											: 'text-foreground'}"
										variant="secondary"
										data-word={output}
										onclick={handleSelectedWord}
									>
										{output}
									</Badge>
								{/each}
							{/if}
						</div>
					</ScrollArea>
				</Tabs.Content>
				<Tabs.Content class="h-full w-full" value="1">
					<ScrollArea
						class="h-72 max-h-72 w-full rounded-md bg-muted/30 px-6 py-0"
						orientation="vertical"
					>
						<div
							class="inline-flex h-full w-full flex-wrap items-start justify-start gap-x-2 gap-y-3 py-6"
						>
							{#if outputsTreebankWord.length === 0}
								<p
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-muted-foreground"
								>
									Hier werden die Tokens angezeigt
								</p>
							{:else}
								{#each outputsTreebankWord as output, i}
									<Badge
										class="box-border animate-bounceIn cursor-pointer delay-[{i *
											50}ms] whitespace-nowrap text-base transition-none {handleHighlight(
											output,
											selectedWord
										)
											? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
											: 'text-foreground'}"
										variant="secondary"
										data-word={output}
										onclick={handleSelectedWord}
									>
										{output}
									</Badge>
								{/each}
							{/if}
						</div>
					</ScrollArea>
				</Tabs.Content>
			</Tabs.Root>
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
				disabled={!contextValue.trim()}
				onclick={handleClick}
			>
				{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}
			</Button>
		</Card.Footer>
	</Card.Root>

	<LLMNext url={data.url} prev="Leerzeichen" next="Affixe" />
</section>

<Toaster position="bottom-right" />
