<script lang="ts">
	import { cn } from '$lib/utils';

	// TODO: Personalize the props or the entire component

	let { class: className, children } = $props<{
		sy?: number;
		class?: string;
		children?: () => any;
	}>();
</script>

<article class={cn(`mt-2 min-h-[calc(100dvh-74px)] w-full bg-none`, className)}>
	{@render children?.()}
</article>
