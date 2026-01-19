/**
 * Utilities Module Types
 * Based on "2-Utilities" sheet from PEAR 4.2.9
 */

// Electricity calculation methods
export type ElectricityMethod = 'usage' | 'area' | 'none';

// Heat fuel options
export type HeatFuel = 'Natural Gas' | 'Fuel Oil' | 'None' | 'Inc. in Elec.';

// Heat fuel calculation methods
export type HeatMethod = 'usage' | 'area' | 'none';

// Building/location types (from CBECs data in Excel)
export type BuildingType =
  | 'Office'
  | 'Studio'
  | 'Warehouse'
  | 'Retail'
  | 'Hotel/Motel'
  | 'Restaurant'
  | 'Healthcare'
  | 'Education'
  | 'Other';

// Area units
export type AreaUnit = 'square feet' | 'square meters' | 'square yards' | 'acres';

// Natural gas units
export type NaturalGasUnit = 'cubic feet' | 'cubic meters' | 'ccf' | 'ccm' | 'therms' | 'kWh';

// Fuel oil units
export type FuelOilUnit = 'gallons' | 'liters' | 'Btu' | 'Megajoules' | 'Gigajoules';

export interface UtilitiesEntry {
  id: string;
  date: Date;
  description?: string;

  // Location information
  locationName: string;
  country?: string; // For location-specific electricity emission factors
  stateProvince?: string; // For region-specific factors (US/Canada)

  // Building/space information
  buildingType: BuildingType;
  area?: number;
  areaUnit?: AreaUnit;
  daysOccupied?: number; // Days used during production period

  // Electricity
  electricityMethod: ElectricityMethod;
  electricityUsage?: number; // kWh

  // Heat/Fuel
  heatFuel: HeatFuel;
  heatMethod: HeatMethod;
  naturalGasUsage?: number;
  naturalGasUnit?: NaturalGasUnit;
  fuelOilUsage?: number;
  fuelOilUnit?: FuelOilUnit;
}

export interface UtilitiesResult {
  entryId: string;
  electricityEmissions: number; // kg CO2e
  heatEmissions: number; // kg CO2e
  totalEmissions: number; // kg CO2e
  electricityKWh?: number; // Calculated or provided kWh
  heatFuelConverted?: number; // Converted to standard unit
  calculationMethod: string;
}

export interface UtilitiesModuleResults {
  entries: UtilitiesEntry[];
  results: UtilitiesResult[];
  totals: {
    totalCO2e: number;
    electricityCO2e: number;
    heatCO2e: number;
    totalElectricityKWh: number;
  };
  metadata: {
    calculatedAt: Date;
    emissionFactorsVersion: string;
    source: string;
  };
}

// Form data (for react-hook-form)
export interface UtilitiesFormData {
  date: string;
  description?: string;
  locationName: string;
  country?: string;
  stateProvince?: string;
  buildingType: BuildingType;
  area?: string;
  areaUnit?: AreaUnit;
  daysOccupied?: string;
  electricityMethod: ElectricityMethod;
  electricityUsage?: string;
  heatFuel: HeatFuel;
  heatMethod: HeatMethod;
  naturalGasUsage?: string;
  naturalGasUnit?: NaturalGasUnit;
  fuelOilUsage?: string;
  fuelOilUnit?: FuelOilUnit;
}
