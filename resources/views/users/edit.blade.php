<x-layouts.app>
    <div class="mb-6" x-data="userEdit">
        <div class="flex items-center mb-4">
            <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </a>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Edit Employee') }}</h1>
        </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- Loading State -->
        <div x-show="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading employee data...') }}</p>
        </div>

        <!-- Error State -->
        <div x-show="!loading && error" class="text-center py-12 text-red-600 dark:text-red-400 p-6">
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

        <!-- Edit Form -->
        <form x-show="!loading && !error" @submit.prevent="submitForm" class="p-6 space-y-6">
            <!-- Success Message -->
            <div x-show="successMessage" x-transition class="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative" role="alert">
                <span x-text="successMessage"></span>
            </div>

            <!-- Error Message -->
            <div x-show="errorMessage" x-transition class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
                <span x-text="errorMessage"></span>
            </div>

            <!-- Warning about Telegram Registration -->
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700 dark:text-yellow-300">
                            {{ __('Note: Login and Telegram ID cannot be changed as they are set during registration through the Telegram Bot.') }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Read-only Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Login') }}
                    </label>
                    <input type="text" :value="formData.login" disabled
                        class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Telegram ID') }}
                    </label>
                    <input type="text" :value="formData.telegram_id || '-'" disabled
                        class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                </div>
            </div>

            <!-- Editable Fields -->
            <div>
                <label for="full_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ __('Full Name') }} <span class="text-red-500">*</span>
                </label>
                <input type="text" id="full_name" x-model="formData.full_name" required
                    class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="{{ __('Enter full name') }}">
                <p x-show="errors.full_name" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.full_name"></p>
            </div>

            <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ __('Phone') }}
                </label>
                <input type="tel" id="phone" x-model="formData.phone"
                    class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="{{ __('+1234567890') }}">
                <p x-show="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.phone"></p>
            </div>

            <div>
                <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ __('Role') }} <span class="text-red-500">*</span>
                </label>
                <select id="role" x-model="formData.role" required
                    class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">{{ __('Select role') }}</option>
                    <option value="employee">{{ __('Employee') }}</option>
                    <option value="manager">{{ __('Manager') }}</option>
                    <option value="observer">{{ __('Observer') }}</option>
                    <option value="owner">{{ __('Owner') }}</option>
                </select>
                <p x-show="errors.role" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.role"></p>
            </div>

            <div>
                <label for="dealership_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ __('Dealership') }}
                </label>
                <select id="dealership_id" x-model="formData.dealership_id"
                    class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">{{ __('No dealership assigned') }}</option>
                    <template x-for="dealership in dealerships" :key="dealership.id">
                        <option :value="dealership.id" x-text="dealership.name"></option>
                    </template>
                </select>
                <p x-show="errors.dealership_id" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.dealership_id"></p>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a href="{{ route('users.index') }}"
                    class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {{ __('Cancel') }}
                </a>
                <button type="submit" :disabled="submitting"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <span x-show="!submitting">{{ __('Update Employee') }}</span>
                    <span x-show="submitting" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ __('Updating...') }}
                    </span>
                </button>
            </div>
        </form>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('userEdit', () => ({
                formData: {
                    login: '',
                    full_name: '',
                    telegram_id: '',
                    phone: '',
                    role: '',
                    dealership_id: '',
                },
                dealerships: [],
                loading: true,
                error: null,
                errors: {},
                submitting: false,
                successMessage: '',
                errorMessage: '',
                userId: null,
                async init() {
                    // Get user ID from URL
                    const pathParts = window.location.pathname.split('/');
                    this.userId = pathParts[pathParts.length - 2];

                    await this.loadDealerships();
                    await this.loadUser();
                },
                async loadDealerships() {
                    try {
                        // Check if apiClient is ready
                        if (!window.apiClientReady || !window.apiClient || !window.apiClient.getDealerships) {
                            console.error('API client not ready, retrying...');
                            // Retry after a short delay
                            setTimeout(() => this.loadDealerships(), 100);
                            return;
                        }

                        const data = await window.apiClient.getDealerships({ per_page: 100, is_active: true });
                        this.dealerships = data.data || [];
                    } catch (error) {
                        console.error('Error loading dealerships:', error);
                        // Retry once if it's a network error
                        if (error.message && error.message.includes('API client')) {
                            setTimeout(() => this.loadDealerships(), 1000);
                        }
                    }
                },
                async loadUser() {
                    this.loading = true;
                    this.error = null;
                    try {
                        // Check if apiClient is ready
                        if (!window.apiClientReady || !window.apiClient || !window.apiClient.getUser) {
                            console.error('API client not ready, retrying...');
                            setTimeout(() => this.loadUser(), 100);
                            return;
                        }

                        const data = await window.apiClient.getUser(this.userId);
                        this.formData = {
                            login: data.login || '',
                            full_name: data.full_name || '',
                            telegram_id: data.telegram_id || '',
                            phone: data.phone || '',
                            role: data.role || '',
                            dealership_id: data.dealership_id || '',
                        };
                    } catch (error) {
                        console.error('Error loading user:', error);
                        this.error = '{{ __('Failed to load employee data. Please try again.') }}';
                        // Retry once if it's a network error
                        if (error.message && error.message.includes('API client')) {
                            setTimeout(() => this.loadUser(), 1000);
                        }
                    } finally {
                        this.loading = false;
                    }
                },
                async submitForm() {
                    // Reset messages and errors
                    this.errors = {};
                    this.successMessage = '';
                    this.errorMessage = '';

                    // Validate required fields
                    if (!this.formData.full_name) {
                        this.errors.full_name = '{{ __('Full name is required') }}';
                    }
                    if (!this.formData.role) {
                        this.errors.role = '{{ __('Role is required') }}';
                    }

                    // If there are validation errors, don't submit
                    if (Object.keys(this.errors).length > 0) {
                        this.errorMessage = '{{ __('Please fix the errors before submitting.') }}';
                        return;
                    }

                    this.submitting = true;

                    try {
                        // Check if apiClient is ready
                        if (!window.apiClientReady || !window.apiClient || !window.apiClient.updateUser) {
                            throw new Error('API client not ready');
                        }

                        // Prepare data for submission (only editable fields)
                        const submitData = {
                            full_name: this.formData.full_name,
                            phone: this.formData.phone,
                            role: this.formData.role,
                            dealership_id: this.formData.dealership_id || null,
                        };

                        await window.apiClient.updateUser(this.userId, submitData);

                        this.successMessage = '{{ __('Employee updated successfully!') }}';
                        setTimeout(() => {
                            window.location.href = `/users/${this.userId}`;
                        }, 1000);
                    } catch (error) {
                        console.error('Error updating user:', error);
                        this.errorMessage = error.message || '{{ __('Failed to update employee. Please try again.') }}';

                        if (error.errors) {
                            this.errors = error.errors;
                        }
                    } finally {
                        this.submitting = false;
                    }
                },
            }));
        });
    </script>
</x-layouts.app>
