<script lang="ts">
</script>

<svelte:head>
	<title>Scribble</title>
</svelte:head>

<div id="scribble" class="relative grid p-4">
	<div id="prompt-text" class="relative h-[152px] w-full p-4">
		<p>...</p>
		<div class="absolute bottom-0 left-0">Prompt</div>
	</div>
	<div id="canvas" class="relative flex items-end justify-center">
		<!-- <LiveCanvas {socket} bind:this={liveCanvas} /> -->
	</div>
	<div id="prompt-footer" class="flex items-end justify-between">
		<div id="prompt-clock" class="flex flex-col justify-center">
			<p>time remaining:</p>
			<p>...</p>
		</div>
		<div id="prompter" class="px-2">...</div>
	</div>
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

	#prompt-text {
		margin: 0 auto;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		background: #000;
		color: #6eebea;
		font-size: 21px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		user-select: none;
		max-width: 1824px;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(to bottom, transparent, black);
			z-index: 1;
			pointer-events: none;
		}

		div {
			width: 260px;
			height: 51px;
			flex-shrink: 0;
			border-top: 2px solid #6eebea;
			border-right: 2px solid #6eebea;
			color: #fff;
			text-align: center;
			font-size: 36px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			background-color: #1c1f22;
			z-index: 2;
		}
	}

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

	#prompt-clock {
		width: 245px;
		height: 124px;
		flex-shrink: 0;
		border-top: 2px solid #6eebea;
		border-right: 2px solid #6eebea;
		background: #1c1f22;
		padding: 8px 12px 0;

		p:nth-child(1) {
			color: #fff;
			text-align: center;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		p:nth-child(2) {
			color: #fff;
			text-align: center;
			font-size: 68px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;

			&.completing {
				animation: pulse 1s linear infinite;
			}

			&.complete {
				color: #ff3838;
				animation: shakeX 1s linear;
			}
		}
	}

	#prompter {
		width: 260px;
		height: 51px;
		flex-shrink: 0;
		border-top: 2px solid #6eebea;
		border-left: 2px solid #6eebea;
		color: #fff;
		text-align: center;
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background-color: #1c1f22;
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

	@keyframes pulse {
		from {
			transform: scale3d(1, 1, 1);
		}

		50% {
			transform: scale3d(1.05, 1.05, 1.05);
		}

		to {
			transform: scale3d(1, 1, 1);
		}
	}

	@keyframes shakeX {
		from,
		to {
			transform: translate3d(0, 0, 0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translate3d(-10px, 0, 0);
		}

		20%,
		40%,
		60%,
		80% {
			transform: translate3d(10px, 0, 0);
		}
	}
</style>
