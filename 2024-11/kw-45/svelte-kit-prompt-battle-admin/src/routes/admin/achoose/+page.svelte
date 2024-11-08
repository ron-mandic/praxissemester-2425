<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Socket, io } from 'socket.io-client';
	import IconCheck from '../../../components/IconCheck.svelte';
	import { onMount } from 'svelte';
	import { UNKNOWN } from '$lib';
	import useSocket from '$lib/socket';

	const socket = useSocket('ADMIN');

	let player0: string;
	let player0Score: string;
	let player1: string;
	let player1Score: string;

	let dataGUUID: string;
	let mode: string;
	let srcImageA: string | undefined;
	let srcImageB: string | undefined;

	let haveChosen = false;

	$effect(() => {
		mode = $page.url.searchParams.get('mode')!;

		socket.on('connect', () => {
			socket
				.emit('c:initClient', 'ADMIN')
				.emit('a:requestEvent', 's:sendBattleData')
				.emit('a:requestEvent', 's:sendImage/results');
		});
		socket.on('s:setPlayerNames', ({ playerName0, playerName1 }) => {
			player0 = playerName0;
			player1 = playerName1;
		});
		socket.on(
			's:sendBattleData',
			({ player0Score: _player0Score, player1Score: _player1Score, guuid }) => {
				player0Score = _player0Score;
				player1Score = _player1Score;
				dataGUUID = guuid;
			}
		);
		socket.on('s:sendImage/results', ({ player0Image, player1Image }) => {
			srcImageA = 'data:image/png;base64,' + player0Image;
			srcImageB = 'data:image/png;base64,' + player1Image;
		});

		return () => {
			// TODO: Reset all variables or just keep it as is? Or in onDestroy()?
			// srcImageA = undefined;
			// srcImageB = undefined;
			// haveChosen = false;
			socket.disconnect();
		};
	});

	function handleButtonA(e: MouseEvent) {
		if (haveChosen) return;

		const target = e.currentTarget! as HTMLDivElement;
		target.dataset!.status = 'yes';
		haveChosen = true;

		socket.emit('a:sendBattleData/admin/achoose', {
			player0Score: (+player0Score + 1).toString(),
			player1Score
		});
		socket.emit('a:sendImageChoice', '1');
		player0Score = (+player0Score + 1).toString();

		setTimeout(() => {
			goto(`/admin/next?${$page.url.searchParams.toString()}`); // ...&guuid=g-...
		}, 0); // 2000
	}

	function handleButtonB(e: MouseEvent) {
		if (haveChosen) return;

		const target = e.currentTarget! as HTMLDivElement;
		target.dataset!.status = 'yes';
		haveChosen = true;

		socket.emit('a:sendBattleData/admin/achoose', {
			player0Score,
			player1Score: (+player1Score + 1).toString()
		});
		socket.emit('a:sendImageChoice', '2');
		player1Score = (+player1Score + 1).toString();

		setTimeout(() => {
			goto(`/admin/next?${$page.url.searchParams.toString()}`); // ...&guuid=g-...
		}, 0); // 2000
	}
</script>

<svelte:head>
	<title>Admin - Audience chooses</title>
</svelte:head>

<div class="relative m-auto flex h-full w-full flex-col justify-between pb-[42px] pt-[61px]">
	<div class="top flex flex-col justify-start">
		<div class="players flex w-full items-center gap-[75px] px-[181px]">
			<div id="player-0">
				<div class="player relative py-[25px]">
					<span class="relative px-4">...</span>
					<div class="absolute -left-24 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<IconCheck />
					</div>
				</div>
				<div class="image-container mt-8 flex h-[420px] w-full items-center justify-center">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="image" data-status="no" onclick={handleButtonA}>
						<img width="378" height="378" src={srcImageA} alt="" />
					</div>
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
					<span class="relative px-4">...</span>
					<div class="absolute -right-24 top-1/2 -translate-y-1/2 translate-x-1/2">
						<IconCheck />
					</div>
				</div>
				<div class="image-container mt-8 flex h-[420px] w-full items-center justify-center">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="image" data-status="no" onclick={handleButtonB}>
						<img width="378" height="378" src={srcImageB} alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if !haveChosen}
		<p id="system-status" class="absolute bottom-[174px] w-full text-center">
			Audience is choosing
		</p>
	{:else}
		<p id="system-status" class="chosen absolute bottom-[174px] w-full text-center">
			Audience has chosen
		</p>
	{/if}

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

		&.chosen::after {
			content: '!';
			animation: none;
		}
	}

	.image-container {
		display: flex;
		flex-shrink: 0;

		.image {
			width: 420px;
			height: 420px;
			padding: 21px;
			aspect-ratio: 1/1;
			background: #1c1f22;
			border: 2px solid #6eebea;
			transition: opacity 0.3s ease-in-out;

			&[data-status='yes'] {
				border: 8px solid #6eebea;
			}
			&[data-status='no'] {
				opacity: 0.3;
				transition: opacity 1s ease-in-out;
			}
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
