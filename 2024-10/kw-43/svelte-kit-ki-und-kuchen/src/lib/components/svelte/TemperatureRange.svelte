<script lang="ts">
	// Source: https://www.w3schools.com/howto/howto_js_rangeslider.asp
	let { value = $bindable(7), disabled } = $props<{ value: number; disabled: boolean }>();
</script>

<div class="slidecontainer" data-value={((value as number) / 10).toFixed(1)}>
	<input
		type="range"
		min="0"
		max="20"
		class="slider my-1.5 rounded-md outline outline-1"
		bind:value
		{disabled}
	/>
	<span
		class="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono outline-none"
		style="left: calc(1.25rem + {(value / 20) *
			100 *
			0.8375}% ); font-size: .9rem;  font-variant-ligatures: none;">{(value / 10).toFixed(1)}</span
	>
</div>

<style lang="scss">
	.slidecontainer {
		position: relative;
		width: 100%;

		&:has(input[disabled]) .slider {
			opacity: 0.125;
			@apply border-muted-foreground outline-muted-foreground/50;
			background-image: linear-gradient(90deg, #0038ff 0%, #0ff 24%, #ffb800 73.5%, #f00 100%);
			pointer-events: none;
		}
	}

	/* The slider itself */
	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 25px;
		outline: none;
		opacity: 0.125;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
		background-image: linear-gradient(90deg, #0038ff 0%, #0ff 24%, #ffb800 73.5%, #f00 100%);
		box-shadow: 0px 17px 15px 0px rgba(247, 199, 199, 0.25) inset;
		border-radius: 36px;
		@apply border-muted-foreground outline-muted-foreground/50;
	}

	.slider:hover {
		opacity: 1;
	}

	.slider::-webkit-slider-thumb {
		@apply h-10 w-10 cursor-pointer appearance-none rounded-sm border-input bg-white shadow-sm outline outline-1 outline-muted-foreground/50 transition-all hover:h-10;
		cursor: -moz-grab;
		cursor: -webkit-grab;

		.slider::-moz-range-thumb {
			@apply h-10 w-10 cursor-pointer appearance-none rounded-sm bg-gray-500/50 shadow-sm backdrop-blur-2xl;
		}
		.slider {
			-webkit-appearance: none;
			width: 100%;
			height: 15px;
			border-radius: 5px;
			outline: none;
			opacity: 0.7;
			-webkit-transition: 0.2s;
			transition: opacity 0.2s;
			border-radius: 36px;
		}
	}

	.slider::-webkit-slider-thumb,
	.slider::-moz-range-thumb {
		@apply h-10 w-10 appearance-none;
		@apply cursor-pointer rounded-sm bg-gray-500;
	}
</style>
