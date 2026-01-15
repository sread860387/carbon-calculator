/**
 * Emission Factors Configuration
 *
 * Source: Production Environmental Accounting Report 4.2.9
 * Based on DEFRA 2023 Greenhouse Gas Reporting Conversion Factors
 */

export interface EmissionFactor {
  id: string;
  category: string;
  subcategory: string;
  unit: string;
  value: number; // kg CO2e per unit
  source: string;
  year: number;
  notes?: string;
}

export interface EmissionFactorsConfig {
  version: string;
  lastUpdated: Date;
  source: string;
  factors: {
    road: {
      fuel: {
        gasoline: EmissionFactor;
        diesel: EmissionFactor;
        lpg: EmissionFactor;
        electric: EmissionFactor;
        hybrid: EmissionFactor;
      };
    };
    air: {
      average: EmissionFactor;
      short: EmissionFactor;
      medium: EmissionFactor;
      long: EmissionFactor;
    };
    rail: {
      national: EmissionFactor;
      international: EmissionFactor;
      lightRail: EmissionFactor;
    };
    ferry: {
      average: EmissionFactor;
    };
    utilities: {
      electricity: {
        [country: string]: EmissionFactor;
      };
      naturalGas: EmissionFactor;
      fuelOil: EmissionFactor;
    };
    fuel: {
      [fuelType: string]: EmissionFactor;
    };
  };
}

