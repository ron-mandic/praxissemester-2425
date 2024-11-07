<script lang="ts">
	import { EBannerText } from '$lib/ts/enums';
	import Confetti from 'svelte-confetti';

	export let innerText: EBannerText;
</script>

<div id="banner" class="relative flex justify-center items-center w-[774px] text-center font-bold">
	<span
		class="text-center w-full"
		class:win={innerText === EBannerText.WIN}
		class:loss={innerText === EBannerText.LOSS}>{innerText}</span
	>
	{#if innerText === EBannerText.WIN}
		<div id="confetti" class="absolute w-24 h-24 top-1/2 left-1/2 -translate-y-1/2">
			<Confetti
				x={[-4, 4]}
				y={[-3, 3]}
				xSpread={0.05}
				size={30}
				duration={3500}
				amount={100}
				fallDistance="400px"
				colorArray={['#ED3A4F', '#0091B5', '#FDB913']}
			/>
		</div>
	{/if}
</div>

<style lang="scss">
	#banner {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		padding: 21px 0px;

		color: #fff;
		text-align: center;
		font-family: 'JetBrains Mono';
		font-size: 247.95px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;

		user-select: none;
		z-index: 998;
		border: 2px solid #6eebea;
		background: transparent;

		width: 1632px;
		height: 335px;

		span.win {
			animation: tada 1s ease-in-out alternate-reverse;
			animation-iteration-count: 2;
			animation-delay: 0.5s;
		}

		span.loss {
			animation: shakeX 1s ease-in-out alternate-reverse;
			animation-iteration-count: 2;
			animation-delay: 0.5s;
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

	@keyframes tada {
		from {
			transform: scale3d(1, 1, 1);
		}

		10%,
		20% {
			transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
		}

		30%,
		50%,
		70%,
		90% {
			transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
		}

		40%,
		60%,
		80% {
			transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
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
</style>
