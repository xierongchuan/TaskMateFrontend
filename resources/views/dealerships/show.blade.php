<x-layouts.app>
    <div class="mb-6" x-data="dealershipShow">
        <!-- Header -->
        <div class="flex items-center mb-4">
            <a href="{{ route('dealerships.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </a>
            <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100" x-text="dealership.name || '{{ __('Loading...') }}'"></h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Dealership details and management') }}</p>
            </div>
            <a :href="`/dealerships/${dealershipId}/edit`" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Edit') }}
            </a>
        </div>

        <!-- Loading State -->
        <div x-show="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading dealership...') }}</p>
        </div>

        <!-- Content -->
        <div x-show="!loading">
            <!-- Dealership Info Card -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ __('Name') }}</h3>
                        <p class="text-gray-800 dark:text-gray-100" x-text="dealership.name || '-'"></p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ __('Status') }}</h3>
                        <span :class="dealership.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                            class="px-2 py-1 text-xs rounded-full"
                            x-text="dealership.is_active ? '{{ __('Active') }}' : '{{ __('Inactive') }}'">
                        </span>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ __('Address') }}</h3>
                        <p class="text-gray-800 dark:text-gray-100" x-text="dealership.address || '-'"></p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ __('Phone') }}</h3>
                        <p class="text-gray-800 dark:text-gray-100" x-text="dealership.phone || '-'"></p>
                    </div>
                    <template x-if="dealership.description">
                        <div class="col-span-2">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ __('Description') }}</h3>
                            <p class="text-gray-800 dark:text-gray-100" x-text="dealership.description"></p>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <!-- Tab Headers -->
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="flex space-x-4 px-6 pt-4" aria-label="Tabs">
                        <button @click="activeTab = 'users'" :class="activeTab === 'users' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                            class="pb-3 px-1 border-b-2 font-medium text-sm">
                            {{ __('Users') }}
                            <span class="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700" x-text="users.length"></span>
                        </button>
                        <button @click="activeTab = 'shifts'" :class="activeTab === 'shifts' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                            class="pb-3 px-1 border-b-2 font-medium text-sm">
                            {{ __('Shifts') }}
                            <span class="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700" x-text="shifts.length"></span>
                        </button>
                        <button @click="activeTab = 'tasks'" :class="activeTab === 'tasks' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                            class="pb-3 px-1 border-b-2 font-medium text-sm">
                            {{ __('Tasks') }}
                            <span class="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700" x-text="tasks.length"></span>
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="p-6">
                    <!-- Users Tab -->
                    <div x-show="activeTab === 'users'">
                        <div x-show="loadingUsers" class="text-center py-8">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                        </div>

                        <div x-show="!loadingUsers && users.length > 0" class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th class="pb-3">{{ __('Name') }}</th>
                                        <th class="pb-3">{{ __('Role') }}</th>
                                        <th class="pb-3">{{ __('Status') }}</th>
                                        <th class="pb-3">{{ __('Actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="text-sm">
                                    <template x-for="user in users" :key="user.id">
                                        <tr class="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                            <td class="py-3">
                                                <div class="font-medium text-gray-800 dark:text-gray-100" x-text="user.full_name || user.first_name + ' ' + user.last_name"></div>
                                            </td>
                                            <td class="py-3 text-gray-600 dark:text-gray-400" x-text="user.role || '-'"></td>
                                            <td class="py-3">
                                                <span :class="user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                                                    class="px-2 py-1 text-xs rounded-full"
                                                    x-text="user.is_active ? '{{ __('Active') }}' : '{{ __('Inactive') }}'">
                                                </span>
                                            </td>
                                            <td class="py-3">
                                                <a :href="`/users/${user.id}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                                    {{ __('View') }}
                                                </a>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <div x-show="!loadingUsers && users.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p>{{ __('No users assigned to this dealership') }}</p>
                        </div>
                    </div>

                    <!-- Shifts Tab -->
                    <div x-show="activeTab === 'shifts'">
                        <div x-show="loadingShifts" class="text-center py-8">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                        </div>

                        <div x-show="!loadingShifts && shifts.length > 0" class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th class="pb-3">{{ __('User') }}</th>
                                        <th class="pb-3">{{ __('Start Time') }}</th>
                                        <th class="pb-3">{{ __('End Time') }}</th>
                                        <th class="pb-3">{{ __('Status') }}</th>
                                        <th class="pb-3">{{ __('Actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="text-sm">
                                    <template x-for="shift in shifts" :key="shift.id">
                                        <tr class="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                            <td class="py-3">
                                                <div class="font-medium text-gray-800 dark:text-gray-100" x-text="shift.user?.full_name || '-'"></div>
                                            </td>
                                            <td class="py-3 text-gray-600 dark:text-gray-400" x-text="formatDateTime(shift.shift_start)"></td>
                                            <td class="py-3 text-gray-600 dark:text-gray-400" x-text="shift.shift_end ? formatDateTime(shift.shift_end) : '-'"></td>
                                            <td class="py-3">
                                                <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    {{ __('Open') }}
                                                </span>
                                            </td>
                                            <td class="py-3">
                                                <a :href="`/shifts/${shift.id}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                                    {{ __('View') }}
                                                </a>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <div x-show="!loadingShifts && shifts.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>{{ __('No shifts found for this dealership') }}</p>
                        </div>
                    </div>

                    <!-- Tasks Tab -->
                    <div x-show="activeTab === 'tasks'">
                        <div x-show="loadingTasks" class="text-center py-8">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                        </div>

                        <div x-show="!loadingTasks && tasks.length > 0" class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th class="pb-3">{{ __('Title') }}</th>
                                        <th class="pb-3">{{ __('Type') }}</th>
                                        <th class="pb-3">{{ __('Deadline') }}</th>
                                        <th class="pb-3">{{ __('Status') }}</th>
                                        <th class="pb-3">{{ __('Actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="text-sm">
                                    <template x-for="task in tasks" :key="task.id">
                                        <tr class="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                            <td class="py-3">
                                                <div class="font-medium text-gray-800 dark:text-gray-100" x-text="task.title"></div>
                                            </td>
                                            <td class="py-3 text-gray-600 dark:text-gray-400" x-text="ucfirst(task.task_type)"></td>
                                            <td class="py-3 text-gray-600 dark:text-gray-400" x-text="task.deadline ? formatDateTime(task.deadline) : '-'"></td>
                                            <td class="py-3">
                                                <span :class="getTaskStatusClass(task)" class="px-2 py-1 text-xs rounded-full" x-text="getTaskStatusText(task)"></span>
                                            </td>
                                            <td class="py-3">
                                                <a :href="`/tasks/${task.id}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                                    {{ __('View') }}
                                                </a>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <div x-show="!loadingTasks && tasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>{{ __('No tasks found for this dealership') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('dealershipShow', () => ({
                dealershipId: null,
                dealership: {},
                users: [],
                shifts: [],
                tasks: [],
                loading: true,
                loadingUsers: false,
                loadingShifts: false,
                loadingTasks: false,
                activeTab: 'users',
                async init() {
                    // Get dealership ID from URL
                    const pathParts = window.location.pathname.split('/');
                    this.dealershipId = pathParts[pathParts.length - 1];
                    await this.loadDealership();

                    // Watch for tab changes and load data accordingly
                    this.$watch('activeTab', (newTab) => {
                        if (newTab === 'users' && this.users.length === 0) {
                            this.loadUsers();
                        } else if (newTab === 'shifts' && this.shifts.length === 0) {
                            this.loadShifts();
                        } else if (newTab === 'tasks' && this.tasks.length === 0) {
                            this.loadTasks();
                        }
                    });

                    // Load initial tab data
                    await this.loadUsers();
                },
                async loadDealership() {
                    try {
                        this.dealership = await window.apiClient.getDealership(this.dealershipId);
                    } catch (error) {
                        console.error('Error loading dealership:', error);
                        alert('{{ __('Failed to load dealership. Please try again.') }}');
                    } finally {
                        this.loading = false;
                    }
                },
                async loadUsers() {
                    this.loadingUsers = true;
                    try {
                        const data = await window.apiClient.getUsers({
                            dealership_id: this.dealershipId,
                            per_page: 100
                        });
                        this.users = data.data || [];
                    } catch (error) {
                        console.error('Error loading users:', error);
                    } finally {
                        this.loadingUsers = false;
                    }
                },
                async loadShifts() {
                    this.loadingShifts = true;
                    try {
                        const data = await window.apiClient.getShifts({
                            dealership_id: this.dealershipId,
                            per_page: 100
                        });
                        this.shifts = data.data || [];
                    } catch (error) {
                        console.error('Error loading shifts:', error);
                    } finally {
                        this.loadingShifts = false;
                    }
                },
                async loadTasks() {
                    this.loadingTasks = true;
                    try {
                        const data = await window.apiClient.getTasks({
                            dealership_id: this.dealershipId,
                            per_page: 100
                        });
                        this.tasks = data.data || [];
                    } catch (error) {
                        console.error('Error loading tasks:', error);
                    } finally {
                        this.loadingTasks = false;
                    }
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
                ucfirst(str) {
                    if (!str) return '';
                    return str.charAt(0).toUpperCase() + str.slice(1);
                },
                getTaskStatusText(task) {
                    const hasCompleted = task.responses && task.responses.some(r => r.status === 'completed');
                    if (hasCompleted) return '{{ __('Completed') }}';

                    if (task.deadline) {
                        const deadline = new Date(task.deadline);
                        if (deadline < new Date()) return '{{ __('Overdue') }}';
                    }

                    if (task.postpone_count > 0) return '{{ __('Postponed') }}';

                    return '{{ __('Active') }}';
                },
                getTaskStatusClass(task) {
                    const hasCompleted = task.responses && task.responses.some(r => r.status === 'completed');
                    if (hasCompleted) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';

                    if (task.deadline) {
                        const deadline = new Date(task.deadline);
                        if (deadline < new Date()) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                    }

                    if (task.postpone_count > 0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';

                    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                }
            }));
        });
    </script>
</x-layouts.app>
