import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { Role } from '../../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { isAuthenticated, user, refreshUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshUser();
    }
  }, [isAuthenticated, user, refreshUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Доступ запрещен</h2>
            <p className="mt-2 text-sm text-gray-600">
              У вас недостаточно прав для просмотра этой страницы.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Требуемые роли: {requiredRoles.join(', ')}
            </p>
            <p className="mt-1 text-sm text-gray-500">Ваша роль: {user.role}</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
