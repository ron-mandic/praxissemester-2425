<script lang="ts">
	// Source: https://svelte.dev/playground/434e0b14546747688401e8808c060a23?version=3.47.0
	import { PUBLIC_ID } from '$env/static/public';
	import type { Socket } from 'socket.io-client';
	import { CANVAS_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from './lib';
	import { isComplete } from '$lib/stores/timer-scribble';
	import { promptScribble } from '$lib/stores/prompt-scribble';
	import { onMount } from 'svelte';

	let { socket } = $props<{
		socket: Socket;
	}>();
	const arrLines = $state<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

	let refCanvas: HTMLCanvasElement;
	let boolIsDrawing = $state(false);
	let objCoords = $state<null | { x: number; y: number }>(null);

	let ctx: CanvasRenderingContext2D;
	let t: number, l: number;

	onMount(() => {
		ctx = refCanvas.getContext('2d')!;
		ctx.strokeStyle = CANVAS_COLOR;
		ctx.lineWidth = 3;
		handleSize();
	});

	$effect(() => {
		if (arrLines.length > 0) {
			socket.emit('c:sendCanvasData', {
				id: PUBLIC_ID,
				data: arrLines
			});
		}
	});

	$effect(() => {
		if ($isComplete) {
			$promptScribble = refCanvas.toDataURL();
		}
	});

	const handleSize = () => {
		const { top, left } = refCanvas.getBoundingClientRect();
		t = top;
		l = left;
	};
	const handleStart = ({ offsetX: x, offsetY: y }: { offsetX: number; offsetY: number }) => {
		// if (CANVAS_COLOR === CANVAS_BACKGROUND) {
		// 	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		// } else {
		// 	boolIsDrawing = true;
		// 	objCoords = { x, y };
		// }
		boolIsDrawing = true;
		objCoords = { x, y };
	};
	const handleMove = ({ offsetX: x1, offsetY: y1 }: { offsetX: number; offsetY: number }) => {
		if (!boolIsDrawing) return;

		const { x, y } = objCoords as { x: number; y: number };
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x1, y1);
		ctx.closePath();
		ctx.stroke();

		objCoords = { x: x1, y: y1 };
		arrLines.push({
			x1: x,
			y1: y,
			x2: x1,
			y2: y1
		});
	};
	const handleEnd = () => {
		boolIsDrawing = false;
	};
</script>

<svelte:window on:resize={handleSize} />

<canvas
	class="z-10 cursor-crosshair bg-transparent"
	style="outline: 1px solid #0d0f10b8;"
	bind:this={refCanvas}
	width={CANVAS_WIDTH}
	height={CANVAS_HEIGHT}
	onmousedown={handleStart}
	onmouseup={handleEnd}
	onmouseleave={handleEnd}
	onmousemove={handleMove}
	ontouchstart={(e) => {
		const { clientX, clientY } = e.touches[0];
		handleStart({
			offsetX: clientX - l,
			offsetY: clientY - t
		});
	}}
	ontouchmove={(e) => {
		const { clientX, clientY } = e.touches[0];
		handleMove({
			offsetX: clientX - l,
			offsetY: clientY - t
		});
	}}
	ontouchend={handleEnd}
></canvas>
