import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { DealershipSelector } from '../common/DealershipSelector';
import type { User, CreateUserRequest, UpdateUserRequest, Role } from '../../types/user';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<CreateUserRequest & UpdateUserRequest>>({
    login: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'employee',
    dealership_id: undefined,
    telegram_id: undefined,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        login: user.login,
        full_name: user.full_name,
        phone: user.phone || '',
        role: user.role,
        dealership_id: user.dealership_id || undefined,
        telegram_id: user.telegram_id || undefined,
      });
    } else {
      setFormData({
        login: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'employee',
        dealership_id: undefined,
        telegram_id: undefined,
      });
    }
  }, [user]);

  const createMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.updateUser(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateMutation.mutate(formData as UpdateUserRequest);
    } else {
      createMutation.mutate(formData as CreateUserRequest);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {user ? 'Редактировать пользователя' : 'Создать пользователя'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Логин *</label>
                  <input
                    type="text"
                    required
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                {!user && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Пароль *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                )}

                {user && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Новый пароль (оставьте пустым, чтобы не менять)</label>
                    <input
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Полное имя *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Телефон *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 XXX XXX XX XX"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Роль *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  >
                    <option value="employee">Сотрудник</option>
                    <option value="observer">Наблюдатель</option>
                    <option value="manager">Управляющий</option>
                    <option value="owner">Владелец</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Автосалон</label>
                  <DealershipSelector
                    value={formData.dealership_id}
                    onChange={(dealershipId) => setFormData({ ...formData, dealership_id: dealershipId || undefined })}
                    placeholder="Выберите автосалон"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Telegram ID</label>
                  <input
                    type="number"
                    value={formData.telegram_id || ''}
                    onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {user ? 'Сохранить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Отмена
              </button>
            </div>

            {(createMutation.isError || updateMutation.isError) && (
              <div className="px-4 pb-4">
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">
                    Ошибка: {(createMutation.error as any)?.response?.data?.message || (updateMutation.error as any)?.response?.data?.message || 'Неизвестная ошибка'}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
