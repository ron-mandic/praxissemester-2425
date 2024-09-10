<script>
	let inputs = $state('');
	let hasRequested = $state(false);
	let response = $state(null);

	async function sendRequest() {
		response = fetch('/api/audio', {
			method: 'POST',
			headers: { 'Content-Type': 'audio/flac' },
			body: JSON.stringify({ inputs })
		}).then((res) => res.blob());

		hasRequested = true;
		inputs = '';
	}
</script>

<div>
	<h1>Audio</h1>
	<input
		type="text"
		bind:value={inputs}
		placeholder="Hit me baby one more time"
		onchange={sendRequest}
	/>

	<div class="layout">
		{#if !hasRequested}
			<div>Please enter your text</div>
		{:else if response}
			{#await response}
				<div aria-busy="true"></div>
			{:then obj}
				<audio src={URL.createObjectURL(obj)} controls></audio>
			{:catch error}
				<p>{error.message}</p>
			{/await}
		{:else}
			<div aria-busy="true">No audio found</div>
		{/if}
	</div>
</div>

<style>
	.layout {
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	[aria-busy] {
		width: 100%;
		height: 100px;
	}
</style>
