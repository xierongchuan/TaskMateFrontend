import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  PencilIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  TagIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import type { Task, TaskResponseStatus } from '../../types/task';
import { usePermissions } from '../../hooks/usePermissions';
import { PriorityBadge, StatusBadge } from '../common';
import { Button, Modal, Badge, Tag } from '../ui';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

const getResponseStatusLabel = (status?: TaskResponseStatus): string => {
  switch (status) {
    case 'completed': return 'Выполнено';
    case 'pending_review': return 'На проверке';
    case 'acknowledged': return 'Принято';
    case 'postponed': return 'Отложено';
    default: return 'Ожидает';
  }
};

const getResponseStatusVariant = (status?: TaskResponseStatus): 'success' | 'warning' | 'info' | 'gray' => {
  switch (status) {
    case 'completed': return 'success';
    case 'pending_review': return 'info';
    case 'acknowledged': return 'info';
    case 'postponed': return 'warning';
    default: return 'gray';
  }
};

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit
}) => {
  const permissions = usePermissions();

  if (!isOpen || !task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} size="2xl">
      <Modal.Body>
        {/* Header badges */}
        <div className="flex flex-wrap gap-2 items-center mb-6">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} type="task" />
          {task.generator_id && (
            <Badge variant="info" icon={<CogIcon />}>
              Генератор
            </Badge>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Описание</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
              {task.description}
            </p>
          </div>
        )}

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              Дедлайн
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {task.deadline ? format(new Date(task.deadline), 'd MMMM yyyy, HH:mm', { locale: ru }) : 'Не установлен'}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              <BuildingOfficeIcon className="w-4 h-4 mr-1.5" />
              Автосалон
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {task.dealership?.name || 'Все салоны'}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              <UserIcon className="w-4 h-4 mr-1.5" />
              Создатель
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {task.creator?.full_name || 'Неизвестно'}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              <ClockIcon className="w-4 h-4 mr-1.5" />
              Создано
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {format(new Date(task.created_at), 'd MMM yyyy', { locale: ru })}
            </div>
          </div>
        </div>

        {/* Comment */}
        {task.comment && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
              <ChatBubbleLeftIcon className="w-4 h-4 mr-1.5" />
              Комментарий
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-gray-200 dark:border-gray-600 pl-3 py-1">
              {task.comment}
            </p>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
              <TagIcon className="w-4 h-4 mr-1.5" />
              Теги
            </h4>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, idx) => (
                <Tag key={idx} label={tag} size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Assignees with Status for Group Tasks */}
        {task.assignments && task.assignments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                <UserIcon className="w-4 h-4 mr-1.5" />
                Исполнители
              </h4>
              {task.task_type === 'group' && task.completion_progress && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {task.completion_progress.completed_count}/{task.completion_progress.total_assignees} выполнено
                </span>
              )}
            </div>

            {/* Progress bar for group tasks */}
            {task.task_type === 'group' && task.completion_progress && (
              <div className="mb-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.completion_progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {task.assignments.map((assignment) => {
                const userResponse = task.responses?.find(r => r.user_id === assignment.user.id);
                const statusLabel = getResponseStatusLabel(userResponse?.status);
                const statusVariant = getResponseStatusVariant(userResponse?.status);

                return (
                  <div key={assignment.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs font-semibold mr-3">
                        {assignment.user.full_name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{assignment.user.full_name}</span>
                    </div>
                    {task.task_type === 'group' && (
                      <Badge variant={statusVariant} size="sm">
                        {statusLabel}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Закрыть
        </Button>
        {onEdit && permissions.canManageTasks && (
          <Button
            variant="primary"
            icon={<PencilIcon />}
            onClick={() => onEdit(task)}
          >
            Редактировать
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
