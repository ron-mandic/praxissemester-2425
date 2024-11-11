<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PUBLIC_ID } from '$env/static/public';
	import { promptValue } from '$lib/stores/prompt-value';
	import useSocket from '$lib/socket';
	import { timer, isRunning, isComplete, resetTimer } from '$lib/stores/timer-prompt';
	import InputPrompt from '../../features/input-prompt/components/InputPrompt.svelte';
	// @ts-expect-error Module ... te-kit-prompt-battle-client/src/components/Counter.d.svelte.ts', but '--allowArbitraryExtensions' is not set.ts(6263)
	import Counter from '../../components/Counter.svelte';
	import Autoscroll from '../../components/Autoscroll.svelte';
	import { UNKNOWN } from '$lib';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	const socket = useSocket();

	let strPromptValue = $state('');
	let strMode = $state('');
	let strDataPrompt = $state('');
	let boolHasStarted = $state(false);

	onMount(() => {
		if (!strMode) {
			strMode = $page.url.searchParams.get('mode')!;
		}

		if (socket.connected) {
			socket.emit('acp:getBattleData');
		}

		socket.on('s:getBattleData', (battle) => {
			strDataPrompt = battle.challenge;
		});

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		return () => {
			$isRunning = false;
			$isComplete = false;
			resetTimer();

			socket.off('s:getBattleData');
			socket.off('disconnect');
		};
	});

	$effect(() => {
		if ($isComplete) {
			$promptValue = strPromptValue;

			// Tell the admin which route to take next
			socket.emit('c:sendRoute/prompt', strMode);

			switch (boolHasStarted && strMode) {
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
		}
	});
</script>

<svelte:head>
	<title>Prompt</title>
</svelte:head>

<Counter
	t0={15}
	onEnd={() => {
		// First hide the prompot overlay, then start the timer
		boolHasStarted = true;

		setTimeout(() => {
			timer.start();
			document.querySelectorAll('.marquee').forEach((marquee) => {
				marquee.classList.add('fade');
			});
		}, 1000);
	}}
/>

{#if !boolHasStarted}
	<div
		class="header fixed"
		class:hidden={boolHasStarted}
		out:fly={{ y: -10, opacity: 0, easing: backOut }}
	>
		<Autoscroll
			route="prompt-header"
			innerText={strDataPrompt || UNKNOWN}
			disableScrollbar
			constrainOverflowBy={46}
			--padding="20px 20px 56px"
		/>
		<div class="label absolute bottom-0 left-0">Challenge</div>
	</div>
{/if}

<InputPrompt {socket} bind:strPromptValue {strDataPrompt} />

<style lang="scss">
	.header {
		width: 1856px;
		height: 200px;
		flex-shrink: 0;
		border: 2px solid #6eebea;
		background: #1c1f22;
		z-index: 999;
		top: 84px;
	}

	.label {
		width: 260px;
		height: 51px;
		flex-shrink: 0;
		border-top: 2px solid #6eebea;
		border-right: 2px solid #6eebea;
		color: #fff;
		text-align: center;
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		background-color: #1c1f22;
		z-index: 2;
	}
</style>
