/**
 * Hotels & Housing Calculator
 * Calculates emissions from hotel stays and housing
 * Based on "5-Hotels-Housing" sheet from PEAR 4.2.9
 */

import type {
  HotelsEntry,
  HotelsResult,
  HotelsModuleResults,
  RoomType
} from '../../types/hotels.types';
import {
  defaultEmissionFactors,
  getElectricityEmissionFactor,
  getHotelEnergyConsumption
} from '../../config/emissionFactors';

class HotelsCalculator {
  /**
   * Determine the region for emission factor lookup
   */
  private determineRegion(entry: HotelsEntry): string {
    if (entry.stateProvince && entry.country === 'United States') {
      return `${entry.country} - ${entry.stateProvince}`;
    } else if (entry.stateProvince && entry.country === 'Canada') {
      return `${entry.country} - ${entry.stateProvince}`;
    } else {
      return entry.country;
    }
  }

  /**
   * Calculate emissions for a single hotel/housing entry
   *
   * Formula from Excel:
   * CO2 emissions (kg) = EF (kg CO2/kWh) × kWh/year × (Total Nights / 365)
   */
  calculateEntry(entry: HotelsEntry): HotelsResult {
    const region = this.determineRegion(entry);

    // Get emission factor for the region/country
    const emissionFactor = getElectricityEmissionFactor(entry.country);

    // Get energy consumption for room type
    const energyConsumption = getHotelEnergyConsumption(entry.roomType);

    if (!energyConsumption) {
      throw new Error(`No energy consumption data found for room type: ${entry.roomType}`);
    }

    // Calculate emissions
    // CO2e = EF (kg CO2/kWh) × kWh/year × (Total Nights / 365)
    const totalNightsInYears = entry.totalNights / 365;
    const co2e = emissionFactor.value * energyConsumption.kWhPerYear * totalNightsInYears;

    return {
      entryId: entry.id,
      co2e,
      emissionFactor: emissionFactor.value,
      kWhPerYear: energyConsumption.kWhPerYear,
      region
    };
  }

  /**
   * Calculate emissions for all hotel/housing entries
   */
  calculateAll(entries: HotelsEntry[]): HotelsModuleResults {
    const results = entries.map(entry => this.calculateEntry(entry));

    // Calculate totals by room type
    const byRoomType: Record<RoomType, number> = {} as Record<RoomType, number>;

    // Calculate totals by country
    const byCountry: Record<string, number> = {};

    entries.forEach((entry, index) => {
      const result = results[index];

      // By room type
      if (!byRoomType[entry.roomType]) {
        byRoomType[entry.roomType] = 0;
      }
      byRoomType[entry.roomType] += result.co2e;

      // By country
      if (!byCountry[entry.country]) {
        byCountry[entry.country] = 0;
      }
      byCountry[entry.country] += result.co2e;
    });

    const totals = {
      totalCO2e: results.reduce((sum, r) => sum + r.co2e, 0),
      totalNights: entries.reduce((sum, e) => sum + e.totalNights, 0),
      byRoomType,
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

export const hotelsCalculator = new HotelsCalculator();
