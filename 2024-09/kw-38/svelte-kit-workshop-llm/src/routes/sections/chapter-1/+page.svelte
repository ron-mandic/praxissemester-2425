<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Table from '$lib/components/ui/table';

	import Info from 'lucide-svelte/icons/info';
	import Reset from 'lucide-svelte/icons/rotate-ccw';
	import { Badge } from '@/ui/badge';

	let seed = $state(null as number | null);
	let text = $state('');
	let inputs = $state([] as { word: string; abs: number; rel: number }[]);
	let hasBeenReset = $state(false);
	let hasBeenClicked = $state(false);

	async function handleClick() {
		hasBeenClicked = true;

		const response = await fetch('/api/chapter-1?num_samples=1');
		const data = await response.json();

		const [key, abs, rel] = data.data[0];
		text = key;
		inputs.push({ word: key, abs, rel });
	}

	function handleReset() {
		hasBeenClicked = false;
		hasBeenReset = true;
		text = '';
		inputs = [];
		setTimeout(() => {
			hasBeenReset = false;
		}, 1000);
	}

	$inspect(seed).with(console.log);
</script>

<section class="h-full w-full">
	<h2 class="mb-6 text-2xl font-bold">Unigramm</h2>

	<Card.Root class="w-full">
		<Card.Header class="gap-2">
			<Card.Title>Ed Sheeran</Card.Title>
			<Card.Description>
				<p class="mb-3 mt-2">
					Ein <HoverCard.Root>
						<HoverCard.Trigger>Unigramm <Info class="inline-block h-4 w-4" /></HoverCard.Trigger>
						<HoverCard.Content class="w-80">
							<div class="flex flex-col items-start gap-2 text-sm">
								<p class="text-balance">
									Stellen Sie sich ein Wörterbuch vor, in dem jedes Wort mit einer bestimmten
									Wahrscheinlichkeit vorkommt. Ein Unigramm-Modell wählt auf der Grundlage dieser
									Wahrscheinlichkeiten zufällig Wörter aus diesem Wörterbuch aus.
								</p>
								<div class="w-full">
									<Table.Root>
										<Table.Caption class="mb-4">Hinweis: Ohne Zeilenumbrüche</Table.Caption>
										<Table.Header>
											<Table.Row>
												<Table.Head class="w-22">Wort</Table.Head>
												<Table.Head>Anzahl</Table.Head>
												<Table.Head class="text-right">%</Table.Head>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">i</Badge></Table.Cell>
												<Table.Cell>1836</Table.Cell>
												<Table.Cell class="text-right">{(0.0413 * 100).toFixed(4)}%</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">you</Badge></Table.Cell>
												<Table.Cell>1576</Table.Cell>
												<Table.Cell class="text-right">{(0.03545 * 100).toFixed(4)}%</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">the</Badge></Table.Cell>
												<Table.Cell>1404</Table.Cell>
												<Table.Cell class="text-right">{(0.03158 * 100).toFixed(4)}%</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell>...</Table.Cell>
												<Table.Cell>...</Table.Cell>
												<Table.Cell class="text-right">...</Table.Cell>
											</Table.Row>
											<Table.Row>
												<Table.Cell><Badge variant="secondary">un</Badge></Table.Cell>
												<Table.Cell>4</Table.Cell>
												<Table.Cell class="text-right">{(8.9975e-5 * 100).toFixed(4)}%</Table.Cell>
											</Table.Row>
										</Table.Body>
									</Table.Root>
								</div>
								<p>
									Um das zu veranschaulichen, klicke auf den Button unten, um zu sehen, welches Wort
									das Modell aus dem Wörterbuch sampelt und wie wahrscheinlich es ist, dass dieses
									Wort gewählt wird.
								</p>
							</div>
						</HoverCard.Content>
					</HoverCard.Root> ist das einfachste Sprachmodell, bei dem Wörter unabhängig voneinander betrachtet
					werden. Das bedeutet, es gibt keinen Kontext, der uns sagt, welches Wort als nächstes kommen
					sollte.
				</p>

				<p>
					Dieses Modell hat 100 ausgewählte Songs von Ed Sheeran analysiert. Gib Schlüsselwörter auf
					Englisch in Kleinschreibweise und ohne Sonderzeichen ein, wie sie in Ed Sheerans
					Songtexten vorkommen würden und generiere dann Vorhersagen mit dem Modell.
				</p>
			</Card.Description>
		</Card.Header>
		<Separator class="mb-6" />
		<Card.Content>
			<div class="mt-6 grid h-32 w-full place-items-center overflow-y-auto rounded-md bg-muted/50">
				{#if text && hasBeenClicked}
					<span>{text}</span>
				{/if}
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<div style="visibility: {!hasBeenReset && hasBeenClicked ? 'auto' : 'hidden'};">
				<Button onclick={handleReset} variant="outline"
					>Zurücksetzen<Reset class="ml-2 h-4 w-4" /></Button
				>
			</div>
			<Button onclick={handleClick}>{hasBeenClicked ? 'Erneut generieren' : 'Generieren'}</Button>
		</Card.Footer>
	</Card.Root>

	<div class="my-12">
		<Table.Root>
			<Table.Caption>
				{#if !inputs.length}Noch keine Historie verfügbar{/if}
			</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-48">Wort</Table.Head>
					<Table.Head>Anzahl</Table.Head>
					<Table.Head class="text-right">Wahrscheinlichkeit</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body
				>{#if inputs.length}
					{#each inputs as { word, abs, rel }, i}
						<Table.Row>
							<Table.Cell><Badge variant="secondary">{word}</Badge></Table.Cell>
							<Table.Cell>{abs}</Table.Cell>
							<Table.Cell class="text-right">{(rel * 100).toFixed(4)}</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</section>
