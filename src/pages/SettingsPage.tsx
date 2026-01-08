import React, { useState, useEffect } from 'react';
import { useShiftConfig, useBotConfig, useUpdateShiftConfig, useUpdateBotConfig, useDealershipSettings } from '../hooks/useSettings';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../hooks/useAuth';
import { DealershipSelector } from '../components/common/DealershipSelector';
import type { BotConfig, ShiftConfig } from '../types/setting';

// UI Components
import {
  PageContainer,
  Card,
  Button,
  Select,
  Checkbox,
  Input,
  Skeleton,
  ErrorState,
} from '../components/ui';
import { useToast } from '../components/ui/Toast';

// Icons
import {
  CogIcon,
  ClockIcon,
  BellIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  WrenchIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  SwatchIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { NotificationSettingsContent } from '../components/notifications/NotificationSettingsContent';

export const SettingsPage: React.FC = () => {
  const permissions = usePermissions();
  const { pendingTheme, setTheme, applyTheme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'shifts') {
      updateShiftConfigMutation.mutate({
        ...shiftConfig,
        dealership_id: selectedDealershipId,
      }, {
        onSuccess: () => showToast({ type: 'success', message: 'Настройки смен сохранены' }),
        onError: () => showToast({ type: 'error', message: 'Ошибка сохранения настроек смен' }),
      });
    } else if (activeTab === 'interface') {
      applyTheme();
      updateBotConfigMutation.mutate({
        ...botConfig,
        dealership_id: selectedDealershipId,
      }, {
        onSuccess: () => showToast({ type: 'success', message: 'Настройки сохранены' }),
        onError: () => showToast({ type: 'error', message: 'Ошибка сохранения настроек' }),
      });
    } else {
      updateBotConfigMutation.mutate({
        ...botConfig,
        dealership_id: selectedDealershipId,
      }, {
        onSuccess: () => showToast({ type: 'success', message: 'Настройки сохранены' }),
        onError: () => showToast({ type: 'error', message: 'Ошибка сохранения настроек' }),
      });
    }
  };

  const handleTestBot = () => {
    showToast({ type: 'info', message: 'Проверка подключения... (Заглушка)' });
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

  // Archive day options
  const archiveDayOptions = [
    { value: '0', label: 'Отключено (Вручную)' },
    { value: '1', label: 'Каждый Понедельник' },
    { value: '2', label: 'Каждый Вторник' },
    { value: '3', label: 'Каждую Среду' },
    { value: '4', label: 'Каждый Четверг' },
    { value: '5', label: 'Каждую Пятницу' },
    { value: '6', label: 'Каждую Субботу' },
    { value: '7', label: 'Каждое Воскресенье' },
  ];

  if (!permissions.canManageSettings) {
    return (
      <PageContainer>
        <ErrorState
          title="Доступ запрещен"
          description="У вас нет прав для просмотра этого раздела."
        />
      </PageContainer>
    );
  }

  const isLoading = shiftConfigLoading || botConfigLoading;
  const isSaving = updateShiftConfigMutation.isPending || updateBotConfigMutation.isPending;

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Настройки</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Управление параметрами системы, интерфейса и автоматизации</p>
        </div>

        {/* Dealership Selector */}
        {permissions.canManageDealershipSettings && (
          <div className="w-full md:w-72 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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

      {isLoading ? (
        <Card>
          <Card.Body>
            <Skeleton variant="list" count={5} />
          </Card.Body>
        </Card>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden min-h-[600px] flex flex-col md:flex-row">

          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
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
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Общие настройки</h2>
                      <Card>
                        <Card.Body className="space-y-6">
                          <div>
                            <Select
                              label="Язык системы"
                              disabled
                              options={[{ value: 'ru', label: 'Русский (Default)' }]}
                              value="ru"
                              onChange={() => { }}
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Смена языка пока недоступна в этой версии.</p>
                          </div>

                          {permissions.canManageDealershipSettings && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Текущая конфигурация</label>
                              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${selectedDealershipId ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {selectedDealershipId
                                    ? 'Настройки конкретного дилерского центра'
                                    : 'Глобальные настройки системы'
                                  }
                                </span>
                              </div>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                )}

                {/* INTERFACE TAB */}
                {activeTab === 'interface' && (
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Интерфейс и Отображение</h2>

                      <div className="space-y-6">
                        {/* Theme */}
                        <Card>
                          <Card.Body>
                            <div className="flex items-start">
                              <SwatchIcon className="w-6 h-6 text-purple-500 mr-4 mt-1" />
                              <div className="w-full">
                                <label className="block text-base font-medium text-gray-900 dark:text-white mb-1">Тема оформления</label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Выберите цветовую схему приложения</p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {[
                                    { value: 'light', label: 'Светлая', icon: SunIcon },
                                    { value: 'dark', label: 'Темная', icon: MoonIcon },
                                    { value: 'system', label: 'Системная', icon: ComputerDesktopIcon },
                                  ].map((theme) => (
                                    <button
                                      key={theme.value}
                                      type="button"
                                      onClick={() => setTheme(theme.value as 'light' | 'dark' | 'system')}
                                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border font-medium transition-all ${pendingTheme === theme.value
                                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750'
                                        }`}
                                    >
                                      <theme.icon className="w-5 h-5" />
                                      <span>{theme.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>

                        {/* Pagination */}
                        <Card>
                          <Card.Body>
                            <div className="flex items-start">
                              <ClipboardDocumentListIcon className="w-6 h-6 text-blue-500 mr-4 mt-1" />
                              <div className="flex-1">
                                <label className="block text-base font-medium text-gray-900 dark:text-white mb-1">Пагинация (Строк на странице)</label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  Количество элементов, отображаемых в таблицах.
                                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">Глобальная настройка</span>
                                </p>

                                <div className="flex items-center gap-4">
                                  <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    step="5"
                                    value={botConfig.rows_per_page || 15}
                                    onChange={(e) => setBotConfig({ ...botConfig, rows_per_page: parseInt(e.target.value) })}
                                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="w-16 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg font-mono font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700">
                                    {botConfig.rows_per_page || 15}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* TASKS TAB */}
                {activeTab === 'tasks' && (
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Настройки Задач</h2>

                      <Card>
                        <Card.Body>
                          <div className="flex items-start mb-6">
                            <ArrowPathIcon className="w-6 h-6 text-green-500 mr-4 mt-1" />
                            <div className="flex-1">
                              <label className="block text-base font-medium text-gray-900 dark:text-white mb-1">Автоматическая архивация</label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Выполненные задачи будут автоматически переноситься в архив в выбранный день недели.
                              </p>

                              <Select
                                value={String(botConfig.auto_archive_day_of_week || 0)}
                                onChange={(e) => setBotConfig({
                                  ...botConfig,
                                  auto_archive_day_of_week: parseInt(e.target.value) || 0
                                })}
                                options={archiveDayOptions}
                              />
                            </div>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30 flex gap-3">
                            <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Архивированные задачи пропадают из активного списка, но доступны через фильтр "Архив".
                            </p>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                )}

                {/* SHIFTS TAB */}
                {activeTab === 'shifts' && (
                  <div className="space-y-8 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">График и Смены</h2>
                      {selectedDealershipId && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config?.inherited_fields && config.inherited_fields.length > 0
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
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
                      <Card>
                        <Card.Body>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs mr-2">1</span>
                            Первая смена
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              type="time"
                              label="Начало"
                              value={shiftConfig.shift_1_start_time || ''}
                              onChange={(e) => setShiftConfig({ ...shiftConfig, shift_1_start_time: e.target.value })}
                            />
                            <Input
                              type="time"
                              label="Конец"
                              value={shiftConfig.shift_1_end_time || ''}
                              onChange={(e) => setShiftConfig({ ...shiftConfig, shift_1_end_time: e.target.value })}
                            />
                          </div>
                        </Card.Body>
                      </Card>

                      {/* Shift 2 */}
                      <Card>
                        <Card.Body>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
                            <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs mr-2">2</span>
                            Вторая смена
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              type="time"
                              label="Начало"
                              value={shiftConfig.shift_2_start_time || ''}
                              onChange={(e) => setShiftConfig({ ...shiftConfig, shift_2_start_time: e.target.value })}
                            />
                            <Input
                              type="time"
                              label="Конец"
                              value={shiftConfig.shift_2_end_time || ''}
                              onChange={(e) => setShiftConfig({ ...shiftConfig, shift_2_end_time: e.target.value })}
                            />
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tolerance */}
                      <Card>
                        <Card.Body>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Допустимое опоздание</label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              min={0}
                              value={shiftConfig.late_tolerance_minutes || 0}
                              onChange={(e) => setShiftConfig({ ...shiftConfig, late_tolerance_minutes: parseInt(e.target.value) || 0 })}
                              className="w-24"
                            />
                            <span className="text-gray-500 dark:text-gray-400 text-sm">минут</span>
                          </div>
                          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Сотрудники могут опоздать на это время без штрафа</p>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Центр уведомлений</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetailedNotifications(!showDetailedNotifications)}
                      >
                        {showDetailedNotifications ? 'Скрыть детали' : 'Расширенные настройки'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { key: 'task_overdue', label: 'Просроченные задачи', desc: 'Задачи, срок которых истек' },
                        { key: 'shift_late', label: 'Опоздания', desc: 'Сотрудник не открыл смену вовремя' },
                        { key: 'task_completed', label: 'Завершение задач', desc: 'Сотрудник выполнил задачу' },
                        { key: 'system_errors', label: 'Системные ошибки', desc: 'Сбои в работе оборудования или API' },
                      ].map((item) => (
                        <Card key={item.key} className="hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer">
                          <Card.Body>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                              </div>
                              <Checkbox
                                checked={((botConfig as any).notification_types?.[item.key]) || false}
                                onChange={(e) => setBotConfig({
                                  ...botConfig,
                                  notification_types: {
                                    ...(botConfig as any).notification_types,
                                    [item.key]: e.target.checked
                                  }
                                })}
                              />
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>

                    {showDetailedNotifications && (
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
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
                        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Опасная зона</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          Глобально
                        </span>
                      </div>

                      <div className="space-y-4">
                        <Card>
                          <Card.Body>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Проверка бота</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Отправить тестовое сообщение для проверки связи</p>
                              </div>
                              <Button variant="secondary" onClick={handleTestBot}>
                                Проверить
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>

                        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30 flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-red-900 dark:text-red-300">Режим обслуживания</h4>
                            <p className="text-sm text-red-700 dark:text-red-400 mb-2">Временно заблокировать доступ для всех пользователей кроме администраторов.</p>
                            <Checkbox
                              checked={(botConfig as any).maintenance_mode || false}
                              onChange={(e) => setBotConfig({ ...botConfig, maintenance_mode: e.target.checked })}
                              label="Активировать режим"
                              className="mt-2"
                            />
                          </div>
                          <WrenchIcon className="w-8 h-8 text-red-200 dark:text-red-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 md:px-8 flex items-center justify-between z-10 transition-colors duration-200">
                <div className="text-xs text-gray-400 hidden sm:block">
                  Изменения вступают в силу немедленно после сохранения
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                  icon={isSaving ? <ArrowPathIcon className="animate-spin" /> : <CheckCircleIcon />}
                  className="w-full sm:w-auto shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                >
                  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
