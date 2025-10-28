<x-layouts.auth :title="__('Login')">
    <!-- Login Card -->
    <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        x-data="loginForm()">
        <div class="p-6">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Login') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">Sign in to your account</p>
            </div>

            <!-- Session expired message -->
            @if (request()->query('expired'))
                <div class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <p class="text-sm text-yellow-800 dark:text-yellow-200">
                        Your session has expired. Please login again.
                    </p>
                </div>
            @endif

            <!-- Error message -->
            <div x-show="error" x-cloak class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <p class="text-sm text-red-800 dark:text-red-200" x-text="error"></p>
            </div>

            <!-- Success message -->
            <div x-show="success" x-cloak class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <p class="text-sm text-green-800 dark:text-green-200" x-text="success"></p>
            </div>

            <form @submit.prevent="submit" x-ref="form">
                <!-- Login Input (can be username or phone) -->
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
                        autocomplete="current-password"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="••••••••"
                        :disabled="loading"
                    />
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}"
                            class="text-xs text-blue-600 dark:text-blue-400 hover:underline">{{ __('Forgot password?') }}</a>
                    @endif
                </div>

                <!-- Remember Me -->
                <div class="mb-6">
                    <label class="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            x-model="form.remember"
                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:border-gray-600"
                            :disabled="loading"
                        />
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ __('Remember me') }}</span>
                    </label>
                </div>

                <!-- Login Button -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <span x-show="!loading">{{ __('Sign In') }}</span>
                    <span x-show="loading" x-cloak>{{ __('Signing in...') }}</span>
                </button>
            </form>

            @if (Route::has('register'))
                <!-- Register Link -->
                <div class="text-center mt-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ __('Don\'t have an account?') }}
                        <a href="{{ route('register') }}"
                            class="text-blue-600 dark:text-blue-400 hover:underline font-medium">{{ __('Sign up') }}</a>
                    </p>
                </div>
            @endif
        </div>
    </div>

    <script>
        function loginForm() {
            return {
                form: {
                    login: '',
                    password: '',
                    remember: false
                },
                loading: false,
                error: '',
                success: '',

                async submit() {
                    this.loading = true;
                    this.error = '';
                    this.success = '';

                    try {
                        // Call API login
                        const response = await window.apiClient.login(this.form.login, this.form.password);

                        console.log('Login successful:', response);

                        this.success = 'Login successful! Redirecting...';

                        // Redirect after short delay
                        setTimeout(() => {
                            // Check for intended URL
                            const intendedUrl = sessionStorage.getItem('intended_url');
                            sessionStorage.removeItem('intended_url');

                            if (intendedUrl && intendedUrl !== '/login') {
                                window.location.href = intendedUrl;
                            } else {
                                window.location.href = '/dashboard';
                            }
                        }, 500);

                    } catch (error) {
                        console.error('Login failed:', error);
                        this.error = error.message || 'Login failed. Please check your credentials and try again.';
                        this.loading = false;
                    }
                }
            }
        }
    </script>
</x-layouts.auth>
