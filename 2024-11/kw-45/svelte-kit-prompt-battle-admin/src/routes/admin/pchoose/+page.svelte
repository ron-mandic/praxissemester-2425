<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import ImageThumbnail from '../../../components/ImageThumbnail.svelte';
	import IconCross from '../../../components/IconCross.svelte';
	import IconCheck from '../../../components/IconCheck.svelte';
	import { UNKNOWN } from '$lib';
	import useSocket from '$lib/socket';
	import { onMount } from 'svelte';

	const socket = useSocket('ADMIN');

	let strPlayerName0 = $state('');
	let numPlayerScore0 = $state('');
	let strPlayerNumber0 = $state<undefined | string>();
	let strImageIndex0 = $state<undefined | string>();

	let strPlayerName1 = $state('');
	let numPlayerScore1 = $state('');
	let strPlayerNumber1 = $state<undefined | string>();
	let strImageIndex1 = $state<undefined | string>();

	let strMode = $state('');
	let boolHasChosen0 = $state(false);
	let boolHasChosen1 = $state(false);

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
			strPlayerName1 = battle['1'].name;
			numPlayerScore1 = battle['1'].score;
		});

		socket.on('s:sendImage/pchoose', ({ id, index }) => {
			if (id == '0') {
				strPlayerNumber0 = id;
				strImageIndex0 = index;
				boolHasChosen0 = true;
			}
			if (id == '1') {
				strPlayerNumber1 = id;
				strImageIndex1 = index;
				boolHasChosen1 = true;
			}
		});

		return () => {
			socket.off('s:getBattleData');
			socket.off('s:sendImage/pchoose');
		};
	});

	$effect(() => {
		if (boolHasChosen0 && boolHasChosen1) {
			setTimeout(() => {
				goto(`/admin/achoose?${$page.url.searchParams.toString()}`, { replaceState: true }); // ...&guuid=g-...
			}, 2500); // 1000
		}
	});
</script>

<svelte:head>
	<title>Admin - Players choose</title>
</svelte:head>

<div class="relative m-auto flex h-full w-full flex-col justify-between pb-[42px] pt-[61px]">
	<div class="top flex flex-col justify-start">
		<div class="players flex w-full items-center gap-[75px] px-[181px]">
			<div id="player-0">
				<div class="player relative py-[25px]">
					<span class="relative px-4">{strPlayerName0 || UNKNOWN}</span>
					{#if boolHasChosen0}
						<div
							class="absolute -left-24 top-1/2 -translate-x-1/2 -translate-y-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCheck />
						</div>
					{:else}
						<div
							class="absolute -left-24 top-1/2 -translate-x-1/2 -translate-y-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCross />
						</div>
					{/if}
				</div>
				<div class="image-thumbnails flex items-center justify-between pt-16">
					<ImageThumbnail
						chosen={strPlayerNumber0 === '0' &&
							strImageIndex0 !== undefined &&
							+strImageIndex0 === 0}
					/>
					<ImageThumbnail
						chosen={strPlayerNumber0 === '0' &&
							strImageIndex0 !== undefined &&
							+strImageIndex0 === 1}
					/>
					<ImageThumbnail
						chosen={strPlayerNumber0 === '0' &&
							strImageIndex0 !== undefined &&
							+strImageIndex0 === 2}
					/>
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
					<span class="relative px-4">{strPlayerName1 || UNKNOWN}</span>
					{#if boolHasChosen1}
						<div
							class="absolute -right-24 top-1/2 -translate-y-1/2 translate-x-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCheck />
						</div>
					{:else}
						<div
							class="absolute -right-24 top-1/2 -translate-y-1/2 translate-x-1/2"
							transition:scale={{
								duration: 500,
								delay: 500,
								opacity: 0,
								start: 0.125,
								easing: quintOut
							}}
						>
							<IconCross />
						</div>
					{/if}
				</div>
				<div class="image-thumbnails flex items-center justify-between pt-16">
					<ImageThumbnail
						chosen={strPlayerNumber1 === '1' &&
							strImageIndex1 !== undefined &&
							+strImageIndex1 === 0}
					/>
					<ImageThumbnail
						chosen={strPlayerNumber1 === '1' &&
							strImageIndex1 !== undefined &&
							+strImageIndex1 === 1}
					/>
					<ImageThumbnail
						chosen={strPlayerNumber1 === '1' &&
							strImageIndex1 !== undefined &&
							+strImageIndex1 === 2}
					/>
				</div>
			</div>
		</div>
	</div>

	<p id="system-status" class="absolute bottom-[174px] w-full text-center">Players are choosing</p>

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
