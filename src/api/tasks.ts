import apiClient from './client';
import type { Task, CreateTaskRequest } from '../types/task';
import type { PaginatedResponse } from '../types/api';

export interface TasksFilters {
  search?: string;
  status?: string;
  recurrence?: string;
  task_type?: string;
  response_type?: string;
  dealership_id?: number;
  created_by?: number;
  assigned_to?: number;
  per_page?: number;
  page?: number;
  priority?: string;
}

export const tasksApi = {
  getTasks: async (filters?: TasksFilters): Promise<PaginatedResponse<Task>> => {
    const response = await apiClient.get<PaginatedResponse<Task>>('/tasks', {
      params: filters,
    });
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskRequest): Promise<{ data: Task }> => {
    const response = await apiClient.post<{ data: Task }>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: Partial<CreateTaskRequest>): Promise<{ data: Task }> => {
    const response = await apiClient.put<{ data: Task }>(`/tasks/${id}`, data);
    return response.data;
  },

  updateTaskStatus: async (id: number, status: string, completeForAll?: boolean): Promise<{ data: Task }> => {
    const payload: { status: string; complete_for_all?: boolean } = { status };
    if (completeForAll !== undefined) {
      payload.complete_for_all = completeForAll;
    }
    const response = await apiClient.patch<{ data: Task }>(`/tasks/${id}/status`, payload);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  bulkUpdateStatus: async (taskIds: number[], status: string): Promise<void> => {
    await apiClient.post('/tasks/bulk-update-status', { task_ids: taskIds, status });
  },

  getTaskStats: async (filters?: TasksFilters): Promise<{
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    acknowledged: number;
  }> => {
    const response = await apiClient.get('/tasks/stats', { params: filters });
    return response.data;
  },
};