// Default emission factors from Production Environmental Accounting Report 4.2.9
export const defaultEmissionFactors: EmissionFactorsConfig = {
  version: "4.2.9",
  lastUpdated: new Date("2023-01-01"),
  source: "DEFRA 2023 Greenhouse Gas Reporting Conversion Factors",

  factors: {
    // Road Vehicle Fuel Emission Factors
    road: {
      fuel: {
        gasoline: {
          id: "gasoline",
          category: "road",
          subcategory: "fuel",
          unit: "gallon",
          value: 8.877, // kg CO2e per gallon
          source: "DEFRA 2023 - Petrol (100% mineral petrol)",
          year: 2023,
          notes: "2.345 kg CO2e/liter"
        },
        diesel: {
          id: "diesel",
          category: "road",
          subcategory: "fuel",
          unit: "gallon",
          value: 10.067, // kg CO2e per gallon
          source: "DEFRA 2023 - Diesel (100% mineral diesel)",
          year: 2023,
          notes: "2.659 kg CO2e/liter"
        },
        lpg: {
          id: "lpg",
          category: "road",
          subcategory: "fuel",
          unit: "gallon",
          value: 5.894, // kg CO2e per gallon
          source: "DEFRA 2023 - LPG",
          year: 2023,
          notes: "1.557 kg CO2e/liter"
        },
        electric: {
          id: "electric",
          category: "road",
          subcategory: "fuel",
          unit: "kWh",
          value: 0, // Will be calculated based on grid emission factor by location
          source: "DEFRA 2023 - Electricity (location-specific)",
          year: 2023,
          notes: "Varies by location - requires grid emission factor lookup"
        },
        hybrid: {
          id: "hybrid",
          category: "road",
          subcategory: "fuel",
          unit: "gallon",
          value: 8.877 * 0.6, // Estimated as 60% of gasoline
          source: "DEFRA 2023 - Estimated based on petrol consumption",
          year: 2023,
          notes: "Approximate - actual consumption varies by hybrid type"
        }
      }
    },

    // Air Travel Emission Factors
    air: {
      average: {
        id: "flight-average",
        category: "air",
        subcategory: "flight",
        unit: "passenger-mile",
        value: 0.167, // kg CO2e per passenger mile
        source: "DEFRA 2023 - International, to/from non-UK (average)",
        year: 2023,
        notes: "0.10377 kg CO2e/passenger-km"
      },
      short: {
        id: "flight-short",
        category: "air",
        subcategory: "flight",
        unit: "passenger-mile",
        value: 0.259, // kg CO2e per passenger mile
        source: "DEFRA 2023 - Domestic Average",
        year: 2023,
        notes: "< 288 miles; 0.161 kg CO2e/passenger-km"
      },
      medium: {
        id: "flight-medium",
        category: "air",
        subcategory: "flight",
        unit: "passenger-mile",
        value: 0.177, // kg CO2e per passenger mile
        source: "DEFRA 2023 - Short-Haul International Average",
        year: 2023,
        notes: "288-688 miles; 0.110 kg CO2e/passenger-km"
      },
      long: {
        id: "flight-long",
        category: "air",
        subcategory: "flight",
        unit: "passenger-mile",
        value: 0.248, // kg CO2e per passenger mile
        source: "DEFRA 2023 - Long-Haul International Average",
        year: 2023,
        notes: "> 688 miles; 0.154 kg CO2e/passenger-km"
      }
    },

    // Rail Travel Emission Factors
    rail: {
      national: {
        id: "rail-national",
        category: "rail",
        subcategory: "train",
        unit: "passenger-mile",
        value: 0.057, // kg CO2e per passenger mile
        source: "DEFRA 2023 - National rail",
        year: 2023,
        notes: "0.035 kg CO2e/passenger-km"
      },
      international: {
        id: "rail-international",
        category: "rail",
        subcategory: "train",
        unit: "passenger-mile",
        value: 0.007, // kg CO2e per passenger mile
        source: "DEFRA 2023 - International rail",
        year: 2023,
        notes: "0.004 kg CO2e/passenger-km"
      },
      lightRail: {
        id: "rail-light",
        category: "rail",
        subcategory: "train",
        unit: "passenger-mile",
        value: 0.046, // kg CO2e per passenger mile
        source: "DEFRA 2023 - Light rail and tram",
        year: 2023,
        notes: "0.029 kg CO2e/passenger-km"
      }
    },

    // Ferry Emission Factors
    ferry: {
      average: {
        id: "ferry-average",
        category: "ferry",
        subcategory: "passenger",
        unit: "passenger-mile",
        value: 0.181, // kg CO2e per passenger mile
        source: "DEFRA 2023 - Ferry, Average (all passenger)",
        year: 2023,
        notes: "0.113 kg CO2e/passenger-km"
      }
    },

    // Utilities Emission Factors
    utilities: {
      // Electricity emission factors by country/region (kg CO2e per kWh)
      // Source: IEA 2023 Emission Factors, 2021 data
      electricity: {
        'United States': {
          id: 'electricity-us',
          category: 'utilities',
          subcategory: 'electricity',
          unit: 'kWh',
          value: 0.3692, // kg CO2e per kWh
          source: 'IEA 2023 Emission Factors',
          year: 2021,
          notes: '369.2 gCO2e/kWh'
        },
        'United Kingdom': {
          id: 'electricity-uk',
          category: 'utilities',
          subcategory: 'electricity',
          unit: 'kWh',
          value: 0.2063, // kg CO2e per kWh
          source: 'IEA 2023 Emission Factors',
          year: 2021,
          notes: '206.3 gCO2e/kWh'
        },
        'Canada': {
          id: 'electricity-ca',
          category: 'utilities',
          subcategory: 'electricity',
          unit: 'kWh',
          value: 0.1183, // kg CO2e per kWh
          source: 'IEA 2023 Emission Factors',
          year: 2021,
          notes: '118.3 gCO2e/kWh'
        },
        'World': {
          id: 'electricity-world',
          category: 'utilities',
          subcategory: 'electricity',
          unit: 'kWh',
          value: 0.4663, // kg CO2e per kWh
          source: 'IEA 2023 Emission Factors',
          year: 2021,
          notes: '466.3 gCO2e/kWh - global average'
        }
      },

      // Natural gas emission factor
      naturalGas: {
        id: 'natural-gas',
        category: 'utilities',
        subcategory: 'heating',
        unit: 'cubic meter',
        value: 2.0384, // kg CO2e per cubic meter
        source: 'DEFRA 2023 - Natural gas',
        year: 2023,
        notes: '0.057721 kg CO2e/cubic foot'
      },

      // Fuel oil emission factor
      fuelOil: {
        id: 'fuel-oil',
        category: 'utilities',
        subcategory: 'heating',
        unit: 'liter',
        value: 3.1749, // kg CO2e per liter
        source: 'DEFRA 2023 - Fuel oil',
        year: 2023,
        notes: '12.0184 kg CO2e/gallon'
      }
    },

    // Fuel Emission Factors (for equipment and vehicles)
    // All values in kg CO2e per gallon unless noted
    fuel: {
      'Gasoline': {
        id: 'fuel-gasoline',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 8.8769,
        source: 'DEFRA 2023 - Petrol (100% mineral petrol)',
        year: 2023,
        notes: '2.345 kg CO2e/liter'
      },
      'Diesel Fuel': {
        id: 'fuel-diesel',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 10.0668,
        source: 'DEFRA 2023 - Diesel (100% mineral diesel)',
        year: 2023,
        notes: '2.659 kg CO2e/liter'
      },
      'Diesel (Red)': {
        id: 'fuel-diesel-red',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 10.4304,
        source: 'DEFRA 2023 - Gas oil',
        year: 2023,
        notes: '2.755 kg CO2e/liter'
      },
      'Propane': {
        id: 'fuel-propane',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'gallon',
        value: 5.8944,
        source: 'DEFRA 2023 - LPG',
        year: 2023,
        notes: '1.557 kg CO2e/liter'
      },
      'Butane': {
        id: 'fuel-butane',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'gallon',
        value: 6.6068,
        source: 'DEFRA 2023 - Butane',
        year: 2023,
        notes: '1.745 kg CO2e/liter'
      },
      'LPG': {
        id: 'fuel-lpg',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'gallon',
        value: 5.8944,
        source: 'DEFRA 2023 - LPG',
        year: 2023,
        notes: '1.557 kg CO2e/liter'
      },
      'CNG': {
        id: 'fuel-cng',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'gallon',
        value: 1.6976,
        source: 'DEFRA 2023 - CNG',
        year: 2023,
        notes: '0.448 kg CO2e/liter'
      },
      'LNG': {
        id: 'fuel-lng',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'gallon',
        value: 4.4226,
        source: 'DEFRA 2023 - LNG',
        year: 2023,
        notes: '1.168 kg CO2e/liter'
      },
      'Natural gas': {
        id: 'fuel-natural-gas',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'cubic foot',
        value: 0.0577,
        source: 'DEFRA 2023 - Natural gas',
        year: 2023,
        notes: '2.038 kg CO2e/cubic meter'
      },
      'Jet Fuel': {
        id: 'fuel-jet',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 9.6251,
        source: 'DEFRA 2023 - Aviation turbine fuel',
        year: 2023,
        notes: '2.543 kg CO2e/liter'
      },
      'Aviation Gasoline': {
        id: 'fuel-aviation-gas',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 8.8244,
        source: 'DEFRA 2023 - Aviation spirit',
        year: 2023,
        notes: '2.331 kg CO2e/liter'
      },
      'Kerosene': {
        id: 'fuel-kerosene',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 9.6155,
        source: 'DEFRA 2023 - Burning oil',
        year: 2023,
        notes: '2.540 kg CO2e/liter'
      },
      'Fuel Oil': {
        id: 'fuel-oil-equipment',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 12.0184,
        source: 'DEFRA 2023 - Fuel oil',
        year: 2023,
        notes: '3.175 kg CO2e/liter'
      },
      'RFO (Ships)': {
        id: 'fuel-rfo',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 10.4908,
        source: 'DEFRA 2023 - Marine gas oil',
        year: 2023,
        notes: '2.771 kg CO2e/liter'
      },
      'Ethanol (E100)': {
        id: 'fuel-ethanol',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 3.5750,
        source: 'DEFRA 2023 - Other petroleum gas',
        year: 2023,
        notes: '0.944 kg CO2e/liter'
      },
      'E85': {
        id: 'fuel-e85',
        category: 'fuel',
        subcategory: 'liquid',
        unit: 'gallon',
        value: 4.3703,
        source: 'DEFRA 2023 - 85% Ethanol + 15% Gasoline',
        year: 2023,
        notes: 'Calculated blend'
      },
      'Hydrogen': {
        id: 'fuel-hydrogen',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'gallon',
        value: 0,
        source: 'DEFRA 2023',
        year: 2023,
        notes: 'Zero emissions'
      },
      'Acetylene': {
        id: 'fuel-acetylene',
        category: 'fuel',
        subcategory: 'gas',
        unit: 'gallon',
        value: 0.0147,
        source: 'Climate Registry 2022',
        year: 2022,
        notes: 'Converted from cubic feet'
      }
    }
  }
};

