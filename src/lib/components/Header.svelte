<script lang="ts">
	import { themeStore, type Theme } from '$lib/theme_state.svelte';

	let dropdownOpen = $state(false);

	function selectTheme(t: Theme) {
		themeStore.setTheme(t);
		dropdownOpen = false;
	}

	function getThemeLabel(t: Theme): string {
		return t.charAt(0).toUpperCase() + t.slice(1);
	}
</script>

<header class="flex items-center justify-between px-4 py-2 {themeStore.isTerminal ? 'border-b border-dotted border-white' : themeStore.isDark ? 'border-b border-gray-700 bg-gray-800' : 'border-b border-gray-200 bg-white'}">
	<h1 class="{themeStore.isTerminal ? '' : 'font-sans'} text-lg">
		{themeStore.isTerminal ? '[ TO-DO APP ]' : 'To-Do App'}
	</h1>

	<!-- Theme Dropdown -->
	<div class="relative">
		<button
			onclick={() => dropdownOpen = !dropdownOpen}
			class="px-2 py-1 text-sm {themeStore.isTerminal ? '' : 'rounded'} {themeStore.isTerminal ? 'border border-dotted border-white' : themeStore.isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}"
		>
			{themeStore.isTerminal ? `[ ${getThemeLabel(themeStore.theme)} ▼ ]` : `${getThemeLabel(themeStore.theme)} ▼`}
		</button>

		{#if dropdownOpen}
			<!-- Backdrop to close dropdown -->
			<button
				class="fixed inset-0 z-10 cursor-default"
				onclick={() => dropdownOpen = false}
				aria-label="Close dropdown"
			></button>

			<!-- Dropdown Menu -->
			<div class="absolute right-0 z-20 mt-1 {themeStore.isTerminal ? '' : 'rounded shadow-lg'} {themeStore.isTerminal ? 'border border-dotted border-white bg-black' : themeStore.isDark ? 'border border-gray-600 bg-gray-800' : 'border border-gray-200 bg-white'}">
				{#if themeStore.isTerminal}
					<pre class="text-sm">{'·'.repeat(20)}</pre>
				{/if}
				{#each themeStore.themes as t}
					<button
						onclick={() => selectTheme(t)}
						class="block w-full px-3 py-1 text-left text-sm {themeStore.isTerminal ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} {t === themeStore.theme ? 'font-bold' : ''}"
					>
						{#if themeStore.isTerminal}
							: {t === themeStore.theme ? '>' : ' '} {getThemeLabel(t).padEnd(12)}:
						{:else}
							{t === themeStore.theme ? '✓ ' : '  '}{getThemeLabel(t)}
						{/if}
					</button>
				{/each}
				{#if themeStore.isTerminal}
					<pre class="text-sm">{'·'.repeat(20)}</pre>
				{/if}
			</div>
		{/if}
	</div>
</header>
