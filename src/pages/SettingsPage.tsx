import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings';
import { usePermissions } from '../hooks/usePermissions';
import type { BotConfig } from '../types/setting';

export const SettingsPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();

  const [botConfig, setBotConfig] = useState<BotConfig>({
    shift_start_time: '',
    shift_end_time: '',
    late_tolerance_minutes: 0,
    rows_per_page: 10,
    auto_archive_days: 30,
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
      alert('Настройки успешно сохранены');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(botConfig);
  };

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
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Настройки системы</h1>
        <p className="mt-2 text-sm text-gray-700">
          Конфигурация системы и бота
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Настройки смен
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Время начала смены
                  </label>
                  <input
                    type="time"
                    value={botConfig.shift_start_time || ''}
                    onChange={(e) =>
                      setBotConfig({ ...botConfig, shift_start_time: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Время окончания смены
                  </label>
                  <input
                    type="time"
                    value={botConfig.shift_end_time || ''}
                    onChange={(e) =>
                      setBotConfig({ ...botConfig, shift_end_time: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Количество минут, после которого фиксируется опоздание
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Настройки интерфейса
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Количество записей в таблицах
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Автоматическая архивация задач после указанного количества дней
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>

          {updateMutation.isError && (
            <div className="px-4 pb-4">
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Ошибка сохранения настроек: {(updateMutation.error as any)?.response?.data?.message || 'Неизвестная ошибка'}
                </p>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
