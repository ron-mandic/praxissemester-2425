<script lang="ts">
	import Button from '@/ui/button/button.svelte';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';

	const {
		url,
		prev,
		next = '/sections/chapter-1'
	} = $props<{ url: string; prev?: string; next: string }>();
</script>

<div
	class="mt-24 flex flex-row items-center gap-x-1.5 max-md:max-w-[calc(100vw-16px)] {prev && next
		? 'justify-between'
		: prev
			? 'justify-start'
			: 'justify-end'}"
>
	{#if prev}
		<Button
			variant="outline"
			class="group flex flex-1 items-center justify-between gap-3 rounded-md px-5 py-6 transition-transform focus-visible:px-5 focus-visible:py-6 md:flex-initial"
			href={!url.endsWith("") ? url.replace(/(\d+)$/, (match: string) => `${+match - 1}`) : "/"}
		>
			<ChevronLeft class="h-6 w-6 transition-transform ease-in-out group-hover:-translate-x-1" />
			<span
				class="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap font-semibold md:max-w-40"
				>{prev}</span
			>
		</Button>
	{/if}

	{#if next}
		<Button
			variant="outline"
			class="group flex {prev
				? 'flex-1'
				: 'w-[calc(50%-6px)] md:w-max'} items-center justify-between gap-3 rounded-md px-5 py-6 transition-transform focus-visible:px-5 focus-visible:py-6 md:flex-initial"
			href={url.replace(/(\d+)$/, (match: string) => `${+match + 1}`)}
		>
			<span
				class="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap font-semibold md:max-w-40"
				>{next}</span
			>
			<ChevronRight class="h-6 w-6 transition-transform ease-in-out group-hover:translate-x-1" />
		</Button>
	{/if}
</div>
