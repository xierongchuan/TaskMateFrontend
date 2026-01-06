import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../api/tasks';
import { usersApi } from '../../api/users';
import { DealershipSelector } from '../common/DealershipSelector';
import { TaskNotificationSettings } from './TaskNotificationSettings';
import { getRoleLabel } from '../../utils/roleTranslations';
import type { Task, CreateTaskRequest, TaskRecurrence, TaskType, ResponseType } from '../../types/task';

/**
 * Convert ISO 8601 date string (with timezone) to datetime-local format (YYYY-MM-DDTHH:mm)
 * datetime-local input requires format without seconds and timezone
 */
const toDateTimeLocalFormat = (isoString: string | null | undefined): string | undefined => {
  if (!isoString) return undefined;
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return undefined;
  }
};

/**
 * Extract time (HH:mm) from ISO 8601 date string
 */
const toTimeFormat = (isoString: string | null | undefined): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<CreateTaskRequest>>({
    title: '',
    description: '',
    comment: '',
    task_type: 'individual',
    response_type: 'acknowledge',
    recurrence: 'none',
    dealership_id: undefined,
    assignments: [],
  });

  const [tagsInput, setTagsInput] = useState('');

  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['task-modal-users', formData.dealership_id],
    queryFn: () => {
      console.log('[TaskModal] Fetching users for dealership_id:', formData.dealership_id);
      return usersApi.getUsers({
        per_page: 100,
        dealership_id: formData.dealership_id
      });
    },
    enabled: !!formData.dealership_id,
    staleTime: 0,
  });

  // Debug: Log when dealership changes
  useEffect(() => {
    console.log('[TaskModal] dealership_id changed:', formData.dealership_id, 'type:', typeof formData.dealership_id);
    console.log('[TaskModal] usersData:', usersData);
    console.log('[TaskModal] isLoadingUsers:', isLoadingUsers);
    console.log('[TaskModal] usersError:', usersError);
  }, [formData.dealership_id, usersData, isLoadingUsers, usersError]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        comment: task.comment || '',
        task_type: task.task_type,
        response_type: task.response_type,
        recurrence: task.recurrence,
        recurrence_time: task.recurrence_time || undefined,
        recurrence_day_of_week: task.recurrence_day_of_week || undefined,
        recurrence_day_of_month: task.recurrence_day_of_month || undefined,
        appear_date: toDateTimeLocalFormat(task.appear_date),
        deadline: toDateTimeLocalFormat(task.deadline),
        dealership_id: task.dealership_id,
        tags: task.tags,
        assignments: task.assignments?.map(a => a.user.id) || [],
        notification_settings: task.notification_settings,
      });
      setTagsInput(task.tags && Array.isArray(task.tags) ? task.tags.join(', ') : '');
    } else {
      setFormData({
        title: '',
        description: '',
        comment: '',
        task_type: 'individual',
        response_type: 'acknowledge',
        recurrence: 'none',
        dealership_id: undefined,
        assignments: [],
        notification_settings: undefined,
      });
      setTagsInput('');
    }
  }, [task]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateTaskRequest>) => tasksApi.updateTask(task!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format recurrence_time to HH:MM (remove seconds if present)
    const dataToSubmit = { ...formData };

    // Parse tags
    if (tagsInput) {
      dataToSubmit.tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    } else {
      dataToSubmit.tags = [];
    }

    // Clean up recurrence-related fields when recurrence is 'none'
    if (dataToSubmit.recurrence === 'none') {
      delete dataToSubmit.recurrence_time;
      delete dataToSubmit.recurrence_day_of_week;
      delete dataToSubmit.recurrence_day_of_month;
    } else {
      if (dataToSubmit.recurrence_time) {
        // Extract only HH:MM from HH:MM:SS format
        dataToSubmit.recurrence_time = dataToSubmit.recurrence_time.substring(0, 5);
      }

      // Clean up day_of_week if not weekly
      if (dataToSubmit.recurrence !== 'weekly') {
        delete dataToSubmit.recurrence_day_of_week;
      }

      // Clean up day_of_month if not monthly
      if (dataToSubmit.recurrence !== 'monthly') {
        delete dataToSubmit.recurrence_day_of_month;
      }
    }

    if (task) {
      updateMutation.mutate(dataToSubmit as Partial<CreateTaskRequest>);
    } else {
      createMutation.mutate(dataToSubmit as CreateTaskRequest);
    }
  };

  const handleUserSelection = (userId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignments: checked
        ? [...(prev.assignments || []), userId]
        : (prev.assignments || []).filter(id => id !== userId),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {task ? 'Редактировать задачу' : 'Создать задачу'}
              </h3>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Название *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Описание</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Комментарий</label>
                  <textarea
                    rows={2}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Теги (через запятую)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="срочно, важно, backend"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Тип задачи</label>
                    <select
                      value={formData.task_type}
                      onChange={(e) => setFormData({ ...formData, task_type: e.target.value as TaskType })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    >
                      <option value="individual">Индивидуальная</option>
                      <option value="group">Групповая</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Тип ответа</label>
                    <select
                      value={formData.response_type}
                      onChange={(e) => setFormData({ ...formData, response_type: e.target.value as ResponseType })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    >
                      <option value="acknowledge">Уведомление (ОК)</option>
                      <option value="complete">Выполнение</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Автосалон *</label>
                  <DealershipSelector
                    value={formData.dealership_id}
                    onChange={(dealershipId) => {
                      console.log('[TaskModal] DealershipSelector onChange:', dealershipId, 'converted to:', dealershipId || undefined);
                      setFormData({
                        ...formData,
                        dealership_id: dealershipId || undefined,
                        assignments: [] // Clear assignments when dealership changes
                      });
                    }}
                    placeholder="Выберите автосалон"
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Повторяемость</label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) => {
                      const newRecurrence = e.target.value as TaskRecurrence;
                      const updates: Partial<CreateTaskRequest> = { recurrence: newRecurrence };

                      // Clear recurrence-specific fields when changing type
                      if (newRecurrence === 'none') {
                        updates.recurrence_time = undefined;
                        updates.recurrence_day_of_week = undefined;
                        updates.recurrence_day_of_month = undefined;
                      } else {
                        // Clear fields not applicable to the selected recurrence type
                        if (newRecurrence !== 'weekly') {
                          updates.recurrence_day_of_week = undefined;
                        }
                        if (newRecurrence !== 'monthly') {
                          updates.recurrence_day_of_month = undefined;
                        }
                      }

                      setFormData({ ...formData, ...updates });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  >
                    <option value="none">Не повторяется</option>
                    <option value="daily">Ежедневно</option>
                    <option value="weekly">Еженедельно</option>
                    <option value="monthly">Ежемесячно</option>
                  </select>
                </div>

                {formData.recurrence !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Время повторения</label>
                    <input
                      type="time"
                      step="60"
                      value={formData.recurrence_time || ''}
                      onChange={(e) => setFormData({ ...formData, recurrence_time: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                )}

                {formData.recurrence === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">День недели</label>
                    <select
                      value={formData.recurrence_day_of_week || ''}
                      onChange={(e) => setFormData({ ...formData, recurrence_day_of_week: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    >
                      <option value="">Выберите день недели</option>
                      <option value="1">Понедельник</option>
                      <option value="2">Вторник</option>
                      <option value="3">Среда</option>
                      <option value="4">Четверг</option>
                      <option value="5">Пятница</option>
                      <option value="6">Суббота</option>
                      <option value="0">Воскресенье</option>
                    </select>
                  </div>
                )}

                {formData.recurrence === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">День месяца</label>
                    <select
                      value={formData.recurrence_day_of_month || ''}
                      onChange={(e) => setFormData({ ...formData, recurrence_day_of_month: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    >
                      <option value="">Выберите день месяца</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Дата появления</label>
                    <input
                      type="datetime-local"
                      value={formData.appear_date || ''}
                      onChange={(e) => setFormData({ ...formData, appear_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {formData.recurrence !== 'none' ? 'Дедлайн (время)' : 'Дедлайн'}
                    </label>
                    {formData.recurrence !== 'none' ? (
                      <input
                        type="time"
                        value={toTimeFormat(formData.deadline)}
                        onChange={(e) => {
                          const time = e.target.value;
                          if (time) {
                            // Use appear_date as base if available, otherwise today
                            const baseDate = formData.appear_date ? new Date(formData.appear_date) : new Date();
                            const [hours, minutes] = time.split(':').map(Number);
                            baseDate.setHours(hours, minutes, 0, 0);
                            // Format to YYYY-MM-DDTHH:mm for datetime-local compatibility/backend
                            const year = baseDate.getFullYear();
                            const month = String(baseDate.getMonth() + 1).padStart(2, '0');
                            const day = String(baseDate.getDate()).padStart(2, '0');
                            const formattedDate = `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                            setFormData({ ...formData, deadline: formattedDate });
                          } else {
                            setFormData({ ...formData, deadline: undefined });
                          }
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      />
                    ) : (
                      <input
                        type="datetime-local"
                        value={formData.deadline || ''}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      />
                    )}
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <TaskNotificationSettings
                    value={formData.notification_settings || {}}
                    onChange={(settings) => setFormData({ ...formData, notification_settings: settings })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Получатели</label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    {!formData.dealership_id ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Сначала выберите автосалон
                      </p>
                    ) : isLoadingUsers ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Загрузка сотрудников...
                      </p>
                    ) : usersData?.data.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        В этом салоне нет сотрудников
                      </p>
                    ) : (
                      usersData?.data.map((user) => (
                        <div key={user.id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={formData.assignments?.includes(user.id)}
                            onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor={`user-${user.id}`} className="ml-2 text-sm text-gray-700">
                            {user.full_name} ({getRoleLabel(user.role)})
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {task ? 'Сохранить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Отмена
              </button>
            </div>

            {(createMutation.isError || updateMutation.isError) && (
              <div className="px-4 pb-4">
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">
                    Ошибка: {(createMutation.error as any)?.response?.data?.message || 'Неизвестная ошибка'}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
