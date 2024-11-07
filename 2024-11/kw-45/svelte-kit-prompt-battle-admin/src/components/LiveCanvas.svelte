<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let id: string;
	export let lines: {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}[] = [];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let prevLines: any;

	function drawLine(line: { x1: number; y1: number; x2: number; y2: number }) {
		ctx.beginPath();
		ctx.moveTo(line.x1, line.y1);
		ctx.lineTo(line.x2, line.y2);
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#6EEBEA';
		ctx.stroke();
	}

	function drawLines() {
		ctx.clearRect(0, 0, 512, 512);
		lines.forEach(drawLine);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		drawLines();
		prevLines = JSON.stringify(lines);
	});

	onDestroy(() => {
		ctx.clearRect(0, 0, 512, 512);
		lines = [];
	});

	$: {
		if (canvas && ctx && JSON.stringify(lines) !== prevLines) {
			drawLines();
			prevLines = JSON.stringify(lines);
		}
	}
</script>

<canvas bind:this={canvas} width="512" height="512" />

<style>
	canvas {
		background: transparent;
	}
</style>
