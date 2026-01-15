/**
 * Production Info Store
 * Zustand store for managing production metadata
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductionInfo } from '../types/productionInfo.types';

interface ProductionInfoState {
  productionInfo: ProductionInfo | null;

  // Actions
  updateProductionInfo: (info: ProductionInfo) => void;
  clearProductionInfo: () => void;
}

export const useProductionInfoStore = create<ProductionInfoState>()(
  persist(
    (set) => ({
      productionInfo: null,

      updateProductionInfo: (info) => {
        set({
          productionInfo: {
            ...info,
            lastUpdated: new Date()
          }
        });
      },

      clearProductionInfo: () => {
        set({ productionInfo: null });
      }
    }),
    {
      name: 'production-info-storage',
      version: 2
    }
  )
);
