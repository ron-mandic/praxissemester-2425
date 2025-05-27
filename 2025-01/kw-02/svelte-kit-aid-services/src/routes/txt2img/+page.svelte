<script lang="ts">
	import Section from '@/components/svelte/Article.svelte';
	import { Textarea } from '@/components/ui/textarea';
	import { SidebarRail } from '@/components/ui/sidebar';
	import {
		Settings2,
		Sparkles,
		Pencil,
		ImagePlus,
		Info,
		ChevronsUpDown,
		Check,
		Terminal,
		CornerDownLeft,
		LoaderPinwheel,
		LoaderCircle,
		Bot
	} from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import Kbd from '@/components/svelte/Kbd.svelte';
	import { fly, scale } from 'svelte/transition';
	import { backIn, backOut, quartIn, quartOut } from 'svelte/easing';
	import { Toggle } from '@/components/ui/toggle';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as HoverCard from '@/components/ui/hover-card';
	import Input from '@/components/ui/input/input.svelte';
	import Slider from '@/components/ui/slider/slider.svelte';
	import { onMount, tick } from 'svelte';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { cn } from '@/utils';
	import * as Carousel from '@/components/ui/carousel';
	import * as Card from '@/components/ui/card';

	let value = $state('');
	let pressed = $state(false);
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
	let refForm = $state<HTMLDivElement>(null!);
	let refSelect = $state<HTMLButtonElement>(null!);

	let loading = $state(false);
	let apiResponse = $state<
		Promise<{
			images: string[];
			info: string;
			parameters: { [key: string]: unknown };
		}>
	>();

	// TODO: Implement scrolling feature for the dropdown
	// const selectResult = $derived.by(() => {
	// 	const index = selectList.findIndex((f) => f.value === selectValue);
	// 	const value = index !== -1 ? selectList[index] : undefined;

	// 	return { index, ...value };
	// });

	function closeAndFocusTrigger() {
		selectOpen = false;
		tick().then(() => {
			refSelect.focus();
		});
	}

	// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
	function isMobile() {
		return (
			/iphone|ipad|ipod|nokia|tablet|nexus\s7|nexus\s10|KFAPWI|opera\smini|webos|windows\smobile|windows\sphone|iemobile|android|blackberry|fennec/i.test(
				navigator.userAgent
			) &&
			window.navigator.maxTouchPoints > 1 &&
			!window.matchMedia('(hover: hover)').matches
		);
	}
	async function handleGenerate(e: MouseEvent | KeyboardEvent) {
		e.preventDefault();
		if (!value) return;

		apiResponse = undefined;

		const objData = {
			prompt: value,
			cfg_scale: values[0],
			steps: values[1],
			seed: values[2],
			sampler_index: selectValue,
			batch_size: 4
		};

		value = '';
		console.log(objData);

		loading = true;
		try {
			const response = await fetch('https://2fa1da8bb8d83b77ba.gradio.live/sdapi/v1/txt2img', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(objData)
			});
			apiResponse = response.json();
		} catch (error) {
			console.error(error);
		}
		loading = false;

		tick().then(() => {
			// Reset the entire form by restoring the initial height
			refTextarea!.style.height = 'auto';

			setTimeout(() => {
				refTextarea?.focus();
			}, 750);
		});
	}

	let isMobileDevice: boolean;

	onMount(() => {
		isMobileDevice = isMobile();
	});

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

	function handleEscape(event: KeyboardEvent & { currentTarget: EventTarget & HTMLElement }) {
		if (event.key === 'Escape' && pressed) {
			pressed = false;
		}
	}
</script>

<svelte:body onkeydown={handleEscape} />

