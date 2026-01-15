/**
 * Transport Calculation Engine
 * Implements emission calculations based on Excel formulas from PEAR 4.2.9
 */

import type {
  TransportEntry,
  RoadVehicleEntry,
  AirTravelEntry,
  RailTravelEntry,
  EmissionResult,
  TransportModuleResults
} from '../../types/transport.types';
import { defaultEmissionFactors, getFlightDistanceClass, CONVERSION_FACTORS } from '../../config/emissionFactors';
import { convertDistance } from '../../utils/converters';

export class TransportCalculator {
  /**
   * Calculate emissions for a road vehicle entry
   * Formula from Excel: emissions = fuel_consumed * emission_factor
   * OR: emissions = distance * fuel_consumption_rate * emission_factor
   */
  calculateRoadVehicle(entry: RoadVehicleEntry): EmissionResult {
    const { fuelType, distance, distanceUnit, fuelConsumption, fuelUnit } = entry;

    // Get emission factor for fuel type
    const emissionFactorConfig = defaultEmissionFactors.factors.road.fuel[fuelType];

    if (!emissionFactorConfig) {
      throw new Error(`Unknown fuel type: ${fuelType}`);
    }

    let co2e = 0;
    let calculationMethod = '';
    let fuelConsumed = 0;

    // Method 1: User provided fuel consumption directly
    if (fuelConsumption && fuelConsumption > 0) {
      // Convert fuel to gallons if needed
      fuelConsumed = fuelUnit === 'liters'
        ? fuelConsumption * CONVERSION_FACTORS.LITERS_TO_GALLONS
        : fuelConsumption;

      co2e = fuelConsumed * emissionFactorConfig.value;
      calculationMethod = `Fuel consumption method: ${fuelConsumption} ${fuelUnit} × ${emissionFactorConfig.value} kg CO₂e/gallon`;
    }
    // Method 2: Calculate based on distance (would need MPG data, not implemented yet)
    else {
      // For now, we'll use a simplified approach
      // In a full implementation, this would use vehicle-specific MPG data
      const distanceMiles = convertDistance(distance, distanceUnit, 'miles');

      // Simplified: assume average fuel consumption
      // Real implementation would use MPG lookup table from Excel
      const averageMPG = 25; // placeholder
      fuelConsumed = distanceMiles / averageMPG;

      co2e = fuelConsumed * emissionFactorConfig.value;
      calculationMethod = `Distance method: ${distance} ${distanceUnit} (${distanceMiles.toFixed(1)} miles) ÷ ${averageMPG} MPG × ${emissionFactorConfig.value} kg CO₂e/gallon`;
    }

    return {
      entryId: entry.id,
      co2e,
      emissionFactor: emissionFactorConfig.value,
      emissionFactorUnit: emissionFactorConfig.unit,
      calculationMethod,
      details: {
        distanceMiles: convertDistance(distance, distanceUnit, 'miles'),
        fuelConsumed,
        fuelUnit: 'gallons'
      }
    };
  }

  /**
   * Calculate emissions for air travel entry
   * Formula from Excel: emissions = distance_miles * emission_factor * passengers
   * Distance classification determines which emission factor to use
   */
  calculateAirTravel(entry: AirTravelEntry): EmissionResult {
    const { distance, distanceUnit, passengers, returnTrip } = entry;

    if (!distance || distance <= 0) {
      throw new Error('Distance is required for air travel calculations');
    }

    // Convert distance to miles
    let distanceMiles = convertDistance(distance, distanceUnit, 'miles');

    // Double distance if return trip
    if (returnTrip) {
      distanceMiles *= 2;
    }

    // Determine flight distance class and get appropriate emission factor
    const flightClass = getFlightDistanceClass(distanceMiles);
    const emissionFactorConfig = defaultEmissionFactors.factors.air[flightClass];

    // Calculate total passenger-miles
    const passengerMiles = distanceMiles * passengers;

    // Calculate emissions: passenger-miles * emission factor
    const co2e = passengerMiles * emissionFactorConfig.value;

    const calculationMethod = returnTrip
      ? `${distance} ${distanceUnit} × 2 (return) × ${passengers} passengers × ${emissionFactorConfig.value} kg CO₂e/pass-mile (${flightClass} flight)`
      : `${distance} ${distanceUnit} × ${passengers} passengers × ${emissionFactorConfig.value} kg CO₂e/pass-mile (${flightClass} flight)`;

    return {
      entryId: entry.id,
      co2e,
      emissionFactor: emissionFactorConfig.value,
      emissionFactorUnit: emissionFactorConfig.unit,
      calculationMethod,
      details: {
        distanceMiles,
        fuelConsumed: undefined,
        fuelUnit: undefined
      }
    };
  }

