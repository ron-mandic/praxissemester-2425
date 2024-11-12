<script lang="ts">
	import { PUBLIC_ID } from '$env/static/public';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import useSocket from '$lib/socket';
	import InputTerminal from '../features/input-terminal/components/InputTerminal.svelte';
	import type { Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	const socket: Socket = useSocket();

	let boolHasEntered = $state(false);
	let boolIsStarting = $state(false);
	let strPlayerName = $state('');
	let strMode = $state('');

	onMount(() => {
		// RESET event
		if ($page.url.searchParams.get('reload') !== null) {
			const cleanUrl = new URL($page.url);
			cleanUrl.search = '';

			// Invoke a clean URL without the reload query
			replaceState(cleanUrl, $page.state);

			setTimeout(() => {
				(window || globalThis).location.reload();
			}, 1000);

			return;
		}

		socket.on('connect', () => {
			socket.emit('c:joinLobby', PUBLIC_ID);

			// Update URL
			$page.url.searchParams.set('id', PUBLIC_ID);
			$page.url.searchParams.set('uuid', socket.id!);
			goto(`?${$page.url.searchParams.toString()}`, { replaceState: true });
		});

		socket.on('s:setMode', (mode) => {
			strMode = mode;
			$page.url.searchParams.set('mode', strMode);
			goto(`?${$page.url.searchParams.toString()}`, { replaceState: true });
		});

		socket.on('s:start', () => {
			boolIsStarting = true;
		});

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			socket.off('connect');
			socket.off('s:setMode');
			socket.off('s:start');
			socket.off('disconnect');
		};
	});

	// Listen for the start event to redirect to the prompt page
	$effect(() => {
		if (boolHasEntered && boolIsStarting && strMode) {
			setTimeout(() => {
				goto(`prompt?${$page.url.searchParams.toString()}`, { replaceState: true });
			}, 2000);
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
		{strMode}
		bind:boolHasEntered
		{boolIsStarting}
	/>
</div>
