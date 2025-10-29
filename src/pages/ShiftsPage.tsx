import React, { useState } from 'react';
import { useShifts, useCurrentShifts } from '../hooks/useShifts';
import { ShiftControl } from '../components/shifts/ShiftControl';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { ShiftsFilters } from '../types/shift';

export const ShiftsPage: React.FC = () => {
  const [filters, setFilters] = useState<ShiftsFilters>({
    status: '',
    is_late: undefined,
  });

  const { data: shiftsData, isLoading, error } = useShifts(filters);
  const { data: currentShiftsData } = useCurrentShifts();
  const currentShifts = currentShiftsData?.data || [];

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {status === 'open' ? 'Открыта' : 'Закрыта'}
      </span>
    );
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'regular':
        return 'Обычная';
      case 'overtime':
        return 'Сверхурочная';
      case 'weekend':
        return 'Выходная';
      case 'holiday':
        return 'Праздничная';
      default:
        return type;
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
      <ShiftControl />

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
                  <div>Тип смены: {getShiftTypeLabel(shift.shift_type)}</div>
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
                        <div className="flex flex-wrap gap-x-4">
                          <span>Тип смены: {getShiftTypeLabel(shift.shift_type)}</span>
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
