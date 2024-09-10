<script>
	const { ...props } = $props();
</script>

<button class="checkbox secondary" {...props}> <span>&#10005;</span> </button>

<style lang="scss">
	button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 15px;
		height: 20px;
		position: absolute;
		top: -1rem;
		right: -1rem;
	}

	span {
		display: block;
		width: 15px;
		height: 20px;
		line-height: 1.2;
	}
</style>
