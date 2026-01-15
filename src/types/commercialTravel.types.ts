/**
 * Commercial Travel Module Types
 * Based on "6-Commercial Travel" sheet from PEAR 4.2.9
 */

// Transport types available
export type TransportType =
  | 'Flight'
  | 'National rail'
  | 'International rail'
  | 'Light rail and tram'
  | 'Ferry';

// Flight distance classifications (automatically determined)
export type FlightClassification =
  | 'Short'    // < 287.7 miles
  | 'Medium'   // 287.7 - 688.5 miles
  | 'Long'     // > 688.5 miles
  | 'Average'; // Default/unknown

export type DistanceUnit = 'miles' | 'kilometers';

export interface CommercialTravelEntry {
  id: string;
  date: Date;
  departureCity?: string;
  arrivalCity?: string;
  transportType: TransportType;
  passengerDistance: number; // Total passenger distance (distance × passengers)
  distanceUnit: DistanceUnit;
  description?: string;
}

export interface CommercialTravelResult {
  entryId: string;
  co2e: number; // kg CO2e
  distanceInMiles: number;
  flightClassification?: FlightClassification; // Only for flights
  emissionFactor: number; // kg CO2e per passenger mile
  transportType: TransportType;
}

export interface CommercialTravelModuleResults {
  entries: CommercialTravelEntry[];
  results: CommercialTravelResult[];
  totals: {
    totalCO2e: number;
    totalPassengerMiles: number;
    byTransportType: {
      [key in TransportType]?: number; // CO2e by transport type
    };
    byFlightClassification?: {
      [key in FlightClassification]?: number; // CO2e by flight distance (flights only)
    };
  };
  metadata: {
    calculatedAt: Date;
    emissionFactorsVersion: string;
    source: string;
  };
}

// Form data (for react-hook-form)
export interface CommercialTravelFormData {
  date: string;
  departureCity?: string;
  arrivalCity?: string;
  transportType: TransportType;
  passengerDistance: string;
  distanceUnit: DistanceUnit;
  description?: string;
}
