import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../api/tasks';
import { usersApi } from '../../api/users';
import { DealershipSelector } from '../common/DealershipSelector';
import type { Task, CreateTaskRequest, TaskRecurrence, TaskType, ResponseType } from '../../types/task';

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

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers({ per_page: 100 }),
  });

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
        appear_date: task.appear_date || undefined,
        deadline: task.deadline || undefined,
        dealership_id: task.dealership_id,
        tags: task.tags,
        assignments: task.assignments?.map(a => a.user_id) || [],
      });
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
      });
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
    if (task) {
      updateMutation.mutate(formData as Partial<CreateTaskRequest>);
    } else {
      createMutation.mutate(formData as CreateTaskRequest);
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
                    onChange={(dealershipId) => setFormData({ ...formData, dealership_id: dealershipId || undefined })}
                    placeholder="Выберите автосалон"
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Повторяемость</label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as TaskRecurrence })}
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
                      value={formData.recurrence_time || ''}
                      onChange={(e) => setFormData({ ...formData, recurrence_time: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
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
                    <label className="block text-sm font-medium text-gray-700">Дедлайн</label>
                    <input
                      type="datetime-local"
                      value={formData.deadline || ''}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Получатели</label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    {usersData?.data.map((user) => (
                      <div key={user.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={formData.assignments?.includes(user.id)}
                          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`user-${user.id}`} className="ml-2 text-sm text-gray-700">
                          {user.full_name} ({user.role})
                        </label>
                      </div>
                    ))}
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
