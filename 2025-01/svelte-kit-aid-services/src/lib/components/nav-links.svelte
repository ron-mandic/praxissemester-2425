<script lang="ts">
	// import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	// import { Ellipsis, ExternalLink, Share2 } from 'lucide-svelte/icons';

	let {
		projects
	}: {
		projects: {
			name: string;
			url: string;
			// This should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon: any;
		}[];
	} = $props();

	// const sidebar = useSidebar();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel class="pointer-events-none">Links</Sidebar.GroupLabel>
	<Sidebar.Menu class="select-none">
		{#each projects as item (item)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet tooltipContent()}
						{item.name}
					{/snippet}

					{#snippet child({ props })}
						<a
							href={item.url}
							{...props}
							target="_blank"
							rel="noopener noreferrer"
							style="padding-top: 1.125rem; padding-bottom: 1.125rem;"
						>
							<item.icon class="pointer-events-none" />
							<span
								class="pointer-events-none w-full overflow-hidden text-ellipsis whitespace-nowrap"
								>{item.name}</span
							>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
				<!-- <DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuAction showOnHover {...props}>
								<Ellipsis />
								<span class="sr-only">Show more</span>
							</Sidebar.MenuAction>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-48 rounded-lg"
						side={sidebar.isMobile ? 'bottom' : 'right'}
						align={sidebar.isMobile ? 'end' : 'start'}
					>
						<DropdownMenu.Item>
							<ExternalLink class="text-muted-foreground" />
							<span>View Project</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Share2 class="text-muted-foreground" />
							<span>Share Project</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root> -->
			</Sidebar.MenuItem>
		{/each}
		<!-- <Sidebar.MenuItem>
			<Sidebar.MenuButton class="text-sidebar-foreground/70">
				<Ellipsis class="text-sidebar-foreground/70" />
				<span>More</span>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem> -->
	</Sidebar.Menu>
</Sidebar.Group>
