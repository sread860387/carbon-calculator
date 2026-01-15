/**
 * Hotels & Housing Module Types
 * Based on "5-Hotels-Housing" sheet from PEAR 4.2.9
 */

// Room/Housing types
export type RoomType =
  | 'Economy Hotel'
  | 'Midscale Hotel'
  | 'Upscale Hotel'
  | 'Luxury Hotel'
  | 'Average House'
  | 'Apartment/Condo'
  | 'Large House';

export interface HotelsEntry {
  id: string;
  date: Date;
  roomType: RoomType;
  city?: string;
  country: string;
  stateProvince?: string;

  // Total number of room nights (rooms × nights) for hotels
  // or number of nights for houses
  totalNights: number;
}

export interface HotelsResult {
  entryId: string;
  co2e: number; // kg CO2e
  emissionFactor: number; // kg CO2e per kWh
  kWhPerYear: number; // Annual energy consumption for room type
  region: string; // Determined region for emission factor
}

export interface HotelsModuleResults {
  entries: HotelsEntry[];
  results: HotelsResult[];
  totals: {
    totalCO2e: number;
    totalNights: number;
    byRoomType: {
      [key in RoomType]?: number; // CO2e by room type
    };
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
export interface HotelsFormData {
  date: string;
  roomType: RoomType;
  city?: string;
  country: string;
  stateProvince?: string;
  totalNights: string;
}