  /**
   * Calculate emissions for rail travel entry
   * Formula from Excel: emissions = distance_miles * emission_factor * passengers
   */
  calculateRailTravel(entry: RailTravelEntry): EmissionResult {
    const { railType, distance, distanceUnit, passengers = 1 } = entry;

    // Convert distance to miles
    const distanceMiles = convertDistance(distance, distanceUnit, 'miles');

    // Get emission factor for rail type
    const emissionFactorConfig = defaultEmissionFactors.factors.rail[railType];

    if (!emissionFactorConfig) {
      throw new Error(`Unknown rail type: ${railType}`);
    }

    // Calculate total passenger-miles
    const passengerMiles = distanceMiles * passengers;

    // Calculate emissions: passenger-miles * emission factor
    const co2e = passengerMiles * emissionFactorConfig.value;

    const calculationMethod = `${distance} ${distanceUnit} × ${passengers} passengers × ${emissionFactorConfig.value} kg CO₂e/pass-mile`;

    return {
      entryId: entry.id,
      co2e,
      emissionFactor: emissionFactorConfig.value,
      emissionFactorUnit: emissionFactorConfig.unit,
      calculationMethod,
      details: {
        distanceMiles,
        fuelConsumed: undefined,
        fuelUnit: undefined
      }
    };
  }

  /**
   * Calculate emissions for any transport entry
   */
  calculateEntry(entry: TransportEntry): EmissionResult {
    switch (entry.mode) {
      case 'road':
        return this.calculateRoadVehicle(entry);
      case 'air':
        return this.calculateAirTravel(entry);
      case 'rail':
        return this.calculateRailTravel(entry);
      default:
        throw new Error(`Unknown transport mode: ${(entry as any).mode}`);
    }
  }

  /**
   * Calculate emissions for all entries and aggregate results
   */
  calculateAll(entries: TransportEntry[]): TransportModuleResults {
    const results: EmissionResult[] = entries.map(entry => this.calculateEntry(entry));

    // Calculate totals
    const totalCO2e = results.reduce((sum, result) => sum + result.co2e, 0);

    // Calculate totals by mode
    const byMode = {
      road: 0,
      air: 0,
      rail: 0
    };

    entries.forEach((entry, index) => {
      byMode[entry.mode] += results[index].co2e;
    });

    // Calculate totals by type (vehicle type, flight class, rail type)
    const byType: Record<string, number> = {};
    entries.forEach((entry, index) => {
      let typeKey: string;
      if (entry.mode === 'road') {
        typeKey = `${entry.vehicleType}-${entry.fuelType}`;
      } else if (entry.mode === 'air') {
        typeKey = entry.flightType;
      } else {
        typeKey = entry.railType;
      }

      byType[typeKey] = (byType[typeKey] || 0) + results[index].co2e;
    });

    return {
      entries,
      results,
      totals: {
        totalCO2e,
        byMode,
        byType
      },
      metadata: {
        calculatedAt: new Date(),
        emissionFactorsVersion: defaultEmissionFactors.version,
        source: defaultEmissionFactors.source
      }
    };
  }
}

// Export a singleton instance
export const transportCalculator = new TransportCalculator();
