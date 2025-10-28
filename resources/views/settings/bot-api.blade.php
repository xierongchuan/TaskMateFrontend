<x-layouts.app>
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Settings') }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Manage Bot API connection settings') }}</p>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
        @include('settings.partials.navigation')

        <div class="flex-1" x-data="botApiSettings">
            <!-- Loading State -->
            <div x-show="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading settings...') }}</p>
            </div>

            <!-- Settings Form -->
            <form x-show="!loading" @submit.prevent="saveSettings" class="space-y-6">
                <!-- Success Message -->
                <div x-show="successMessage" x-transition class="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative">
                    <span x-text="successMessage"></span>
                </div>

                <!-- Error Message -->
                <div x-show="errorMessage" x-transition class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                    <span x-text="errorMessage"></span>
                </div>

                <!-- Bot API Configuration -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Bot API Configuration') }}</h2>
                    <div class="space-y-6">
                        <!-- API URL -->
                        <div>
                            <label for="api_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('API URL') }}
                            </label>
                            <input type="url"
                                   id="api_url"
                                   x-model="settings.api_url"
                                   placeholder="https://api.example.com/v1"
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {{ __('The base URL for your Bot API endpoint') }}
                            </p>
                        </div>

                        <!-- Auth Token -->
                        <div>
                            <label for="auth_token" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Auth Token') }}
                            </label>
                            <div class="relative">
                                <input type="password"
                                       id="auth_token"
                                       x-model="settings.auth_token"
                                       placeholder="Enter your authentication token"
                                       class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <button type="button"
                                        @click="toggleTokenVisibility"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <svg x-show="!tokenVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    <svg x-show="tokenVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                    </svg>
                                </button>
                            </div>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {{ __('Your authentication token for the Bot API') }}
                            </p>
                        </div>

                        <!-- Connection Status -->
                        <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ __('Connection Status') }}</h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400" x-show="!connectionStatus">
                                        {{ __('Not tested yet') }}
                                    </p>
                                    <p class="text-sm"
                                       x-show="connectionStatus"
                                       :class="connectionStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                        <span x-text="connectionMessage"></span>
                                    </p>
                                </div>
                                <button type="button"
                                        @click="testConnection"
                                        :disabled="testingConnection"
                                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span x-show="!testingConnection">{{ __('Test Connection') }}</span>
                                    <span x-show="testingConnection">{{ __('Testing...') }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end space-x-4">
                    <button type="button"
                            @click="resetToDefaults"
                            class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {{ __('Reset to Defaults') }}
                    </button>
                    <button type="submit"
                            :disabled="submitting"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <span x-show="!submitting">{{ __('Save Settings') }}</span>
                        <span x-show="submitting">{{ __('Saving...') }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('botApiSettings', () => ({
                settings: {
                    api_url: '',
                    auth_token: '',
                },
                loading: true,
                submitting: false,
                testingConnection: false,
                successMessage: '',
                errorMessage: '',
                connectionStatus: '',
                connectionMessage: '',
                tokenVisible: false,

                async init() {
                    await this.loadSettings();
                },

                async loadSettings() {
                    this.loading = true;
                    try {
                        // Use apiClient's getSettings method
                        const data = await window.apiClient.getSettings();
                        console.log('Loaded settings:', data);

                        if (data.data) {
                            data.data.forEach(setting => {
                                if (this.settings.hasOwnProperty(setting.key)) {
                                    this.settings[setting.key] = setting.value || '';
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error loading settings:', error);
                        // Continue with default settings
                    } finally {
                        this.loading = false;
                    }
                },

                async saveSettings() {
                    this.submitting = true;
                    this.successMessage = '';
                    this.errorMessage = '';

                    try {
                        // Validate required fields
                        if (!this.settings.api_url.trim()) {
                            this.errorMessage = '{{ __('API URL is required.') }}';
                            return;
                        }

                        // Validate URL format
                        try {
                            new URL(this.settings.api_url);
                        } catch (e) {
                            this.errorMessage = '{{ __('Please enter a valid URL for the API endpoint.') }}';
                            return;
                        }

                        const settingsArray = Object.entries(this.settings).map(([key, value]) => ({
                            key,
                            value: value?.trim() || ''
                        }));

                        console.log('Saving settings:', settingsArray);

                        // Use apiClient's bulkUpdateSettings method
                        await window.apiClient.bulkUpdateSettings(settingsArray);

                        this.successMessage = '{{ __('Settings saved successfully!') }}';
                        setTimeout(() => {
                            this.successMessage = '';
                        }, 3000);

                        // Reload settings to confirm they were saved
                        await this.loadSettings();
                    } catch (error) {
                        console.error('Error saving settings:', error);

                        // Extract error message
                        if (error.message) {
                            this.errorMessage = error.message;
                        } else {
                            this.errorMessage = '{{ __('Failed to save settings. Please try again.') }}';
                        }
                    } finally {
                        this.submitting = false;
                    }
                },

                async testConnection() {
                    this.testingConnection = true;
                    this.connectionStatus = '';

                    try {
                        // Get API URL from settings (if testing a new URL) or use the configured default
                        const apiUrlToTest = this.settings.api_url?.trim() || window.API_URL;

                        if (!apiUrlToTest) {
                            this.connectionStatus = 'error';
                            this.connectionMessage = '{{ __('Please enter an API URL first.') }}';
                            return;
                        }

                        // Validate URL format
                        try {
                            new URL(apiUrlToTest);
                        } catch (e) {
                            this.connectionStatus = 'error';
                            this.connectionMessage = '{{ __('Invalid URL format.') }}';
                            return;
                        }

                        // Test the health endpoint directly (not through proxy)
                        const response = await fetch(`${apiUrlToTest}/up`, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                            }
                        });

                        if (response.ok) {
                            this.connectionStatus = 'success';
                            this.connectionMessage = '{{ __('Connection successful!') }}';
                        } else {
                            this.connectionStatus = 'error';
                            this.connectionMessage = '{{ __('Connection failed. Please check your API URL.') }}';
                        }
                    } catch (error) {
                        console.error('Connection test failed:', error);
                        this.connectionStatus = 'error';
                        this.connectionMessage = '{{ __('Connection failed. Please check your API URL and network connection.') }}';
                    } finally {
                        this.testingConnection = false;
                    }
                },

                toggleTokenVisibility() {
                    const input = document.getElementById('auth_token');
                    this.tokenVisible = !this.tokenVisible;
                    input.type = this.tokenVisible ? 'text' : 'password';
                },

                resetToDefaults() {
                    if (confirm('{{ __('Are you sure you want to reset all settings to their default values?') }}')) {
                        this.settings = {
                            api_url: '',
                            auth_token: '',
                        };
                        this.connectionStatus = '';
                        this.connectionMessage = '';
                    }
                }
            }));
        });
    </script>
</x-layouts.app>