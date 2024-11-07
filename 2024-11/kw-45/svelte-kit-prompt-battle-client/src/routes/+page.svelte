<script lang="ts">
	import { PUBLIC_ID } from '$env/static/public';
	import useSocket from '$lib/socket';

	const io = useSocket();

	$effect(() => {
		io.on('connect', () => {
			console.log('Connected');
			io.emit('c:join', PUBLIC_ID);
		});

		io.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			io?.removeAllListeners();
		};
	});
</script>

<svelte:head>
	<title>/</title>
</svelte:head>

<div class="m-auto w-full max-w-[1419px]">
	<h1 class="w-full text-center font-thin uppercase">
		<span class="font-bold">Prompt</span>Battle
	</h1>
	<section id="terminal" class="p-2">
		<p>/Player 0 &gt; ./Prompt_Battle</p>
		<p>Prompt_Battle loading...</p>
		<p>Loading complete!</p>
		<p class="mt-16">Enter your name!</p>
		<div id="terminal-input" class="relative mt-16">
			<label>
				<span>/Player 0 &gt;</span>
				<input type="text" name="player" maxlength="20" autocomplete="off" autocorrect="off" />
			</label>
		</div>
	</section>
</div>

<style lang="scss">
	h1 {
		font-size: clamp(4rem, 12vw, 170px);
	}

	#terminal {
		border: 2px solid #6eebea;
		background-color: #1c1f22;
		animation: slide-in-up 1s ease;
		will-change: transform;

		p,
		label {
			color: #6eebea;
			font-family: 'JetBrains Mono';
			font-size: 50px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}

	#terminal-input {
		input {
			position: relative;
			color: #fff;
			background-color: transparent;
			font-family: 'JetBrains Mono';
			font-size: 50px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			outline: none;
			caret-color: transparent;

			&:focus {
				outline: red !important;
			}

			&::after {
				content: '|';
				animation: blink 1s infinite;
			}

			&:focus {
				outline: none;
			}
		}

		&:not(.changed)::after {
			content: '';
			position: absolute;
			top: 0;
			left: calc(22.5rem + var(--offset, 0px));
			display: inline-block;
			background-color: #fff;
			vertical-align: top;
			width: 27.5px;
			height: 66px;
			-webkit-animation: blink 1s step-end infinite;
			animation: blink 1s step-end infinite;
			border: none;
		}
	}

	#terminal-indicator {
		&.blink {
			animation: blink 1s infinite;
		}
		&.ellipsis::after {
			content: '';
			animation: ellipsis 3s infinite 1s;
		}
	}

	@keyframes ellipsis {
		0% {
			content: '';
		}
		33% {
			content: '.';
		}
		66% {
			content: '..';
		}
		100% {
			content: '...';
		}
	}

	@keyframes slide-in-up {
		0% {
			transform: translateY(-5rem);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
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
