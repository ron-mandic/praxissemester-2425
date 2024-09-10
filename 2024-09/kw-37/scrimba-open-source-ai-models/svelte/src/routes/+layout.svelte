<script>
	import '@picocss/pico';
	import '../app.scss';
</script>

<div>
	<slot></slot>
</div>

<style>
	div {
		padding: 2rem;
		margin: 0 auto;
		width: clamp(20rem, 80%, 40rem);
	}
</style>
