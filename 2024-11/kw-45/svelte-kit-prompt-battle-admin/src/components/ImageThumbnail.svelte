<script lang="ts">
	export let chosen = false;
</script>

<div class="thumbnail" class:chosen>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="151"
		height="151"
		viewBox="0 0 151 151"
		fill="none"
	>
		<g clip-path="url(#clip0_93_276)">
			<rect width="151" height="151" fill="#CDCDCD" />
			<path d="M0 0L151 151M0 151L151 0" stroke="black" />
		</g>
		<defs>
			<clipPath id="clip0_93_276">
				<rect width="151" height="151" fill="white" />
			</clipPath>
		</defs>
	</svg>
</div>

<style lang="scss">
	.thumbnail {
		width: 151px;
		aspect-ratio: 1/1;
		background-color: #cdcdcd;

		&:not(.chosen) {
			opacity: 0.3;
		}
		&.chosen {
			opacity: 1;
		}
	}
</style>