// Helper function to get emission factor by ID
export function getEmissionFactor(id: string): EmissionFactor | undefined {
  const { factors } = defaultEmissionFactors;

  // Search in road factors
  const roadFuel = Object.values(factors.road.fuel).find(f => f.id === id);
  if (roadFuel) return roadFuel;

  // Search in air factors
  const airFactor = Object.values(factors.air).find(f => f.id === id);
  if (airFactor) return airFactor;

  // Search in rail factors
  const railFactor = Object.values(factors.rail).find(f => f.id === id);
  if (railFactor) return railFactor;

  // Search in utilities factors
  if (id === 'natural-gas') return factors.utilities.naturalGas;
  if (id === 'fuel-oil') return factors.utilities.fuelOil;
  const electricityFactor = Object.values(factors.utilities.electricity).find(f => f.id === id);
  if (electricityFactor) return electricityFactor;

  return undefined;
}

// Helper function to get electricity emission factor by country
export function getElectricityEmissionFactor(country: string = 'United States'): EmissionFactor {
  const factor = defaultEmissionFactors.factors.utilities.electricity[country];
  if (factor) return factor;

  // Default to US if country not found
  return defaultEmissionFactors.factors.utilities.electricity['United States'];
}

// Helper function to get building intensity data
export function getBuildingIntensity(buildingType: string): BuildingIntensity | undefined {
  return CBECS_INTENSITIES.find(b => b.buildingType === buildingType);
}

