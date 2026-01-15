/**
 * Utilities Calculator
 * Calculates emissions from electricity and heating fuel usage
 * Based on "2-Utilities" sheet from PEAR 4.2.9
 */

import type {
  UtilitiesEntry,
  UtilitiesResult,
  UtilitiesModuleResults,
  AreaUnit,
  NaturalGasUnit,
  FuelOilUnit
} from '../../types/utilities.types';
import {
  defaultEmissionFactors,
  getElectricityEmissionFactor,
  getBuildingIntensity,
  CONVERSION_FACTORS
} from '../../config/emissionFactors';

class UtilitiesCalculator {
  /**
   * Convert area to square feet (standard unit for CBECs data)
   */
  private convertAreaToSquareFeet(area: number, unit: AreaUnit): number {
    switch (unit) {
      case 'square feet':
        return area;
      case 'square meters':
        return area * CONVERSION_FACTORS.SQ_METERS_TO_SQ_FEET;
      case 'square yards':
        return area * CONVERSION_FACTORS.SQ_YARDS_TO_SQ_FEET;
      case 'acres':
        return area * CONVERSION_FACTORS.ACRES_TO_SQ_FEET;
      default:
        return area;
    }
  }

  /**
   * Convert natural gas to cubic feet (standard unit)
   */
  private convertNaturalGasToCubicFeet(amount: number, unit: NaturalGasUnit): number {
    switch (unit) {
      case 'cubic feet':
        return amount;
      case 'cubic meters':
        return amount * CONVERSION_FACTORS.CUBIC_METERS_TO_CUBIC_FEET;
      case 'ccf':
        return amount * CONVERSION_FACTORS.CCF_TO_CUBIC_FEET;
      case 'ccm':
        return amount * CONVERSION_FACTORS.CCM_TO_CUBIC_METERS * CONVERSION_FACTORS.CUBIC_METERS_TO_CUBIC_FEET;
      case 'therms':
        return amount * CONVERSION_FACTORS.THERMS_TO_CUBIC_FEET;
      case 'kWh':
        return amount * CONVERSION_FACTORS.KWH_TO_CUBIC_FEET_GAS;
      default:
        return amount;
    }
  }

  /**
   * Convert fuel oil to gallons (standard unit)
   */
  private convertFuelOilToGallons(amount: number, unit: FuelOilUnit): number {
    switch (unit) {
      case 'gallons':
        return amount;
      case 'liters':
        return amount * CONVERSION_FACTORS.LITERS_TO_GALLONS_OIL;
      case 'Btu':
        return amount * CONVERSION_FACTORS.BTU_TO_GALLONS_OIL;
      case 'Megajoules':
        return amount * CONVERSION_FACTORS.MEGAJOULES_TO_LITERS_OIL * CONVERSION_FACTORS.LITERS_TO_GALLONS_OIL;
      case 'Gigajoules':
        return amount * CONVERSION_FACTORS.GIGAJOULES_TO_LITERS_OIL * CONVERSION_FACTORS.LITERS_TO_GALLONS_OIL;
      default:
        return amount;
    }
  }

  /**
   * Calculate electricity usage (kWh) based on method
   */
  private calculateElectricityUsage(entry: UtilitiesEntry): number {
    if (entry.electricityMethod === 'none') {
      return 0;
    }

    // Preferred method: actual usage
    if (entry.electricityMethod === 'usage' && entry.electricityUsage) {
      return entry.electricityUsage;
    }

    // Area-based estimation
    if (entry.electricityMethod === 'area' && entry.area && entry.areaUnit) {
      const squareFeet = this.convertAreaToSquareFeet(entry.area, entry.areaUnit);
      const intensity = getBuildingIntensity(entry.buildingType);

      if (!intensity) {
        console.warn(`No intensity data for building type: ${entry.buildingType}`);
        return 0;
      }

      // Annual intensity * square feet * (days occupied / 365)
      const daysOccupied = entry.daysOccupied || 365;
      const annualKWh = intensity.electricityKWhPerSqFt * squareFeet;
      return annualKWh * (daysOccupied / 365);
    }

    return 0;
  }

