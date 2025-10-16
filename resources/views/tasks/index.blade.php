<x-layouts.app>
    <div class="mb-6">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Tasks') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Manage and track tasks') }}</p>
            </div>
            <a href="{{ route('tasks.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Create Task') }}
            </a>
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form method="GET" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ __('Search') }}
                </label>
                <input type="text" name="search" value="{{ request('search') }}"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="{{ __('Search tasks...') }}">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ __('Status') }}
                </label>
                <select name="status"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option value="">{{ __('All') }}</option>
                    <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>{{ __('Active') }}
                    </option>
                    <option value="completed" {{ request('status') == 'completed' ? 'selected' : '' }}>
                        {{ __('Completed') }}</option>
                    <option value="overdue" {{ request('status') == 'overdue' ? 'selected' : '' }}>{{ __('Overdue') }}
                    </option>
                    <option value="postponed" {{ request('status') == 'postponed' ? 'selected' : '' }}>
                        {{ __('Postponed') }}</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ __('Dealership') }}
                </label>
                <select name="dealership_id"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option value="">{{ __('All') }}</option>
                    @foreach ($dealerships as $dealership)
                        <option value="{{ $dealership->id }}"
                            {{ request('dealership_id') == $dealership->id ? 'selected' : '' }}>
                            {{ $dealership->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="flex items-end">
                <button type="submit"
                    class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                    {{ __('Filter') }}
                </button>
            </div>
        </form>
    </div>

    <!-- Tasks List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        @if ($tasks->count() > 0)
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr class="text-left text-sm text-gray-600 dark:text-gray-400">
                            <th class="px-6 py-3">{{ __('Title') }}</th>
                            <th class="px-6 py-3">{{ __('Type') }}</th>
                            <th class="px-6 py-3">{{ __('Dealership') }}</th>
                            <th class="px-6 py-3">{{ __('Deadline') }}</th>
                            <th class="px-6 py-3">{{ __('Status') }}</th>
                            <th class="px-6 py-3">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        @foreach ($tasks as $task)
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-800 dark:text-gray-100">{{ $task->title }}</div>
                                    @if ($task->postpone_count > 1)
                                        <div class="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                            {{ __('Postponed') }} {{ $task->postpone_count }}x
                                        </div>
                                    @endif
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {{ ucfirst($task->task_type) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {{ $task->dealership->name ?? '-' }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    {{ $task->deadline ? $task->deadline->format('M d, Y H:i') : '-' }}
                                </td>
                                <td class="px-6 py-4">
                                    @if ($task->responses->where('status', 'completed')->count() > 0)
                                        <span
                                            class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            {{ __('Completed') }}
                                        </span>
                                    @elseif($task->deadline && $task->deadline->isPast())
                                        <span
                                            class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                            {{ __('Overdue') }}
                                        </span>
                                    @else
                                        <span
                                            class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {{ __('Active') }}
                                        </span>
                                    @endif
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <a href="{{ route('tasks.show', $task) }}"
                                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                            {{ __('View') }}
                                        </a>
                                        <a href="{{ route('tasks.edit', $task) }}"
                                            class="text-gray-600 hover:text-gray-800 dark:text-gray-400">
                                            {{ __('Edit') }}
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                {{ $tasks->links() }}
            </div>
        @else
            <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>{{ __('No tasks found') }}</p>
                <a href="{{ route('tasks.create') }}" class="text-blue-600 hover:underline mt-2 inline-block">
                    {{ __('Create your first task') }}
                </a>
            </div>
        @endif
    </div>
</x-layouts.app>
