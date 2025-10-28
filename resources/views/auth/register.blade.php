<x-layouts.auth>
    <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Register') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ __('Enter your details below to create your account') }}
                </p>
            </div>

            <form id="register-form">
                <!-- Login Input -->
                <div class="mb-4">
                    <x-forms.input label="Login" name="login" type="text" placeholder="{{ __('Your login') }}" />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ __('This will be your username for logging in') }}
                    </p>
                    <p class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" id="login-error"></p>
                </div>

                <!-- Password Input -->
                <div class="mb-4">
                    <x-forms.input label="Password" name="password" type="password" placeholder="••••••••" />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ __('Minimum 12 characters with uppercase, lowercase, digits, and special characters') }}
                    </p>
                    <p class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" id="password-error"></p>
                </div>

                <!-- Confirm Password Input -->
                <div class="mb-4">
                    <x-forms.input label="Confirm Password" name="password_confirmation" type="password"
                        placeholder="••••••••" />
                    <p class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" id="password_confirmation-error"></p>
                </div>

                <!-- General Error -->
                <div class="mb-4 hidden" id="general-error">
                    <p class="text-sm text-red-600 dark:text-red-400"></p>
                </div>

                <!-- Register Button -->
                <x-button type="primary" class="w-full" id="register-button">{{ __('Create Account') }}</x-button>
            </form>

            <script>
                document.getElementById('register-form').addEventListener('submit', async function(e) {
                    e.preventDefault();

                    // Clear previous errors
                    document.querySelectorAll('.text-red-600').forEach(el => {
                        el.classList.add('hidden');
                        el.textContent = '';
                    });

                    const button = document.getElementById('register-button');
                    const originalText = button.textContent;
                    button.disabled = true;
                    button.textContent = '{{ __('Creating Account...') }}';

                    const formData = new FormData(this);
                    const login = formData.get('login');
                    const password = formData.get('password');
                    const password_confirmation = formData.get('password_confirmation');

                    // Get API URL from meta tag (set by Laravel config)
                    const apiUrlMeta = document.querySelector('meta[name="api-url"]');
                    const apiUrl = apiUrlMeta ? apiUrlMeta.getAttribute('content') : null;

                    if (!apiUrl) {
                        const generalError = document.getElementById('general-error');
                        generalError.querySelector('p').textContent = '{{ __('API configuration missing. Please contact administrator.') }}';
                        generalError.classList.remove('hidden');
                        button.disabled = false;
                        button.textContent = originalText;
                        return;
                    }

                    try {
                        // Call external API directly
                        const response = await fetch(`${apiUrl}/register`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ login, password, password_confirmation })
                        });

                        const data = await response.json();

                        if (response.ok) {
                            // Store token and user data in Laravel session via our backend
                            const sessionResponse = await fetch('{{ route('register') }}', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify({
                                    token: data.token,
                                    user: data.user
                                })
                            });

                            if (sessionResponse.ok) {
                                window.location.href = '{{ route('dashboard') }}';
                            } else {
                                const generalError = document.getElementById('general-error');
                                generalError.querySelector('p').textContent = '{{ __('Session creation failed. Please try logging in.') }}';
                                generalError.classList.remove('hidden');
                            }
                        } else {
                            // Show validation errors
                            if (data.errors) {
                                for (const [field, messages] of Object.entries(data.errors)) {
                                    const errorEl = document.getElementById(field + '-error');
                                    if (errorEl) {
                                        errorEl.textContent = Array.isArray(messages) ? messages[0] : messages;
                                        errorEl.classList.remove('hidden');
                                    }
                                }
                            }
                            if (data.message && !data.errors) {
                                const generalError = document.getElementById('general-error');
                                generalError.querySelector('p').textContent = data.message;
                                generalError.classList.remove('hidden');
                            }
                        }
                    } catch (error) {
                        console.error('Registration error:', error);
                        const generalError = document.getElementById('general-error');
                        generalError.querySelector('p').textContent = '{{ __('Unable to connect to registration service. Please try again later.') }}';
                        generalError.classList.remove('hidden');
                    } finally {
                        button.disabled = false;
                        button.textContent = originalText;
                    }
                });
            </script>

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
</x-layouts.auth>
