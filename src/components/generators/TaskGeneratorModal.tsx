import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { taskGeneratorsApi } from '../../api/taskGenerators';
import { usersApi } from '../../api/users';
import { DealershipSelector } from '../common/DealershipSelector';
import { TaskNotificationSettings } from '../tasks/TaskNotificationSettings';
import type { TaskGenerator, CreateTaskGeneratorRequest, GeneratorRecurrence } from '../../types/taskGenerator';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TaskGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  generator: TaskGenerator | null;
}

export const TaskGeneratorModal: React.FC<TaskGeneratorModalProps> = ({
  isOpen,
  onClose,
  generator,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!generator;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    comment: '',
    dealership_id: null as number | null,
    recurrence: 'daily' as GeneratorRecurrence,
    recurrence_time: '09:00',
    deadline_time: '18:00',
    recurrence_day_of_week: 1,
    recurrence_day_of_month: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    task_type: 'individual' as 'individual' | 'group',
    response_type: 'acknowledge' as 'acknowledge' | 'complete',
    priority: 'medium' as 'low' | 'medium' | 'high',
    tags: '',
    assignments: [] as number[],
    notification_settings: {} as Record<string, { enabled?: boolean; offset?: number }>,
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', formData.dealership_id],
    queryFn: () => usersApi.getUsers({ dealership_id: formData.dealership_id || undefined, per_page: 100 }),
    enabled: !!formData.dealership_id,
  });

  useEffect(() => {
    if (generator) {
      setFormData({
        title: generator.title,
        description: generator.description || '',
        comment: generator.comment || '',
        dealership_id: generator.dealership_id,
        recurrence: generator.recurrence,
        recurrence_time: generator.recurrence_time?.slice(0, 5) || '09:00',
        deadline_time: generator.deadline_time?.slice(0, 5) || '18:00',
        recurrence_day_of_week: generator.recurrence_day_of_week || 1,
        recurrence_day_of_month: generator.recurrence_day_of_month || 1,
        start_date: generator.start_date?.split('T')[0] || '',
        end_date: generator.end_date?.split('T')[0] || '',
        task_type: generator.task_type,
        response_type: generator.response_type,
        priority: generator.priority,
        tags: generator.tags?.join(', ') || '',
        assignments: generator.assignments?.map((a) => a.user?.id).filter(Boolean) as number[] || [],
        notification_settings: generator.notification_settings || {},
      });
    } else {
      setFormData({
        title: '',
        description: '',
        comment: '',
        dealership_id: null,
        recurrence: 'daily',
        recurrence_time: '09:00',
        deadline_time: '18:00',
        recurrence_day_of_week: 1,
        recurrence_day_of_month: 1,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        task_type: 'individual',
        response_type: 'acknowledge',
        priority: 'medium',
        tags: '',
        assignments: [],
        notification_settings: {},
      });
    }
  }, [generator, isOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskGeneratorRequest) => taskGeneratorsApi.createGenerator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTaskGeneratorRequest> }) =>
      taskGeneratorsApi.updateGenerator(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-generators'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateTaskGeneratorRequest = {
      title: formData.title,
      description: formData.description || undefined,
      comment: formData.comment || undefined,
      dealership_id: formData.dealership_id!,
      recurrence: formData.recurrence,
      recurrence_time: formData.recurrence_time,
      deadline_time: formData.deadline_time,
      recurrence_day_of_week: formData.recurrence === 'weekly' ? formData.recurrence_day_of_week : undefined,
      recurrence_day_of_month: formData.recurrence === 'monthly' ? formData.recurrence_day_of_month : undefined,
      start_date: formData.start_date,
      end_date: formData.end_date || undefined,
      task_type: formData.task_type,
      response_type: formData.response_type,
      priority: formData.priority,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      assignments: formData.assignments,
      notification_settings: Object.keys(formData.notification_settings).length > 0 ? formData.notification_settings : undefined,
    };

    if (isEditing && generator) {
      updateMutation.mutate({ id: generator.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleUserToggle = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      assignments: prev.assignments.includes(userId)
        ? prev.assignments.filter((id) => id !== userId)
        : [...prev.assignments, userId],
    }));
  };

  if (!isOpen) return null;

  const users = usersData?.data || [];
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-6 pt-5 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Редактировать генератор' : 'Создать генератор'}
                </h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Название *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Название генератора"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Описание</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Описание задачи"
                  />
                </div>

                {/* Dealership */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Автосалон *</label>
                  <DealershipSelector
                    value={formData.dealership_id}
                    onChange={(id) => setFormData({ ...formData, dealership_id: id, assignments: [] })}
                    showAllOption={false}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Recurrence */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Повторяемость</label>
                    <select
                      value={formData.recurrence}
                      onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as GeneratorRecurrence })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="daily">Ежедневно</option>
                      <option value="weekly">Еженедельно</option>
                      <option value="monthly">Ежемесячно</option>
                    </select>
                  </div>

                  {formData.recurrence === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">День недели</label>
                      <select
                        value={formData.recurrence_day_of_week}
                        onChange={(e) => setFormData({ ...formData, recurrence_day_of_week: Number(e.target.value) })}
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={1}>Понедельник</option>
                        <option value={2}>Вторник</option>
                        <option value={3}>Среда</option>
                        <option value={4}>Четверг</option>
                        <option value={5}>Пятница</option>
                        <option value={6}>Суббота</option>
                        <option value={7}>Воскресенье</option>
                      </select>
                    </div>
                  )}

                  {formData.recurrence === 'monthly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">День месяца</label>
                      <input
                        type="number"
                        min={-2}
                        max={31}
                        value={formData.recurrence_day_of_month}
                        onChange={(e) => setFormData({ ...formData, recurrence_day_of_month: Number(e.target.value) })}
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">-1 = последний день, -2 = предпоследний</p>
                    </div>
                  )}
                </div>

                {/* Times */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Время появления</label>
                    <input
                      type="time"
                      value={formData.recurrence_time}
                      onChange={(e) => setFormData({ ...formData, recurrence_time: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Дедлайн</label>
                    <input
                      type="time"
                      value={formData.deadline_time}
                      onChange={(e) => setFormData({ ...formData, deadline_time: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Дата начала *</label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Дата окончания</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Оставьте пустым для бессрочного</p>
                  </div>
                </div>

                {/* Type & Priority */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тип задачи</label>
                    <select
                      value={formData.task_type}
                      onChange={(e) => setFormData({ ...formData, task_type: e.target.value as 'individual' | 'group' })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="individual">Индивидуальная</option>
                      <option value="group">Групповая</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тип ответа</label>
                    <select
                      value={formData.response_type}
                      onChange={(e) => setFormData({ ...formData, response_type: e.target.value as 'acknowledge' | 'complete' })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="acknowledge">Уведомление</option>
                      <option value="complete">Выполнение</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Приоритет</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Теги</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="тег1, тег2, тег3"
                  />
                </div>

                {/* Assignments */}
                {formData.dealership_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Исполнители * ({formData.assignments.length} выбрано)
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto p-2 bg-white dark:bg-gray-700">
                      {users.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 p-2">Нет сотрудников</p>
                      ) : (
                        users.map((user) => (
                          <label key={user.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.assignments.includes(user.id)}
                              onChange={() => handleUserToggle(user.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-900 dark:text-white">{user.full_name}</span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({user.role})</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                <div>
                  <TaskNotificationSettings
                    value={formData.notification_settings}
                    onChange={(settings) => setFormData({ ...formData, notification_settings: settings })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isPending || !formData.dealership_id || formData.assignments.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
