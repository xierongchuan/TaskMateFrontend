import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { usePermissions } from '../hooks/usePermissions';
import { useResponsiveViewMode } from '../hooks/useResponsiveViewMode';
import { usePagination } from '../hooks/usePagination';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { DealershipSelector } from '../components/common/DealershipSelector';
import { UserSelector } from '../components/common/UserSelector';
import { MultiFileUpload } from '../components/ui/MultiFileUpload';
import type { Task } from '../types/task';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  PlusIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ListBulletIcon,
  Squares2X2Icon,
  CheckCircleIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { RESPONSE_TYPE_LABELS } from '../constants/tasks';

import { useSearchParams } from 'react-router-dom';

// Унифицированные компоненты
import {
  Button,
  Input,
  Select,
  ViewModeToggle,
  FilterPanel,
  Skeleton,
  EmptyState,
  ErrorState,
  PageContainer,
  Card,
  Pagination,
  ConfirmDialog,
  PageHeader,
  Tag,
  Modal,
} from '../components/ui';
import { StatusBadge, PriorityBadge, ActionButtons } from '../components/common';

export const TasksPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { viewMode, setViewMode, isMobile } = useResponsiveViewMode('list', 'grid', 768, 'view_mode_tasks');
  const [page, setPage] = useState(1);
  const { limit } = usePagination();
  const [confirmDelete, setConfirmDelete] = useState<Task | null>(null);
  const [confirmGroupComplete, setConfirmGroupComplete] = useState<{ task: Task; status: string } | null>(null);
  const [proofUploadTask, setProofUploadTask] = useState<Task | null>(null);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    task_type: searchParams.get('task_type') || '',
    response_type: searchParams.get('response_type') || '',
    date_range: searchParams.get('date_range') || 'all',
    dealership_id: searchParams.get('dealership_id') ? Number(searchParams.get('dealership_id')) : null,
    assigned_to: searchParams.get('assigned_to') ? Number(searchParams.get('assigned_to')) : null,
    tags: searchParams.getAll('tags') || [],
    priority: searchParams.get('priority') || '',
    from_generator: searchParams.get('from_generator') || '',
  });

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data: tasksData, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', filters, page, limit],
    queryFn: () => {
      const cleanedFilters: {
        search?: string;
        status?: string;
        task_type?: string;
        response_type?: string;
        date_range?: string;
        dealership_id?: number;
        assigned_to?: number;
        tags?: string[];
        priority?: string;
        from_generator?: string;
        per_page?: number;
        page?: number;
      } = { page, per_page: limit };

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
      // Invalidate generator stats when task is deleted
      queryClient.invalidateQueries({ queryKey: ['generator-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
      setConfirmDelete(null);
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

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setConfirmDelete(task);
  };

  const handleDuplicate = (task: Task) => {
    const duplicateData = {
      ...task,
      id: undefined,
      title: `${task.title} (копия)`,
    };
    setSelectedTask(duplicateData as unknown as Task);
    setIsModalOpen(true);
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status, completeForAll }: { taskId: number; status: string; completeForAll?: boolean }) =>
      tasksApi.updateTaskStatus(taskId, status, completeForAll),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', filters, page, limit] });
      const previousTasks = queryClient.getQueryData(['tasks', filters, page, limit]);
      // Оптимистично обновляем кэш
      queryClient.setQueryData(['tasks', filters, page, limit], (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const oldData = old as { data: Task[] };
        return {
          ...oldData,
          data: oldData.data.map((task: Task) =>
            task.id === taskId ? { ...task, status } : task
          ),
        };
      });
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      // Откат при ошибке
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters, page, limit], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Invalidate generator stats when task status changes
      queryClient.invalidateQueries({ queryKey: ['generator-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
    },
  });

  const proofUploadMutation = useMutation({
    mutationFn: ({ taskId, status, files }: { taskId: number; status: string; files: File[] }) =>
      tasksApi.updateTaskStatusWithProofs(taskId, status, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setProofUploadTask(null);
      setProofFiles([]);
    },
  });

  const approveResponseMutation = useMutation({
    mutationFn: (responseId: number) => tasksApi.approveTaskResponse(responseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const rejectResponseMutation = useMutation({
    mutationFn: ({ responseId, reason }: { responseId: number; reason: string }) =>
      tasksApi.rejectTaskResponse(responseId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteProofMutation = useMutation({
    mutationFn: (proofId: number) => tasksApi.deleteTaskProof(proofId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleStatusChange = (task: Task, newStatus: string) => {
    // Если менеджер/владелец отмечает групповую задачу как выполненную - показать диалог выбора
    if (
      task.task_type === 'group' &&
      (permissions.isManager || permissions.isOwner) &&
      (newStatus === 'completed' || newStatus === 'pending_review')
    ) {
      setConfirmGroupComplete({ task, status: newStatus });
      return;
    }

    // Если задача требует доказательства и это завершение - показать модальное окно загрузки
    if (
      task.response_type === 'completion_with_proof' &&
      (newStatus === 'completed' || newStatus === 'pending_review')
    ) {
      setProofUploadTask(task);
      return;
    }

    updateStatusMutation.mutate({ taskId: task.id, status: newStatus });
  };

  const handleProofUploadSubmit = () => {
    if (proofUploadTask && proofFiles.length > 0) {
      proofUploadMutation.mutate({
        taskId: proofUploadTask.id,
        status: 'pending_review',
        files: proofFiles,
      });
    }
  };

  const handleApproveResponse = async (responseId: number) => {
    await approveResponseMutation.mutateAsync(responseId);
  };

  const handleRejectResponse = async (responseId: number, reason: string) => {
    await rejectResponseMutation.mutateAsync({ responseId, reason });
  };

  const handleDeleteProof = async (proofId: number) => {
    await deleteProofMutation.mutateAsync(proofId);
  };

  const handleGroupCompleteConfirm = (completeForAll: boolean) => {
    if (confirmGroupComplete) {
      updateStatusMutation.mutate({
        taskId: confirmGroupComplete.task.id,
        status: confirmGroupComplete.status,
        completeForAll,
      });
      setConfirmGroupComplete(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      task_type: '',
      response_type: '',
      date_range: 'all',
      dealership_id: null,
      assigned_to: null,
      tags: [],
      priority: '',
      from_generator: '',
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

  const getTaskCardClass = (task: Task) => {
    const deadlineStatus = getDeadlineStatus(task);
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200';

    switch (deadlineStatus) {
      case 'overdue': return `${baseClasses} border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800`;
      case 'urgent': return `${baseClasses} border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800`;
      case 'soon': return `${baseClasses} border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800`;
      default: return `${baseClasses} border-gray-200 dark:border-gray-700`;
    }
  };

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'pending', label: 'Ожидает' },
    { value: 'pending_review', label: 'На проверке' },
    { value: 'completed', label: 'Выполнено' },
    { value: 'completed_late', label: 'Выполнено с опозданием' },
    { value: 'overdue', label: 'Просрочено' },
  ];

  const priorityOptions = [
    { value: '', label: 'Все приоритеты' },
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
  ];

  const taskTypeOptions = [
    { value: '', label: 'Все типы' },
    { value: 'individual', label: 'Индивидуальная' },
    { value: 'group', label: 'Групповая' },
  ];

  const responseTypeOptions = [
    { value: '', label: 'Все' },
    { value: 'notification', label: 'Уведомление' },
    { value: 'completion', label: 'На выполнение' },
    { value: 'completion_with_proof', label: 'С доказательством' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Все время' },
    { value: 'today', label: 'Сегодня' },
    { value: 'week', label: 'Эта неделя' },
    { value: 'month', label: 'Этот месяц' },
  ];

  const statusChangeOptions = [
    { value: 'pending', label: 'Ожидает' },
    { value: 'pending_review', label: 'На проверке' },
    { value: 'completed', label: 'Выполнено' },
  ];

  const sourceOptions = [
    { value: '', label: 'Все источники' },
    { value: 'yes', label: 'Генератор' },
    { value: 'no', label: 'Вручную' },
  ];

  const hasActiveFilters = filters.search || filters.status || filters.priority ||
    filters.task_type || filters.response_type || filters.from_generator ||
    filters.date_range !== 'all' || filters.dealership_id || filters.assigned_to;

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Задачи"
        description="Управление задачами и отслеживание выполнения"
      >
        {!isMobile && (
          <ViewModeToggle
            mode={viewMode}
            onChange={(mode) => setViewMode(mode as 'list' | 'grid')}
            options={[
              { value: 'list', icon: <ListBulletIcon />, label: 'Список' },
              { value: 'grid', icon: <Squares2X2Icon />, label: 'Карточки' },
            ]}
          />
        )}
        {permissions.canManageTasks && (
          <Button
            variant="primary"
            icon={<PlusIcon />}
            onClick={handleCreate}
          >
            Создать задачу
          </Button>
        )}
      </PageHeader>

      {/* Filters */}
      <FilterPanel
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
        onClear={hasActiveFilters ? clearFilters : undefined}
        className="mb-6"
      >
        <FilterPanel.Grid columns={4}>
          <Input
            label="Поиск"
            placeholder="Название или описание..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <Select
            label="Статус"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={statusOptions}
          />

          <Select
            label="Приоритет"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            options={priorityOptions}
          />

          <Select
            label="Тип задачи"
            value={filters.task_type}
            onChange={(e) => setFilters({ ...filters, task_type: e.target.value })}
            options={taskTypeOptions}
          />

          <Select
            label="Тип ответа"
            value={filters.response_type}
            onChange={(e) => setFilters({ ...filters, response_type: e.target.value })}
            options={responseTypeOptions}
          />

          <Select
            label="Период"
            value={filters.date_range}
            onChange={(e) => setFilters({ ...filters, date_range: e.target.value })}
            options={dateRangeOptions}
          />

          <Select
            label="Источник"
            value={filters.from_generator}
            onChange={(e) => setFilters({ ...filters, from_generator: e.target.value })}
            options={sourceOptions}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Автосалон</label>
            <DealershipSelector
              value={filters.dealership_id}
              onChange={(dealershipId) => setFilters({ ...filters, dealership_id: dealershipId, assigned_to: null })}
              showAllOption={true}
              allOptionLabel="Все автосалоны"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Исполнитель</label>
            <UserSelector
              dealershipId={filters.dealership_id}
              value={filters.assigned_to}
              onChange={(userId) => setFilters({ ...filters, assigned_to: userId })}
              showAllOption={true}
              allOptionLabel="Все сотрудники"
              noDealershipMessage="Сначала выберите автосалон"
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
          title="Ошибка загрузки задач"
          onRetry={() => refetch()}
        />
      ) : tasksData?.data.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon />}
          title="Задачи не найдены"
          description={hasActiveFilters
            ? 'Попробуйте изменить фильтры для поиска задач'
            : 'Создайте первую задачу для начала работы'}
          action={permissions.canManageTasks && !hasActiveFilters ? (
            <Button variant="primary" icon={<PlusIcon />} onClick={handleCreate}>
              Создать задачу
            </Button>
          ) : undefined}
        />
      ) : (
        <>
          {/* List View */}
          {viewMode === 'list' && (
            <Card>
              <Card.Body className="space-y-4">
                {tasksData?.data.map((task) => (
                  <div key={task.id} className={`p-5 rounded-lg border hover:shadow-sm transition-all ${getTaskCardClass(task)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3
                            className="text-lg font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => handleView(task)}
                          >
                            {task.title}
                          </h3>
                          <PriorityBadge priority={task.priority || 'medium'} />
                          <StatusBadge status={task.status} type="task" />
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {task.task_type === 'individual' ? 'Индивидуальная' : (
                              <span>
                                Групповая
                                {task.completion_progress && (
                                  <span className="ml-1 text-green-600 dark:text-green-400">
                                    ({task.completion_progress.completed_count}/{task.completion_progress.total_assignees})
                                  </span>
                                )}
                              </span>
                            )}
                          </span>
                          <span className="flex items-center">
                            {task.response_type === 'completion_with_proof' ?
                              <DocumentIcon className="w-4 h-4 mr-1" /> :
                              task.response_type === 'notification' ?
                                <CheckCircleIcon className="w-4 h-4 mr-1" /> :
                                <CalendarIcon className="w-4 h-4 mr-1" />
                            }
                            {RESPONSE_TYPE_LABELS[task.response_type] || task.response_type}
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
                              <Tag key={idx} label={tag} />
                            ))}
                          </div>
                        )}
                      </div>

                      {permissions.canManageTasks && (
                        <div className="flex flex-col space-y-2">
                          <ActionButtons
                            onEdit={() => handleEdit(task)}
                            onDelete={() => handleDelete(task)}
                            onDuplicate={() => handleDuplicate(task)}
                            isDeleting={deleteMutation.isPending}
                          />
                          <Select
                            value={task.status === 'overdue' ? 'pending' : task.status}
                            onChange={(e) => handleStatusChange(task, e.target.value)}
                            options={statusChangeOptions}
                            selectSize="sm"
                            fullWidth={false}
                            className="min-w-[120px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasksData?.data.map((task) => (
                <div key={task.id} className={`p-6 ${getTaskCardClass(task)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => handleView(task)}
                    >
                      {task.title}
                    </h3>
                    <PriorityBadge priority={task.priority || 'medium'} />
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <StatusBadge status={task.status} type="task" />
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{task.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {task.deadline && (
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {format(new Date(task.deadline), 'dd MMM HH:mm', { locale: ru })}
                      </div>
                    )}
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2" />
                      {task.task_type === 'individual' ? 'Индивидуальная' : (
                        <span>
                          Групповая
                          {task.completion_progress && (
                            <span className="ml-1 text-green-600 dark:text-green-400">
                              ({task.completion_progress.completed_count}/{task.completion_progress.total_assignees})
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      {task.dealership?.name || 'Все салоны'}
                    </div>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {task.tags.map((tag, idx) => (
                        <Tag key={idx} label={tag} />
                      ))}
                    </div>
                  )}

                  {permissions.canManageTasks && (
                    <div className="flex flex-col space-y-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <ActionButtons
                        onEdit={() => handleEdit(task)}
                        onDelete={() => handleDelete(task)}
                        onDuplicate={() => handleDuplicate(task)}
                        isDeleting={deleteMutation.isPending}
                        size="sm"
                      />
                      <Select
                        value={task.status === 'overdue' ? 'pending' : task.status}
                        onChange={(e) => handleStatusChange(task, e.target.value)}
                        options={statusChangeOptions}
                        selectSize="sm"
                      />
                    </div>
                  )}
                </div>
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
      )
      }

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        onEdit={(task) => {
          setIsDetailsModalOpen(false);
          handleEdit(task);
        }}
        onApproveResponse={handleApproveResponse}
        onRejectResponse={handleRejectResponse}
        onDeleteProof={handleDeleteProof}
        isVerifying={approveResponseMutation.isPending || rejectResponseMutation.isPending}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
      />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title={`Удалить задачу "${confirmDelete?.title}"?`}
        message="Это действие нельзя отменить"
        variant="danger"
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteMutation.isPending}
      />

      {/* Диалог выбора способа завершения групповой задачи */}
      <Modal
        isOpen={!!confirmGroupComplete}
        onClose={() => setConfirmGroupComplete(null)}
        title="Завершение групповой задачи"
        size="md"
      >
        <Modal.Body>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Эта задача назначена нескольким исполнителям. Выберите способ завершения:
          </p>
          {confirmGroupComplete?.task.completion_progress && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Текущий прогресс: {confirmGroupComplete.task.completion_progress.completed_count} из{' '}
              {confirmGroupComplete.task.completion_progress.total_assignees} исполнителей
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmGroupComplete(null)}
          >
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={() => handleGroupCompleteConfirm(true)}
            disabled={updateStatusMutation.isPending}
          >
            Завершить для всех
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно загрузки доказательств */}
      <Modal
        isOpen={!!proofUploadTask}
        onClose={() => {
          setProofUploadTask(null);
          setProofFiles([]);
        }}
        title="Загрузка доказательств"
        size="lg"
      >
        <Modal.Body>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Для выполнения задачи "{proofUploadTask?.title}" необходимо загрузить доказательства.
          </p>
          <MultiFileUpload
            files={proofFiles}
            onChange={setProofFiles}
            disabled={proofUploadMutation.isPending}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setProofUploadTask(null);
              setProofFiles([]);
            }}
            disabled={proofUploadMutation.isPending}
          >
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleProofUploadSubmit}
            disabled={proofFiles.length === 0 || proofUploadMutation.isPending}
            isLoading={proofUploadMutation.isPending}
          >
            Отправить на проверку
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer >
  );
};
