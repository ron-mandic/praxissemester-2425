<script lang="ts">
	import '../app.scss';
	let { children } = $props();

	$effect(() => {
		// Source: https://www.npmjs.com/package/socket.io-client
		localStorage.debug = '*';
	});
</script>

{@render children()}
