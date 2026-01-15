/**
 * Hotels Store
 * Zustand store for managing hotel/housing entries and emissions calculations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HotelsEntry, HotelsResult } from '../types/hotels.types';
import { hotelsCalculator } from '../services/calculations/hotelsCalculator';

interface HotelsState {
  entries: HotelsEntry[];
  results: HotelsResult[];
  totals: {
    totalCO2e: number;
    totalNights: number;
    byRoomType: Record<string, number>;
    byCountry: Record<string, number>;
  } | null;

  // Actions
  addEntry: (entry: HotelsEntry) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
}

export const useHotelsStore = create<HotelsState>()(
  persist(
    (set, get) => ({
      entries: [],
      results: [],
      totals: null,

      addEntry: (entry: HotelsEntry) => {
        const entries = [...get().entries, entry];
        const moduleResults = hotelsCalculator.calculateAll(entries);

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
          const moduleResults = hotelsCalculator.calculateAll(entries);
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
      name: 'hotels-storage',
      version: 1
    }
  )
);
