<script lang="ts">
	import { Slider as SliderPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props();

	let grab = $state(false);
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:value={value as never}
	bind:ref
	class={cn('group relative flex w-full touch-none select-none items-center', className)}
	{...restProps}
>
	{#snippet children({ thumbs })}
		<span class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
			<SliderPrimitive.Range
				style="background-size: 150%;"
				class={[{
					"absolute h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 group-hover:bg-red-900": true,
					"animate-background-slide": grab
				}]}
			/>
		</span>

		{#each thumbs as thumb}
			<SliderPrimitive.Thumb
				index={thumb}
				class={[{
					"block size-[18px] cursor-grab rounded-full border-2 border-primary bg-primary ring-offset-background duration-200 ease-in transition-colors focus-visible:bg-sidebar-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0 active:bg-sidebar-primary active:outline-none active:ring-2 active:ring-sidebar-ring active:ring-offset-0 disabled:pointer-events-none disabled:opacity-50": true,
					"bg-sidebar-primary ring-sidebar-ring ring-2": grab
				}]}
				onfocus={() => (grab = true)}
				onblur={() => (grab = false)}
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>
