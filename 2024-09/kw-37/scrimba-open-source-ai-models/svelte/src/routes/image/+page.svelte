<script>
	import FileDrop from '$lib/components/FileDrop.svelte';
	import DeleteButton from '../../lib/components/DeleteButton.svelte';

	let prompt = $state('');
	let hasRequested = $state(false);
	let response = $state(null);
	let canvas = $state(null);
	let refImage = $state(null);
	let image = $state(null);

	function imgToBlob(image) {
		canvas.width = image.width;
		canvas.height = image.height;
		let ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, image.width, image.height);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
		});
	}

	async function sendRequest() {
		let blob = await imgToBlob(refImage);
		const formData = new FormData();
		formData.append('prompt', prompt);
		formData.append('blob', blob);

		response = fetch('/api/image', {
			method: 'POST',
			body: formData
		}).then((res) => res.blob());

		hasRequested = true;
		prompt = '';
	}
</script>

<div>
	<h1>Image</h1>
	<canvas bind:this={canvas} style="display: none;" width="240" height="160"></canvas>
	<input
		type="text"
		bind:value={prompt}
		placeholder={'An elderly couple walks together on a ...'}
		onchange={sendRequest}
		disabled={!image}
	/>
	<div class="layout">
		<div>
			{#if !image}
				<FileDrop bind:image />
			{:else}
				<div class="file-upload">
					<img bind:this={refImage} src={URL.createObjectURL(image)} alt="Selected" />
					<DeleteButton onclick={() => (image = null)} />
				</div>
			{/if}
		</div>

		{#if !hasRequested}
			<div class="image-empty">Please enter your text</div>
		{:else if response}
			{#await response}
				<div class="image-empty">
					<div class="loader" aria-busy="true"></div>
				</div>
			{:then obj}
				<img src={URL.createObjectURL(obj)} alt="Generated using Hugging Face" />
			{:catch error}
				<p>{error.message}</p>
			{/await}
		{:else}
			<div class="image-empty">No image found</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.layout {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 1rem;
		padding: 2rem 0;

		img {
			width: 100%;
			border-radius: 0.5rem;
		}
	}

	.loader,
	.image-empty {
		display: grid;
		place-items: center;
	}

	.file-upload {
		position: relative;

		.checkbox {
		}
	}

	[aria-busy] {
		width: 100%;
		height: 100px;
	}
</style>
