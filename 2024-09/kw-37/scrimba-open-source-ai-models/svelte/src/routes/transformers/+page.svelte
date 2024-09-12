<script>
	import ObjectBoxes from '$lib/components/ObjectBoxes.svelte';
	import { detector } from '$lib/ts/variables';

	let status = $state('Ready');
	let hasRequested = $state(false);
	let refImage = $state(null);
	let objects = $state(null);

	async function sendRequest() {
		hasRequested = true;
		status = 'Detecting objects...';

		try {
			objects = await detector(refImage.src, {
				threshold: 0.95,
				percentage: true
			});
			status = `${objects?.length || 'No'} objects detected`;
		} catch (error) {
			status = error.message;
			objects = null;
		} finally {
			hasRequested = false;
		}

		status = `${objects?.length || 'No'} objects detected`;
		hasRequested = false;
	}
</script>

<div class="container">
	<div class="row">
		<p id="status">
			<span>{status}</span>
		</p>
		<button disabled={hasRequested} onclick={sendRequest}>
			{#if status.endsWith('objects detected') && objects}
				<span class="show-up">Detect again</span>
			{:else}
				<span class="show-up">Detect objects</span>
			{/if}
		</button>
	</div>
	<div id="image-container">
		<img bind:this={refImage} src="road.jpeg" alt="Road with bus" />
		{#if objects}
			<ObjectBoxes boxes={objects.slice(0, 9)} />
		{/if}
	</div>
</div>

<style>
	.container {
		margin: 40px auto;
		width: max(50vw, 500px);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}

	#image-container {
		width: 100%;
		margin-top: 20px;
		position: relative;
	}

	#image-container > img {
		width: 100%;
		border-radius: 1rem;
	}

	button {
		/* Simple shape */
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		background-color: #d4a326;
		color: #fff;
		border: none;
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
		font-size: 1rem;
		line-height: 1.5;
		text-align: center;
	}

	.show-up {
		animation: show-up 4s linear ease-out;
	}

	@keyframes show-up {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
