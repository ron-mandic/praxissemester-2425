<script>
	const { label, score, box } = $props();
	const { xmax, xmin, ymax, ymin } = box;

	function objToCSSString(obj) {
		return Object.entries(obj)
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	}

	const color =
		'#' +
		Math.floor(Math.random() * 0xffffff)
			.toString(16)
			.padStart(6, 0);
	const textContent = `${label}: ${Math.floor(score * 100)}%`;
	const cssObj = {
		'border-color': color,
		left: +(100 * xmin).toFixed(2) + '%',
		top: +(100 * ymin).toFixed(2) + '%',
		width: +(100 * (xmax - xmin)).toFixed(2) + '%',
		height: +(100 * (ymax - ymin)).toFixed(2) + '%'
	};
</script>

<div class="bounding-box" style={objToCSSString(cssObj)}>
	<span class="bounding-box-label" style="background-color: {color};">
		{textContent}
	</span>
</div>

<style>
	.bounding-box {
		position: absolute;
		box-sizing: border-box;
		border-width: 1px;
		border-style: solid;
	}

	.bounding-box-label {
		color: white;
		position: absolute;
		font-size: 10px;
		margin-top: -19px;
		margin-left: -1px;
		padding: 1px;
		width: max-content;
	}
</style>
