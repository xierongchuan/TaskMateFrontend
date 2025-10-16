<x-layouts.app>
    <div class="mb-6" x-data="tasksIndex">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Tasks') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Manage and track tasks') }}</p>
            </div>
            <a href="{{ route('tasks.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Create Task') }}
            </a>
        </div>

        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mt-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Search') }}
                    </label>
                    <input type="text" x-model="filters.search" @input.debounce.300ms="loadTasks"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="{{ __('Search tasks...') }}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Status') }}
                    </label>
                    <select x-model="filters.status" @change="loadTasks"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">{{ __('All') }}</option>
                        <option value="active">{{ __('Active') }}</option>
                        <option value="completed">{{ __('Completed') }}</option>
                        <option value="overdue">{{ __('Overdue') }}</option>
                        <option value="postponed">{{ __('Postponed') }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Task Type') }}
                    </label>
                    <select x-model="filters.task_type" @change="loadTasks"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">{{ __('All') }}</option>
                        <option value="individual">{{ __('Individual') }}</option>
                        <option value="group">{{ __('Group') }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Dealership') }}
                    </label>
                    <select x-model="filters.dealership_id" @change="loadTasks"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">{{ __('All') }}</option>
                        <template x-for="dealership in dealerships" :key="dealership.id">
                            <option :value="dealership.id" x-text="dealership.name"></option>
                        </template>
                    </select>
                </div>
            </div>
        </div>

        <!-- Tasks List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <!-- Loading State -->
            <div x-show="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading tasks...') }}</p>
            </div>

            <!-- Tasks Table -->
            <div x-show="!loading && tasks.length > 0" class="overflow-x-auto">
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
                        <template x-for="task in tasks" :key="task.id">
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-800 dark:text-gray-100" x-text="task.title"></div>
                                    <template x-if="task.postpone_count > 1">
                                        <div class="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                            {{ __('Postponed') }} <span x-text="task.postpone_count"></span>x
                                        </div>
                                    </template>
                                    <template x-if="task.tags && task.tags.length > 0">
                                        <div class="flex gap-1 mt-1">
                                            <template x-for="tag in task.tags" :key="tag">
                                                <span class="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" x-text="tag"></span>
                                            </template>
                                        </div>
                                    </template>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="ucfirst(task.task_type)"></span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="task.dealership?.name || '-'"></span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="task.deadline ? formatDateTime(task.deadline) : '-'"></span>
                                </td>
                                <td class="px-6 py-4">
                                    <span :class="getStatusClass(task)" class="px-2 py-1 text-xs rounded-full" x-text="getStatusText(task)"></span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <a :href="`/tasks/${task.id}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                            {{ __('View') }}
                                        </a>
                                        <a :href="`/tasks/${task.id}/edit`" class="text-gray-600 hover:text-gray-800 dark:text-gray-400">
                                            {{ __('Edit') }}
                                        </a>
                                        <button @click="confirmDelete(task.id)" class="text-red-600 hover:text-red-800 dark:text-red-400">
                                            {{ __('Delete') }}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div x-show="!loading && tasks.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{ __('Showing') }} <span x-text="pagination.from"></span> {{ __('to') }} <span x-text="pagination.to"></span> {{ __('of') }} <span x-text="pagination.total"></span> {{ __('tasks') }}
                    </div>
                    <div class="flex gap-2">
                        <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1"
                            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
                            {{ __('Previous') }}
                        </button>
                        <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page"
                            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
                            {{ __('Next') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div x-show="!loading && tasks.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
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
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('tasksIndex', () => ({
                tasks: [],
                dealerships: [],
                loading: true,
                filters: {
                    search: '',
                    status: '',
                    task_type: '',
                    dealership_id: '',
                },
                pagination: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 15,
                    total: 0,
                    from: 0,
                    to: 0,
                },
                async init() {
                    await this.loadDealerships();
                    await this.loadTasks();
                },
                async loadDealerships() {
                    try {
                        const data = await window.apiClient.getDealerships({ per_page: 100, is_active: true });
                        this.dealerships = data.data || [];
                    } catch (error) {
                        console.error('Error loading dealerships:', error);
                    }
                },
                async loadTasks() {
                    this.loading = true;
                    try {
                        const params = {
                            page: this.pagination.current_page,
                            per_page: this.pagination.per_page,
                            ...this.filters,
                        };
                        // Remove empty filters
                        Object.keys(params).forEach(key => {
                            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                                delete params[key];
                            }
                        });

                        const data = await window.apiClient.getTasks(params);
                        this.tasks = data.data || [];
                        this.pagination = {
                            current_page: data.current_page || 1,
                            last_page: data.last_page || 1,
                            per_page: data.per_page || 15,
                            total: data.total || 0,
                            from: data.from || 0,
                            to: data.to || 0,
                        };
                    } catch (error) {
                        console.error('Error loading tasks:', error);
                        alert('{{ __('Failed to load tasks. Please try again.') }}');
                    } finally {
                        this.loading = false;
                    }
                },
                changePage(page) {
                    if (page < 1 || page > this.pagination.last_page) return;
                    this.pagination.current_page = page;
                    this.loadTasks();
                },
                ucfirst(str) {
                    if (!str) return '';
                    return str.charAt(0).toUpperCase() + str.slice(1);
                },
                formatDateTime(dateTime) {
                    try {
                        return new Date(dateTime).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } catch {
                        return dateTime;
                    }
                },
                getStatusText(task) {
                    // Check if task has completed responses
                    const hasCompleted = task.responses && task.responses.some(r => r.status === 'completed');
                    if (hasCompleted) return '{{ __('Completed') }}';

                    // Check if task is overdue
                    if (task.deadline) {
                        const deadline = new Date(task.deadline);
                        if (deadline < new Date()) return '{{ __('Overdue') }}';
                    }

                    // Check if postponed
                    if (task.postpone_count > 0) return '{{ __('Postponed') }}';

                    return '{{ __('Active') }}';
                },
                getStatusClass(task) {
                    const hasCompleted = task.responses && task.responses.some(r => r.status === 'completed');
                    if (hasCompleted) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';

                    if (task.deadline) {
                        const deadline = new Date(task.deadline);
                        if (deadline < new Date()) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                    }

                    if (task.postpone_count > 0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';

                    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                },
                async confirmDelete(taskId) {
                    if (confirm('{{ __('Are you sure you want to delete this task?') }}')) {
                        try {
                            await window.apiClient.deleteTask(taskId);
                            await this.loadTasks();
                            alert('{{ __('Task deleted successfully') }}');
                        } catch (error) {
                            console.error('Error deleting task:', error);
                            alert('{{ __('Failed to delete task. Please try again.') }}');
                        }
                    }
                }
            }));
        });
    </script>
</x-layouts.app>
