<script lang="ts">
	import { MAX_INPUT_LENGTH } from '$lib';

	let { strPromptValue } = $props<{
		strPromptValue: string;
	}>();
</script>

<p
	id="prompt-length"
	class="flex h-[51px] items-center"
	class:full={strPromptValue?.length === MAX_INPUT_LENGTH}
>
	{@html strPromptValue === undefined
		? '<span class="opacity-50">0000</span>'
		: '<span class="opacity-50">0</span>'.repeat(4 - strPromptValue.length.toString().length) +
			strPromptValue.length} / {MAX_INPUT_LENGTH}
</p>

<style lang="scss">
	#prompt-length {
		color: #6eebea;
		font-size: 1.25rem;

		&.full {
			animation: shakeX 1s ease;
		}
	}
</style>
