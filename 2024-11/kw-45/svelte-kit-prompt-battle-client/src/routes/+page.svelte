<script lang="ts">
	import { PUBLIC_ID } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import useSocket from '$lib/socket';
	import InputTerminal from '../features/input-terminal/components/InputTerminal.svelte';
	import { playerName } from '$lib/stores/player-name';

	const socket = useSocket();

	let boolHasEntered = $state(false);
	let boolIsStarting = $state(false);
	let strPlayerName = $state('');
	let strMode = $state('');

	$effect(() => {
		socket.on('connect', () => {
			socket.emit('c:join', PUBLIC_ID);

			// Update URL
			$page.url.searchParams.set('id', PUBLIC_ID);
			$page.url.searchParams.set('uuid', socket.id!);
			// TODO: Change that by what the admin chooses to do
			$page.url.searchParams.set('mode', 'ps');
			goto(`?${$page.url.searchParams.toString()}`, { replaceState: true });
		});

		// socket.on('s:start', () => {
		// 	boolIsStarting = true;
		// });

		// socket.on('s:setMode', (mode) => {
		// 	strMode = mode;
		// 	$page.url.searchParams.set('mode', strMode);
		// 	goto(`?${$page.url.searchParams.toString()}`);
		// });

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			socket?.removeAllListeners();
		};
	});

	// Listen for the start event to redirect to the prompt page
	$effect(() => {
		if (boolHasEntered) {
			playerName.set(strPlayerName);
			goto(`prompt?${$page.url.searchParams.toString()}`, { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>/</title>
</svelte:head>

<div class="m-auto w-full max-w-[1419px]">
	<InputTerminal
		{socket}
		strPlayerNumber={PUBLIC_ID}
		bind:strPlayerName
		bind:strMode
		bind:boolHasEntered
		bind:boolIsStarting
	/>
</div>
