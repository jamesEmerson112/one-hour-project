<script lang="ts">
	import type { Task } from '$lib/tasks_state.svelte';

	// Demo data - hardcoded completed tasks for development
	const demoTasks: Task[] = [
		{ id: '1', description: 'Set up project structure', createdAt: 1735900000, completedAt: 1735900300 },
		{ id: '2', description: 'Install dependencies', createdAt: 1735900400, completedAt: 1735900500 },
		{ id: '3', description: 'Configure Tailwind CSS', createdAt: 1735900600, completedAt: 1735900900 },
		{ id: '4', description: 'Create initial components', createdAt: 1735901000, completedAt: 1735901200 },
		{ id: '5', description: 'Set up routing', createdAt: 1735901300, completedAt: 1735901500 },
		{ id: '6', description: 'Add authentication flow', createdAt: 1735901600, completedAt: 1735902000 },
		{ id: '7', description: 'Design database schema', createdAt: 1735902100, completedAt: 1735902400 },
		{ id: '8', description: 'Implement localStorage', createdAt: 1735902500, completedAt: 1735902800 },
		{ id: '9', description: 'Write unit tests', createdAt: 1735902900, completedAt: 1735903200 },
		{ id: '10', description: 'Code review changes', createdAt: 1735903300, completedAt: 1735903500 },
		{ id: '11', description: 'Deploy to staging', createdAt: 1735903600, completedAt: 1735903900 },
		{ id: '12', description: 'Fix reported bugs', createdAt: 1735904000, completedAt: 1735904300 }
	];

	// Sort by completedAt descending (newest first)
	const sortedTasks = demoTasks.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
</script>

<div class="h-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-4">
	<h2 class="mb-4 text-xl font-semibold">Archive</h2>
	<ul class="space-y-2">
		{#each sortedTasks as task (task.id)}
			<li class="rounded bg-gray-50 px-3 py-2 text-gray-700">
				{task.description}
			</li>
		{/each}
	</ul>
</div>
