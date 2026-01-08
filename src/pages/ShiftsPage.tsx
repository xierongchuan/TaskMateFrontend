import React, { useState } from 'react';
import { useShifts, useCurrentShifts } from '../hooks/useShifts';
import { useResponsiveViewMode } from '../hooks/useResponsiveViewMode';
import { usePagination } from '../hooks/usePagination';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { ShiftsFilters } from '../types/shift';
import {
  BriefcaseIcon,
  ClockIcon,
  SunIcon,
  StarIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

import { useSearchParams } from 'react-router-dom';

export const ShiftsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { viewMode, setViewMode, isMobile } = useResponsiveViewMode('list', 'cards');
  const { limit } = usePagination();
  const [filters, setFilters] = useState<ShiftsFilters>({
    status: searchParams.get('status') || '',
    is_late: searchParams.get('is_late') === 'true' ? true : searchParams.get('is_late') === 'false' ? false : undefined,
  });

  const { data: shiftsData, isLoading, error } = useShifts({ ...filters, per_page: limit });
  const { data: currentShiftsData } = useCurrentShifts();
  const currentShifts = currentShiftsData?.data || [];

  // Extract unique dealerships with active shifts
  const activeShiftDealerships = React.useMemo(() => {
    const unique = new Map();
    currentShifts.forEach(shift => {
      if (shift.dealership && !unique.has(shift.dealership.id)) {
        unique.set(shift.dealership.id, shift.dealership);
      }
    });
    return Array.from(unique.values());
  }, [currentShifts]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Открыта
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Открыта (Опоздание)
          </span>
        );
      case 'replaced':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Заменена
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Закрыта
          </span>
        );
    }
  };

  const getShiftTypeBadge = (type: string) => {
    switch (type) {
      case 'regular':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <BriefcaseIcon className="w-3 h-3 mr-1" />
            Обычная
          </span>
        );
      case 'overtime':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            <ClockIcon className="w-3 h-3 mr-1" />
            Сверхурочная
          </span>
        );
      case 'weekend':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <SunIcon className="w-3 h-3 mr-1" />
            Выходная
          </span>
        );
      case 'holiday':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <StarIcon className="w-3 h-3 mr-1" />
            Праздничная
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Смены</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">Отслеживание смен сотрудников в реальном времени</p>
        </div>
        {!isMobile && (
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 ${viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Shift Control Component */}
      {/* Active Dealerships Plaques */}
      {activeShiftDealerships.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {activeShiftDealerships.map((dealership) => (
            <div
              key={dealership.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="p-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{dealership.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <p className="text-xs text-green-600 font-medium">Смена открыта</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Shifts Live Board */}
      {currentShifts && currentShifts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Текущие смены ({currentShifts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentShifts.map((shift) => (
              <div key={shift.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {shift.user?.full_name}
                  </h3>
                  {getStatusBadge(shift.status)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <div>Начало: {format(new Date(shift.shift_start), 'PPp', { locale: ru })}</div>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">Тип:</span>
                    {getShiftTypeBadge(shift.shift_type)}
                  </div>
                  {shift.break_duration && (
                    <div>Перерыв: {shift.break_duration} мин</div>
                  )}
                  {shift.is_late && (
                    <div className="text-red-600 dark:text-red-400 font-medium">
                      Опоздание: {shift.late_minutes} мин
                    </div>
                  )}
                  {shift.dealership && (
                    <div className="text-gray-600 dark:text-gray-400">
                      Автосалон: {shift.dealership.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Статус</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Все</option>
              <option value="open">Открыта</option>
              <option value="closed">Закрыта</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тип смены</label>
            <select
              value={filters.shift_type || ''}
              onChange={(e) => setFilters({ ...filters, shift_type: e.target.value || undefined })}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Все</option>
              <option value="regular">Обычная</option>
              <option value="overtime">Сверхурочная</option>
              <option value="weekend">Выходная</option>
              <option value="holiday">Праздничная</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Опоздания</label>
            <select
              value={filters.is_late === undefined ? '' : filters.is_late ? 'true' : 'false'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  is_late: e.target.value === '' ? undefined : e.target.value === 'true',
                })
              }
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Все</option>
              <option value="true">Только опоздания</option>
              <option value="false">Без опозданий</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shifts History */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Ошибка загрузки смен</p>
        </div>
      ) : shiftsData?.data.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Смены не найдены</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">История смен</h2>

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {shiftsData?.data.map((shift) => (
                  <div key={shift.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm dark:hover:bg-gray-700/50 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">{shift.user?.full_name}</h3>
                          {getStatusBadge(shift.status)}
                          {shift.is_late && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">Опоздание {shift.late_minutes} мин</span>}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                          <div className="flex flex-wrap gap-x-4">
                            <span>Начало: {format(new Date(shift.shift_start), 'PPp', { locale: ru })}</span>
                            {shift.shift_end && <span>Конец: {format(new Date(shift.shift_end), 'PPp', { locale: ru })}</span>}
                          </div>
                          <div className="flex flex-wrap gap-x-4 items-center">
                            <div className="flex items-center"><span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Тип:</span>{getShiftTypeBadge(shift.shift_type)}</div>
                            {shift.break_duration && <span>Перерыв: {shift.break_duration} мин</span>}
                          </div>
                          {shift.dealership && <div className="text-gray-600 dark:text-gray-400">Автосалон: {shift.dealership.name}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shiftsData?.data.map((shift) => (
                  <div key={shift.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:bg-gray-700/50 transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{shift.user?.full_name}</h3>
                      {getStatusBadge(shift.status)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                      <div>Начало: {format(new Date(shift.shift_start), 'PPp', { locale: ru })}</div>
                      {shift.shift_end && <div>Конец: {format(new Date(shift.shift_end), 'PPp', { locale: ru })}</div>}
                      <div className="flex items-center mt-2"><span className="mr-1">Тип:</span>{getShiftTypeBadge(shift.shift_type)}</div>
                      {shift.is_late && <div className="text-red-600 dark:text-red-400 font-medium">Опоздание: {shift.late_minutes} мин</div>}
                      {shift.dealership && <div>Автосалон: {shift.dealership.name}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
