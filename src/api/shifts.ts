import apiClient from './client';
import type { Shift, CreateShiftRequest, UpdateShiftRequest, ShiftsFilters } from '../types/shift';
import type { PaginatedResponse } from '../types/api';

export const shiftsApi = {
  // Get all shifts with filters and pagination
  getShifts: async (filters?: ShiftsFilters): Promise<PaginatedResponse<Shift>> => {
    const response = await apiClient.get<PaginatedResponse<Shift>>('/shifts', {
      params: filters,
    });
    return response.data;
  },

  // Get shift by ID
  getShift: async (id: number): Promise<{ data: Shift }> => {
    const response = await apiClient.get<{ data: Shift }>(`/shifts/${id}`);
    return response.data;
  },

  // Get current open shifts
  getCurrentShifts: async (): Promise<{ data: Shift[] }> => {
    const response = await apiClient.get<{ data: Shift[] }>('/shifts/current');
    return response.data;
  },

  // Get shifts statistics
  getStatistics: async (filters?: {
    dealership_id?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<any> => {
    const response = await apiClient.get('/shifts/statistics', {
      params: filters,
    });
    return response.data;
  },

  // Get current user's shifts
  getMyShifts: async (filters?: ShiftsFilters): Promise<PaginatedResponse<Shift>> => {
    const response = await apiClient.get<PaginatedResponse<Shift>>('/shifts/my', {
      params: filters,
    });
    return response.data;
  },

  // Get current user's current shift
  getMyCurrentShift: async (): Promise<{ data: Shift }> => {
    const response = await apiClient.get<{ data: Shift }>('/shifts/my/current');
    return response.data;
  },

  // Create new shift
  createShift: async (data: CreateShiftRequest): Promise<{ data: Shift }> => {
    const formData = new FormData();
    formData.append('user_id', data.user_id.toString());
    formData.append('dealership_id', data.dealership_id.toString());
    formData.append('opening_photo', data.opening_photo);

    if (data.replacement_user_id) {
      formData.append('replacement_user_id', data.replacement_user_id.toString());
    }
    if (data.replacement_reason) {
      formData.append('replacement_reason', data.replacement_reason);
    }

    const response = await apiClient.post<{ data: Shift }>('/shifts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update shift (close or change status)
  updateShift: async (id: number, data: UpdateShiftRequest): Promise<{ data: Shift }> => {
    if (data.closing_photo) {
      const formData = new FormData();
      formData.append('closing_photo', data.closing_photo);

      if (data.status) {
        formData.append('status', data.status);
      }
      if (data.break_duration !== undefined) {
        formData.append('break_duration', data.break_duration.toString());
      }

      const response = await apiClient.put<{ data: Shift }>(`/shifts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await apiClient.put<{ data: Shift }>(`/shifts/${id}`, data);
      return response.data;
    }
  },

  // Delete shift (only completed shifts)
  deleteShift: async (id: number): Promise<void> => {
    await apiClient.delete(`/shifts/${id}`);
  },
};
