<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import useSocket from '$lib/socket';
	import type { Socket } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';

	const socket = useSocket('PROJECTOR');

	let strPlayerName0 = $state('');
	let boolIsPlayer0Ready = $state(false);
	let strPlayerName1 = $state('');
	let boolIsPlayer1Ready = $state(false);
	let strMode = $state('');
	let boolIsStarting = $state(false);

	onMount(() => {
		socket.on('connect', () => {
			socket.emit('c:joinLobby', 'PROJECTOR');

			$page.url.searchParams.set('uuid', socket.id!);
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

		socket.on('s:setMode', (mode) => {
			strMode = mode;
			$page.url.searchParams.set('mode', strMode);
			goto(`?${$page.url.searchParams.toString()}`);
		});

		socket.on('s:start', () => {
			boolIsStarting = true;
		});

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		return async () => {
			socket.off('connect');
			socket.off('s:setPlayerNames');
			socket.off('s:setPlayerReadiness');
			socket.off('s:setMode');
			socket.off('s:start');
			socket.off('disconnect');
		};
	});

	$effect(() => {
		if (boolIsStarting && strMode) {
			goto(`projector/prompt?${$page.url.searchParams.toString()}`, { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Projector - Main page</title>
</svelte:head>

<div class="m-auto flex h-full w-full flex-col justify-between pb-[42px] pt-[61px]">
	<div class="top flex h-screen flex-col justify-center">
		<h1 class="w-full text-center font-thin uppercase">
			<span class="font-bold">Prompt</span>Battle
		</h1>
		<div class="players flex w-full items-center gap-[75px] px-[181px]">
			<div id="player-0" class="player py-[25px]">
				<span class="relative px-4" class:ready={boolIsPlayer0Ready}>{strPlayerName0 || ''}</span>
			</div>
			<div class="vs">vs</div>
			<div id="player-1" class="player py-[25px]">
				<span class="relative px-4" class:ready={boolIsPlayer1Ready}>{strPlayerName1 || ''}</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.top {
		margin-top: -148px;
	}

	h1 {
		color: #fff;
		font-size: 170px;
		font-style: normal;
		line-height: 1;
		margin-bottom: 107px;
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
				translate: -0.5rem 0;
			}
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
