<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loader from '../../components/Loader.svelte';
	import Banner from '../../components/Banner.svelte';
	import Counter from '../../components/Counter.svelte';
	import { BATCH_SIZE, COUNTER_ROUND_CURRENT, COUNTER_ROUND_NEW } from '$lib';
	import { onMount, tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import useSocket from '$lib/socket';
	import { PUBLIC_ID } from '$env/static/public';
	import OutputFooter from '../../features/output-footer/components/OutputFooter.svelte';
	import { EBannerText } from '$lib/enums';
	import { promptValue } from '$lib/stores/prompt-value';
	import { promptScribble } from '$lib/stores/prompt-scribble';
	import type { DataType } from '$lib/interfaces';
	import { fetchImages, getRandomFrom } from '$lib/functions';
	import { spring } from 'svelte/motion';

	const socket = useSocket();
	let response = $state<Promise<DataType>>();

	let numSelectedIndex = $state<null | number>(null);
	let strMode = $state('');
	let strMessage = $state('');

	let boolHasSelected = $state(false);
	let boolIsVisible = $state(false);

	let boolHaveIWon = $state<undefined | -1 | 0 | 1>(undefined);
	let hasBeenAwarded = $state(false);
	let boolIsRedirecting = $state(false);

	let boolHasZooomedIn = $state(false);
	const objImageScribble0 = { y: 0, width: 124, height: 124 };
	const objImageScribbleN = { y: -256, width: 544, height: 544 };
	const storeImageScribble = spring(objImageScribble0, {
		stiffness: 0.1,
		damping: 0.675,
		precision: 0.1
	});

	onMount(() => {
		if (!strMode) {
			strMode = $page.url.searchParams.get('mode')!;
		}

		// Just fetch it incompletely for now so we can resolve it later
		response = fetchImages($promptValue, $promptScribble, strMode, BATCH_SIZE);

		socket.on('s:updateBattle', ({ id, hasWon }: { id: string; hasWon: boolean }) => {
			strMessage = !hasWon ? 'round=current' : 'round=new';

			setTimeout(() => {
				// If no one has won, the  game just continues (Next round)
				if (!hasWon) {
					boolHaveIWon = -1;
				}
				// If someone has won, assess whether the current player has won
				else {
					// First show if the current player has won
					boolHaveIWon = Number(id === PUBLIC_ID) as 0 | 1;

					// Then announce the next round (but don't redirect yet)
					setTimeout(() => {
						hasBeenAwarded = true;
					}, 5000);
				}
			}, 1000);
		});

		socket.on('s:prepareRound', (message: string) => {
			boolIsRedirecting = true;

			setTimeout(() => {
				switch (message) {
					case 'round=current': {
						// goto(`/prompt?${$page.url.searchParams.toString()}`, { replaceState: true });
						break;
					}
					case 'round=new': {
						// Reset the mode so the admin can choose the next mode manually again
						$page.url.searchParams.delete('mode');
						// goto(`/?${$page.url.searchParams.toString()}`, { replaceState: true });
						break;
					}
					default:
						break;
				}
			}, 4000);
		});

		// s:RESET
		socket.on('s:RESET', () => {
			goto('/?reload=true', { replaceState: true });
		});

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		setTimeout(() => {
			document.querySelectorAll('.marquee').forEach((marquee) => {
				marquee.classList.add('fade');
			});
		}, 0);

		return () => {
			socket.off('s:updateBattle');
			socket.off('s:prepareRound');
			socket.off('s:RESET');
			socket.off('disconnect');
		};
	});

	function getImages(images: string[]) {
		if (images.length <= 3) {
			return images;
		}

		return images.slice(0, 3);
	}

	function toggleZoom(e: MouseEvent) {
		boolHasZooomedIn = !boolHasZooomedIn;
		storeImageScribble.set(boolHasZooomedIn ? objImageScribbleN : objImageScribble0);
	}

	function handleImageClick(event: MouseEvent) {
		const refElement = event.currentTarget! as HTMLButtonElement;
		const i = refElement.dataset.i!;
		return i;
	}
</script>

<svelte:head>
	<title>Results</title>
</svelte:head>

<div id="results" class="relative">
	<div
		id="prompt-results"
		class="relative flex items-center justify-center"
		class:selected={boolHasSelected}
	>
		{#if $promptScribble && !boolHasSelected}
			<button
				id="scribble"
				onclick={toggleZoom}
				class:zoomed={boolHasZooomedIn}
				style="transform: translate(-50%, {$storeImageScribble.y}px); width: {$storeImageScribble.width}px; height: {$storeImageScribble.height}px;"
			>
				<img src={$promptScribble} alt="Scribble" />
			</button>
		{/if}

		{#if boolIsRedirecting}
			<Counter
				end={strMessage === 'round=current'
					? (getRandomFrom(COUNTER_ROUND_CURRENT) as string)
					: (getRandomFrom(COUNTER_ROUND_NEW) as string)}
				onEnd={() => {
					switch (strMessage) {
						case 'round=current': {
							goto(`/prompt?${$page.url.searchParams.toString()}`, { replaceState: true });
							break;
						}
						case 'round=new': {
							goto('/', { replaceState: true });
							break;
						}
						default:
							break;
					}
				}}
			/>
		{:else if boolHaveIWon === undefined && !hasBeenAwarded && !boolIsRedirecting}
			{#await response as Promise<DataType>}
				{#each new Array(BATCH_SIZE) as _, i}
					<div
						class="image loader flex items-center justify-center bg-black"
						class:faded={boolHasZooomedIn}
					>
						<Loader --delay={i} />
					</div>
				{/each}
			{:then data}
				<!-- TODO: Remove unnecessary function -->
				{@const { images } = (() => {
					console.log(data);
					return data;
				})()}

				{#if !boolHasSelected}
					{@const args = getImages(images)}
					{#each args as dataURI, index}
						<button
							class="image flex items-center justify-center bg-black"
							data-i={index}
							class:faded={boolHasZooomedIn}
							onclick={(e) => {
								numSelectedIndex = +handleImageClick(e);
								boolHasSelected = true;

								// Order is highly important otherwise the requests get cut off
								socket
									// This is the request for the admin
									.emit('c:sendImage/pchoose', {
										id: PUBLIC_ID,
										index
									})
									// This is the request for the projector
									.emit('c:sendImage/results', {
										id: PUBLIC_ID,
										dataURI
									});

								setTimeout(() => {
									boolIsVisible = true;
									tick().then(() => {
										setTimeout(() => {
											boolIsVisible = false;
										}, 3500);
									});
								}, 1500);
							}}
						>
							{#if images.length}
								<img
									class="h-full w-full"
									src={`data:image/png;base64,${dataURI}`}
									alt={`(${index})`}
								/>
							{/if}
						</button>
					{/each}
				{:else}
					<!-- {#if boolIsVisible}
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
					{/if} -->
					<div
						class="image-large flex items-center justify-center bg-black"
						style="translate: -1 3.675rem; transition: translate 0.5s ease-in-out;"
						in:scale={{ duration: 500, delay: 150, opacity: 0.5, start: 0.5, easing: quintOut }}
					>
						<img
							src={`data:image/png;base64,${images[numSelectedIndex!]}`}
							alt={`Image ${numSelectedIndex}`}
						/>
					</div>
				{/if}
			{/await}
		{:else if boolHaveIWon === -1 && !hasBeenAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.ROUND} />
		{:else if boolHaveIWon === 0 && !hasBeenAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.LOSS} />
		{:else if boolHaveIWon === 1 && !hasBeenAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.WIN} />
		{:else if boolHaveIWon === 0 && hasBeenAwarded && !boolIsRedirecting}
			<Banner innerText={EBannerText.ROUND} />
		{:else if boolHaveIWon === 1 && hasBeenAwarded && !boolIsRedirecting}
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

	#scribble {
		all: unset;
		position: absolute;
		bottom: -122px;
		left: 50%;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		background: #1c1f22;
		z-index: 999;

		&:not(.zoomed):hover img {
			animation: pulse 0.75s cubic-bezier(0.47, 0, 0.745, 0.715);
		}

		img {
			width: 100%;
			aspect-ratio: 1 / 1;
			object-fit: contain;
			transform-origin: center center;
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
		padding: 0.5rem;
		aspect-ratio: 1 / 1;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		transition:
			translate 0.5s ease-in-out,
			opacity 0.75s cubic-bezier(0.77, 0, 0.175, 1);

		&:not(.loader) {
			width: 528px;
			height: 528px;

			&:hover {
				translate: 0 -0.5rem;
				transition: translate 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
			}
		}

		&.loader {
			width: 548px;
			height: 548px;
		}

		&.faded,
		&.loader.faded {
			opacity: 0.125;
			filter: blur(12px);
			transition: opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1);
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
