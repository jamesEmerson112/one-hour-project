export interface Task {
    id: string;
    description: string;
    createdAt: number; // UTC seconds
    completedAt: number | null; // UTC seconds or null for unfinished
    archivedAt: number | null; // UTC seconds or null for not archived
}

const STORAGE_KEY = 'tasks';

// Helper function to get current UTC timestamp in seconds
function getUtcSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

// Load tasks from LocalStorage
function loadTasks(): Task[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const tasks = JSON.parse(stored);
        // Validate that tasks have the correct structure
        return tasks.filter((task: any) =>
            task.id &&
            typeof task.description === 'string' &&
            typeof task.createdAt === 'number' &&
            (task.completedAt === null || typeof task.completedAt === 'number') &&
            (task.archivedAt === null || typeof task.archivedAt === 'number')
        );
    } catch (error) {
        console.error('Error loading tasks from LocalStorage:', error);
        return [];
    }
}

// Save tasks to LocalStorage
function saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to LocalStorage:', error);
    }
}

// Tasks state using Svelte 5 runes
let tasks = $state<Task[]>(loadTasks());

// Archive event callbacks for glass animation
type ArchiveCallback = (taskId: string) => void;
let archiveCallbacks: ArchiveCallback[] = [];
let unarchiveCallbacks: ArchiveCallback[] = [];

// Listen for localStorage changes from other tabs/windows
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY && event.newValue !== null) {
            try {
                const updatedTasks = JSON.parse(event.newValue);
                // Validate the tasks before updating state
                const validTasks = updatedTasks.filter((task: any) =>
                    task.id &&
                    typeof task.description === 'string' &&
                    typeof task.createdAt === 'number' &&
                    (task.completedAt === null || typeof task.completedAt === 'number') &&
                    (task.archivedAt === null || typeof task.archivedAt === 'number')
                );
                tasks = validTasks;
            } catch (error) {
                console.error('Error parsing tasks from storage event:', error);
            }
        }
    });
}

export const taskStore = {
    // Get all tasks
    get tasks(): Task[] {
        return tasks;
    },

    // Add a new task
    addTask(description: string): void {
        const newTask: Task = {
            id: crypto.randomUUID(),
            description: description.trim(),
            createdAt: getUtcSeconds(),
            completedAt: null,
            archivedAt: null
        };

        tasks = [...tasks, newTask];
        saveTasks(tasks);
    },

    // Complete a task
    completeTask(id: string): void {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, completedAt: getUtcSeconds() }
                : task
        );
        saveTasks(tasks);
    },

    // Uncomplete a task
    uncompleteTask(id: string): void {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, completedAt: null }
                : task
        );
        saveTasks(tasks);
    },

    // Archive a task
    archiveTask(id: string): void {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, archivedAt: getUtcSeconds() }
                : task
        );
        saveTasks(tasks);
        // Notify subscribers (for glass animation)
        archiveCallbacks.forEach(cb => cb(id));
    },

    // Unarchive a task
    unarchiveTask(id: string): void {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, archivedAt: null }
                : task
        );
        saveTasks(tasks);
        // Notify subscribers (for glass animation)
        unarchiveCallbacks.forEach(cb => cb(id));
    },

    // Update a task's description
    updateTask(id: string, description: string): void {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, description: description.trim() }
                : task
        );
        saveTasks(tasks);
    },

    // Delete a task
    deleteTask(id: string): void {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
    },

    // Get completed tasks
    get completedTasks(): Task[] {
        return tasks.filter(task => task.completedAt !== null);
    },

    // Get incomplete tasks
    get incompleteTasks(): Task[] {
        return tasks.filter(task => task.completedAt === null);
    },

    // Get archived tasks
    get archivedTasks(): Task[] {
        return tasks.filter(task => task.archivedAt !== null);
    },

    // Get active tasks (not archived)
    get activeTasks(): Task[] {
        return tasks.filter(task => task.archivedAt === null);
    },

    // Subscribe to archive events (for glass animation)
    onArchive(callback: ArchiveCallback): () => void {
        archiveCallbacks.push(callback);
        // Return unsubscribe function
        return () => {
            archiveCallbacks = archiveCallbacks.filter(cb => cb !== callback);
        };
    },

    // Subscribe to unarchive events (for glass animation)
    onUnarchive(callback: ArchiveCallback): () => void {
        unarchiveCallbacks.push(callback);
        // Return unsubscribe function
        return () => {
            unarchiveCallbacks = unarchiveCallbacks.filter(cb => cb !== callback);
        };
    }
};
