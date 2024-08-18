<script lang="ts">
	import '@picocss/pico';
	import '../app.scss';
</script>

<div class="layout">
	<slot />
</div>

<style lang="scss">
	.layout {
		position: relative;
		max-width: 800px;
		max-height: 100vh;
		overflow-y: auto;
		margin: 0 auto;
		padding: 0 20px 20px;
	}
</style>
