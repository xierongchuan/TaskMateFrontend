<x-layouts.auth>
    <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        x-data="registerForm()">
        <div class="p-6">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Register') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ __('Enter your details below to create your account') }}
                </p>
            </div>

            <!-- Error message -->
            <div x-show="error" x-cloak class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <p class="text-sm text-red-800 dark:text-red-200" x-text="error"></p>
            </div>

            <!-- Success message -->
            <div x-show="success" x-cloak class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <p class="text-sm text-green-800 dark:text-green-200" x-text="success"></p>
            </div>

            <form @submit.prevent="submit">
                <!-- Login Input (username or phone) -->
                <div class="mb-4">
                    <label for="login" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Username or Phone') }}
                    </label>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        x-model="form.login"
                        required
                        autocomplete="username"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="username or phone"
                        :disabled="loading"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Enter your preferred username or phone number
                    </p>
                </div>

                <!-- Password Input -->
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Password') }}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        x-model="form.password"
                        required
                        autocomplete="new-password"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="••••••••"
                        :disabled="loading"
                    />
                </div>

                <!-- Confirm Password Input -->
                <div class="mb-4">
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Confirm Password') }}
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        x-model="form.password_confirmation"
                        required
                        autocomplete="new-password"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="••••••••"
                        :disabled="loading"
                    />
                </div>

                <!-- Register Button -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <span x-show="!loading">{{ __('Create Account') }}</span>
                    <span x-show="loading" x-cloak>{{ __('Creating account...') }}</span>
                </button>
            </form>

            <!-- Login Link -->
            <div class="text-center mt-6">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?
                    <a href="{{ route('login') }}"
                        class="text-blue-600 dark:text-blue-400 hover:underline font-medium">{{ __('Sign in') }}</a>
                </p>
            </div>
        </div>
    </div>

    <script>
        function registerForm() {
            return {
                form: {
                    login: '',
                    password: '',
                    password_confirmation: ''
                },
                loading: false,
                error: '',
                success: '',

                async submit() {
                    this.loading = true;
                    this.error = '';
                    this.success = '';

                    // Validate passwords match
                    if (this.form.password !== this.form.password_confirmation) {
                        this.error = 'Passwords do not match.';
                        this.loading = false;
                        return;
                    }

                    try {
                        // Call API register
                        const response = await window.apiClient.register(this.form.login, this.form.password);

                        console.log('Registration successful:', response);

                        this.success = 'Registration successful! Redirecting...';

                        // Redirect after short delay
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 1000);

                    } catch (error) {
                        console.error('Registration failed:', error);
                        this.error = error.message || 'Registration failed. Please try again.';
                        this.loading = false;
                    }
                }
            }
        }
    </script>
</x-layouts.auth>
