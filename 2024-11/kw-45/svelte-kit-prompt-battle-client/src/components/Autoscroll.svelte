<script lang="ts">
	import { onMount } from 'svelte';

	let loop = $state<undefined | number>();
	let refText = $state('');
	let overflows = $state(false);
	let direction: 'up' | 'down';
	let TIME_FACTOR = 10;

	let ref: HTMLDivElement;

	const {
		disableScrollbar = false,
		route = 'prompt',
		duration = 2000,
		delay = 2500,
		innerText = '',
		constrainOverflowBy = 0
	} = $props();

	const attribute = {
		'data-disable-scrollbar': disableScrollbar
	};
	let attributes = disableScrollbar ? attribute : {};

	onMount(() => {
		direction = ref?.scrollTop === ref?.scrollHeight ? 'down' : 'up';
		return () => clearInterval(loop);
	});

	function autoscroll(ref: HTMLElement, scrollPos: number, duration: number) {
		let start = ref?.scrollTop;
		if (start === undefined) return;

		let end = scrollPos;
		let dir = start < end ? 1 : -1;
		let scrollRange = ref.scrollHeight - ref.clientHeight;
		let scrollPerDuration = (scrollRange / duration) * TIME_FACTOR;

		let t = 0;
		let acc = scrollPerDuration;

		let loop = setInterval(() => {
			ref.scrollTo({
				top: start + acc * dir
			});

			acc += scrollPerDuration;
			t += TIME_FACTOR;

			if (t >= duration) {
				direction = direction === 'up' ? 'down' : 'up';
				clearInterval(loop);
				return;
			}
		}, TIME_FACTOR);
	}

	$effect(() => {
		if (refText) {
			overflows = ref?.scrollHeight - constrainOverflowBy > ref?.clientHeight;
		}
	});

	$effect(() => {
		if (overflows && direction === 'up') {
			// console.log('Up!');

			setTimeout(() => {
				autoscroll(ref, ref?.scrollHeight, duration);
			}, delay);
		}
	});

	$effect(() => {
		if (overflows && direction === 'down') {
			// console.log('Down!');

			setTimeout(() => {
				autoscroll(ref, 0, duration);
			}, delay);
		}
	});
</script>

<div class="pointer-events-none h-full w-full" bind:this={ref} {...attributes} data->
	<p data-route={route}>
		{innerText}
	</p>
</div>

<style lang="scss">
	div {
		overflow: hidden;
		overflow-y: auto;
		padding-bottom: var(--padding-bottom, 0);
		padding: var(--padding, unset);

		&::-webkit-scrollbar {
			width: 10px;
		}
		&::-webkit-scrollbar-track {
			background: transparent;
		}
		&::-webkit-scrollbar-thumb {
			background: #6eebea;
		}

		&[data-disable-scrollbar] {
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				width: 0;
			}
			&::-webkit-scrollbar-track {
				background: none;
			}
			&::-webkit-scrollbar-thumb {
				background: none;
			}
		}

		p[data-route='prompt-header'] {
			color: #fff;
			text-align: center;
			font-size: 60px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}

		p[data-route='prompt-main'] {
			padding: 0.5rem;
			color: #6eebea;
			font-size: 36px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		p[data-route='results'] {
			padding: 0.5rem;
			color: #fff;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}
	}
</style>
