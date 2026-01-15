/**
 * Commercial Travel Store
 * Zustand store for managing commercial travel entries and emissions calculations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CommercialTravelEntry, CommercialTravelResult } from '../types/commercialTravel.types';
import { commercialTravelCalculator } from '../services/calculations/commercialTravelCalculator';

interface CommercialTravelState {
  entries: CommercialTravelEntry[];
  results: CommercialTravelResult[];
  totals: {
    totalCO2e: number;
    totalPassengerMiles: number;
    byTransportType: Record<string, number>;
    byFlightClassification?: Record<string, number>;
  } | null;

  // Actions
  addEntry: (entry: CommercialTravelEntry) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
}

export const useCommercialTravelStore = create<CommercialTravelState>()(
  persist(
    (set, get) => ({
      entries: [],
      results: [],
      totals: null,

      addEntry: (entry: CommercialTravelEntry) => {
        const entries = [...get().entries, entry];
        const moduleResults = commercialTravelCalculator.calculateAll(entries);

        set({
          entries: moduleResults.entries,
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      },

      deleteEntry: (id: string) => {
        const entries = get().entries.filter(e => e.id !== id);

        if (entries.length === 0) {
          set({
            entries: [],
            results: [],
            totals: null
          });
        } else {
          const moduleResults = commercialTravelCalculator.calculateAll(entries);
          set({
            entries: moduleResults.entries,
            results: moduleResults.results,
            totals: moduleResults.totals
          });
        }
      },

      clearAll: () => {
        set({
          entries: [],
          results: [],
          totals: null
        });
      }
    }),
    {
      name: 'commercial-travel-storage',
      version: 1
    }
  )
);
