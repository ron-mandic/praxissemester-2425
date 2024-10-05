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
	class="max-md:max-w-[calc(100vw-16px)] gap-x-1.5 mt-24 flex flex-row items-center {prev && next ? 'justify-between' : prev ? 'justify-start' : 'justify-end'}"
>
	{#if prev}
		<Button
			variant="outline"
			class="flex-1 md:flex-initial group flex items-center justify-between gap-3 rounded-md px-5 py-6 transition-transform focus-visible:px-5 focus-visible:py-6"
			href={url.replace(/(\d+)$/, (match: string) => `${+match - 1}`)}
		>
			<ChevronLeft class="h-6 w-6 ease-in-out transition-transform group-hover:-translate-x-1" />
			<span class="font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-24 md:max-w-40">{prev}</span>
		</Button>
	{/if}

	{#if next}
		<Button
			variant="outline"
			class="flex-1 md:flex-initial group flex items-center justify-between gap-3 rounded-md px-5 py-6 transition-transform focus-visible:px-5 focus-visible:py-6"
			href={url.replace(/(\d+)$/, (match: string) => `${+match + 1}`)}
		>
			<span class="font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-24 md:max-w-40">{next}</span>
			<ChevronRight class="h-6 w-6 ease-in-out transition-transform group-hover:translate-x-1" />
		</Button>
	{/if}
</div>
