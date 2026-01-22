import apiClient from './client';
import type {
  Setting,
  BotConfig,
  ShiftConfig,
  TaskConfig,
  DealershipBotConfig,
  DealershipSettingsResponse,
  UpdateSettingRequest,
  UpdateShiftConfigRequest,
  UpdateBotConfigRequest,
  UpdateTaskConfigRequest
} from '../types/setting';

export const settingsApi = {
  // Basic settings operations
  getSettings: async (dealershipId?: number): Promise<{ data: Setting[] }> => {
    const response = await apiClient.get<{ data: Setting[] }>('/settings', {
      params: dealershipId ? { dealership_id: dealershipId } : {},
    });
    return response.data;
  },

  getSettingByKey: async (key: string): Promise<{ data: Setting }> => {
    const response = await apiClient.get<{ data: Setting }>(`/settings/${key}`);
    return response.data;
  },

  updateSettingById: async (id: number, data: UpdateSettingRequest): Promise<{ data: Setting }> => {
    const response = await apiClient.put<{ data: Setting }>(`/settings/${id}`, data);
    return response.data;
  },

  // Shift Configuration
  getShiftConfig: async (dealershipId?: number): Promise<{ data: ShiftConfig }> => {
    const response = await apiClient.get<{ data: ShiftConfig }>('/settings/shift-config', {
      params: dealershipId ? { dealership_id: dealershipId } : {},
    });
    return response.data;
  },

  updateShiftConfig: async (data: UpdateShiftConfigRequest): Promise<{ data: ShiftConfig }> => {
    const response = await apiClient.post<{ data: ShiftConfig }>('/settings/shift-config', data);
    return response.data;
  },

  // Bot Configuration
  getBotConfig: async (dealershipId?: number): Promise<{ data: BotConfig }> => {
    const response = await apiClient.get<{ data: BotConfig }>('/settings/bot-config', {
      params: dealershipId ? { dealership_id: dealershipId } : {},
    });
    return response.data;
  },

  updateBotConfig: async (data: UpdateBotConfigRequest): Promise<{ data: BotConfig }> => {
    const response = await apiClient.put<{ data: BotConfig }>('/settings/bot-config', data);
    return response.data;
  },

  // Task Configuration (shift requirements, archiving)
  getTaskConfig: async (dealershipId?: number): Promise<{ data: TaskConfig }> => {
    const response = await apiClient.get<{ data: TaskConfig }>('/settings/task-config', {
      params: dealershipId ? { dealership_id: dealershipId } : {},
    });
    return response.data;
  },

  updateTaskConfig: async (data: UpdateTaskConfigRequest): Promise<{ data: TaskConfig }> => {
    const response = await apiClient.put<{ data: TaskConfig }>('/settings/task-config', data);
    return response.data;
  },

  // Legacy methods for backward compatibility
  // Dealership-specific settings (using new shift config endpoints)
  getDealershipBotConfig: async (dealershipId: number): Promise<DealershipSettingsResponse> => {
    if (!dealershipId) {
      throw new Error('Dealership ID is required');
    }

    const dealershipConfig = await apiClient.get<{ data: ShiftConfig }>(`/settings/shift-config${dealershipId ? `?dealership_id=${dealershipId}` : ''}`);
    const globalConfig = await apiClient.get<{ data: ShiftConfig }>('/settings/shift-config');

    // Determine which fields are inherited (not set for dealership)
    const inheritedFields: (keyof DealershipBotConfig)[] = [];
    if (!dealershipConfig.data.data.shift_1_start_time) inheritedFields.push('shift_1_start_time');
    if (!dealershipConfig.data.data.shift_1_end_time) inheritedFields.push('shift_1_end_time');
    if (!dealershipConfig.data.data.late_tolerance_minutes) inheritedFields.push('late_tolerance_minutes');

    return {
      dealership_id: dealershipId,
      settings: dealershipConfig.data.data,
      global_settings: globalConfig.data.data as BotConfig,
      inherited_fields: inheritedFields,
    };
  },

  updateDealershipBotConfig: async (data: UpdateShiftConfigRequest): Promise<any> => {
    const response = await apiClient.post<DealershipBotConfig>(`/settings/shift-config/${data.dealership_id}`, data);
    return response.data;
  },

  resetDealershipToGlobal: async (dealershipId: number): Promise<void> => {
    // This would need to be implemented on backend side
    // For now, we can update with empty values to reset
    await apiClient.post('/settings/shift-config', {
      dealership_id: dealershipId,
      shift_1_start_time: undefined,
      shift_1_end_time: undefined,
      late_tolerance_minutes: undefined,
    });
  },
};
