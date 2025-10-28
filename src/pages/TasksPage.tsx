import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { usePermissions } from '../hooks/usePermissions';
import { TaskModal } from '../components/tasks/TaskModal';
import type { Task } from '../types/task';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const TasksPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    recurrence: '',
    task_type: '',
  });

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.getTasks(filters),
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
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

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      acknowledged: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      postponed: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      pending: 'Ожидает',
      acknowledged: 'Принято',
      completed: 'Выполнено',
      overdue: 'Просрочено',
      postponed: 'Отложено',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
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
    if (recurrence === 'none') return null;
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
        {labels[recurrence as keyof typeof labels] || recurrence}
      </span>
    );
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Задачи</h1>
          <p className="mt-2 text-sm text-gray-700">
            Управление задачами системы
          </p>
        </div>
        {permissions.canManageTasks && (
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Создать задачу
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
            <input
              type="text"
              placeholder="Название задачи..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Все</option>
              <option value="pending">Ожидает</option>
              <option value="acknowledged">Принято</option>
              <option value="completed">Выполнено</option>
              <option value="overdue">Просрочено</option>
              <option value="postponed">Отложено</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Повторяемость</label>
            <select
              value={filters.recurrence}
              onChange={(e) => setFilters({ ...filters, recurrence: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Все</option>
              <option value="none">Не повторяется</option>
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
              <option value="monthly">Ежемесячно</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
            <select
              value={filters.task_type}
              onChange={(e) => setFilters({ ...filters, task_type: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Все</option>
              <option value="individual">Индивидуальная</option>
              <option value="group">Групповая</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Ошибка загрузки задач</p>
        </div>
      ) : tasksData?.data.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Задачи не найдены</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {tasksData?.data.map((task) => (
              <li key={task.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {task.title}
                        </h3>
                        {getStatusBadge(task.status)}
                        {getRecurrenceBadge(task.recurrence)}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>Тип: {task.task_type === 'individual' ? 'Индивидуальная' : 'Групповая'}</span>
                        <span>Ответ: {task.response_type === 'acknowledge' ? 'Уведомление' : 'Выполнение'}</span>
                        {task.deadline && (
                          <span>Дедлайн: {format(new Date(task.deadline), 'PPp', { locale: ru })}</span>
                        )}
                        {task.creator && <span>Создал: {task.creator.full_name}</span>}
                      </div>
                      {task.tags && task.tags.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {task.tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {permissions.canManageTasks && (
                      <div className="ml-4 flex-shrink-0 flex gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Изменить
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};
