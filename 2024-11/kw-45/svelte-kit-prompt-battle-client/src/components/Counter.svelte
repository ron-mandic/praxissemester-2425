<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { EBannerText } from '$lib/enums';

	export let t0 = 3;
	export let tN = -1;
	export let end = 'Prompt!';
	export let onEnd = () => console.log(end);

	let count = t0;
	let starting = false;
	let covering = true;

	onMount(() => {
		const interval = setInterval(() => {
			count -= 1;
			if (count === 0) {
				starting = true;
			}
			if (count === tN) {
				covering = false;
				clearInterval(interval);
				onEnd();
			}
		}, 1000);
	});

	function getOpacity(end: string) {
		switch (end) {
			case 'Prompt!':
			case 'Scribble!':
				return 'opacity-0';
			default:
				return 'opacity-100';
		}
	}
</script>

{#if covering}
	<div
		id="counter"
		class:starting
		class="flex w-[774px] flex-col items-center justify-center text-center font-bold"
		out:fly={{ delay: 375, duration: 300, x: 0, y: -100, opacity: 0, easing: quintOut }}
	>
		<slot name="noblink" />
		<div class="w-full" class:starting={count <= 0 || starting}>
			<slot name="blink">
				<span>
					{#if count <= 0}
						<span class="{getOpacity(end)} whitespace-nowrap">{end}</span>
					{:else}
						<span>{count}</span>
					{/if}
				</span>
				{#if count <= 0}
					{#if end === 'Prompt!'}
						<img
							class="absolute left-1/2 top-1/2 h-auto w-[482px] -translate-x-1/2 -translate-y-1/2"
							src="/png/Prompt.png"
							alt="Prompt"
						/>
					{:else if end === 'Scribble!'}
						<img
							class="absolute left-1/2 top-1/2 h-auto w-[570px] -translate-x-1/2 -translate-y-1/2"
							src="/png/Scribble.png"
							alt="Scribble"
						/>
					{/if}
				{/if}
			</slot>
		</div>
	</div>
	<div id="counter-overlay"></div>
{/if}

<style lang="scss">
	#counter {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, calc(-50% + 37px + var(--translate-y, 0px)));
		display: flex;
		padding: 21px 0px;
		color: #6eebea;
		font-size: 120px;
		font-style: normal;
		line-height: normal;
		border: 2px solid #6eebea;
		background: #1c1f22;
		user-select: none;
		z-index: 998;

		min-width: 774px;
		width: auto;
		max-width: 1888px;
		padding: 0 2rem;
		height: var(--height, auto);
		transition: opacity 0.5s ease-in-out;

		div.starting {
			animation: flash 2s infinite;
		}
	}

	#counter-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--background-overlay, rgba(0, 0, 0, 0.875));
		z-index: 997;
	}

	@keyframes flash {
		from,
		50%,
		to {
			opacity: 1;
		}
		25%,
		75% {
			opacity: 0;
		}
	}
</style>
