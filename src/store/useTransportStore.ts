/**
 * Transport Module Store
 * State management for transport emissions data using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransportEntry, TransportModuleResults, EmissionResult } from '../types/transport.types';
import { transportCalculator } from '../services/calculations/transportCalculator';

interface TransportStore {
  // State
  entries: TransportEntry[];
  results: EmissionResult[];
  totals: TransportModuleResults['totals'] | null;
  lastCalculated: Date | null;

  // Actions
  addEntry: (entry: TransportEntry) => void;
  updateEntry: (id: string, updates: Partial<TransportEntry>) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
  recalculate: () => void;

  // Getters
  getEntryById: (id: string) => TransportEntry | undefined;
  getEntriesByMode: (mode: TransportEntry['mode']) => TransportEntry[];
}

export const useTransportStore = create<TransportStore>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],
      results: [],
      totals: null,
      lastCalculated: null,

      // Add a new entry and recalculate
      addEntry: (entry) => {
        set((state) => ({
          entries: [...state.entries, entry]
        }));
        get().recalculate();
      },

      // Update an existing entry and recalculate
      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          )
        }));
        get().recalculate();
      },

      // Delete an entry and recalculate
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id)
        }));
        get().recalculate();
      },

      // Clear all entries
      clearAll: () => {
        set({
          entries: [],
          results: [],
          totals: null,
          lastCalculated: null
        });
      },

      // Recalculate all emissions
      recalculate: () => {
        const { entries } = get();

        if (entries.length === 0) {
          set({
            results: [],
            totals: null,
            lastCalculated: null
          });
          return;
        }

        try {
          const calculationResults = transportCalculator.calculateAll(entries);

          set({
            results: calculationResults.results,
            totals: calculationResults.totals,
            lastCalculated: new Date()
          });
        } catch (error) {
          console.error('Error calculating emissions:', error);
          // Keep previous results on error
        }
      },

      // Get entry by ID
      getEntryById: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },

      // Get entries filtered by mode
      getEntriesByMode: (mode) => {
        return get().entries.filter((entry) => entry.mode === mode);
      }
    }),
    {
      name: 'transport-storage', // localStorage key
      // Only persist entries, recalculate results on load
      partializeState: (state) => ({ entries: state.entries }),
      onRehydrateStorage: () => (state) => {
        // Recalculate after loading from localStorage
        if (state) {
          state.recalculate();
        }
      }
    }
  )
);
