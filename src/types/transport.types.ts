/**
 * Transport Module Types
 * Defines data structures for road, air, and rail transport emissions
 */

// Base types
export type TransportMode = 'road' | 'air' | 'rail';
export type DistanceUnit = 'km' | 'miles';

// Road Vehicle Types
export type VehicleType = 'car' | 'van' | 'truck' | 'minibus' | 'coach' | 'motorcycle';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg';

// Air Travel Types
export type FlightClass = 'economy' | 'premium-economy' | 'business' | 'first';
export type FlightType = 'domestic' | 'short-haul' | 'long-haul';

// Rail Travel Types
export type RailType = 'national' | 'international' | 'light-rail' | 'underground';

// Base transport entry interface
export interface BaseTransportEntry {
  id: string;
  date: Date;
  description?: string;
  mode: TransportMode;
}

// Road Vehicle Entry
export interface RoadVehicleEntry extends BaseTransportEntry {
  mode: 'road';
  vehicleType: VehicleType;
  fuelType: FuelType;
  distance: number;
  distanceUnit: DistanceUnit;
  passengers?: number;
  fuelConsumption?: number; // optional, for custom calculations (gallons or liters)
  fuelUnit?: 'gallons' | 'liters';
}

// Air Travel Entry
export interface AirTravelEntry extends BaseTransportEntry {
  mode: 'air';
  origin: string;
  destination: string;
  flightClass: FlightClass;
  flightType: FlightType;
  distance?: number; // can be calculated or manual
  distanceUnit: DistanceUnit;
  passengers: number;
  returnTrip: boolean;
}

// Rail Travel Entry
export interface RailTravelEntry extends BaseTransportEntry {
  mode: 'rail';
  railType: RailType;
  distance: number;
  distanceUnit: DistanceUnit;
  passengers?: number;
}

// Union type for all transport entries
export type TransportEntry = RoadVehicleEntry | AirTravelEntry | RailTravelEntry;

// Emission Calculation Result
export interface EmissionResult {
  entryId: string;
  co2e: number; // kg CO2 equivalent
  breakdown?: {
    co2?: number;
    ch4?: number;
    n2o?: number;
  };
  emissionFactor: number;
  emissionFactorUnit: string;
  calculationMethod: string;
  details?: {
    distanceMiles?: number;
    fuelConsumed?: number;
    fuelUnit?: string;
  };
}

// Transport Module Results
export interface TransportModuleResults {
  entries: TransportEntry[];
  results: EmissionResult[];
  totals: {
    totalCO2e: number;
    byMode: {
      road: number;
      air: number;
      rail: number;
    };
    byType?: Record<string, number>;
  };
  metadata: {
    calculatedAt: Date;
    emissionFactorsVersion: string;
    source: string;
  };
}

// Form data interfaces (for react-hook-form)
export interface RoadVehicleFormData {
  date: string; // ISO string
  description?: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  distance: string; // string for form input
  distanceUnit: DistanceUnit;
  passengers?: string;
  fuelConsumption?: string;
  fuelUnit?: 'gallons' | 'liters';
}

export interface AirTravelFormData {
  date: string;
  description?: string;
  origin: string;
  destination: string;
  flightClass: FlightClass;
  flightType: FlightType;
  distance?: string;
  distanceUnit: DistanceUnit;
  passengers: string;
  returnTrip: boolean;
}

export interface RailTravelFormData {
  date: string;
  description?: string;
  railType: RailType;
  distance: string;
  distanceUnit: DistanceUnit;
  passengers?: string;
}
