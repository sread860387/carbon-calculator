/**
 * Fuel Calculator
 * Calculates emissions from equipment and vehicle fuel usage
 * Based on "3-Fuel" sheet from PEAR 4.2.9
 */

import type {
  FuelEntry,
  FuelResult,
  FuelModuleResults,
  FuelUnit,
  EquipmentType
} from '../../types/fuel.types';
import {
  defaultEmissionFactors,
  getFuelEmissionFactor,
  EQUIPMENT_CATEGORIES,
  CONVERSION_FACTORS
} from '../../config/emissionFactors';

// Average fuel efficiency by vehicle type (miles per gallon)
const VEHICLE_FUEL_EFFICIENCY: Record<string, number> = {
  'Cars': 25,
  'Motorcycles': 45,
  'Buses': 6,
  'Vans, Pickups, SUVs': 18,
  'Trucks (<18 wheel)': 10,
  'Fueler Truck': 8,
  '18 Wheelers': 6,
  'All Vehicles': 20,
  'Hybrid SUVs': 30,
  'Hybrid Cars': 45
};

class FuelCalculator {
  /**
   * Convert fuel amount to gallons (standard unit)
   */
  private convertFuelToGallons(amount: number, unit: FuelUnit, fuelType: string): number {
    switch (unit) {
      case 'gallons':
        return amount;
      case 'liters':
        return amount * CONVERSION_FACTORS.LITERS_TO_GALLONS;
      case 'cubic feet':
        // For gases, we need special handling
        if (fuelType === 'Natural gas') {
          // Natural gas is priced/measured differently
          // Approximate: 1000 cubic feet ≈ 11.2 gallons of gasoline equivalent
          return amount * 0.0112;
        }
        return amount * 0.00751; // General gas conversion
      case 'cubic meters':
        return amount * CONVERSION_FACTORS.CUBIC_METERS_TO_CUBIC_FEET * 0.00751;
      case 'kg':
        // Propane: 1 kg ≈ 0.51 gallons
        // Butane: 1 kg ≈ 0.43 gallons
        if (fuelType === 'Propane' || fuelType === 'LPG') {
          return amount * 0.51;
        } else if (fuelType === 'Butane') {
          return amount * 0.43;
        }
        return amount * 0.5; // Default estimate
      case 'lbs':
        // Convert lbs to kg first, then to gallons
        const kg = amount * 0.453592;
        if (fuelType === 'Propane' || fuelType === 'LPG') {
          return kg * 0.51;
        } else if (fuelType === 'Butane') {
          return kg * 0.43;
        }
        return kg * 0.5;
      case 'ccf':
        // CCF (hundred cubic feet) for natural gas
        return amount * 100 * 0.0112;
      case 'ccm':
        // CCM (hundred cubic meters)
        return amount * 100 * CONVERSION_FACTORS.CUBIC_METERS_TO_CUBIC_FEET * 0.00751;
      case 'sterno cans':
        // Sterno cans typically 7 oz (0.21 liters)
        return amount * 0.21 * CONVERSION_FACTORS.LITERS_TO_GALLONS;
      default:
        return amount;
    }
  }

  /**
   * Calculate fuel gallons from miles driven
   */
  private calculateGallonsFromMiles(miles: number, equipmentType: EquipmentType): number {
    const mpg = VEHICLE_FUEL_EFFICIENCY[equipmentType] || 20; // Default 20 MPG
    return miles / mpg;
  }

  /**
   * Calculate fuel gallons from total cost
   */
  private calculateGallonsFromCost(totalCost: number, pricePerGallon: number): number {
    if (pricePerGallon <= 0) {
      throw new Error('Average price per gallon must be greater than 0');
    }
    return totalCost / pricePerGallon;
  }

  /**
   * Calculate emissions for a single fuel entry
   */
  calculateEntry(entry: FuelEntry): FuelResult {
    let fuelGallons = 0;
    let calculationMethod = '';

    // Calculate fuel gallons based on method
    switch (entry.calculationMethod) {
      case 'amount':
        if (entry.fuelAmount && entry.fuelUnit) {
          fuelGallons = this.convertFuelToGallons(
            entry.fuelAmount,
            entry.fuelUnit,
            entry.fuelType
          );
          calculationMethod = `Direct amount: ${entry.fuelAmount} ${entry.fuelUnit}`;
        }
        break;

      case 'mileage':
        if (entry.milesDriven) {
          fuelGallons = this.calculateGallonsFromMiles(
            entry.milesDriven,
            entry.equipmentType
          );
          const mpg = VEHICLE_FUEL_EFFICIENCY[entry.equipmentType] || 20;
          calculationMethod = `Mileage: ${entry.milesDriven} miles @ ${mpg} MPG`;
        }
        break;

      case 'cost':
        if (entry.totalCost && entry.averagePricePerGallon) {
          fuelGallons = this.calculateGallonsFromCost(
            entry.totalCost,
            entry.averagePricePerGallon
          );
          calculationMethod = `Cost: $${entry.totalCost} @ $${entry.averagePricePerGallon}/gal`;
        }
        break;
    }

    // Get emission factor for fuel type
    const emissionFactor = getFuelEmissionFactor(entry.fuelType);

    if (!emissionFactor) {
      throw new Error(`No emission factor found for fuel type: ${entry.fuelType}`);
    }

    // Special handling for Natural gas (measured in cubic feet, not gallons)
    let co2e = 0;
    if (entry.fuelType === 'Natural gas' && entry.calculationMethod === 'amount') {
      // Use cubic feet directly
      if (entry.fuelUnit === 'cubic feet') {
        co2e = entry.fuelAmount! * emissionFactor.value;
      } else if (entry.fuelUnit === 'ccf') {
        co2e = entry.fuelAmount! * 100 * emissionFactor.value;
      } else if (entry.fuelUnit === 'cubic meters') {
        const cubicFeet = entry.fuelAmount! * CONVERSION_FACTORS.CUBIC_METERS_TO_CUBIC_FEET;
        co2e = cubicFeet * emissionFactor.value;
      } else {
        // For other units, use the gallon equivalent calculation
        co2e = fuelGallons * emissionFactor.value;
      }
    } else {
      // For all other fuels, use gallons * emission factor
      co2e = fuelGallons * emissionFactor.value;
    }

    return {
      entryId: entry.id,
      co2e,
      fuelGallons,
      emissionFactor: emissionFactor.value,
      calculationMethod
    };
  }

  /**
   * Calculate emissions for all fuel entries
   */
  calculateAll(entries: FuelEntry[]): FuelModuleResults {
    const results = entries.map(entry => this.calculateEntry(entry));

    // Calculate totals by equipment category
    const byEquipmentCategory = {
      Vehicle: 0,
      Equipment: 0
    };

    // Calculate totals by fuel type
    const byFuelType: Record<string, number> = {};

    entries.forEach((entry, index) => {
      const result = results[index];
      const category = EQUIPMENT_CATEGORIES[entry.equipmentType] || 'Equipment';

      byEquipmentCategory[category] += result.co2e;

      if (!byFuelType[entry.fuelType]) {
        byFuelType[entry.fuelType] = 0;
      }
      byFuelType[entry.fuelType] += result.co2e;
    });

    const totals = {
      totalCO2e: results.reduce((sum, r) => sum + r.co2e, 0),
      totalFuelGallons: results.reduce((sum, r) => sum + r.fuelGallons, 0),
      byEquipmentCategory,
      byFuelType
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

export const fuelCalculator = new FuelCalculator();
