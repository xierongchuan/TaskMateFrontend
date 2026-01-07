import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { archivedTasksApi } from '../api/archivedTasks';
import { usePermissions } from '../hooks/usePermissions';
import { useResponsiveViewMode } from '../hooks/useResponsiveViewMode';
import { DealershipSelector } from '../components/common/DealershipSelector';
import type { ArchivedTask, ArchivedTaskFilters } from '../types/archivedTask';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUturnLeftIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

export const ArchivedTasksPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const { viewMode, setViewMode, isMobile } = useResponsiveViewMode('list', 'cards');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ArchivedTaskFilters>({
    search: '',
    archive_reason: undefined,
    dealership_id: undefined,
    date_from: '',
    date_to: '',
  });

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['archived-tasks', filters, page],
    queryFn: () => {
      const cleanedFilters: ArchivedTaskFilters = { page, per_page: 20 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          (cleanedFilters as Record<string, unknown>)[key] = value;
        }
      });
      return archivedTasksApi.getArchivedTasks(cleanedFilters);
    },
    refetchInterval: 60000,
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => archivedTasksApi.restoreTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archived-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleRestore = (task: ArchivedTask) => {
    if (window.confirm(`Восстановить задачу "${task.title}" из архива?`)) {
      restoreMutation.mutate(task.id);
    }
  };

  const handleExport = async () => {
    try {
      await archivedTasksApi.downloadCsv(filters);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Ошибка экспорта');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      archive_reason: undefined,
      dealership_id: undefined,
      date_from: '',
      date_to: '',
    });
  };

  const getReasonBadge = (reason: string) => {
    const config = {
      completed: { label: 'Выполнено', icon: CheckCircleIcon, color: 'bg-green-100 text-green-800 border-green-200' },
      expired: { label: 'Просрочено', icon: XCircleIcon, color: 'bg-red-100 text-red-800 border-red-200' },
    };
    const cfg = config[reason as keyof typeof config] || { label: reason, icon: ArchiveBoxIcon, color: 'bg-gray-100 text-gray-800' };
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {cfg.label}
      </span>
    );
  };

  const tasks = tasksData?.data || [];

  return (
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Архив задач</h1>
            <p className="mt-2 text-sm text-gray-600">
              История выполненных и просроченных задач
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            {!isMobile && (
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm font-medium ${viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Экспорт CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" />
                  Поиск
                </label>
                <input
                  type="text"
                  placeholder="Название..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Причина архивации</label>
                <select
                  value={filters.archive_reason || ''}
                  onChange={(e) => setFilters({ ...filters, archive_reason: e.target.value as ArchivedTaskFilters['archive_reason'] || undefined })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Все</option>
                  <option value="completed">Выполнено</option>
                  <option value="expired">Просрочено</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">С даты</label>
                <input
                  type="date"
                  value={filters.date_from || ''}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">По дату</label>
                <input
                  type="date"
                  value={filters.date_to || ''}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Автосалон</label>
                <DealershipSelector
                  value={filters.dealership_id || null}
                  onChange={(dealershipId) => setFilters({ ...filters, dealership_id: dealershipId || undefined })}
                  showAllOption={true}
                  allOptionLabel="Все"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800">Ошибка загрузки архива</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ArchiveBoxIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Архив пуст</h3>
          <p className="text-gray-500">
            {filters.search || filters.archive_reason
              ? 'Попробуйте изменить фильтры'
              : 'Архивированные задачи появятся здесь'}
          </p>
        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Задача</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата архивации</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автосалон</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{task.title}</span>
                          {task.description && <span className="text-sm text-gray-500 truncate max-w-xs">{task.description}</span>}
                          {task.tags && task.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {task.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                  <TagIcon className="w-2.5 h-2.5 mr-0.5" />{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getReasonBadge(task.archive_reason)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1" />{format(new Date(task.archived_at), 'dd.MM.yyyy HH:mm', { locale: ru })}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center"><BuildingOfficeIcon className="w-4 h-4 mr-1" />{task.dealership?.name || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {permissions.canManageTasks && (
                          <button onClick={() => handleRestore(task)} disabled={restoreMutation.isPending} className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-sm font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 transition-colors disabled:opacity-50">
                            <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />Восстановить
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h3>
                    {getReasonBadge(task.archive_reason)}
                  </div>
                  {task.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                          <TagIcon className="w-2.5 h-2.5 mr-0.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <div className="flex items-center"><CalendarIcon className="w-3.5 h-3.5 mr-1" />{format(new Date(task.archived_at), 'dd.MM.yyyy HH:mm', { locale: ru })}</div>
                    <div className="flex items-center"><BuildingOfficeIcon className="w-3.5 h-3.5 mr-1" />{task.dealership?.name || '—'}</div>
                  </div>
                  {permissions.canManageTasks && (
                    <button onClick={() => handleRestore(task)} disabled={restoreMutation.isPending} className="w-full inline-flex items-center justify-center px-3 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 transition-colors disabled:opacity-50">
                      <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />Восстановить
                    </button>
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
                <p className="text-sm text-gray-700">
                  Страница <span className="font-medium">{page}</span> из <span className="font-medium">{tasksData.last_page}</span> ({tasksData.total} записей)
                </p>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(tasksData.last_page, page + 1))}
                    disabled={page === tasksData.last_page}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