// Helper function to get fuel emission factor
export function getFuelEmissionFactor(fuelType: string): EmissionFactor | undefined {
  return defaultEmissionFactors.factors.fuel[fuelType];
}

// Hotel/Housing energy consumption (kWh per year)
export interface HotelEnergyConsumption {
  roomType: string;
  kWhPerYear: number;
  squareFootage?: number;
  source: string;
  year: number;
}

export const HOTEL_ENERGY_CONSUMPTION: HotelEnergyConsumption[] = [
  {
    roomType: 'Economy Hotel',
    kWhPerYear: 5515.85,
    squareFootage: 535,
    source: 'hotel_casino_analysis.pdf, Table 16 & 17',
    year: 2005
  },
  {
    roomType: 'Midscale Hotel',
    kWhPerYear: 10869.92,
    squareFootage: 656,
    source: 'hotel_casino_analysis.pdf, Table 16 & 18',
    year: 2005
  },
  {
    roomType: 'Upscale Hotel',
    kWhPerYear: 12596.32,
    squareFootage: 842,
    source: 'hotel_casino_analysis.pdf, Table 16 & 19',
    year: 2005
  },
  {
    roomType: 'Luxury Hotel',
    kWhPerYear: 16452.9,
    squareFootage: 905,
    source: 'hotel_casino_analysis.pdf, Table 16 & 20',
    year: 2005
  },
  {
    roomType: 'Average House',
    kWhPerYear: 10720,
    source: 'Residential Energy Consumption Survey (RECS) 2015',
    year: 2015
  },
  {
    roomType: 'Apartment/Condo',
    kWhPerYear: 6040,
    source: 'Residential Energy Consumption Survey (RECS) 2015',
    year: 2015
  },
  {
    roomType: 'Large House',
    kWhPerYear: 14210,
    source: 'Residential Energy Consumption Survey (RECS) 2015',
    year: 2015
  }
];

// Helper function to get hotel energy consumption
export function getHotelEnergyConsumption(roomType: string): HotelEnergyConsumption | undefined {
  return HOTEL_ENERGY_CONSUMPTION.find(h => h.roomType === roomType);
}

