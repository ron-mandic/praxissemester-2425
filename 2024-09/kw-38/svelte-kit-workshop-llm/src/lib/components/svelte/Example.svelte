<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Selected } from 'bits-ui';

	// node_modules\bits-ui\dist\internal\types.d.ts
	type OnChangeFn<T> = (value: T) => void;

	const { list } = $props<{ list: { value: string; label: string }[] }>();
	const data = $state({
		name: '',
		framework: ''
	});

	const onSelectedChange: OnChangeFn<Selected<unknown> | undefined> = (v) => {
		if (v) {
			data.framework = v.value as string;
		}
	};

	function onClick() {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('framework', data.framework);

		console.log($state.snapshot(data));
		console.log(...formData);
	}

	$inspect(data).with(console.log);
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>Create project</Card.Title>
		<Card.Description>Deploy your new project in one-click.</Card.Description>
	</Card.Header>

	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Name</Label>
					<Input id="name" placeholder="Name of your project" bind:value={data.name} />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="framework">Framework</Label>
					<Select.Root {onSelectedChange}>
						<Select.Trigger id="framework">
							<Select.Value placeholder="Select framework" />
						</Select.Trigger>
						<Select.Content>
							{#each list as { value, label }}
								<Select.Item {value} {label}>{label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</form>
	</Card.Content>

	<Card.Footer class="flex justify-between">
		<Button variant="outline">Cancel</Button>
		<Button onclick={onClick}>Deploy</Button>
	</Card.Footer>
</Card.Root>
