<x-layouts.app>
    <div class="mb-6" x-data="userShow">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </a>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100" x-text="user.full_name || '{{ __('Employee Profile') }}'"></h1>
            </div>
            <a :href="`/users/${userId}/edit`" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Edit Employee') }}
            </a>
        </div>

        <!-- Loading State -->
        <div x-show="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading employee data...') }}</p>
        </div>

        <!-- Error State -->
        <div x-show="!loading && error" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <div class="text-center text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p x-text="error"></p>
                <a href="{{ route('users.index') }}" class="mt-4 text-blue-600 hover:underline inline-block">
                    {{ __('Back to employees') }}
                </a>
            </div>
        </div>

        <!-- Content -->
        <div x-show="!loading && !error">
            <!-- Profile Card -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                        <!-- Avatar Placeholder -->
                        <div class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
                            <span x-text="getInitials(user.full_name)"></span>
                        </div>

                        <!-- User Info -->
                        <div>
                            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100" x-text="user.full_name"></h2>
                            <p class="text-gray-600 dark:text-gray-400 mt-1">@<span x-text="user.login"></span></p>
                            <div class="mt-2">
                                <span :class="getRoleClass(user.role)" class="px-3 py-1 text-sm rounded-full font-medium" x-text="getRoleText(user.role)"></span>
                            </div>
                        </div>
                    </div>

                    <!-- Status Badge -->
                    <div x-show="status" class="text-right">
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ __('Status') }}</div>
                        <span :class="status?.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                            class="px-3 py-1 text-sm rounded-full font-medium"
                            x-text="status?.is_active ? '{{ __('Active') }}' : '{{ __('Inactive') }}'">
                        </span>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ __('Phone') }}</div>
                        <div class="text-gray-800 dark:text-gray-100 font-medium" x-text="user.phone || '-'"></div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ __('Telegram ID') }}</div>
                        <div class="text-gray-800 dark:text-gray-100 font-medium font-mono" x-text="user.telegram_id || '-'"></div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ __('Dealership') }}</div>
                        <div class="text-gray-800 dark:text-gray-100 font-medium">
                            <template x-if="user.dealership">
                                <a :href="`/dealerships/${user.dealership.id}`" class="text-blue-600 hover:underline" x-text="user.dealership.name"></a>
                            </template>
                            <template x-if="!user.dealership">
                                <span>-</span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" x-show="status">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ __('Tasks Assigned') }}</p>
                            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1" x-text="status?.assigned_tasks_count || 0"></p>
                        </div>
                        <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ __('Completed Tasks') }}</p>
                            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1" x-text="status?.completed_tasks_count || 0"></p>
                        </div>
                        <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ __('Overdue Tasks') }}</p>
                            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1" x-text="status?.overdue_tasks_count || 0"></p>
                        </div>
                        <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Information -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ __('Additional Information') }}</h3>

                <div class="space-y-4">
                    <div class="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ __('Last Active') }}</div>
                        <div class="text-sm text-gray-800 dark:text-gray-100 font-medium" x-text="status?.last_active_at ? formatDateTime(status.last_active_at) : '-'"></div>
                    </div>

                    <div class="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ __('Last Shift') }}</div>
                        <div class="text-sm text-gray-800 dark:text-gray-100 font-medium">
                            <template x-if="status?.current_shift">
                                <span x-text="'{{ __('In Shift') }}'"></span>
                            </template>
                            <template x-if="!status?.current_shift">
                                <span>-</span>
                            </template>
                        </div>
                    </div>

                    <div class="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ __('Registered At') }}</div>
                        <div class="text-sm text-gray-800 dark:text-gray-100 font-medium" x-text="user.created_at ? formatDateTime(user.created_at) : '-'"></div>
                    </div>

                    <div class="flex items-start justify-between py-3">
                        <div class="text-sm text-gray-600 dark:text-gray-400">{{ __('Account ID') }}</div>
                        <div class="text-sm text-gray-800 dark:text-gray-100 font-medium font-mono" x-text="user.id"></div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-between items-center">
                <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                    {{ __('Back to Employees') }}
                </a>
                <div class="flex space-x-4">
                    <a href="#" @click.prevent="viewTasks" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                        {{ __('View Tasks') }}
                    </a>
                    <a :href="`/users/${userId}/edit`" class="text-gray-600 hover:text-gray-800 dark:text-gray-400">
                        {{ __('Edit Profile') }}
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('userShow', () => ({
                user: {},
                status: null,
                loading: true,
                error: null,
                userId: null,
                async init() {
                    // Get user ID from URL
                    const pathParts = window.location.pathname.split('/');
                    this.userId = pathParts[pathParts.length - 1];

                    await this.loadUser();
                    await this.loadUserStatus();
                },
                async loadUser() {
                    this.loading = true;
                    this.error = null;
                    try {
                        this.user = await window.apiClient.getUser(this.userId);
                    } catch (error) {
                        console.error('Error loading user:', error);
                        this.error = '{{ __('Failed to load employee data. Please try again.') }}';
                    } finally {
                        this.loading = false;
                    }
                },
                async loadUserStatus() {
                    try {
                        this.status = await window.apiClient.getUserStatus(this.userId);
                    } catch (error) {
                        console.error('Error loading user status:', error);
                        // Don't show error for status, it's optional
                    }
                },
                getInitials(name) {
                    if (!name) return '?';
                    const parts = name.split(' ');
                    if (parts.length >= 2) {
                        return (parts[0][0] + parts[1][0]).toUpperCase();
                    }
                    return name.substring(0, 2).toUpperCase();
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
                viewTasks() {
                    // Redirect to tasks page with user filter
                    window.location.href = `/tasks?user_id=${this.userId}`;
                }
            }));
        });
    </script>
</x-layouts.app>
