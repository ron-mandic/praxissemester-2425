<script lang="ts">
</script>

<svelte:head>
	<title>Prompt</title>
</svelte:head>

<div id="prompt" class="relative">
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<textarea id="prompt-area" name="prompt" class="relative h-full w-full p-6 focus:outline-none" />
	<div id="prompt-footer" class="flex items-end justify-between">
		<div id="prompt-clock" class="flex flex-col justify-center">
			<p>time remaining:</p>
			<p>...</p>
		</div>
		<p id="prompt-length" class="flex h-[51px] items-center"></p>
		<div id="prompter" class="px-2">...</div>
	</div>
</div>

<style lang="scss">
	#prompt {
		width: 1856px;
		height: 940px;
		border: 2px solid #6eebea;

		&::after {
			content: attr(data-prompt);
			position: absolute;
			top: 50%;
			left: 50%;
			width: 90%;
			transform: translate(-50%, -50%);
			color: rgba(255, 255, 255, 0.125);
			text-align: center;
			font-size: 4rem;
			font-style: normal;
			font-weight: 800;
			line-height: normal;
			text-wrap: balance;
			z-index: -1;
		}
	}

	#prompt-area {
		background-color: transparent;
		color: #6eebea;
		font-family: 'JetBrains Mono';
		font-size: 62px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		resize: none;

		&::-webkit-scrollbar {
			width: 10px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: #6eebea;
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
				animation: pulse 1s linear infinite;
			}

			&.complete {
				color: #ff3838;
				animation: shakeX 1s linear;
			}
		}
	}

	#prompt-length {
		color: #6eebea;
		font-size: 1.25rem;

		&.full {
			animation: shakeX 1s ease;
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
		font-family: 'JetBrains Mono';
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background-color: #1c1f22;
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
