import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { dashboardApi } from '../api/dashboard';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  LinkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDealership] = useState<number | undefined>(user?.dealership_id || undefined);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', selectedDealership],
    queryFn: () => dashboardApi.getData(selectedDealership),
    refetchInterval: 15000, // Refetch every 15 seconds for real-time updates
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'postponed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'overdue': return <XCircleIcon className="w-4 h-4" />;
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'acknowledged': return <CheckCircleIcon className="w-4 h-4" />;
      case 'postponed': return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getShiftStatusColor = (status: string, isLate: boolean) => {
    if (isLate) return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'open') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ошибка загрузки данных dashboard</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Активные смены',
      value: dashboardData?.open_shifts || 0,
      icon: <UserIcon className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      description: 'Сейчас на смене',
    },
    {
      name: 'Просроченные задачи',
      value: dashboardData?.overdue_tasks || 0,
      icon: <XCircleIcon className="w-6 h-6" />,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      description: 'Требуют внимания',
    },
    {
      name: 'Выполнено сегодня',
      value: dashboardData?.completed_tasks || 0,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      description: 'Успешно завершено',
    },
    {
      name: 'Опоздания',
      value: dashboardData?.late_shifts_today || 0,
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      description: 'За сегодня',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Панель управления
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Добро пожаловать, {user?.full_name}! • Роль: <span className="font-medium">{user?.role}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-800 whitespace-nowrap">Live обновления</span>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {format(new Date(), 'HH:mm:ss', { locale: ru })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                  <p className={`text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stat.description}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-2 sm:p-3 text-white flex-shrink-0`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Tablo - Active Shifts */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Live-табло: активные смены
              </h2>
              <span className="text-xs text-gray-500">
                Обновляется автоматически
              </span>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {dashboardData?.active_shifts && dashboardData.active_shifts.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {dashboardData.active_shifts.map((shift: any) => (
                  <div key={shift.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        shift.status === 'open' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{shift.user?.full_name}</p>
                        <p className="text-sm text-gray-500">
                          Открыта: {format(new Date(shift.opened_at), 'HH:mm', { locale: ru })}
                          {shift.replacement && (
                            <span className="ml-2 text-orange-600 block sm:inline">
                              Заменяет: {shift.replacement.full_name}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {shift.is_late && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200 text-center sm:text-left">
                          Опоздание {shift.late_minutes} мин
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border text-center sm:text-left ${getShiftStatusColor(shift.status, shift.is_late)}`}>
                        {shift.status === 'open' ? 'На смене' : 'Закрыта'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Нет активных смен</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Быстрые действия
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-3">
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-h-[44px]">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Создать задачу
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center min-h-[44px]">
              <LinkIcon className="w-4 h-4 mr-2" />
              Добавить ссылку
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center min-h-[44px]">
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Отчеты
            </button>
          </div>
        </div>
      </div>

      {/* Recent Tasks and Issues */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Последние задачи
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {dashboardData?.recent_tasks && dashboardData.recent_tasks.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent_tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(task.created_at), 'HH:mm', { locale: ru })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">
                        {task.status === 'completed' && 'Выполнено'}
                        {task.status === 'overdue' && 'Просрочено'}
                        {task.status === 'pending' && 'Ожидает'}
                        {task.status === 'acknowledged' && 'Принято'}
                        {task.status === 'postponed' && 'Отложено'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Нет недавних задач</p>
              </div>
            )}
          </div>
        </div>

        {/* Issues Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-orange-500" />
              Требует внимания
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {((dashboardData?.overdue_tasks || 0) > 0 || (dashboardData?.late_shifts_today || 0) > 0) ? (
              <div className="space-y-3">
                {dashboardData?.overdue_tasks && dashboardData.overdue_tasks > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                      <div>
                        <p className="font-medium text-red-900 text-sm">
                          {dashboardData.overdue_tasks} просроченных задач
                        </p>
                        <p className="text-xs text-red-700">
                          Требуют немедленного внимания
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {dashboardData?.late_shifts_today && dashboardData.late_shifts_today > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 text-orange-500 mr-2" />
                      <div>
                        <p className="font-medium text-orange-900 text-sm">
                          {dashboardData.late_shifts_today} опозданий сегодня
                        </p>
                        <p className="text-xs text-orange-700">
                          Необходимо проконтролировать
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircleIcon className="w-12 h-12 mx-auto text-green-300 mb-3" />
                <p>Все в порядке</p>
                <p className="text-xs text-gray-400">Нет проблем для внимания</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
