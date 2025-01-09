<script lang="ts">
	import Section from '@/components/svelte/Article.svelte';
	import { Textarea } from '@/components/ui/textarea';
	import {
		Settings2,
		Sparkles,
		Pencil,
		ImagePlus,
		Expand,
		Info,
		ChevronsUpDown,
		Check,
		CommandIcon
	} from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import Kbd from '@/components/svelte/Kbd.svelte';
	import { fly, scale } from 'svelte/transition';
	import { backIn, backOut, quartOut } from 'svelte/easing';
	import { Toggle } from '@/components/ui/toggle';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as HoverCard from '@/components/ui/hover-card';
	import Input from '@/components/ui/input/input.svelte';
	import Slider from '@/components/ui/slider/slider.svelte';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { cn } from '@/utils';

	let value = $state('');
	let pressed = $state(false);

	let modalHeight = $state<null | number>(null);

	let values = $state([7, 20, -1, 0]);

	let selectList = $state([
		{ value: 'DPM++ 2M', label: 'DPM++ 2M' },
		{ value: 'DPM++ SDE', label: 'DPM++ SDE' },
		{ value: 'DPM++ 2M SDE', label: 'DPM++ 2M SDE' },
		{ value: 'DPM++ 2M SDE Heun', label: 'DPM++ 2M SDE Heun' },
		{ value: 'DPM++ 2S a', label: 'DPM++ 2S a' },
		{ value: 'DPM++ 3M SDE', label: 'DPM++ 3M SDE' },
		{ value: 'Euler a', label: 'Euler a' },
		{ value: 'Euler', label: 'Euler' },
		{ value: 'LMS', label: 'LMS' },
		{ value: 'Heun', label: 'Heun' },
		{ value: 'DPM2', label: 'DPM2' },
		{ value: 'DPM2 a', label: 'DPM2 a' },
		{ value: 'DPM fast', label: 'DPM fast' },
		{ value: 'DPM adaptive', label: 'DPM adaptive' },
		{ value: 'Restart', label: 'Restart' },
		{ value: 'DDIM', label: 'DDIM' },
		{ value: 'PLMS', label: 'PLMS' },
		{ value: 'UniPC', label: 'UniPC' },
		{ value: 'LCM', label: 'LCM' }
	]);
	let selectOpen = $state(false);
	let selectValue = $state(selectList[0].value);

	let refTextarea = $state<null | HTMLTextAreaElement>(null);
	let refModalInput = $state<null | HTMLInputElement>(null);
	let refForm = $state<HTMLFormElement>(null!);
	let refSelect = $state<HTMLButtonElement>(null!);

	const selectResult = $derived.by(() => {
		const index = selectList.findIndex((f) => f.value === selectValue);
		const value = index !== -1 ? selectList[index] : undefined;

		return { index, ...value };
	});

	function closeAndFocusTrigger() {
		selectOpen = false;
		tick().then(() => {
			refSelect.focus();
		});
	}

	$effect(() => {
		// Whenever pressed changes, adjust the height of the textarea accordingly
		if (pressed) {
			refTextarea!.style.height = 'auto';
			refTextarea?.focus();
			return;
		}

		refTextarea!.style.height = refTextarea!.scrollHeight + 'px';
		requestAnimationFrame(() => {
			refTextarea?.scrollTo({ top: refTextarea!.scrollHeight, behavior: 'smooth' });
		});
	});

	$inspect({ selectValue, selectResult });
</script>

