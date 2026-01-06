import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { usePermissions } from '../hooks/usePermissions';
import { TaskModal } from '../components/tasks/TaskModal';
import { DealershipSelector } from '../components/common/DealershipSelector';
import type { Task } from '../types/task';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export const TasksPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    recurrence: '',
    task_type: '',
    response_type: '',
    date_range: 'all',
    dealership_id: null as number | null,
    tags: [] as string[],
    priority: '',
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['tasks', filters, page],
    queryFn: () => {
      // Clean filters: remove empty strings, null values, and empty arrays
      const cleanedFilters: {
        search?: string;
        status?: string;
        recurrence?: string;
        task_type?: string;
        response_type?: string;
        date_range?: string;
        dealership_id?: number;
        tags?: string[];
        priority?: string;
        page?: number;
      } = { page };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              cleanedFilters[key as keyof typeof cleanedFilters] = value as never;
            }
          } else {
            cleanedFilters[key as keyof typeof cleanedFilters] = value as never;
          }
        }
      });

      return tasksApi.getTasks(cleanedFilters);
    },
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: number) => tasksApi.duplicateTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    if (window.confirm(`Вы уверены, что хотите удалить задачу "${task.title}"?`)) {
      deleteMutation.mutate(task.id);
    }
  };

  const handleDuplicate = (task: Task) => {
    if (window.confirm(`Создать копию задачи "${task.title}"?`)) {
      duplicateMutation.mutate(task.id);
    }
  };

  const handleStatusChange = (task: Task, newStatus: string) => {
    tasksApi.updateTaskStatus(task.id, newStatus).then(() => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      recurrence: '',
      task_type: '',
      response_type: '',
      date_range: 'all',
      dealership_id: null,
      tags: [],
      priority: '',
    });
  };

  const getDeadlineStatus = (task: Task) => {
    if (!task.deadline) return 'normal';

    const now = new Date();
    const deadline = new Date(task.deadline);
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeadline < 0) return 'overdue';
    if (hoursUntilDeadline < 2) return 'urgent';
    if (hoursUntilDeadline < 24) return 'soon';
    return 'normal';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      acknowledged: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
    };

    const icons = {
      pending: <ClockIcon className="w-3 h-3" />,
      acknowledged: <CheckCircleIcon className="w-3 h-3" />,
      completed: <CheckCircleIcon className="w-3 h-3" />,
      overdue: <XCircleIcon className="w-3 h-3" />,
    };

    const labels = {
      pending: 'Ожидает',
      acknowledged: 'Принято',
      completed: 'Выполнено',
      overdue: 'Просрочено',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status as keyof typeof icons]}
        <span className="ml-1">{labels[status as keyof typeof labels] || status}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority?: string) => {
    const badges = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
    };

    const labels = {
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий',
    };

    const p = (priority || 'medium') as keyof typeof badges;

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badges[p]}`}>
        <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
        {labels[p]}
      </span>
    );
  };

  const getDeadlineBadge = (status: string) => {
    if (status === 'normal') return null;

    const badges = {
      overdue: 'bg-red-100 text-red-800 border-red-200',
      urgent: 'bg-orange-100 text-orange-800 border-orange-200',
      soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    const labels = {
      overdue: 'Просрочено',
      urgent: 'Срочно',
      soon: 'Скоро',
    };

    const s = status as keyof typeof badges;

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badges[s]}`}>
        <ClockIcon className="w-3 h-3 mr-1" />
        {labels[s]}
      </span>
    );
  };

  const getRecurrenceBadge = (recurrence: string) => {
    const labels = {
      none: 'Не повторяется',
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
    };
    if (!recurrence || recurrence === 'none') return null;
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
        <ArrowPathIcon className="w-3 h-3 mr-1" />
        {labels[recurrence as keyof typeof labels] || recurrence}
      </span>
    );
  };

  const getTaskCardClass = (task: Task) => {
    const deadlineStatus = getDeadlineStatus(task);
    const baseClasses = 'bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200';

    switch (deadlineStatus) {
      case 'overdue': return `${baseClasses} border-red-200 bg-red-50`;
      case 'urgent': return `${baseClasses} border-orange-200 bg-orange-50`;
      case 'soon': return `${baseClasses} border-yellow-200 bg-yellow-50`;
      default: return `${baseClasses} border-gray-200`;
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Задачи</h1>
            <p className="mt-2 text-sm text-gray-600">
              Управление задачами и отслеживание выполнения
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Список
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Карточки
              </button>
            </div>
            {permissions.canManageTasks && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Создать задачу
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Фильтры {showFilters ? 'Скрыть' : 'Показать'}
          </button>
        </div>

        {showFilters && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" />
                  Поиск
                </label>
                <input
                  type="text"
                  placeholder="Название или описание..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Все статусы</option>
                  <option value="pending">Ожидает</option>
                  <option value="acknowledged">Принято</option>
                  <option value="completed">Выполнено</option>
                  <option value="overdue">Просрочено</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Все приоритеты</option>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип задачи</label>
                <select
                  value={filters.task_type}
                  onChange={(e) => setFilters({ ...filters, task_type: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Все типы</option>
                  <option value="individual">Индивидуальная</option>
                  <option value="group">Групповая</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Тип ответа</label>
                <select
                  value={filters.response_type}
                  onChange={(e) => setFilters({ ...filters, response_type: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Все</option>
                  <option value="acknowledge">Уведомление</option>
                  <option value="complete">Выполнение</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Период</label>
                <select
                  value={filters.date_range}
                  onChange={(e) => setFilters({ ...filters, date_range: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="all">Все время</option>
                  <option value="today">Сегодня</option>
                  <option value="week">Эта неделя</option>
                  <option value="month">Этот месяц</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.recurrence === 'recurring'}
                    onChange={(e) => setFilters({ ...filters, recurrence: e.target.checked ? 'recurring' : '' })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    <ArrowPathIcon className="w-4 h-4 inline mr-1" />
                    Только повторяемые
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Задачи с расписанием (ежедневные, еженедельные, ежемесячные)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Автосалон</label>
                <DealershipSelector
                  value={filters.dealership_id}
                  onChange={(dealershipId) => setFilters({ ...filters, dealership_id: dealershipId })}
                  showAllOption={true}
                  allOptionLabel="Все автосалоны"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800">Ошибка загрузки задач</p>
          </div>
        </div>
      ) : tasksData?.data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Задачи не найдены</h3>
          <p className="text-gray-500">
            {filters.search || filters.status || filters.task_type ?
              'Попробуйте изменить фильтры для поиска задач' :
              'Создайте первую задачу для начала работы'}
          </p>
        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                {tasksData?.data.map((task) => (
                  <div key={task.id} className={`p-5 rounded-lg border hover:shadow-sm transition-all ${getTaskCardClass(task)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {task.title}
                          </h3>
                          {getPriorityBadge(task.priority)}
                          {getDeadlineBadge(getDeadlineStatus(task))}
                          {getStatusBadge(task.status)}
                          {getRecurrenceBadge(task.recurrence)}
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {task.task_type === 'individual' ? 'Индивидуальная' : 'Групповая'}
                          </span>
                          <span className="flex items-center">
                            {task.response_type === 'acknowledge' ?
                              <CheckCircleIcon className="w-4 h-4 mr-1" /> :
                              <CalendarIcon className="w-4 h-4 mr-1" />
                            }
                            {task.response_type === 'acknowledge' ? 'Уведомление' : 'Выполнение'}
                          </span>
                          {task.deadline && (
                            <span className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {format(new Date(task.deadline), 'PPp', { locale: ru })}
                            </span>
                          )}
                          {task.creator && (
                            <span className="flex items-center">
                              <UserIcon className="w-4 h-4 mr-1" />
                              {task.creator.full_name}
                            </span>
                          )}
                          <span className="flex items-center">
                            <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                            {task.dealership?.name || 'Все салоны'}
                          </span>
                        </div>

                        {task.tags && task.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {task.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <TagIcon className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {permissions.canManageTasks && (
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                              <PencilIcon className="w-4 h-4 mr-1" />
                              Изменить
                            </button>
                            <button
                              onClick={() => handleDuplicate(task)}
                              disabled={duplicateMutation.isPending}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                              <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                            </button>
                            <button
                              onClick={() => handleDelete(task)}
                              disabled={deleteMutation.isPending}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <TrashIcon className="w-4 h-4 mr-1" />
                            </button>
                          </div>

                          {/* Quick Status Change */}
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="pending">Ожидает</option>
                            <option value="acknowledged">Принято</option>
                            <option value="completed">Выполнено</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasksData?.data.map((task) => (
                <div key={task.id} className={`p-6 ${getTaskCardClass(task)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                      {task.title}
                    </h3>
                    <div className="flex gap-1">
                      {getPriorityBadge(task.priority)}
                      {getDeadlineBadge(getDeadlineStatus(task))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {getStatusBadge(task.status)}
                    {getRecurrenceBadge(task.recurrence)}
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    {task.deadline && (
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {format(new Date(task.deadline), 'dd MMM HH:mm', { locale: ru })}
                      </div>
                    )}
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2" />
                      {task.task_type === 'individual' ? 'Индивидуальная' : 'Групповая'}
                    </div>
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      {task.dealership?.name || 'Все салоны'}
                    </div>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {task.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {permissions.canManageTasks && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {tasksData && tasksData.last_page > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Назад
                </button>
                <button
                  onClick={() => setPage(Math.min(tasksData.last_page, page + 1))}
                  disabled={page === tasksData.last_page}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Вперед
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Показано с <span className="font-medium">{(page - 1) * tasksData.per_page + 1}</span> по <span className="font-medium">{Math.min(page * tasksData.per_page, tasksData.total)}</span> из <span className="font-medium">{tasksData.total}</span> результатов
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Назад</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {/* Page Numbers */}
                    {[...Array(tasksData.last_page)].map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show first, last, current, and surrounding pages
                      if (
                        pageNum === 1 ||
                        pageNum === tasksData.last_page ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pageNum
                              ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === page - 2 ||
                        pageNum === page + 2
                      ) {
                        return (
                          <span key={pageNum} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => setPage(Math.min(tasksData.last_page, page + 1))}
                      disabled={page === tasksData.last_page}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Вперед</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};
