import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { DealershipSelector } from '../common/DealershipSelector';
import { useDealerships } from '../../hooks/useDealerships';
import type { User, CreateUserRequest, UpdateUserRequest, Role } from '../../types/user';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const queryClient = useQueryClient();
  const { data: dealershipsData } = useDealerships();
  const [formData, setFormData] = useState<Partial<CreateUserRequest & UpdateUserRequest>>({
    login: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'employee',
    dealership_id: undefined,
    dealership_ids: [],
    telegram_id: undefined,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        login: user.login,
        full_name: user.full_name,
        phone: user.phone || user.phone_number || '',
        role: user.role,
        dealership_id: user.dealership_id || undefined,
        dealership_ids: user.dealerships?.map(d => d.id) || [],
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
        dealership_ids: [],
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
      <div className="flex min-h-full items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-3 border min-h-[44px]"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-3 border min-h-[44px]"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-3 border min-h-[44px]"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-3 border min-h-[44px]"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-3 border min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Роль *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-3 border min-h-[44px]"
                  >
                    <option value="employee">Сотрудник</option>
                    <option value="observer">Наблюдатель</option>
                    <option value="manager">Управляющий</option>
                    {/* Only Owner can create/assign Owner role */}
                    {user?.role === 'owner' ? (
                      <option value="owner">Владелец</option>
                    ) : null}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Автосалон</label>
                  {formData.role === 'manager' ? (
                    <div className="mt-1 border rounded-md border-gray-300 p-3 max-h-48 overflow-y-auto">
                      <p className="text-sm text-gray-500 mb-2">Выберите салоны для управления:</p>
                      <div className="space-y-2">
                        {dealershipsData?.data.map((dealership) => (
                          <label key={dealership.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.dealership_ids?.includes(dealership.id)}
                              onChange={(e) => {
                                const currentIds = formData.dealership_ids || [];
                                let newIds;
                                if (e.target.checked) {
                                  newIds = [...currentIds, dealership.id];
                                } else {
                                  newIds = currentIds.filter(id => id !== dealership.id);
                                }
                                // Also update primary dealership_id to the first selected one if not set
                                const newPrimaryId = newIds.length > 0 ? newIds[0] : undefined;
                                setFormData({
                                  ...formData,
                                  dealership_ids: newIds,
                                  dealership_id: newPrimaryId
                                });
                              }}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">{dealership.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <DealershipSelector
                      value={formData.dealership_id}
                      onChange={(dealershipId) => setFormData({ ...formData, dealership_id: dealershipId || undefined })}
                      placeholder="Выберите автосалон"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Telegram ID</label>
                  <input
                    type="number"
                    value={formData.telegram_id || ''}
                    onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base px-3 py-3 border min-h-[44px]"
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
                  <div className="text-sm text-red-700">
                    <p className="font-medium">
                      {(createMutation.error as any)?.response?.data?.message || (updateMutation.error as any)?.response?.data?.message || 'Произошла ошибка'}
                    </p>
                    {/* Display validation errors details if available */}
                    {((createMutation.error as any)?.response?.data?.errors || (updateMutation.error as any)?.response?.data?.errors) && (
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {Object.entries((createMutation.error as any)?.response?.data?.errors || (updateMutation.error as any)?.response?.data?.errors || {}).map(([field, messages]: [string, any]) => (
                          <li key={field}>
                            {Array.isArray(messages) ? messages.join(', ') : messages}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
