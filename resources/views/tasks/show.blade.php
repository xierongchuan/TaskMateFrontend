<x-layouts.app>
    <div class="mb-6" x-data="taskShow">
        <!-- Breadcrumbs -->
        <div class="mb-6 flex items-center text-sm">
            <a href="{{ route('dashboard') }}"
                class="text-blue-600 dark:text-blue-400 hover:underline">{{ __('Dashboard') }}</a>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <a href="{{ route('tasks.index') }}"
                class="text-blue-600 dark:text-blue-400 hover:underline">{{ __('Tasks') }}</a>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-500 dark:text-gray-400">{{ __('Task Details') }}</span>
        </div>

        <!-- Loading State -->
        <div x-show="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading task details...') }}</p>
        </div>

        <!-- Task Details -->
        <div x-show="!loading" class="space-y-6">
            <!-- Header with Actions -->
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100" x-text="task.title"></h1>
                    <div class="flex items-center gap-3 mt-2">
                        <span :class="getStatusClass(task)" class="px-3 py-1 text-sm rounded-full" x-text="getStatusText(task)"></span>
                        <span class="text-sm text-gray-600 dark:text-gray-400" x-text="ucfirst(task.task_type)"></span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">•</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400" x-text="ucfirst(task.response_type)"></span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <a :href="`/tasks/${task.id}/edit`"
                        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                        {{ __('Edit') }}
                    </a>
                    <button @click="deleteTask"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        {{ __('Delete') }}
                    </button>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column - Task Details -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Description -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{{ __('Description') }}</h2>
                        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap" x-text="task.description || '{{ __('No description provided') }}'"></p>
                    </div>

                    <!-- Comment -->
                    <div x-show="task.comment" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{{ __('Comment') }}</h2>
                        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap" x-text="task.comment"></p>
                    </div>

                    <!-- Assignments -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{{ __('Assigned Users') }}</h2>
                        <template x-if="!task.assignments || task.assignments.length === 0">
                            <p class="text-gray-500 dark:text-gray-400">{{ __('No users assigned') }}</p>
                        </template>
                        <div class="space-y-2">
                            <template x-for="assignment in (task.assignments || [])" :key="assignment.id">
                                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <p class="font-medium text-gray-800 dark:text-gray-100" x-text="assignment.user?.full_name || assignment.user?.first_name + ' ' + assignment.user?.last_name"></p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400" x-text="assignment.user?.role"></p>
                                    </div>
                                    <template x-if="assignment.response_status">
                                        <span :class="getResponseStatusClass(assignment.response_status)" class="px-2 py-1 text-xs rounded-full" x-text="ucfirst(assignment.response_status)"></span>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Responses -->
                    <div x-show="task.responses && task.responses.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{{ __('Responses') }}</h2>
                        <div class="space-y-3">
                            <template x-for="response in (task.responses || [])" :key="response.id">
                                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div class="flex items-start justify-between mb-2">
                                        <div>
                                            <p class="font-medium text-gray-800 dark:text-gray-100" x-text="response.user?.full_name || response.user?.first_name + ' ' + response.user?.last_name"></p>
                                            <p class="text-sm text-gray-500 dark:text-gray-400" x-text="formatDateTime(response.responded_at)"></p>
                                        </div>
                                        <span :class="getResponseStatusClass(response.status)" class="px-2 py-1 text-xs rounded-full" x-text="ucfirst(response.status)"></span>
                                    </div>
                                    <p x-show="response.comment" class="text-gray-700 dark:text-gray-300 text-sm" x-text="response.comment"></p>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Metadata -->
                <div class="space-y-6">
                    <!-- Task Info -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ __('Task Information') }}</h2>
                        <dl class="space-y-3">
                            <!-- Dealership -->
                            <div>
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Dealership') }}</dt>
                                <dd class="mt-1 text-sm text-gray-800 dark:text-gray-100" x-text="task.dealership?.name || '-'"></dd>
                            </div>

                            <!-- Appear Date -->
                            <div x-show="task.appear_date">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Appear Date') }}</dt>
                                <dd class="mt-1 text-sm text-gray-800 dark:text-gray-100" x-text="formatDateTime(task.appear_date)"></dd>
                            </div>

                            <!-- Deadline -->
                            <div x-show="task.deadline">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Deadline') }}</dt>
                                <dd class="mt-1 text-sm text-gray-800 dark:text-gray-100" x-text="formatDateTime(task.deadline)"></dd>
                            </div>

                            <!-- Recurrence -->
                            <div x-show="task.recurrence">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Recurrence') }}</dt>
                                <dd class="mt-1 text-sm text-gray-800 dark:text-gray-100" x-text="ucfirst(task.recurrence)"></dd>
                            </div>

                            <!-- Postpone Count -->
                            <div x-show="task.postpone_count > 0">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Postponed') }}</dt>
                                <dd class="mt-1 text-sm text-orange-600 dark:text-orange-400" x-text="task.postpone_count + ' {{ __('times') }}'"></dd>
                            </div>

                            <!-- Created At -->
                            <div x-show="task.created_at">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Created') }}</dt>
                                <dd class="mt-1 text-sm text-gray-800 dark:text-gray-100" x-text="formatDateTime(task.created_at)"></dd>
                            </div>

                            <!-- Updated At -->
                            <div x-show="task.updated_at">
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Last Updated') }}</dt>
                                <dd class="mt-1 text-sm text-gray-800 dark:text-gray-100" x-text="formatDateTime(task.updated_at)"></dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Tags -->
                    <div x-show="task.tags && task.tags.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{{ __('Tags') }}</h2>
                        <div class="flex flex-wrap gap-2">
                            <template x-for="tag in (task.tags || [])" :key="tag">
                                <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" x-text="tag"></span>
                            </template>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">{{ __('Actions') }}</h2>
                        <div class="space-y-2">
                            <a :href="`/tasks/${task.id}/edit`"
                                class="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors">
                                {{ __('Edit Task') }}
                            </a>
                            <a href="{{ route('tasks.index') }}"
                                class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                {{ __('Back to Tasks') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('taskShow', () => ({
                taskId: null,
                task: {},
                loading: true,
                async init() {
                    // Get task ID from URL
                    const pathParts = window.location.pathname.split('/');
                    this.taskId = pathParts[pathParts.length - 1]; // /tasks/{id}

                    await this.loadTask();
                },
                async loadTask() {
                    this.loading = true;
                    try {
                        this.task = await window.apiClient.getTask(this.taskId);
                    } catch (error) {
                        console.error('Error loading task:', error);
                        alert('{{ __('Failed to load task. Please try again.') }}');
                        window.location.href = '{{ route('tasks.index') }}';
                    } finally {
                        this.loading = false;
                    }
                },
                async deleteTask() {
                    if (!confirm('{{ __('Are you sure you want to delete this task?') }}')) {
                        return;
                    }

                    try {
                        await window.apiClient.deleteTask(this.taskId);
                        alert('{{ __('Task deleted successfully') }}');
                        window.location.href = '{{ route('tasks.index') }}';
                    } catch (error) {
                        console.error('Error deleting task:', error);
                        alert('{{ __('Failed to delete task. Please try again.') }}');
                    }
                },
                ucfirst(str) {
                    if (!str) return '';
                    return str.charAt(0).toUpperCase() + str.slice(1);
                },
                formatDateTime(dateTime) {
                    if (!dateTime) return '';
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
                getResponseStatusClass(status) {
                    switch (status) {
                        case 'completed':
                            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                        case 'acknowledged':
                            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                        case 'postponed':
                            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                        default:
                            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                    }
                },
            }));
        });
    </script>
</x-layouts.app>
