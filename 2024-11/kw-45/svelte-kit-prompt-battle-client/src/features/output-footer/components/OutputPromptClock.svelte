<script lang="ts">
	import type { Writable } from 'svelte/store';

	let { storeTime, storeCompletion } = $props<{
		storeTime?: Writable<string>;
		storeCompletion?: Writable<boolean>;
	}>();
</script>

<div id="prompt-clock" class="flex flex-col justify-center">
	<p>time remaining:</p>
	{#if $storeTime !== undefined && $storeCompletion !== undefined}
		<p
			class:completing={+$storeTime.slice(3) <= 10 && $storeTime[1] !== '1'}
			class:complete={$storeCompletion}
		>
			{$storeTime}
		</p>
	{:else}
		<p>--:--</p>
	{/if}
</div>

<style lang="scss">
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

			&.completing {
				animation: pulse 1s linear infinite;
			}

			&.complete {
				color: #ff3838;
				animation: shakeX 1s linear;
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
