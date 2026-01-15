/**
 * EV Charging Calculator
 * Calculates emissions from electric vehicle charging stations
 * Based on "4-EV Charging" sheet from PEAR 4.2.9
 */

import type {
  EVChargingEntry,
  EVChargingResult,
  EVChargingModuleResults
} from '../../types/evCharging.types';
import {
  defaultEmissionFactors,
  getElectricityEmissionFactor
} from '../../config/emissionFactors';

class EVChargingCalculator {
  /**
   * Determine the region for emission factor lookup
   */
  private determineRegion(entry: EVChargingEntry): string {
    // For now, use country-level emission factors
    // In the future, could add state/province-specific lookups
    if (entry.stateProvince && entry.country === 'United States') {
      return `${entry.country} - ${entry.stateProvince}`;
    } else if (entry.stateProvince && entry.country === 'Canada') {
      return `${entry.country} - ${entry.stateProvince}`;
    } else {
      return entry.country;
    }
  }

  /**
   * Calculate emissions for a single EV charging entry
   */
  calculateEntry(entry: EVChargingEntry): EVChargingResult {
    const region = this.determineRegion(entry);

    // Get emission factor for the region/country
    const emissionFactor = getElectricityEmissionFactor(entry.country);

    // Calculate CO2e: kWh * emission factor (kg CO2e per kWh)
    const co2e = entry.electricityUsageKWh * emissionFactor.value;

    return {
      entryId: entry.id,
      co2e,
      electricityKWh: entry.electricityUsageKWh,
      emissionFactor: emissionFactor.value,
      region
    };
  }

  /**
   * Calculate emissions for all EV charging entries
   */
  calculateAll(entries: EVChargingEntry[]): EVChargingModuleResults {
    const results = entries.map(entry => this.calculateEntry(entry));

    // Calculate totals by country
    const byCountry: Record<string, number> = {};
    entries.forEach((entry, index) => {
      const result = results[index];
      if (!byCountry[entry.country]) {
        byCountry[entry.country] = 0;
      }
      byCountry[entry.country] += result.co2e;
    });

    const totals = {
      totalCO2e: results.reduce((sum, r) => sum + r.co2e, 0),
      totalElectricityKWh: results.reduce((sum, r) => sum + r.electricityKWh, 0),
      totalMilesDriven: entries.reduce((sum, e) => sum + (e.milesDriven || 0), 0),
      byCountry
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

export const evChargingCalculator = new EVChargingCalculator();