<Section class="relative">
	<div
		class="group flex h-[calc(100dvh-74px)] max-h-[calc(100dvh-74px)] w-full flex-col justify-end overflow-y-hidden rounded-lg pb-[clamp(198px,10%,200px)] @container"
	>
		<div
			id="image-layout"
			class="relative flex h-full min-h-[83.25px] w-full items-center justify-center overflow-hidden rounded-lg"
		>
			<!-- <section
				class="mx-[auto] flex h-full max-h-full w-full items-center justify-center bg-red-900"
			>
				<img
					class="object-cover"
					style="max-width: 100%; max-height: 100%;"
					alt="Palms"
					src="/test.png"
				/>
			</section> -->

			<section class="relative flex w-full items-center justify-center">
				{#if apiResponse}
					{#await apiResponse}
						<div class="flex flex-col items-center justify-center gap-y-1">
							<Bot class="size-10 text-muted" />
							<p class="text-muted">Processing images ...</p>
						</div>
					{:then { images }}
						<Carousel.Root
							orientation="horizontal"
							class="h-full min-h-full overflow-hidden rounded-lg"
							opts={{
								align: 'center',
								loop: false,
								containScroll: false /* Source: https://github.com/davidjerleke/embla-carousel/discussions/935 */
							}}
						>
							<Carousel.Previous
								class="absolute left-2 top-1/2 z-10 size-10 -translate-y-1/2 border border-white/20 bg-sidebar/90 ring-offset-0 backdrop-blur-xl"
							/>
							<Carousel.Content class="-ml-3 h-full">
								{#each images as image, i (image)}
									<Carousel.Item
										class="relative grid h-full max-w-[800px] place-content-center pl-4 transition-[flex] [@media(max-height:1077px)]:basis-[min(480px,100%)] [@media(max-height:594px)]:basis-[min(120px,100%)] [@media(max-height:839px)]:basis-[min(240px,100%)]"
									>
										<a
											download="{i}.jpg"
											href={`data:image/png;base64,${image}`}
											title="Image generated from the prompt. #${i + 1}"
										>
											<img
												class="object-fit block w-[800px] select-none rounded-lg md:rounded-xl"
												alt="Image generated from the prompt. #${i + 1}"
												src={`data:image/png;base64,${image}`}
											/>
										</a>
									</Carousel.Item>
								{/each}
							</Carousel.Content>
							<Carousel.Next
								class="absolute right-2 top-1/2 z-10 size-10 -translate-y-1/2 border border-white/20 bg-sidebar/90 ring-offset-0 backdrop-blur-xl"
							/>
						</Carousel.Root>
					{/await}
				{:else if loading}
					<div class="flex flex-col items-center justify-center gap-y-1">
						<Bot class="size-10 text-muted" />
						<p class="text-muted">Generating ...</p>
					</div>
				{:else}
					<div class="flex h-full w-full items-center justify-center">
						<Bot class="size-10 text-muted" />
					</div>
				{/if}
			</section>
		</div>

		{#if pressed}
			<!--
				NOTE: iPhone 4 support, currently full iPhone SE compatibility
				[@media(max-height:552px)]:h-[108px] ?
			-->
			<div
				id="modal-layout"
				role="dialog"
				class="mx-[auto] flex h-full max-h-[280px] min-h-[208px] w-[calc(100%-4px)] max-w-[640px] snap-y snap-mandatory grid-cols-2 grid-rows-2 flex-col gap-2 overflow-auto overflow-y-auto rounded-lg border border-sidebar-border bg-sidebar/80 p-2 shadow-sm backdrop-blur-xl @[540px]:grid"
				style="position: absolute; left: calc(50% + 2px); transform: translate3D(-50%, 0, 0) preserve-3d; margin-left: max(-50%,-320px); counter: section; --length: '{values.length}';"
				in:fly={{ y: 50, opacity: 0, duration: 300, delay: 300, easing: quartOut }}
				out:fly={{ y: 50, opacity: 0, duration: 250, easing: quartIn }}
			>
				<section
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar p-3 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
					style="counter-increment: section;"
				>
					<header>
						<h2 class="w-max select-none pl-1 text-base font-bold text-muted-foreground md:text-sm">
							<HoverCard.Root>
								<HoverCard.Trigger
									class="flex items-center gap-x-2 font-mono uppercase after:absolute after:top-[38px] after:font-mono after:text-xs after:font-normal after:tracking-[-2px] after:content-[counter(section)_'_/_'_var(--length)] hover:animate-pulse"
								>
									CFG <Info class="hidden size-4 min-[540px]:block" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar/50 px-4 py-3 text-sm backdrop-blur-xl"
									>Controls how closely the image matches the prompt. The higher the value, the more
									strictly the image adheres to the prompt.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>

						<Input
							bind:value={values[0]}
							class="absolute right-2 top-2 w-auto min-w-24 font-mono"
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
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar p-3 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
					style="counter-increment: section;"
				>
					<header>
						<h2 class="w-max select-none pl-1 text-base font-bold text-muted-foreground md:text-sm">
							<HoverCard.Root>
								<HoverCard.Trigger
									class="flex items-center gap-x-2 font-mono uppercase after:absolute after:top-[38px] after:font-mono after:text-xs after:font-normal after:tracking-[-2px] after:content-[counter(section)_'_/_'_var(--length)] hover:animate-pulse"
								>
									Steps <Info class="hidden size-4 min-[540px]:block" />
								</HoverCard.Trigger>
								<HoverCard.Content class="bg-sidebar/50 px-4 py-3 text-sm backdrop-blur-xl"
									>Defines the number of iterations for refining the image. More steps lead to finer
									details, but higher values may also increase processing time.
								</HoverCard.Content>
							</HoverCard.Root>
						</h2>
						<Input
							bind:value={values[1]}
							class="absolute right-2 top-2 w-auto min-w-24 font-mono"
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
						/>
					</header>
					<footer class="flex h-full w-full flex-col items-center justify-end px-2 pb-2.5">
						<Slider
							bind:value={values[1]}
							type="single"
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
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
					style="counter-increment: section;"
				>
					<header>
						<h2
							class="w-max select-none pl-2 pt-1 text-base font-bold text-muted-foreground md:text-sm"
						>
							<HoverCard.Root>
								<HoverCard.Trigger
									class="flex items-center gap-x-2 font-mono uppercase after:absolute after:top-[38px] after:font-mono after:text-xs after:font-normal after:tracking-[-2px] after:content-[counter(section)_'_/_'_var(--length)] hover:animate-pulse"
								>
									Seed <Info class="hidden size-4 min-[540px]:block" />
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
							bind:value={values[2]}
							class="font-mono"
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
						/>
					</footer>
				</section>

				<section
					class="relative grid h-[clamp(124px,15%,240px)] w-full flex-shrink-0 snap-start scroll-mt-2 grid-cols-1 grid-rows-[auto,1fr] gap-y-2 rounded-md border border-sidebar-border bg-sidebar p-2 shadow-lg @[540px]:h-full @[540px]:flex-shrink"
					style="counter-increment: section;"
				>
					<header>
						<h2
							class="w-max select-none pl-2 pt-1 text-base font-bold text-muted-foreground md:text-sm"
						>
							<HoverCard.Root>
								<HoverCard.Trigger
									class="flex items-center gap-x-2 font-mono uppercase after:absolute after:top-[38px] after:font-mono after:text-xs after:font-normal after:tracking-[-2px] after:content-[counter(section)_'_/_'_var(--length)] hover:animate-pulse"
								>
									Sampler <Info class="hidden size-4 min-[540px]:block" />
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
							<Popover.Trigger bind:ref={refSelect} tabindex={0}>
								{#snippet child({ props })}
									<Button
										variant="outline"
										class="w-full justify-between bg-background/60"
										{...props}
										role="combobox"
										aria-expanded={selectOpen}
									>
										{selectValue || 'Select a framework...'}
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

	<!-- w-full und left: 50% -->
	<div
		bind:this={refForm}
		id="form"
		class="absolute bottom-9 flex h-auto w-[calc(100%-4px)] max-w-[640px] flex-col items-center justify-end"
		class:typing={value.length > 0}
		class:jello={value.length === 0}
		style="position: absolute; left: calc(50% + 2px); transform: translate3D(-50%, 0, 0) preserve-3d; margin-left: max(-50%,-320px);"
	>
		<div
			class="relative h-full w-full rounded-lg border border-sidebar-border bg-sidebar/85 p-2 shadow-sm backdrop-blur-2xl transition-[border-color,width,transform,margin] duration-300 has-[textarea:focus-visible]:border-white/15"
		>
			<Textarea
				bind:value
				bind:ref={refTextarea}
				class="h-auto max-h-[150px] w-full resize-none border-none bg-transparent text-base leading-tight transition-colors duration-300 selection:bg-white/10 selection:text-white placeholder:animate-in focus-visible:ring-0 focus-visible:ring-[none] md:max-h-[220px]"
				placeholder="What will you create?"
				maxlength={1024}
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
					// Registering keyboard interactions (non-alphanumeric characters) prior to input changes
					if ((e.key === 'Enter' && isMobileDevice) || (e.key === 'Enter' && e.shiftKey)) {
						e.preventDefault();
						value += '\n';

						// First, let the reactive value 'value' apply changes to the DOM
						tick().then(() => {
							// Then, apply changes but for all non-alphanumeric characters (including Enter)
							if (!pressed) refTextarea!.style.height = refTextarea!.scrollHeight + 'px';

							requestAnimationFrame(() => {
								refTextarea?.scrollTo({ top: refTextarea!.scrollHeight, behavior: 'smooth' });
							});
						});
						return;
					}

					// TODO: Enter should also return a new line on mobile
					if (e.key === 'Enter' && !isMobileDevice) {
						if (loading) {
							e.preventDefault();
							return;
						}
						handleGenerate(e);
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
						class="w-10 border-2 border-transparent px-2 text-muted-foreground hover:bg-white/10 hover:text-sidebar-accent-foreground hover:text-white focus-visible:animate-pulse focus-visible:ring-gray-300 data-[state=on]:bg-white/20 data-[state=on]:text-white hover:data-[state=on]:!border-white hover:data-[state=on]:bg-white/30 data-[state=on]:focus-visible:animate-pulse"
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
						variant="default"
					>
						<Settings2 class="h-10 w-10" />
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

					<Separator class="h-5 bg-white/10" orientation="vertical" />

					<!-- TODO: Make toggle group (single) -->
					<Toggle
						class="w-10 border-2 border-transparent px-2 text-muted-foreground hover:bg-white/10 hover:text-sidebar-accent-foreground hover:text-white focus-visible:animate-pulse focus-visible:ring-gray-300 data-[state=on]:bg-white/20 data-[state=on]:text-white hover:data-[state=on]:!border-white hover:data-[state=on]:bg-white/30 data-[state=on]:focus-visible:animate-pulse"
						tabindex={0}
						variant="default"
						disabled
					>
						<Pencil />
					</Toggle>
				</div>

				<div>
					<!-- class="disabled:bg-blue-600! select-none bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-3 text-white transition-[opacity,transform] duration-300 ease-out-cubic hover:-translate-y-[2px] active:-translate-y-[2px] disabled:opacity-30" -->
					<Button
						class="ease relative select-none bg-gradient-to-r from-white to-white px-3 text-sidebar transition-[background,background-image,opacity,transform] duration-100 hover:-translate-y-[3px] focus-visible:ring-gray-300 active:translate-y-0 disabled:opacity-30 data-[disabled=true]:from-secondary data-[disabled=true]:to-secondary data-[disabled=true]:text-white"
						onclick={(e) => {
							if (loading) {
								e.preventDefault();
								return;
							}
							handleGenerate(e);
						}}
						disabled={loading || value.length === 0}
						data-disabled={loading || value.length === 0}
						tabindex={0}
					>
						{#if !loading}
							<Sparkles class="mx-.5" />
						{:else}
							<LoaderCircle class="size-5 animate-spin" />
						{/if}
						<Kbd
							class="ml-0.5 hidden items-center gap-x-1 border-slate-300/30 bg-transparent md:inline-flex"
						>
							<span class="text-sm">
								<CornerDownLeft style="width: 12px; aspect-ratio: 1 / 1;" />
							</span>
						</Kbd>
					</Button>
				</div>
			</div>
		</div>
	</div>
</Section>

<style lang="scss">
	#form {
		&.typing::before {
			content: '';
			@apply absolute rounded-lg bg-transparent;
			inset: -2px;
			background-size: 300% 300%;
			// Source: https://uiverse.io/StealthWorm/spotty-horse-48
			background-image: linear-gradient(
				137.48deg,
				#ffdb3b 10%,
				#fe53bb 45%,
				#8f51ea 67%,
				#1f55e7 87%
			);
			background-origin: border-box;
			background-clip: content-box, border-box;
			transition: background-image 0.75s ease;
		}
		&.typing::before {
			transition: background-image 0.75s ease;
			animation: gradient 8s ease infinite;
		}
		&::after {
			content: 'Do not use for malicious purposes';
			@apply absolute left-1/2 top-full w-auto -translate-x-1/2 translate-y-[6.75px] cursor-auto whitespace-nowrap rounded-full bg-background/60 px-3 py-1 text-center text-xs text-muted-foreground/50 backdrop-blur-2xl transition-transform duration-200 ease-out-cubic no-interaction;
		}
	}

	@media (print), (prefers-reduced-motion: reduce) {
		#form {
			animation: none !important;
		}
	}

	#modal-layout {
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	#image-layout {
		@apply h-full w-full;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes jello {
		from,
		11.1%,
		to {
			transform: translate3D(-50%, 0, 0) preserve-3d;
		}

		22.2% {
			transform: skewX(-0.75deg) skewY(-0.75deg);
		}

		33.3% {
			transform: skewX(0.375deg) skewY(0.375deg);
		}

		44.4% {
			transform: skewX(-0.175deg) skewY(-0.175deg);
		}

		55.5% {
			transform: skewX(0.0875deg) skewY(0.0875deg);
		}

		66.6% {
			transform: skewX(-0.05deg) skewY(-0.05deg);
		}

		77.7% {
			transform: skewX(0.0125deg) skewY(0.0125deg);
		}

		88.8% {
			transform: skewX(-0.005deg) skewY(-0.005deg);
		}
	}

	.jello {
		animation-name: jello;
		animation-timing-function: ease-in-out;
		animation-duration: 0.875s;
		transform-origin: center;
	}
</style>
