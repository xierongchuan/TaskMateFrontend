import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationSettingsApi } from '../api/notification-settings';
import { BellIcon, InformationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { NotificationSettingsContent } from '../components/notifications/NotificationSettingsContent';
import { useAuth } from '../hooks/useAuth';
import { PageContainer, Button, ConfirmDialog, Card } from '../components/ui';
import { useToast } from '../components/ui/Toast';

export const NotificationSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();
  const dealershipId = user?.dealership_id;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const resetMutation = useMutation({
    mutationFn: () => notificationSettingsApi.resetToDefaults(dealershipId || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings', dealershipId] });
      showToast({ type: 'success', message: 'Настройки сброшены по умолчанию' });
      setIsConfirmOpen(false);
    },
    onError: (error: any) => {
      console.error('Failed to reset settings:', error);
      showToast({ type: 'error', message: 'Не удалось сбросить настройки' });
      setIsConfirmOpen(false);
    },
  });

  const handleResetToDefaults = () => {
    setIsConfirmOpen(true);
  };

  const confirmReset = () => {
    resetMutation.mutate();
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <BellIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Настройки уведомлений</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Управляйте каналами уведомлений для вашего автосалона
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleResetToDefaults}
          disabled={resetMutation.isPending}
          icon={<ArrowPathIcon className="w-4 h-4" />}
        >
          Сбросить
        </Button>
      </div>

      {/* Notification Settings Content */}
      <div className="space-y-6">
        <NotificationSettingsContent dealershipId={dealershipId || undefined} />

        {/* Info Box */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
          <Card.Body>
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 dark:text-blue-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Информация</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    • Отключенные каналы не будут отправлять уведомления сотрудникам<br />
                    • Настройки применяются только к вашему автосалону<br />
                    • Изменения вступают в силу немедленно
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Сбросить настройки?"
        message="Вы уверены, что хотите сбросить все настройки на значения по умолчанию? Это действие нельзя отменить."
        variant="danger"
        confirmText="Сбросить"
        cancelText="Отмена"
        onConfirm={confirmReset}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={resetMutation.isPending}
      />
    </PageContainer>
  );
};
