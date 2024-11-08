<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loader from '../../components/Loader.svelte';
	import Banner from '../../components/Banner.svelte';
	import Counter from '../../components/Counter.svelte';
	import { BATCH_SIZE, NEGATIVE_PROMPT } from '$lib';
	import { tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Confetti } from 'svelte-confetti';
	import useSocket from '$lib/socket';
	import { PUBLIC_ID } from '$env/static/public';
	import OutputFooter from '../../features/output-footer/components/OutputFooter.svelte';
	import { EBannerText } from '$lib/enums';
	import { promptValue } from '$lib/stores/prompt-value';
	import { promptScribble } from '$lib/stores/prompt-scribble';

	const socket = useSocket();

	let numSelectedIndex = $state<null | number>(null);
	let strMode = $state('');
	let strMessage = $state('');
	let boolHasSelected = $state(false);
	let boolIsVisible = $state(false);
	let boolHasAwarded = $state(false);
	let boolHasWon = $state<undefined | -1 | 0 | 1>(undefined);
	let boolIsRedirecting = $state(false);

	$effect(() => {
		if (!strMode) {
			// TODO: Check the use of untrack for sychronizing state within the effect
			strMode = $page.url.searchParams.get('mode')!;
		}

		socket.on('s:sendGameStats', (id) => {
			setTimeout(() => {
				switch (id) {
					case undefined: {
						boolHasWon = -1;
						break;
					}
					default: {
						boolHasWon = id === PUBLIC_ID ? 1 : 0;
						setTimeout(() => {
							boolHasAwarded = true;
						}, 6000);
						break;
					}
				}
			}, 2000);
		});

		socket.on('s:prepareClient', (message) => {
			strMessage = message;
			boolIsRedirecting = true;
		});

		setTimeout(() => {
			document.querySelectorAll('.marquee').forEach((marquee) => {
				marquee.classList.add('fade');
			});
		}, 0);

		return () => {
			socket?.removeAllListeners();
		};
	});

	function handleImageClick(event: MouseEvent) {
		const refElement = event.currentTarget! as HTMLButtonElement;
		const i = refElement.dataset.i!;
		return i;
	}

	async function fetchImages(prompt: string, scribble: string, batchSize: number) {
		const payload = {
			prompt: prompt,
			negative_prompt: NEGATIVE_PROMPT,
			steps: 20,
			cfg_scale: 6,
			width: 512,
			height: 512,
			batch_size: batchSize + 1,
			alwayson_scripts: {}
		};

		if (strMode && strMode === 'ps' && $promptScribble) {
			payload.alwayson_scripts = {
				controlnet: {
					enabled: true,
					args: [
						{
							input_image: scribble,
							module: 'none',
							model: 'control_v11p_sd15_scribble [d4ba51ff]'
						}
					]
				}
			};
		}

		let url = 'https://71d3b90f125d29c23f.gradio.live/sdapi/v1/txt2img';

		// Make fetch request (POST)

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		return response.json();
	}
</script>

<svelte:head>
	<title>Results</title>
</svelte:head>

