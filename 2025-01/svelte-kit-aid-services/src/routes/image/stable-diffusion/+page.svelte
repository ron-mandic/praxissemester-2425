<script lang="ts">
	import Section from '@/components/svelte/Article.svelte';
	import { Textarea } from '@/components/ui/textarea';
	import { Settings2, Sparkles, Pencil, ImagePlus, Expand, Info } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import Kbd from '@/components/svelte/Kbd.svelte';
	import { fly, scale } from 'svelte/transition';
	import {
		backIn,
		backInOut,
		backOut,
		quartIn,
		quartInOut,
		quartOut,
		quintInOut
	} from 'svelte/easing';
	import { Toggle } from '@/components/ui/toggle';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as HoverCard from '@/components/ui/hover-card';
	import Input from '@/components/ui/input/input.svelte';

	let value = $state('');
	let pressed = $state(false);

	let textarea = $state<null | HTMLTextAreaElement>(null);
	let modalHeight = $state<null | number>(null);

	$effect(() => {
		if (pressed) {
			console.log(textarea);
		}
	});

	let values = $state([1, 0, 0, 0]);

	$inspect(modalHeight);
</script>

<Section class="relative">
	<div
		class="group flex h-[calc(100dvh-74px)] max-h-[calc(100dvh-74px)] w-full flex-col justify-end overflow-y-hidden pb-[clamp(198px,10%,350px)] @container"
	>
		{#if pressed}
			<div
				role="dialog"
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				id="modal-settings"
				class="mx-[auto] flex h-full max-h-[280px] min-h-[208px] w-full max-w-[640px] snap-y snap-mandatory grid-cols-2 grid-rows-2 flex-col gap-2 overflow-auto overflow-y-auto rounded-lg border border-sidebar-border bg-sidebar/80 p-2 shadow-sm backdrop-blur-xl @[540px]:grid"
				bind:clientHeight={modalHeight}
				in:fly={{ y: 50, opacity: 0, duration: 300, delay: 100, easing: quartOut }}
				out:fly={{ y: 50, opacity: 0, duration: 300, delay: 0, easing: backIn }}
			>
				<section
					class="grid h-[clamp(161px,1fr,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header class="text-muted-foreground">
						<h2 class="flex items-center gap-x-2 text-sm font-bold">
							CFG Scale <HoverCard.Root>
								<HoverCard.Trigger class="hidden md:block">
									<Info class="size-4" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar px-3 py-2 text-sm"
									>Controls how closely the image matches the prompt.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
					</header>
					<footer class="flex flex-col items-end">
						<Input
							class="w-auto"
							type="number"
							min="1"
							max="30"
							step="0.5"
							bind:value={values[0]}
						/>
						<Input type="range" min="1" max="30" step="0.5" bind:value={values[0]} />
					</footer>
				</section>

				<section
					class="grid h-[clamp(161px,85%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr,auto] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header class="text-muted-foreground">
						<h2 class="flex items-center gap-x-2 text-sm font-bold">
							Seed <HoverCard.Root>
								<HoverCard.Trigger class="hidden md:block">
									<Info class="size-4" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar px-3 py-2 text-sm"
									>Sets the starting point for consistent results.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
					</header>
					<footer class="">
						<Input class="w-full" type="number" bind:value={values[1]} />
					</footer>
				</section>

				<section
					class="grid h-[clamp(161px,85%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr,auto] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header class="text-muted-foreground">
						<h2 class="flex items-center gap-x-2 text-sm font-bold">
							Steps <HoverCard.Root>
								<HoverCard.Trigger class="hidden md:block">
									<Info class="size-4" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar px-3 py-2 text-sm"
									>Defines the number of iterations for refining the image.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
					</header>
					<footer class=""></footer>
				</section>

				<section
					class="grid h-[clamp(161px,85%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr,auto] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header class="text-muted-foreground">
						<h2 class="flex items-center gap-x-2 text-sm font-bold">
							Sampler <HoverCard.Root>
								<HoverCard.Trigger class="hidden md:block">
									<Info class="size-4" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar px-3 py-2 text-sm"
									>Determines the algorithm shaping style and quality.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
					</header>
					<footer class=""></footer>
				</section>
			</div>
		{/if}
	</div>

	<form
		class="absolute bottom-9 left-1/2 flex h-auto w-full max-w-[640px] -translate-x-1/2 flex-col items-center justify-end"
	>
		<div
			class="relative h-full w-full rounded-lg border border-sidebar-border bg-sidebar/80 p-2 shadow-sm backdrop-blur-xl transition-[width,transform,margin]"
		>
			<Textarea
				bind:value
				bind:ref={textarea}
				name="prompt"
				placeholder="What will you create?"
				draggable="true"
				class="h-auto! max-h-[150px] w-full resize-none border-none bg-transparent text-base transition-colors duration-300 placeholder:animate-in focus-visible:ring-0 focus-visible:ring-[none] md:max-h-[220px]"
				oninput={(e) => {
					if (pressed) {
						e.currentTarget.style.height = 'auto';
						return;
					}

					let height = e.currentTarget.scrollHeight;
					e.currentTarget.style.height = height + 'px';

					if (e.currentTarget.value.trim() === '') {
						e.currentTarget.style.height = 'auto';
					}
				}}
			/>
			<div
				class="align-items mt-4 flex flex-row justify-between"
				in:fly={{ y: 30, opacity: 0, duration: 300, delay: 750, easing: backOut }}
			>
				<div class="flex select-none items-center gap-x-2">
					<Toggle
						bind:pressed
						class="border border-transparent text-muted-foreground hover:text-sidebar-accent-foreground focus-visible:animate-pulse focus-visible:ring-sidebar-ring data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-500 hover:data-[state=on]:!border-blue-500 hover:data-[state=on]:bg-blue-900/30 data-[state=on]:focus-visible:animate-pulse"
						onPressedChange={(pressed) => {
							if (pressed) {
								textarea!.style.height = 'auto';
								textarea?.scrollTo({ top: textarea!.scrollHeight, behavior: 'smooth' });
							} else {
								textarea!.style.height = textarea!.scrollHeight + 'px';
							}
						}}
						tabindex={0}
					>
						<Settings2 />
					</Toggle>

					<!-- <Toggle
						bind:pressed
						class="border border-transparent text-muted-foreground hover:text-sidebar-accent-foreground focus-visible:animate-pulse focus-visible:ring-sidebar-ring data-[state=on]:bg-blue-900/30 hover:data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-500 hover:data-[state=on]:!border-blue-500 data-[state=on]:focus-visible:animate-pulse"
						onPressedChange={(pressed) => {
							if (pressed) {
								textarea!.style.height = 'auto';
								textarea?.scrollTo({ top: textarea!.scrollHeight, behavior: 'smooth' });
							} else {
								textarea!.style.height = textarea!.scrollHeight + 'px';
							}
						}}
						tabindex={0}
					>
						<ImagePlus />
					</Toggle> -->

					<Separator class="h-6" orientation="vertical" />

					<Button
						class="inline-flex gap-x-2.5 bg-transparent px-3 text-muted-foreground"
						variant="ghost"
						tabindex={0}
					>
						<Pencil />
						<span class="hidden sm:block">Improve prompt</span>
					</Button>
				</div>

				<div>
					<Button
						class="disabled:bg-blue-600! select-none bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-3 text-white transition-[opacity,transform] duration-300 ease-out-cubic hover:-translate-y-[2px] active:-translate-y-[2px] disabled:opacity-30"
						type="submit"
						tabindex={0}
						disabled={value.length === 0}
					>
						<Sparkles class="mx-.5" />
						<span>Generate</span>
						<Kbd
							class="ml-0.5 hidden items-center gap-x-1 border-slate-300/30 bg-transparent md:inline-flex"
						>
							<span class="text-sm">⌘</span>
							<span class="-translate-y-px text-sm">↵</span>
						</Kbd>
					</Button>
				</div>
			</div>
		</div>
	</form>
</Section>

<style lang="scss">
	form::after {
		content: 'Do not use for malicious purposes';
		@apply absolute left-1/2 top-full w-full -translate-x-1/2 translate-y-3 cursor-auto text-center text-xs text-muted-foreground/50 transition-transform duration-200 ease-out-cubic no-interaction;
	}

	#modal-settings {
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
