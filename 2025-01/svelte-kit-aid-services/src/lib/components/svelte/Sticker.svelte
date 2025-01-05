<script lang="ts">
	import { cn } from '$lib/utils';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let { title, class: className }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	class={cn(
		'bg-sticker border-sticker-border text-sticker-foreground rounded-full border-[1.5px] px-2 py-1 text-[10px] no-interaction',
		className
	)}
>
	{title}
</span>
