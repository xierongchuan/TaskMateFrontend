<x-layouts.app>
    <div class="mb-6" x-data="linksIndex">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ __('Quick Links') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ __('Manage important links and bookmarks') }}</p>
            </div>
            <button @click="showAddForm = true" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Add Link') }}
            </button>
        </div>

        <!-- Add/Edit Link Modal -->
        <div x-show="showAddForm || editingLink" x-cloak class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="closeForm">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white dark:bg-gray-800">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100" x-text="editingLink ? '{{ __('Edit Link') }}' : '{{ __('Add New Link') }}'"></h3>
                    <button @click="closeForm" class="text-gray-400 hover:text-gray-600">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="saveLink" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Title') }} <span class="text-red-500">*</span>
                        </label>
                        <input type="text" x-model="formData.title" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            placeholder="{{ __('e.g., CRM System') }}">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('URL') }} <span class="text-red-500">*</span>
                        </label>
                        <input type="url" x-model="formData.url" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            placeholder="{{ __('https://example.com') }}">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Description') }}
                        </label>
                        <textarea x-model="formData.description" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            placeholder="{{ __('Optional description') }}"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {{ __('Icon') }}
                        </label>
                        <select x-model="formData.icon"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                            <option value="link">🔗 {{ __('Link') }}</option>
                            <option value="document">📄 {{ __('Document') }}</option>
                            <option value="chart">📊 {{ __('Dashboard') }}</option>
                            <option value="database">🗄️ {{ __('Database') }}</option>
                            <option value="email">📧 {{ __('Email') }}</option>
                            <option value="folder">📁 {{ __('Folder') }}</option>
                        </select>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="closeForm"
                            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            {{ __('Cancel') }}
                        </button>
                        <button type="submit" :disabled="submitting"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                            <span x-show="!submitting" x-text="editingLink ? '{{ __('Update') }}' : '{{ __('Add') }}'"></span>
                            <span x-show="submitting">{{ __('Saving...') }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Loading State -->
        <div x-show="loading" class="text-center py-12 mt-6">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ __('Loading links...') }}</p>
        </div>

        <!-- Links Grid -->
        <div x-show="!loading && links.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <template x-for="link in links" :key="link.id">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between">
                        <div class="flex items-start space-x-3 flex-1">
                            <span class="text-2xl" x-text="getIcon(link.icon)"></span>
                            <div class="flex-1 min-w-0">
                                <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate" x-text="link.title"></h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400 truncate" x-text="link.url"></p>
                                <p x-show="link.description" class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2" x-text="link.description"></p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 ml-2">
                            <button @click="editLink(link)" class="text-gray-400 hover:text-blue-600">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button @click="deleteLink(link.id)" class="text-gray-400 hover:text-red-600">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="mt-3">
                        <a :href="link.url" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                            {{ __('Open') }}
                            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </template>
        </div>

        <!-- Empty State -->
        <div x-show="!loading && links.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center mt-6">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{{ __('No links yet') }}</h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">{{ __('Add your first link to get started') }}</p>
            <button @click="showAddForm = true" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {{ __('Add Link') }}
            </button>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('linksIndex', () => ({
                links: [],
                loading: true,
                showAddForm: false,
                editingLink: null,
                submitting: false,
                formData: {
                    title: '',
                    url: '',
                    description: '',
                    icon: 'link'
                },
                async init() {
                    await this.loadLinks();
                },
                async loadLinks() {
                    this.loading = true;
                    try {
                        // Links are stored in settings as JSON
                        const setting = await window.apiClient.getSetting('quick_links');
                        this.links = setting.value ? JSON.parse(setting.value) : [];
                    } catch (error) {
                        console.error('Error loading links:', error);
                        // If setting doesn't exist, start with empty array
                        this.links = [];
                    } finally {
                        this.loading = false;
                    }
                },
                closeForm() {
                    this.showAddForm = false;
                    this.editingLink = null;
                    this.formData = {
                        title: '',
                        url: '',
                        description: '',
                        icon: 'link'
                    };
                },
                async saveLink() {
                    this.submitting = true;
                    try {
                        if (this.editingLink) {
                            // Update existing link
                            const index = this.links.findIndex(l => l.id === this.editingLink.id);
                            if (index !== -1) {
                                this.links[index] = { ...this.formData, id: this.editingLink.id };
                            }
                        } else {
                            // Add new link
                            const newLink = {
                                ...this.formData,
                                id: Date.now(), // Simple ID generation
                                created_at: new Date().toISOString()
                            };
                            this.links.push(newLink);
                        }

                        // Save to API
                        await window.apiClient.updateSetting('quick_links', JSON.stringify(this.links));

                        this.closeForm();
                    } catch (error) {
                        console.error('Error saving link:', error);
                        alert('{{ __('Failed to save link. Please try again.') }}');
                    } finally {
                        this.submitting = false;
                    }
                },
                editLink(link) {
                    this.editingLink = link;
                    this.formData = { ...link };
                },
                async deleteLink(linkId) {
                    if (!confirm('{{ __('Are you sure you want to delete this link?') }}')) {
                        return;
                    }

                    try {
                        this.links = this.links.filter(l => l.id !== linkId);
                        await window.apiClient.updateSetting('quick_links', JSON.stringify(this.links));
                    } catch (error) {
                        console.error('Error deleting link:', error);
                        alert('{{ __('Failed to delete link. Please try again.') }}');
                    }
                },
                getIcon(iconName) {
                    const icons = {
                        'link': '🔗',
                        'document': '📄',
                        'chart': '📊',
                        'database': '🗄️',
                        'email': '📧',
                        'folder': '📁'
                    };
                    return icons[iconName] || '🔗';
                }
            }));
        });
    </script>

    <style>
        [x-cloak] { display: none !important; }
        .line-clamp-2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    </style>
</x-layouts.app>
