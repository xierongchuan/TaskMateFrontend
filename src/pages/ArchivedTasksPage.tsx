import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { archivedTasksApi } from '../api/archivedTasks';
import { usePermissions } from '../hooks/usePermissions';
import { useResponsiveViewMode } from '../hooks/useResponsiveViewMode';
import { usePagination } from '../hooks/usePagination';
import { DealershipSelector } from '../components/common/DealershipSelector';
import type { ArchivedTask, ArchivedTaskFilters } from '../types/archivedTask';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// UI Components
import {
  PageContainer,
  Card,
  Button,
  Input,
  Select,
  Skeleton,
  ErrorState,
  EmptyState,
  Badge,
  FilterPanel,
  Pagination,
  ViewModeToggle,
  PageHeader,
  Tag,
  ConfirmDialog,
} from '../components/ui';
import { useToast } from '../components/ui/Toast';

// Icons
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUturnLeftIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

export const ArchivedTasksPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { limit } = usePagination();
  const { viewMode, setViewMode, isMobile } = useResponsiveViewMode('list', 'grid', 768, 'view_mode_archived_tasks');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmRestore, setConfirmRestore] = useState<ArchivedTask | null>(null);
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
    queryKey: ['archived-tasks', filters, page, limit],
    queryFn: () => {
      const cleanedFilters: ArchivedTaskFilters = { page, per_page: limit };
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          (cleanedFilters as Record<string, unknown>)[key] = value;
        }
      });
      return archivedTasksApi.getArchivedTasks(cleanedFilters);
    },
    refetchInterval: 60000,
    placeholderData: (prev) => prev,
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => archivedTasksApi.restoreTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archived-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Invalidate generator stats when task is restored from archive
      queryClient.invalidateQueries({ queryKey: ['generator-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
      showToast({ type: 'success', message: 'Задача восстановлена из архива' });
    },
    onError: () => {
      showToast({ type: 'error', message: 'Ошибка восстановления задачи' });
    },
  });

  const handleRestore = (task: ArchivedTask) => {
    setConfirmRestore(task);
  };

  const handleExport = async () => {
    try {
      await archivedTasksApi.downloadCsv(filters);
      showToast({ type: 'success', message: 'Экспорт CSV начат' });
    } catch (err) {
      console.error('Export failed:', err);
      showToast({ type: 'error', message: 'Ошибка экспорта' });
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

  const hasActiveFilters = filters.search || filters.archive_reason || filters.dealership_id || filters.date_from || filters.date_to;

  const reasonOptions = [
    { value: '', label: 'Все' },
    { value: 'completed', label: 'Выполнено' },
    { value: 'completed_late', label: 'Выполнено с опозданием' },
    { value: 'expired', label: 'Просрочено' },
    { value: 'expired_after_shift', label: 'Просрочено (после смены)' },
  ];

  const getReasonBadge = (reason: string) => {
    const config: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'gray' }> = {
      completed: { label: 'Выполнено', variant: 'success' },
      completed_late: { label: 'Выполнено с опозданием', variant: 'warning' },
      expired: { label: 'Просрочено', variant: 'danger' },
      expired_after_shift: { label: 'Просрочено (после смены)', variant: 'danger' },
    };
    const cfg = config[reason] || { label: reason, variant: 'gray' as const };
    const Icon = reason === 'completed' ? CheckCircleIcon :
      reason === 'completed_late' ? CheckCircleIcon :
        reason === 'expired' || reason === 'expired_after_shift' ? XCircleIcon : ArchiveBoxIcon;

    return (
      <Badge variant={cfg.variant} size="sm" icon={<Icon className="w-3 h-3" />}>
        {cfg.label}
      </Badge>
    );
  };

  const tasks = tasksData?.data || [];

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Архив задач"
        description="История выполненных и просроченных задач"
      >
        <div className="flex items-center gap-3">
          {!isMobile && (
            <ViewModeToggle
              mode={viewMode}
              onChange={(mode) => setViewMode(mode as 'list' | 'grid')}
              options={[
                { value: 'list', icon: <ListBulletIcon className="w-4 h-4" /> },
                { value: 'grid', icon: <Squares2X2Icon className="w-4 h-4" /> },
              ]}
            />
          )}
          <Button
            variant="secondary"
            icon={<ArrowDownTrayIcon />}
            onClick={handleExport}
          >
            Экспорт CSV
          </Button>
        </div>
      </PageHeader>

      {/* Filters */}
      <FilterPanel
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
        onClear={clearFilters}
        className="mb-6"
      >
        <FilterPanel.Grid columns={5}>
          <Input
            label="Поиск"
            placeholder="Название..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            icon={<MagnifyingGlassIcon />}
          />

          <Select
            label="Причина архивации"
            value={filters.archive_reason || ''}
            onChange={(e) => setFilters({ ...filters, archive_reason: e.target.value as ArchivedTaskFilters['archive_reason'] || undefined })}
            options={reasonOptions}
          />

          <Input
            type="date"
            label="С даты"
            value={filters.date_from || ''}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          />

          <Input
            type="date"
            label="По дату"
            value={filters.date_to || ''}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Автосалон</label>
            <DealershipSelector
              value={filters.dealership_id || null}
              onChange={(dealershipId) => setFilters({ ...filters, dealership_id: dealershipId || undefined })}
              showAllOption={true}
              allOptionLabel="Все"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </FilterPanel.Grid>
      </FilterPanel>

      {/* Content */}
      {isLoading ? (
        <Card>
          <Card.Body>
            <Skeleton variant="list" count={5} />
          </Card.Body>
        </Card>
      ) : error ? (
        <ErrorState
          title="Ошибка загрузки архива"
          description="Не удалось загрузить архивированные задачи. Попробуйте обновить страницу."
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['archived-tasks'] })}
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<ArchiveBoxIcon className="w-16 h-16" />}
          title="Архив пуст"
          description={hasActiveFilters ? 'Попробуйте изменить фильтры' : 'Архивированные задачи появятся здесь'}
        />
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Задача</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата архивации</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Автосалон</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</span>
                            {task.description && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{task.description}</span>
                            )}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.tags.slice(0, 3).map((tag, idx) => (
                                  <Tag key={idx} label={tag} />
                                ))}
                                {task.tags.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">+{task.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getReasonBadge(task.archive_reason)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {format(new Date(task.archived_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <BuildingOfficeIcon className="w-4 h-4" />
                            {task.dealership?.name || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {permissions.canManageTasks && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<ArrowUturnLeftIcon />}
                              onClick={() => handleRestore(task)}
                              disabled={restoreMutation.isPending}
                              className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20"
                            >
                              Восстановить
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Cards View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <Card.Body>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{task.title}</h3>
                      {getReasonBadge(task.archive_reason)}
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{task.description}</p>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 3).map((tag, idx) => (
                          <Tag key={idx} label={tag} />
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {format(new Date(task.archived_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                      </div>
                      <div className="flex items-center gap-1">
                        <BuildingOfficeIcon className="w-3.5 h-3.5" />
                        {task.dealership?.name || '—'}
                      </div>
                    </div>

                    {permissions.canManageTasks && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ArrowUturnLeftIcon />}
                        onClick={() => handleRestore(task)}
                        disabled={restoreMutation.isPending}
                        className="w-full text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20"
                      >
                        Восстановить
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {tasksData && tasksData.last_page > 1 && (
            <Pagination
              currentPage={page}
              totalPages={tasksData.last_page}
              total={tasksData.total}
              perPage={tasksData.per_page}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!confirmRestore}
        title={`Восстановить "${confirmRestore?.title}"?`}
        message="Задача будет перемещена из архива обратно в активные задачи"
        variant="info"
        confirmText="Восстановить"
        cancelText="Отмена"
        onConfirm={() => {
          if (confirmRestore) {
            restoreMutation.mutate(confirmRestore.id);
            setConfirmRestore(null);
          }
        }}
        onCancel={() => setConfirmRestore(null)}
        isLoading={restoreMutation.isPending}
      />
    </PageContainer>
  );
};
