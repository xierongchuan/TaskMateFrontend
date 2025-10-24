<x-layouts.app>
    <div class="mb-6" x-data="dealershipsIndex">
        <!-- API Configuration Error -->
        <div x-show="apiError" x-transition
            class="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                </svg>
                <span x-text="apiError"></span>
                <button @click="apiError = null" class="ml-auto text-yellow-500 hover:text-yellow-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <div class="mt-2 text-sm">
                <a href="/settings/bot-api" class="underline hover:no-underline">{{ __('Configure API settings') }}</a>
            </div>
        </div>

        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Dealerships') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Manage dealership locations') }}</p>
            </div>
            <a href="{{ route('dealerships.create') }}"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Create Dealership') }}
            </a>
        </div>

        <!-- Filters -->
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mt-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Search') }}
                    </label>
                    <input type="text" x-model="filters.search" @input.debounce.300ms="loadDealerships"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        placeholder="{{ __('Search dealerships...') }}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Status') }}
                    </label>
                    <select x-model="filters.is_active" @change="loadDealerships"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="">{{ __('All') }}</option>
                        <option value="1">{{ __('Active') }}</option>
                        <option value="0">{{ __('Inactive') }}</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Dealerships List -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <!-- Loading State -->
            <div x-show="loading" class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100">
                </div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading dealerships...') }}</p>
            </div>

            <!-- Dealerships Table -->
            <div x-show="!loading && dealerships.length > 0" class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr class="text-left text-sm text-gray-600 dark:text-gray-400">
                            <th class="px-6 py-3">{{ __('Name') }}</th>
                            <th class="px-6 py-3">{{ __('Address') }}</th>
                            <th class="px-6 py-3">{{ __('Phone') }}</th>
                            <th class="px-6 py-3">{{ __('Status') }}</th>
                            <th class="px-6 py-3">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <template x-for="dealership in dealerships" :key="dealership.id">
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-800 dark:text-gray-100" x-text="dealership.name">
                                    </div>
                                    <template x-if="dealership.description">
                                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                            x-text="truncate(dealership.description, 60)"></div>
                                    </template>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="dealership.address || '-'"></span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span x-text="dealership.phone || '-'"></span>
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        :class="dealership.is_active ?
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                                        class="px-2 py-1 text-xs rounded-full"
                                        x-text="dealership.is_active ? '{{ __('Active') }}' : '{{ __('Inactive') }}'">
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <a :href="`/dealerships/${dealership.id}`"
                                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                            {{ __('View') }}
                                        </a>
                                        <a :href="`/dealerships/${dealership.id}/edit`"
                                            class="text-gray-600 hover:text-gray-800 dark:text-gray-400">
                                            {{ __('Edit') }}
                                        </a>
                                        <button @click="confirmDelete(dealership.id)"
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
            <div x-show="!loading && dealerships.length > 0"
                class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{ __('Showing') }} <span x-text="pagination.from"></span> {{ __('to') }} <span
                            x-text="pagination.to"></span> {{ __('of') }} <span x-text="pagination.total"></span>
                        {{ __('dealerships') }}
                    </div>
                    <div class="flex gap-2">
                        <button @click="changePage(pagination.current_page - 1)"
                            :disabled="pagination.current_page <= 1"
                            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
                            {{ __('Previous') }}
                        </button>
                        <button @click="changePage(pagination.current_page + 1)"
                            :disabled="pagination.current_page >= pagination.last_page"
                            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700">
                            {{ __('Next') }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div x-show="!loading && dealerships.length === 0"
                class="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p>{{ __('No dealerships found') }}</p>
                <a href="{{ route('dealerships.create') }}" class="text-blue-600 hover:underline mt-2 inline-block">
                    {{ __('Create your first dealership') }}
                </a>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('dealershipsIndex', () => ({
                dealerships: [],
                loading: true,
                apiError: null,
                filters: {
                    search: '',
                    is_active: '',
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
                    // Wait for apiClient to be available
                    let retries = 0;
                    while (!window.apiClient && retries < 50) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        retries++;
                    }

                    if (!window.apiClient) {
                        this.apiError = 'API client not loaded. Please refresh the page.';
                        this.loading = false;
                        return;
                    }

                    console.log('API Client found:', window.apiClient);

                    // Initialize with empty search to trigger same behavior as manual search
                    this.filters.search = '';
                    await this.loadDealerships();
                },
                async loadDealerships() {
                    this.loading = true;
                    this.apiError = null;
                    try {
                        const params = {
                            page: this.pagination.current_page,
                            per_page: this.pagination.per_page,
                            ...this.filters,
                        };
                        // Remove empty filters
                        Object.keys(params).forEach(key => {
                            if (params[key] === '' || params[key] === null || params[
                                    key] === undefined) {
                                delete params[key];
                            }
                        });

                        console.log('Loading dealerships with params:', params);
                        const data = await window.apiClient.getDealerships(params);
                        console.log('Received dealerships data:', data);

                        this.dealerships = data.data || [];
                        this.pagination = {
                            current_page: data.current_page || 1,
                            last_page: data.last_page || 1,
                            per_page: data.per_page || 15,
                            total: data.total || 0,
                            from: data.from || 0,
                            to: data.to || 0,
                        };
                    } catch (error) {
                        console.error('Error loading dealerships:', error);

                        // Handle different types of errors
                        if (error.message.includes('CSRF')) {
                            this.apiError =
                                '{{ __('CSRF token expired. Please refresh the page.') }}';
                        } else if (error.message.includes('API token not configured')) {
                            this.apiError =
                                '{{ __('API token not configured. Please configure your API settings.') }}';
                        } else if (error.message.includes('Failed to connect')) {
                            this.apiError =
                                '{{ __('Unable to connect to API server. Please check your API URL and network connection.') }}';
                        } else {
                            this.apiError = error.message ||
                                '{{ __('Failed to load dealerships. Please try again.') }}';
                        }

                        // Don't show alert for initial load, only show error banner
                        if (this.dealerships.length > 0) {
                            // Only show alert if user was already viewing data
                            alert(this.apiError);
                        }
                    } finally {
                        this.loading = false;
                    }
                },
                changePage(page) {
                    if (page < 1 || page > this.pagination.last_page) return;
                    this.pagination.current_page = page;
                    this.loadDealerships();
                },
                truncate(text, length) {
                    if (!text) return '';
                    return text.length > length ? text.substring(0, length) + '...' : text;
                },
                async confirmDelete(dealershipId) {
                    if (confirm('{{ __('Are you sure you want to delete this dealership?') }}')) {
                        try {
                            await window.apiClient.deleteDealership(dealershipId);
                            await this.loadDealerships();
                            alert('{{ __('Dealership deleted successfully') }}');
                        } catch (error) {
                            console.error('Error deleting dealership:', error);
                            this.apiError = error.message ||
                                '{{ __('Failed to delete dealership. Please try again.') }}';
                            alert(this.apiError);
                        }
                    }
                }
            }));
        });
    </script>
</x-layouts.app>
