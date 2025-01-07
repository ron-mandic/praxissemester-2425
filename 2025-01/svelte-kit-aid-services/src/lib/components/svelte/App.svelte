<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Trigger } from '$lib/components/ui/sidebar/index';
	import * as Command from '$lib/components/ui/command/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import { quartIn, quartOut } from 'svelte/easing';
	import { navigating } from '$app/state';
	import { IsScrolling } from '$lib/hooks/is-scrolling.svelte';
	import { Button } from '../ui/button';
	import { Search, Slash } from 'lucide-svelte/icons';
	import Kbd from './Kbd.svelte';

	let { children, services, url } = $props();
	let isScrolling = new IsScrolling();

	let input = $state('');
	let output = $state('');

	let back = $derived.by(() => {
		let { from, to } = navigating;

		if (!from || !to) return false;
		return (from.route.id as string).length > (to.route.id as string).length;
	});

	let open = $state(false);
	function handleDialogKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
	function handleInputKeydown(
		event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }
	) {
		if (event.code === 'Tab') {
			event.preventDefault();
			input = output;
		}
	}

	function replaceBy(
		query: string,
		text: string,
		cb = (match: string) => `<span class="font-semibold text-blue-500">${match}</span>`
	) {
		if (!query) return text;

		const escapedSearchTerm = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(escapedSearchTerm, 'gi');

		return text.replace(regex, (match) => cb(match));
	}

	$inspect({ services, input, output });
</script>

<svelte:body onkeydown={handleDialogKeydown} />

<div id="app" class="relative m-2 h-full min-h-[calc(100dvh-74px)] w-screen md:ml-1.5">
	<header
		data-scroll={!isScrolling.current}
		class="sticky left-0 right-0 top-2 z-[2] inline-flex h-auto w-[100%] items-center justify-between gap-x-1 overflow-hidden rounded-lg border border-sidebar-border bg-sidebar/70 p-1 shadow-sm backdrop-blur-xl transition-[width,transform,margin] duration-500 ease-in-out data-[scroll=false]:!w-[calc(100%-.75rem)] data-[scroll=false]:!translate-x-1.5 dark:border-slate-200/10"
	>
		<div class="inline-flex items-center gap-x-1">
			<Trigger
				title="Toggle the sidebar"
				class="inline-flex items-center gap-x-3 px-3 text-muted-foreground shadow-none"
			>
				<Kbd class="hidden md:inline-flex">
					<span class="translate-y-[.5px] text-sm">⌘</span>
					<span>B</span>
				</Kbd>
			</Trigger>
			<Separator orientation="vertical" class="mr-3 h-4 bg-muted-foreground/40" />
			<Breadcrumb.Root>
				<Breadcrumb.List class="select-none">
					<Breadcrumb.Item class="hidden lg:block">
						<Breadcrumb.Link href="#">Image</Breadcrumb.Link>
					</Breadcrumb.Item>

					<Breadcrumb.Separator class="hidden lg:block">
						<Slash
							class="-rotate-[45deg] transition-[transform] duration-500 ease-out-cubic data-[scroll=true]:-rotate-[20deg]"
							data-scroll={!isScrolling.current}
						/>
					</Breadcrumb.Separator>

					<Breadcrumb.Item>
						<Breadcrumb.Page class="max-w-28 truncate">Stable Diffusion</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>
		<Button
			variant="ghost"
			class="[&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 relative inline-flex w-max items-center justify-between gap-x-3.5 whitespace-nowrap py-2 pl-3 pr-2 text-sm font-medium text-muted-foreground shadow-none transition-colors"
			onclick={() => (open = !open)}
		>
			<span class="hidden gap-x-3 md:inline-flex">
				<Search class="h-4 w-4 translate-y-0.5" />
				Stable Diffusion
			</span>
			<span class="inline-flex items-center gap-x-3 pr-2 no-interaction md:hidden md:pr-0">
				<Search class="h-4 w-4" />
				Search
			</span>
			<Kbd class="hidden md:inline-flex">
				<span class="translate-y-[.5px] text-sm">⌘</span>
				<span>K</span>
			</Kbd>
			<div class="sr-only">Search</div>
		</Button>
	</header>

	{#key url}
		<main
			class="relative h-auto w-full overflow-x-clip"
			in:fly={{ x: back ? -50 : 50, duration: 300, delay: 300, easing: quartOut }}
			out:fly={{ x: back ? 50 : -50, duration: 300, easing: quartIn }}
		>
			{@render children?.()}
		</main>
	{/key}

	<!-- <footer class="mt-2 h-32 w-full"></footer> -->

	<Command.Dialog class="mx-[auto] bg-sidebar backdrop-blur-xl" bind:open bind:value={output}>
		<div class="relative">
			<Command.Input
				onkeydown={handleInputKeydown}
				class="relative pl-[11.5px] pr-8 md:pr-[90px]"
				bind:value={input}
			/>
			<Kbd
				class="text-xs! absolute right-[44px] top-0 z-[-1] mt-[14px] hidden h-[20px] w-auto font-normal text-sidebar-foreground no-highlight no-interaction md:inline-flex"
			>
				<span class="-translate-x-px pb-1 text-base">⇥</span>
				<span class="tracking-tight">Tab</span>
			</Kbd>
			<span
				class="text-base! absolute left-[47.5px] top-0 z-[-1] mt-3 h-auto w-full translate-y-px text-muted-foreground/50 no-highlight no-interaction md:!translate-y-[0.5px] md:!text-sm"
			>
				{#if input.length > 0 && input !== output && output.startsWith(input)}
					{output}
				{/if}
			</span>
		</div>

		<Command.List class="p-1">
			<Command.Empty class="text-muted-foreground">No results found</Command.Empty>

			{#each services as { title, icon: Icon, items }, i (title)}
				<Command.Group heading={title}>
					{#each items as { title, url }, j}
						<Command.Item>
							{#if Icon}
								<Icon class="mr-2 size-4" />
							{/if}
							<span>{@html replaceBy(input, title)}</span>
						</Command.Item>
					{/each}
				</Command.Group>
				{#if i < services.length - 1}
					<Command.Separator />
				{/if}
			{/each}

			{#if !input}
				<div class="grid h-10 w-full place-content-center">
					<span
						class="z-10 -rotate-[11.5deg] scale-[1.375] px-3 font-vintage text-muted-foreground/90 no-interaction"
					>
						<span class="mr-1.5">The</span>End
					</span>
				</div>
			{/if}
		</Command.List>
	</Command.Dialog>
</div>
