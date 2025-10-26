<x-layouts.app>
    <div class="mb-6" x-data="usersIndex">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Employees') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Manage employees and their roles') }}</p>
            </div>
            <a href="{{ route('users.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Add Employee') }}
            </a>
        </div>

        <!-- Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mt-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Search') }}
                    </label>
                    <input type="text" x-model="filters.search" @input.debounce.300ms="loadUsers"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="{{ __('Search by name or login...') }}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Phone') }}
                    </label>
                    <input type="text" x-model="filters.phone_number" @input.debounce.300ms="loadUsers"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="{{ __('Filter by phone...') }}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Role') }}
                    </label>
                    <select x-model="filters.role" @change="loadUsers"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">{{ __('All') }}</option>
                        <option value="employee">{{ __('Employee') }}</option>
                        <option value="manager">{{ __('Manager') }}</option>
                        <option value="observer">{{ __('Observer') }}</option>
                        <option value="owner">{{ __('Owner') }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Dealership') }}
                    </label>
                    <select x-model="filters.dealership_id" @change="loadUsers"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">{{ __('All') }}</option>
                        <template x-for="dealership in dealerships" :key="dealership.id">
                            <option :value="dealership.id" x-text="dealership.name"></option>
                        </template>
                    </select>
                </div>
            </div>
        </div>

        <!-- Users List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <!-- Loading State -->
            <div x-show="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading employees...') }}</p>
            </div>

            <!-- Error State -->
            <div x-show="!loading && error" class="text-center py-12 text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p x-text="error"></p>
                <button @click="loadUsers" class="mt-4 text-blue-600 hover:underline">
                    {{ __('Try again') }}
                </button>
            </div>

            <!-- Users Table -->
            <div x-show="!loading && !error && users.length > 0" class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr class="text-left text-sm text-gray-600 dark:text-gray-400">
                            <th class="px-6 py-3">{{ __('Name') }}</th>
                            <th class="px-6 py-3">{{ __('Login') }}</th>
                            <th class="px-6 py-3">{{ __('Phone') }}</th>
                            <th class="px-6 py-3">{{ __('Role') }}</th>
                            <th class="px-6 py-3">{{ __('Dealership') }}</th>
                            <th class="px-6 py-3">{{ __('Telegram ID') }}</th>
                            <th class="px-6 py-3">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <template x-for="user in users" :key="user.id">
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-800 dark:text-gray-100" x-text="user.full_name"></div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="user.login"></span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="(user.phone_number && user.phone_number.trim()) ? user.phone_number : '-'"></span>
                                </td>
                                <td class="px-6 py-4">
                                    <span :class="getRoleClass(user.role)" class="px-2 py-1 text-xs rounded-full font-medium" x-text="getRoleText(user.role)"></span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <template x-if="getDealershipById(user.dealership_id)">
                                        <a :href="`/dealerships/${user.dealership_id}`"
                                           class="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                                           x-text="getDealershipName(user.dealership_id)"></a>
                                    </template>
                                    <template x-if="!getDealershipById(user.dealership_id)">
                                        <span x-text="getDealershipName(user.dealership_id)"></span>
                                    </template>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="user.telegram_id || '-'"></span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <a :href="`/users/${user.id}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                            {{ __('View') }}
                                        </a>
                                        <a :href="`/users/${user.id}/edit`" class="text-gray-600 hover:text-gray-800 dark:text-gray-400">
                                            {{ __('Edit') }}
                                        </a>
                                        <button @click="confirmDelete(user.id)"
                                            class="text-red-600 hover:text-red-800 dark:text-red-400">
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
            <div x-show="!loading && !error && users.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{ __('Showing') }} <span x-text="pagination.from"></span> {{ __('to') }} <span x-text="pagination.to"></span> {{ __('of') }} <span x-text="pagination.total"></span> {{ __('employees') }}
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
            <div x-show="!loading && !error && users.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p>{{ __('No employees found') }}</p>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('usersIndex', () => ({
                users: [],
                dealerships: [],
                loading: true,
                error: null,
                filters: {
                    search: '',
                    phone_number: '',
                    role: '',
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
                    await this.loadUsers();
                },
                async loadDealerships() {
                    try {
                        const data = await window.apiClient.getDealerships({ per_page: 100, is_active: true });
                        this.dealerships = data.data || [];
                    } catch (error) {
                        console.error('Error loading dealerships:', error);
                    }
                },
                async loadUsers() {
                    this.loading = true;
                    this.error = null;
                    try {
                        const params = {
                            page: this.pagination.current_page,
                            per_page: this.pagination.per_page,
                            search: this.filters.search,
                            phone_number: this.filters.phone_number, // Map phone_number filter
                            role: this.filters.role,
                            dealership_id: this.filters.dealership_id,
                        };
                        // Remove empty filters
                        Object.keys(params).forEach(key => {
                            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                                delete params[key];
                            }
                        });

                        const data = await window.apiClient.getUsers(params);
                        this.users = data.data || [];
                        this.pagination = {
                            current_page: data.current_page || 1,
                            last_page: data.last_page || 1,
                            per_page: data.per_page || 15,
                            total: data.total || 0,
                            from: data.from || 0,
                            to: data.to || 0,
                        };
                    } catch (error) {
                        console.error('Error loading users:', error);
                        this.error = '{{ __('Failed to load employees. Please try again.') }}';
                    } finally {
                        this.loading = false;
                    }
                },
                changePage(page) {
                    if (page < 1 || page > this.pagination.last_page) return;
                    this.pagination.current_page = page;
                    this.loadUsers();
                },
                getRoleText(role) {
                    const roles = {
                        employee: '{{ __('Employee') }}',
                        manager: '{{ __('Manager') }}',
                        observer: '{{ __('Observer') }}',
                        owner: '{{ __('Owner') }}'
                    };
                    return roles[role] || role;
                },
                getRoleClass(role) {
                    const classes = {
                        employee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                        manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                        observer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                        owner: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    };
                    return classes[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
                },
                getDealershipName(dealershipId) {
                    if (!dealershipId) return '-';

                    const dealership = this.dealerships.find(d => d.id === dealershipId);
                    if (dealership) {
                        return dealership.name;
                    }

                    return `Dealership ID: ${dealershipId}`;
                },
                getDealershipById(dealershipId) {
                    if (!dealershipId) return null;
                    return this.dealerships.find(d => d.id === dealershipId) || null;
                },
                async confirmDelete(userId) {
                    const user = this.users.find(u => u.id === userId);
                    const userName = user ? user.full_name || user.login : `User ID: ${userId}`;

                    if (confirm(`{{ __('Are you sure you want to delete this user?') }}\n${userName}`)) {
                        try {
                            console.log('Deleting user:', userId, userName);
                            const response = await window.apiClient.deleteUser(userId);
                            console.log('Delete response:', response);

                            await this.loadUsers();

                            // Handle different response formats
                            if (response && (response.success || response.message)) {
                                const message = response.message || '{{ __('User deleted successfully') }}';
                                alert(message);
                            } else {
                                alert('{{ __('User deleted successfully') }}');
                            }
                        } catch (error) {
                            console.error('Error deleting user:', error);

                            // Handle different error formats
                            let errorMessage = '{{ __('Failed to delete user. Please try again.') }}';
                            if (error.message) {
                                errorMessage = error.message;
                            } else if (error.response && error.response.data && error.response.data.message) {
                                errorMessage = error.response.data.message;
                            }

                            // Handle 422 errors with detailed information
                            if (error.response && error.response.status === 422 && error.response.data) {
                                const errorData = error.response.data;
                                if (errorData.related_data) {
                                    const relatedData = errorData.related_data;
                                    let relatedInfo = [];
                                    if (relatedData.shifts) relatedInfo.push(`${relatedData.shifts} shifts`);
                                    if (relatedData.task_assignments) relatedInfo.push(`${relatedData.task_assignments} task assignments`);
                                    if (relatedData.task_responses) relatedInfo.push(`${relatedData.task_responses} task responses`);
                                    if (relatedData.created_tasks) relatedInfo.push(`${relatedData.created_tasks} created tasks`);
                                    if (relatedData.created_links) relatedInfo.push(`${relatedData.created_links} created links`);
                                    if (relatedData.replacements_as_replacing) relatedInfo.push(`${relatedData.replacements_as_replacing} replacements as replacing`);
                                    if (relatedData.replacements_as_replaced) relatedInfo.push(`${relatedData.replacements_as_replaced} replacements as replaced`);

                                    if (relatedInfo.length > 0) {
                                        errorMessage = `Cannot delete user with related data: ${relatedInfo.join(', ')}. Please reassign or delete related records first.`;
                                    }
                                }
                            }

                            this.apiError = errorMessage;
                            alert(errorMessage);
                        }
                    }
                }
            }));
        });
    </script>
</x-layouts.app>
