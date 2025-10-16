/**
 * API Client for TaskMate Telegram Bot API
 *
 * This module provides a client for communicating with the TaskMate Telegram Bot API.
 * All data is fetched via AJAX requests from the external API.
 */

class ApiClient {
    constructor() {
        // API base URL - can be configured via environment or settings
        this.baseUrl = window.API_BASE_URL || 'http://localhost:8000/api/v1';
        this.token = this.getStoredToken();
    }

    /**
     * Get stored authentication token
     */
    getStoredToken() {
        return localStorage.getItem('api_token');
    }

    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('api_token', token);
        } else {
            localStorage.removeItem('api_token');
        }
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

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
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
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    /**
     * Logout user
     */
    async logout() {
        await this.delete('/session');
        this.setToken(null);
    }

    /**
     * Register new user
     */
    async register(login, password) {
        const data = await this.post('/register', { login, password });
        if (data.token) {
            this.setToken(data.token);
        }
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

export default apiClient;