<Section class="relative">
	<div
		class="group flex h-[calc(100dvh-74px)] max-h-[calc(100dvh-74px)] w-full flex-col justify-end overflow-y-hidden pb-[clamp(198px,10%,200px)] @container"
	>
		<!-- <div class="relative h-full w-full rounded-lg bg-red-900/30">
			<img
				src="https://images.unsplash.com/photo-1736319551652-4378fc7f9502?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="Placeholder"
				class="h-full w-full rounded-lg object-cover"
			/>
		</div> -->

		<div class="relative h-full w-full rounded-lg bg-red-900/30"></div>

		{#if pressed}
			<!--
				NOTE: iPhone 4 support, currently full iPhone SE compatibility
				[@media(max-height:552px)]:h-[108px] 
			-->
			<div
				role="dialog"
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				id="modal-settings"
				class="absolute left-1/2 mx-[auto] flex h-full max-h-[280px] min-h-[208px] w-full max-w-[640px] -translate-x-1/2 snap-y snap-mandatory grid-cols-2 grid-rows-2 flex-col gap-2 overflow-auto overflow-y-auto rounded-lg border border-sidebar-border bg-sidebar/80 p-2 shadow-sm backdrop-blur-xl @[540px]:grid"
				bind:clientHeight={modalHeight}
				in:fly={{ y: 50, opacity: 0, duration: 300, delay: 300, easing: quartOut }}
				out:fly={{ y: 50, opacity: 0, duration: 300, delay: 100, easing: backIn }}
			>
				<section
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header>
						<h2 class="w-max select-none pl-1 text-base font-bold text-muted-foreground md:text-sm">
							<HoverCard.Root>
								<HoverCard.Trigger class="flex items-center gap-x-2 hover:animate-pulse">
									CFG <Info class="hidden size-4 md:block" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar/50 px-4 py-3 text-sm backdrop-blur-xl"
									>Controls how closely the image matches the prompt. The higher the value, the more
									strictly the image adheres to the prompt.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
						<Input
							class="absolute right-2 top-2 w-auto min-w-24"
							type="number"
							min="1"
							max="30"
							step="0.5"
							pattern="[0-9]+([.][0-9]+)?"
							oninput={(e) => {
								if (isNaN(parseFloat(e.currentTarget.value))) {
									return;
								}
							}}
							onwheel={(e) => {
								e.preventDefault();

								if (e.deltaY < 0) {
									values[0] += 0.5;
								} else {
									values[0] -= 0.5;
								}
							}}
							bind:value={values[0]}
						/>
					</header>
					<footer class="flex h-full w-full flex-col items-center justify-end px-2 pb-2.5">
						<Slider
							bind:value={values[0]}
							type="single"
							min={1}
							max={30}
							step={0.5}
							onwheel={(e) => {
								e.preventDefault();

								if (e.deltaY < 0) {
									values[0] += 0.5;
								} else {
									values[0] -= 0.5;
								}
							}}
						/>
					</footer>
				</section>

				<section
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-3 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header>
						<h2 class="w-max select-none pl-1 text-base font-bold text-muted-foreground md:text-sm">
							<HoverCard.Root>
								<HoverCard.Trigger class="flex items-center gap-x-2 hover:animate-pulse">
									Steps <Info class="hidden size-4 md:block" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar/50 px-4 py-3 text-sm backdrop-blur-xl"
									>Defines the number of iterations for refining the image. More steps lead to finer
									details, but higher values may also increase processing time.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
						<Input
							class="absolute right-2 top-2 w-auto min-w-24"
							type="number"
							min="1"
							max="150"
							pattern="^[0-9]*$"
							oninput={(e) => {
								if (isNaN(parseFloat(e.currentTarget.value))) {
									return;
								}
							}}
							onwheel={(e) => {
								e.preventDefault();

								if (e.deltaY < 0) {
									values[1] += 1;
								} else {
									values[1] -= 1;
								}
							}}
							bind:value={values[1]}
						/>
					</header>
					<footer class="flex h-full w-full flex-col items-center justify-end px-2 pb-2.5">
						<Slider
							type="single"
							bind:value={values[1]}
							min={1}
							max={150}
							onwheel={(e) => {
								e.preventDefault();

								if (e.deltaY < 0) {
									values[1] += 1;
								} else {
									values[1] -= 1;
								}
							}}
						/>
					</footer>
				</section>

				<section
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header>
						<h2
							class="w-max select-none pl-2 pt-1 text-base font-bold text-muted-foreground md:text-sm"
						>
							<HoverCard.Root>
								<HoverCard.Trigger class="flex items-center gap-x-2 hover:animate-pulse">
									Seed <Info class="hidden size-4 md:block" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar/50 px-4 py-3 text-sm backdrop-blur-xl"
									>Sets the starting point for consistent results. Using the same seed ensures
									consistent results while changing it adds variation.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
					</header>
					<footer class="flex h-full w-full flex-col items-center justify-end">
						<Input
							type="number"
							min="1"
							max="150"
							pattern="^[0-9]*$"
							oninput={(e) => {
								if (isNaN(parseFloat(e.currentTarget.value))) {
									return;
								}
							}}
							onchange={(e) => {
								values[2] = Math.round(parseFloat(e.currentTarget.value));
							}}
							onwheel={(e) => {
								e.preventDefault();

								if (e.deltaY < 0) {
									values[2] += 1;
								} else {
									values[2] -= 1;
								}
							}}
							bind:value={values[2]}
						/>
					</footer>
				</section>

				<section
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
				>
					<header>
						<h2
							class="w-max select-none pl-2 pt-1 text-base font-bold text-muted-foreground md:text-sm"
						>
							<HoverCard.Root>
								<HoverCard.Trigger class="flex items-center gap-x-2 hover:animate-pulse">
									Sampler <Info class="hidden size-4 md:block" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar/50 px-4 py-3 text-sm backdrop-blur-xl"
									>The sampling method shapes the style and quality of the image. The sampler can
									influence how smooth, detailed, and closely the image follows the prompt.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
					</header>
					<footer class="flex h-full w-full flex-col items-center justify-end">
						<Popover.Root bind:open={selectOpen}>
							<Popover.Trigger
								bind:ref={refSelect}
								tabindex={0}
								onwheel={(e) => {
									e.preventDefault();
									let deltaY = e.deltaY;
									let i = selectResult.index;

									// if (selectOpen) return;

									if (deltaY < 0) {
										i = i === 0 ? selectList.length - 1 : i - 1;
									} else {
										i = i === selectList.length - 1 ? 0 : i + 1;
									}

									selectValue = selectList[i].value;
								}}
							>
								{#snippet child({ props })}
									<Button
										variant="outline"
										class="w-full justify-between bg-background/60"
										{...props}
										role="combobox"
										aria-expanded={selectOpen}
									>
										{selectResult?.label || 'Select a framework...'}
										<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-inherit bg-sidebar! p-0">
								<Command.Root>
									<Command.Input />
									<Command.List class="bg-sidebar/60">
										<Command.Empty>No sampler found</Command.Empty>
										<Command.Group>
											{#each selectList as framework}
												<Command.Item
													value={framework.value}
													onSelect={() => {
														selectValue = framework.value;
														closeAndFocusTrigger();
													}}
												>
													<Check
														class={cn(
															'mr-2 size-4',
															selectValue !== framework.value && 'text-transparent'
														)}
													/>
													{framework.label}
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</footer>
				</section>
			</div>
		{/if}
	</div>

	<form
		bind:this={refForm}
		class="absolute bottom-9 left-1/2 flex h-auto w-full max-w-[640px] -translate-x-1/2 flex-col items-center justify-end"
	>
		<div
			class="relative h-full w-full rounded-lg border border-sidebar-border bg-sidebar p-2 shadow-sm backdrop-blur-xl transition-[width,transform,margin]"
		>
			<Textarea
				bind:value
				bind:ref={refTextarea}
				name="prompt"
				placeholder="What will you create?"
				draggable="true"
				class="h-auto max-h-[150px] w-full resize-none border-none bg-red-900 text-base leading-tight transition-colors duration-300 placeholder:animate-in focus-visible:ring-0 focus-visible:ring-[none] md:max-h-[220px]"
				oninput={(_) => {
					// Registering changes to the value (only alphanumeric characters, but with Copy / Paste)
					if (value.length === 0) {
						refTextarea!.style.height = 'auto';
						return;
					}

					if (pressed) {
						tick().then(() => {
							requestAnimationFrame(() => {
								refTextarea?.scrollTo({ top: refTextarea!.scrollHeight, behavior: 'smooth' });
							});
						});
						return;
					}

					// Apply changes for all alpha-numeric characters (excluding special characters e.g. Enter)
					refTextarea!.style.height = refTextarea!.scrollHeight + 'px';

					if (refTextarea!.clientHeight < refTextarea!.scrollHeight) {
						// Wait until the textarea has resized (all reactive updates have been applied)
						tick().then(() => {
							// Make sure scrolling happens in the next frame (after Browser's repaint/reflow)
							requestAnimationFrame(() => {
								refTextarea?.scrollTo({ top: refTextarea!.scrollHeight, behavior: 'smooth' });
							});
						});
					}
				}}
				onkeydown={(e) => {
					if (pressed) {
						tick().then(() => {
							requestAnimationFrame(() => {
								refTextarea?.scrollTo({ top: refTextarea!.scrollHeight, behavior: 'smooth' });
							});
						});
						return;
					}

					// Registering keyboard interactions (non-alphanumeric characters) prior to input changes
					if (e.key === 'Enter' && e.shiftKey) {
						e.preventDefault();
						value += '\n';

						// First, let the reactive value 'value' apply changes to the DOM
						tick().then(() => {
							// Then, apply changes but for all non-alphanumeric characters (including Enter)
							refTextarea!.style.height = refTextarea!.scrollHeight + 'px';

							requestAnimationFrame(() => {
								refTextarea?.scrollTo({ top: refTextarea!.scrollHeight, behavior: 'smooth' });
							});
						});
						return;
					}

					if (e.key === 'Enter') {
						e.preventDefault();
						if (!value) return;

						refForm.requestSubmit();
						value = '';

						tick().then(() => {
							// Reset the entire form by restoring the initial height
							refTextarea!.style.height = 'auto';

							setTimeout(() => {
								refTextarea?.focus();
							}, 1_000);
						});
						return;
					}
				}}
			/>
			<div
				class="align-items mt-4 flex flex-row justify-between"
				in:fly={{ y: 30, opacity: 0, duration: 300, delay: 1000, easing: backOut }}
			>
				<div class="flex select-none items-center gap-x-2">
					<Toggle
						bind:pressed
						class="border border-transparent text-muted-foreground hover:text-sidebar-accent-foreground focus-visible:animate-pulse focus-visible:ring-sidebar-ring data-[state=on]:bg-blue-900/30 data-[state=on]:text-blue-500 hover:data-[state=on]:!border-blue-500 hover:data-[state=on]:bg-blue-900/30 data-[state=on]:focus-visible:animate-pulse"
						onPressedChange={(pressed) => {
							if (pressed) {
								refTextarea!.style.height = 'auto';
								refTextarea?.scrollTo({ top: refTextarea!.scrollHeight, behavior: 'smooth' });
							} else {
								refTextarea!.style.height = refTextarea!.scrollHeight + 'px';
								tick().then(() => {
									refTextarea?.focus();
								});
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
							<span class="translate-y-[0.5px] text-sm">↵</span>
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
