<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let seconds = 3;
	export let end = 'Prompt!';
	export let onEnd;

	let count = seconds;
	let starting = false;
	let covering = true;

	onMount(() => {
		const interval = setInterval(() => {
			count -= 1;
			if (count === 0) {
				starting = true;
			}
			if (count === -1) {
				covering = false;
				clearInterval(interval);
				onEnd();
			}
		}, 1000);
	});
</script>

{#if covering}
	<div
		id="counter"
		class:starting
		class="flex justify-center items-center w-[774px] text-center font-bold"
		out:fly={{ delay: 375, duration: 300, x: 0, y: -100, opacity: 0, easing: quintOut }}
	>
		<span class:starting>{count <= 0 ? end : count}</span>
	</div>
	<div id="counter-overlay"></div>
{/if}

<style lang="scss">
	#counter {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
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

		span {
			color: var(--color-digits, #6eebea);
		}

		span.starting {
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
