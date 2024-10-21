<script lang="ts">
	// Scroll down to see the original Component
	import { cn } from '$lib/utils';
	import AnimatedBeam from './AnimatedBeam.svelte';
	import Circle from './Circle.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import IconOpenAI from './IconOpenAI.svelte';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '@/ui/badge';

	let containerRef;

	let div1Ref;
	let div2Ref;
	let div3Ref;
	let div4Ref;
	let div5Ref;
	let div6Ref;
	let div7Ref;
	let div8Ref;
	let div9Ref;
	let div10Ref;
	let div11Ref;

	let {
		class: className,
		outputs,
		selectedToken,
		handleSelectedToken
	} = $props<{
		class: string;
		outputs: any;
		selectedToken: string;
		handleSelectedToken: (event: Event) => void;
	}>();
</script>

<!-- svelte-ignore non_reactive_update -->
<div
	bind:this={containerRef}
	class={cn(
		'relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-lg',
		className
	)}
>
	<div
		class="absolute right-5 top-0 h-px w-1/2 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent"
	></div>

	<div class="flex h-full w-full max-w-lg flex-row items-center justify-between gap-10">
		<div class="flex flex-col justify-center gap-6">
			<!-- Div 1 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center" bind:this={div1Ref}>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div>
								<Badge
									class="box-border max-h-[26px] w-full max-w-24 text-base {selectedToken &&
									outputs.top_k[0]?.token === selectedToken
										? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
										: 'text-foreground'}"
									variant="secondary"
									data-token={outputs.top_k[0]?.token}
									onclick={handleSelectedToken}
								>
									<span class="max-w-24 overflow-hidden text-ellipsis whitespace-pre"
										>{outputs.top_k[0]?.token ?? 'Error'}</span
									>
								</Badge>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content class="p-0">
							<Table.Root class="m-0 p-0 text-sm">
								<Table.Body>
									<Table.Row>
										<Table.Cell>Rohwert (Logit)</Table.Cell>
										<Table.Cell class="font-mono"
											>{outputs.top_k[0]?.logit.toFixed(2) ?? 'Error'}</Table.Cell
										>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Attentionmaske</Table.Cell>
										<Table.Cell class="text-right font-mono"
											>{outputs.stats.attention_mask[0][0] ?? 'Error'}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</Circle>
			<!-- Div 2 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center" bind:this={div2Ref}>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div>
								<Badge
									class="box-border max-h-[26px] w-full max-w-24 text-base {selectedToken &&
									outputs.top_k[1]?.token === selectedToken
										? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
										: 'text-foreground'}"
									variant="secondary"
									data-token={outputs.top_k[1]?.token}
									onclick={handleSelectedToken}
								>
									<span class="max-w-24 overflow-hidden text-ellipsis whitespace-pre"
										>{outputs.top_k[1]?.token ?? 'Error'}</span
									>
								</Badge>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content class="p-0">
							<Table.Root class="m-0 p-0 text-sm">
								<Table.Body>
									<Table.Row>
										<Table.Cell>Rohwert (Logit)</Table.Cell>
										<Table.Cell class="font-mono"
											>{outputs.top_k[1]?.logit.toFixed(2) ?? 'Error'}</Table.Cell
										>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Attentionmaske</Table.Cell>
										<Table.Cell class="text-right font-mono"
											>{outputs.stats.attention_mask[0][1] ?? 'Error'}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</Circle>
			<!-- Div 3 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center" bind:this={div3Ref}>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div>
								<Badge
									class="box-border max-h-[26px] w-full max-w-24 text-base {selectedToken &&
									outputs.top_k[2]?.token === selectedToken
										? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
										: 'text-foreground'}"
									variant="secondary"
									data-token={outputs.top_k[2]?.token}
									onclick={handleSelectedToken}
								>
									<span class="max-w-24 overflow-hidden text-ellipsis whitespace-pre"
										>{outputs.top_k[2]?.token ?? 'Error'}</span
									>
								</Badge>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content class="p-0">
							<Table.Root class="m-0 p-0 text-sm">
								<Table.Body>
									<Table.Row>
										<Table.Cell>Rohwert (Logit)</Table.Cell>
										<Table.Cell class="font-mono"
											>{outputs.top_k[2]?.logit.toFixed(2) ?? 'Error'}</Table.Cell
										>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Attentionmaske</Table.Cell>
										<Table.Cell class="text-right font-mono"
											>{outputs.stats.attention_mask[0][2] ?? 'Error'}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</Circle>
			<!-- Div 4 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center" bind:this={div4Ref}>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div>
								<Badge
									class="box-border max-h-[26px] w-full max-w-24 text-base {selectedToken &&
									outputs.top_k[3]?.token === selectedToken
										? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
										: 'text-foreground'}"
									variant="secondary"
									data-token={outputs.top_k[3]?.token}
									onclick={handleSelectedToken}
								>
									<span class="max-w-24 overflow-hidden text-ellipsis whitespace-pre"
										>{outputs.top_k[3]?.token ?? 'Error'}</span
									>
								</Badge>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content class="p-0">
							<Table.Root class="m-0 p-0 text-sm">
								<Table.Body>
									<Table.Row>
										<Table.Cell>Rohwert (Logit)</Table.Cell>
										<Table.Cell class="font-mono"
											>{outputs.top_k[3]?.logit.toFixed(2) ?? 'Error'}</Table.Cell
										>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Attentionmaske</Table.Cell>
										<Table.Cell class="text-right font-mono"
											>{outputs.stats.attention_mask[0][3] ?? 'Error'}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</Circle>
			<!-- Div 5 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center" bind:this={div5Ref}>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div>
								<Badge
									class="box-border max-h-[26px] w-full max-w-24 text-base {selectedToken &&
									outputs.top_k[4]?.token === selectedToken
										? 'border-blue-700 bg-blue-100 text-blue-700 outline outline-2 outline-offset-[-2px] hover:bg-blue-100'
										: 'text-foreground'}"
									variant="secondary"
									data-token={outputs.top_k[4]?.token}
									onclick={handleSelectedToken}
								>
									<span class="max-w-24 overflow-hidden text-ellipsis whitespace-pre"
										>{outputs.top_k[4]?.token ?? 'Error'}</span
									>
								</Badge>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content class="p-0">
							<Table.Root class="m-0 p-0 text-sm">
								<Table.Body>
									<Table.Row>
										<Table.Cell>Rohwert (Logit)</Table.Cell>
										<Table.Cell class="font-mono"
											>{outputs.top_k[4]?.logit.toFixed(2) ?? 'Error'}</Table.Cell
										>
									</Table.Row>
									<Table.Row>
										<Table.Cell>Attentionmaske</Table.Cell>
										<Table.Cell class="text-right font-mono"
											>{outputs.stats.attention_mask[0][4] ?? 'Error'}</Table.Cell
										>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</Circle>
		</div>
		<div class="flex flex-col justify-center">
			<!-- Div 6 -->
			<Circle class="w-12">
				<svg
					bind:this={div6Ref}
					xmlns="http://www.w3.org/2000/svg"
					width="256"
					height="260"
					preserveAspectRatio="xMidYMid"
					viewBox="0 0 256 260"
					class="scale-125"
					><path
						fill="#000"
						d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
					/></svg
				>
			</Circle>
		</div>
		<div class="flex flex-col justify-center gap-6">
			<!-- Div 7 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center font-mono" bind:this={div7Ref}>
					<p
						class="max-w-16 overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-sm"
					>
						{(outputs.top_k[0]?.probability * 100).toFixed(0)} %
					</p>
				</div>
			</Circle>

			<!-- Div 8 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center font-mono" bind:this={div8Ref}>
					<p
						class="max-w-16 overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-sm"
					>
						{(outputs.top_k[1]?.probability * 100).toFixed(0)} %
					</p>
				</div>
			</Circle>
			<!-- Div 9 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center font-mono" bind:this={div9Ref}>
					<p
						class="max-w-16 overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-sm"
					>
						{(outputs.top_k[2]?.probability * 100).toFixed(0)} %
					</p>
				</div>
			</Circle>

			<!-- Div 10 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center font-mono" bind:this={div10Ref}>
					<p
						class="max-w-16 overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-sm"
					>
						{(outputs.top_k[3]?.probability * 100).toFixed(0)} %
					</p>
				</div>
			</Circle>

			<!-- Div 11 -->
			<Circle>
				<div class="flex h-full w-full items-center justify-center font-mono" bind:this={div11Ref}>
					<p
						class="max-w-16 overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-sm"
					>
						{(outputs.top_k[4]?.probability * 100).toFixed(0)} %
					</p>
				</div>
			</Circle>
		</div>
	</div>

	<AnimatedBeam bind:containerRef bind:fromRef={div1Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div2Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div3Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div4Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div5Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div7Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div8Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div9Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div10Ref} bind:toRef={div6Ref} />
	<AnimatedBeam bind:containerRef bind:fromRef={div11Ref} bind:toRef={div6Ref} />
</div>
