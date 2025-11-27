import React, { useState, useEffect } from 'react';
import { useShiftConfig, useBotConfig, useUpdateShiftConfig, useUpdateBotConfig, useDealershipSettings } from '../hooks/useSettings';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../hooks/useAuth';
import { DealershipSelector } from '../components/common/DealershipSelector';
import type { BotConfig, ShiftConfig } from '../types/setting';
import {
  CogIcon,
  ClockIcon,
  // TrashIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  WrenchIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { NotificationSettingsContent } from '../components/notifications/NotificationSettingsContent';

export const SettingsPage: React.FC = () => {
  const permissions = usePermissions();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'shifts' | 'interface' | 'notifications' | 'maintenance'>('shifts');
  const [selectedDealershipId, setSelectedDealershipId] = useState<number | undefined>(user?.dealership_id || undefined);
  const [showDetailedNotifications, setShowDetailedNotifications] = useState(false);

  // Initialize shift config with default values
  const [shiftConfig, setShiftConfig] = useState<ShiftConfig>({
    shift_1_start_time: '09:00',
    shift_1_end_time: '18:00',
    shift_2_start_time: '18:00',
    shift_2_end_time: '02:00',
    late_tolerance_minutes: 15,
    break_duration_minutes: 60,
    work_days: [1, 2, 3, 4, 5], // Monday-Friday
    timezone: 'Europe/Moscow',
  });

  // Initialize bot config with default values
  const [botConfig, setBotConfig] = useState<BotConfig>({
    notification_enabled: true,
    auto_close_shifts: false,
    shift_reminder_minutes: 15,
    maintenance_mode: false,
  });

  // Get shift configuration
  const { data: shiftConfigData, isLoading: shiftConfigLoading } = useShiftConfig(selectedDealershipId);

  // Get bot configuration
  const { data: botConfigData, isLoading: botConfigLoading } = useBotConfig(selectedDealershipId);

  // Get dealership settings for legacy compatibility
  const { data: config } = useDealershipSettings(selectedDealershipId || 0);

  useEffect(() => {
    if (shiftConfigData?.data) {
      setShiftConfig(prev => ({
        ...prev,
        ...shiftConfigData.data,
      }));
    }
  }, [shiftConfigData]);

  useEffect(() => {
    if (botConfigData?.data) {
      setBotConfig(prev => ({
        ...prev,
        ...botConfigData.data,
      }));
    }
  }, [botConfigData]);

  const updateShiftConfigMutation = useUpdateShiftConfig();
  const updateBotConfigMutation = useUpdateBotConfig();

  // Placeholder for future implementation of utility mutations
  // Placeholder for future implementation of utility mutations
  /*
  const clearTasksMutation = {
    mutate: () => showSuccessNotification('Функция очистки задач временно недоступна'),
    isPending: false,
  };
  */

  const testBotMutation = {
    mutate: () => showSuccessNotification('Проверка подключения к боту временно недоступна'),
    isPending: false,
  };

  const showSuccessNotification = (message: string = 'Настройки успешно сохранены') => {
    // В реальном приложении здесь будет красивое уведомление
    alert(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'shifts') {
      updateShiftConfigMutation.mutate({
        ...shiftConfig,
        dealership_id: selectedDealershipId,
      });
    } else if (activeTab === 'notifications' || activeTab === 'maintenance') {
      updateBotConfigMutation.mutate(botConfig);
    } else {
      showSuccessNotification('Настройки интерфейса сохранены');
    }
  };

  /*
  const handleClearOldTasks = () => {
    if (window.confirm('Вы уверены, что хотите очистить старые задачи? Это действие нельзя отменить.')) {
      clearTasksMutation.mutate();
    }
  };
  */

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

      {/* Dealership Selector */}
      {permissions.canManageDealershipSettings && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Настройки для дилерского центра:
          </label>
          <DealershipSelector
            value={selectedDealershipId}
            onChange={(value) => setSelectedDealershipId(value || undefined)}
            placeholder="Выберите дилерский центр"
            showAllOption={permissions.canManageGlobalSettings}
            allOptionLabel="Глобальные настройки"
          />
        </div>
      )}

      {shiftConfigLoading || botConfigLoading ? (
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
                  className={`${activeTab === tab.id
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">Настройки смен</h3>
                    </div>
                    {selectedDealershipId && (
                      <div className="flex items-center text-sm text-gray-500">
                        <InformationCircleIcon className="w-4 h-4 mr-1" />
                        {config?.inherited_fields && config.inherited_fields.length > 0 ? (
                          <span className="text-orange-600">Часть настроек унаследованы</span>
                        ) : (
                          <span className="text-green-600">Настройки ДЦ</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Первая смена</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Время начала
                          </label>
                          <input
                            type="time"
                            value={shiftConfig.shift_1_start_time || ''}
                            onChange={(e) =>
                              setShiftConfig({ ...shiftConfig, shift_1_start_time: e.target.value })
                            }
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Время окончания
                          </label>
                          <input
                            type="time"
                            value={shiftConfig.shift_1_end_time || ''}
                            onChange={(e) =>
                              setShiftConfig({ ...shiftConfig, shift_1_end_time: e.target.value })
                            }
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Вторая смена</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Время начала
                          </label>
                          <input
                            type="time"
                            value={shiftConfig.shift_2_start_time || ''}
                            onChange={(e) =>
                              setShiftConfig({ ...shiftConfig, shift_2_start_time: e.target.value })
                            }
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Время окончания
                          </label>
                          <input
                            type="time"
                            value={shiftConfig.shift_2_end_time || ''}
                            onChange={(e) =>
                              setShiftConfig({ ...shiftConfig, shift_2_end_time: e.target.value })
                            }
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Допустимое опоздание (минуты)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={shiftConfig.late_tolerance_minutes || 0}
                          onChange={(e) =>
                            setShiftConfig({
                              ...shiftConfig,
                              late_tolerance_minutes: parseInt(e.target.value) || 0,
                            })
                          }
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Количество минут, после которого фиксируется опоздание
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Длительность перерыва (минуты)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={shiftConfig.break_duration_minutes || 0}
                          onChange={(e) =>
                            setShiftConfig({
                              ...shiftConfig,
                              break_duration_minutes: parseInt(e.target.value) || 0,
                            })
                          }
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-3 py-3 border min-h-[44px]"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Стандартная длительность обеденного перерыва
                        </p>
                      </div>
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

                    {/* Auto archive is currently disabled/hidden as per request
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
                    */}
                  </div>
                </div>
              )}

              {/* Notifications Settings Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <BellIcon className="w-6 h-6 text-purple-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">Настройки уведомлений</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDetailedNotifications(!showDetailedNotifications)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {showDetailedNotifications ? (
                        <>
                          <ChevronUpIcon className="w-4 h-4 mr-2" />
                          Скрыть детальные настройки
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className="w-4 h-4 mr-2" />
                          Показать детальные настройки
                        </>
                      )}
                    </button>
                  </div>

                  {!showDetailedNotifications && (
                    <>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <div className="flex">
                          <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800 mb-1">Детальные настройки доступны</h4>
                            <p className="text-sm text-blue-700">
                              Для настройки времени уведомлений (например, за 49 минут до дедлайна), включения/отключения каналов, выбора получателей и времени отчётов нажмите <strong>Показать детальные настройки</strong>.
                            </p>
                          </div>
                        </div>
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
                    </>
                  )}

                  {showDetailedNotifications && (
                    <div className="border-t border-gray-200 pt-6">
                      <NotificationSettingsContent dealershipId={selectedDealershipId} />
                    </div>
                  )}
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
                    {/* Clear old tasks is currently disabled/hidden as per request
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
                    */}

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
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={updateShiftConfigMutation.isPending || updateBotConfigMutation.isPending}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {updateShiftConfigMutation.isPending || updateBotConfigMutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
                </button>
                {selectedDealershipId && config?.inherited_fields && config.inherited_fields.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      // Reset to global defaults
                      const resetConfig = {
                        ...shiftConfig,
                        shift_1_start_time: config.global_settings.shift_start_time || '09:00',
                        shift_1_end_time: config.global_settings.shift_end_time || '18:00',
                        late_tolerance_minutes: config.global_settings.late_tolerance_minutes || 15,
                      };
                      setShiftConfig(resetConfig);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Сбросить к глобальным
                  </button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {(updateShiftConfigMutation.isError || updateBotConfigMutation.isError) && (
              <div className="px-6 pb-4">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">
                      Ошибка сохранения настроек: {(updateShiftConfigMutation.error as any)?.response?.data?.message || (updateBotConfigMutation.error as any)?.response?.data?.message || 'Неизвестная ошибка'}
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
