<script lang="ts">
	import { scale, type ScaleParams } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import { delay } from '$lib/ts/functions';
	// Source 1: https://uiverse.io/JkHuger/light-monkey-24
	// Source 2: https://uiverse.io/choudhary-usman/swift-hound-29
	// Source 3 (current): https://uiverse.io/G4b413l/big-bulldog-8
	// Source 4: https://uiverse.io/Sourcesketch/strange-catfish-68
	// Source 5: https://uiverse.io/ashish-yadv/dry-turtle-69

	const {
		theme = 'light',
		asOverlay = true,
		in: inScale = {},
		out: outScale = {}
	} = $props<{
		theme?: 'light' | 'dark';
		asOverlay?: boolean;
		in?: ScaleParams & { cssDelay?: number };
		out?: ScaleParams;
	}>();
</script>

<div class={asOverlay ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'relative'}>
	<div
		class="loader {theme}"
		style="--animation-delay: {inScale.cssDelay || 0}ms;"
		in:scale={{
			duration: 500,
			opacity: 0,
			start: 1.5,
			easing: sineInOut,
			...inScale
		}}
		out:scale={{
			duration: 225,
			opacity: 0,
			start: 0.75,
			easing: sineInOut,
			...outScale
		}}
	></div>
</div>

<style lang="scss">
	.loader {
		--uib-size: 25px;
		--uib-speed: 1.5s;

		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: var(--uib-size);
		width: var(--uib-size);
		animation: rotate936 calc(var(--uib-speed) * 1.667) infinite linear;
		animation-delay: var(--animation-delay);
	}

	.loader::before,
	.loader::after {
		content: '';
		position: absolute;
		height: 60%;
		width: 60%;
		border-radius: 50%;
		@apply bg-foreground;
		will-change: transform;
		flex-shrink: 0;
	}

	.loader::before {
		animation: orbit var(--uib-speed) linear infinite;
	}

	.loader::after {
		animation: orbit var(--uib-speed) linear calc(var(--uib-speed) / -2) infinite;
	}

	@keyframes rotate936 {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes orbit {
		0% {
			transform: translate(calc(var(--uib-size) * 0.5)) scale(0.73684);
			opacity: 0.65;
		}

		5% {
			transform: translate(calc(var(--uib-size) * 0.4)) scale(0.684208);
			opacity: 0.58;
		}

		10% {
			transform: translate(calc(var(--uib-size) * 0.3)) scale(0.631576);
			opacity: 0.51;
		}

		15% {
			transform: translate(calc(var(--uib-size) * 0.2)) scale(0.578944);
			opacity: 0.44;
		}

		20% {
			transform: translate(calc(var(--uib-size) * 0.1)) scale(0.526312);
			opacity: 0.37;
		}

		25% {
			transform: translate(0%) scale(0.47368);
			opacity: 0.3;
		}

		30% {
			transform: translate(calc(var(--uib-size) * -0.1)) scale(0.526312);
			opacity: 0.37;
		}

		35% {
			transform: translate(calc(var(--uib-size) * -0.2)) scale(0.578944);
			opacity: 0.44;
		}

		40% {
			transform: translate(calc(var(--uib-size) * -0.3)) scale(0.631576);
			opacity: 0.51;
		}

		45% {
			transform: translate(calc(var(--uib-size) * -0.4)) scale(0.684208);
			opacity: 0.58;
		}

		50% {
			transform: translate(calc(var(--uib-size) * -0.5)) scale(0.73684);
			opacity: 0.65;
		}

		55% {
			transform: translate(calc(var(--uib-size) * -0.4)) scale(0.789472);
			opacity: 0.72;
		}

		60% {
			transform: translate(calc(var(--uib-size) * -0.3)) scale(0.842104);
			opacity: 0.79;
		}

		65% {
			transform: translate(calc(var(--uib-size) * -0.2)) scale(0.894736);
			opacity: 0.86;
		}

		70% {
			transform: translate(calc(var(--uib-size) * -0.1)) scale(0.947368);
			opacity: 0.93;
		}

		75% {
			transform: translate(0%) scale(1);
			opacity: 1;
		}

		80% {
			transform: translate(calc(var(--uib-size) * 0.1)) scale(0.947368);
			opacity: 0.93;
		}

		85% {
			transform: translate(calc(var(--uib-size) * 0.2)) scale(0.894736);
			opacity: 0.86;
		}

		90% {
			transform: translate(calc(var(--uib-size) * 0.3)) scale(0.842104);
			opacity: 0.79;
		}

		95% {
			transform: translate(calc(var(--uib-size) * 0.4)) scale(0.789472);
			opacity: 0.72;
		}

		100% {
			transform: translate(calc(var(--uib-size) * 0.5)) scale(0.73684);
			opacity: 0.65;
		}
	}
</style>
