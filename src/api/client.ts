import axios, { type AxiosInstance, type AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8007/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Import useAuthStore dynamically to avoid circular dependencies
let getAuthToken: (() => string | null) | null = null;
let clearAuth: (() => void) | null = null;

export const setAuthHelpers = (
  tokenGetter: () => string | null,
  authClearer: () => void
) => {
  getAuthToken = tokenGetter;
  clearAuth = authClearer;
};

apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store via helper function
    const token = getAuthToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth state via Zustand store
      clearAuth?.();
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Недостаточно прав:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
