/**
 * API Client for TaskMate Telegram Bot API
 *
 * This module provides a client for communicating with the TaskMate Telegram Bot API.
 * All data is fetched via AJAX requests through a local proxy that forwards requests
 * to the external API configured in user settings.
 */

class ApiClient {
    constructor() {
        // API base URL - now uses local proxy endpoint
        this.baseUrl = window.API_BASE_URL || '/api/proxy';
        // Token is now handled server-side in the proxy
        this.token = null;
    }

    /**
     * Refresh CSRF token
     */
    async refreshCsrfToken() {
        try {
            const response = await fetch('/csrf-token', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.csrf_token) {
                    // Update meta tag
                    const metaTag = document.querySelector('meta[name="csrf-token"]');
                    if (metaTag) {
                        metaTag.setAttribute('content', data.csrf_token);
                    }
                    return data.csrf_token;
                }
            }
        } catch (error) {
            console.error('Failed to refresh CSRF token:', error);
        }
        return null;
    }

    /**
     * Get current CSRF token
     */
    getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    }

    /**
     * Make an API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        // Add CSRF token for web routes
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        // Token is now handled server-side in the proxy
        // No need to send Authorization header from frontend

        const config = {
            ...options,
            headers,
            credentials: 'same-origin', // Important for CSRF cookies
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle CSRF errors
                if (response.status === 419) {
                    throw new Error('CSRF token expired. Please refresh the page and try again.');
                }

                // Handle validation errors (including CSRF)
                if (response.status === 422 && data.errors) {
                    const errorMessage = data.errors?.['X-CSRF-TOKEN']?.[0] ||
                                       data.errors?.['csrf_token']?.[0] ||
                                       Object.values(data.errors).flat().join(', ') ||
                                       data.message;
                    throw new Error(errorMessage || 'Validation failed');
                }

                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);

            // If CSRF token is missing or expired, try to refresh it
            if (error.message.includes('CSRF') || error.message.includes('419')) {
                console.warn('CSRF token issue detected, attempting to refresh...');

                // Try to refresh the token and retry the request once
                try {
                    const newToken = await this.refreshCsrfToken();
                    if (newToken) {
                        console.log('CSRF token refreshed, retrying request...');
                        // Update headers with new token
                        config.headers['X-CSRF-TOKEN'] = newToken;

                        // Retry the request
                        const retryResponse = await fetch(url, config);
                        const retryData = await retryResponse.json();

                        if (retryResponse.ok) {
                            return retryData;
                        } else {
                            throw new Error(retryData.message || 'API request failed after token refresh');
                        }
                    }
                } catch (retryError) {
                    console.error('Failed to retry request after CSRF refresh:', retryError);
                    error.message = 'CSRF validation failed. Please refresh the page and try again.';
                }
            }

            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${endpoint}?${query}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // ============================================
    // Authentication Endpoints
    // ============================================

    /**
     * Login user
     */
    async login(login, password) {
        const data = await this.post('/session', { login, password });
        // Token is now handled server-side
        return data;
    }

    /**
     * Logout user
     */
    async logout() {
        await this.delete('/session');
        // Token is now handled server-side
    }

    /**
     * Register new user
     */
    async register(login, password) {
        const data = await this.post('/register', { login, password });
        // Token is now handled server-side
        return data;
    }

    /**
     * Health check
     */
    async healthCheck() {
        return this.get('/up');
    }

    // ============================================
    // Users Endpoints
    // ============================================

    /**
     * Get list of users
     */
    async getUsers(params = {}) {
        return this.get('/users', params);
    }

    /**
     * Get user by ID
     */
    async getUser(id) {
        return this.get(`/users/${id}`);
    }

    /**
     * Get user status
     */
    async getUserStatus(id) {
        return this.get(`/users/${id}/status`);
    }

    /**
     * Create new user (public endpoint)
     * Uses the public endpoint for creating users without authentication
     */
    async createUser(data) {
        return this.post('/users/create', data);
    }

    /**
     * Update user
     * Note: This endpoint may not be available in the Telegram Bot API
     * as users are managed through the Telegram bot registration process
     */
    async updateUser(id, data) {
        return this.put(`/users/${id}`, data);
    }

    // ============================================
    // Dealerships Endpoints
    // ============================================

    /**
     * Get list of dealerships
     */
    async getDealerships(params = {}) {
        return this.get('/dealerships', params);
    }

    /**
     * Get dealership by ID
     */
    async getDealership(id) {
        return this.get(`/dealerships/${id}`);
    }

    /**
     * Create new dealership
     */
    async createDealership(data) {
        return this.post('/dealerships', data);
    }

    /**
     * Update dealership
     */
    async updateDealership(id, data) {
        return this.put(`/dealerships/${id}`, data);
    }

    /**
     * Delete dealership
     */
    async deleteDealership(id) {
        return this.delete(`/dealerships/${id}`);
    }

    // ============================================
    // Shifts Endpoints
    // ============================================

    /**
     * Get list of shifts
     */
    async getShifts(params = {}) {
        return this.get('/shifts', params);
    }

    /**
     * Get shift by ID
     */
    async getShift(id) {
        return this.get(`/shifts/${id}`);
    }

    /**
     * Get current open shifts
     */
    async getCurrentShifts(dealershipId = null) {
        const params = dealershipId ? { dealership_id: dealershipId } : {};
        return this.get('/shifts/current', params);
    }

    /**
     * Get shift statistics
     */
    async getShiftStatistics(params = {}) {
        return this.get('/shifts/statistics', params);
    }

    // ============================================
    // Tasks Endpoints
    // ============================================

    /**
     * Get list of tasks
     */
    async getTasks(params = {}) {
        return this.get('/tasks', params);
    }

    /**
     * Get task by ID
     */
    async getTask(id) {
        return this.get(`/tasks/${id}`);
    }

    /**
     * Create new task
     */
    async createTask(data) {
        return this.post('/tasks', data);
    }

    /**
     * Update task
     */
    async updateTask(id, data) {
        return this.put(`/tasks/${id}`, data);
    }

    /**
     * Delete task
     */
    async deleteTask(id) {
        return this.delete(`/tasks/${id}`);
    }

    /**
     * Get task statistics
     */
    async getTaskStatistics(params = {}) {
        return this.get('/tasks/statistics', params);
    }

    /**
     * Get overdue tasks
     */
    async getOverdueTasks(params = {}) {
        return this.get('/tasks/overdue', params);
    }

    /**
     * Get postponed tasks
     */
    async getPostponedTasks(params = {}) {
        return this.get('/tasks/postponed', params);
    }

    // ============================================
    // Task Responses Endpoints
    // ============================================

    /**
     * Update task response
     */
    async updateTaskResponse(taskId, data) {
        return this.put(`/tasks/${taskId}/responses`, data);
    }

    // ============================================
    // Dashboard Endpoints
    // ============================================

    /**
     * Get dashboard data
     */
    async getDashboard(params = {}) {
        return this.get('/dashboard', params);
    }

    // ============================================
    // Settings Endpoints
    // ============================================

    /**
     * Get settings
     */
    async getSettings(params = {}) {
        return this.get('/settings', params);
    }

    /**
     * Get setting by key
     */
    async getSetting(key) {
        return this.get(`/settings/${key}`);
    }

    /**
     * Update setting
     */
    async updateSetting(key, value) {
        return this.put(`/settings/${key}`, { value });
    }

    /**
     * Bulk update settings
     */
    async bulkUpdateSettings(settings) {
        return this.post('/settings/bulk', { settings });
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
window.apiClient = apiClient;

// Mark API client as ready
window.apiClientReady = true;

export default apiClient;
