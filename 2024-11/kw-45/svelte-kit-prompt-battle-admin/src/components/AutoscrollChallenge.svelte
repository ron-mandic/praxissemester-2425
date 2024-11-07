<script lang="ts">
	import { onMount } from 'svelte';

	let loop: NodeJS.Timeout;
	let ref: HTMLDivElement;
	let refText: string;
	let overflows = false;

	export let duration = 1500;
	export let innerText: string;

	onMount(() => {
		return () => clearInterval(loop);
	});

	function autoscroll(ref: HTMLElement) {
		loop = setInterval(function () {
			scrollToBottom(ref);

			setTimeout(function () {
				scrollToTop(ref);
			}, duration);
		}, duration * 2);
	}

	function scrollToTop(ref: HTMLElement) {
		ref?.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
	function scrollToBottom(ref: HTMLElement) {
		ref?.scrollTo({
			top: ref.scrollHeight,
			behavior: 'smooth'
		});
	}

	$: if (refText) {
		overflows = ref?.scrollHeight > ref?.clientHeight;
	}

	$: if (overflows) {
		autoscroll(ref);
	}
</script>

<div class="autoscroll relative">
	<div
		class="as-container w-full h-[311px] relative overflow-y-auto pointer-events-none"
		bind:this={ref}
	>
		<p contenteditable bind:innerText={refText}>{innerText}</p>
	</div>
	<div class="label absolute left-0 bottom-0">Challenge</div>
</div>

<style lang="scss">
	.autoscroll {
		border: 2px solid #6eebea;
	}

	.as-container {
		background: #1c1f22;
		width: 1888px;
		padding: 20px 17px;
		padding-bottom: var(--padding-bottom, 0);

		&::-webkit-scrollbar {
			width: 0;
			scrollbar-width: none;
		}

		&::-webkit-scrollbar-track {
			background: none;
		}

		&::-webkit-scrollbar-thumb {
			background: none;
		}

		p {
			color: #fff;
			text-align: center;
			font-size: 80px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}
</style>
