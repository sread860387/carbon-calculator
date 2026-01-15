/**
 * EV Charging Zustand Store
 * State management for EV charging emissions tracking
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EVChargingEntry, EVChargingResult } from '../types/evCharging.types';
import { evChargingCalculator } from '../services/calculations/evChargingCalculator';

interface EVChargingState {
  entries: EVChargingEntry[];
  results: EVChargingResult[];
  totals: {
    totalCO2e: number;
    totalElectricityKWh: number;
    totalMilesDriven: number;
    byCountry: {
      [country: string]: number;
    };
  } | null;

  // Actions
  addEntry: (entry: EVChargingEntry) => void;
  updateEntry: (id: string, entry: EVChargingEntry) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
  recalculate: () => void;
}

const initialTotals = {
  totalCO2e: 0,
  totalElectricityKWh: 0,
  totalMilesDriven: 0,
  byCountry: {}
};

export const useEVChargingStore = create<EVChargingState>()(
  persist(
    (set, get) => ({
      entries: [],
      results: [],
      totals: null,

      addEntry: (entry) => {
        const { entries } = get();
        const newEntries = [...entries, entry];
        const moduleResults = evChargingCalculator.calculateAll(newEntries);

        set({
          entries: newEntries,
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      },

      updateEntry: (id, updatedEntry) => {
        const { entries } = get();
        const newEntries = entries.map(e => e.id === id ? updatedEntry : e);
        const moduleResults = evChargingCalculator.calculateAll(newEntries);

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
          const moduleResults = evChargingCalculator.calculateAll(newEntries);
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

        const moduleResults = evChargingCalculator.calculateAll(entries);
        set({
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      }
    }),
    {
      name: 'ev-charging-storage'
    }
  )
);
