import apiClient from './client';
import type { Shift } from '../types/shift';
import type { PaginatedResponse } from '../types/api';

export interface ShiftsFilters {
  user_id?: number;
  dealership_id?: number;
  status?: string;
  is_late?: boolean;
  per_page?: number;
  page?: number;
}

export const shiftsApi = {
  getShifts: async (filters?: ShiftsFilters): Promise<PaginatedResponse<Shift>> => {
    const response = await apiClient.get<PaginatedResponse<Shift>>('/shifts', {
      params: filters,
    });
    return response.data;
  },

  getCurrentShifts: async (): Promise<Shift[]> => {
    const response = await apiClient.get<Shift[]>('/shifts/current');
    return response.data;
  },

  getStatistics: async (): Promise<any> => {
    const response = await apiClient.get('/shifts/statistics');
    return response.data;
  },
};
