            <aside :class="{ 'w-full md:w-64': sidebarOpen, 'w-0 md:w-16 hidden md:block': !sidebarOpen }"
                class="bg-sidebar text-sidebar-foreground border-r border-gray-200 dark:border-gray-700 sidebar-transition overflow-hidden">
                <!-- Sidebar Content -->
                <div class="h-full flex flex-col">
                    <!-- Sidebar Menu -->
                    <nav class="flex-1 overflow-y-auto custom-scrollbar py-4">
                        <ul class="space-y-1 px-2">
                            <!-- Dashboard -->
                            <x-layouts.sidebar-link href="{{ route('dashboard') }}" icon='fas-chart-line'
                                :active="request()->routeIs('dashboard*')">Dashboard</x-layouts.sidebar-link>

                            <!-- Tasks -->
                            <x-layouts.sidebar-link href="{{ route('tasks.index') }}" icon='fas-list-check'
                                :active="request()->routeIs('tasks*')">Tasks</x-layouts.sidebar-link>

                            <!-- Dealerships -->
                            <x-layouts.sidebar-link href="{{ route('dealerships.index') }}" icon='fas-building'
                                :active="request()->routeIs('dealerships*')">Dealerships</x-layouts.sidebar-link>

                            <!-- Users -->
                            <x-layouts.sidebar-link href="{{ route('users.index') }}" icon='fas-users'
                                :active="request()->routeIs('users*')">Employees</x-layouts.sidebar-link>

                            <!-- Links -->
                            <x-layouts.sidebar-link href="{{ route('links.index') }}" icon='fas-link'
                                :active="request()->routeIs('links*')">Quick Links</x-layouts.sidebar-link>
                        </ul>
                    </nav>
                </div>
            </aside>
