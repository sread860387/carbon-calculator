/**
 * EV Charging Module Types
 * Based on "4-EV Charging" sheet from PEAR 4.2.9
 */

export interface EVChargingEntry {
  id: string;
  date: Date;
  description?: string;

  // Location information
  country: string;
  stateProvince?: string;
  zipCode?: string;
  address?: string;

  // Charging data
  electricityUsageKWh: number;
  milesDriven?: number; // Optional, for tracking only
}

export interface EVChargingResult {
  entryId: string;
  co2e: number; // kg CO2e
  electricityKWh: number;
  emissionFactor: number; // kg CO2e per kWh
  region: string; // Determined region for emission factor
}

export interface EVChargingModuleResults {
  entries: EVChargingEntry[];
  results: EVChargingResult[];
  totals: {
    totalCO2e: number;
    totalElectricityKWh: number;
    totalMilesDriven: number;
    byCountry: {
      [country: string]: number; // CO2e by country
    };
  };
  metadata: {
    calculatedAt: Date;
    emissionFactorsVersion: string;
    source: string;
  };
}

// Form data (for react-hook-form)
export interface EVChargingFormData {
  date: string;
  description?: string;
  country: string;
  stateProvince?: string;
  zipCode?: string;
  address?: string;
  electricityUsageKWh: string;
  milesDriven?: string;
}
