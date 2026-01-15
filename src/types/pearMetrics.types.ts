/**
 * PEAR Metrics Module Types
 * Based on "PEAR Metrics" sheet from PEAR 4.2.9
 * Tracks sustainability practices and environmental metrics
 */

// ============================================================================
// DRINKING WATER
// ============================================================================

export type WaterContainerType =
  | '0.5L Plastic water bottles'
  | '5 gallon jugs'
  | 'Reusable bottles'
  | 'Boxed Water'
  | 'Aluminum Canned Water'
  | 'Aluminum Bottled Water'
  | 'Single Use Other (Non-Plastic)';

export interface DrinkingWaterEntry {
  id: string;
  date: Date;
  containerType: WaterContainerType;
  quantity: number;
  totalCost?: number;
  comments?: string;
}

// ============================================================================
// WASTE TRACKING
// ============================================================================

export type WasteType =
  | 'Waste to Landfill'
  | 'Mixed Recycling'
  | 'Cardboard Recycling'
  | 'Metal Recycling'
  | 'Wood Recycling'
  | 'Compost'
  | 'Thermal Waste to Energy'
  | 'E-Waste';

export type WasteUnit = 'pounds' | 'tons' | 'cubic yards';

export interface WasteEntry {
  id: string;
  date: Date;
  wasteType: WasteType;
  amount: number;
  unit: WasteUnit;
  location?: string; // Office, Stage, Location name
  dataSource?: string; // Hauler report, estimate, on-site weighing
  comments?: string;
}

// ============================================================================
// DONATIONS
// ============================================================================

export interface DonationEntry {
  id: string;
  date: Date;
  donationType: string; // Free-form: food, equipment, props, etc.
  quantity?: number;
  unit?: string; // boxes, pallets, items, etc.
  value: number; // Dollar value
  comments?: string;
}

// ============================================================================
// RECYCLED PAPER
// ============================================================================

export interface RecycledPaperEntry {
  id: string;
  date: Date;
  virginReams: number;
  recycledReams: number;
  comments?: string;
}

// ============================================================================
// FUEL SAVINGS (Hybrid vehicles, biodiesel, etc.)
// ============================================================================

export type HybridVehicleType = 'Hybrid SUVs' | 'Hybrid Cars';

export interface HybridVehicleEntry {
  id: string;
  date: Date;
  vehicleType: HybridVehicleType;
  fuelAmount?: number; // Preferred
  fuelUnit?: 'gallons' | 'liters';
  distanceDriven?: number; // Second option (miles)
  fuelCost?: number; // Third option
  costPerGallon?: number; // For cost calculation
  comments?: string;
}

export type BiodieselType = 'B100' | 'B99' | 'B40' | 'B20' | 'B5';

export interface BiodieselEntry {
  id: string;
  date: Date;
  biodieselType: BiodieselType;
  amountGallons: number;
  comments?: string;
}

export type OtherFuelSavingType = 'Electric Cars' | 'Solar' | 'Electric grid tie in' | 'Other';

export interface OtherFuelSavingEntry {
  id: string;
  date: Date;
  savingType: OtherFuelSavingType;
  description?: string; // For "Other" type
  amountSaved?: number;
  unit?: string;
  comments?: string;
}

// ============================================================================
// MODULE RESULTS
// ============================================================================

export interface PEARMetricsModuleResults {
  drinkingWater: {
    entries: DrinkingWaterEntry[];
    totals: {
      totalCost: number;
      byContainerType: Record<WaterContainerType, number>; // quantity
      plasticBottlesAvoided: number;
      jugWaterSavings: number;
    };
  };
  waste: {
    entries: WasteEntry[];
    totals: {
      totalPounds: number;
      landfillPounds: number;
      recycledPounds: number;
      compostedPounds: number;
      diversionRate: number; // percentage
      byWasteType: Record<WasteType, number>; // pounds
    };
  };
  donations: {
    entries: DonationEntry[];
    totals: {
      totalValue: number;
      totalItems: number;
    };
  };
  recycledPaper: {
    entries: RecycledPaperEntry[];
    totals: {
      totalVirginReams: number;
      totalRecycledReams: number;
      recycledPercentage: number;
    };
  };
  fuelSavings: {
    hybridVehicles: HybridVehicleEntry[];
    biodiesel: BiodieselEntry[];
    otherSavings: OtherFuelSavingEntry[];
    totals: {
      totalBiodieselGallons: number;
    };
  };
  metadata: {
    calculatedAt: Date;
  };
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface DrinkingWaterFormData {
  date: string;
  containerType: WaterContainerType;
  quantity: string;
  totalCost?: string;
  comments?: string;
}

export interface WasteFormData {
  date: string;
  wasteType: WasteType;
  amount: string;
  unit: WasteUnit;
  location?: string;
  dataSource?: string;
  comments?: string;
}

export interface DonationFormData {
  date: string;
  donationType: string;
  quantity?: string;
  unit?: string;
  value: string;
  comments?: string;
}

export interface RecycledPaperFormData {
  date: string;
  virginReams: string;
  recycledReams: string;
  comments?: string;
}

export interface BiodieselFormData {
  date: string;
  biodieselType: BiodieselType;
  amountGallons: string;
  comments?: string;
}

export interface HybridVehicleFormData {
  date: string;
  vehicleType: HybridVehicleType;
  fuelAmount?: string;
  fuelUnit?: 'gallons' | 'liters';
  distanceDriven?: string;
  fuelCost?: string;
  costPerGallon?: string;
  comments?: string;
}

export interface OtherFuelSavingFormData {
  date: string;
  savingType: OtherFuelSavingType;
  description?: string;
  amountSaved?: string;
  unit?: string;
  comments?: string;
}
