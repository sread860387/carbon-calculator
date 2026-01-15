/**
 * Fuel Zustand Store
 * State management for fuel emissions tracking
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FuelEntry, FuelResult } from '../types/fuel.types';
import { fuelCalculator } from '../services/calculations/fuelCalculator';

interface FuelState {
  entries: FuelEntry[];
  results: FuelResult[];
  totals: {
    totalCO2e: number;
    totalFuelGallons: number;
    byEquipmentCategory: {
      Vehicle: number;
      Equipment: number;
    };
    byFuelType: {
      [key: string]: number;
    };
  } | null;

  // Actions
  addEntry: (entry: FuelEntry) => void;
  updateEntry: (id: string, entry: FuelEntry) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
  recalculate: () => void;
  getEntriesByEquipmentType: (equipmentType: string) => FuelEntry[];
  getEntriesByFuelType: (fuelType: string) => FuelEntry[];
}

const initialTotals = {
  totalCO2e: 0,
  totalFuelGallons: 0,
  byEquipmentCategory: {
    Vehicle: 0,
    Equipment: 0
  },
  byFuelType: {}
};

export const useFuelStore = create<FuelState>()(
  persist(
    (set, get) => ({
      entries: [],
      results: [],
      totals: null,

      addEntry: (entry) => {
        const { entries } = get();
        const newEntries = [...entries, entry];
        const moduleResults = fuelCalculator.calculateAll(newEntries);

        set({
          entries: newEntries,
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      },

      updateEntry: (id, updatedEntry) => {
        const { entries } = get();
        const newEntries = entries.map(e => e.id === id ? updatedEntry : e);
        const moduleResults = fuelCalculator.calculateAll(newEntries);

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
          const moduleResults = fuelCalculator.calculateAll(newEntries);
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

        const moduleResults = fuelCalculator.calculateAll(entries);
        set({
          results: moduleResults.results,
          totals: moduleResults.totals
        });
      },

      getEntriesByEquipmentType: (equipmentType) => {
        const { entries } = get();
        return entries.filter(e => e.equipmentType === equipmentType);
      },

      getEntriesByFuelType: (fuelType) => {
        const { entries } = get();
        return entries.filter(e => e.fuelType === fuelType);
      }
    }),
    {
      name: 'fuel-storage'
    }
  )
);
