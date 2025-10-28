import apiClient from './client';
import type { Setting, BotConfig } from '../types/setting';

export const settingsApi = {
  getSettings: async (): Promise<Setting[]> => {
    const response = await apiClient.get<Setting[]>('/settings');
    return response.data;
  },

  createSetting: async (data: { key: string; value: string; description?: string }): Promise<{ data: Setting }> => {
    const response = await apiClient.post<{ data: Setting }>('/settings', data);
    return response.data;
  },

  getBotConfig: async (): Promise<BotConfig> => {
    const response = await apiClient.get<BotConfig>('/settings/bot-config');
    return response.data;
  },

  updateBotConfig: async (data: BotConfig): Promise<BotConfig> => {
    const response = await apiClient.post<BotConfig>('/settings/bot-config', data);
    return response.data;
  },

  clearOldTasks: async (): Promise<void> => {
    await apiClient.post('/settings/clear-old-tasks');
  },

  testBotConnection: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post('/settings/test-bot');
    return response.data;
  },

  exportSettings: async (): Promise<Blob> => {
    const response = await apiClient.get('/settings/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  importSettings: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await apiClient.post('/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  resetSettings: async (): Promise<void> => {
    await apiClient.post('/settings/reset');
  },
};
