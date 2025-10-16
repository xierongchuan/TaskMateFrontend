<x-layouts.app>
    <div class="mb-6">
        <div class="flex items-center mb-4">
            <a href="{{ route('users.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </a>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Add Employee') }}</h1>
        </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <!-- Info Message -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {{ __('Employee Registration via Telegram Bot') }}
                    </h3>
                    <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p class="mb-3">
                            {{ __('Employees cannot be created directly through this interface. New employees must register through the TaskMate Telegram Bot.') }}
                        </p>
                        <p class="mb-3 font-medium">
                            {{ __('To add a new employee:') }}
                        </p>
                        <ol class="list-decimal list-inside space-y-2 ml-2">
                            <li>{{ __('The employee should open the TaskMate Telegram Bot') }}</li>
                            <li>{{ __('They should start a conversation with the bot using the /start command') }}</li>
                            <li>{{ __('Follow the registration prompts to create their account') }}</li>
                            <li>{{ __('Once registered, the employee will appear in the system') }}</li>
                            <li>{{ __('An administrator can then assign the appropriate role and dealership') }}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Information -->
        <div class="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                {{ __('About User Roles') }}
            </h4>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-start">
                    <span class="inline-block px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-3">
                        {{ __('Employee') }}
                    </span>
                    <span>{{ __('Regular employee with access to their assigned tasks') }}</span>
                </div>
                <div class="flex items-start">
                    <span class="inline-block px-2 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mr-3">
                        {{ __('Manager') }}
                    </span>
                    <span>{{ __('Can create and manage tasks for their dealership') }}</span>
                </div>
                <div class="flex items-start">
                    <span class="inline-block px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 mr-3">
                        {{ __('Observer') }}
                    </span>
                    <span>{{ __('Can view tasks and reports but cannot create or modify tasks') }}</span>
                </div>
                <div class="flex items-start">
                    <span class="inline-block px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mr-3">
                        {{ __('Owner') }}
                    </span>
                    <span>{{ __('Full administrative access to all system features') }}</span>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-between">
            <a href="{{ route('users.index') }}" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                {{ __('Back to Employees') }}
            </a>
            <a href="https://t.me/taskmate_bot" target="_blank" rel="noopener noreferrer"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.63 13.73l-2.97-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.827z"/>
                </svg>
                {{ __('Open Telegram Bot') }}
            </a>
        </div>
    </div>
</x-layouts.app>
