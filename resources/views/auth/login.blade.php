<x-layouts.auth :title="__('Login')">
    <!-- Login Card -->
    <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Login') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">Sign in to your account</p>
            </div>

            <form id="login-form">
                <!-- Email Input -->
                <div class="mb-4">
                    <x-forms.input label="Login" name="email" type="text" placeholder="your-login" />
                    <p class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" id="email-error"></p>
                </div>

                <!-- Password Input -->
                <div class="mb-4">
                    <x-forms.input label="Password" name="password" type="password" placeholder="••••••••" />
                    <p class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" id="password-error"></p>
                </div>

                <!-- Remember Me -->
                <div class="mb-6">
                    <x-forms.checkbox label="Remember me" name="remember" />
                </div>

                <!-- General Error -->
                <div class="mb-4 hidden" id="general-error">
                    <p class="text-sm text-red-600 dark:text-red-400"></p>
                </div>

                <!-- Login Button -->
                <x-button type="primary" buttonType="button" class="w-full" id="login-button">{{ __('Sign In') }}</x-button>
            </form>

            <script>
                async function handleLogin(e) {
                    e.preventDefault();

                    // Clear previous errors
                    document.querySelectorAll('.text-red-600').forEach(el => {
                        el.classList.add('hidden');
                        el.textContent = '';
                    });

                    const button = document.getElementById('login-button');
                    const originalText = button.textContent;
                    button.disabled = true;
                    button.textContent = '{{ __('Signing In...') }}';

                    const form = document.getElementById('login-form');
                    const formData = new FormData(form);
                    const email = formData.get('email');
                    const password = formData.get('password');
                    const remember = formData.get('remember') ? true : false;

                    // Get API URL from meta tag (set by Laravel config)
                    const apiUrlMeta = document.querySelector('meta[name="api-url"]');
                    if (!apiUrlMeta) {
                        console.error('API URL meta tag not found');
                        const generalError = document.getElementById('general-error');
                        generalError.querySelector('p').textContent = '{{ __('API configuration missing. Please contact administrator.') }}';
                        generalError.classList.remove('hidden');
                        button.disabled = false;
                        button.textContent = originalText;
                        return;
                    }

                    const apiUrl = apiUrlMeta.getAttribute('content');
                    if (!apiUrl) {
                        console.error('API URL is empty');
                        const generalError = document.getElementById('general-error');
                        generalError.querySelector('p').textContent = '{{ __('API configuration missing. Please contact administrator.') }}';
                        generalError.classList.remove('hidden');
                        button.disabled = false;
                        button.textContent = originalText;
                        return;
                    }

                    console.log('Using API URL:', apiUrl);

                    try {
                        // Step 1: Call external API directly to authenticate
                        console.log('Calling external API:', `${apiUrl}/session`);
                        const response = await fetch(`${apiUrl}/session`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ login: email, password })
                        });

                        const data = await response.json();
                        console.log('API response:', response.status, data);

                        if (response.ok) {
                            // Step 2: Store token and user data in Laravel session (no CSRF needed - exception added)
                            console.log('Storing session data in Laravel');
                            const sessionResponse = await fetch('{{ route('login') }}', {
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
                                console.log('Session created, redirecting to dashboard');
                                window.location.href = '{{ route('dashboard') }}';
                            } else {
                                const sessionData = await sessionResponse.json();
                                console.error('Session creation failed:', sessionResponse.status, sessionData);
                                const generalError = document.getElementById('general-error');
                                generalError.querySelector('p').textContent = sessionData.message || '{{ __('Session creation failed. Please try again.') }}';
                                generalError.classList.remove('hidden');
                            }
                        } else {
                            // Show validation errors from API
                            console.log('Validation errors:', data.errors);
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
                        console.error('Login error:', error);
                        const generalError = document.getElementById('general-error');
                        generalError.querySelector('p').textContent = '{{ __('Unable to connect to authentication service. Please try again later.') }}';
                        generalError.classList.remove('hidden');
                    } finally {
                        button.disabled = false;
                        button.textContent = originalText;
                    }
                }

                // Add event listeners for both form submit and button click
                document.getElementById('login-form').addEventListener('submit', handleLogin);
                document.getElementById('login-button').addEventListener('click', handleLogin);
            </script>

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
</x-layouts.auth>
