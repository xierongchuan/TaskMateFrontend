<x-layouts.app>
    <div class="mb-6" x-data="dealershipEdit">
        <div class="flex items-center mb-4">
            <a href="{{ route('dealerships.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Edit Dealership') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Update dealership information') }}</p>
            </div>
        </div>

        <!-- Loading State -->
        <div x-show="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading dealership...') }}</p>
        </div>

        <!-- Form -->
        <div x-show="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <!-- Success Message -->
            <div x-show="successMessage" x-transition class="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
                <span x-text="successMessage"></span>
            </div>

            <!-- Error Message -->
            <div x-show="errorMessage" x-transition class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                <span x-text="errorMessage"></span>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Name') }} <span class="text-red-500">*</span>
                    </label>
                    <input type="text" id="name" x-model="form.name"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="errors.name ? 'border-red-500' : ''"
                        placeholder="{{ __('Enter dealership name') }}" required>
                    <p x-show="errors.name" class="mt-1 text-sm text-red-500" x-text="errors.name"></p>
                </div>

                <!-- Address -->
                <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Address') }}
                    </label>
                    <input type="text" id="address" x-model="form.address"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="errors.address ? 'border-red-500' : ''"
                        placeholder="{{ __('Enter dealership address') }}">
                    <p x-show="errors.address" class="mt-1 text-sm text-red-500" x-text="errors.address"></p>
                </div>

                <!-- Phone -->
                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Phone') }}
                    </label>
                    <input type="tel" id="phone" x-model="form.phone"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="errors.phone ? 'border-red-500' : ''"
                        placeholder="{{ __('Enter phone number') }}">
                    <p x-show="errors.phone" class="mt-1 text-sm text-red-500" x-text="errors.phone"></p>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Description') }}
                    </label>
                    <textarea id="description" x-model="form.description" rows="4"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="errors.description ? 'border-red-500' : ''"
                        placeholder="{{ __('Enter description (optional)') }}"></textarea>
                    <p x-show="errors.description" class="mt-1 text-sm text-red-500" x-text="errors.description"></p>
                </div>

                <!-- Is Active -->
                <div class="flex items-center">
                    <input type="checkbox" id="is_active" x-model="form.is_active"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="is_active" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        {{ __('Active') }}
                    </label>
                </div>

                <!-- Buttons -->
                <div class="flex justify-end space-x-3 pt-4">
                    <a href="{{ route('dealerships.index') }}"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {{ __('Cancel') }}
                    </a>
                    <button type="submit" :disabled="submitting"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                        <span x-show="!submitting">{{ __('Update Dealership') }}</span>
                        <span x-show="submitting" class="flex items-center">
                            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ __('Updating...') }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('dealershipEdit', () => ({
                dealershipId: null,
                loading: true,
                form: {
                    name: '',
                    address: '',
                    phone: '',
                    description: '',
                    is_active: true,
                },
                errors: {},
                submitting: false,
                successMessage: '',
                errorMessage: '',
                async init() {
                    // Wait for apiClient to be available
                    let retries = 0;
                    while (!window.apiClient && retries < 50) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        retries++;
                    }

                    if (!window.apiClient) {
                        console.error('API client not loaded');
                        return;
                    }

                    // Get dealership ID from URL
                    const pathParts = window.location.pathname.split('/');
                    this.dealershipId = pathParts[pathParts.length - 2];
                    await this.loadDealership();
                },
                async loadDealership() {
                    try {
                        const data = await window.apiClient.getDealership(this.dealershipId);
                        this.form = {
                            name: data.name || '',
                            address: data.address || '',
                            phone: data.phone || '',
                            description: data.description || '',
                            is_active: data.is_active !== undefined ? data.is_active : true,
                        };
                    } catch (error) {
                        console.error('Error loading dealership:', error);
                        this.errorMessage = '{{ __('Failed to load dealership. Please try again.') }}';
                    } finally {
                        this.loading = false;
                    }
                },
                async submitForm() {
                    this.submitting = true;
                    this.errors = {};
                    this.successMessage = '';
                    this.errorMessage = '';

                    // Validate form
                    if (!this.form.name.trim()) {
                        this.errors.name = '{{ __('Name is required') }}';
                        this.submitting = false;
                        return;
                    }

                    try {
                        const data = await window.apiClient.updateDealership(this.dealershipId, this.form);
                        this.successMessage = '{{ __('Dealership updated successfully') }}';

                        // Redirect to index page after a short delay
                        setTimeout(() => {
                            window.location.href = '{{ route('dealerships.index') }}';
                        }, 1500);
                    } catch (error) {
                        console.error('Error updating dealership:', error);
                        this.errorMessage = error.message || '{{ __('Failed to update dealership. Please try again.') }}';

                        // Handle validation errors
                        if (error.errors) {
                            this.errors = error.errors;
                        }
                    } finally {
                        this.submitting = false;
                    }
                }
            }));
        });
    </script>
</x-layouts.app>
