<script lang="ts">
	import { PUBLIC_ID } from '$env/static/public';
	import useSocket from '$lib/socket';

	const io = useSocket();
	let hasSent = false;

	$effect(() => {
		if (!hasSent) {
			io.emit('message', 'Hello from Svelte!');
			hasSent = true;
		}

		io.on('connect', () => {
			console.log('Connected');
			io.emit('c:join', PUBLIC_ID);
		});

		// Alternative: Use once() to listen for a single event
		io.on('message', (message: string) => {
			console.log(message);
		});

		io.on('name', (name: string) => {
			console.log(name);
		});

		io.on('connect_error', (error) => {
			console.error('Connection failed:', error);
		});

		io.on('connect_timeout', () => {
			console.error('Connection timeout');
		});

		io.on('reconnect', (numAttempt) => {
			console.log('Reconnected on attempt', numAttempt);
		});

		io.on('reconnect_failed', (error) => {
			console.error('Reconnection failed:', error);
		});

		io.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			// io.off('connect');
			// io.off('message');
			// io.off('name');
			// io.off('connect_error');
			// io.off('disconnect');

			io.removeAllListeners();
		};
	});
</script>

<a href="/about">About</a>
