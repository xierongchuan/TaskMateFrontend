import React, { useState } from 'react';
import { useShifts, useCurrentShifts } from '../hooks/useShifts';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { ShiftsFilters } from '../types/shift';
import {
  BriefcaseIcon,
  ClockIcon,
  SunIcon,
  StarIcon
} from '@heroicons/react/24/outline';


export const ShiftsPage: React.FC = () => {
  const [filters, setFilters] = useState<ShiftsFilters>({
    status: '',
    is_late: undefined,
  });

  const { data: shiftsData, isLoading, error } = useShifts(filters);
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Открыта
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Открыта (Опоздание)
          </span>
        );
      case 'replaced':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Заменена
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Закрыта
          </span>
        );
    }
  };

  const getShiftTypeBadge = (type: string) => {
    switch (type) {
      case 'regular':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <BriefcaseIcon className="w-3 h-3 mr-1" />
            Обычная
          </span>
        );
      case 'overtime':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Сверхурочная
          </span>
        );
      case 'weekend':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <SunIcon className="w-3 h-3 mr-1" />
            Выходная
          </span>
        );
      case 'holiday':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <StarIcon className="w-3 h-3 mr-1" />
            Праздничная
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Смены</h1>
        <p className="mt-2 text-sm text-gray-700">
          Отслеживание смен сотрудников в реальном времени
        </p>
      </div>

      {/* Shift Control Component */}
      {/* Active Dealerships Plaques */}
      {activeShiftDealerships.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {activeShiftDealerships.map((dealership) => (
            <div
              key={dealership.id}
              className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
            >
              <div className="p-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{dealership.name}</h3>
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
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Текущие смены ({currentShifts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentShifts.map((shift) => (
              <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {shift.user?.full_name}
                  </h3>
                  {getStatusBadge(shift.status)}
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Начало: {format(new Date(shift.shift_start), 'PPp', { locale: ru })}</div>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">Тип:</span>
                    {getShiftTypeBadge(shift.shift_type)}
                  </div>
                  {shift.break_duration && (
                    <div>Перерыв: {shift.break_duration} мин</div>
                  )}
                  {shift.is_late && (
                    <div className="text-red-600 font-medium">
                      Опоздание: {shift.late_minutes} мин
                    </div>
                  )}
                  {shift.dealership && (
                    <div className="text-gray-600">
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
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Все</option>
              <option value="open">Открыта</option>
              <option value="closed">Закрыта</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип смены</label>
            <select
              value={filters.shift_type || ''}
              onChange={(e) => setFilters({ ...filters, shift_type: e.target.value || undefined })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Все</option>
              <option value="regular">Обычная</option>
              <option value="overtime">Сверхурочная</option>
              <option value="weekend">Выходная</option>
              <option value="holiday">Праздничная</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опоздания</label>
            <select
              value={filters.is_late === undefined ? '' : filters.is_late ? 'true' : 'false'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  is_late: e.target.value === '' ? undefined : e.target.value === 'true',
                })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
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
        <div className="bg-white shadow rounded-lg p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ошибка загрузки смен</p>
        </div>
      ) : shiftsData?.data.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Смены не найдены</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">История смен</h2>
            <ul className="divide-y divide-gray-200">
              {shiftsData?.data.map((shift) => (
                <li key={shift.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-medium text-gray-900">
                          {shift.user?.full_name}
                        </h3>
                        {getStatusBadge(shift.status)}
                        {shift.is_late && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Опоздание {shift.late_minutes} мин
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex flex-wrap gap-x-4">
                          <span>Начало: {format(new Date(shift.shift_start), 'PPp', { locale: ru })}</span>
                          {shift.shift_end && (
                            <span>Конец: {format(new Date(shift.shift_end), 'PPp', { locale: ru })}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 items-center">
                          <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">Тип:</span>
                            {getShiftTypeBadge(shift.shift_type)}
                          </div>
                          {shift.break_duration && (
                            <span>Перерыв: {shift.break_duration} мин</span>
                          )}
                        </div>
                        {shift.dealership && (
                          <div className="text-gray-600">
                            Автосалон: {shift.dealership.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
