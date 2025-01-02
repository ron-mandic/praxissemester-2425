<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let {
		items
	}: {
		items: {
			title: string;
			url: string;
			// this should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			open?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	} = $props();

	const { toggle, isMobile } = useSidebar();

	const handleAnchorClick = (
		event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
		url: string
	) => {
		if (page.url.pathname === url) {
			event.preventDefault();
			if (isMobile) toggle();
			return false;
		}

		setTimeout(() => {
			if (isMobile) toggle();
		}, 500);
	};

	const handleButtonNavigate = (url: string) => {
		if (page.url.pathname !== url) {
			goto(url);
		}
	};
</script>

<Sidebar.Group class="mt-2">
	<Sidebar.GroupLabel class="pointer-events-none">Services</Sidebar.GroupLabel>
	<Sidebar.Menu class="select-none">
		{#each items as itemParent (itemParent)}
			{@const isParentOpen = itemParent.open || page.url.pathname.includes(itemParent.url)}
			{@const isParentOpenOnly =
				page.url.pathname.includes(itemParent.url) && page.url.pathname !== itemParent.url}
			{@const noItems = !itemParent.items!.length}

			<Collapsible.Root open={isParentOpen} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger
							class={{
								'bg-sidebar-primary transition-colors hover:bg-blue-600 active:bg-blue-600':
									isParentOpen,
								'bg-sidebar-primary/30 transition-colors hover:bg-sidebar-primary/40 text-blue-200 hover:text-blue-200':
									isParentOpenOnly
							}}
							disabled={noItems}
							style="padding-top: 1.125rem; padding-bottom: 1.125rem;"
							onclick={() => handleButtonNavigate(itemParent.url)}
						>
							{#snippet child({ props })}
								<Sidebar.MenuButton {...props}>
									{#snippet tooltipContent()}
										{itemParent.title}
									{/snippet}

									{#if itemParent.icon}
										<itemParent.icon class="pointer-events-none" />
									{/if}

									<span
										class="pointer-events-none w-full overflow-hidden text-ellipsis whitespace-nowrap"
										>{itemParent.title}</span
									>
									<ChevronRight
										class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									/>
								</Sidebar.MenuButton>
							{/snippet}
						</Collapsible.Trigger>

						<Collapsible.Content>
							{#if itemParent.items}
								<Sidebar.MenuSub class="mr-0 py-1 pr-0">
									{#each itemParent.items as itemChild (itemChild)}
										{@const isChildOpen = isParentOpen && page.url.pathname.includes(itemChild.url)}

										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton
												class={{
													'bg-sidebar-primary transition-colors hover:bg-blue-600 active:bg-blue-600':
														isChildOpen
												}}
											>
												{#snippet child({ props })}
													<a
														href={itemChild.url}
														style="padding-top: 1.125rem; padding-bottom: 1.125rem;"
														onclick={(e) => handleAnchorClick(e, itemChild.url)}
														{...props}
													>
														<span class="pointer-events-none">{itemChild.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
