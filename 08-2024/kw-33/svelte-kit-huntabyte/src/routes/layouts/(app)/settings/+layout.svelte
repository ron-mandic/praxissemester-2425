<div class="drawer lg:drawer-open">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-center justify-center">
		<!-- Page content here -->
		<label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden"> Open drawer </label>
	</div>
	<div class="drawer-side border-r-2">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-200 text-base-content min-h-full w-48 p-4">
			<!-- Sidebar content here -->
			<li><a href="/layouts/settings/">Main settings</a></li>
			<li><a href="/layouts/settings/profile">Profile settings</a></li>
			<li><a href="/layouts/settings/appearance">Appearance settings</a></li>
		</ul>
	</div>
</div>
