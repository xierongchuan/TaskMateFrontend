import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

import type { Task } from '../types/task';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';

// Унифицированные компоненты
import {
  Button,
  Badge,
  Skeleton,
  ErrorState,
  EmptyState,
  PageContainer,
  Card,
  Section,
} from '../components/ui';
import { StatusBadge } from '../components/common';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDealership] = useState<number | undefined>(user?.dealership_id || undefined);

  // Modals state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', selectedDealership],
    queryFn: () => dashboardApi.getData(selectedDealership),
    refetchInterval: 15000,
  });

  const getShiftStatusBadge = (status: string, isLate: boolean) => {
    if (isLate) return <Badge variant="danger">На смене (Опоздание)</Badge>;
    if (status === 'open') return <Badge variant="success">На смене</Badge>;
    return <Badge variant="gray">Закрыта</Badge>;
  };

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton variant="text" width="25%" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton variant="card" count={8} />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState
          title="Ошибка загрузки данных"
          description="Не удалось загрузить данные панели управления"
          onRetry={() => refetch()}
        />
      </PageContainer>
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
      link: '/shifts?status=open'
    },
    {
      name: 'Просроченные задачи',
      value: dashboardData?.overdue_tasks || 0,
      icon: <XCircleIcon className="w-6 h-6" />,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      description: 'Требуют внимания',
      link: '/tasks?status=overdue'
    },
    {
      name: 'Выполнено сегодня',
      value: dashboardData?.completed_tasks || 0,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      description: 'Успешно завершено',
      link: '/tasks?status=completed&date_range=today'
    },
    {
      name: 'Генераторы',
      value: dashboardData?.total_generators || 0,
      icon: <ArrowPathIcon className="w-6 h-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      description: `Активных: ${dashboardData?.active_generators || 0}`,
      link: '/task-generators'
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Панель управления
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Добро пожаловать, {user?.full_name}! • Роль: <span className="font-medium">{user?.role}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Badge variant="success" className="animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live обновления
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {format(new Date(), 'HH:mm:ss', { locale: ru })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            hover
            className="cursor-pointer"
          >
            <div onClick={() => navigate(stat.link)} className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{stat.name}</p>
                  <p className={`text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 ${stat.textColor} dark:text-white`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 hidden sm:block">{stat.description}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-2 sm:p-3 text-white flex-shrink-0`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Tablo - Active Shifts */}
        <Section
          title="Live-табло: активные смены"
          icon={<UserIcon />}
          subtitle="Обновляется автоматически"
          className="xl:col-span-2"
        >
          {dashboardData?.active_shifts && dashboardData.active_shifts.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.active_shifts.map((shift: any) => (
                <div key={shift.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${shift.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{shift.user?.full_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Открыта: {format(new Date(shift.opened_at), 'HH:mm', { locale: ru })}
                        {shift.replacement && (
                          <span className="ml-2 text-orange-600 dark:text-orange-400 block sm:inline">
                            Заменяет: {shift.replacement.full_name}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    {shift.is_late && (
                      <Badge variant="danger" size="sm">
                        Опоздание {shift.late_minutes} мин
                      </Badge>
                    )}
                    {getShiftStatusBadge(shift.status, shift.is_late)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<UserIcon />}
              title="Нет активных смен"
            />
          )}
        </Section>

        {/* Quick Actions */}
        <Section title="Быстрые действия" icon={<ChartBarIcon />}>
          <div className="space-y-3">
            <Button
              variant="primary"
              icon={<CalendarIcon />}
              onClick={() => navigate('/tasks')}
              fullWidth
            >
              Создать задачу
            </Button>
            <Button
              variant="secondary"
              icon={<LinkIcon />}
              onClick={() => navigate('/links')}
              fullWidth
            >
              Добавить ссылку
            </Button>
            <Button
              variant="secondary"
              icon={<ChartBarIcon />}
              onClick={() => navigate('/reports')}
              fullWidth
            >
              Отчеты
            </Button>
          </div>
        </Section>
      </div>

      {/* Recent Tasks and Issues */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Recent Tasks */}
        <Section
          title="Задачи"
          icon={<CalendarIcon />}
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>
              Все задачи
            </Button>
          }
        >
          {dashboardData?.recent_tasks && dashboardData.recent_tasks.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recent_tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format(new Date(task.created_at), 'HH:mm', { locale: ru })}
                    </p>
                  </div>
                  <StatusBadge status={task.status} type="task" />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarIcon />}
              title="Нет недавних задач"
            />
          )}
        </Section>

        {/* Issues Alert */}
        <Section title="Требует внимания" icon={<ExclamationTriangleIcon />}>
          {((dashboardData?.overdue_tasks || 0) > 0 || (dashboardData?.late_shifts_today || 0) > 0) ? (
            <div className="space-y-3">
              {dashboardData?.overdue_tasks_list && dashboardData.overdue_tasks_list.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.overdue_tasks_list.map(task => (
                    <Card
                      key={task.id}
                      variant="danger"
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div onClick={() => handleOpenTask(task)} className="p-3">
                        <div className="flex items-start">
                          <XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-red-900 dark:text-red-200 text-sm">
                              {task.title}
                            </p>
                            <div className="flex items-center text-xs text-red-700 mt-1">
                              <span>Просрочено: {task.deadline ? format(new Date(task.deadline), 'PP p', { locale: ru }) : 'Без срока'}</span>
                              <span className="mx-1">•</span>
                              <span>{task.creator?.full_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                (dashboardData?.overdue_tasks || 0) > 0 && (
                  <Card variant="danger">
                    <div className="p-3 flex items-center">
                      <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
                      <div>
                        <p className="font-medium text-red-900 dark:text-red-200 text-sm">
                          {dashboardData?.overdue_tasks} просроченных задач
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300">
                          Требуют немедленного внимания
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              )}

              {(dashboardData?.late_shifts_today || 0) > 0 && (
                <Card variant="warning">
                  <div className="p-3 flex items-center">
                    <ClockIcon className="w-5 h-5 text-yellow-500 mr-2" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-200 text-sm">
                        {dashboardData?.late_shifts_today} опозданий сегодня
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Необходимо проконтролировать
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircleIcon className="w-12 h-12 mx-auto text-green-300 dark:text-green-700 mb-3" />
              <p>Все в порядке</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Нет проблем для внимания</p>
            </div>
          )}
        </Section>
      </div>

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={selectedTask}
        onEdit={() => {
          setIsDetailsOpen(false);
          setIsEditModalOpen(true);
        }}
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
      />
    </PageContainer>
  );
};
