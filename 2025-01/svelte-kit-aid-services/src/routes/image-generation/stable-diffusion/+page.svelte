<script lang="ts">
	import { RectangleVertical, RectangleHorizontal, Square } from 'lucide-svelte/icons';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { Label } from '$lib/components/ui/label/';

	let value = $state<undefined | string>('1:1');
	let files = $state();

	function handleToggle(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		let buttonValue = event.currentTarget.dataset?.value;
		if (buttonValue === value) {
			event.preventDefault();
			return false;
		}
	}

	$inspect(files);
</script>

<div class="m-2 h-full rounded-lg bg-muted/20 md:ml-4 md:mt-5 md:rounded-xl">
	<ToggleGroup.Root size="default" type="single" bind:value>
		<ToggleGroup.Item class="w-20" value="6:19" aria-label="Portrait" onclick={handleToggle}>
			<RectangleVertical class="size-4" />
			<span class="pointer-events-none">6:19</span>
		</ToggleGroup.Item>
		<ToggleGroup.Item class="w-20" value="1:1" aria-label="Square" onclick={handleToggle}>
			<Square class="size-4" />
			<span class="pointer-events-none">1:1</span>
		</ToggleGroup.Item>
		<ToggleGroup.Item class="w-20" value="16:9" aria-label="Landscape" onclick={handleToggle}>
			<RectangleHorizontal class="size-4" />
			<span class="pointer-events-none">16:9</span>
		</ToggleGroup.Item>
	</ToggleGroup.Root>

	<!-- https://stackoverflow.com/a/27165977 -->
	<!-- https://medium.com/geekculture/how-to-preview-images-before-upload-with-javascript-3420e3cd2f1c -->

	<!-- <Label class="rounded-lg border-none outline-none" for="picture">
		<img bind:this={refImg} src="" alt="" class="h-24 w-24" />
		<Input id="picture" type="file" accept="image/*" class="hidden" />
	</Label> -->
</div>
