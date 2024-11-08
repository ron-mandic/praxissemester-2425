// Credits: https://codesandbox.io/p/sandbox/svelte-countdown-clock-ceo2u

import { TIMER_SCRIBBLE_SECONDS } from '../index.ts';
import { writable } from 'svelte/store';

const COUNTDOWN_FROM = TIMER_SCRIBBLE_SECONDS * 1000;
const formatter = new Intl.DateTimeFormat('en', {
	hour12: false,
	minute: '2-digit',
	second: '2-digit'
});

export const time = writable(formatter.format(COUNTDOWN_FROM));
export const isRunning = writable(false);
export const isComplete = writable(false);

export const resetTimer = () => {
	time.set(formatter.format(COUNTDOWN_FROM));
	isRunning.set(false);
	isComplete.set(false);
	timer = createTimer();
};

const createTimer = (ms = COUNTDOWN_FROM) => {
	let animationRef: number;
	let latestStartTime: number | undefined;
	let remainingTime = ms;

	const animate = (timestamp: number) => {
		if (latestStartTime === undefined) {
			latestStartTime = timestamp + remainingTime;
		}

		const currentTime = latestStartTime - timestamp;
		if (currentTime <= 0) {
			// @ts-expect-error - Cannot find name 'cancelAnimationFrame'.deno-ts(2304)
			cancelAnimationFrame(animationRef);
			time.set(formatter.format(0));
			isRunning.set(false);
			isComplete.set(true);
			return;
		}
		time.set(formatter.format(currentTime));
		// @ts-expect-error - Cannot find name 'requestAnimationFrame'.deno-ts(2304)
		animationRef = requestAnimationFrame(animate);
	};

	const api = {
		start: () => {
			isRunning.set(true);
			// @ts-expect-error - Cannot find name 'requestAnimationFrame'.deno-ts(2304)
			animationRef = requestAnimationFrame(animate);
		},
		pause: () => {
			// @ts-expect-error - Cannot find name 'cancelAnimationFrame'.deno-ts(2304)
			cancelAnimationFrame(animationRef);
			if (latestStartTime !== undefined) {
				remainingTime = latestStartTime - performance.now();
				latestStartTime = undefined;
			}
			isRunning.set(false);
		},
		reset: Function.prototype
	};

	return api;
};

export let timer = createTimer();
