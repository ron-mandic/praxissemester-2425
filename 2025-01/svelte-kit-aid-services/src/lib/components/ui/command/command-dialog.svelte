<script lang="ts">
	import type {
		Command as CommandPrimitive,
		Dialog as DialogPrimitive,
		WithoutChildrenOrChild
	} from 'bits-ui';
	import type { Snippet } from 'svelte';
	import Command from './command.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(''),
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: DialogPrimitive.PortalProps;
			children: Snippet;
		} = $props();

	$inspect(restProps);
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Content
		class="w-[calc(100%-.925rem)] max-w-[460px] overflow-hidden rounded-lg p-0 shadow-lg no-highlight"
		{portalProps}
	>
		<Command
			class="[&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-group]]:px-2 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
			{...restProps}
			bind:value
			bind:ref
			{children}
		/>
	</Dialog.Content>
</Dialog.Root>
