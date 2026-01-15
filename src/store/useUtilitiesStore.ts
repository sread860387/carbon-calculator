/**
 * Utilities Zustand Store
 * State management for utilities emissions tracking
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UtilitiesEntry, UtilitiesResult } from '../types/utilities.types';
import { utilitiesCalculator } from '../services/calculations/utilitiesCalculator';

interface UtilitiesState {
  entries: UtilitiesEntry[];
  results: UtilitiesResult[];
  totals: {
    totalCO2e: number;
    electricityCO2e: number;
    heatCO2e: number;
    totalElectricityKWh: number;
  } | null;

  // Actions
  addEntry: (entry: UtilitiesEntry) => void;
  updateEntry: (id: string, entry: UtilitiesEntry) => void;
  deleteEntry: (id: string) => void;
  duplicateEntry: (id: string) => void;
  clearAll: () => void;
  recalculate: () => void;
}

const initialTotals = {
  totalCO2e: 0,
  electricityCO2e: 0,
  heatCO2e: 0,
  totalElectricityKWh: 0
};

export const useUtilitiesStore = create<UtilitiesState>()(
  persist(
    (set, get) => ({
      entries: [],
      results: [],
      totals: null,

      addEntry: (entry) => {
        const { entries } = get();
        const newEntries = [...entries, entry];
        const moduleResults = utilitiesCalculator.calculateAll(newEntries);

        set({
          entries: newEntries,
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      },

      updateEntry: (id, updatedEntry) => {
        const { entries } = get();
        const newEntries = entries.map(e => e.id === id ? updatedEntry : e);
        const moduleResults = utilitiesCalculator.calculateAll(newEntries);

        set({
          entries: newEntries,
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      },

      deleteEntry: (id) => {
        const { entries } = get();
        const newEntries = entries.filter(e => e.id !== id);

        if (newEntries.length === 0) {
          set({
            entries: [],
            results: [],
            totals: initialTotals
          });
        } else {
          const moduleResults = utilitiesCalculator.calculateAll(newEntries);
          set({
            entries: newEntries,
            results: moduleResults.results,
            totals: moduleResults.totals
          });
        }
      },

      duplicateEntry: (id) => {
        const { entries } = get();
        const entryToDuplicate = entries.find(e => e.id === id);

        if (entryToDuplicate) {
          const duplicatedEntry: UtilitiesEntry = {
            ...entryToDuplicate,
            id: `utilities-${Date.now()}`,
            date: new Date(), // Set to today's date
            description: entryToDuplicate.description ? `${entryToDuplicate.description} (Copy)` : 'Copy'
          };

          const newEntries = [...entries, duplicatedEntry];
          const moduleResults = utilitiesCalculator.calculateAll(newEntries);

          set({
            entries: newEntries,
            results: moduleResults.results,
            totals: moduleResults.totals
          });
        }
      },

      clearAll: () => {
        set({
          entries: [],
          results: [],
          totals: initialTotals
        });
      },

      recalculate: () => {
        const { entries } = get();
        if (entries.length === 0) {
          set({ results: [], totals: initialTotals });
          return;
        }

        const moduleResults = utilitiesCalculator.calculateAll(entries);
        set({
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      }
    }),
    {
      name: 'utilities-storage'
    }
  )
);
