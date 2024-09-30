<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import LLMNext from '$lib/components/svelte/LLMNext.svelte';
	import ExternalLink from 'lucide-svelte/icons/external-link';

	const { data } = $props();
</script>

<section class="h-full w-full max-md:max-w-[calc(100vw-16px)]">
	<h2 class="mb-12 text-center text-4xl font-bold lg:text-left">Übersicht</h2>

	<p class="mb-6 px-2 md:px-0">
		Im ersten Kapitel des KI-Workshops zu Large Language Models (LLMs) schauen wir uns gemeinsam an,
		woher wir unseren Datensatz für den Kurs bekommen und wie wir die Daten entsprechend analysieren
		können, um Vorhersagen zu treffen.
	</p>

	<p class="mb-8 px-2 md:px-0">
		Wenn es darum geht, Daten für KI-Projekte zu sammeln und zu nutzen, ist Hugging Face eine
		wertvolle Ressource. Zwar ist die Plattform vor allem für ihre vortrainierten Sprachmodelle
		bekannt, aber sie bietet noch viel mehr - insbesondere eine riesige Sammlung an öffentlich
		zugänglichen Datensätzen, die für verschiedenste Aufgaben genutzt werden können.
	</p>

	<Card.Root
		class="font-regular mt-6 w-full border-2 border-yellow-700/40 bg-yellow-100 text-yellow-800"
	>
		<Card.Header class="gap-2 p-1.5">
			<div class="relative grid h-[315px] w-full place-items-center rounded-md bg-yellow-400">
				<img
					src="/png/hugging-face.png"
					alt="Hugging Face"
					class="absolute scale-50 select-none rounded-md"
				/>
			</div>
			<div class="px-6 pb-6 pt-2">
				<Card.Description>
					<p class="mb-3 select-none">
						Hugging Face bietet hochwertige, vielfältige und kuratierte Datensätze, die es uns
						ermöglichen, schnell die benötigten Ressourcen für unsere Unigramm-Analysen,
						N-Gramm-Modelle und andere Sprachaufgaben zu finden. Dadurch sparen wir Zeit, da wir
						nicht stundenlang im Internet nach geeigneten Textdaten suchen müssen, und können
						unabhängig von vorgefertigten Modellen arbeiten.
					</p>

					<Separator class="my-6 bg-yellow-700/20" />

					<a
						class="inline-block items-center gap-2 text-yellow-700/90 hover:text-yellow-900"
						href="https://huggingface.co/"
						target="_blank"
						rel="noopener noreferrer"
						>Hugging Face <ExternalLink class="-mt-1 inline-block h-4 w-4" /></a
					>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<p class="my-10 px-2 md:px-0">
		In unserem Workshop werden wir Hugging Face verwenden, um Datensätze für unsere eigenen Modelle
		zu finden und herunterzuladen. Textdaten wie Songtexte, Bücher oder Nachrichtenartikel sind
		hervorragend dafür geeignet, die Funktionsweise von Sprachmodellen zu verstehen und zu
		analysieren.
	</p>

	<Card.Root
		class="font-regular mt-6 w-full border-2 border-orange-700/40 bg-orange-100 text-orange-800"
	>
		<Card.Header class="gap-2 p-1.5">
			<img src="/jpg/ed-sheeran.jpg" alt="Ed Sheeran" class="w-full select-none rounded-md" />
			<div class="px-6 pb-6 pt-2">
				<Card.Description>
					<p class="mb-3 select-none">
						In diesem Workshop arbeiten wir mit 100 Songtexten von Ed Sheeran, um die Funktionsweise
						einfacher Sprachmodelle zu verstehen. Dabei werden wir untersuchen, wie Modelle
						Vorhersagen treffen und versuchen, den Stil des Künstlers zu imitieren. Anhand dieses
						kreativen Datensatzes kannst du praktisch erleben, wie solche Modelle strukturiert sind
						und welche Muster in der Textgenerierung eine Rolle spielen.
					</p>

					<Separator class="my-6 bg-orange-700/20" />

					<a
						class="inline-block items-center gap-2 text-orange-700/90 hover:text-orange-900"
						href="https://huggingface.co/datasets/huggingartists/ed-sheeran"
						target="_blank"
						rel="noopener noreferrer"
						>huggingartists / ed-sheeran <ExternalLink class="-mt-1 inline-block h-4 w-4" /></a
					>
				</Card.Description>
			</div>
		</Card.Header>
	</Card.Root>

	<LLMNext url={data.url} next="Daten" />
</section>
