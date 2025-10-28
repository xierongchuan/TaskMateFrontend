import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { usePermissions } from '../hooks/usePermissions';
import { UserModal } from '../components/users/UserModal';
import type { User } from '../types/user';

export const UsersPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
  });

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getUsers(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя "${user.full_name}"?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      employee: 'bg-blue-100 text-blue-800',
      observer: 'bg-purple-100 text-purple-800',
      manager: 'bg-green-100 text-green-800',
      owner: 'bg-red-100 text-red-800',
    };
    const labels = {
      employee: 'Сотрудник',
      observer: 'Наблюдатель',
      manager: 'Управляющий',
      owner: 'Владелец',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Пользователи</h1>
          <p className="mt-2 text-sm text-gray-700">
            Управление пользователями системы
          </p>
        </div>
        {permissions.canCreateUsers && (
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Создать пользователя
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
            <input
              type="text"
              placeholder="Имя или логин..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Все</option>
              <option value="employee">Сотрудник</option>
              <option value="observer">Наблюдатель</option>
              <option value="manager">Управляющий</option>
              <option value="owner">Владелец</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ошибка загрузки пользователей</p>
        </div>
      ) : usersData?.data.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {usersData?.data.map((user) => (
              <li key={user.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.full_name}
                        </h3>
                        {getRoleBadge(user.role)}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>Логин: {user.login}</span>
                        {user.phone && <span>Телефон: {user.phone}</span>}
                        {user.dealership_id && <span>Автосалон ID: {user.dealership_id}</span>}
                        {user.telegram_id && <span>Telegram ID: {user.telegram_id}</span>}
                      </div>
                    </div>
                    {permissions.canCreateUsers && (
                      <div className="ml-4 flex-shrink-0 flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Изменить
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};
