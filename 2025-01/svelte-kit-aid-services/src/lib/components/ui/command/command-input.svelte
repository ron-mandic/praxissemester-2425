<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui';
	import Search from 'lucide-svelte/icons/search';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(''),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div class="flex items-center px-3" data-command-input-wrapper="">
	<Search class="mr-2 size-4 shrink-0 translate-x-[3.5px] translate-y-[1.5px] opacity-50" />
	<CommandPrimitive.Input
		class={cn(
			'flex h-11 w-full rounded-md bg-transparent px-2 py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			className
		)}
		bind:ref
		bind:value
		{...restProps}
	/>
</div>