<div id="results" class="relative">
	<div id="prompt-results" class="relative flex items-center justify-center" class:boolHasSelected>
		{#if boolIsRedirecting}
			<Counter
				seconds={3}
				end={strMessage === 'round=current' ? 'Carry on!' : "Let's go!"}
				onEnd={() => {
					switch (strMessage) {
						case 'round=current': {
							goto(`/prompt?${$page.url.searchParams.toString()}`);
							break;
						}
						case 'round=new': {
							goto('/');
							break;
						}
						default:
							break;
					}
				}}
			/>
		{:else if boolHasWon === undefined && !boolHasAwarded && !boolIsRedirecting}
			{#await fetchImages($promptValue, $promptScribble, BATCH_SIZE)}
				{#each new Array(BATCH_SIZE) as _, i}
					<div class="image loader flex items-center justify-center bg-black">
						<Loader --delay={i} />
					</div>
				{/each}
			{:then { images }}
				{#if !boolHasSelected}
					{@const args =
						strMode === 'p'
							? images.slice(0, images.length - 1)
							: images.slice(0, images.length - 2)}
					{#each args as image, i}
						<button
							class="image flex items-center justify-center bg-black"
							data-i={i}
							onclick={(e) => {
								numSelectedIndex = +handleImageClick(e);
								boolHasSelected = true;

								// Order is highly important otherwise the requests get cut off
								socket
									.emit('c:sendImageInfo/results', {
										PUBLIC_ID,
										imageIndex: i
									})
									.emit('c:sendImage/results', {
										PUBLIC_ID,
										image
									});

								setTimeout(async () => {
									boolIsVisible = true;
									await tick();

									setTimeout(() => {
										boolIsVisible = false;
									}, 3500);
								}, 1500);
							}}
						>
							{#if images.length}
								<img
									class="h-full w-full"
									src={`data:image/png;base64,${image}`}
									alt={`${prompt} (${i})`}
									in:scale={{
										duration: 500,
										delay: 500,
										opacity: 0.5,
										start: 0.5,
										easing: quintOut
									}}
								/>
							{/if}
						</button>
					{/each}
				{:else}
					{#if boolIsVisible}
						<div id="confetti" class="pointer-events-none">
							<Confetti
								x={[-5, 5]}
								y={[-5, 5]}
								xSpread={0.125}
								size={30}
								duration={3500}
								amount={250}
								fallDistance="400px"
								colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
							/>
						</div>
					{/if}
					<div
						class="image-large flex items-center justify-center bg-black"
						style="translate: 0 3.675rem; transition: translate 0.5s ease-in-out;"
						in:scale={{ duration: 500, delay: 150, opacity: 0.5, start: 0.5, easing: quintOut }}
					>
						<img
							src={`data:image/png;base64,${images[numSelectedIndex!]}`}
							alt={`Image ${numSelectedIndex}`}
						/>
					</div>
				{/if}
			{/await}
		{:else if boolHasWon === -1 && !boolHasAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.ROUND} />
		{:else if boolHasWon === 0 && !boolHasAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.LOSS} />
		{:else if boolHasWon === 1 && !boolHasAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.WIN} />
		{:else if boolHasWon === 0 && boolHasAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.ROUND} />
		{:else if boolHasWon === 1 && boolHasAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.ROUND} />
		{/if}
	</div>

	<OutputFooter boolWithLength={false} />
</div>

<style lang="scss">
	#results {
		width: 1856px;
		height: 940px;
		border: 2px solid #6eebea;
		background-color: #1c1f22;
		row-gap: 1rem;
		grid-template-rows: 152px auto;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			pointer-events: none;
		}
	}

	#confetti {
		width: 100px;
		height: 100px;
		top: 50%;
		left: 50%;
		transform: translate(calc(-50% + 50px), calc(-50% + 50px));
		position: absolute;
		background-color: transparent;
	}

	#prompt-results {
		width: 100%;
		height: 816px;
		gap: 2rem;

		&.selected {
			height: 100%;
		}
	}

	button {
		all: unset;
	}

	.image {
		width: 528px;
		height: 528px;
		padding: 0.5rem;
		aspect-ratio: 1 / 1;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		transition: translate 0.5s ease-in-out;

		&:not(.loader):hover {
			cursor: pointer;
			translate: 0 -10px;
			transition: translate 0.25s cubic-bezier(0.86, 0, 0.07, 1);
		}
	}

	.image-large {
		width: 876px;
		height: 876px;
		padding: 0.5rem;
		aspect-ratio: 1 / 1;
		flex-shrink: 0;
		border: 2px solid #6eebea;

		img {
			width: 100%;
			height: auto;
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

	#prompter {
		width: 260px;
		height: 51px;
		flex-shrink: 0;
		border-top: 2px solid #6eebea;
		border-left: 2px solid #6eebea;
		color: #fff;
		text-align: center;
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background-color: #1c1f22;
	}

	@keyframes jello {
		from,
		11.1%,
		to {
			transform: translate3d(-50%, -50%, 0);
		}

		22.2% {
			transform: skewX(-12.5deg) skewY(-12.5deg) translate3d(-50%, -50%, 0);
		}

		33.3% {
			transform: skewX(6.25deg) skewY(6.25deg) translate3d(-50%, -50%, 0);
		}

		44.4% {
			transform: skewX(-3.125deg) skewY(-3.125deg) translate3d(-50%, -50%, 0);
		}

		55.5% {
			transform: skewX(1.5625deg) skewY(1.5625deg) translate3d(-50%, -50%, 0);
		}

		66.6% {
			transform: skewX(-0.78125deg) skewY(-0.78125deg) translate3d(-50%, -50%, 0);
		}

		77.7% {
			transform: skewX(0.390625deg) skewY(0.390625deg) translate3d(-50%, -50%, 0);
		}

		88.8% {
			transform: skewX(-0.1953125deg) skewY(-0.1953125deg) translate3d(-50%, -50%, 0);
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
