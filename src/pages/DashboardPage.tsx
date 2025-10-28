import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { dashboardApi } from '../api/dashboard';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard', user?.dealership_id],
    queryFn: () => dashboardApi.getData(user?.dealership_id || undefined),
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });

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
      name: 'Всего задач',
      value: dashboardData?.total_tasks || 0,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      name: 'Активных задач',
      value: dashboardData?.active_tasks || 0,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      name: 'Выполнено задач',
      value: dashboardData?.completed_tasks || 0,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      name: 'Просрочено',
      value: dashboardData?.overdue_tasks || 0,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
    {
      name: 'Всего пользователей',
      value: dashboardData?.total_users || 0,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
    {
      name: 'Активных пользователей',
      value: dashboardData?.active_users || 0,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
    },
    {
      name: 'Открытых смен',
      value: dashboardData?.open_shifts || 0,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
    },
    {
      name: 'Опозданий сегодня',
      value: dashboardData?.late_shifts_today || 0,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Добро пожаловать, {user?.full_name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Роль: <span className="font-medium">{user?.role}</span>
          {user?.dealership_id && (
            <> • Автосалон ID: <span className="font-medium">{user.dealership_id}</span></>
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <div className="h-6 w-6 text-white flex items-center justify-center font-bold">
                    {stat.value}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className={`text-2xl font-semibold ${stat.textColor}`}>
                    {stat.value}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      {dashboardData?.recent_tasks && dashboardData.recent_tasks.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Недавние задачи
            </h2>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {dashboardData.recent_tasks.map((task) => (
                  <li key={task.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(task.created_at), 'PPp', { locale: ru })}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : task.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {task.status === 'completed' && 'Выполнено'}
                          {task.status === 'overdue' && 'Просрочено'}
                          {task.status === 'pending' && 'Ожидает'}
                          {task.status === 'acknowledged' && 'Принято'}
                          {task.status === 'postponed' && 'Отложено'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
