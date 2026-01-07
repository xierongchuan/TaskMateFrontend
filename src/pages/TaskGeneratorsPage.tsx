import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskGeneratorsApi } from '../api/taskGenerators';
import { usePermissions } from '../hooks/usePermissions';
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
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export const TaskGeneratorsPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<TaskGenerator | null>(null);
  const [showFilters, setShowFilters] = useState(false);
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
    queryKey: ['task-generators', filters, page],
    queryFn: () => {
      const cleanedFilters: TaskGeneratorFilters = { page, per_page: 15 };
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
      daily: 'bg-green-100 text-green-800 border-green-200',
      weekly: 'bg-blue-100 text-blue-800 border-blue-200',
      monthly: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[recurrence] || 'bg-gray-100 text-gray-800'}`}>
        <ArrowPathIcon className="w-3 h-3 mr-1" />
        {getRecurrenceLabel(recurrence)}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Активен
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
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
            <h1 className="text-3xl font-bold text-gray-900">Генераторы задач</h1>
            <p className="mt-2 text-sm text-gray-600">
              Управление автоматическим созданием повторяющихся задач
            </p>
          </div>
          <div className="flex items-center space-x-3">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                <select
                  value={filters.is_active === undefined ? '' : String(filters.is_active)}
                  onChange={(e) => setFilters({ ...filters, is_active: e.target.value === '' ? undefined : e.target.value === 'true' })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Все</option>
                  <option value="true">Активные</option>
                  <option value="false">Приостановленные</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Повторяемость</label>
                <select
                  value={filters.recurrence || ''}
                  onChange={(e) => setFilters({ ...filters, recurrence: e.target.value as TaskGeneratorFilters['recurrence'] || undefined })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Все</option>
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                  <option value="monthly">Ежемесячно</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Автосалон</label>
                <DealershipSelector
                  value={filters.dealership_id || null}
                  onChange={(dealershipId) => setFilters({ ...filters, dealership_id: dealershipId || undefined })}
                  showAllOption={true}
                  allOptionLabel="Все автосалоны"
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
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800">Ошибка загрузки генераторов</p>
          </div>
        </div>
      ) : generators.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ArrowPathIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Генераторы не найдены</h3>
          <p className="text-gray-500">
            {filters.search || filters.is_active !== undefined
              ? 'Попробуйте изменить фильтры'
              : 'Создайте первый генератор для автоматического создания задач'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="space-y-4">
              {generators.map((generator) => (
                <div
                  key={generator.id}
                  className={`p-5 rounded-lg border hover:shadow-sm transition-all ${generator.is_active
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-300 opacity-75'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {generator.title}
                        </h3>
                        {getStatusBadge(generator.is_active)}
                        {getRecurrenceBadge(generator.recurrence)}
                      </div>

                      {generator.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {generator.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
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
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <UserIcon className="w-3 h-3 mr-1" />
                              {assignment.user?.full_name}
                            </span>
                          ))}
                          {generator.assignments.length > 5 && (
                            <span className="text-xs text-gray-500">
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
                              ? 'border-yellow-300 text-yellow-700 bg-white hover:bg-yellow-50'
                              : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
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
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(generator)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
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

          {/* Pagination */}
          {generatorsData && generatorsData.last_page > 1 && (
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
                  onClick={() => setPage(Math.min(generatorsData.last_page, page + 1))}
                  disabled={page === generatorsData.last_page}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Вперед
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Показано <span className="font-medium">{generatorsData.total}</span> генераторов
                  </p>
                </div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(generatorsData.last_page, page + 1))}
                    disabled={page === generatorsData.last_page}
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

      <TaskGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        generator={selectedGenerator}
      />
    </div>
  );
};
