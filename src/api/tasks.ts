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
  per_page?: number;
  page?: number;
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

  updateTaskStatus: async (id: number, status: string): Promise<{ data: Task }> => {
    const response = await apiClient.patch<{ data: Task }>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  duplicateTask: async (id: number): Promise<{ data: Task }> => {
    const response = await apiClient.post<{ data: Task }>(`/tasks/${id}/duplicate`);
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
    postponed: number;
  }> => {
    const response = await apiClient.get('/tasks/stats', { params: filters });
    return response.data;
  },
};
