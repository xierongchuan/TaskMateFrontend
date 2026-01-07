import React, { useState, useEffect } from 'react';
import { useShiftConfig, useBotConfig, useUpdateShiftConfig, useUpdateBotConfig, useDealershipSettings } from '../hooks/useSettings';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../hooks/useAuth';
import { DealershipSelector } from '../components/common/DealershipSelector';
import type { BotConfig, ShiftConfig } from '../types/setting';
// Icons
import {
  CogIcon,
  ClockIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  WrenchIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { NotificationSettingsContent } from '../components/notifications/NotificationSettingsContent';

export const SettingsPage: React.FC = () => {
  const permissions = usePermissions();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'interface' | 'tasks' | 'shifts' | 'notifications' | 'maintenance'>('general');
  const [selectedDealershipId, setSelectedDealershipId] = useState<number | undefined>(user?.dealership_id || undefined);
  const [showDetailedNotifications, setShowDetailedNotifications] = useState(false);

  // Initialize shift config with default values
  const [shiftConfig, setShiftConfig] = useState<ShiftConfig>({
    shift_1_start_time: '09:00',
    shift_1_end_time: '18:00',
    shift_2_start_time: '18:00',
    shift_2_end_time: '02:00',
    late_tolerance_minutes: 15,
    work_days: [1, 2, 3, 4, 5],
    timezone: 'Europe/Moscow',
  });

  // Initialize bot config with default values
  const [botConfig, setBotConfig] = useState<BotConfig>({
    notification_enabled: true,
    auto_close_shifts: false,
    shift_reminder_minutes: 15,
    maintenance_mode: false,
    rows_per_page: 15,
    auto_archive_day_of_week: 0
  });

  // Data fetching
  const { data: shiftConfigData, isLoading: shiftConfigLoading } = useShiftConfig(selectedDealershipId);
  const { data: botConfigData, isLoading: botConfigLoading } = useBotConfig(selectedDealershipId);
  const { data: config } = useDealershipSettings(selectedDealershipId || 0);

  // Effects to filter data
  useEffect(() => {
    if (shiftConfigData?.data) {
      setShiftConfig(prev => ({ ...prev, ...shiftConfigData.data }));
    }
  }, [shiftConfigData]);

  useEffect(() => {
    if (botConfigData?.data) {
      setBotConfig(prev => ({ ...prev, ...botConfigData.data }));
    }
  }, [botConfigData]);

  // Mutations
  const updateShiftConfigMutation = useUpdateShiftConfig();
  const updateBotConfigMutation = useUpdateBotConfig();
  const testBotMutation = {
    mutate: () => alert('Проверка подключения...'), // Placeholder
    isPending: false,
  };

  const showSuccessNotification = (message: string) => {
    // Ideally use a toast library
    alert(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'shifts') {
      updateShiftConfigMutation.mutate({
        ...shiftConfig,
        dealership_id: selectedDealershipId,
      }, {
        onSuccess: () => showSuccessNotification('Настройки смен сохранены'),
        onError: () => alert('Ошибка сохранения настроек смен'),
      });
    } else {
      // For General, Interface, Tasks, Notifications, Maintenance - use BotConfig
      updateBotConfigMutation.mutate({
        ...botConfig, // Send full config update for simplicity in this refactor
        dealership_id: selectedDealershipId,
      }, {
        onSuccess: () => showSuccessNotification('Настройки сохранены'),
        onError: () => alert('Ошибка сохранения настроек'),
      });
    }
  };

  const handleTestBot = () => {
    testBotMutation.mutate();
  };

  // Tabs definition
  const tabs = [
    { id: 'general', name: 'Общие', icon: CogIcon },
    { id: 'interface', name: 'Интерфейс', icon: ComputerDesktopIcon },
    { id: 'tasks', name: 'Задачи', icon: ClipboardDocumentListIcon },
    { id: 'shifts', name: 'Смены', icon: ClockIcon },
    { id: 'notifications', name: 'Уведомления', icon: BellIcon },
    { id: 'maintenance', name: 'Обслуживание', icon: WrenchIcon },
  ];

  if (!permissions.canManageSettings) {
    return (
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-yellow-800">Доступ запрещен</h3>
          <p className="text-yellow-600 mt-1">У вас нет прав для просмотра этого раздела.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Настройки</h1>
          <p className="mt-2 text-gray-500">Управление параметрами системы, интерфейса и автоматизации</p>
        </div>

        {/* Dealership Selector as a prominent action if allowed */}
        {permissions.canManageDealershipSettings && (
          <div className="w-full md:w-72 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <DealershipSelector
              value={selectedDealershipId}
              onChange={(value) => setSelectedDealershipId(value || undefined)}
              placeholder="Глобальные настройки"
              showAllOption={permissions.canManageGlobalSettings}
              allOptionLabel="Глобальные настройки"
              className="w-full border-0 focus:ring-0 text-sm"
            />
          </div>
        )}
      </div>

      {shiftConfigLoading || botConfigLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-100 rounded w-1/4"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">

          {/* Sidebar Navigation (Desktop) */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 p-6 md:p-8 overflow-y-auto">

                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Общие настройки</h2>
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Язык системы</label>
                          <select disabled className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed">
                            <option>Русский (Default)</option>
                          </select>
                          <p className="mt-1 text-xs text-gray-500">Смена языка пока недоступна в этой версии.</p>
                        </div>

                        {permissions.canManageDealershipSettings && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Текущая конфигурация</label>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${selectedDealershipId ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                              <span className="text-sm text-gray-700">
                                {selectedDealershipId
                                  ? 'Настройки конкретного дилерского центра'
                                  : 'Глобальные настройки системы'
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERFACE TAB */}
                {activeTab === 'interface' && (
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Интерфейс и Отображение</h2>

                      <div className="space-y-6">
                        {/* Theme (Placeholder) */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-start">
                            <SwatchIcon className="w-6 h-6 text-purple-500 mr-4 mt-1" />
                            <div>
                              <label className="block text-base font-medium text-gray-900 mb-1">Тема оформления</label>
                              <p className="text-sm text-gray-500 mb-4">Выберите цветовую схему приложения</p>

                              <div className="grid grid-cols-3 gap-3">
                                <div className="border-2 border-blue-500 rounded-lg p-2 bg-gray-50 cursor-pointer">
                                  <div className="h-4 bg-white border border-gray-200 rounded mb-2"></div>
                                  <div className="text-xs font-medium text-center text-blue-700">Светлая</div>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-900 opacity-50 cursor-not-allowed">
                                  <div className="h-4 bg-gray-800 border border-gray-700 rounded mb-2"></div>
                                  <div className="text-xs font-medium text-center text-gray-400">Темная</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-start">
                            <ClipboardDocumentListIcon className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                            <div className="flex-1">
                              <label className="block text-base font-medium text-gray-900 mb-1">Пагинация (Строк на странице)</label>
                              <p className="text-sm text-gray-500 mb-4">
                                Количество элементов, отображаемых в таблицах задач, сотрудников и смен.
                                <br /><span className="text-xs text-blue-600 bg-blue-50 px-1 rounded">Глобальная настройка</span>
                              </p>

                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min="5"
                                  max="100"
                                  step="5"
                                  value={botConfig.rows_per_page || 15}
                                  onChange={(e) => setBotConfig({ ...botConfig, rows_per_page: parseInt(e.target.value) })}
                                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="w-16 h-10 flex items-center justify-center border border-gray-300 rounded-lg font-mono font-bold text-gray-700 bg-gray-50">
                                  {botConfig.rows_per_page || 15}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TASKS TAB */}
                {activeTab === 'tasks' && (
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Настройки Задач</h2>

                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-start mb-6">
                          <ArrowPathIcon className="w-6 h-6 text-green-500 mr-4 mt-1" />
                          <div className="flex-1">
                            <label className="block text-base font-medium text-gray-900 mb-1">Автоматическая архивация</label>
                            <p className="text-sm text-gray-500 mb-4">
                              Выполненные задачи будут автоматически переноситься в архив в выбранный день недели.
                            </p>

                            <select
                              value={botConfig.auto_archive_day_of_week || 0}
                              onChange={(e) => setBotConfig({
                                ...botConfig,
                                auto_archive_day_of_week: parseInt(e.target.value) || 0
                              })}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                            >
                              <option value="0">Отключено (Вручную)</option>
                              <option value="1">Каждый Понедельник</option>
                              <option value="2">Каждый Вторник</option>
                              <option value="3">Каждую Среду</option>
                              <option value="4">Каждый Четверг</option>
                              <option value="5">Каждую Пятницу</option>
                              <option value="6">Каждую Субботу</option>
                              <option value="7">Каждое Воскресенье</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex gap-3">
                          <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <p className="text-sm text-blue-700">
                            Архивированные задачи пропадают из активного списка, но доступны через фильтр "Архив". Это помогает держать список задач чистым.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SHIFTS TAB */}
                {activeTab === 'shifts' && (
                  <div className="space-y-8 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">График и Смены</h2>
                      {/* Config inheritance indicator */}
                      {selectedDealershipId && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config?.inherited_fields && config.inherited_fields.length > 0
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {config?.inherited_fields && config.inherited_fields.length > 0
                            ? 'Смешанные настройки'
                            : 'Настройки дилера'
                          }
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shift 1 */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">1</span>
                          Первая смена
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Начало</label>
                            <input type="time" value={shiftConfig.shift_1_start_time || ''} onChange={(e) => setShiftConfig({ ...shiftConfig, shift_1_start_time: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Конец</label>
                            <input type="time" value={shiftConfig.shift_1_end_time || ''} onChange={(e) => setShiftConfig({ ...shiftConfig, shift_1_end_time: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>

                      {/* Shift 2 */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs mr-2">2</span>
                          Вторая смена
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Начало</label>
                            <input type="time" value={shiftConfig.shift_2_start_time || ''} onChange={(e) => setShiftConfig({ ...shiftConfig, shift_2_start_time: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Конец</label>
                            <input type="time" value={shiftConfig.shift_2_end_time || ''} onChange={(e) => setShiftConfig({ ...shiftConfig, shift_2_end_time: e.target.value })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tolerance */}
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-900 mb-2">Допустимое опоздание</label>
                        <div className="flex items-center gap-3">
                          <input type="number" min="0" value={shiftConfig.late_tolerance_minutes || 0} onChange={(e) => setShiftConfig({ ...shiftConfig, late_tolerance_minutes: parseInt(e.target.value) || 0 })} className="block w-24 rounded-lg border-gray-300" />
                          <span className="text-gray-500 text-sm">минут</span>
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Сотрудники могут опоздать на это время без штрафа</p>
                      </div>


                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Центр уведомлений</h2>
                      <button
                        type="button"
                        onClick={() => setShowDetailedNotifications(!showDetailedNotifications)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {showDetailedNotifications ? 'Скрыть детали' : 'Расширенные настройки'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { key: 'task_overdue', label: 'Просроченные задачи', desc: 'Задачи, срок которых истек' },
                        { key: 'shift_late', label: 'Опоздания', desc: 'Сотрудник не открыл смену вовремя' },
                        { key: 'task_completed', label: 'Завершение задач', desc: 'Сотрудник выполнил задачу' },
                        { key: 'system_errors', label: 'Системные ошибки', desc: 'Сбои в работе оборудования или API' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors shadow-sm">
                          <div>
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-sm text-gray-500">{item.desc}</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={((botConfig as any).notification_types?.[item.key]) || false}
                            onChange={(e) => setBotConfig({
                              ...botConfig,
                              notification_types: {
                                ...(botConfig as any).notification_types,
                                [item.key]: e.target.checked
                              }
                            })}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </label>
                      ))}
                    </div>

                    {showDetailedNotifications && (
                      <div className="pt-6 border-t border-gray-200">
                        <NotificationSettingsContent dealershipId={selectedDealershipId} />
                      </div>
                    )}
                  </div>
                )}

                {/* MAINTENANCE TAB */}
                {activeTab === 'maintenance' && (
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-semibold text-red-700">Опасная зона</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          Глобально
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Проверка бота</h4>
                            <p className="text-sm text-gray-500">Отправить тестовое сообщение для проверки связи</p>
                          </div>
                          <button onClick={handleTestBot} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                            Проверить
                          </button>
                        </div>

                        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-red-900">Режим обслуживания</h4>
                            <p className="text-sm text-red-700 mb-2">Временно заблокировать доступ для всех пользователей кроме администраторов.</p>
                            <label className="flex items-center mt-2">
                              <input
                                type="checkbox"
                                checked={(botConfig as any).maintenance_mode || false}
                                onChange={(e) => setBotConfig({ ...botConfig, maintenance_mode: e.target.checked })}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300 rounded"
                              />
                              <span className="ml-2 text-sm font-medium text-red-800">Активировать режим</span>
                            </label>
                          </div>
                          <WrenchIcon className="w-8 h-8 text-red-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 md:px-8 flex items-center justify-between z-10">
                <div className="text-xs text-gray-400 hidden sm:block">
                  Изменения вступают в силу немедленно после сохранения
                </div>
                <button
                  type="submit"
                  disabled={updateShiftConfigMutation.isPending || updateBotConfigMutation.isPending}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-200"
                >
                  {updateShiftConfigMutation.isPending || updateBotConfigMutation.isPending ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                  )}
                  {updateShiftConfigMutation.isPending || updateBotConfigMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
