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
};
