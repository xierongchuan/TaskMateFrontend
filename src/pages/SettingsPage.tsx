import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings';
import { usePermissions } from '../hooks/usePermissions';
import type { BotConfig } from '../types/setting';
import {
  CogIcon,
  ClockIcon,
  TrashIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';

export const SettingsPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'shifts' | 'interface' | 'notifications' | 'maintenance'>('shifts');

  const [botConfig, setBotConfig] = useState<BotConfig>({
    shift_start_time: '09:00',
    shift_end_time: '18:00',
    late_tolerance_minutes: 15,
    rows_per_page: 20,
    auto_archive_days: 30,
    notification_types: {
      task_overdue: true,
      shift_late: true,
      task_completed: false,
      system_errors: true,
    },
    bot_token: '',
    maintenance_mode: false,
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ['settings', 'bot-config'],
    queryFn: () => settingsApi.getBotConfig(),
  });

  useEffect(() => {
    if (config) {
      setBotConfig(config);
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: (data: BotConfig) => settingsApi.updateBotConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'bot-config'] });
      showSuccessNotification();
    },
  });

  const clearTasksMutation = useMutation({
    mutationFn: () => settingsApi.clearOldTasks(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showSuccessNotification('Старые задачи успешно очищены');
    },
  });

  const testBotMutation = useMutation({
    mutationFn: () => settingsApi.testBotConnection(),
    onSuccess: () => {
      showSuccessNotification('Подключение к боту успешно проверено');
    },
  });

  const showSuccessNotification = (message: string = 'Настройки успешно сохранены') => {
    // В реальном приложении здесь будет красивое уведомление
    alert(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(botConfig);
  };

  const handleClearOldTasks = () => {
    if (window.confirm('Вы уверены, что хотите очистить старые задачи? Это действие нельзя отменить.')) {
      clearTasksMutation.mutate();
    }
  };

  const handleTestBot = () => {
    testBotMutation.mutate();
  };

  const tabs = [
    { id: 'shifts', name: 'Смены', icon: ClockIcon },
    { id: 'interface', name: 'Интерфейс', icon: CogIcon },
    { id: 'notifications', name: 'Уведомления', icon: BellIcon },
    { id: 'maintenance', name: 'Обслуживание', icon: WrenchIcon },
  ];

  if (!permissions.canManageTasks) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">У вас нет прав для просмотра настроек</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="mt-2 text-sm text-gray-600">
          Управление конфигурацией системы и настройками бота
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            {/* Mobile Dropdown */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] bg-white"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Tabs */}
            <nav className="hidden sm:flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 sm:px-8 border-b-2 font-medium text-sm flex items-center min-w-[120px] justify-center transition-colors`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6">
              {/* Shift Settings Tab */}
              {activeTab === 'shifts' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Настройки смен</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Время начала смены
                      </label>
                      <input
                        type="time"
                        value={botConfig.shift_start_time || ''}
                        onChange={(e) =>
                          setBotConfig({ ...botConfig, shift_start_time: e.target.value })
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Стандартное время начала рабочих смен
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Время окончания смены
                      </label>
                      <input
                        type="time"
                        value={botConfig.shift_end_time || ''}
                        onChange={(e) =>
                          setBotConfig({ ...botConfig, shift_end_time: e.target.value })
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Стандартное время окончания рабочих смен
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Допустимое опоздание (минуты)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={botConfig.late_tolerance_minutes || 0}
                        onChange={(e) =>
                          setBotConfig({
                            ...botConfig,
                            late_tolerance_minutes: parseInt(e.target.value) || 0,
                          })
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Количество минут, после которого фиксируется опоздание
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interface Settings Tab */}
              {activeTab === 'interface' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <CogIcon className="w-6 h-6 text-green-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Настройки интерфейса</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Строк на странице
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={botConfig.rows_per_page || 10}
                        onChange={(e) =>
                          setBotConfig({
                            ...botConfig,
                            rows_per_page: parseInt(e.target.value) || 10,
                          })
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Количество записей в таблицах по умолчанию
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Автоархивация (дни)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={botConfig.auto_archive_days || 30}
                        onChange={(e) =>
                          setBotConfig({
                            ...botConfig,
                            auto_archive_days: parseInt(e.target.value) || 30,
                          })
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Автоматическая архивация задач через указанное количество дней
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <BellIcon className="w-6 h-6 text-purple-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Настройки уведомлений</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Просроченные задачи</h4>
                        <p className="text-sm text-gray-500">Уведомлять о задачах с истекшим сроком выполнения</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(botConfig as any).notification_types?.task_overdue}
                        onChange={(e) => setBotConfig({
                          ...botConfig,
                          notification_types: {
                            ...(botConfig as any).notification_types,
                            task_overdue: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Опоздания на смены</h4>
                        <p className="text-sm text-gray-500">Уведомлять об опозданиях сотрудников</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(botConfig as any).notification_types?.shift_late}
                        onChange={(e) => setBotConfig({
                          ...botConfig,
                          notification_types: {
                            ...(botConfig as any).notification_types,
                            shift_late: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Выполненные задачи</h4>
                        <p className="text-sm text-gray-500">Уведомлять о выполнении задач</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(botConfig as any).notification_types?.task_completed}
                        onChange={(e) => setBotConfig({
                          ...botConfig,
                          notification_types: {
                            ...(botConfig as any).notification_types,
                            task_completed: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Ошибки системы</h4>
                        <p className="text-sm text-gray-500">Уведомлять о системных ошибках</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(botConfig as any).notification_types?.system_errors}
                        onChange={(e) => setBotConfig({
                          ...botConfig,
                          notification_types: {
                            ...(botConfig as any).notification_types,
                            system_errors: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Maintenance Tab */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <WrenchIcon className="w-6 h-6 text-red-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Обслуживание системы</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                        <h4 className="font-medium text-yellow-800">Очистка старых задач</h4>
                      </div>
                      <p className="text-sm text-yellow-700 mb-4">
                        Удаление старых архивных задач для освобождения места в базе данных
                      </p>
                      <button
                        type="button"
                        onClick={handleClearOldTasks}
                        disabled={clearTasksMutation.isPending}
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        {clearTasksMutation.isPending ? 'Очистка...' : 'Очистить старые задачи'}
                      </button>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-medium text-blue-800">Проверка подключения к боту</h4>
                      </div>
                      <p className="text-sm text-blue-700 mb-4">
                        Проверить работоспособность подключения к Telegram боту
                      </p>
                      <button
                        type="button"
                        onClick={handleTestBot}
                        disabled={testBotMutation.isPending}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <ArrowPathIcon className="w-4 h-4 mr-2" />
                        {testBotMutation.isPending ? 'Проверка...' : 'Проверить подключение'}
                      </button>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                        <h4 className="font-medium text-red-800">Режим обслуживания</h4>
                      </div>
                      <p className="text-sm text-red-700 mb-4">
                        Отключение доступа пользователей к системе для технических работ
                      </p>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(botConfig as any).maintenance_mode}
                          onChange={(e) => setBotConfig({
                            ...botConfig,
                            maintenance_mode: e.target.checked
                          })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-red-700">
                          Включить режим обслуживания
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                * Обязательные поля для сохранения
              </div>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
              </button>
            </div>

            {/* Error Message */}
            {updateMutation.isError && (
              <div className="px-6 pb-4">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">
                      Ошибка сохранения настроек: {(updateMutation.error as any)?.response?.data?.message || 'Неизвестная ошибка'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
