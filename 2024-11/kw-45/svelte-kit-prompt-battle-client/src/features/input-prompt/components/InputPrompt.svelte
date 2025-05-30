<script lang="ts">
	import { MAX_INPUT_LENGTH, UNKNOWN } from '$lib';
	import { time, isComplete, isRunning } from '$lib/stores/timer-prompt';
	import type { Socket } from 'socket.io-client';
	import OutputFooter from '../../output-footer/components/OutputFooter.svelte';
	import { PUBLIC_ID } from '$env/static/public';

	let loop: number;

	let {
		socket,
		strPromptValue = $bindable(''),
		strDataPrompt
	} = $props<{
		socket: Socket;
		strPromptValue: string;
		strDataPrompt: string;
	}>();

	let refTextarea: HTMLTextAreaElement;

	// As soon as the timer starts, focus on the textarea for better usability
	$effect(() => {
		if ($isRunning) {
			refTextarea?.focus();
		}
	});

	function handleBlur() {
		refTextarea?.focus();
	}

	function handleInput() {
		(socket as Socket).emit('c:sendPrompt', { id: PUBLIC_ID, value: strPromptValue });
	}
</script>

<div id="prompt" class="relative" data-prompt={strDataPrompt || UNKNOWN}>
	<!-- svelte-ignore a11y_autofocus -->
	<textarea
		id="prompt-area"
		name="prompt"
		class="relative z-50 h-full w-full p-6 focus:outline-none"
		oninput={handleInput}
		disabled={!$isRunning || $isComplete}
		maxlength={MAX_INPUT_LENGTH}
		onblur={handleBlur}
		autofocus={true}
		bind:value={strPromptValue}
		bind:this={refTextarea}
	></textarea>

	<OutputFooter
		{strPromptValue}
		objClockArgs={{
			storeTime: time,
			storeCompletion: isComplete
		}}
		boolWithLength={true}
	/>
</div>

<style lang="scss">
	#prompt {
		width: 1856px;
		height: 940px;
		border: 2px solid #6eebea;

		&::after {
			content: attr(data-prompt);
			position: absolute;
			top: 50%;
			left: 50%;
			width: 90%;
			transform: translate(-50%, -50%);
			color: rgba(255, 255, 255, 0.125);
			text-align: center;
			font-size: 4rem;
			font-style: normal;
			font-weight: 800;
			line-height: normal;
			text-wrap: balance;
			z-index: -1;
		}
	}

	#prompt-area {
		background-color: transparent;
		color: #6eebea;
		font-family: 'JetBrains Mono';
		font-size: 62px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		resize: none;
		--tw-ring-shadow: none; // TODO: Please check for more viable options (see console)

		&::-webkit-scrollbar {
			width: 10px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: #6eebea;
		}
	}
</style>
