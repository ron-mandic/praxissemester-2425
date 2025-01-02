<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { teams }: { teams: { name: string; logo: any; label: string; disabled?: boolean }[] } =
		$props();

	const sidebar = useSidebar();
	let currentTeam = $state(teams[0]);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground"
						>
							<currentTeam.logo class="size-4 text-black" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">
								{currentTeam.name}
							</span>
							<span class="truncate text-xs text-muted-foreground">{currentTeam.label}</span>
						</div>
						<ChevronsUpDown class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>

			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-xs text-muted-foreground">Applications</DropdownMenu.Label>
				{#each teams as team, index (team.name)}
					<DropdownMenu.Item onSelect={() => (currentTeam = team)} class="cursor-pointer gap-2 p-2">
						<div class="flex size-6 cursor-pointer items-center justify-center rounded-sm border">
							<team.logo class="size-4 shrink-0" />
						</div>
						<span class="pointer-events-none">{team.name}</span>
						<DropdownMenu.Shortcut class="pointer-events-none">⌘{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
