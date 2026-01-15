/**
 * Charter & Helicopter Flights Module Types
 * Based on "7-Charter and Heli Flights" sheet from PEAR 4.2.9
 */

// Aircraft types available
export type AircraftType =
  | 'Chartered Commercial Jet'
  | 'Large Private Jet'
  | 'Small Private Jet'
  | 'Helicopter';

// Calculation method - user provides ONE of these
export type CharterCalculationMethod =
  | 'fuel'      // Preferred: Actual fuel amount
  | 'hours'     // Second: Total hours flown
  | 'distance'; // Third: Total distance flown

export type FuelUnit = 'gallons' | 'liters';
export type DistanceUnit = 'miles' | 'kilometers';

export interface CharterFlightsEntry {
  id: string;
  date: Date;
  aircraftType: AircraftType;
  model?: string; // Optional aircraft model
  calculationMethod: CharterCalculationMethod;

  // One of these will be filled based on calculation method
  fuelAmount?: number;
  fuelUnit?: FuelUnit;
  hoursFlown?: number;
  distanceFlown?: number;
  distanceUnit?: DistanceUnit;

  description?: string;
}

export interface CharterFlightsResult {
  entryId: string;
  co2e: number; // kg CO2e
  fuelUsedGallons: number; // Total fuel in gallons
  emissionFactor: number; // kg CO2e per gallon
  calculationMethod: CharterCalculationMethod;
  aircraftType: AircraftType;
}

export interface CharterFlightsModuleResults {
  entries: CharterFlightsEntry[];
  results: CharterFlightsResult[];
  totals: {
    totalCO2e: number;
    totalFuelGallons: number;
    totalHoursFlown: number;
    totalDistanceFlown: number;
    byAircraftType: {
      [key in AircraftType]?: number; // CO2e by aircraft type
    };
    byCalculationMethod: {
      [key in CharterCalculationMethod]?: number; // CO2e by calculation method
    };
  };
  metadata: {
    calculatedAt: Date;
    emissionFactorsVersion: string;
    source: string;
  };
}

// Form data (for react-hook-form)
export interface CharterFlightsFormData {
  date: string;
  aircraftType: AircraftType;
  model?: string;
  calculationMethod: CharterCalculationMethod;
  fuelAmount?: string;
  fuelUnit?: FuelUnit;
  hoursFlown?: string;
  distanceFlown?: string;
  distanceUnit?: DistanceUnit;
  description?: string;
}
