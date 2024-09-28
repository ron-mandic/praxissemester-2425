<script lang="ts">
	import type { Page } from '@sveltejs/kit';
	import type { Readable } from 'svelte/store';
	import Book from 'lucide-svelte/icons/book';
	import BookOpenText from 'lucide-svelte/icons/book-open-text';

	const { version, handler, page, links } = $props<{
		version: string;
		handler?: () => void;
		page: Readable<Page<Record<string, string>, string | null>>;
		links: { innerText: string; href: string }[];
	}>();

	// Make sure, once the links are clicked, you can close the sheet (dialog) automatically
	// Source: https://www.bits-ui.com/docs/components/dialog
	let attr = !handler ? {} : { onclick: handler };
</script>

{#if version === 'v1'}
	<nav class="grid items-start gap-1 p-3 font-medium">
		{#each links as { innerText, href }, i}
			<a
				{href}
				{...attr}
				id="{version}-{i}"
				class="group flex select-none items-center gap-3 rounded-lg px-3 py-2 transition-transform hover:text-primary {$page
					.route.id === href
					? 'bg-muted text-foreground'
					: 'text-muted-foreground'}"
			>
				{#if $page.route.id === href}
					<BookOpenText class="h-5 w-5 animate-slideIn ease-out" />
				{:else}
					<Book class="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
				{/if}
				<span>{innerText}</span>
			</a>
		{/each}
	</nav>
{/if}

{#if version === 'v2'}
	<nav class="mt-2 grid gap-1 text-lg font-medium">
		{#each links as { innerText, href }, i}
			<a
				{href}
				{...attr}
				id="{version}-{i}"
				class="group mx-[-0.65rem] flex select-none items-center gap-4 rounded-xl px-3 py-2 transition-transform hover:text-foreground {$page
					.route.id === href
					? 'bg-muted text-foreground'
					: 'text-muted-foreground'}"
			>
				{#if $page.route.id === href}
					<BookOpenText class="h-5 w-5 animate-slideIn ease-out" />
				{:else}
					<Book class="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
				{/if}
				<span>{innerText}</span>
			</a>
		{/each}
	</nav>
{/if}
