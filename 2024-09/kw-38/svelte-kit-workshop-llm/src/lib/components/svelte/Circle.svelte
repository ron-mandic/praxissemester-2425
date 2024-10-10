<script lang="ts">
	import { cn } from '$lib/utils';

	let className: any = '';
	export { className as class };
</script>

<div
	class={cn(
		'z-10 flex h-12 w-28 cursor-pointer items-center justify-center rounded-full border-2 bg-background p-3 transition-all duration-200',
		className
	)}
>
	<slot></slot>
</div>
