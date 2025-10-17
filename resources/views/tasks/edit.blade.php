<x-layouts.app>
    <div class="mb-6" x-data="taskEdit">
        <!-- Breadcrumbs -->
        <div class="mb-6 flex items-center text-sm">
            <a href="{{ route('dashboard') }}"
                class="text-blue-600 dark:text-blue-400 hover:underline">{{ __('Dashboard') }}</a>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <a href="{{ route('tasks.index') }}"
                class="text-blue-600 dark:text-blue-400 hover:underline">{{ __('Tasks') }}</a>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-gray-500 dark:text-gray-400">{{ __('Edit Task') }}</span>
        </div>

        <!-- Page Title -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Edit Task') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Update task details') }}</p>
            </div>
            <a href="{{ route('tasks.index') }}" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                {{ __('Cancel') }}
            </a>
        </div>

        <!-- Task Edit Form -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <!-- Loading State -->
            <div x-show="loadingData" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading task data...') }}</p>
            </div>

            <!-- Form -->
            <form x-show="!loadingData" @submit.prevent="submitForm" class="p-6 space-y-6">
                <!-- Success Message -->
                <div x-show="successMessage" x-transition class="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative" role="alert">
                    <span x-text="successMessage"></span>
                </div>

                <!-- Error Message -->
                <div x-show="errorMessage" x-transition class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
                    <span x-text="errorMessage"></span>
                </div>

                <!-- Title -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Title') }} <span class="text-red-500">*</span>
                    </label>
                    <input type="text" id="title" x-model="formData.title" required
                        class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="{{ __('Enter task title') }}">
                    <p x-show="errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.title"></p>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Description') }}
                    </label>
                    <textarea id="description" x-model="formData.description" rows="4"
                        class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="{{ __('Enter task description') }}"></textarea>
                    <p x-show="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.description"></p>
                </div>

                <!-- Comment -->
                <div>
                    <label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Comment') }}
                    </label>
                    <textarea id="comment" x-model="formData.comment" rows="2"
                        class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="{{ __('Enter additional comments') }}"></textarea>
                    <p x-show="errors.comment" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.comment"></p>
                </div>

                <!-- Two-column layout for select fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Dealership -->
                    <div>
                        <label for="dealership_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Dealership') }}
                        </label>
                        <select id="dealership_id" x-model="formData.dealership_id"
                            class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">{{ __('Select dealership') }}</option>
                            <template x-for="dealership in dealerships" :key="dealership.id">
                                <option :value="dealership.id" x-text="dealership.name"></option>
                            </template>
                        </select>
                        <p x-show="errors.dealership_id" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.dealership_id"></p>
                    </div>

                    <!-- Task Type -->
                    <div>
                        <label for="task_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Task Type') }} <span class="text-red-500">*</span>
                        </label>
                        <select id="task_type" x-model="formData.task_type" required
                            class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">{{ __('Select task type') }}</option>
                            <option value="individual">{{ __('Individual') }}</option>
                            <option value="group">{{ __('Group') }}</option>
                        </select>
                        <p x-show="errors.task_type" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.task_type"></p>
                    </div>

                    <!-- Response Type -->
                    <div>
                        <label for="response_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Response Type') }} <span class="text-red-500">*</span>
                        </label>
                        <select id="response_type" x-model="formData.response_type" required
                            class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">{{ __('Select response type') }}</option>
                            <option value="acknowledge">{{ __('Acknowledge') }}</option>
                            <option value="complete">{{ __('Complete') }}</option>
                        </select>
                        <p x-show="errors.response_type" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.response_type"></p>
                    </div>

                    <!-- Recurrence -->
                    <div>
                        <label for="recurrence" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Recurrence') }}
                        </label>
                        <select id="recurrence" x-model="formData.recurrence"
                            class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">{{ __('No recurrence') }}</option>
                            <option value="daily">{{ __('Daily') }}</option>
                            <option value="weekly">{{ __('Weekly') }}</option>
                            <option value="monthly">{{ __('Monthly') }}</option>
                        </select>
                        <p x-show="errors.recurrence" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.recurrence"></p>
                    </div>
                </div>

                <!-- Date fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Appear Date -->
                    <div>
                        <label for="appear_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Appear Date') }}
                        </label>
                        <input type="datetime-local" id="appear_date" x-model="formData.appear_date"
                            class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <p x-show="errors.appear_date" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.appear_date"></p>
                    </div>

                    <!-- Deadline -->
                    <div>
                        <label for="deadline" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Deadline') }}
                        </label>
                        <input type="datetime-local" id="deadline" x-model="formData.deadline"
                            class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <p x-show="errors.deadline" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.deadline"></p>
                    </div>
                </div>

                <!-- Tags -->
                <div>
                    <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Tags') }}
                    </label>
                    <input type="text" id="tags" x-model="tagsInput"
                        class="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="{{ __('Enter tags separated by commas') }}">
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Separate tags with commas (e.g., urgent, sales, follow-up)') }}</p>
                    <p x-show="errors.tags" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.tags"></p>
                </div>

                <!-- Assignments -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {{ __('Assign to Users') }}
                    </label>
                    <div class="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-60 overflow-y-auto">
                        <template x-if="users.length === 0">
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ __('No users available') }}</p>
                        </template>
                        <div class="space-y-2">
                            <template x-for="user in users" :key="user.id">
                                <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded">
                                    <input type="checkbox" :value="user.id" x-model="formData.assignments"
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                    <span class="text-sm text-gray-700 dark:text-gray-300" x-text="user.full_name || user.first_name + ' ' + user.last_name"></span>
                                </label>
                            </template>
                        </div>
                    </div>
                    <p x-show="errors.assignments" class="mt-1 text-sm text-red-600 dark:text-red-400" x-text="errors.assignments"></p>
                </div>

                <!-- Form Actions -->
                <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <a href="{{ route('tasks.index') }}"
                        class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {{ __('Cancel') }}
                    </a>
                    <button type="submit" :disabled="submitting"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <span x-show="!submitting">{{ __('Update Task') }}</span>
                        <span x-show="submitting" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ __('Updating...') }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('taskEdit', () => ({
                taskId: null,
                formData: {
                    title: '',
                    description: '',
                    comment: '',
                    dealership_id: '',
                    appear_date: '',
                    deadline: '',
                    recurrence: '',
                    task_type: '',
                    response_type: '',
                    assignments: [],
                },
                tagsInput: '',
                dealerships: [],
                users: [],
                errors: {},
                loadingData: true,
                submitting: false,
                successMessage: '',
                errorMessage: '',
                async init() {
                    // Get task ID from URL
                    const pathParts = window.location.pathname.split('/');
                    this.taskId = pathParts[pathParts.length - 2]; // /tasks/{id}/edit

                    await this.loadFormData();
                },
                async loadFormData() {
                    this.loadingData = true;
                    try {
                        // Load task, dealerships and users in parallel
                        const [taskData, dealershipsData, usersData] = await Promise.all([
                            window.apiClient.getTask(this.taskId),
                            window.apiClient.getDealerships({ per_page: 100, is_active: true }),
                            window.apiClient.getUsers({ per_page: 100, is_active: true })
                        ]);

                        this.dealerships = dealershipsData.data || [];
                        this.users = usersData.data || [];

                        // Populate form with task data
                        this.formData.title = taskData.title || '';
                        this.formData.description = taskData.description || '';
                        this.formData.comment = taskData.comment || '';
                        this.formData.dealership_id = taskData.dealership_id || '';
                        this.formData.task_type = taskData.task_type || '';
                        this.formData.response_type = taskData.response_type || '';
                        this.formData.recurrence = taskData.recurrence || '';

                        // Format dates for datetime-local input
                        this.formData.appear_date = this.formatDateForInput(taskData.appear_date);
                        this.formData.deadline = this.formatDateForInput(taskData.deadline);

                        // Convert tags array to comma-separated string
                        this.tagsInput = (taskData.tags || []).join(', ');

                        // Convert assignments to array of user IDs
                        this.formData.assignments = (taskData.assignments || []).map(a => a.user_id);
                    } catch (error) {
                        console.error('Error loading task data:', error);
                        this.errorMessage = '{{ __('Failed to load task data. Please refresh the page.') }}';
                    } finally {
                        this.loadingData = false;
                    }
                },
                formatDateForInput(dateString) {
                    if (!dateString) return '';
                    try {
                        // Convert to datetime-local format: YYYY-MM-DDTHH:mm
                        const date = new Date(dateString);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        return `${year}-${month}-${day}T${hours}:${minutes}`;
                    } catch {
                        return '';
                    }
                },
                async submitForm() {
                    // Reset messages and errors
                    this.errors = {};
                    this.successMessage = '';
                    this.errorMessage = '';

                    // Validate required fields
                    if (!this.formData.title) {
                        this.errors.title = '{{ __('Title is required') }}';
                    }
                    if (!this.formData.task_type) {
                        this.errors.task_type = '{{ __('Task type is required') }}';
                    }
                    if (!this.formData.response_type) {
                        this.errors.response_type = '{{ __('Response type is required') }}';
                    }

                    // If there are validation errors, don't submit
                    if (Object.keys(this.errors).length > 0) {
                        this.errorMessage = '{{ __('Please fix the errors before submitting.') }}';
                        return;
                    }

                    this.submitting = true;

                    try {
                        // Prepare data for submission
                        const submitData = { ...this.formData };

                        // Convert tags from comma-separated string to array
                        if (this.tagsInput) {
                            submitData.tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                        } else {
                            submitData.tags = [];
                        }

                        // Remove empty values
                        Object.keys(submitData).forEach(key => {
                            if (submitData[key] === '' || submitData[key] === null) {
                                delete submitData[key];
                            }
                        });

                        // Update task
                        await window.apiClient.updateTask(this.taskId, submitData);

                        this.successMessage = '{{ __('Task updated successfully!') }}';

                        // Redirect to tasks index after a short delay
                        setTimeout(() => {
                            window.location.href = '{{ route('tasks.index') }}';
                        }, 1000);
                    } catch (error) {
                        console.error('Error updating task:', error);
                        this.errorMessage = error.message || '{{ __('Failed to update task. Please try again.') }}';

                        // If there are field-specific errors from API, display them
                        if (error.errors) {
                            this.errors = error.errors;
                        }
                    } finally {
                        this.submitting = false;
                    }
                },
            }));
        });
    </script>
</x-layouts.app>
