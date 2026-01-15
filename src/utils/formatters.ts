/**
 * Formatting Utilities
 * Functions to format numbers, dates, and other values for display
 */

import { format } from 'date-fns';

// Number formatting
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

// CO2 emissions formatting
export function formatCO2(kgCO2e: number, includeUnit: boolean = true): string {
  const formatted = formatNumber(kgCO2e, 2);
  return includeUnit ? `${formatted} kg CO₂e` : formatted;
}

export function formatCO2Large(kgCO2e: number, includeUnit: boolean = true): string {
  if (kgCO2e >= 1000) {
    const tons = kgCO2e / 1000;
    const formatted = formatNumber(tons, 2);
    return includeUnit ? `${formatted} tonnes CO₂e` : formatted;
  }
  return formatCO2(kgCO2e, includeUnit);
}

// Date formatting
export function formatDate(date: Date | string, formatString: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
}

// Distance formatting
export function formatDistance(distance: number, unit: 'km' | 'miles'): string {
  return `${formatNumber(distance, 1)} ${unit}`;
}

// Percentage formatting
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${formatNumber(percentage, 1)}%`;
}

// Currency formatting (if needed for cost tracking in future)
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Label formatting
export function formatLabel(value: string): string {
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatVehicleType(type: string): string {
  const typeMap: Record<string, string> = {
    'car': 'Car',
    'van': 'Van',
    'truck': 'Truck',
    'minibus': 'Minibus',
    'coach': 'Coach',
    'motorcycle': 'Motorcycle'
  };
  return typeMap[type] || formatLabel(type);
}

export function formatFuelType(fuel: string): string {
  const fuelMap: Record<string, string> = {
    'petrol': 'Petrol/Gasoline',
    'diesel': 'Diesel',
    'electric': 'Electric',
    'hybrid': 'Hybrid',
    'lpg': 'LPG'
  };
  return fuelMap[fuel] || formatLabel(fuel);
}

export function formatFlightClass(flightClass: string): string {
  const classMap: Record<string, string> = {
    'economy': 'Economy',
    'premium-economy': 'Premium Economy',
    'business': 'Business',
    'first': 'First Class'
  };
  return classMap[flightClass] || formatLabel(flightClass);
}

export function formatRailType(railType: string): string {
  const railMap: Record<string, string> = {
    'national': 'National Rail',
    'international': 'International Rail',
    'light-rail': 'Light Rail/Tram',
    'underground': 'Underground/Metro'
  };
  return railMap[railType] || formatLabel(railType);
}
