import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationSettingsApi } from '../api/notification-settings';
import type { NotificationSetting } from '../api/notification-settings';
import { BellIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { RoleSelector } from '../components/notifications/RoleSelector';

export const NotificationSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => notificationSettingsApi.getSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ channelType, data }: { channelType: string; data: any }) =>
      notificationSettingsApi.updateSetting(channelType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      setError(null); // Clear any previous errors
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message || 'Не удалось обновить настройки');
      console.error('Failed to update notification setting:', error);
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => notificationSettingsApi.resetToDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      setError(null);
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message || 'Не удалось сбросить настройки');
      console.error('Failed to reset settings:', error);
    },
  });

  const handleToggle = async (setting: NotificationSetting) => {
    if (isSaving) return; // Prevent double-clicks
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
    if (offset < 1 || offset > 1440) return; // Validate range
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

  const handleResetToDefaults = async () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки на значения по умолчанию?')) {
      await resetMutation.mutateAsync();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  const settings = settingsData?.data || [];

  // Group settings by category
  const taskNotifications = settings.filter(s =>
    ['task_assigned', 'task_deadline_30min', 'task_overdue', 'task_hour_late'].includes(s.channel_type)
  );

  const managerNotifications = settings.filter(s =>
    ['shift_late', 'task_postponed', 'shift_replacement'].includes(s.channel_type)
  );

  const reports = settings.filter(s =>
    ['daily_summary', 'weekly_report'].includes(s.channel_type)
  );

  const renderSettingRow = (setting: NotificationSetting) => (
    <div
      key={setting.id}
      className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow space-y-3"
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
            <h3 className="text-sm font-medium text-gray-900">{setting.channel_label}</h3>
            <p className="text-xs text-gray-500">
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
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
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
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
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
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
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
        <div className="pt-2 border-t border-gray-100">
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

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
                <div className="mt-1 text-sm text-red-700">
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
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Уведомления о задачах</h2>
          <div className="space-y-3">
            {taskNotifications.map(renderSettingRow)}
          </div>
        </div>

        {/* Manager Notifications Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👔 Уведомления для менеджеров</h2>
          <div className="space-y-3">
            {managerNotifications.map(renderSettingRow)}
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Отчёты</h2>
          <div className="space-y-3">
            {reports.map(renderSettingRow)}
          </div>
        </div>

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
