<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: CommandPrimitive.RootProps = $props();
</script>

<CommandPrimitive.Root
	class={cn(
		"bg-sidebar text-sidebar-foreground flex h-full w-full flex-col overflow-hidden rounded-lg",
		className
	)}
	bind:value
	bind:ref
	{...restProps}
/>
