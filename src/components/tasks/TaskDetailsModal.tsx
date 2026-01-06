import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  XMarkIcon,
  PencilIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  TagIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import type { Task } from '../../types/task';
import { usePermissions } from '../../hooks/usePermissions';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit
}) => {
  const permissions = usePermissions();

  if (!isOpen || !task) return null;

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      low: 'bg-green-50 text-green-700 border-green-200',
    };
    const labels = {
      high: 'Высокий приоритет',
      medium: 'Средний приоритет',
      low: 'Низкий приоритет',
    };
    const p = (priority || 'medium') as keyof typeof badges;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[p]}`}>
        <ExclamationTriangleIcon className="w-3.5 h-3.5 mr-1" />
        {labels[p]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      acknowledged: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Ожидает',
      acknowledged: 'Принято',
      completed: 'Выполнено',
      overdue: 'Просрочено',
    };
    const s = status as keyof typeof badges;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badges[s] || 'bg-gray-100'}`}>
        {labels[s] || status}
      </span>
    );
  };

  const RecurrenceInfo = () => {
    if (!task.recurrence || task.recurrence === 'none') return null;

    const labels = {
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
    };

    let details = '';
    if (task.recurrence_time) details += ` в ${task.recurrence_time}`;
    if (task.recurrence === 'weekly' && task.recurrence_day_of_week) {
      const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      details += ` (${days[task.recurrence_day_of_week]})`;
    }
    if (task.recurrence === 'monthly' && task.recurrence_day_of_month) {
      details += ` (${task.recurrence_day_of_month}-го числа)`;
    }

    return (
      <div className="flex items-center text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100 mt-2">
        <ArrowPathIcon className="w-4 h-4 mr-2" />
        <span className="font-medium">{labels[task.recurrence as keyof typeof labels]}</span>
        <span className="ml-1">{details}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div className="pr-8">
                <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-2">
                  {task.title}
                </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>
              </div>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">

            <RecurrenceInfo />

            {/* Description */}
            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Описание</h4>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {task.description}
                </p>
              </div>
            )}

            {/* Key Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  Дедлайн
                </div>
                <div className="text-gray-900 font-medium ml-5.5">
                  {task.deadline ? format(new Date(task.deadline), 'd MMMM yyyy, HH:mm', { locale: ru }) : 'Не установлен'}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1.5" />
                  Автосалон
                </div>
                <div className="text-gray-900 font-medium ml-5.5">
                  {task.dealership?.name || 'Все салоны'}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <UserIcon className="w-4 h-4 mr-1.5" />
                  Создатель
                </div>
                <div className="text-gray-900 font-medium ml-5.5">
                  {task.creator?.full_name || 'Неизвестно'}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <ClockIcon className="w-4 h-4 mr-1.5" />
                  Создано
                </div>
                <div className="text-gray-900 font-medium ml-5.5">
                  {format(new Date(task.created_at), 'd MMM yyyy', { locale: ru })}
                </div>
              </div>
            </div>

            {/* Comment */}
            {task.comment && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <ChatBubbleLeftIcon className="w-4 h-4 mr-1.5" />
                  Комментарий
                </h4>
                <p className="text-sm text-gray-600 italic border-l-4 border-gray-200 pl-3 py-1">
                  {task.comment}
                </p>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <TagIcon className="w-4 h-4 mr-1.5" />
                  Теги
                </h4>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assignees */}
            {task.assignments && task.assignments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                  <UserIcon className="w-4 h-4 mr-1.5" />
                  Исполнители
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {task.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center p-2 rounded-lg border border-gray-200 bg-white">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold mr-3">
                        {assignment.user.full_name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{assignment.user.full_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            {onEdit && permissions.canManageTasks && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm items-center"
                onClick={() => onEdit(task)}
              >
                <PencilIcon className="w-4 h-4 mr-1.5" />
                Редактировать
              </button>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
