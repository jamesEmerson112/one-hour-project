<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { themeStore } from '$lib/theme_state.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if themeStore.isTerminal}
	<!-- Terminal Theme: Black bg, dot borders, monospace -->
	<div class="flex min-h-screen flex-col bg-black font-mono text-white">
		<!-- Top dot border -->
		<div class="select-none text-center tracking-widest">{'·'.repeat(80)}</div>

		<div class="flex flex-1">
			<!-- Left dot border -->
			<div class="flex select-none flex-col px-1">
				{#each Array(50) as _}
					<span>·</span>
				{/each}
			</div>

			<!-- Main content -->
			<div class="flex flex-1 flex-col">
				<Header />
				<div class="flex-1 p-2">
					{@render children()}
				</div>
			</div>

			<!-- Right dot border -->
			<div class="flex select-none flex-col px-1">
				{#each Array(50) as _}
					<span>·</span>
				{/each}
			</div>
		</div>

		<!-- Bottom dot border -->
		<div class="select-none text-center tracking-widest">{'·'.repeat(80)}</div>
	</div>
{:else}
	<!-- Dark/Light Themes: Standard layout -->
	<div class="flex min-h-screen flex-col {themeStore.isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}">
		<Header />
		<div class="flex-1 p-4">
			{@render children()}
		</div>
	</div>
{/if}
