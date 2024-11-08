<script lang="ts">
	import type { Writable } from 'svelte/store';
	import OutputPlayerName from './OutputPlayerName.svelte';
	import OutputPromptClock from './OutputPromptClock.svelte';
	import OutputPromptLength from './OutputPromptLength.svelte';

	let {
		strPromptValue,
		objClockArgs,
		boolWithLength = false
	} = $props<{
		strPromptValue?: string;
		objClockArgs?: {
			storeTime: Writable<string>;
			storeCompletion: Writable<boolean>;
		};
		boolWithLength?: boolean;
	}>();
</script>

<div id="prompt-footer" class="flex items-end justify-between">
	{#if objClockArgs}
		<OutputPromptClock {...objClockArgs} />
	{:else}
		<OutputPromptClock />
	{/if}
	{#if strPromptValue && boolWithLength}
		<OutputPromptLength {strPromptValue} />
	{/if}
	<OutputPlayerName />
</div>

<style lang="scss">
	#prompt-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 124px;
		flex-shrink: 0;
		background-color: transparent;
		z-index: 100;
		user-select: none;
	}
</style>
