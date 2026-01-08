import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskGeneratorsApi } from '../api/taskGenerators';
import { usePermissions } from '../hooks/usePermissions';
import { usePagination } from '../hooks/usePagination';
import { TaskGeneratorModal } from '../components/generators/TaskGeneratorModal';
import { DealershipSelector } from '../components/common/DealershipSelector';
import type { TaskGenerator, TaskGeneratorFilters } from '../types/taskGenerator';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListBulletIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import { useResponsiveViewMode } from '../hooks/useResponsiveViewMode';

export const TaskGeneratorsPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const { limit } = usePagination();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<TaskGenerator | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { viewMode, setViewMode, isMobile } = useResponsiveViewMode('list', 'cards');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TaskGeneratorFilters>({
    search: '',
    is_active: undefined,
    recurrence: undefined,
    dealership_id: undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data: generatorsData, isLoading, error } = useQuery({
    queryKey: ['task-generators', filters, page, limit],
    queryFn: () => {
      const cleanedFilters: TaskGeneratorFilters = { page, per_page: limit };
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          (cleanedFilters as Record<string, unknown>)[key] = value;
        }
      });
      return taskGeneratorsApi.getGenerators(cleanedFilters);
    },
    refetchInterval: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskGeneratorsApi.deleteGenerator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => taskGeneratorsApi.pauseGenerator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (id: number) => taskGeneratorsApi.resumeGenerator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
    },
  });

  const handleCreate = () => {
    setSelectedGenerator(null);
    setIsModalOpen(true);
  };

  const handleEdit = (generator: TaskGenerator) => {
    setSelectedGenerator(generator);
    setIsModalOpen(true);
  };

  const handleDelete = (generator: TaskGenerator) => {
    if (window.confirm(`Удалить генератор "${generator.title}"? Это не удалит созданные задачи.`)) {
      deleteMutation.mutate(generator.id);
    }
  };

  const handlePauseResume = (generator: TaskGenerator) => {
    if (generator.is_active) {
      pauseMutation.mutate(generator.id);
    } else {
      resumeMutation.mutate(generator.id);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      is_active: undefined,
      recurrence: undefined,
      dealership_id: undefined,
    });
  };

  const getRecurrenceLabel = (recurrence: string) => {
    const labels: Record<string, string> = {
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
    };
    return labels[recurrence] || recurrence;
  };

  const getRecurrenceBadge = (recurrence: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      weekly: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      monthly: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[recurrence] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'}`}>
        <ArrowPathIcon className="w-3 h-3 mr-1" />
        {getRecurrenceLabel(recurrence)}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Активен
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
        <PauseIcon className="w-3 h-3 mr-1" />
        Приостановлен
      </span>
    );
  };

  const generators = generatorsData?.data || [];

  return (
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Генераторы задач</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Автоматическое создание периодических задач
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {!isMobile && (
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                    }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                    }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
              </div>
            )}

            {permissions.canManageTasks && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Создать генератор
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 font-sans">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск генераторов..."
              value={filters.search || ''} // Ensure controlled component
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center text-sm font-medium transition-colors ${showFilters
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Фильтры
          </button>
        </div>

        {showFilters && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Статус</label>
                <select
                  value={filters.is_active === undefined ? '' : String(filters.is_active)}
                  onChange={(e) => setFilters(prev => ({ ...prev, is_active: e.target.value === '' ? undefined : e.target.value === 'true' }))}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Все</option>
                  <option value="true">Активные</option>
                  <option value="false">Приостановленные</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Повторяемость</label>
                <select
                  value={filters.recurrence || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, recurrence: e.target.value as TaskGeneratorFilters['recurrence'] || undefined }))}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Все</option>
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                  <option value="monthly">Ежемесячно</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Автосалон</label>
                <DealershipSelector
                  value={filters.dealership_id || null} // Ensure value is null for no selection
                  onChange={(id) => setFilters(prev => ({ ...prev, dealership_id: id || undefined }))}
                  showAllOption
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  allOptionLabel="Все автосалоны"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 text-center border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">Ошибка загрузки данных</p>
        </div>
      ) : generators.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <ArrowPathIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Нет генераторов</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filters.search || filters.is_active !== undefined || filters.recurrence || filters.dealership_id
              ? 'Попробуйте изменить параметры поиска'
              : 'Начните с создания нового генератора задач'
            }
          </p>

        </div>
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-4">
                {generators.map((generator) => (
                  <div
                    key={generator.id}
                    className={`p-5 rounded-lg border hover:shadow-sm transition-all ${generator.is_active
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 opacity-75'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {generator.title}
                          </h3>
                          {getStatusBadge(generator.is_active)}
                          {getRecurrenceBadge(generator.recurrence)}
                        </div>

                        {generator.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {generator.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {generator.recurrence_time?.slice(0, 5)} → {generator.deadline_time?.slice(0, 5)}
                          </span>
                          <span className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {generator.task_type === 'individual' ? 'Индивидуальная' : 'Групповая'}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            С {format(new Date(generator.start_date), 'dd.MM.yyyy', { locale: ru })}
                            {generator.end_date && ` по ${format(new Date(generator.end_date), 'dd.MM.yyyy', { locale: ru })}`}
                          </span>
                          <span className="flex items-center">
                            <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                            {generator.dealership?.name || 'Все салоны'}
                          </span>
                          {generator.total_generated !== undefined && (
                            <span className="flex items-center">
                              <ChartBarIcon className="w-4 h-4 mr-1" />
                              Создано: {generator.total_generated}
                            </span>
                          )}
                        </div>

                        {generator.assignments && generator.assignments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {generator.assignments.slice(0, 5).map((assignment) => (
                              <span
                                key={assignment.id}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                <UserIcon className="w-3 h-3 mr-1" />
                                {assignment.user?.full_name}
                              </span>
                            ))}
                            {generator.assignments.length > 5 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{generator.assignments.length - 5} ещё
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {permissions.canManageTasks && (
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePauseResume(generator)}
                              disabled={pauseMutation.isPending || resumeMutation.isPending}
                              className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-lg transition-colors ${generator.is_active
                                ? 'border-yellow-300 text-yellow-700 bg-white hover:bg-yellow-50 dark:bg-gray-800 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/20'
                                : 'border-green-300 text-green-700 bg-white hover:bg-green-50 dark:bg-gray-800 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20'
                                }`}
                            >
                              {generator.is_active ? (
                                <>
                                  <PauseIcon className="w-4 h-4 mr-1" />
                                  Пауза
                                </>
                              ) : (
                                <>
                                  <PlayIcon className="w-4 h-4 mr-1" />
                                  Запустить
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(generator)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <PencilIcon className="w-4 h-4 mr-1" />
                              Изменить
                            </button>
                            <button
                              onClick={() => handleDelete(generator)}
                              disabled={deleteMutation.isPending}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors disabled:opacity-50 dark:bg-gray-800 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generators.map((generator) => (
                <div
                  key={generator.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow p-6 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1" title={generator.title}>
                        {generator.title}
                      </h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${generator.is_active
                          ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                          : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                          }`}>
                          {generator.is_active ? 'Активен' : 'Остановлен'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                          {generator.dealership?.name || 'Нет салона'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handlePauseResume(generator)}
                        disabled={pauseMutation.isPending || resumeMutation.isPending}
                        className={`p-1.5 rounded-lg transition-colors ${generator.is_active
                          ? 'text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20'
                          : 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                          }`}
                        title={generator.is_active ? "Остановить" : "Запустить"}
                      >
                        {generator.is_active ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(generator)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-500 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(generator)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <span>
                        {getRecurrenceLabel(generator.recurrence)} в {generator.recurrence_time?.slice(0, 5)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      <span>
                        {generator.assignments?.length || 0} исполнителей
                      </span>
                    </div>

                    {generator.next_run_at && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>
                          След. запуск: {format(new Date(generator.next_run_at), 'd MMM HH:mm', { locale: ru })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {generatorsData && generatorsData.last_page > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Назад
                </button>
                <button
                  onClick={() => setPage(Math.min(generatorsData.last_page, page + 1))}
                  disabled={page === generatorsData.last_page}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Вперед
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Показано <span className="font-medium">{generatorsData.total}</span> генераторов
                  </p>
                </div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:ring-gray-600 dark:hover:bg-gray-700"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(generatorsData.last_page, page + 1))}
                    disabled={page === generatorsData.last_page}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:ring-gray-600 dark:hover:bg-gray-700"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      <TaskGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        generator={selectedGenerator}
      />
    </div>
  );
};
