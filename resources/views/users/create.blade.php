<x-layouts.app>
    <div class="mb-6" x-data="userCreate">
        <div class="flex items-center mb-4">
            <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </a>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Add Employee') }}</h1>
        </div>

        <!-- Success Message -->
        <div x-show="success" x-transition
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-green-800 dark:text-green-200" x-text="success"></p>
                </div>
            </div>
        </div>

        <!-- Error Message -->
        <div x-show="error" x-transition
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-800 dark:text-red-200" x-text="error"></p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <form @submit.prevent="createUser" class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Login -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Login') }} <span class="text-red-500">*</span>
                        </label>
                        <input type="text" x-model="form.login" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="{{ __('Enter login') }}">
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Minimum 4 characters') }}</p>
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Password') }} <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input :type="showPassword ? 'text' : 'password'" x-model="form.password" required
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="{{ __('Enter password') }}">
                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg x-show="!showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                <svg x-show="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                </svg>
                            </button>
                        </div>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Minimum 8 characters, uppercase, lowercase, and number required') }}</p>
                    </div>

                    <!-- Full Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Full Name') }} <span class="text-red-500">*</span>
                        </label>
                        <input type="text" x-model="form.full_name" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="{{ __('Enter full name') }}">
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Minimum 2 characters') }}</p>
                    </div>

                    <!-- Phone -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Phone') }} <span class="text-red-500">*</span>
                        </label>
                        <input type="tel" x-model="form.phone" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+79991234567">
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Format: +79991234567 or 8 (999) 123-45-67') }}</p>
                    </div>

                    <!-- Role -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Role') }} <span class="text-red-500">*</span>
                        </label>
                        <select x-model="form.role" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">{{ __('Select role') }}</option>
                            <option value="employee">{{ __('Employee') }}</option>
                            <option value="manager">{{ __('Manager') }}</option>
                            <option value="observer">{{ __('Observer') }}</option>
                            <option value="owner">{{ __('Owner') }}</option>
                        </select>
                    </div>

                    <!-- Telegram ID -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Telegram ID') }}
                        </label>
                        <input type="number" x-model="form.telegram_id"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123456789">
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Optional: Telegram user ID') }}</p>
                    </div>

  
                    <!-- Dealership ID -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Dealership') }}
                        </label>
                        <select x-model="form.dealership_id"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">{{ __('Select dealership') }}</option>
                            <template x-for="dealership in dealerships" :key="dealership.id">
                                <option :value="dealership.id" x-text="dealership.name"></option>
                            </template>
                        </select>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Optional: Assign to dealership') }}</p>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <a href="{{ route('users.index') }}"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {{ __('Cancel') }}
                    </a>
                    <button type="submit" :disabled="submitting"
                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg inline-flex items-center">
                        <svg x-show="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span x-text="submitting ? '{{ __('Creating...') }}' : '{{ __('Create Employee') }}'"></span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('userCreate', () => ({
                form: {
                    login: '',
                    password: '',
                    full_name: '',
                    phone: '',
                    role: '',
                    telegram_id: null,
                    dealership_id: null,
                },
                dealerships: [],
                submitting: false,
                success: null,
                error: null,
                showPassword: false,

                async init() {
                    await this.loadDealerships();
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

                validateForm() {
                    const errors = [];

                    // Login validation
                    if (!this.form.login || this.form.login.length < 4) {
                        errors.push('Login must be at least 4 characters');
                    }

                    // Password validation
                    if (!this.form.password || this.form.password.length < 8) {
                        errors.push('Password must be at least 8 characters');
                    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.form.password)) {
                        errors.push('Password must contain uppercase, lowercase, and number');
                    }

                    // Full name validation
                    if (!this.form.full_name || this.form.full_name.length < 2) {
                        errors.push('Full name must be at least 2 characters');
                    }

                    // Phone validation
                    if (!this.form.phone || !/^\+?[\d\s\-\(\)]+$/.test(this.form.phone)) {
                        errors.push('Invalid phone number format');
                    }

                    // Role validation
                    if (!this.form.role) {
                        errors.push('Role is required');
                    }

                    return errors;
                },

                async createUser() {
                    const errors = this.validateForm();
                    if (errors.length > 0) {
                        this.error = errors.join('. ');
                        this.success = null;
                        return;
                    }

                    this.submitting = true;
                    this.error = null;
                    this.success = null;

                    try {
                        // Check if apiClient is ready
                        if (!window.apiClientReady || !window.apiClient || !window.apiClient.createUser) {
                            throw new Error('API client not ready');
                        }

                        // Clean the form data
                        const formData = {
                            login: this.form.login.trim(),
                            password: this.form.password,
                            full_name: this.form.full_name.trim(),
                            phone: this.form.phone.trim(),
                            role: this.form.role,
                        };

                        // Add optional fields only if they have values
                        if (this.form.telegram_id) {
                            formData.telegram_id = parseInt(this.form.telegram_id);
                        }
                        if (this.form.dealership_id) {
                            formData.dealership_id = parseInt(this.form.dealership_id);
                        }

                        const response = await window.apiClient.createUser(formData);

                        if (response.success) {
                            this.success = response.message || 'Employee created successfully';
                            // Reset form
                            this.form = {
                                login: '',
                                password: '',
                                full_name: '',
                                phone: '',
                                role: '',
                                telegram_id: null,
                                dealership_id: null,
                            };

                            // Redirect after a short delay
                            setTimeout(() => {
                                window.location.href = '{{ route('users.index') }}';
                            }, 2000);
                        } else {
                            this.error = response.message || 'Failed to create employee';
                        }
                    } catch (error) {
                        console.error('Error creating user:', error);
                        this.error = error.message || 'Failed to create employee. Please try again.';
                    } finally {
                        this.submitting = false;
                    }
                }
            }));
        });
    </script>
</x-layouts.app>