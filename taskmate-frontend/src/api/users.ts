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
    const response = await apiClient.get<PaginatedResponse<User>>('/users', {
      params: filters,
    });
    return response.data;
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
};
