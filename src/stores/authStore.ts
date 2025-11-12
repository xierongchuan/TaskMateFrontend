import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';
import { authApi } from '../api/auth';
import { setAuthHelpers } from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (login: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ login, password });

          // Set all auth state at once - Zustand persist will handle storage
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error && typeof error === 'object' && 'response' in error
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Ошибка входа'
            : 'Ошибка входа';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear auth state - Zustand persist will handle storage cleanup
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      refreshUser: async () => {
        // Get current state to check for token
        const currentState = useAuthStore.getState();
        const token = currentState.token;

        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        try {
          const user = await authApi.getCurrentUser();
          set({ user, isAuthenticated: true, token });
        } catch (error) {
          console.error('Refresh user error:', error);
          // Clear all auth state on error
          set({ isAuthenticated: false, user: null, token: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Register auth helpers with API client to avoid circular dependencies
setAuthHelpers(
  () => useAuthStore.getState().token,
  () => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }
);
