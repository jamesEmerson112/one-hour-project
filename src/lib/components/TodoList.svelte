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

<div class="flex h-full flex-col bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
	<!-- Header -->
	<div class="mb-6">
		<h2 class="text-2xl font-bold text-gray-800 mb-2">Todo List</h2>
		<p class="text-sm text-gray-600">Stay organized and get things done</p>
	</div>

	<!-- Add Task Input -->
	<div class="mb-6">
		<div class="flex gap-3">
			<input
				type="text"
				bind:value={newTaskDescription}
				onkeydown={handleKeydown}
				placeholder="What needs to be done?"
				class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
			/>
			<button
				onclick={addTask}
				disabled={!newTaskDescription.trim()}
				class="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
			>
				Add
			</button>
		</div>
	</div>

	<!-- Tasks Container -->
	<div class="flex-1 overflow-y-auto">
		{#if taskStore.tasks.length === 0}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<div class="mb-4 text-6xl">📝</div>
				<h3 class="mb-2 text-xl font-semibold text-gray-700">No tasks yet</h3>
				<p class="text-gray-500">Add your first task above to get started!</p>
			</div>
		{:else}
			<!-- Active Tasks -->
			{#if taskStore.incompleteTasks.length > 0}
				<div class="mb-8">
					<h3 class="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-blue-500"></div>
						Active Tasks ({taskStore.incompleteTasks.length})
					</h3>
					<div class="space-y-3">
						{#each taskStore.incompleteTasks as task (task.id)}
							<div class="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200">
								<!-- Checkbox -->
								<button
									onclick={() => taskStore.completeTask(task.id)}
									class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all hover:border-green-400 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400/20"
									title="Mark as complete"
								>
									<div class="h-3 w-3 rounded-full border-2 border-transparent group-hover:border-green-400"></div>
								</button>

								<!-- Task Content -->
								<div class="flex-1 min-w-0">
									<p class="text-gray-800 font-medium break-words">{task.description}</p>
									<p class="text-xs text-gray-500 mt-1">
										Created {new Date(task.createdAt * 1000).toLocaleDateString()}
									</p>
								</div>

								<!-- Delete Button -->
								<button
									onclick={() => taskStore.deleteTask(task.id)}
									class="opacity-0 group-hover:opacity-100 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-400/20"
									title="Delete task"
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 011-1V3a1 1 0 011 1z" />
									</svg>
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Completed Tasks -->
			{#if taskStore.completedTasks.length > 0}
				<div>
					<h3 class="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-green-500"></div>
						Completed ({taskStore.completedTasks.length})
					</h3>
					<div class="space-y-3">
						{#each taskStore.completedTasks as task (task.id)}
							<div class="group flex items-center gap-4 rounded-xl bg-green-50 p-4 shadow-sm border border-green-100 transition-all hover:shadow-md">
								<!-- Completed Checkbox -->
								<button
									onclick={() => taskStore.uncompleteTask(task.id)}
									class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 border-2 border-green-500 transition-all hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/20"
									title="Mark as incomplete"
								>
									<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</button>

								<!-- Task Content -->
								<div class="flex-1 min-w-0">
									<p class="text-gray-600 font-medium break-words line-through">{task.description}</p>
									<p class="text-xs text-gray-500 mt-1">
										Completed {new Date(task.completedAt! * 1000).toLocaleDateString()}
									</p>
								</div>

								<!-- Delete Button -->
								<button
									onclick={() => taskStore.deleteTask(task.id)}
									class="opacity-0 group-hover:opacity-100 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-400/20"
									title="Delete task"
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 011-1V3a1 1 0 011 1z" />
									</svg>
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Footer Stats -->
	{#if taskStore.tasks.length > 0}
		<div class="mt-6 rounded-xl bg-white/50 p-4 backdrop-blur-sm border border-white/20">
			<div class="flex justify-between text-sm text-gray-600">
				<span>Total: <strong class="text-gray-800">{taskStore.tasks.length}</strong></span>
				<span>Active: <strong class="text-blue-600">{taskStore.incompleteTasks.length}</strong></span>
				<span>Done: <strong class="text-green-600">{taskStore.completedTasks.length}</strong></span>
			</div>
		</div>
	{/if}
</div>
