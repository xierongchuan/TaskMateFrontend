import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { format } from 'date-fns';
import { tasksApi } from '../../api/tasks';
import { usersApi } from '../../api/users';
import { DealershipSelector } from '../common/DealershipSelector';
import { UserCheckboxList } from '../common/UserCheckboxList';
import { TaskNotificationSettings } from './TaskNotificationSettings';
import {
  TASK_PRIORITIES,
  TASK_TYPES,
  RESPONSE_TYPES,
  TASK_PRIORITY_LABELS,
  TASK_TYPE_LABELS,
  RESPONSE_TYPE_LABELS
} from '../../constants/tasks';
import type { Task, CreateTaskRequest, ApiErrorResponse } from '../../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  // Use React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateTaskRequest>({
    defaultValues: {
      title: '',
      description: '',
      comment: '',
      task_type: TASK_TYPES.INDIVIDUAL,
      response_type: RESPONSE_TYPES.ACKNOWLEDGE,
      dealership_id: undefined,
      assignments: [],
      priority: TASK_PRIORITIES.MEDIUM,
      tags: [],
      appear_date: undefined,
      deadline: undefined
    }
  });

  // Watch dealership_id to fetch users
  const dealershipId = watch('dealership_id');
  const assignments = watch('assignments') || []; // Ensure array

  // Local state for tags input string
  const [tagsInput, setTagsInput] = useState('');

  // Fetch users for the selected dealership
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['task-modal-users', dealershipId],
    queryFn: () => usersApi.getUsers({
      per_page: 100, // Fetch all users (reasonably)
      dealership_id: dealershipId
    }),
    enabled: !!dealershipId,
    staleTime: 1000 * 60, // 1 minute cache
  });

  // Reset form when task prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Edit mode
        reset({
          title: task.title,
          description: task.description || '',
          comment: task.comment || '',
          task_type: task.task_type,
          response_type: task.response_type,
          // Format dates for datetime-local input
          appear_date: task.appear_date ? format(new Date(task.appear_date), "yyyy-MM-dd'T'HH:mm") : undefined,
          deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : undefined,
          dealership_id: task.dealership_id,
          assignments: task.assignments?.map(a => a.user.id) || [],
          notification_settings: task.notification_settings,
          priority: task.priority,
          tags: task.tags || []
        });
        setTagsInput(task.tags ? task.tags.join(', ') : '');
      } else {
        // Create mode
        reset({
          title: '',
          description: '',
          comment: '',
          task_type: TASK_TYPES.INDIVIDUAL,
          response_type: RESPONSE_TYPES.ACKNOWLEDGE,
          dealership_id: undefined,
          assignments: [],
          notification_settings: {},
          priority: TASK_PRIORITIES.MEDIUM,
          tags: [],
          appear_date: undefined,
          deadline: undefined
        });
        setTagsInput('');
      }
      setServerError(null);
    }
  }, [isOpen, task, reset]);

  // Handle dealership change side effects
  // We use a useEffect to detect change if we wanted to clear assignments,
  // BUT be careful not to clear on initial load.
  // Better approach: In the Controller onChange for dealership, clear assignments there.

  /**
   * Обработка ошибок API с учётом error_type.
   */
  const handleApiError = (error: any, defaultMessage: string): void => {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    const errorType = errorData?.error_type;
    const message = errorData?.message;

    if (errorType === 'duplicate_task') {
      setServerError('Такая задача уже существует. Измените название или параметры.');
    } else if (errorType === 'access_denied') {
      setServerError('У вас нет доступа для выполнения этого действия.');
    } else {
      setServerError(message || defaultMessage);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Invalidate generator stats when task is created
      queryClient.invalidateQueries({ queryKey: ['generator-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
      onClose();
    },
    onError: (error: any) => {
      handleApiError(error, 'Ошибка при создании задачи');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateTaskRequest>) => tasksApi.updateTask(task!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Invalidate generator stats when task is updated
      queryClient.invalidateQueries({ queryKey: ['generator-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
      onClose();
    },
    onError: (error: any) => {
      handleApiError(error, 'Ошибка при обновлении задачи');
    },
  });

  const onSubmit: SubmitHandler<CreateTaskRequest> = (data) => {
    setServerError(null);

    // Process tags
    const processedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const finalData = {
      ...data,
      tags: processedTags
    };

    if (task?.id) {
      updateMutation.mutate(finalData);
    } else {
      createMutation.mutate(finalData);
    }
  };

  const handleUserToggle = (userId: number) => {
    const currentAssignments = assignments as number[];
    const newAssignments = currentAssignments.includes(userId)
      ? currentAssignments.filter(id => id !== userId)
      : [...currentAssignments, userId];
    setValue('assignments', newAssignments, { shouldValidate: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                {task?.id ? 'Редактировать задачу' : 'Создать задачу'}
              </h3>

              {serverError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{serverError}</span>
                </div>
              )}

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Название *</label>
                  <input
                    type="text"
                    {...register('title', { required: 'Название обязательно' })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
                  <textarea
                    rows={3}
                    {...register('description')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Комментарий</label>
                  <textarea
                    rows={2}
                    {...register('comment')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Теги (через запятую)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="срочно, важно, backend"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Приоритет</label>
                  <select
                    {...register('priority')}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Task Type and Response Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тип задачи</label>
                    <select
                      {...register('task_type')}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Тип ответа</label>
                    <select
                      {...register('response_type')}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {Object.entries(RESPONSE_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dealership */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Автосалон *</label>
                  <Controller
                    name="dealership_id"
                    control={control}
                    rules={{ required: 'Автосалон обязателен' }}
                    render={({ field }) => (
                      <DealershipSelector
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // Clear assignments when dealership changes
                          setValue('assignments', []);
                        }}
                        showAllOption={false}
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required={true}
                      />
                    )}
                  />
                  {errors.dealership_id && <span className="text-red-500 text-xs">{errors.dealership_id.message}</span>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Дата появления</label>
                    <input
                      type="datetime-local"
                      {...register('appear_date')}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Дедлайн</label>
                    <input
                      type="datetime-local"
                      {...register('deadline')}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <Controller
                    name="notification_settings"
                    control={control}
                    render={({ field }) => (
                      <TaskNotificationSettings
                        value={field.value || {}}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Assignments */}
                <UserCheckboxList
                  users={usersData?.data || []}
                  selectedIds={assignments as number[]}
                  onToggle={handleUserToggle}
                  isLoading={isLoadingUsers}
                  noDealership={!dealershipId}
                  label="Получатели"
                  emptyMessage="В этом салоне нет сотрудников"
                  maxHeight="max-h-48"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
