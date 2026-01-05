<script lang="ts">
	import { themeStore } from '$lib/theme_state.svelte';
	// To-do component - Gaelan's implementation
</script>

<div class="h-full p-4 {themeStore.isTerminal ? 'border border-dotted border-white' : themeStore.isDark ? 'rounded-lg border border-gray-700 bg-gray-800' : 'rounded-lg border border-gray-200 bg-white'}">
	<h2 class="mb-4 text-lg {themeStore.isTerminal ? '' : 'font-semibold'}">
		{themeStore.isTerminal ? '.: TO-DO :.' : 'To-Do'}
	</h2>
	<div class="{themeStore.isTerminal ? 'text-gray-400' : themeStore.isDark ? 'text-gray-400' : 'text-gray-500'}">
		{#if themeStore.isTerminal}
			<p>( waiting for implementation )</p>
		{:else}
			<p class="italic">Waiting for implementation...</p>
		{/if}
	</div>
</div>
