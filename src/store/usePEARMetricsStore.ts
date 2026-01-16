/**
 * PEAR Metrics Store
 * Zustand store for managing sustainability metrics and environmental practices
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DrinkingWaterEntry,
  WasteEntry,
  DonationEntry,
  RecycledPaperEntry,
  BiodieselEntry,
  HybridVehicleEntry,
  OtherFuelSavingEntry
} from '../types/pearMetrics.types';

interface PEARMetricsState {
  // Drinking Water
  drinkingWaterEntries: DrinkingWaterEntry[];
  drinkingWaterTotals: {
    totalCost: number;
    byContainerType: Record<string, number>;
    totalBottles: number;
  } | null;

  // Waste
  wasteEntries: WasteEntry[];
  wasteTotals: {
    totalPounds: number;
    landfillPounds: number;
    recycledPounds: number;
    compostedPounds: number;
    diversionRate: number;
    byWasteType: Record<string, number>;
  } | null;

  // Donations
  donationEntries: DonationEntry[];
  donationTotals: {
    totalValue: number;
    totalItems: number;
  } | null;

  // Recycled Paper
  recycledPaperEntries: RecycledPaperEntry[];
  recycledPaperTotals: {
    totalVirginReams: number;
    totalRecycledReams: number;
    recycledPercentage: number;
  } | null;

  // Biodiesel
  biodieselEntries: BiodieselEntry[];
  biodieselTotals: {
    totalGallons: number;
    byType: Record<string, number>;
  } | null;

  // Hybrid Vehicles
  hybridVehicleEntries: HybridVehicleEntry[];
  hybridVehicleTotals: {
    totalFuelGallons: number;
    byVehicleType: Record<string, number>;
  } | null;

  // Other Fuel Savings
  otherFuelSavingEntries: OtherFuelSavingEntry[];
  otherFuelSavingTotals: {
    totalEntries: number;
  } | null;

  // Actions - Drinking Water
  addDrinkingWaterEntry: (entry: DrinkingWaterEntry) => void;
  deleteDrinkingWaterEntry: (id: string) => void;
  clearDrinkingWater: () => void;

  // Actions - Waste
  addWasteEntry: (entry: WasteEntry) => void;
  deleteWasteEntry: (id: string) => void;
  clearWaste: () => void;

  // Actions - Donations
  addDonationEntry: (entry: DonationEntry) => void;
  deleteDonationEntry: (id: string) => void;
  clearDonations: () => void;

  // Actions - Recycled Paper
  addRecycledPaperEntry: (entry: RecycledPaperEntry) => void;
  deleteRecycledPaperEntry: (id: string) => void;
  clearRecycledPaper: () => void;

  // Actions - Biodiesel
  addBiodieselEntry: (entry: BiodieselEntry) => void;
  deleteBiodieselEntry: (id: string) => void;
  clearBiodiesel: () => void;

  // Actions - Hybrid Vehicles
  addHybridVehicleEntry: (entry: HybridVehicleEntry) => void;
  deleteHybridVehicleEntry: (id: string) => void;
  clearHybridVehicles: () => void;

  // Actions - Other Fuel Savings
  addOtherFuelSavingEntry: (entry: OtherFuelSavingEntry) => void;
  deleteOtherFuelSavingEntry: (id: string) => void;
  clearOtherFuelSavings: () => void;

  // Clear all
  clearAll: () => void;
}

// Helper functions to calculate totals
function calculateDrinkingWaterTotals(entries: DrinkingWaterEntry[]) {
  const byContainerType: Record<string, number> = {};
  let totalCost = 0;
  let totalBottles = 0;

  entries.forEach(entry => {
    if (!byContainerType[entry.containerType]) {
      byContainerType[entry.containerType] = 0;
    }
    byContainerType[entry.containerType] += entry.quantity;
    totalBottles += entry.quantity;
    if (entry.totalCost) {
      totalCost += entry.totalCost;
    }
  });

  return { totalCost, byContainerType, totalBottles };
}

function calculateWasteTotals(entries: WasteEntry[]) {
  const byWasteType: Record<string, number> = {};
  let totalPounds = 0;
  let landfillPounds = 0;
  let recycledPounds = 0;
  let compostedPounds = 0;

  entries.forEach(entry => {
    // Convert to pounds
    let pounds = entry.amount;
    if (entry.unit === 'tons') {
      pounds = entry.amount * 2000;
    } else if (entry.unit === 'cubic yards') {
      // Approximate: 1 cubic yard ≈ 300 pounds (varies by material)
      pounds = entry.amount * 300;
    }

    if (!byWasteType[entry.wasteType]) {
      byWasteType[entry.wasteType] = 0;
    }
    byWasteType[entry.wasteType] += pounds;
    totalPounds += pounds;

    if (entry.wasteType === 'Waste to Landfill') {
      landfillPounds += pounds;
    } else if (entry.wasteType === 'Compost') {
      compostedPounds += pounds;
    } else {
      recycledPounds += pounds;
    }
  });

  const diversionRate = totalPounds > 0
    ? ((recycledPounds + compostedPounds) / totalPounds) * 100
    : 0;

  return {
    totalPounds,
    landfillPounds,
    recycledPounds,
    compostedPounds,
    diversionRate,
    byWasteType
  };
}

function calculateDonationTotals(entries: DonationEntry[]) {
  let totalValue = 0;
  let totalItems = 0;

  entries.forEach(entry => {
    totalValue += entry.value;
    if (entry.quantity) {
      totalItems += entry.quantity;
    }
  });

  return { totalValue, totalItems };
}

function calculateRecycledPaperTotals(entries: RecycledPaperEntry[]) {
  let totalVirginReams = 0;
  let totalRecycledReams = 0;

  entries.forEach(entry => {
    totalVirginReams += entry.virginReams;
    totalRecycledReams += entry.recycledReams;
  });

  const totalReams = totalVirginReams + totalRecycledReams;
  const recycledPercentage = totalReams > 0
    ? (totalRecycledReams / totalReams) * 100
    : 0;

  return { totalVirginReams, totalRecycledReams, recycledPercentage };
}

function calculateBiodieselTotals(entries: BiodieselEntry[]) {
  let totalGallons = 0;
  const byType: Record<string, number> = {};

  entries.forEach(entry => {
    totalGallons += entry.amountGallons;
    if (!byType[entry.biodieselType]) {
      byType[entry.biodieselType] = 0;
    }
    byType[entry.biodieselType] += entry.amountGallons;
  });

  return { totalGallons, byType };
}

function calculateHybridVehicleTotals(entries: HybridVehicleEntry[]) {
  let totalFuelGallons = 0;
  const byVehicleType: Record<string, number> = {};

  entries.forEach(entry => {
    let fuelGallons = 0;

    if (entry.fuelAmount) {
      fuelGallons = entry.fuelUnit === 'liters'
        ? entry.fuelAmount * 0.264172  // Convert liters to gallons
        : entry.fuelAmount;
    }

    totalFuelGallons += fuelGallons;

    if (!byVehicleType[entry.vehicleType]) {
      byVehicleType[entry.vehicleType] = 0;
    }
    byVehicleType[entry.vehicleType] += fuelGallons;
  });

  return { totalFuelGallons, byVehicleType };
}

function calculateOtherFuelSavingTotals(entries: OtherFuelSavingEntry[]) {
  return {
    totalEntries: entries.length
  };
}

export const usePEARMetricsStore = create<PEARMetricsState>()(
  persist(
    (set, get) => ({
      // Initial state
      drinkingWaterEntries: [],
      drinkingWaterTotals: null,
      wasteEntries: [],
      wasteTotals: null,
      donationEntries: [],
      donationTotals: null,
      recycledPaperEntries: [],
      recycledPaperTotals: null,
      biodieselEntries: [],
      biodieselTotals: null,
      hybridVehicleEntries: [],
      hybridVehicleTotals: null,
      otherFuelSavingEntries: [],
      otherFuelSavingTotals: null,

      // Drinking Water Actions
      addDrinkingWaterEntry: (entry) => {
        const entries = [...get().drinkingWaterEntries, entry];
        set({
          drinkingWaterEntries: entries,
          drinkingWaterTotals: calculateDrinkingWaterTotals(entries)
        });
      },

      deleteDrinkingWaterEntry: (id) => {
        const entries = get().drinkingWaterEntries.filter(e => e.id !== id);
        set({
          drinkingWaterEntries: entries,
          drinkingWaterTotals: entries.length > 0 ? calculateDrinkingWaterTotals(entries) : null
        });
      },

      clearDrinkingWater: () => {
        set({ drinkingWaterEntries: [], drinkingWaterTotals: null });
      },

      // Waste Actions
      addWasteEntry: (entry) => {
        const entries = [...get().wasteEntries, entry];
        set({
          wasteEntries: entries,
          wasteTotals: calculateWasteTotals(entries)
        });
      },

      deleteWasteEntry: (id) => {
        const entries = get().wasteEntries.filter(e => e.id !== id);
        set({
          wasteEntries: entries,
          wasteTotals: entries.length > 0 ? calculateWasteTotals(entries) : null
        });
      },

      clearWaste: () => {
        set({ wasteEntries: [], wasteTotals: null });
      },

      // Donation Actions
      addDonationEntry: (entry) => {
        const entries = [...get().donationEntries, entry];
        set({
          donationEntries: entries,
          donationTotals: calculateDonationTotals(entries)
        });
      },

      deleteDonationEntry: (id) => {
        const entries = get().donationEntries.filter(e => e.id !== id);
        set({
          donationEntries: entries,
          donationTotals: entries.length > 0 ? calculateDonationTotals(entries) : null
        });
      },

      clearDonations: () => {
        set({ donationEntries: [], donationTotals: null });
      },

      // Recycled Paper Actions
      addRecycledPaperEntry: (entry) => {
        const entries = [...get().recycledPaperEntries, entry];
        set({
          recycledPaperEntries: entries,
          recycledPaperTotals: calculateRecycledPaperTotals(entries)
        });
      },

      deleteRecycledPaperEntry: (id) => {
        const entries = get().recycledPaperEntries.filter(e => e.id !== id);
        set({
          recycledPaperEntries: entries,
          recycledPaperTotals: entries.length > 0 ? calculateRecycledPaperTotals(entries) : null
        });
      },

      clearRecycledPaper: () => {
        set({ recycledPaperEntries: [], recycledPaperTotals: null });
      },

      // Biodiesel Actions
      addBiodieselEntry: (entry) => {
        const entries = [...get().biodieselEntries, entry];
        set({
          biodieselEntries: entries,
          biodieselTotals: calculateBiodieselTotals(entries)
        });
      },

      deleteBiodieselEntry: (id) => {
        const entries = get().biodieselEntries.filter(e => e.id !== id);
        set({
          biodieselEntries: entries,
          biodieselTotals: entries.length > 0 ? calculateBiodieselTotals(entries) : null
        });
      },

      clearBiodiesel: () => {
        set({ biodieselEntries: [], biodieselTotals: null });
      },

      // Hybrid Vehicle Actions
      addHybridVehicleEntry: (entry) => {
        const entries = [...get().hybridVehicleEntries, entry];
        set({
          hybridVehicleEntries: entries,
          hybridVehicleTotals: calculateHybridVehicleTotals(entries)
        });
      },

      deleteHybridVehicleEntry: (id) => {
        const entries = get().hybridVehicleEntries.filter(e => e.id !== id);
        set({
          hybridVehicleEntries: entries,
          hybridVehicleTotals: entries.length > 0 ? calculateHybridVehicleTotals(entries) : null
        });
      },

      clearHybridVehicles: () => {
        set({ hybridVehicleEntries: [], hybridVehicleTotals: null });
      },

      // Other Fuel Saving Actions
      addOtherFuelSavingEntry: (entry) => {
        const entries = [...get().otherFuelSavingEntries, entry];
        set({
          otherFuelSavingEntries: entries,
          otherFuelSavingTotals: calculateOtherFuelSavingTotals(entries)
        });
      },

      deleteOtherFuelSavingEntry: (id) => {
        const entries = get().otherFuelSavingEntries.filter(e => e.id !== id);
        set({
          otherFuelSavingEntries: entries,
          otherFuelSavingTotals: entries.length > 0 ? calculateOtherFuelSavingTotals(entries) : null
        });
      },

      clearOtherFuelSavings: () => {
        set({ otherFuelSavingEntries: [], otherFuelSavingTotals: null });
      },

      // Clear All
      clearAll: () => {
        set({
          drinkingWaterEntries: [],
          drinkingWaterTotals: null,
          wasteEntries: [],
          wasteTotals: null,
          donationEntries: [],
          donationTotals: null,
          recycledPaperEntries: [],
          recycledPaperTotals: null,
          biodieselEntries: [],
          biodieselTotals: null,
          hybridVehicleEntries: [],
          hybridVehicleTotals: null,
          otherFuelSavingEntries: [],
          otherFuelSavingTotals: null
        });
      }
    }),
    {
      name: 'pear-metrics-storage',
      version: 1
    }
  )
);
