<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { UNKNOWN } from '$lib';
	import useSocket from '$lib/socket';
	import { onMount } from 'svelte';

	const socket = useSocket('ADMIN');

	let strPlayerName0 = $state('');
	let numPlayerScore0 = $state(0);
	let boolIsPlayer0Ready = $state(false);
	let strPlayerName1 = $state('');
	let numPlayerScore1 = $state(0);
	let boolIsPlayer1Ready = $state(false);

	let boolHasStarted = $state(false);
	let strMode = $state<undefined | string>(undefined);
	let strLabel = $state('Players will start soon');

	onMount(() => {
		if (!strMode) {
			strMode = $page.url.searchParams.get('mode')!;
		}

		if (socket.connected) {
			socket.emit('acp:getBattleData');
		}

		socket.on('s:getBattleData', (battle) => {
			strPlayerName0 = battle['0'].name;
			numPlayerScore0 = battle['0'].score;
			numPlayerScore1 = battle['1'].score;
			strPlayerName1 = battle['1'].name;
		});

		socket.on('s:sendRoute/prompt', (mode) => {
			// Make sure to obtan a valid copy of the mode
			strMode = strMode || mode;

			switch (strMode) {
				case 'p': {
					goto(`/admin/pchoose?${$page.url.searchParams.toString()}`, { replaceState: true });
					break;
				}
				case 'ps': {
					strLabel = 'Players are scribbling';
					break;
				}
				default: {
					console.warn('Invalid mode:', strMode);
					break;
				}
			}
		});

		socket.on('s:sendRoute/scribble', () => {
			goto(`/admin/pchoose?${$page.url.searchParams.toString()}`, { replaceState: true });
		});

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		setTimeout(() => {
			strLabel = 'Players are prompting';
		}, 16500); // 15 seconds + animation duration

		return () => {
			socket.off('s:getBattleData');
			socket.off('s:sendRoute/prompt');
			socket.off('s:sendRoute/scribble');
			socket.off('disconnect');
		};
	});
</script>

<svelte:head>
	<title>Admin - Main page</title>
</svelte:head>

<div class="relative m-auto flex h-full w-full flex-col justify-between pb-[42px] pt-[61px]">
	<div class="top flex flex-col items-start">
		<div class="players flex w-full items-center gap-[75px] px-[181px]">
			<div id="player-0" class="player py-[25px]">
				<span class="relative overflow-hidden text-ellipsis whitespace-nowrap px-4"
					>{strPlayerName0}</span
				>
			</div>
			<div id="player-score" class="w-full">
				<p>current score:</p>
				<p class="flex w-full justify-between">
					<span class="inline-block flex-[33%] flex-grow"
						>{numPlayerScore0 === undefined ? UNKNOWN : numPlayerScore0}</span
					>
					<span class="inline-block flex-[33%] flex-grow">-</span>
					<span class="inline-block flex-[33%] flex-grow"
						>{numPlayerScore1 === undefined ? UNKNOWN : numPlayerScore1}</span
					>
				</p>
			</div>
			<div id="player-1" class="player py-[25px]">
				<span class="relative overflow-hidden text-ellipsis whitespace-nowrap px-4"
					>{strPlayerName1}</span
				>
			</div>
		</div>
	</div>

	<p id="system-status" class="absolute bottom-[174px] w-full text-center">{strLabel}</p>

	<div class="footer absolute bottom-0 flex w-full items-center justify-between">
		<button id="btn-restart">restart round</button>
		<button id="btn-quit">force quit</button>
	</div>
</div>

<style lang="scss">
	.player {
		display: flex;
		width: 580px;
		height: 156px;
		justify-content: center;
		align-items: flex-start;
		border: 2px solid #9c9c9c;
		background: #1c1f22;

		span {
			color: #fff;
			text-align: center;
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			// min-width: 1px;
			// height: 106px;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: pre;
		}
	}

	#player-score {
		width: 250px;
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

	#system-status {
		color: #fff;
		text-align: center;
		font-size: 80px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;

		&::after {
			content: '.';
			animation: loading 6s infinite ease-in-out;
			display: inline-block;
		}
	}

	.footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 23px 42px;

		button {
			background: #1c1f22;
			text-align: center;
			font-size: 43.33px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			padding: 11.214px 16.544px 11.786px 16.456px;
		}

		#btn-restart {
			color: #ffe500;
			border: 1.083px solid #ffe500;
		}

		#btn-quit {
			color: #f00;
			border: 1.083px solid #f00;
		}
	}

	@keyframes loading {
		0%,
		100% {
			content: '';
		}
		25% {
			content: '.';
		}
		50% {
			content: '..';
		}
		75% {
			content: '...';
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
