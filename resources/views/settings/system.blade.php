<x-layouts.app>
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Settings') }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Manage system settings') }}</p>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
        @include('settings.partials.navigation')

        <div class="flex-1" x-data="systemSettings">
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

                <!-- Shift Times -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Shift Times') }}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Shift 1 Start Time') }}
                            </label>
                            <input type="time" x-model="settings.shift_1_start_time"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Shift 1 End Time') }}
                            </label>
                            <input type="time" x-model="settings.shift_1_end_time"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Shift 2 Start Time') }}
                            </label>
                            <input type="time" x-model="settings.shift_2_start_time"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Shift 2 End Time') }}
                            </label>
                            <input type="time" x-model="settings.shift_2_end_time"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        </div>
                    </div>
                </div>

                <!-- Late Arrival -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Late Arrival Settings') }}</h2>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Allowed Late Minutes') }}
                        </label>
                        <input type="number" x-model.number="settings.allowed_late_minutes" min="0" max="60"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {{ __('Number of minutes an employee can be late before being marked as late') }}
                        </p>
                    </div>
                </div>

                <!-- Display Settings -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Display Settings') }}</h2>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Rows Per Page') }}
                        </label>
                        <select x-model.number="settings.rows_per_page"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {{ __('Number of items to display per page in tables') }}
                        </p>
                    </div>
                </div>

                <!-- Archive Settings -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Archive Settings') }}</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Auto-Archive After (Days)') }}
                            </label>
                            <input type="number" x-model.number="settings.auto_archive_days" min="1" max="365"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {{ __('Automatically archive completed tasks after this many days (default: 30)') }}
                            </p>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" x-model="settings.auto_archive_enabled" id="auto_archive_enabled"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="auto_archive_enabled" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                {{ __('Enable automatic archiving') }}
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Weekly Report Settings -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Weekly Report Settings') }}</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Report Day') }}
                            </label>
                            <select x-model="settings.weekly_report_day"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                                <option value="monday">{{ __('Monday') }}</option>
                                <option value="tuesday">{{ __('Tuesday') }}</option>
                                <option value="wednesday">{{ __('Wednesday') }}</option>
                                <option value="thursday">{{ __('Thursday') }}</option>
                                <option value="friday">{{ __('Friday') }}</option>
                                <option value="saturday">{{ __('Saturday') }}</option>
                                <option value="sunday">{{ __('Sunday') }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {{ __('Report Time') }}
                            </label>
                            <input type="time" x-model="settings.weekly_report_time"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" x-model="settings.weekly_report_enabled" id="weekly_report_enabled"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="weekly_report_enabled" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                {{ __('Enable weekly reports') }}
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Notification Settings -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Notification Settings') }}</h2>
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <input type="checkbox" x-model="settings.notify_overdue_tasks" id="notify_overdue_tasks"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="notify_overdue_tasks" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                {{ __('Notify about overdue tasks') }}
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" x-model="settings.notify_postponed_tasks" id="notify_postponed_tasks"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="notify_postponed_tasks" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                {{ __('Notify about postponed tasks') }}
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" x-model="settings.notify_late_arrivals" id="notify_late_arrivals"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="notify_late_arrivals" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                {{ __('Notify about late arrivals') }}
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end space-x-4">
                    <button type="button" @click="loadSettings"
                        class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        {{ __('Reset') }}
                    </button>
                    <button type="submit" :disabled="submitting"
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
            Alpine.data('systemSettings', () => ({
                settings: {
                    shift_1_start_time: '09:00',
                    shift_1_end_time: '18:00',
                    shift_2_start_time: '18:00',
                    shift_2_end_time: '03:00',
                    allowed_late_minutes: 5,
                    rows_per_page: 15,
                    auto_archive_days: 30,
                    auto_archive_enabled: true,
                    weekly_report_day: 'monday',
                    weekly_report_time: '09:00',
                    weekly_report_enabled: true,
                    notify_overdue_tasks: true,
                    notify_postponed_tasks: true,
                    notify_late_arrivals: true,
                },
                loading: true,
                submitting: false,
                successMessage: '',
                errorMessage: '',
                async init() {
                    await this.loadSettings();
                },
                async loadSettings() {
                    this.loading = true;
                    try {
                        const data = await window.apiClient.getSettings();

                        // Map API settings to our settings object
                        if (data && data.data) {
                            data.data.forEach(setting => {
                                if (this.settings.hasOwnProperty(setting.key)) {
                                    this.settings[setting.key] = this.parseSettingValue(setting);
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
                parseSettingValue(setting) {
                    switch (setting.type) {
                        case 'boolean':
                            return setting.value === true || setting.value === 'true' || setting.value === 1;
                        case 'integer':
                            return parseInt(setting.value);
                        case 'json':
                            return JSON.parse(setting.value);
                        default:
                            return setting.value;
                    }
                },
                async saveSettings() {
                    this.submitting = true;
                    this.successMessage = '';
                    this.errorMessage = '';

                    try {
                        // Convert settings object to array format for bulk update
                        const settingsArray = Object.entries(this.settings).map(([key, value]) => ({
                            key,
                            value
                        }));

                        await window.apiClient.bulkUpdateSettings(settingsArray);

                        this.successMessage = '{{ __('Settings saved successfully!') }}';

                        // Clear success message after 3 seconds
                        setTimeout(() => {
                            this.successMessage = '';
                        }, 3000);
                    } catch (error) {
                        console.error('Error saving settings:', error);
                        this.errorMessage = error.message || '{{ __('Failed to save settings. Please try again.') }}';
                    } finally {
                        this.submitting = false;
                    }
                }
            }));
        });
    </script>
</x-layouts.app>
