import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftsApi } from '../api/shifts';
import type { CreateShiftRequest, UpdateShiftRequest, ShiftsFilters } from '../types/shift';

// Hook for getting all shifts
export const useShifts = (filters?: ShiftsFilters) => {
  return useQuery({
    queryKey: ['shifts', filters],
    queryFn: () => shiftsApi.getShifts(filters),
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
};

// Hook for getting a single shift
export const useShift = (id: number) => {
  return useQuery({
    queryKey: ['shift', id],
    queryFn: () => shiftsApi.getShift(id),
    enabled: !!id,
  });
};

// Hook for getting current shifts
export const useCurrentShifts = () => {
  return useQuery({
    queryKey: ['shifts', 'current'],
    queryFn: () => shiftsApi.getCurrentShifts(),
    refetchInterval: 15000, // Refetch every 15 seconds for live updates
  });
};

// Hook for getting shifts statistics
export const useShiftsStatistics = (filters?: {
  dealership_id?: number;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['shifts', 'statistics', filters],
    queryFn: () => shiftsApi.getStatistics(filters),
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook for getting current user's shifts
export const useMyShifts = (filters?: ShiftsFilters) => {
  return useQuery({
    queryKey: ['my-shifts', filters],
    queryFn: () => shiftsApi.getMyShifts(filters),
    refetchInterval: 30000,
  });
};

// Hook for getting current user's current shift
export const useMyCurrentShift = (dealershipId?: number) => {
  return useQuery({
    queryKey: ['my-shift', 'current', dealershipId],
    queryFn: () => shiftsApi.getMyCurrentShift(dealershipId),
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: !!dealershipId, // Only fetch if dealershipId is provided
  });
};

// Hook for creating a shift
export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShiftRequest) => shiftsApi.createShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['my-shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shifts', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['my-shift', 'current'] });
    },
  });
};

// Hook for updating a shift
export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShiftRequest }) =>
      shiftsApi.updateShift(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['my-shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['shifts', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['my-shift', 'current'] });
    },
  });
};

// Hook for deleting a shift
export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shiftsApi.deleteShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['my-shifts'] });
    },
  });
};
