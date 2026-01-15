/**
 * Commercial Travel Calculator
 * Calculates emissions from commercial flights, rail, and ferry travel
 * Based on "6-Commercial Travel" sheet from PEAR 4.2.9
 */

import type {
  CommercialTravelEntry,
  CommercialTravelResult,
  CommercialTravelModuleResults,
  FlightClassification
} from '../../types/commercialTravel.types';
import {
  defaultEmissionFactors,
  getCommercialTravelEmissionFactor,
  getFlightClassification,
  CONVERSION_FACTORS
} from '../../config/emissionFactors';

class CommercialTravelCalculator {
  /**
   * Convert distance to miles based on unit
   */
  private convertToMiles(distance: number, unit: string): number {
    if (unit === 'kilometers') {
      return distance * CONVERSION_FACTORS.KM_TO_MILES;
    }
    return distance; // Already in miles
  }

  /**
   * Calculate emissions for a single commercial travel entry
   *
   * Formula from Excel:
   * 1. Convert distance to miles (if needed)
   * 2. Determine flight classification (for flights only)
   * 3. Get emission factor based on transport type and classification
   * 4. CO2 emissions (kg) = Distance (miles) × EF (kg CO2/passenger mile)
   */
  calculateEntry(entry: CommercialTravelEntry): CommercialTravelResult {
    // Convert distance to miles
    const distanceInMiles = this.convertToMiles(
      entry.passengerDistance,
      entry.distanceUnit
    );

    // Get emission factor
    const emissionFactor = getCommercialTravelEmissionFactor(
      entry.transportType,
      distanceInMiles
    );

    // Calculate emissions
    // CO2e = Distance (passenger miles) × EF (kg CO2/passenger mile)
    const co2e = distanceInMiles * emissionFactor.value;

    // Determine flight classification if it's a flight
    let flightClassification: FlightClassification | undefined;
    if (entry.transportType === 'Flight') {
      flightClassification = getFlightClassification(distanceInMiles) as FlightClassification;
    }

    return {
      entryId: entry.id,
      co2e,
      distanceInMiles,
      flightClassification,
      emissionFactor: emissionFactor.value,
      transportType: entry.transportType
    };
  }

  /**
   * Calculate emissions for all commercial travel entries
   */
  calculateAll(entries: CommercialTravelEntry[]): CommercialTravelModuleResults {
    const results = entries.map(entry => this.calculateEntry(entry));

    // Calculate totals by transport type
    const byTransportType: Record<string, number> = {};

    // Calculate totals by flight classification (flights only)
    const byFlightClassification: Record<string, number> = {};

    entries.forEach((entry, index) => {
      const result = results[index];

      // By transport type
      if (!byTransportType[entry.transportType]) {
        byTransportType[entry.transportType] = 0;
      }
      byTransportType[entry.transportType] += result.co2e;

      // By flight classification (flights only)
      if (entry.transportType === 'Flight' && result.flightClassification) {
        if (!byFlightClassification[result.flightClassification]) {
          byFlightClassification[result.flightClassification] = 0;
        }
        byFlightClassification[result.flightClassification] += result.co2e;
      }
    });

    const totals = {
      totalCO2e: results.reduce((sum, r) => sum + r.co2e, 0),
      totalPassengerMiles: results.reduce((sum, r) => sum + r.distanceInMiles, 0),
      byTransportType,
      byFlightClassification: Object.keys(byFlightClassification).length > 0
        ? byFlightClassification
        : undefined
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

export const commercialTravelCalculator = new CommercialTravelCalculator();
