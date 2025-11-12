import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';
import { authApi } from '../api/auth';
import { setAuthHelpers } from '../api/client';
import { debugAuth } from '../utils/debug';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
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
      hasHydrated: false,

      login: async (login: string, password: string) => {
        set({ isLoading: true, error: null });
        debugAuth.log('Login attempt for user:', login);
        try {
          const response = await authApi.login({ login, password });
          debugAuth.log('Login successful, setting auth state', {
            user: response.user?.login,
            hasToken: !!response.token,
          });

          // Set all auth state at once - Zustand persist will handle storage
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          debugAuth.log('Auth state updated, isAuthenticated:', true);
        } catch (error: unknown) {
          debugAuth.error('Login failed:', error);
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
        debugAuth.log('Logout initiated');
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
          debugAuth.log('Auth state cleared, isAuthenticated:', false);
        }
      },

      refreshUser: async () => {
        // Get current state to check for token
        const currentState = useAuthStore.getState();
        const token = currentState.token;

        debugAuth.log('refreshUser called, hasToken:', !!token);

        if (!token) {
          debugAuth.log('No token found, clearing auth state');
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        try {
          const user = await authApi.getCurrentUser();
          debugAuth.log('User data refreshed successfully:', user.login);
          set({ user, isAuthenticated: true, token });
        } catch (error) {
          console.error('Refresh user error:', error);
          debugAuth.error('Failed to refresh user, clearing auth state');
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
      onRehydrateStorage: () => (state) => {
        // Mark hydration as complete after state is restored from localStorage
        if (state) {
          state.hasHydrated = true;
          debugAuth.log('Hydration complete. Auth state:', {
            isAuthenticated: state.isAuthenticated,
            hasToken: !!state.token,
            hasUser: !!state.user,
            user: state.user?.login,
          });
        }
      },
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
