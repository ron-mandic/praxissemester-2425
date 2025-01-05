<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import type { ComponentProps } from 'svelte';
	import { useSidebar } from './context.svelte.js';

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		children,
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();
</script>

<Button
	type="button"
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	data-sidebar="trigger"
	variant="ghost"
	size="default"
	class={className}
	{...restProps}
>
	<PanelLeft />
	{@render children?.()}
	<span class="sr-only">Toggle the sidebar</span>
</Button>
