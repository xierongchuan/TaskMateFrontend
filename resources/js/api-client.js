/**
 * API Client for TaskMate Telegram Bot API
 *
 * This module provides a client for communicating with the TaskMate Telegram Bot API.
 * All data is fetched via direct AJAX requests to the external API configured via environment variables.
 * Authentication is handled via Bearer tokens stored in localStorage.
 */

class ApiClient {
  constructor() {
    // API base URL from environment variables
    this.baseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:8007/api/v1";
    // Token storage key
    this.tokenKey = "taskmate_auth_token";
    this.userKey = "taskmate_user";
  }

  /**
   * Get current auth token from localStorage
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set auth token in localStorage
   */
  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Get current user from localStorage
   */
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Set current user in localStorage
   */
  setUser(user) {
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userKey);
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    this.setToken(null);
    this.setUser(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Make an API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    // Add Authorization header if token exists
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - clear auth and redirect to login
      if (response.status === 401) {
        this.clearAuth();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?expired=1";
        }
        throw new Error("Authentication required. Please login again.");
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 422 && data.errors) {
          const errorMessage =
            Object.values(data.errors).flat().join(", ") || data.message;
          throw new Error(errorMessage || "Validation failed");
        }

        throw new Error(
          data.message || `API request failed with status ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: "GET" });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // ============================================
  // Authentication Endpoints
  // ============================================

  /**
   * Login user
   * @param {string} login - Username or phone
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(login, password) {
    const data = await this.post("/session", { login, password });

    // Store token and user data
    if (data.token) {
      this.setToken(data.token);
    }
    if (data.user) {
      this.setUser(data.user);
    }

    return data;
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call API logout endpoint if authenticated
      if (this.isAuthenticated()) {
        await this.delete("/session");
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local auth data
      this.clearAuth();
    }
  }

  /**
   * Register new user
   * @param {string} login - Username or phone
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(login, password) {
    const data = await this.post("/register", { login, password });

    // Store token and user data if registration returns them
    if (data.token) {
      this.setToken(data.token);
    }
    if (data.user) {
      this.setUser(data.user);
    }

    return data;
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.get("/up");
  }

  /**
   * Get current user data from API
   */
  async getCurrentUser() {
    const user = this.getUser();
    if (!user || !user.id) {
      throw new Error("No user data available");
    }

    // Fetch fresh user data from API
    const data = await this.getUser(user.id);

    // Update stored user data
    if (data.user || data.data) {
      this.setUser(data.user || data.data);
    }

    return data;
  }

  // ============================================
  // Users Endpoints
  // ============================================

  /**
   * Get list of users
   */
  async getUsers(params = {}) {
    return this.get("/users", params);
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
   */
  async createUser(data) {
    return this.post("/users/create", data);
  }

  /**
   * Update user
   */
  async updateUser(id, data) {
    return this.put(`/users/${id}`, data);
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }

  // ============================================
  // Dealerships Endpoints
  // ============================================

  /**
   * Get list of dealerships
   */
  async getDealerships(params = {}) {
    return this.get("/dealerships", params);
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
    return this.post("/dealerships", data);
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
    return this.get("/shifts", params);
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
    return this.get("/shifts/current", params);
  }

  /**
   * Get shift statistics
   */
  async getShiftStatistics(params = {}) {
    return this.get("/shifts/statistics", params);
  }

  // ============================================
  // Tasks Endpoints
  // ============================================

  /**
   * Get list of tasks
   */
  async getTasks(params = {}) {
    return this.get("/tasks", params);
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
    return this.post("/tasks", data);
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
   * Get postponed tasks
   */
  async getPostponedTasks(params = {}) {
    return this.get("/tasks/postponed", params);
  }

  // ============================================
  // Dashboard Endpoints
  // ============================================

  /**
   * Get dashboard data
   */
  async getDashboard(params = {}) {
    return this.get("/dashboard", params);
  }

  // ============================================
  // Settings Endpoints
  // ============================================

  /**
   * Get settings
   */
  async getSettings(params = {}) {
    return this.get("/settings", params);
  }

  /**
   * Get setting by key
   */
  async getSetting(key) {
    return this.get(`/settings/${key}`);
  }

  /**
   * Create or update settings
   */
  async createOrUpdateSettings(data) {
    return this.post("/settings", data);
  }

  /**
   * Update setting by ID
   */
  async updateSetting(id, data) {
    return this.put(`/settings/${id}`, data);
  }

  /**
   * Delete setting
   */
  async deleteSetting(id) {
    return this.delete(`/settings/${id}`);
  }

  /**
   * Get shift configuration settings
   */
  async getShiftConfig() {
    return this.get("/settings/shift-config");
  }

  /**
   * Update shift configuration settings
   */
  async updateShiftConfig(data) {
    return this.post("/settings/shift-config", data);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
window.apiClient = apiClient;

// Mark API client as ready
window.apiClientReady = true;

// Expose for debugging
if (import.meta.env.DEV) {
  console.log("API Client initialized", {
    baseUrl: apiClient.baseUrl,
    isAuthenticated: apiClient.isAuthenticated(),
  });
}

export default apiClient;
