<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import type { Readable } from 'svelte/store';
	import Book from 'lucide-svelte/icons/book';
	import BookOpenText from 'lucide-svelte/icons/book-open-text';
	import ScrollArea from '@/ui/scroll-area/scroll-area.svelte';

	const { version, handler, page, links } = $props<{
		version: string;
		handler?: () => void;
		page: Readable<Page<Record<string, string>, string | null>>;
		links: ({ innerText: string; href?: string; available?: boolean } | { heading: string })[];
	}>();

	// Make sure, once the links are clicked, you can close the sheet (dialog) automatically
	// Source: https://www.bits-ui.com/docs/components/dialog
	let attr = !handler ? {} : { onclick: handler };
</script>

{#if version === 'v1'}
	<ScrollArea orientation="vertical" class="h-full w-full pt-4" type="scroll">
		<nav class="grid items-start gap-1 p-3 font-medium">
			{#each links as { innerText, href, heading, available = true }, i}
				{#if heading}
					<p
						class="font-regular relative mb-1 mt-6 select-none px-3 text-sm text-muted-foreground/70 first:mt-0"
					>
						<span class="uppercase">{heading}</span>
						{#if !available}
							<span
								class="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-600"
								>Bald verfügbar</span
							>
						{/if}
					</p>
				{:else}
					<a
						{href}
						{...attr}
						id="{version}-{i}"
						class="group relative flex select-none items-center gap-3 rounded-lg px-3 py-2 transition-transform last:mb-3 hover:text-primary {!href
							? 'pointer-events-none cursor-not-allowed select-none text-muted-foreground/40'
							: 'pointer-events-auto text-foreground'} {$page.route.id === href
							? 'bg-muted text-foreground'
							: 'text-muted-foreground'}"
					>
						{#if $page.route.id === href}
							<BookOpenText class="h-5 w-5 animate-slideIn ease-out" />
						{:else}
							<Book class="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
						{/if}
						<span
							class="relative w-full max-w-52 overflow-hidden text-ellipsis whitespace-nowrap {!available
								? 'bg-gradient-to-r from-muted-foreground/40 to-transparent bg-clip-text text-transparent'
								: 'bg-none'}">{innerText}</span
						>
						{#if !available}
							<span
								class="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-600"
								>Bald verfügbar</span
							>
						{/if}
					</a>
				{/if}
			{/each}
		</nav>
	</ScrollArea>
{/if}

{#if version === 'v2'}
	<ScrollArea orientation="vertical" class="w-full px-3 pt-4">
		<nav class="mt-2 grid gap-1 text-lg font-medium">
			{#each links as { innerText, href, heading, available = true }, i}
				{#if heading}
					<p
						class="relative font-regular mb-1 mt-6 select-none px-4 text-sm text-muted-foreground/70 first:mt-0"
					>
						<span class="uppercase">{heading}</span>
						{#if !available}
							<span
								class="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-600"
								>Bald verfügbar</span
							>
						{/if}
					</p>
				{:else}
					<a
						{href}
						{...attr}
						id="{version}-{i}"
						class="group relative flex select-none items-center gap-4 rounded-xl px-3 py-2 transition-transform last:mb-6 hover:text-foreground {!href
							? 'pointer-events-none cursor-not-allowed select-none text-muted-foreground/40'
							: 'pointer-events-auto text-foreground'} {$page.route.id === href
							? 'bg-muted text-foreground'
							: 'text-muted-foreground'}"
					>
						{#if $page.route.id === href}
							<BookOpenText class="ml-1 h-5 w-5 animate-slideIn ease-out" />
						{:else}
							<Book class="ml-1 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
						{/if}
						<span
							class="w-full max-w-52 overflow-hidden text-ellipsis whitespace-nowrap {!available
								? 'bg-gradient-to-r from-muted-foreground/40 to-transparent bg-clip-text text-transparent'
								: 'bg-none'}">{innerText}</span
						>
						{#if !available}
							<span
								class="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-600"
								>Bald verfügbar</span
							>
						{/if}
					</a>
				{/if}
			{/each}
		</nav>
	</ScrollArea>
{/if}
