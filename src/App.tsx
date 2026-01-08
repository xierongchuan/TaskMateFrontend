import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { TaskGeneratorsPage } from './pages/TaskGeneratorsPage';
import { ArchivedTasksPage } from './pages/ArchivedTasksPage';
import { UsersPage } from './pages/UsersPage';
import { ShiftsPage } from './pages/ShiftsPage';
import { LinksPage } from './pages/LinksPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DealershipsPage } from './pages/DealershipsPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { debugAuth } from './utils/debug';
import './index.css';

import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { isAuthenticated, token, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    // After Zustand persist hydrates, check if we have a token but no user data
    // Only refresh if we have token but missing user data to avoid unnecessary API calls
    debugAuth.log('App useEffect triggered', {
      hasHydrated,
      hasToken: !!token,
      isAuthenticated,
      hasUser: !!user,
    });

    if (hasHydrated && token && isAuthenticated && !user) {
      debugAuth.log('Has token but no user data, calling refreshUser');
      // Get refreshUser directly from store to avoid dependency issues
      useAuthStore.getState().refreshUser();
    }
  }, [hasHydrated, token, isAuthenticated, user]);

  // Show loading screen while Zustand persist is hydrating state from localStorage
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route
                path="task-generators"
                element={
                  <ProtectedRoute requiredRoles={['manager', 'owner']}>
                    <TaskGeneratorsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="archived-tasks"
                element={
                  <ProtectedRoute requiredRoles={['manager', 'owner']}>
                    <ArchivedTasksPage />
                  </ProtectedRoute>
                }
              />
              <Route path="users" element={<Navigate to="/employees" replace />} />
              <Route
                path="employees"
                element={
                  <ProtectedRoute requiredRoles={['manager', 'owner', 'observer']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route path="shifts" element={<ShiftsPage />} />
              <Route path="links" element={<LinksPage />} />
              <Route
                path="dealerships"
                element={
                  <ProtectedRoute requiredRoles={['manager', 'owner']}>
                    <DealershipsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute requiredRoles={['manager', 'owner']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute requiredRoles={['manager', 'owner']}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="notification-settings"
                element={
                  <ProtectedRoute requiredRoles={['manager', 'owner']}>
                    <NotificationSettingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