  /**
   * Calculate heating fuel usage in standard units
   */
  private calculateHeatingUsage(entry: UtilitiesEntry): {
    naturalGasCubicFeet: number;
    fuelOilGallons: number;
  } {
    let naturalGasCubicFeet = 0;
    let fuelOilGallons = 0;

    if (entry.heatFuel === 'None' || entry.heatFuel === 'Inc. in Elec.') {
      return { naturalGasCubicFeet, fuelOilGallons };
    }

    if (entry.heatMethod === 'none') {
      return { naturalGasCubicFeet, fuelOilGallons };
    }

    // Natural Gas
    if (entry.heatFuel === 'Natural Gas') {
      if (entry.heatMethod === 'usage' && entry.naturalGasUsage && entry.naturalGasUnit) {
        naturalGasCubicFeet = this.convertNaturalGasToCubicFeet(
          entry.naturalGasUsage,
          entry.naturalGasUnit
        );
      } else if (entry.heatMethod === 'area' && entry.area && entry.areaUnit) {
        const squareFeet = this.convertAreaToSquareFeet(entry.area, entry.areaUnit);
        const intensity = getBuildingIntensity(entry.buildingType);

        if (intensity) {
          const daysOccupied = entry.daysOccupied || 365;
          const annualCf = intensity.naturalGasCfPerSqFt * squareFeet;
          naturalGasCubicFeet = annualCf * (daysOccupied / 365);
        }
      }
    }

    // Fuel Oil
    if (entry.heatFuel === 'Fuel Oil') {
      if (entry.heatMethod === 'usage' && entry.fuelOilUsage && entry.fuelOilUnit) {
        fuelOilGallons = this.convertFuelOilToGallons(
          entry.fuelOilUsage,
          entry.fuelOilUnit
        );
      } else if (entry.heatMethod === 'area' && entry.area && entry.areaUnit) {
        const squareFeet = this.convertAreaToSquareFeet(entry.area, entry.areaUnit);
        const intensity = getBuildingIntensity(entry.buildingType);

        if (intensity) {
          const daysOccupied = entry.daysOccupied || 365;
          const annualGallons = intensity.fuelOilGallonsPerSqFt * squareFeet;
          fuelOilGallons = annualGallons * (daysOccupied / 365);
        }
      }
    }

    return { naturalGasCubicFeet, fuelOilGallons };
  }

  /**
   * Calculate emissions for a single utilities entry
   */
  calculateEntry(entry: UtilitiesEntry): UtilitiesResult {
    // Calculate electricity usage and emissions
    const electricityKWh = this.calculateElectricityUsage(entry);
    const electricityFactor = getElectricityEmissionFactor('United States'); // TODO: Make location-based
    const electricityEmissions = electricityKWh * electricityFactor.value;

    // Calculate heating usage and emissions
    const { naturalGasCubicFeet, fuelOilGallons } = this.calculateHeatingUsage(entry);

    let heatEmissions = 0;
    let heatFuelConverted = 0;

    if (entry.heatFuel === 'Natural Gas') {
      // Convert cubic feet to cubic meters for emission factor
      const cubicMeters = naturalGasCubicFeet * CONVERSION_FACTORS.CUBIC_FEET_TO_CUBIC_METERS;
      const ngFactor = defaultEmissionFactors.factors.utilities.naturalGas;
      heatEmissions = cubicMeters * ngFactor.value;
      heatFuelConverted = naturalGasCubicFeet;
    } else if (entry.heatFuel === 'Fuel Oil') {
      // Convert gallons to liters for emission factor
      const liters = fuelOilGallons * CONVERSION_FACTORS.GALLONS_TO_LITERS_OIL;
      const foFactor = defaultEmissionFactors.factors.utilities.fuelOil;
      heatEmissions = liters * foFactor.value;
      heatFuelConverted = fuelOilGallons;
    }

    // Build calculation method description
    let calculationMethod = '';
    if (entry.electricityMethod === 'usage') {
      calculationMethod += 'Electricity: Direct usage';
    } else if (entry.electricityMethod === 'area') {
      calculationMethod += `Electricity: Area-based (${entry.buildingType})`;
    }

    if (entry.heatMethod === 'usage') {
      calculationMethod += calculationMethod ? ' | ' : '';
      calculationMethod += `Heating: Direct usage (${entry.heatFuel})`;
    } else if (entry.heatMethod === 'area') {
      calculationMethod += calculationMethod ? ' | ' : '';
      calculationMethod += `Heating: Area-based (${entry.buildingType}, ${entry.heatFuel})`;
    }

    return {
      entryId: entry.id,
      electricityEmissions,
      heatEmissions,
      totalEmissions: electricityEmissions + heatEmissions,
      electricityKWh,
      heatFuelConverted: heatFuelConverted > 0 ? heatFuelConverted : undefined,
      calculationMethod: calculationMethod || 'No calculations'
    };
  }

  /**
   * Calculate emissions for all utilities entries
   */
  calculateAll(entries: UtilitiesEntry[]): UtilitiesModuleResults {
    const results = entries.map(entry => this.calculateEntry(entry));

    const totals = {
      totalCO2e: results.reduce((sum, r) => sum + r.totalEmissions, 0),
      electricityCO2e: results.reduce((sum, r) => sum + r.electricityEmissions, 0),
      heatCO2e: results.reduce((sum, r) => sum + r.heatEmissions, 0),
      totalElectricityKWh: results.reduce((sum, r) => sum + (r.electricityKWh || 0), 0)
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

export const utilitiesCalculator = new UtilitiesCalculator();
