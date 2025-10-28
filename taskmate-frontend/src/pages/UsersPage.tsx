import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

export const UsersPage: React.FC = () => {
  const permissions = usePermissions();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Пользователи</h1>
          <p className="mt-2 text-sm text-gray-700">
            Список всех пользователей в системе
          </p>
        </div>
        {permissions.canCreateUsers && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Создать пользователя
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-500">
            Список пользователей будет отображаться здесь
          </p>
        </div>
      </div>
    </div>
  );
};
