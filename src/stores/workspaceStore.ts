import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

interface WorkspaceState {
  selectedDealershipId: number | null;
  hasInitialized: boolean;
  setDealership: (id: number | null) => void;
  initializeWorkspace: (user: User, availableDealerships: { id: number; name: string }[]) => void;
  validateAndUpdateWorkspace: (user: User, availableDealerships: { id: number; name: string }[]) => void;
  resetWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      selectedDealershipId: null,
      hasInitialized: false,

      setDealership: (id: number | null) => {
        set({ selectedDealershipId: id });
      },

      initializeWorkspace: (user: User, availableDealerships: { id: number; name: string }[]) => {
        const state = get();

        // Если уже инициализировано - только валидируем
        if (state.hasInitialized && state.selectedDealershipId !== null) {
          // Проверяем что сохраненный автосалон доступен
          const isValid = availableDealerships.some(d => d.id === state.selectedDealershipId);
          if (isValid) {
            return; // Все ок, оставляем как есть
          }
          // Иначе сбрасываем на первый доступный
        }

        let dealershipId: number | null = null;

        // Employee - всегда основной автосалон
        if (user.role === 'employee') {
          dealershipId = user.dealership_id;
        }
        // Для остальных ролей - первый из доступных или сохраненный
        else if (availableDealerships.length > 0) {
          // Если есть сохраненный и он доступен - используем его
          if (state.selectedDealershipId !== null) {
            const isValid = availableDealerships.some(d => d.id === state.selectedDealershipId);
            if (isValid) {
              dealershipId = state.selectedDealershipId;
            } else {
              // Fallback на первый
              dealershipId = availableDealerships[0].id;
            }
          } else {
            // Первый из доступных
            dealershipId = availableDealerships[0].id;
          }
        }

        set({
          selectedDealershipId: dealershipId,
          hasInitialized: true
        });
      },

      validateAndUpdateWorkspace: (user: User, availableDealerships: { id: number; name: string }[]) => {
        const state = get();

        // Для employee всегда основной автосалон
        if (user.role === 'employee') {
          if (state.selectedDealershipId !== user.dealership_id) {
            set({ selectedDealershipId: user.dealership_id });
          }
          return;
        }

        // Для owner с "Все автосалоны" (null) - оставляем
        if (user.role === 'owner' && state.selectedDealershipId === null) {
          return;
        }

        // Проверяем что текущий выбор доступен
        if (state.selectedDealershipId !== null) {
          const isValid = availableDealerships.some(d => d.id === state.selectedDealershipId);
          if (!isValid && availableDealerships.length > 0) {
            // Fallback на первый доступный
            set({ selectedDealershipId: availableDealerships[0].id });
          }
        }
      },

      resetWorkspace: () => {
        set({
          selectedDealershipId: null,
          hasInitialized: false
        });
      },
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({
        selectedDealershipId: state.selectedDealershipId,
        hasInitialized: state.hasInitialized,
      }),
    }
  )
);
