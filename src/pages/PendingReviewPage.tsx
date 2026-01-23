import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { usePermissions } from '../hooks/usePermissions';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  ClipboardDocumentCheckIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  UserIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

import type { Task, TaskResponse } from '../types/task';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { ProofViewer } from '../components/tasks/ProofViewer';
import { DealershipSelector } from '../components/common/DealershipSelector';

import {
  Button,
  Skeleton,
  EmptyState,
  ErrorState,
  PageContainer,
  Card,
  Pagination,
  PageHeader,
  Modal,
  Textarea,
  Alert,
  useToast,
} from '../components/ui';
import { StatusBadge, PriorityBadge } from '../components/common';

export const PendingReviewPage: React.FC = () => {
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [dealershipFilter, setDealershipFilter] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ response: TaskResponse; task: Task } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: tasksData, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', 'pending_review', page, dealershipFilter],
    queryFn: () => tasksApi.getTasks({
      status: 'pending_review',
      dealership_id: dealershipFilter || undefined,
      page,
      per_page: 15,
    }),
    refetchInterval: 30000,
  });

  const approveResponseMutation = useMutation({
    mutationFn: (responseId: number) => tasksApi.approveTaskResponse(responseId),
    onSuccess: async () => {
      showToast({ type: 'success', message: 'Доказательство одобрено' });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await refetch();
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ошибка при одобрении';
      showToast({ type: 'error', message });
    },
  });

  const rejectResponseMutation = useMutation({
    mutationFn: ({ responseId, reason }: { responseId: number; reason: string }) =>
      tasksApi.rejectTaskResponse(responseId, reason),
    onSuccess: async () => {
      showToast({ type: 'success', message: 'Доказательство отклонено' });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await refetch();
      setRejectModal(null);
      setRejectReason('');
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Ошибка при отклонении';
      showToast({ type: 'error', message });
    },
  });

  const handleApprove = async (response: TaskResponse) => {
    await approveResponseMutation.mutateAsync(response.id);
  };

  const handleReject = async () => {
    if (rejectModal && rejectReason.trim()) {
      await rejectResponseMutation.mutateAsync({
        responseId: rejectModal.response.id,
        reason: rejectReason.trim(),
      });
    }
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  // Получаем response со статусом pending_review для задачи
  const getPendingResponse = (task: Task): TaskResponse | undefined => {
    return task.responses?.find(r => r.status === 'pending_review');
  };

  if (!permissions.canManageTasks) {
    return (
      <PageContainer>
        <ErrorState
          title="Доступ запрещён"
          description="У вас нет прав для просмотра этой страницы"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Задачи на проверке"
        description="Верификация выполненных задач с доказательствами"
      />

      {/* Фильтры */}
      <Card className="mb-6">
        <Card.Body>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Автосалон
              </label>
              <DealershipSelector
                value={dealershipFilter}
                onChange={(id) => {
                  setDealershipFilter(id);
                  setPage(1);
                }}
                showAllOption
                allOptionLabel="Все автосалоны"
              />
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Найдено: {tasksData?.total || 0} задач
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Контент */}
      {isLoading ? (
        <Card>
          <Card.Body>
            <Skeleton variant="list" count={5} />
          </Card.Body>
        </Card>
      ) : error ? (
        <ErrorState
          title="Ошибка загрузки"
          onRetry={() => refetch()}
        />
      ) : tasksData?.data.length === 0 ? (
        <EmptyState
          icon={<ClipboardDocumentCheckIcon />}
          title="Нет задач на проверке"
          description="Все задачи проверены или ещё не отправлены на проверку"
        />
      ) : (
        <>
          <div className="space-y-4">
            {tasksData?.data.map((task) => {
              const pendingResponse = getPendingResponse(task);
              if (!pendingResponse) return null;

              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <Card.Body>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Информация о задаче */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3
                            className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => handleViewDetails(task)}
                          >
                            {task.title}
                          </h3>
                          <PriorityBadge priority={task.priority || 'medium'} />
                          <StatusBadge status="pending_review" type="task" />
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {pendingResponse.user?.full_name || 'Неизвестно'}
                          </span>
                          <span className="flex items-center">
                            <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                            {task.dealership?.name || 'Все салоны'}
                          </span>
                          {pendingResponse.responded_at && (
                            <span>
                              Отправлено: {format(new Date(pendingResponse.responded_at), 'dd MMM HH:mm', { locale: ru })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Доказательства */}
                      {((pendingResponse.proofs && pendingResponse.proofs.length > 0) || (task.shared_proofs && task.shared_proofs.length > 0)) && (
                        <div className="lg:w-64 flex-shrink-0">
                          <ProofViewer proofs={pendingResponse.proofs && pendingResponse.proofs.length > 0 ? pendingResponse.proofs : task.shared_proofs || []} />
                        </div>
                      )}

                      {/* Действия */}
                      <div className="flex flex-col gap-2 lg:w-40 flex-shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<CheckIcon className="w-4 h-4" />}
                          onClick={() => handleApprove(pendingResponse)}
                          disabled={approveResponseMutation.isPending}
                          isLoading={approveResponseMutation.isPending}
                          fullWidth
                        >
                          Одобрить
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<XMarkIcon className="w-4 h-4" />}
                          onClick={() => setRejectModal({ response: pendingResponse, task })}
                          disabled={rejectResponseMutation.isPending}
                          fullWidth
                        >
                          Отклонить
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<EyeIcon className="w-4 h-4" />}
                          onClick={() => handleViewDetails(task)}
                          fullWidth
                        >
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          {/* Пагинация */}
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

      {/* Модальное окно отклонения */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => {
          setRejectModal(null);
          setRejectReason('');
        }}
        title="Отклонение доказательства"
        size="md"
      >
        <Modal.Body>
          <div className="space-y-6">
            {/* Заголовок с иконкой предупреждения */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                  {rejectModal?.task.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Исполнитель: {rejectModal?.response.user?.full_name || 'Неизвестно'}
                </p>
              </div>
            </div>

            {/* Предупреждение о последствиях */}
            <Alert
              variant="warning"
              message="При отклонении все загруженные файлы будут удалены. Сотрудник сможет повторно отправить доказательства."
            />

            {/* Поле причины */}
            <div>
              <Textarea
                label="Причина отклонения"
                placeholder="Опишите, почему доказательство отклонено и что нужно исправить...&#10;Например: Качество фото недостаточное, необходимо переснять при лучшем освещении."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Причина будет показана сотруднику
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setRejectModal(null);
              setRejectReason('');
            }}
            disabled={rejectResponseMutation.isPending}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            icon={<XMarkIcon className="w-4 h-4" />}
            onClick={handleReject}
            disabled={!rejectReason.trim() || rejectResponseMutation.isPending}
            isLoading={rejectResponseMutation.isPending}
          >
            Отклонить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Детали задачи */}
      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={selectedTask}
        onApproveResponse={async (responseId) => { await approveResponseMutation.mutateAsync(responseId); }}
        onRejectResponse={async (responseId, reason) => { await rejectResponseMutation.mutateAsync({ responseId, reason }); }}
        onVerificationComplete={async () => {
          // Обновить selectedTask из свежих данных
          const freshData = await refetch();
          if (selectedTask && freshData.data?.data) {
            const updated = freshData.data.data.find(t => t.id === selectedTask.id);
            if (updated) {
              setSelectedTask(updated);
            } else {
              // Задача больше не в pending_review списке - закрыть модалку
              setIsDetailsOpen(false);
            }
          }
        }}
        isVerifying={approveResponseMutation.isPending || rejectResponseMutation.isPending}
      />
    </PageContainer>
  );
};
