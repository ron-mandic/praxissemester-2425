<script lang="ts">
	import { UNKNOWN } from '$lib';
	import { playerName } from '$lib/stores/player-name';
</script>

<div id="prompter" class="px-2">{$playerName || UNKNOWN}</div>

<style lang="scss">
	#prompter {
		width: 260px;
		height: 51px;
		flex-shrink: 0;
		border-top: 2px solid #6eebea;
		border-left: 2px solid #6eebea;
		color: #fff;
		text-align: center;
		font-family: 'JetBrains Mono';
		font-size: 36px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background-color: #1c1f22;
	}
</style>
