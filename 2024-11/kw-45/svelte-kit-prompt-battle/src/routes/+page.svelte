<script lang="ts">
	import { PUBLIC_ID } from '$env/static/public';
	import useSocket from '$lib/socket';

	const io = useSocket();

	$effect(() => {
		io.on('connect', () => {
			console.log('Connected');
			io.emit('c:join', PUBLIC_ID);
		});

		io.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			io?.removeAllListeners();
		};
	});
</script>

<a href="/about">About</a>
