/**
 * Fuel Module Types
 * Based on "3-Fuel" sheet from PEAR 4.2.9
 */

// Equipment types
export type EquipmentCategory = 'Vehicle' | 'Equipment';

export type EquipmentType =
  | 'Cars'
  | 'Motorcycles'
  | 'Buses'
  | 'Vans, Pickups, SUVs'
  | 'Trucks (<18 wheel)'
  | 'Fueler Truck'
  | '18 Wheelers'
  | 'All Vehicles'
  | 'Hybrid SUVs'
  | 'Hybrid Cars'
  | 'Boat'
  | 'Generator'
  | 'Trailer'
  | 'Cooking Equipment'
  | 'Lift'
  | 'Heater'
  | 'Other';

// Fuel types (from FuelEFs sheet)
export type FuelType =
  | 'Gasoline'
  | 'Diesel Fuel'
  | 'Diesel (Red)'
  | 'Propane'
  | 'Butane'
  | 'CNG'
  | 'LNG'
  | 'LPG'
  | 'Natural gas'
  | 'Jet Fuel'
  | 'Aviation Gasoline'
  | 'Kerosene'
  | 'Fuel Oil'
  | 'RFO (Ships)'
  | 'Ethanol (E100)'
  | 'E85'
  | 'Hydrogen'
  | 'Acetylene';

// Fuel units (from FuelEFs sheet and conversions)
export type FuelUnit =
  | 'gallons'
  | 'liters'
  | 'cubic feet'
  | 'cubic meters'
  | 'kg'
  | 'lbs'
  | 'ccf'
  | 'ccm'
  | 'sterno cans';

// Calculation method
export type FuelCalculationMethod = 'amount' | 'mileage' | 'cost';

export interface FuelEntry {
  id: string;
  date: Date;
  endDate?: Date;
  equipmentType: EquipmentType;
  fuelType: FuelType;
  reasonForUse?: string;

  // Calculation method and data
  calculationMethod: FuelCalculationMethod;

  // Method 1: Direct fuel amount (preferred)
  fuelAmount?: number;
  fuelUnit?: FuelUnit;

  // Method 2: Mileage-based (for vehicles)
  milesDriven?: number;

  // Method 3: Cost-based
  totalCost?: number; // $US
  averagePricePerGallon?: number; // $US per gallon
}

export interface FuelResult {
  entryId: string;
  co2e: number; // kg CO2e
  fuelGallons: number; // Converted to gallons
  emissionFactor: number; // kg CO2e per gallon
  calculationMethod: string;
}

export interface FuelModuleResults {
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
      [key in FuelType]?: number;
    };
  };
  metadata: {
    calculatedAt: Date;
    emissionFactorsVersion: string;
    source: string;
  };
}

// Form data (for react-hook-form)
export interface FuelFormData {
  date: string;
  endDate?: string;
  equipmentType: EquipmentType;
  fuelType: FuelType;
  reasonForUse?: string;
  calculationMethod: FuelCalculationMethod;
  fuelAmount?: string;
  fuelUnit?: FuelUnit;
  milesDriven?: string;
  totalCost?: string;
  averagePricePerGallon?: string;
}
