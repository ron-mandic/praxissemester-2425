<script lang="ts">
	import useSocket from '$lib/socket';

	const io = useSocket();

	$effect(() => {
		console.log('About');
		console.log(io.id);
	});
</script>
