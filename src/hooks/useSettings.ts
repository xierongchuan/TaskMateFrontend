import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings';
import type {
  UpdateSettingRequest,
  UpdateShiftConfigRequest,
  UpdateBotConfigRequest,
  UpdateTaskConfigRequest
} from '../types/setting';

// Hook for getting all settings
export const useSettings = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['settings', dealershipId],
    queryFn: () => settingsApi.getSettings(dealershipId),
    placeholderData: (prev) => prev,
  });
};

// Hook for getting a setting by key
export const useSetting = (key: string) => {
  return useQuery({
    queryKey: ['setting', key],
    queryFn: () => settingsApi.getSettingByKey(key),
    enabled: !!key,
    placeholderData: (prev) => prev,
  });
};

// Hook for getting shift configuration
export const useShiftConfig = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['settings', 'shift-config', dealershipId],
    queryFn: () => settingsApi.getShiftConfig(dealershipId),
    placeholderData: (prev) => prev,
  });
};

// Hook for getting bot configuration
export const useBotConfig = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['settings', 'bot-config', dealershipId],
    queryFn: () => settingsApi.getBotConfig(dealershipId),
    placeholderData: (prev) => prev,
  });
};

// Hook for getting task configuration (shift requirements, archiving)
export const useTaskConfig = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['settings', 'task-config', dealershipId],
    queryFn: () => settingsApi.getTaskConfig(dealershipId),
    placeholderData: (prev) => prev,
  });
};

// Hook for dealership-specific settings (legacy compatibility)
export const useDealershipSettings = (dealershipId: number) => {
  return useQuery({
    queryKey: ['settings', 'dealership', dealershipId],
    queryFn: () => settingsApi.getDealershipBotConfig(dealershipId),
    enabled: !!dealershipId,
    placeholderData: (prev) => prev,
  });
};

// Hook for updating a setting
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSettingRequest }) =>
      settingsApi.updateSettingById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Hook for updating shift configuration
export const useUpdateShiftConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateShiftConfigRequest) => settingsApi.updateShiftConfig(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'shift-config'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'shift-config', variables.dealership_id] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'dealership', variables.dealership_id] });
    },
  });
};

// Hook for updating bot configuration
export const useUpdateBotConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBotConfigRequest) => settingsApi.updateBotConfig(data),
    onSuccess: (_, variables) => {
      // Инвалидируем все запросы bot-config
      queryClient.invalidateQueries({ queryKey: ['settings', 'bot-config'] });
      if (variables.dealership_id) {
        queryClient.invalidateQueries({ queryKey: ['settings', 'bot-config', variables.dealership_id] });
      }
    },
  });
};

// Hook for updating task configuration
export const useUpdateTaskConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskConfigRequest) => settingsApi.updateTaskConfig(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'task-config'] });
      if (variables.dealership_id) {
        queryClient.invalidateQueries({ queryKey: ['settings', 'task-config', variables.dealership_id] });
      }
    },
  });
};

// Hook for updating dealership settings (legacy compatibility)
export const useUpdateDealershipSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateShiftConfigRequest) => settingsApi.updateDealershipBotConfig(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'shift-config'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'shift-config', variables.dealership_id] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'dealership', variables.dealership_id] });
    },
  });
};

// Hook for resetting dealership settings to global
export const useResetDealershipSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dealershipId: number) => settingsApi.resetDealershipToGlobal(dealershipId),
    onSuccess: (_, dealershipId) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'shift-config'] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'shift-config', dealershipId] });
      queryClient.invalidateQueries({ queryKey: ['settings', 'dealership', dealershipId] });
    },
  });
};
