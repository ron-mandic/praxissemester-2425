<script lang="ts">
	import InputCanvas from '../../input-canvas/components/InputCanvas.svelte';
	import OutputFooter from '../../output-footer/components/OutputFooter.svelte';
	import OutputPrompt from '../../output-prompt/components/OutputPrompt.svelte';
	import { time, isComplete } from '$lib/stores/timer-scribble';
	import type { Socket } from 'socket.io-client';

	let { socket } = $props<{
		socket: Socket;
	}>();
</script>

<div id="scribble" class="relative grid p-4">
	<OutputPrompt />
	<InputCanvas {socket} />
	<OutputFooter
		objClockArgs={{
			storeTime: time,
			storeCompletion: isComplete
		}}
		boolWithLength={true}
	/>
</div>

<style lang="scss">
	#scribble {
		width: 1856px;
		height: 940px;
		border: 2px solid #6eebea;
		background-color: #1c1f22;
		row-gap: 1rem;
		grid-template-rows: 152px auto;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			pointer-events: none;
		}
	}
</style>
