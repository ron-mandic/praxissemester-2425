<script lang="ts">
	import { cn } from '$lib/utils';
	
	// TODO: Personalize the props or the entire component

	let {
		class: className,
		children
	} = $props<{
		sy?: number;
		class?: string;
		children?: () => any;
	}>();
</script>

<section
	class={cn(
		`mt-2 grid min-h-[calc(100dvh-74px)] w-full place-content-center`,
		className
	)}
>
	{@render children?.()}
</section>
