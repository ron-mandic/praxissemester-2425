<script lang="ts">
	import { playerName } from '$lib/stores/player-name';
	import type { Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	let {
		socket,
		strPlayerNumber,
		strPlayerName = $bindable(),
		strMode,
		boolHasEntered = $bindable(),
		boolIsStarting
	} = $props<{
		socket: Socket;
		strPlayerNumber: string;
		strPlayerName: string;
		strMode: string;
		boolHasEntered: boolean;
		boolIsStarting: boolean;
	}>();

	let refTerminal: HTMLDivElement;
	let refInput: HTMLInputElement;

	// Translate the fake cursor to the end of the input
	function handleInput() {
		refTerminal.style.setProperty('--offset', `${strPlayerName.length * 30}px`);

		socket.emit('c:setPlayerName', {
			id: strPlayerNumber,
			name: strPlayerName
		});
	}

	// Prevent the input from losing focus
	function handleBlur() {
		refInput?.focus();
	}

	/**
	 * As soon as the player enters their name, emit the c:updateLobby event
	 * to the server with the player's name and ready status. Prevent any
	 * further input from the player.
	 */
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !boolHasEntered) {
			if (strPlayerName === '') return;

			boolHasEntered = true;
			$playerName = strPlayerName;

			socket.emit('c:updateLobby', {
				id: strPlayerNumber,
				name: strPlayerName,
				ready: true
			});

			return;
		}
	}
</script>

<h1 class="relative w-full text-center font-thin uppercase">
	<span class="font-bold opacity-0">Prompt</span><span class="opacity-0">Battle</span>
	<img
		class="absolute left-1/2 top-1/3 h-auto w-[1331px] -translate-x-1/2 -translate-y-1/2"
		src="/png/PromptBattle.png"
		alt="PromptBattle"
	/>
</h1>
<section id="terminal" class="p-2">
	<p>~/Player {+strPlayerNumber + 1} &gt; ./prompt-battle.sh</p>
	<p>Prompt Battle is loading...</p>
	<p>Loading complete!</p>
	<p class="mt-16">Please enter your name!</p>

	<div
		id="terminal-input"
		class="relative mt-16"
		class:changed={boolHasEntered}
		bind:this={refTerminal}
	>
		<label for="input">
			<span>Player {+strPlayerNumber + 1}: </span>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				id="input"
				type="text"
				name="player"
				maxlength={25}
				autocomplete="off"
				autocorrect="off"
				class="z-50"
				onblur={handleBlur}
				oninput={handleInput}
				onkeydown={handleKeyDown}
				class:changed={boolHasEntered}
				autofocus={true}
				bind:value={strPlayerName}
				bind:this={refInput}
			/>
		</label>
	</div>

	{#if boolHasEntered && boolIsStarting && strMode}
		<p id="terminal-indicator" class="blink ellipsis w-full">Starting</p>
	{:else if boolHasEntered}
		<p id="terminal-indicator" class="ellipsis w-full">Waiting</p>
	{/if}
</section>

<style lang="scss">
	h1 {
		font-size: clamp(4rem, 12vw, 170px);
	}

	#terminal {
		border: 2px solid #6eebea;
		background-color: #1c1f22;
		animation: slide-in-up 1s ease;
		will-change: transform;

		p,
		label {
			color: #6eebea;
			font-family: 'JetBrains Mono';
			font-size: 50px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
		}
	}

	#terminal-input {
		input {
			position: relative;
			color: #fff;
			background-color: transparent;
			font-family: 'JetBrains Mono';
			font-size: 50px;
			font-style: normal;
			font-weight: 700;
			line-height: normal;
			outline: none;
			caret-color: transparent;
			height: 66px;
			padding: 0;
			border: none;
			width: 75%;

			&.changed {
				opacity: 0.75;
				pointer-events: none;
			}

			&:focus,
			&:focus-within,
			&:active,
			&:focus-visible {
				border: none !important;
				outline: none !important;
				outline-color: transparent !important;
				--tw-ring-shadow: none; // TODO: Please check for more viable options (see console)
			}

			&::after {
				content: '|';
				animation: blink 1s infinite;
			}

			&:focus {
				outline: none;
			}
		}

		&:not(.changed)::after {
			content: '';
			position: absolute;
			top: 0;
			left: calc(19rem + var(--offset, 0px));
			display: inline-block;
			background-color: #fff;
			vertical-align: top;
			width: 27.5px;
			height: 66px;
			-webkit-animation: blink 1.25s step-end infinite;
			animation: blink 1.25s step-end infinite;
			border: none;
		}
	}

	#terminal-indicator {
		&.blink {
			animation: blink 1s infinite;
		}
		&.ellipsis::after {
			content: '';
			animation: ellipsis 3s infinite 1s;
		}
	}

	@keyframes ellipsis {
		0% {
			content: '';
		}
		33% {
			content: '.';
		}
		66% {
			content: '..';
		}
		100% {
			content: '...';
		}
	}

	@keyframes slide-in-up {
		0% {
			transform: translateY(-5rem);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
