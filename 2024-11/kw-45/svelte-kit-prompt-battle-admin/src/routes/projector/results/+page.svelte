<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Confetti } from 'svelte-confetti';
	import useSocket from '$lib/socket';
	import Loader from '../../../components/Loader.svelte';
	import Autoscroll from '../../../components/Autoscroll.svelte';
	import { UNKNOWN } from '$lib';
	import Counter from '../../../components/Counter.svelte';
	import { EBannerText } from '$lib/enums';
	import Banner from '../../../components/Banner.svelte';
	import { fly, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	const socket = useSocket('PROJECTOR');

	const MAX_ROUNDS = 3;
	let boolAreChoosing = $state(false);
	let boolIsVotable = $state(false);
	let boolIsRegistered = true;

	let boolShowOverlay = $state(false);
	let boolShowOverlayFinal = $state(false);
	let boolShowNextRound = $state(false);

	let strPlayerName0 = $state('');
	let numPlayerScore0 = $state<undefined | number>();
	let strPlayerImage0 = $state('');
	let boolIsVisible0 = $state(false);

	let strPlayerName1 = $state('');
	let numPlayerScore1 = $state<undefined | number>();
	let strPlayerImage1 = $state('');
	let boolIsVisible1 = $state(false);

	let numImageIndex = $state<null | 0 | 1>(null);

	let strDataPrompt = $state('');
	let numMaxRounds = $state<undefined | number>();
	let strMode = $state('');

	const getWinner = () => {
		if (+numPlayerScore0! > +numPlayerScore1!) {
			return strPlayerName0;
		} else if (+numPlayerScore1! > +numPlayerScore0!) {
			return strPlayerName1;
		}
	};

	onMount(() => {
		if (!strMode) {
			strMode = $page.url.searchParams.get('mode')!;
		}

		if (socket.connected) {
			socket.emit('acp:getBattleData');
		}

		socket.on('s:getBattleData', (battle) => {
			strDataPrompt = battle.challenge;
			strPlayerName0 = battle['0'].name;
			numPlayerScore0 = battle['0'].score;
			strPlayerName1 = battle['1'].name;
			numPlayerScore1 = battle['1'].score;
		});

		socket.on('s:sendImage/results', ({ id, dataURI }) => {
			if (id == '0') {
				strPlayerImage0 = 'data:image/png;base64,' + dataURI;
			}
			if (id == '1') {
				strPlayerImage1 = 'data:image/png;base64,' + dataURI;
			}

			if (strPlayerImage0 && strPlayerImage1) {
				boolIsVotable = true;

				setTimeout(() => {
					boolAreChoosing = true;
					document.querySelectorAll('.marquee').forEach((marquee) => {
						marquee.classList.add('fade');
					});
				}, 1500); // 3500
			}
		});

		socket.on('s:sendImageChoice', (id) => {
			switch (id) {
				case '0': {
					numImageIndex = 0;
					break;
				}
				case '1': {
					numImageIndex = 1;
					break;
				}
				default: {
					break;
				}
			}
		});

		socket.on('s:prepareProjector', (message) => {
			setTimeout(() => {
				switch (message) {
					case 'round=current': {
						goto(`/projector/prompt?${$page.url.searchParams.toString()}`, { replaceState: true });
						break;
					}
					case 'round=new': {
						goto('/projector', { replaceState: true });
						break;
					}
					default:
						break;
				}
			}, 4000);
		});

		return () => {
			numImageIndex = null;
			strPlayerImage0 = '';
			strPlayerImage1 = '';

			socket.off('s:getBattleData');
			socket.off('s:sendImage/results');
			socket.off('s:sendImageChoice');
			socket.off('s:prepareProjector');
		};
	});

	$effect(() => {
		if (strPlayerImage0 && numImageIndex === 0 && !boolIsVisible0) {
			setTimeout(() => {
				boolIsVisible0 = true;
				setTimeout(() => {
					boolShowOverlay = true;
					setTimeout(() => {
						numPlayerScore0 = +numPlayerScore0! + 1;
					}, 3000);
				}, 3000);
			}, 3000);
		}

		if (strPlayerImage1 && numImageIndex === 1 && !boolIsVisible1) {
			setTimeout(() => {
				boolIsVisible1 = true;
				setTimeout(() => {
					boolShowOverlay = true;
					setTimeout(() => {
						numPlayerScore1 = +numPlayerScore1! + 1;
					}, 3000);
				}, 3000);
			}, 3000);
		}
	});

	$effect(() => {
		if (boolShowOverlay) {
			setTimeout(() => {
				let isDecided = +numPlayerScore0! + +numPlayerScore1! === numMaxRounds;

				if (isDecided) {
					boolShowOverlayFinal = true;
					setTimeout(() => {
						boolShowNextRound = true;
					}, 6000);
				} else {
					setTimeout(() => {
						boolShowNextRound = true;
					}, 3000);
				}
			}, 6000);
		}
	});

	$effect(() => {
		if (boolShowNextRound) socket.emit('p:sendAdminReadiness');
	});
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
			<div
				class="col-left pointer-events-none relative"
				class:opacity-30={numImageIndex === 1 && !boolShowOverlay}
				class:opacity-0={numImageIndex === 1 && boolShowOverlay}
			>
				{#if !strPlayerImage0}
					<div class="loader absolute">
						<Loader />
					</div>
				{:else}
					<img src={strPlayerImage0} width="792" height="792" alt="792" />
					{#if boolIsVisible0}
						<div
							class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						>
							<Confetti
								x={[-3, 3]}
								y={[-5, 5]}
								xSpread={0.25}
								size={30}
								duration={3500}
								amount={250}
								fallDistance="400px"
								colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
							/>
						</div>
					{/if}
				{/if}
			</div>
			<div class="col-mid flex flex-col items-center justify-between">
				<div
					id="prompt-prompt"
					class="flex flex-col items-start overflow-hidden"
					class:opacity-0={numImageIndex !== null}
				>
					<div class="prompter overflow-hidden">
						<Autoscroll route="results" innerText={strDataPrompt || UNKNOWN} disableScrollbar />
					</div>
					<div class="label h-[16px] w-full">Challenge</div>
				</div>
				{#if !boolAreChoosing}
					<div
						id="prompt-clock"
						class="mt-[6px] flex flex-col justify-center"
						class:opacity-0={numImageIndex !== null}
					>
						<p>time remaining:</p>
						<p>--:--</p>
					</div>
				{:else}
					<div
						id="prompt-command"
						class="mt-[6px] flex flex-col justify-center"
						class:opacity-0={numImageIndex !== null}
					>
						<span class="block w-full text-center">Choose!</span>
					</div>
				{/if}
				<div
					id="player-score"
					class="mt-4 w-full self-start"
					class:opacity-30={numImageIndex !== null && !boolShowOverlay}
					class:opacity-0={numImageIndex !== null && boolShowOverlay}
					class:translate-a={numImageIndex !== null &&
						boolShowOverlay &&
						boolShowOverlayFinal &&
						!boolShowNextRound}
					class:translate-b={numImageIndex !== null && boolShowOverlay && boolShowNextRound}
					class:mid-overlay={numImageIndex !== null &&
						boolShowOverlay &&
						(boolShowOverlayFinal || boolShowNextRound)}
				>
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
			</div>
			<div
				class="col-right pointer-events-none relative"
				class:opacity-30={numImageIndex === 0 && !boolShowOverlay}
				class:opacity-0={numImageIndex === 0 && boolShowOverlay}
			>
				{#if !strPlayerImage1}
					<div class="loader absolute">
						<Loader --delay={0.5} />
					</div>
				{:else}
					<img src={strPlayerImage1} width="792" height="792" alt="792" />
					{#if boolIsVisible1}
						<div
							class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						>
							<Confetti
								x={[-3, 3]}
								y={[-5, 5]}
								xSpread={0.25}
								size={30}
								duration={3500}
								amount={250}
								fallDistance="400px"
								colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
							/>
						</div>
					{/if}
				{/if}
			</div>
			<div class="footer">
				<div
					class="player-0 absolute bottom-[2px] left-[2px] px-2"
					class:opacity-30={numImageIndex === 1 && !boolShowOverlay}
					class:opacity-0={numImageIndex === 1 && boolShowOverlay}
				>
					{strPlayerName0 || UNKNOWN}
				</div>
				<div
					class="player-1 absolute bottom-[2px] right-[2px] px-2"
					class:opacity-30={numImageIndex === 0 && !boolShowOverlay}
					class:opacity-0={numImageIndex === 0 && boolShowOverlay}
				>
					{strPlayerName1 || UNKNOWN}
				</div>
			</div>
		</div>
	</div>
</div>

<div
	class:opacity-0={!boolShowOverlay}
	class="fixed h-screen w-screen"
	style="background: rgba(0, 0, 0, 0.875);"
></div>

{#if boolAreChoosing}
	<Counter t0={0} tN={-2} --width="1632px">
		<p class="counter-p-1" slot="noblink">Audience:</p>
		<p class="counter-p-2" slot="blink">Choose!</p>
	</Counter>
{/if}

{#if boolShowOverlay && !boolShowOverlayFinal && !boolShowNextRound}
	<div id="prompt-overlay" class="fixed flex h-screen w-screen items-center justify-center">
		<div class="row flex items-center justify-between">
			<div class="player player-0 flex items-center justify-center px-4">
				<span class="w-full">{strPlayerName0}</span>
			</div>
			<div id="player-score" class="overlay w-full self-start" class:score={boolIsRegistered}>
				<p class="h-[60px] pt-[15px]">current score:</p>
				<p class="flex w-full justify-between">
					<span class="inline-block flex-[33%] flex-grow">{numPlayerScore0}</span>
					<span class="inline-block flex-[33%] flex-grow">-</span>
					<span class="inline-block flex-[33%] flex-grow">{numPlayerScore1}</span>
				</p>
			</div>
			<div class="player player-0 flex items-center justify-center px-4">
				<span class="w-full">{strPlayerName1}</span>
			</div>
		</div>
	</div>
{/if}

{#if boolShowOverlay && boolShowOverlayFinal && !boolShowNextRound}
	<Counter
		t0={0}
		tN={-1000}
		--width="1632px"
		--height="573px"
		--translate-y="-95px"
		--background-overlay="transparent"
	>
		<p class="counter-p-1 uppercase" style="font-size: 100px; color: white;" slot="noblink">
			Winner:
		</p>
		<p class="counter-p-2 overflow-hidden text-ellipsis whitespace-nowrap uppercase" slot="blink">
			<span class="w-full px-12">{getWinner()}</span>
		</p>
	</Counter>
	<div class="fixed flex h-screen w-screen items-center justify-center" style="z-index: 1000;">
		<Confetti
			x={[-5, 5]}
			y={[-5, 5]}
			xSpread={0.25}
			delay={[0, 1000, 2000]}
			size={30}
			duration={3500}
			amount={250}
			fallDistance="400px"
			colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
		/>
	</div>
{/if}

{#if boolShowNextRound}
	<Banner innerText={EBannerText.ROUND} --background-overlay="transparent" />
{/if}

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
