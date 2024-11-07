<script lang="ts">
</script>

<svelte:head>
	<title>Projector - Scribble</title>
</svelte:head>

<div
	id="prompt-screen"
	class="m-auto flex h-full w-full flex-col justify-between pb-[103px] pt-[84px]"
>
	<div class="grid h-full w-full">
		<div class="header relative line-clamp-2">
			<p>...</p>
			<div class="label absolute bottom-0 left-0">Challenge</div>
		</div>
		<div class="main relative">
			<div class="col-left pointer-events-none flex items-center justify-center">
				{#if !true}
					<canvas width="512" height="512" />
				{:else}
					<!-- <LiveCanvas id={canvas0Id} lines={data0} /> -->
				{/if}
			</div>
			<div class="col-mid flex flex-col items-center justify-between">
				<div id="prompt-clock" class="flex flex-col justify-center">
					<p>time remaining:</p>
					<p></p>
				</div>
				<div id="player-score" class="mt-4 w-full self-start">
					<p>current score:</p>
					<p class="flex w-full justify-between">
						<span class="inline-block flex-[33%] flex-grow"> </span>
						<span class="inline-block flex-[33%] flex-grow">-</span>
						<span class="inline-block flex-[33%] flex-grow"> </span>
					</p>
				</div>
			</div>
			<div class="col-right pointer-events-none flex items-center justify-center">
				{#if !true}
					<canvas width="512" height="512" />
				{:else}
					<!-- <LiveCanvas id={canvas1Id} lines={data1} /> -->
				{/if}
			</div>
			<div class="footer">
				<div class="absolute bottom-0 left-0 px-2">...</div>
				<div class="absolute bottom-0 right-0 px-2">...</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	#prompt-screen .grid {
		grid-template-rows: 200px 646px;
		row-gap: 47px;
	}

	:global(.label) {
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

	.header,
	.main {
		width: 1888px;
		margin: 0 auto;
	}

	.header {
		height: 200px;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 20px;
		z-index: 999;

		p {
			color: #fff;
			text-align: center;
			font-size: 60px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}

	.main {
		display: grid;
		grid-template-columns: 808px 240px 808px;
		grid-template-rows: 1fr;
		column-gap: 1rem;

		&.opacity-125 {
			opacity: 0.125;
		}

		.col-left,
		.col-right {
			border: 2px solid #6eebea;
			background: #1c1f22;
		}

		.col-mid {
			#prompt-clock {
				width: 245px;
				height: 124px;
				flex-shrink: 0;
				background: #1c1f22;
				padding: 8px 12px 0;
				border: 2px solid #6eebea;
				background: #1c1f22;

				p:nth-child(1) {
					color: #fff;
					text-align: center;
					font-family: 'JetBrains Mono';
					font-size: 24px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
				}

				p:nth-child(2) {
					color: #fff;
					text-align: center;
					font-family: 'JetBrains Mono';
					font-size: 68px;
					font-style: normal;
					font-weight: 400;
					line-height: normal;

					&.completing {
						animation: pulse 0.75s linear infinite;
					}

					&.complete {
						color: #ff3838;
						animation: shakeX 1s linear;
					}
				}
			}

			#player-score {
				height: 124px;
				border: 2px solid #6eebea;
				background: #1c1f22;
				padding: 0 0.75rem;

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
				}
			}
		}

		.footer {
			div {
				width: 260px;
				height: 51px;
				flex-shrink: 0;
				color: #fff;
				text-align: center;
				font-size: 36px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				z-index: 2;
				border: 2px solid #6eebea;
				background-color: #1c1f22;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}

	@keyframes autoscroll {
		0% {
			transform: translateY(0%);
		}
		50%,
		100% {
			transform: translateY(-100%);
		}
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
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
