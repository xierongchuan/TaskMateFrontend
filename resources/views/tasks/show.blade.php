<x-layouts.app>
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ $task->title }}</h1>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p class="text-gray-600 dark:text-gray-400">{{ $task->description }}</p>
    </div>
</x-layouts.app>
