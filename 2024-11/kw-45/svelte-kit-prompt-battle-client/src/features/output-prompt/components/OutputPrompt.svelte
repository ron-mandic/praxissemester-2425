<script lang="ts">
	import { UNKNOWN } from '$lib';
	import { promptValue } from '$lib/stores/prompt-value';
</script>

<div id="prompt-text" class="relative h-[152px] w-full p-4">
	<p>{$promptValue || UNKNOWN}</p>
	<div class="absolute bottom-0 left-0">Prompt</div>
</div>

<style lang="scss">
	#prompt-text {
		margin: 0 auto;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		background: #000;
		color: #6eebea;
		font-size: 21px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		user-select: none;
		max-width: 1824px;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(to bottom, transparent, black);
			z-index: 1;
			pointer-events: none;
		}

		div {
			width: 260px;
			height: 51px;
			flex-shrink: 0;
			border-top: 2px solid #6eebea;
			border-right: 2px solid #6eebea;
			color: #fff;
			text-align: center;
			font-size: 36px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			background-color: #1c1f22;
			z-index: 2;
		}
	}
</style>
