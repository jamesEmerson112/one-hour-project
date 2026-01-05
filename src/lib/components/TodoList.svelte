<script lang="ts">
	import { taskStore } from '$lib/tasks_state.svelte.js';

	let newTaskDescription = $state('');

	function addTask() {
		if (newTaskDescription.trim()) {
			taskStore.addTask(newTaskDescription);
			newTaskDescription = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addTask();
		}
	}
</script>

<div class="flex h-full flex-col bg-linear-to-br from-blue-50 to-indigo-100 p-6">
	<!-- Header -->
	<div class="mb-6">
		<h2 class="mb-2 text-2xl font-bold text-gray-800">Todo List</h2>
		<p class="text-sm text-gray-600">Stay organized and get things done</p>
	</div>

	<!-- Tasks Container -->
	<div class="flex-1 overflow-y-auto">
		<div class="space-y-3">
			<!-- Empty State -->
			{#if taskStore.tasks.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<div class="mb-4 text-6xl">📝</div>
					<h3 class="mb-2 text-xl font-semibold text-gray-700">No tasks yet</h3>
					<p class="mb-6 text-gray-500">Start by adding your first task below!</p>
				</div>
			{/if}

			<!-- Existing Tasks -->
			{#each taskStore.tasks as task (task.id)}
				<div
					class="group flex items-center gap-2 rounded-xl {task.completedAt
						? 'border-green-100 bg-green-50'
						: 'border-gray-100 bg-white'} border px-4 pt-1 pb-2 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
				>
					<!-- Checkbox -->
					<button
						onclick={() =>
							task.completedAt
								? taskStore.uncompleteTask(task.id)
								: taskStore.completeTask(task.id)}
						class="flex h-6 w-6 items-center justify-center rounded-full border-2 {task.completedAt
							? 'border-green-500 bg-green-500'
							: 'border-gray-300 bg-white'} transition-all hover:border-green-400 hover:bg-green-50 focus:ring-2 focus:ring-green-400/20 focus:outline-none"
						title={task.completedAt ? 'Mark as incomplete' : 'Mark as complete'}
					>
						{#if task.completedAt}
							<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a 1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<div
								class="h-3 w-3 rounded-full border-2 border-transparent group-hover:border-green-400"
							></div>
						{/if}
					</button>

					<!-- Task Content -->
					<div class="min-w-0 flex-1">
						<input
							type="text"
							value={task.description}
							oninput={(e) => taskStore.updateTask(task.id, (e.target as HTMLInputElement).value)}
							onkeydown={(e) => {
								if (e.key === 'Enter') {
									(e.target as HTMLInputElement).blur();
								}
							}}
							class="w-full rounded-lg bg-transparent px-2 py-1 font-medium wrap-break-word {task.completedAt
								? 'text-gray-600 line-through'
								: 'text-gray-800'} border-0 outline-none focus:bg-blue-50/50 focus:ring-2 focus:ring-blue-400/30"
							placeholder="Task description..."
						/>
						<p class="mt-1 px-2 text-xs text-gray-500">
							{#if task.completedAt}
								Completed {new Date(task.completedAt * 1000).toLocaleDateString()}
							{:else}
								Created {new Date(task.createdAt * 1000).toLocaleDateString()}
							{/if}
						</p>
					</div>

					<!-- Action Buttons -->
					<div class="flex items-center gap-2">
						<button
							onclick={() => taskStore.deleteTask(task.id)}
							class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-400/20 focus:outline-none"
							title="Delete task"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 011-1V3a1 1 0 011 1z"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/each}

			<!-- Add New Task (Always Visible) -->
			<div
				class="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-4 transition-all hover:border-blue-400 hover:bg-blue-50/50"
			>
				<!-- Placeholder Checkbox -->
				<div
					class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white"
				>
					<div class="h-3 w-3 rounded-full border-2 border-transparent"></div>
				</div>

				<!-- New Task Input -->
				<div class="flex-1">
					<input
						type="text"
						bind:value={newTaskDescription}
						onkeydown={handleKeydown}
						placeholder="Add a new task..."
						class="w-full rounded-lg border-0 bg-transparent px-2 py-1 text-gray-600 placeholder-gray-400 outline-none focus:bg-blue-50/50 focus:text-gray-800 focus:ring-2 focus:ring-blue-400/30"
					/>
				</div>

				<!-- Add Button -->
				{#if newTaskDescription.trim()}
					<button
						onclick={addTask}
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white opacity-100 transition-all hover:bg-blue-600 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
						title="Add task"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Footer Stats -->
	{#if taskStore.tasks.length > 0}
		<div class="mt-6 rounded-xl border border-white/20 bg-white/50 p-4 backdrop-blur-sm">
			<div class="flex justify-between text-sm text-gray-600">
				<span>Total: <strong class="text-gray-800">{taskStore.tasks.length}</strong></span>
				<span
					>Active: <strong class="text-blue-600">{taskStore.incompleteTasks.length}</strong></span
				>
				<span>Done: <strong class="text-green-600">{taskStore.completedTasks.length}</strong></span>
			</div>
		</div>
	{/if}
</div>
