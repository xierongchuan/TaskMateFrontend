<x-layouts.app>
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('System Settings') }}</h1>
    </div>
    <div class="p-6">
        <div class="flex flex-col md:flex-row gap-6">
            @include('settings.partials.navigation')
            <div class="flex-1">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <p>{{ __('System settings - to be fully implemented') }}</p>
                </div>
            </div>
        </div>
    </div>
</x-layouts.app>
