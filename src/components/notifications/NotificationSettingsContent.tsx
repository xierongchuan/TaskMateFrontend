import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationSettingsApi } from '../../api/notification-settings';
import type { NotificationSetting } from '../../api/notification-settings';
import { ClockIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { RoleSelector } from './RoleSelector';

interface NotificationSettingsContentProps {
  dealershipId?: number;
}

export const NotificationSettingsContent: React.FC<NotificationSettingsContentProps> = ({ dealershipId }) => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['notification-settings', dealershipId],
    queryFn: () => notificationSettingsApi.getSettings(dealershipId),
    enabled: !!dealershipId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ channelType, data }: { channelType: string; data: any }) =>
      notificationSettingsApi.updateSetting(channelType, { ...data, dealership_id: dealershipId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings', dealershipId] });
      setError(null);
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message || 'Не удалось обновить настройки');
      console.error('Failed to update notification setting:', error);
    },
  });

  const handleToggle = async (setting: NotificationSetting) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        channelType: setting.channel_type,
        data: { is_enabled: !setting.is_enabled },
      });
    } catch (error) {
      console.error('Error toggling notification:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeChange = async (setting: NotificationSetting, time: string) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        channelType: setting.channel_type,
        data: { notification_time: time },
      });
    } catch (error) {
      console.error('Error updating time:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDayChange = async (setting: NotificationSetting, day: string) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        channelType: setting.channel_type,
        data: { notification_day: day },
      });
    } catch (error) {
      console.error('Error updating day:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOffsetChange = async (setting: NotificationSetting, offset: number) => {
    if (offset < 1 || offset > 1440) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        channelType: setting.channel_type,
        data: { notification_offset: offset },
      });
    } catch (error) {
      console.error('Error updating offset:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRolesChange = async (setting: NotificationSetting, roles: string[]) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        channelType: setting.channel_type,
        data: { recipient_roles: roles },
      });
    } catch (error) {
      console.error('Error updating roles:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Если не выбран дилерский центр, показываем сообщение
  if (!dealershipId) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Выберите дилерский центр</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Для настройки уведомлений необходимо выбрать дилерский центр в выпадающем списке вверху страницы.
              Настройки уведомлений применяются отдельно для каждого автосалона.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  const settings = settingsData?.data || [];

  // Если настройки пусты, показываем информацию
  if (settings.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex">
          <InformationCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">Настройки уведомлений не найдены</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Для выбранного дилерского центра не настроены уведомления.
              Попробуйте выбрать другой автосалон или обратитесь к администратору.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Group settings by category
  const taskNotifications = settings.filter(s =>
    ['task_assigned', 'task_deadline_30min', 'task_overdue', 'task_hour_late'].includes(s.channel_type)
  );

  const managerNotifications = settings.filter(s =>
    ['shift_late', 'shift_replacement'].includes(s.channel_type)
  );

  const reports = settings.filter(s =>
    ['daily_summary', 'weekly_report'].includes(s.channel_type)
  );

  const renderSettingRow = (setting: NotificationSetting) => (
    <div
      key={setting.id}
      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className={`flex-shrink-0 ${setting.is_enabled ? 'text-green-500' : 'text-gray-400'}`}>
            {setting.is_enabled ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              <XCircleIcon className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{setting.channel_label}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {setting.channel_type}
            </p>
          </div>

          {/* Time picker for scheduled notifications */}
          {(setting.channel_type === 'daily_summary' || setting.channel_type === 'weekly_report') && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={setting.notification_time || ''}
                onChange={(e) => handleTimeChange(setting, e.target.value)}
                disabled={!setting.is_enabled || isSaving}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Day picker for weekly reports */}
          {setting.channel_type === 'weekly_report' && (
            <div className="flex items-center space-x-2">
              <select
                value={setting.notification_day || 'monday'}
                onChange={(e) => handleDayChange(setting, e.target.value)}
                disabled={!setting.is_enabled || isSaving}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="monday">Понедельник</option>
                <option value="tuesday">Вторник</option>
                <option value="wednesday">Среда</option>
                <option value="thursday">Четверг</option>
                <option value="friday">Пятница</option>
                <option value="saturday">Суббота</option>
                <option value="sunday">Воскресенье</option>
              </select>
            </div>
          )}

          {/* Offset picker for time-based notifications */}
          {(setting.channel_type === 'task_deadline_30min' || setting.channel_type === 'task_hour_late') && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                min="1"
                max="1440"
                value={setting.notification_offset || (setting.channel_type === 'task_deadline_30min' ? 30 : 60)}
                onChange={(e) => handleOffsetChange(setting, parseInt(e.target.value))}
                disabled={!setting.is_enabled || isSaving}
                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-xs text-gray-500">мин</span>
            </div>
          )}
        </div>

        {/* Toggle switch */}
        <button
          onClick={() => handleToggle(setting)}
          disabled={isSaving}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 ${setting.is_enabled ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${setting.is_enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </button>
      </div>

      {/* Role selector - show only when enabled */}
      {setting.is_enabled && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <RoleSelector
            value={setting.recipient_roles || []}
            onChange={(roles) => handleRolesChange(setting, roles)}
            disabled={isSaving}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Ошибка</h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                <p>{error}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex text-red-400 hover:text-red-500 focus:outline-none"
              >
                <span className="sr-only">Закрыть</span>
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Notifications Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Уведомления о задачах</h2>
        <div className="space-y-3">
          {taskNotifications.map(renderSettingRow)}
        </div>
      </div>

      {/* Manager Notifications Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👔 Уведомления для менеджеров</h2>
        <div className="space-y-3">
          {managerNotifications.map(renderSettingRow)}
        </div>
      </div>

      {/* Reports Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Отчёты</h2>
        <div className="space-y-3">
          {reports.map(renderSettingRow)}
        </div>
      </div>
    </div>
  );
};
