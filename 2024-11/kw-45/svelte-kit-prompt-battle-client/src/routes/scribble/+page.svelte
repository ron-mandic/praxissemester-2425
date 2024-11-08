<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_ID } from '$env/static/public';
	import useSocket from '$lib/socket';
	import { timer, isComplete, isRunning, resetTimer } from '$lib/stores/timer-scribble';
	import Counter from '../../components/Counter.svelte';
	import InputScribble from '../../features/input-scribble/components/InputScribble.svelte';

	const socket = useSocket();

	$effect(() => {
		socket.emit('c:requestEvent', 's:sendPromptBattle');

		return () => {
			$isRunning = false;
			$isComplete = false;
			resetTimer();
			socket?.removeAllListeners();
		};
	});

	$effect(() => {
		if ($isComplete) {
			socket.emit('c:sendRoute/scribble', PUBLIC_ID);
			goto(`results?${$page.url.searchParams.toString()}`);
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
