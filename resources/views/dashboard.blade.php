<x-layouts.app>

    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Dashboard') }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Live monitoring board') }}</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Tasks -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Total Tasks') }}</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ $totalTasks }}</p>
                </div>
                <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 dark:text-blue-300"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Completed Tasks -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Completed Today') }}</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ $completedTasks }}</p>
                </div>
                <div class="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 dark:text-green-300"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Overdue Tasks -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Overdue') }}</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ $overdueTasks }}</p>
                </div>
                <div class="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 dark:text-red-300"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Postponed Tasks -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ __('Postponed') }}</p>
                    <p class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{{ $postponedTasks }}</p>
                </div>
                <div class="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 dark:text-yellow-300"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Current Shifts -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ __('Current Shifts') }}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ __('Active shifts and replacements') }}</p>
        </div>
        <div class="p-6">
            @if($currentShifts->count() > 0)
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                <th class="pb-3">{{ __('Employee') }}</th>
                                <th class="pb-3">{{ __('Dealership') }}</th>
                                <th class="pb-3">{{ __('Start Time') }}</th>
                                <th class="pb-3">{{ __('Status') }}</th>
                                <th class="pb-3">{{ __('Late') }}</th>
                                <th class="pb-3">{{ __('Replacement') }}</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            @foreach($currentShifts as $shift)
                                <tr class="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                    <td class="py-3">
                                        <div class="font-medium text-gray-800 dark:text-gray-100">
                                            {{ $shift->user->name }}
                                        </div>
                                    </td>
                                    <td class="py-3 text-gray-600 dark:text-gray-400">
                                        {{ $shift->dealership->name }}
                                    </td>
                                    <td class="py-3 text-gray-600 dark:text-gray-400">
                                        {{ $shift->shift_start->format('H:i') }}
                                    </td>
                                    <td class="py-3">
                                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            {{ __('Open') }}
                                        </span>
                                    </td>
                                    <td class="py-3">
                                        @if($shift->late_minutes > 0)
                                            <span class="text-red-600 dark:text-red-400 font-medium">
                                                +{{ $shift->late_minutes }} {{ __('min') }}
                                            </span>
                                        @else
                                            <span class="text-gray-400">-</span>
                                        @endif
                                    </td>
                                    <td class="py-3">
                                        @if($shift->replacement)
                                            <div class="text-xs">
                                                <span class="text-blue-600 dark:text-blue-400">
                                                    {{ $shift->replacement->replacingUser->name }}
                                                </span>
                                                <span class="text-gray-500">{{ __('replacing') }}</span>
                                                <span class="text-gray-700 dark:text-gray-300">
                                                    {{ $shift->replacement->replacedUser->name }}
                                                </span>
                                            </div>
                                            @if($shift->replacement->reason)
                                                <div class="text-xs text-gray-500 mt-1">
                                                    {{ $shift->replacement->reason }}
                                                </div>
                                            @endif
                                        @else
                                            <span class="text-gray-400">-</span>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{{ __('No active shifts at the moment') }}</p>
                </div>
            @endif
        </div>
    </div>

</x-layouts.app>
