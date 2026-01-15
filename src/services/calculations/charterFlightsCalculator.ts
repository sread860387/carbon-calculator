/**
 * Charter & Helicopter Flights Calculator
 * Calculates emissions from chartered jets and helicopter flights
 * Based on "7-Charter and Heli Flights" sheet from PEAR 4.2.9
 */

import type {
  CharterFlightsEntry,
  CharterFlightsResult,
  CharterFlightsModuleResults
} from '../../types/charterFlights.types';
import {
  defaultEmissionFactors,
  getAircraftData,
  CONVERSION_FACTORS
} from '../../config/emissionFactors';

class CharterFlightsCalculator {
  /**
   * Convert fuel amount to gallons
   */
  private convertFuelToGallons(amount: number, unit: string): number {
    if (unit === 'liters') {
      return amount * CONVERSION_FACTORS.LITERS_TO_GALLONS;
    }
    return amount; // Already in gallons
  }

  /**
   * Convert distance to miles
   */
  private convertDistanceToMiles(distance: number, unit: string): number {
    if (unit === 'kilometers') {
      return distance * CONVERSION_FACTORS.KM_TO_MILES;
    }
    return distance; // Already in miles
  }

  /**
   * Calculate fuel used based on the calculation method
   */
  private calculateFuelGallons(entry: CharterFlightsEntry): number {
    const aircraftData = getAircraftData(entry.aircraftType);

    switch (entry.calculationMethod) {
      case 'fuel':
        // Preferred Option: User provides actual fuel amount
        if (!entry.fuelAmount || !entry.fuelUnit) {
          throw new Error('Fuel amount and unit required for fuel calculation method');
        }
        return this.convertFuelToGallons(entry.fuelAmount, entry.fuelUnit);

      case 'hours':
        // Second Option: Calculate from hours flown
        if (!entry.hoursFlown) {
          throw new Error('Hours flown required for hours calculation method');
        }
        // Fuel (gal) = Hours × Gallons per Hour
        return entry.hoursFlown * aircraftData.gallonsPerHour;

      case 'distance':
        // Third Option: Calculate from distance flown
        if (!entry.distanceFlown || !entry.distanceUnit) {
          throw new Error('Distance and unit required for distance calculation method');
        }
        const distanceInMiles = this.convertDistanceToMiles(
          entry.distanceFlown,
          entry.distanceUnit
        );
        // Fuel (gal) = Distance (miles) / Miles per Gallon
        return distanceInMiles / aircraftData.milesPerGallon;

      default:
        throw new Error(`Unknown calculation method: ${entry.calculationMethod}`);
    }
  }

  /**
   * Calculate emissions for a single charter flight entry
   *
   * Formula from Excel:
   * 1. Determine fuel used (gallons) based on calculation method:
   *    - Fuel: Direct amount (convert to gallons if needed)
   *    - Hours: Fuel = Hours × Gallons/Hour
   *    - Distance: Fuel = Distance / MPG
   * 2. CO2 emissions (kg) = Fuel (gallons) × EF (kg CO2/gallon)
   */
  calculateEntry(entry: CharterFlightsEntry): CharterFlightsResult {
    const aircraftData = getAircraftData(entry.aircraftType);

    // Calculate fuel used in gallons
    const fuelUsedGallons = this.calculateFuelGallons(entry);

    // Calculate emissions
    // CO2e = Fuel (gallons) × Emission Factor (kg CO2/gallon)
    const co2e = fuelUsedGallons * aircraftData.emissionFactorPerGallon;

    return {
      entryId: entry.id,
      co2e,
      fuelUsedGallons,
      emissionFactor: aircraftData.emissionFactorPerGallon,
      calculationMethod: entry.calculationMethod,
      aircraftType: entry.aircraftType
    };
  }

  /**
   * Calculate emissions for all charter flight entries
   */
  calculateAll(entries: CharterFlightsEntry[]): CharterFlightsModuleResults {
    const results = entries.map(entry => this.calculateEntry(entry));

    // Calculate totals by aircraft type
    const byAircraftType: Record<string, number> = {};

    // Calculate totals by calculation method
    const byCalculationMethod: Record<string, number> = {};

    // Calculate total hours and distance
    let totalHoursFlown = 0;
    let totalDistanceFlown = 0;

    entries.forEach((entry, index) => {
      const result = results[index];

      // By aircraft type
      if (!byAircraftType[entry.aircraftType]) {
        byAircraftType[entry.aircraftType] = 0;
      }
      byAircraftType[entry.aircraftType] += result.co2e;

      // By calculation method
      if (!byCalculationMethod[entry.calculationMethod]) {
        byCalculationMethod[entry.calculationMethod] = 0;
      }
      byCalculationMethod[entry.calculationMethod] += result.co2e;

      // Track hours and distance
      if (entry.hoursFlown) {
        totalHoursFlown += entry.hoursFlown;
      }
      if (entry.distanceFlown && entry.distanceUnit) {
        totalDistanceFlown += this.convertDistanceToMiles(
          entry.distanceFlown,
          entry.distanceUnit
        );
      }
    });

    const totals = {
      totalCO2e: results.reduce((sum, r) => sum + r.co2e, 0),
      totalFuelGallons: results.reduce((sum, r) => sum + r.fuelUsedGallons, 0),
      totalHoursFlown,
      totalDistanceFlown,
      byAircraftType,
      byCalculationMethod
    };

    return {
      entries,
      results,
      totals,
      metadata: {
        calculatedAt: new Date(),
        emissionFactorsVersion: defaultEmissionFactors.version,
        source: defaultEmissionFactors.source
      }
    };
  }
}

export const charterFlightsCalculator = new CharterFlightsCalculator();