// Equipment category mapping
export const EQUIPMENT_CATEGORIES: Record<string, 'Vehicle' | 'Equipment'> = {
  'Cars': 'Vehicle',
  'Motorcycles': 'Vehicle',
  'Buses': 'Vehicle',
  'Vans, Pickups, SUVs': 'Vehicle',
  'Trucks (<18 wheel)': 'Vehicle',
  'Fueler Truck': 'Vehicle',
  '18 Wheelers': 'Vehicle',
  'All Vehicles': 'Vehicle',
  'Hybrid SUVs': 'Vehicle',
  'Hybrid Cars': 'Vehicle',
  'Boat': 'Equipment',
  'Generator': 'Equipment',
  'Trailer': 'Equipment',
  'Cooking Equipment': 'Equipment',
  'Lift': 'Equipment',
  'Heater': 'Equipment',
  'Other': 'Equipment'
};

// Helper function to determine flight distance classification
export function getFlightDistanceClass(distanceMiles: number): 'short' | 'medium' | 'long' {
  if (distanceMiles < 288) return 'short';
  if (distanceMiles < 688) return 'medium';
  return 'long';
}

// CBECs Building Energy Intensity Data (2018)
// Commercial Buildings Energy Consumption Survey
// Values are per square foot per year
export interface BuildingIntensity {
  buildingType: string;
  electricityKWhPerSqFt: number;
  naturalGasCfPerSqFt: number;
  fuelOilGallonsPerSqFt: number;
}

export const CBECS_INTENSITIES: BuildingIntensity[] = [
  {
    buildingType: 'Education',
    electricityKWhPerSqFt: 9.4,
    naturalGasCfPerSqFt: 30.8,
    fuelOilGallonsPerSqFt: 0.0787
  },
  {
    buildingType: 'Studio',
    electricityKWhPerSqFt: 29.1, // Using 'Other' category
    naturalGasCfPerSqFt: 29.2,
    fuelOilGallonsPerSqFt: 0.044
  },
  {
    buildingType: 'Warehouse',
    electricityKWhPerSqFt: 5.8,
    naturalGasCfPerSqFt: 18.6,
    fuelOilGallonsPerSqFt: 0.0
  },
  {
    buildingType: 'Retail',
    electricityKWhPerSqFt: 13.7,
    naturalGasCfPerSqFt: 23.3,
    fuelOilGallonsPerSqFt: 0.0587
  },
  {
    buildingType: 'Hotel/Motel',
    electricityKWhPerSqFt: 14.4,
    naturalGasCfPerSqFt: 37.0,
    fuelOilGallonsPerSqFt: 0.0209
  },
  {
    buildingType: 'Restaurant',
    electricityKWhPerSqFt: 43.8,
    naturalGasCfPerSqFt: 147.6,
    fuelOilGallonsPerSqFt: 0.0
  },
  {
    buildingType: 'Healthcare',
    electricityKWhPerSqFt: 23.8,
    naturalGasCfPerSqFt: 59.1,
    fuelOilGallonsPerSqFt: 0.0242
  },
  {
    buildingType: 'Office',
    electricityKWhPerSqFt: 13.6,
    naturalGasCfPerSqFt: 21.3,
    fuelOilGallonsPerSqFt: 0.0155
  },
  {
    buildingType: 'Other',
    electricityKWhPerSqFt: 29.1,
    naturalGasCfPerSqFt: 29.2,
    fuelOilGallonsPerSqFt: 0.044
  }
];

// Unit conversion constants
export const CONVERSION_FACTORS = {
  // Distance
  KM_TO_MILES: 0.621371,
  MILES_TO_KM: 1.60934,

  // Volume
  LITERS_TO_GALLONS: 0.264172,
  GALLONS_TO_LITERS: 3.78541,

  // Mass
  KG_TO_METRIC_TONS: 0.001,
  METRIC_TONS_TO_KG: 1000,

  // Area
  SQ_METERS_TO_SQ_FEET: 10.7639,
  SQ_FEET_TO_SQ_METERS: 0.092903,
  SQ_YARDS_TO_SQ_FEET: 9,
  SQ_FEET_TO_SQ_YARDS: 0.111111,
  ACRES_TO_SQ_FEET: 43560,
  SQ_FEET_TO_ACRES: 0.0000229568,

  // Natural Gas
  CUBIC_METERS_TO_CUBIC_FEET: 35.3147,
  CUBIC_FEET_TO_CUBIC_METERS: 0.0283168,
  CCF_TO_CUBIC_FEET: 100, // 1 ccf = 100 cubic feet
  CCM_TO_CUBIC_METERS: 100, // 1 ccm = 100 cubic meters
  THERMS_TO_CUBIC_FEET: 96.7, // 1 therm ≈ 96.7 cubic feet of natural gas
  KWH_TO_CUBIC_FEET_GAS: 3.412, // 1 kWh ≈ 3.412 cubic feet of natural gas (approximate)

  // Fuel Oil
  LITERS_TO_GALLONS_OIL: 0.264172,
  GALLONS_TO_LITERS_OIL: 3.78541,
  BTU_TO_GALLONS_OIL: 0.00000719, // 1 Btu ≈ 0.00000719 gallons of fuel oil
  MEGAJOULES_TO_LITERS_OIL: 0.0263, // 1 MJ ≈ 0.0263 liters
  GIGAJOULES_TO_LITERS_OIL: 26.3 // 1 GJ ≈ 26.3 liters
};

