<script lang="ts">
	import Todo from '$lib/components/Todo.svelte';
	import Archive from '$lib/components/Archive.svelte';
</script>

<main class="grid h-screen grid-cols-2 gap-4 p-4">
	<Todo />
	<Archive />
</main>
