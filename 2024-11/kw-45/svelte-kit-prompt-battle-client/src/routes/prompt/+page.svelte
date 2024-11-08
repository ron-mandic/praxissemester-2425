<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PUBLIC_ID } from '$env/static/public';
	import { promptValue } from '$lib/stores/prompt-value';
	import useSocket from '$lib/socket';
	import { timer, isRunning, isComplete, resetTimer } from '$lib/stores/timer-prompt';
	import Counter from '../../components/Counter.svelte';
	import InputPrompt from '../../features/input-prompt/components/InputPrompt.svelte';

	const socket = useSocket();

	let strPromptValue = $state('');
	let strMode = $state('');
	let strDataPrompt = $state('');

	$effect(() => {
		if (!strMode) {
			// TODO: Check the use of untrack for sychronizing state within the effect
			strMode = $page.url.searchParams.get('mode')!;
		}

		// socket.emit('c:requestEvent', 's:sendPromptBattle');

		// socket.on('s:sendPromptBattle', ({ guuid, player0, player1, prompts, currentRound }) => {
		// 	name = id === '1' ? player0 : player1;
		// 	dataPrompt = prompts[currentRound - 1];
		// 	dataGUUID = guuid;

		// 	$page.url.searchParams.set('guuid', dataGUUID);
		// 	goto(`?${$page.url.searchParams.toString()}`); // ...&guuid=g-...
		// });

		return () => {
			$isRunning = false;
			$isComplete = false;
			resetTimer();
			socket?.removeAllListeners();
		};
	});

	$effect(() => {
		if ($isComplete) {
			$promptValue = strPromptValue;

			switch (strMode) {
				case 'p': {
					goto(`results?${$page.url.searchParams.toString()}`, { replaceState: true });
					break;
				}
				case 'ps': {
					goto(`scribble?${$page.url.searchParams.toString()}`, { replaceState: true });
					break;
				}
				default: {
					console.warn('Invalid mode:', strMode);
					break;
				}
			}

			socket.emit('c:sendRoute/prompt', PUBLIC_ID);
		}
	});
</script>

<svelte:head>
	<title>Prompt</title>
</svelte:head>

<Counter
	onEnd={() => {
		setTimeout(() => {
			timer.start();
			document.querySelectorAll('.marquee').forEach((marquee) => {
				marquee.classList.add('fade');
			});
		}, 1000);
	}}
/>

<InputPrompt {socket} bind:strPromptValue {strDataPrompt} />
