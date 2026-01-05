<script lang="ts">
	import type { Task } from '$lib/tasks_state.svelte';
	import { themeStore } from '$lib/theme_state.svelte';

	// Demo data - hardcoded completed tasks for development
	const demoTasks: Task[] = [
		{ id: '1', description: 'Set up project structure', createdAt: 1735900000, completedAt: 1735900300, archivedAt: 1735900400 },
		{ id: '2', description: 'Install dependencies', createdAt: 1735900400, completedAt: 1735900500, archivedAt: 1735900600 },
		{ id: '3', description: 'Configure Tailwind CSS', createdAt: 1735900600, completedAt: 1735900900, archivedAt: 1735901000 },
		{ id: '4', description: 'Create initial components', createdAt: 1735901000, completedAt: 1735901200, archivedAt: 1735901300 },
		{ id: '5', description: 'Set up routing', createdAt: 1735901300, completedAt: 1735901500, archivedAt: 1735901600 },
		{ id: '6', description: 'Add authentication flow', createdAt: 1735901600, completedAt: 1735902000, archivedAt: 1735902100 },
		{ id: '7', description: 'Design database schema', createdAt: 1735902100, completedAt: 1735902400, archivedAt: 1735902500 },
		{ id: '8', description: 'Implement localStorage', createdAt: 1735902500, completedAt: 1735902800, archivedAt: 1735902900 },
		{ id: '9', description: 'Write unit tests', createdAt: 1735902900, completedAt: 1735903200, archivedAt: 1735903300 },
		{ id: '10', description: 'Code review changes', createdAt: 1735903300, completedAt: 1735903500, archivedAt: 1735903600 },
		{ id: '11', description: 'Deploy to staging', createdAt: 1735903600, completedAt: 1735903900, archivedAt: 1735904000 },
		{ id: '12', description: 'Fix reported bugs', createdAt: 1735904000, completedAt: 1735904300, archivedAt: 1735904400 }
	];

	// Sort by completedAt descending (newest first)
	const sortedTasks = demoTasks.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
</script>

<div class="h-full overflow-y-auto p-4 {themeStore.isTerminal ? 'border border-dotted border-white' : themeStore.isDark ? 'rounded-lg border border-gray-700 bg-gray-800' : 'rounded-lg border border-gray-200 bg-white'}">
	<h2 class="mb-4 text-lg {themeStore.isTerminal ? '' : 'font-semibold'}">
		{themeStore.isTerminal ? '.: ARCHIVE :.' : 'Archive'}
	</h2>

	{#if themeStore.isTerminal}
		<!-- Terminal Mode: ASCII style -->
		<pre class="text-sm">{'·'.repeat(36)}
{#each sortedTasks as task}: {task.description.padEnd(33)}:
{/each}{'·'.repeat(36)}</pre>
	{:else}
		<!-- Dark/Light Mode: Standard list -->
		<ul class="space-y-2">
			{#each sortedTasks as task (task.id)}
				<li class="rounded px-3 py-2 {themeStore.isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}">
					{task.description}
				</li>
			{/each}
		</ul>
	{/if}
</div>
