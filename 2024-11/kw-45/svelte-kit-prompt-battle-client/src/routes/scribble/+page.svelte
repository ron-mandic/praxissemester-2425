<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_ID } from '$env/static/public';
	import useSocket from '$lib/socket';
	import { timer, isComplete, isRunning, resetTimer } from '$lib/stores/timer-scribble';
	import { onMount } from 'svelte';
	import Counter from '../../components/Counter.svelte';
	import InputScribble from '../../features/input-scribble/components/InputScribble.svelte';

	const socket = useSocket();

	onMount(() => {
		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			$isRunning = false;
			$isComplete = false;
			resetTimer();

			socket.off('disconnect');
		};
	});

	$effect(() => {
		if ($isComplete) {
			// Tell the admin to now switch to the results page
			socket.emit('c:sendRoute/scribble');

			goto(`results?${$page.url.searchParams.toString()}`, { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Scribble</title>
</svelte:head>

<Counter
	end="Scribble!"
	onEnd={() => {
		setTimeout(() => {
			timer.start();
			document.querySelectorAll('.marquee').forEach((marquee) => {
				marquee.classList.add('fade');
			});
		}, 1000);
	}}
/>

<InputScribble {socket} />
