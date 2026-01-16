import apiClient from './client';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';
import type { PaginatedResponse } from '../types/api';

export interface UsersFilters {
  search?: string;
  login?: string;
  name?: string;
  role?: string;
  dealership_id?: number;
  phone?: string;
  per_page?: number;
  page?: number;
}

export const usersApi = {
  getUsers: async (filters?: UsersFilters): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<{
      data: User[];
      links: any;
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>('/users', {
      params: filters,
    });

    // Convert API response to PaginatedResponse format
    return {
      data: response.data.data,
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      per_page: response.data.meta.per_page,
      total: response.data.meta.total,
    };
  },

  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<{ data: User }> => {
    const response = await apiClient.post<{ data: User }>('/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<{ data: User }> => {
    const response = await apiClient.put<{ data: User }>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  getDealerships: async (): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>('/dealerships');
    return response.data;
  },

  getUserStats: async (filters?: UsersFilters): Promise<{
    total: number;
    by_role: Record<string, number>;
    active_today: number;

  }> => {
    const response = await apiClient.get('/users/stats', { params: filters });
    return response.data;
  },

  getUserReplacementHistory: async (userId?: number, filters?: {
    date_from?: string;
    date_to?: string;
  }): Promise<any[]> => {
    const response = await apiClient.get('/users/replacement-history', {
      params: { user_id: userId, ...filters }
    });
    return response.data;
  },

  bulkUpdateRole: async (userIds: number[], role: string): Promise<void> => {
    await apiClient.post('/users/bulk-update-role', { user_ids: userIds, role });
  },


};
