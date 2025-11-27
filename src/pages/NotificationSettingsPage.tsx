import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationSettingsApi } from '../api/notification-settings';
import { BellIcon } from '@heroicons/react/24/outline';
import { NotificationSettingsContent } from '../components/notifications/NotificationSettingsContent';
import { useAuth } from '../hooks/useAuth';

export const NotificationSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const dealershipId = user?.dealership_id;

  const resetMutation = useMutation({
    mutationFn: () => notificationSettingsApi.resetToDefaults(dealershipId || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings', dealershipId] });
    },
    onError: (error: any) => {
      console.error('Failed to reset settings:', error);
    },
  });

  const handleResetToDefaults = async () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки на значения по умолчанию?')) {
      await resetMutation.mutateAsync();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Настройки уведомлений</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Управляйте каналами уведомлений для вашего автосалона
                </p>
              </div>
            </div>

            <button
              onClick={handleResetToDefaults}
              disabled={resetMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Сбросить
            </button>
          </div>
        </div>

        {/* Notification Settings Content */}
        <NotificationSettingsContent dealershipId={dealershipId || undefined} />

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <BellIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Информация</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  • Отключенные каналы не будут отправлять уведомления сотрудникам<br />
                  • Настройки применяются только к вашему автосалону<br />
                  • Изменения вступают в силу немедленно
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
