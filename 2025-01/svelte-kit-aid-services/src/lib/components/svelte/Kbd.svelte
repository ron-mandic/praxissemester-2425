<script lang="ts">
	import { cn } from '$lib/utils';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<kbd
	class={cn(
		'pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100',
		className
	)}
>
	{@render children?.()}
</kbd>
