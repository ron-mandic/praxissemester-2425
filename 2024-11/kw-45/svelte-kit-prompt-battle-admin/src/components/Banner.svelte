<script lang="ts">
	import { EBannerText } from '$lib/ts/enums';
	import Confetti from 'svelte-confetti';

	export let innerText: EBannerText;
</script>

<div id="banner" class="relative flex justify-center items-center w-[774px] text-center font-bold">
	<span class="text-center w-full">{innerText}</span>
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
<div id="banner-overlay"></div>

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
		font-size: 247.95px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;

		user-select: none;
		z-index: 998;
		border: 2px solid #6eebea;
		background: #1c1f22;

		width: 1632px;
		height: 355px;
	}

	#banner-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--background-overlay, rgba(0, 0, 0, 0.875));
		z-index: 997;
	}
</style>
