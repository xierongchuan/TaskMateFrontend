import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings';
import type {
  CreateSettingRequest,
  UpdateSettingRequest,
  UpdateShiftConfigRequest,
  UpdateBotConfigRequest
} from '../types/setting';

// Hook for getting all settings
export const useSettings = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['settings', dealershipId],
    queryFn: () => settingsApi.getSettings(dealershipId),
  });
};

// Hook for getting a setting by key
export const useSetting = (key: string) => {
  return useQuery({
    queryKey: ['setting', key],
    queryFn: () => settingsApi.getSettingByKey(key),
    enabled: !!key,
  });
};

// Hook for getting shift configuration
export const useShiftConfig = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['settings', 'shift-config', dealershipId],
    queryFn: () => settingsApi.getShiftConfig(dealershipId),
  });
};

// Hook for getting bot configuration
export const useBotConfig = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['settings', 'bot-config', dealershipId],
    queryFn: () => settingsApi.getBotConfig(dealershipId),
  });
};

// Hook for dealership-specific settings (legacy compatibility)
export const useDealershipSettings = (dealershipId: number) => {
  return useQuery({
    queryKey: ['settings', 'dealership', dealershipId],
    queryFn: () => settingsApi.getDealershipBotConfig(dealershipId),
    enabled: !!dealershipId,
  });
};

// Hook for creating a setting
export const useCreateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSettingRequest) => settingsApi.createSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
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

// Hook for deleting a setting
export const useDeleteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => settingsApi.deleteSetting(id),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'bot-config'] });
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

// Utility hooks
export const useClearOldTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsApi.clearOldTasks(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useTestBotConnection = () => {
  return useMutation({
    mutationFn: () => settingsApi.testBotConnection(),
  });
};

export const useExportSettings = () => {
  return useMutation({
    mutationFn: () => settingsApi.exportSettings(),
  });
};

export const useImportSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => settingsApi.importSettings(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useResetSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsApi.resetSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};