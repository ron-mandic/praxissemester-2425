<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconCheck from '../../../components/IconCheck.svelte';
	import { onMount } from 'svelte';
	import { SOCKET_SERVER_URL, UNKNOWN } from '$lib';
	import useSocket from '$lib/socket';

	const socket = useSocket('ADMIN');

	let strPlayerName0 = $state('');
	let numPlayerScore0 = $state('');
	let strPlayerName1 = $state('');
	let numPlayerScore1 = $state('');

	let strMode = $state('');
	let strDataURI0 = $state<undefined | string>();
	let strDataURI1 = $state<undefined | string>();

	let boolHaveChosen = $state(false);

	onMount(() => {
		if (!strMode) {
			strMode = $page.url.searchParams.get('mode')!;
		}

		if (socket.connected) {
			// Cannot load images via WS due to 431 (Request Header Fields Too Large)
			socket.emit('acp:getBattleData');
		}

		socket.on('s:getBattleData', (battle) => {
			strPlayerName0 = battle['0'].name;
			numPlayerScore0 = battle['0'].score;
			strPlayerName1 = battle['1'].name;
			numPlayerScore1 = battle['1'].score;
		});

		return () => {
			strDataURI0 = undefined;
			strDataURI1 = undefined;
			boolHaveChosen = false;

			socket.off('s:getBattleData');
		};
	});

	function handleButton(e: MouseEvent) {
		if (boolHaveChosen) return;
		boolHaveChosen = true;

		const target = e.currentTarget! as HTMLDivElement;
		// Change the opacity of the image
		target.dataset!.status = 'yes';
		// Extract the id of the image
		const id = target.dataset!.id!;

		// Update the score (only locally)
		if (id == '0') {
			numPlayerScore0 += 1;
		} else {
			numPlayerScore1 += 1;
		}

		socket.emit('a:updateBattle', id);

		setTimeout(() => {
			goto(`/admin/next?${$page.url.searchParams.toString()}`, { replaceState: true }); // ...&guuid=g-...
		}, 4500); // 2000
	}

	function handleButtonReset() {
		socket.emit('a:RESET');
		goto('/?reload=true', { replaceState: true });
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
					<span class="relative overflow-hidden text-ellipsis whitespace-nowrap px-4"
						>{strPlayerName0 || UNKNOWN}</span
					>
					<div class="absolute -left-24 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<IconCheck />
					</div>
				</div>
				<div class="image-container mt-8 flex h-[420px] w-full items-center justify-center">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="image" data-status="no" data-id="0" onclick={handleButton}>
						<img width="378" height="378" src={SOCKET_SERVER_URL + '/image/0'} alt="" />
					</div>
				</div>
			</div>
			<div id="player-score" class="mt-4 w-full self-start">
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
			<div id="player-1">
				<div class="player relative py-[25px]">
					<span class="relative overflow-hidden text-ellipsis whitespace-nowrap px-4"
						>{strPlayerName1 || UNKNOWN}</span
					>
					<div class="absolute -right-24 top-1/2 -translate-y-1/2 translate-x-1/2">
						<IconCheck />
					</div>
				</div>
				<div class="image-container mt-8 flex h-[420px] w-full items-center justify-center">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="image" data-status="no" data-id="1" onclick={handleButton}>
						<img width="378" height="378" src={SOCKET_SERVER_URL + '/image/1'} alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if !boolHaveChosen}
		<p id="system-status" class="absolute bottom-[174px] w-full text-center">
			Audience is choosing
		</p>
	{:else}
		<p id="system-status" class="chosen absolute bottom-[174px] w-full text-center">
			Audience has chosen
		</p>
	{/if}

	<div class="footer absolute bottom-0 flex w-full items-center justify-between">
		<button id="btn-restart" disabled>restart round</button>
		<button id="btn-reset" onclick={handleButtonReset}>reset battle</button>
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

		#btn-reset {
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
