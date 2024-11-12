<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_TYPE_ADMIN } from '$env/static/public';
	import useSocket from '$lib/socket';

	const socket = useSocket('ADMIN');

	let strPlayerName0 = $state('');
	let boolIsPlayer0Ready = $state(false);
	let strPlayerName1 = $state('');
	let boolIsPlayer1Ready = $state(false);
	let strMode = $state<undefined | string>(undefined);
	let boolIsStarting = $state(false);

	$effect(() => {
		// RESET event
		if ($page.url.searchParams.get('reload') !== null) {
			const cleanUrl = new URL($page.url);
			cleanUrl.search = '';

			// Invoke a clean URL without the reload query
			replaceState(cleanUrl, $page.state);

			setTimeout(() => {
				(window || globalThis).location.reload();
			}, 1000);

			return;
		}

		socket.on('connect', () => {
			socket.emit('c:joinLobby', PUBLIC_TYPE_ADMIN);
			$page.url.searchParams.set('uuid', socket.id!);
			$page.url.searchParams.delete('mode');

			goto(`?${$page.url.searchParams.toString()}`, { replaceState: true });
		});

		socket.on('s:setPlayerNames', ({ player0, player1 }) => {
			strPlayerName0 = player0;
			strPlayerName1 = player1;
		});

		socket.on('s:setPlayerReadiness', (id) => {
			if (id == '0') boolIsPlayer0Ready = true;
			if (id == '1') boolIsPlayer1Ready = true;
		});

		socket.on('s:start', () => {
			boolIsStarting = true;
		});

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			socket.off('connect');
			socket.off('s:setPlayerNames');
			socket.off('s:setPlayerReadiness');
			socket.off('s:start');
			socket.off('disconnect');
		};
	});

	$effect(() => {
		if (boolIsStarting && strMode) {
			setTimeout(() => {
				goto(`admin?${$page.url.searchParams.toString()}`, { replaceState: true });
			}, 2000);
		}
	});

	function handleClick(e: MouseEvent) {
		const dataset = (e.currentTarget as HTMLButtonElement).dataset!;
		strMode = dataset.mode!;
		$page.url.searchParams.set('mode', strMode);
		goto(`?${$page.url.searchParams.toString()}`, { replaceState: true });

		socket.emit('a:setMode', strMode);
	}
</script>

<svelte:head>
	<title>Server</title>
</svelte:head>

<div class="m-auto flex h-full w-full flex-col justify-between pb-[42px] pt-[61px]">
	<div class="top">
		<h1 class="relative w-full text-center font-thin uppercase">
			<span class="font-bold opacity-0">Prompt</span><span class="opacity-0">Battle</span>
			<img
				class="absolute left-1/2 top-1/3 h-auto w-[1331px] -translate-x-1/2 -translate-y-1/2"
				src="/png/PromptBattle.png"
				alt="PromptBattle"
			/>
		</h1>
		<div class="players flex w-full items-center gap-[75px] px-[181px]">
			<div id="player-0" class="player py-[25px]">
				<span class="relative px-4" class:ready={boolIsPlayer0Ready}>{strPlayerName0}</span>
			</div>
			<div class="vs">vs</div>
			<div id="player-1" class="player py-[25px]">
				<span class="relative px-4" class:ready={boolIsPlayer1Ready}>{strPlayerName1}</span>
			</div>
		</div>
	</div>

	<div class="bottom flex flex-col items-center gap-[28px]">
		<button
			class="link-button flex flex-col"
			class:opacity-30={strMode && strMode === 'ps'}
			data-mode="p"
			disabled={!boolIsPlayer0Ready || !boolIsPlayer1Ready}
			onclick={handleClick}
		>
			<div class="mt-[8px] flex flex-col items-center">
				<span class="text">start</span>
				<span class="text-addition">(Prompt only)</span>
			</div>
		</button>
		<button
			class="link-button flex flex-col"
			class:opacity-30={strMode && strMode === 'p'}
			data-mode="ps"
			disabled={!boolIsPlayer0Ready || !boolIsPlayer1Ready}
			onclick={handleClick}
		>
			<div class="mt-[8px] flex flex-col items-center">
				<span class="text">start</span>
				<span class="text-addition">(Prompt & Scribble)</span>
			</div>
		</button>
	</div>
</div>

<style lang="scss">
	h1 {
		color: #fff;
		font-size: 170px;
		font-style: normal;
		line-height: normal;
	}

	.vs {
		color: #fff;
		text-align: center;
		font-family: 'JetBrains Mono';
		font-size: 80px;
		font-style: normal;
		font-weight: 300;
		line-height: normal;
		width: 248px;
	}

	.player {
		display: flex;
		width: 580px;
		height: 156px;
		justify-content: center;
		align-items: flex-start;
		border: 2px solid #9c9c9c;
		background: #1c1f22;

		&:has(span.ready) {
			border: 2px solid rgb(68, 216, 68);
			background-color: hsl(120, 57%, 12%);
		}

		span {
			color: #fff;
			text-align: center;
			font-family: 'JetBrains Mono';
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			// min-width: 1px;
			// height: 106px;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: pre;

			&:not(.ready)::after {
				content: '';
				position: absolute;
				right: 0;
				display: inline-block;
				background-color: #fff;
				vertical-align: top;
				width: 4px;
				height: 106px;
				-webkit-animation: blink 1s ease-in-out infinite;
				animation: blink 1s ease-in-out infinite;
				border: none;
				translate: -0.25rem 0;
			}
		}
	}

	button {
		all: unset;
	}

	button:disabled {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.3;
	}

	.link-button {
		width: 774px;
		height: 200px;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 1px 0 0.5rem;

		&.opacity-30 {
			opacity: 0.3;
		}

		.text {
			color: #6eebea;
			text-align: center;
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}

		.text-addition {
			color: #6eebea;
			font-size: 50px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
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
