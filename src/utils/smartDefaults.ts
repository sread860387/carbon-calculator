/**
 * Smart Defaults and Auto-population
 * Provides intelligent default values based on user history and production info
 */

interface RecentValue {
  value: string | number;
  lastUsed: Date;
  frequency: number;
}

interface RecentValues {
  [key: string]: RecentValue;
}

const STORAGE_KEY = 'carbon-calculator-recent-values';
const MAX_RECENT_AGE_DAYS = 30;

/**
 * Store a recently used value for a form field
 */
export function storeRecentValue(fieldName: string, value: string | number): void {
  const recentValues = getRecentValues();

  const existing = recentValues[fieldName];
  recentValues[fieldName] = {
    value,
    lastUsed: new Date(),
    frequency: existing ? existing.frequency + 1 : 1
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentValues));
}

/**
 * Get recently used value for a form field
 */
export function getRecentValue(fieldName: string): string | number | undefined {
  const recentValues = getRecentValues();
  const recent = recentValues[fieldName];

  if (!recent) return undefined;

  // Check if value is too old
  const daysSinceUsed = Math.floor(
    (new Date().getTime() - new Date(recent.lastUsed).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceUsed > MAX_RECENT_AGE_DAYS) {
    return undefined;
  }

  return recent.value;
}

/**
 * Get all recent values
 */
function getRecentValues(): RecentValues {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    Object.keys(parsed).forEach(key => {
      parsed[key].lastUsed = new Date(parsed[key].lastUsed);
    });

    return parsed;
  } catch {
    return {};
  }
}

/**
 * Get suggested date based on production schedule
 */
export function getSuggestedDate(productionInfo: any): Date {
  if (!productionInfo) return new Date();

  const today = new Date();

  // If production has a start date in the future, use that
  if (productionInfo.fromDate) {
    const startDate = new Date(productionInfo.fromDate);
    if (startDate > today) {
      return startDate;
    }
  }

  // If today is within production dates, use today
  if (productionInfo.fromDate && productionInfo.endDate) {
    const startDate = new Date(productionInfo.fromDate);
    const endDate = new Date(productionInfo.endDate);

    if (today >= startDate && today <= endDate) {
      return today;
    }
  }

  // Otherwise use today
  return today;
}

/**
 * Get suggested building type based on production type
 */
export function getSuggestedBuildingType(productionInfo: any): string {
  if (!productionInfo) return 'Office';

  const productionType = productionInfo.productionType?.toLowerCase();

  if (productionType === 'tv') {
    return 'Studio';
  } else if (productionType === 'film') {
    // For films, check budget or other indicators
    return 'Studio';
  }

  return 'Office';
}

/**
 * Get suggested area unit based on production country
 */
export function getSuggestedAreaUnit(productionInfo: any): string {
  if (!productionInfo) return 'square feet';

  const country = productionInfo.country?.toLowerCase();

  // US, UK use square feet; most others use square meters
  if (country === 'united states' || country === 'usa' || country === 'us' || country === 'united kingdom' || country === 'uk') {
    return 'square feet';
  }

  return 'square meters';
}

/**
 * Get suggested fuel unit based on production country
 */
export function getSuggestedFuelUnit(fuelType: string, productionInfo: any): string {
  if (!productionInfo) {
    return fuelType === 'Natural Gas' ? 'cubic feet' : 'gallons';
  }

  const country = productionInfo.country?.toLowerCase();
  const isMetric = !(country === 'united states' || country === 'usa' || country === 'us');

  if (fuelType === 'Natural Gas') {
    return isMetric ? 'cubic meters' : 'cubic feet';
  } else if (fuelType === 'Fuel Oil') {
    return isMetric ? 'liters' : 'gallons';
  }

  return 'gallons';
}

/**
 * Get suggested fuel volume unit based on production country
 */
export function getSuggestedVolumeUnit(productionInfo: any): string {
  if (!productionInfo) return 'gallons';

  const country = productionInfo.country?.toLowerCase();
  const isMetric = !(country === 'united states' || country === 'usa' || country === 'us');

  return isMetric ? 'liters' : 'gallons';
}

/**
 * Auto-populate form defaults based on production info and history
 */
export function getSmartDefaults(formType: string, productionInfo: any): Record<string, any> {
  const defaults: Record<string, any> = {};

  // Date defaults
  defaults.date = getSuggestedDate(productionInfo);

  if (formType === 'utilities') {
    // Building type from production info or last used
    defaults.buildingType = getRecentValue('buildingType') || getSuggestedBuildingType(productionInfo);

    // Area unit from production country or last used
    defaults.areaUnit = getRecentValue('areaUnit') || getSuggestedAreaUnit(productionInfo);

    // Natural gas unit from production country or last used
    defaults.naturalGasUnit = getRecentValue('naturalGasUnit') || getSuggestedFuelUnit('Natural Gas', productionInfo);

    // Fuel oil unit from production country or last used
    defaults.fuelOilUnit = getRecentValue('fuelOilUnit') || getSuggestedFuelUnit('Fuel Oil', productionInfo);

    // Method preferences from last used
    defaults.electricityMethod = getRecentValue('electricityMethod') || 'usage';
    defaults.heatMethod = getRecentValue('heatMethod') || 'none';
    defaults.heatFuel = getRecentValue('heatFuel') || 'None';

    // Location from production info
    if (productionInfo?.locations && productionInfo.locations.length > 0) {
      defaults.locationName = productionInfo.locations[0].facilityName;
    }
  }

  if (formType === 'fuel') {
    // Equipment and fuel type from last used
    defaults.equipmentType = getRecentValue('equipmentType') || 'Generator';
    defaults.fuelType = getRecentValue('fuelType') || 'Diesel Fuel';
    defaults.calculationMethod = getRecentValue('calculationMethod') || 'amount';

    // Fuel unit from production country or last used
    defaults.fuelUnit = getRecentValue('fuelUnit') || getSuggestedVolumeUnit(productionInfo);
  }

  return defaults;
}

/**
 * Clear old recent values (cleanup utility)
 */
export function clearOldRecentValues(): void {
  const recentValues = getRecentValues();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - MAX_RECENT_AGE_DAYS);

  Object.keys(recentValues).forEach(key => {
    if (new Date(recentValues[key].lastUsed) < cutoffDate) {
      delete recentValues[key];
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentValues));
}
