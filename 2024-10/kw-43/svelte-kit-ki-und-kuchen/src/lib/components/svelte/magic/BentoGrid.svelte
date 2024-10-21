<script lang="ts">
	import { cn } from '$lib/utils';
	let className: any = '';
	export { className as class };
</script>

<div
	class={cn(
		'grid w-screen auto-rows-[20rem] grid-cols-3 gap-4 md:min-w-[calc(605px)]',
		className
	)}
>
	<slot></slot>
</div>
