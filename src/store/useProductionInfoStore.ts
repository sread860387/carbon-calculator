/**
 * Production Info Store
 * Zustand store for managing production metadata
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProductionInfo } from '../types/productionInfo.types';

interface ProductionInfoState {
  productionInfo: ProductionInfo | null;

  // Actions
  updateProductionInfo: (info: ProductionInfo) => void;
  clearProductionInfo: () => void;
}

// Helper functions to handle Date serialization
const reviveDates = (key: string, value: any) => {
  // List of date field names in ProductionInfo
  const dateFields = [
    'firstShootDate',
    'lastShootDate',
    'startDate',
    'endDate',
    'calculatorContactDate',
    'coordinatorSignOffDate',
    'lastUpdated',
    'fromDate',
    'endDate'
  ];

  if (dateFields.includes(key) && typeof value === 'string') {
    return new Date(value);
  }
  return value;
};

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
      version: 3,
      storage: createJSONStorage(() => localStorage, {
        reviver: reviveDates
      })
    }
  )
);
