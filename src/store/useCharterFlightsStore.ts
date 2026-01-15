/**
 * Charter Flights Store
 * Zustand store for managing charter/helicopter flight entries and emissions calculations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharterFlightsEntry, CharterFlightsResult } from '../types/charterFlights.types';
import { charterFlightsCalculator } from '../services/calculations/charterFlightsCalculator';

interface CharterFlightsState {
  entries: CharterFlightsEntry[];
  results: CharterFlightsResult[];
  totals: {
    totalCO2e: number;
    totalFuelGallons: number;
    totalHoursFlown: number;
    totalDistanceFlown: number;
    byAircraftType: Record<string, number>;
    byCalculationMethod: Record<string, number>;
  } | null;

  // Actions
  addEntry: (entry: CharterFlightsEntry) => void;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
}

export const useCharterFlightsStore = create<CharterFlightsState>()(
  persist(
    (set, get) => ({
      entries: [],
      results: [],
      totals: null,

      addEntry: (entry: CharterFlightsEntry) => {
        const entries = [...get().entries, entry];
        const moduleResults = charterFlightsCalculator.calculateAll(entries);

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
          const moduleResults = charterFlightsCalculator.calculateAll(entries);
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
      name: 'charter-flights-storage',
      version: 1
    }
  )
);
