<script lang="ts">
	import { isComplete } from '$lib/stores/timer-scribble';
	import type { Socket } from 'socket.io-client';
	import Canvas from './Canvas.svelte';
	import { onMount } from 'svelte';

	let { socket } = $props<{
		socket: Socket;
	}>();

	let numInterval: number;
	let boolIsWobbling = $state(false);

	onMount(() => {
		numInterval = setInterval(() => {
			boolIsWobbling = !boolIsWobbling;
		}, 6500);

		return () => {
			clearInterval(numInterval);
		};
	});
</script>

<div
	id="canvas"
	class="relative flex items-end justify-center"
	class:completed={$isComplete}
	class:pointer-events-none={$isComplete}
	class:jello={boolIsWobbling && !$isComplete}
>
	<Canvas {socket} />
</div>

<style lang="scss">
	#canvas {
		padding-bottom: 124px;
		z-index: 1;

		&.jello::after {
			animation: jello 1s ease-in-out;
		}

		&.completed::after {
			animation: none !important;
			display: none;
		}

		&::after {
			content: 'SCRIBBLE';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			color: rgba(255, 255, 255, 0.05);
			text-align: center;
			font-size: 89px;
			font-style: normal;
			font-weight: 800;
			line-height: normal;
			transform-origin: center center;
			pointer-events: none;
		}
	}

	@keyframes jello {
		from,
		11.1%,
		to {
			transform: translate3d(-50%, -50%, 0);
		}

		22.2% {
			transform: skewX(-12.5deg) skewY(-12.5deg) translate3d(-50%, -50%, 0);
		}

		33.3% {
			transform: skewX(6.25deg) skewY(6.25deg) translate3d(-50%, -50%, 0);
		}

		44.4% {
			transform: skewX(-3.125deg) skewY(-3.125deg) translate3d(-50%, -50%, 0);
		}

		55.5% {
			transform: skewX(1.5625deg) skewY(1.5625deg) translate3d(-50%, -50%, 0);
		}

		66.6% {
			transform: skewX(-0.78125deg) skewY(-0.78125deg) translate3d(-50%, -50%, 0);
		}

		77.7% {
			transform: skewX(0.390625deg) skewY(0.390625deg) translate3d(-50%, -50%, 0);
		}

		88.8% {
			transform: skewX(-0.1953125deg) skewY(-0.1953125deg) translate3d(-50%, -50%, 0);
		}
	}
</style>
