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

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
