<script lang="ts">
</script>

<svelte:head>
	<title>Projector - Results</title>
</svelte:head>

<div
	id="prompt-screen"
	class="m-auto flex h-full w-full flex-col justify-between pb-[103px] pt-[117px]"
>
	<div class="grid h-full w-full">
		<div class="main relative">
			<div class="col-left pointer-events-none relative"></div>
			<div class="col-mid flex flex-col items-center justify-between">
				<div id="prompt-prompt" class="flex flex-col items-start overflow-hidden">
					<div class="prompter overflow-hidden">
						<!-- <Autoscroll route="results" innerText={dataPrompt || UNKNOWN} disableScrollbar /> -->
					</div>
					<div class="label h-[16px] w-full">Challenge</div>
				</div>
				{#if !true}
					<div id="prompt-clock" class="mt-[6px] flex flex-col justify-center">
						<p>time remaining:</p>
						<p class="complete">00:00</p>
					</div>
				{:else}
					<div id="prompt-command" class="mt-[6px] flex flex-col justify-center">
						<span class="block w-full text-center">Choose!</span>
					</div>
				{/if}
				<div id="player-score" class="mt-4 w-full self-start">
					<p>current score:</p>
					<p class="flex w-full justify-between">
						<span class="inline-block flex-[33%] flex-grow"></span>
						<span class="inline-block flex-[33%] flex-grow">-</span>
						<span class="inline-block flex-[33%] flex-grow"></span>
					</p>
				</div>
			</div>
			<div class="col-right pointer-events-none relative"></div>
			<div class="footer">
				<div class="player-0 absolute bottom-[2px] left-[2px] px-2">...</div>
				<div class="player-1 absolute bottom-[2px] right-[2px] px-2">...</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	#prompt-screen .grid {
		grid-template-rows: 860px;
	}

	#prompt-overlay {
		.row {
			transform: translateY(-5px);
			column-gap: 25px;

			.player {
				width: 580px;
				height: 156px;
				border: 2px solid #6eebea;
				background: #1c1f22;
				color: #fff;
				text-align: center;
				font-size: 80px;
				font-style: normal;
				font-weight: 700;
				line-height: normal;

				span {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	#player-score {
		height: 124px;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 0 0.75rem;

		// .col-mid
		&.mid-overlay {
			opacity: 100;
			z-index: 999;
			transition: translate 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);

			&.translate-a {
				translate: 0 -62px;
			}

			&.translate-b {
				translate: 0 -109px;
			}
		}

		&.overlay {
			width: 440px;
			height: 230px;
			flex-shrink: 0;

			&.score {
				animation-name: pulse;
				animation-duration: 0.75s;
				animation-timing-function: ease-in-out;
				animation-delay: 2.675s;
			}

			p:nth-child(1) {
				color: #fff;
				text-align: center;
				font-size: 44.129px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}

			p:nth-child(2) {
				color: #fff;
				text-align: center;
				font-size: 125.032px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}

		&:not(.overlay) {
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

	.label {
		border-top: 2px solid #6eebea;
		color: #fff;
		text-align: center;
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		background-color: #1c1f22;
		z-index: 2;
	}

	.counter-p-1 {
		color: #6eebea;
		text-align: center;
		font-size: 75px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	.counter-p-2 {
		color: #fff;
		text-align: center;
		font-size: 247.95px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
	}

	.main {
		display: grid;
		width: 1888px;
		margin: 0 auto;
		grid-template-columns: 808px 240px 808px;
		grid-template-rows: 1fr;
		column-gap: 1rem;

		.col-left,
		.col-right {
			border: 2px solid #6eebea;
			background: #1c1f22;
			padding: 0.5rem;

			.loader {
				scale: 1;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.col-mid {
			#prompt-prompt {
				border: 2px solid #6eebea;
				background: #1c1f22;
				width: 240px;
				height: 260px;
				display: grid;
				grid-template-rows: auto 51px;

				.prompter {
					max-height: 202px;
				}

				.prompter,
				.label {
					max-width: 240px;
				}
			}
			#prompt-clock,
			#prompt-command {
				width: 245px;
				height: 124px;
				flex-shrink: 0;
				background: #1c1f22;
				padding: 8px 12px 0;
				border: 2px solid #6eebea;
				background: #1c1f22;
			}
			#prompt-command {
				align-items: center;
				color: #fff;
				font-size: 54px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				padding: 26px 4px 27px 9px;
			}
			#prompt-clock {
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

					&.complete {
						color: #ff3838;
					}
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
				z-index: 0;
				background-color: #1c1f22;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				&.player-0 {
					border-top: 2px solid #6eebea;
					border-right: 2px solid #6eebea;
				}

				&.player-1 {
					border-top: 2px solid #6eebea;
					border-left: 2px solid #6eebea;
				}
			}
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

	@keyframes heartBeat {
		0% {
			transform: scale(1);
		}

		14% {
			transform: scale(1.3);
		}

		28% {
			transform: scale(1);
		}

		42% {
			transform: scale(1.3);
		}

		70% {
			transform: scale(1);
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
</style>