/**
 * Get commercial travel emission factor based on transport type
 * For flights, automatically determines classification based on distance
 */
export function getCommercialTravelEmissionFactor(
  transportType: string,
  distanceInMiles?: number
): EmissionFactor {
  switch (transportType) {
    case 'Flight': {
      // Determine flight classification based on distance
      if (distanceInMiles === undefined) {
        return defaultEmissionFactors.factors.air.average;
      } else if (distanceInMiles < 287.7) {
        return defaultEmissionFactors.factors.air.short;
      } else if (distanceInMiles <= 688.5) {
        return defaultEmissionFactors.factors.air.medium;
      } else {
        return defaultEmissionFactors.factors.air.long;
      }
    }
    case 'National rail':
      return defaultEmissionFactors.factors.rail.national;
    case 'International rail':
      return defaultEmissionFactors.factors.rail.international;
    case 'Light rail and tram':
      return defaultEmissionFactors.factors.rail.lightRail;
    case 'Ferry':
      return defaultEmissionFactors.factors.ferry.average;
    default:
      throw new Error(`Unknown transport type: ${transportType}`);
  }
}

/**
 * Determine flight classification based on distance in miles
 */
export function getFlightClassification(distanceInMiles: number): string {
  if (distanceInMiles < 287.7) {
    return 'Short';
  } else if (distanceInMiles <= 688.5) {
    return 'Medium';
  } else {
    return 'Long';
  }
}

/**
 * Charter & Helicopter Aircraft Data
 * Source: ComTravel sheet, PEAR 4.2.9
 */
export interface AircraftData {
  aircraftType: string;
  fuelType: 'jet fuel' | 'aviation gasoline';
  gallonsPerHour: number;
  milesPerGallon: number;
  emissionFactorPerGallon: number; // kg CO2e per gallon
}

export const CHARTER_AIRCRAFT_DATA: AircraftData[] = [
  {
    aircraftType: 'Chartered Commercial Jet',
    fuelType: 'jet fuel',
    gallonsPerHour: 950,
    milesPerGallon: 0.4,
    emissionFactorPerGallon: 9.625 // Jet Fuel EF
  },
  {
    aircraftType: 'Large Private Jet',
    fuelType: 'jet fuel',
    gallonsPerHour: 440,
    milesPerGallon: 1.3,
    emissionFactorPerGallon: 9.625 // Jet Fuel EF
  },
  {
    aircraftType: 'Small Private Jet',
    fuelType: 'jet fuel',
    gallonsPerHour: 220,
    milesPerGallon: 4.0,
    emissionFactorPerGallon: 9.625 // Jet Fuel EF
  },
  {
    aircraftType: 'Helicopter',
    fuelType: 'aviation gasoline',
    gallonsPerHour: 50,
    milesPerGallon: 1.7,
    emissionFactorPerGallon: 8.824 // Aviation Gasoline EF
  }
];

/**
 * Get aircraft data by type
 */
export function getAircraftData(aircraftType: string): AircraftData {
  const data = CHARTER_AIRCRAFT_DATA.find(a => a.aircraftType === aircraftType);
  if (!data) {
    throw new Error(`Unknown aircraft type: ${aircraftType}`);
  }
  return data;
}
