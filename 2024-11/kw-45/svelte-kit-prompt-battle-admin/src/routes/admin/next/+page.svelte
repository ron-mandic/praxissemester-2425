<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { UNKNOWN } from '$lib';
	import useSocket from '$lib/socket';
	import { Socket, io } from 'socket.io-client';
	import { onMount } from 'svelte';

	const socket = useSocket('ADMIN');

	let player0: string;
	let player0Score: string;
	let player1: string;
	let player1Score: string;

	let message: string | undefined;
	let hasDisabledClick = true;

	onMount(() => {
		socket.on('connect', () => {
			socket
				.emit('c:initClient', 'ADMIN')
				.emit('a:requestEvent', 's:sendBattleData')
				.emit('a:requestEvent', 's:prepareNextRound');
		});
		socket.on('s:setPlayerNames', ({ playerName0, playerName1 }) => {
			player0 = playerName0;
			player1 = playerName1;
		});
		socket.on(
			's:sendBattleData',
			({ player0Score: _player0Score, player1Score: _player1Score }) => {
				player0Score = _player0Score;
				player1Score = _player1Score;
			}
		);
		socket.on('s:prepareNextRound', (_message) => {
			message = _message;
			console.log(message);
		});
		socket.on('s:sendAdminReadiness', () => {
			hasDisabledClick = false;
		});

		return () => {
			message = undefined;
			hasDisabledClick = true;
			socket.disconnect();
		};
	});

	function handleButtonClick() {
		setTimeout(() => {
			// for the admin
			switch (message) {
				case 'round=current': {
					goto(`/admin?${$page.url.searchParams.toString()}`);
					break;
				}
				case 'round=new': {
					goto('/');
					break;
				}
				default:
					break;
			}
		}, 4000);

		// for the client, redirected by the server
		socket.emit('a:prepareNextRound', message);

		// for the projector, redirected by the server
		socket.emit('a:prepareNextRoundProjector', message);
	}
</script>

<svelte:head>
	<title>Admin - Next round</title>
</svelte:head>

<div class="relative m-auto flex h-full w-full flex-col justify-between pb-[42px] pt-[61px]">
	<div class="top flex flex-col justify-between">
		<div class="players flex w-full items-center gap-[75px] px-[181px]">
			<div id="player-0">
				<div class="player relative py-[25px]">
					<span class="relative">...</span>
				</div>
			</div>
			<div id="player-score" class="mt-4 w-full self-start">
				<p>current score:</p>
				<p class="flex w-full justify-between">
					<span class="inline-block flex-[33%] flex-grow"
						>{player0Score === undefined ? UNKNOWN : player0Score}</span
					>
					<span class="inline-block flex-[33%] flex-grow">-</span>
					<span class="inline-block flex-[33%] flex-grow"
						>{player1Score === undefined ? UNKNOWN : player1Score}</span
					>
				</p>
			</div>
			<div id="player-1">
				<div class="player relative py-[25px]">
					<span class="relative">...</span>
				</div>
			</div>
		</div>
		<div class="mt-[181px] flex h-auto w-full justify-center">
			<button
				class="link-button flex flex-col"
				class:disabled={hasDisabledClick}
				on:click={handleButtonClick}
			>
				<div class="mt-[8px] flex flex-col items-center">
					<span class="text">start</span>
					<span class="text-addition">(Next round)</span>
				</div>
			</button>
		</div>
	</div>

	<div class="bottom flex flex-col items-center gap-[28px]"></div>

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
			font-family: 'JetBrains Mono';
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			// min-width: 1px;
			// height: 106px;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	button {
		all: unset;
	}

	button.disabled {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.3;
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

	.link-button {
		width: 774px;
		height: 200px;
		border: 2px solid #6eebea;
		background: #1c1f22;
		padding: 1px 0 0.5rem;

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
