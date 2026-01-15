/**
 * Unit Conversion Utilities
 */

import { CONVERSION_FACTORS } from '../config/emissionFactors';

// Distance conversions
export function kmToMiles(km: number): number {
  return km * CONVERSION_FACTORS.KM_TO_MILES;
}

export function milesToKm(miles: number): number {
  return miles * CONVERSION_FACTORS.MILES_TO_KM;
}

export function convertDistance(value: number, from: 'km' | 'miles', to: 'km' | 'miles'): number {
  if (from === to) return value;
  return from === 'km' ? kmToMiles(value) : milesToKm(value);
}

// Volume conversions (fuel)
export function litersToGallons(liters: number): number {
  return liters * CONVERSION_FACTORS.LITERS_TO_GALLONS;
}

export function gallonsToLiters(gallons: number): number {
  return gallons * CONVERSION_FACTORS.GALLONS_TO_LITERS;
}

export function convertFuelVolume(value: number, from: 'liters' | 'gallons', to: 'liters' | 'gallons'): number {
  if (from === to) return value;
  return from === 'liters' ? litersToGallons(value) : gallonsToLiters(value);
}

// Mass conversions
export function kgToMetricTons(kg: number): number {
  return kg * CONVERSION_FACTORS.KG_TO_METRIC_TONS;
}

export function metricTonsToKg(tons: number): number {
  return tons * CONVERSION_FACTORS.METRIC_TONS_TO_KG;
}
