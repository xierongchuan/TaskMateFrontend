import React, { useState, useMemo } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useHolidays, useBulkCalendarUpdate, useUpdateCalendarDay, useClearCalendarYear } from '../../hooks/useCalendar';
import { Button, ConfirmDialog } from '../ui';
import { useToast } from '../ui/Toast';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';

interface YearCalendarProps {
  year?: number;
  dealershipId?: number;
  onYearChange?: (year: number) => void;
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface MonthCalendarProps {
  year: number;
  month: number; // 1-12
  holidays: Set<string>;
  onDayClick: (date: string) => void;
  isLoading: boolean;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  month,
  holidays,
  onDayClick,
  isLoading,
}) => {
  // Get first day of month and days in month
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Get day of week for first day (0 = Sunday, so convert to Monday-based)
  let startDayOfWeek = firstDay.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Convert to Mon=0

  // Create calendar grid
  const days: (number | null)[] = [];

  // Empty cells before first day
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 text-center">
        {MONTHS[month - 1]}
      </h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAY_LABELS.map((day, i) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-1 ${i >= 5 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="w-6 h-6" />;
          }

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isHoliday = holidays.has(dateStr);
          const dayOfWeek = new Date(year, month - 1, day).getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onDayClick(dateStr)}
              disabled={isLoading}
              className={`
                w-6 h-6 rounded text-xs font-medium transition-all flex items-center justify-center
                ${isHoliday
                  ? 'bg-red-500 text-white'
                  : isWeekend
                    ? 'bg-gray-100 dark:bg-gray-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              `}
              title={isHoliday ? 'Выходной (кликните для отмены)' : 'Кликните чтобы отметить как выходной'}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const YearCalendar: React.FC<YearCalendarProps> = ({
  year: initialYear,
  dealershipId,
  onYearChange,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(initialYear || currentYear);
  const { showToast } = useToast();
  const { showConfirm, confirmState, handleConfirm, handleCancel } = useConfirmDialog();

  const { data: holidaysData, isLoading, refetch } = useHolidays(year, dealershipId);

  const bulkUpdateMutation = useBulkCalendarUpdate();
  const updateDayMutation = useUpdateCalendarDay();
  const clearYearMutation = useClearCalendarYear();

  // Convert holidays array to Set for fast lookup
  const holidaysSet = useMemo(() => {
    if (!holidaysData?.data?.dates) return new Set<string>();
    return new Set(holidaysData.data.dates);
  }, [holidaysData]);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    onYearChange?.(newYear);
  };

  const handleDayClick = async (dateStr: string) => {
    const isCurrentlyHoliday = holidaysSet.has(dateStr);

    try {
      await updateDayMutation.mutateAsync({
        date: dateStr,
        data: {
          type: isCurrentlyHoliday ? 'workday' : 'holiday',
          dealership_id: dealershipId,
        },
      });
    } catch {
      showToast({ type: 'error', message: 'Ошибка обновления календаря' });
    }
  };

  const handleSetAllSaturdays = async () => {
    try {
      const result = await bulkUpdateMutation.mutateAsync({
        operation: 'set_weekdays',
        year,
        dealership_id: dealershipId,
        weekdays: [6],
        type: 'holiday',
      });
      showToast({ type: 'success', message: `Отмечено ${result.data.affected_count} суббот как выходные` });
    } catch {
      showToast({ type: 'error', message: 'Ошибка установки суббот' });
    }
  };

  const handleSetAllSundays = async () => {
    try {
      const result = await bulkUpdateMutation.mutateAsync({
        operation: 'set_weekdays',
        year,
        dealership_id: dealershipId,
        weekdays: [7],
        type: 'holiday',
      });
      showToast({ type: 'success', message: `Отмечено ${result.data.affected_count} воскресений как выходные` });
    } catch {
      showToast({ type: 'error', message: 'Ошибка установки воскресений' });
    }
  };

  const handleSetAllWeekends = async () => {
    try {
      const result = await bulkUpdateMutation.mutateAsync({
        operation: 'set_weekdays',
        year,
        dealership_id: dealershipId,
        weekdays: [6, 7],
        type: 'holiday',
      });
      showToast({ type: 'success', message: `Отмечено ${result.data.affected_count} выходных дней` });
    } catch {
      showToast({ type: 'error', message: 'Ошибка установки выходных' });
    }
  };

  const handleClearYear = async () => {
    const confirmed = await showConfirm({
      title: 'Очистить календарь',
      message: `Вы уверены, что хотите очистить все выходные за ${year} год?`,
      confirmText: 'Очистить',
      cancelText: 'Отмена',
      variant: 'danger',
    });

    if (!confirmed) {
      return;
    }

    try {
      const result = await clearYearMutation.mutateAsync({ year, dealershipId });
      showToast({ type: 'success', message: `Удалено ${result.data.affected_count} записей` });
    } catch {
      showToast({ type: 'error', message: 'Ошибка очистки календаря' });
    }
  };

  const isMutating = bulkUpdateMutation.isPending || updateDayMutation.isPending || clearYearMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header with year navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleYearChange(year - 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[80px] text-center">
              {year}
            </span>
            <button
              type="button"
              onClick={() => handleYearChange(year + 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            icon={<ArrowPathIcon className={isLoading ? 'animate-spin' : ''} />}
          >
            Обновить
          </Button>
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSetAllSaturdays}
          disabled={isMutating}
        >
          Все субботы — выходные
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSetAllSundays}
          disabled={isMutating}
        >
          Все воскресенья — выходные
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSetAllWeekends}
          disabled={isMutating}
        >
          Все выходные (Сб+Вс)
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearYear}
          disabled={isMutating}
          icon={<TrashIcon />}
          className="text-red-600 hover:text-red-700 dark:text-red-400"
        >
          Очистить год
        </Button>
      </div>

      {/* Statistics */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">
            Выходные: <strong className="text-gray-900 dark:text-white">{holidaysData?.data?.count || 0}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600" />
          <span className="text-gray-600 dark:text-gray-400">Рабочие дни</span>
        </div>
      </div>

      {/* Calendar grid - 4 columns x 3 rows = 12 months */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <MonthCalendar
            key={month}
            year={year}
            month={month}
            holidays={holidaysSet}
            onDayClick={handleDayClick}
            isLoading={isLoading || isMutating}
          />
        ))}
      </div>

      {/* Help text */}
      <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">💡 Подсказка</p>
        <p>
          Кликните на любой день, чтобы переключить его между рабочим и выходным.
          В выходные дни задачи генераторов создаваться не будут.
        </p>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};
