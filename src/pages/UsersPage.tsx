import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../hooks/useAuth';
import { UserModal } from '../components/users/UserModal';
import { formatPhoneNumber } from '../utils/phoneFormatter';
import type { User } from '../types/user';
import type { Dealership } from '../types/dealership';
import { XCircleIcon } from '@heroicons/react/24/outline';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  EyeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export const UsersPage: React.FC = () => {
  const permissions = usePermissions();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    dealership_id: currentUser?.dealership_id || undefined,
    has_telegram: '',
  });

  // Fetch dealerships for filtering
  const { data: dealershipsData } = useQuery({
    queryKey: ['dealerships'],
    queryFn: () => usersApi.getDealerships(),
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

  const handleRoleChange = (user: User, newRole: string) => {
    usersApi.updateUser(user.id, { role: newRole }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });
  };


  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      dealership_id: currentUser?.dealership_id || undefined,
      has_telegram: '',
    });
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      employee: 'bg-blue-100 text-blue-800 border-blue-200',
      observer: 'bg-purple-100 text-purple-800 border-purple-200',
      manager: 'bg-green-100 text-green-800 border-green-200',
      owner: 'bg-red-100 text-red-800 border-red-200',
    };

    const icons = {
      employee: <UserIcon className="w-3 h-3" />,
      observer: <EyeIcon className="w-3 h-3" />,
      manager: <UserGroupIcon className="w-3 h-3" />,
      owner: <ShieldCheckIcon className="w-3 h-3" />,
    };

    const labels = {
      employee: 'Сотрудник',
      observer: 'Наблюдатель',
      manager: 'Управляющий',
      owner: 'Владелец',
    };

    const descriptions = {
      employee: 'Только доступ к боту',
      observer: 'Только просмотр',
      manager: 'Управление салонами',
      owner: 'Полный доступ',
    };

    return (
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
          {icons[role as keyof typeof icons]}
          <span className="ml-1">{labels[role as keyof typeof labels] || role}</span>
        </span>
        <span className="text-xs text-gray-500 hidden sm:inline">
          {descriptions[role as keyof typeof descriptions]}
        </span>
      </div>
    );
  };

  const getUserCardClass = (user: User) => {
    const baseClasses = 'bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200';

    if (!user.telegram_id) {
      return `${baseClasses} border-orange-200 bg-orange-50`;
    }

    return `${baseClasses} border-gray-200`;
  };

  const getDealershipsDisplay = (user: User) => {
    if (user.dealerships && user.dealerships.length > 0) {
      return user.dealerships.map(d => d.name).join(', ');
    }
    return user.dealership?.name || 'Не привязан';
  };

  return (
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Сотрудники</h1>
            <p className="mt-2 text-sm text-gray-600">
              Управление сотрудниками, ролями и доступом к салонам
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-initial px-3 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Список
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex-1 sm:flex-initial px-3 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'cards'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Карточки
              </button>
            </div>
            {permissions.canCreateUsers && (
              <button
                onClick={handleCreate}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Добавить сотрудника
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" />
                Поиск
              </label>
              <input
                type="text"
                placeholder="Имя, логин..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Роль</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              >
                <option value="">Все роли</option>
                <option value="employee">Сотрудник</option>
                <option value="observer">Наблюдатель</option>
                <option value="manager">Управляющий</option>
                <option value="owner">Владелец</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Автосалон</label>
              <select
                value={filters.dealership_id}
                onChange={(e) => setFilters({ ...filters, dealership_id: e.target.value ? Number(e.target.value) : undefined })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              >
                <option value="">Все салоны</option>
                {dealershipsData?.data.map((dealership: Dealership) => (
                  <option key={dealership.id} value={dealership.id}>
                    {dealership.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telegram</label>
              <select
                value={filters.has_telegram}
                onChange={(e) => setFilters({ ...filters, has_telegram: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              >
                <option value="">Все</option>
                <option value="connected">Подключен</option>
                <option value="not_connected">Не подключен</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Сбросить
              </button>
            </div>
          </div>

        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800">Ошибка загрузки сотрудников</p>
          </div>
        </div>
      ) : usersData?.data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <UserIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Сотрудники не найдены</h3>
          <p className="text-gray-500">
            {filters.search || filters.role || filters.dealership_id ?
              'Попробуйте изменить фильтры для поиска сотрудников' :
              'Добавьте первого сотрудника для начала работы'}
          </p>
        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {usersData?.data.map((user) => (
                  <div key={user.id} className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${getUserCardClass(user)}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold ${user.role === 'owner' ? 'bg-red-500' :
                              user.role === 'manager' ? 'bg-green-500' :
                                user.role === 'observer' ? 'bg-purple-500' : 'bg-blue-500'
                              }`}>
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            {!user.telegram_id && (
                              <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full" title="Нет Telegram"></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {user.full_name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">@{user.login}</p>
                          </div>
                        </div>

                        {getRoleBadge(user.role)}

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center text-gray-500">
                            <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{formatPhoneNumber(user.phone_number || user.phone)}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <BuildingOfficeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate" title={getDealershipsDisplay(user)}>
                              {getDealershipsDisplay(user)}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className={user.telegram_id ? 'text-green-600' : 'text-orange-600'}>
                              {user.telegram_id ? 'Подключен' : 'Не подключен'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {permissions.canCreateUsers && (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row sm:flex-col gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
                            >
                              <PencilIcon className="w-4 h-4 mr-1 sm:mr-0" />
                              <span className="hidden sm:inline">Изменить</span>
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={deleteMutation.isPending}
                              className="inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px]"
                            >
                              <TrashIcon className="w-4 h-4 mr-1 sm:mr-0" />
                              <span className="hidden sm:inline">Удалить</span>
                            </button>
                          </div>

                          {/* Quick Role Change */}
                          {currentUser?.role === 'owner' && (
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user, e.target.value)}
                              className="w-full sm:w-auto text-sm px-2 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500 min-h-[44px]"
                            >
                              <option value="employee">Сотрудник</option>
                              <option value="observer">Наблюдатель</option>
                              <option value="manager">Управляющий</option>
                              <option value="owner">Владелец</option>
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersData?.data.map((user) => (
                <div key={user.id} className={`p-4 sm:p-6 ${getUserCardClass(user)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${user.role === 'owner' ? 'bg-red-500' :
                        user.role === 'manager' ? 'bg-green-500' :
                          user.role === 'observer' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      {!user.telegram_id && (
                        <div className="ml-2 -mt-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" title="Нет Telegram"></div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {permissions.canCreateUsers && (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.full_name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">@{user.login}</p>
                  </div>

                  <div className="mb-4">
                    {getRoleBadge(user.role)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{formatPhoneNumber(user.phone_number || user.phone)}</span>
                    </div>
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate" title={getDealershipsDisplay(user)}>
                        {getDealershipsDisplay(user)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className={user.telegram_id ? 'text-green-600' : 'text-orange-600'}>
                        {user.telegram_id ? 'Подключен' : 'Не подключен'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};
