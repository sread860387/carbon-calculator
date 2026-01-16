/**
 * Production Info Module Types
 * Based on "1-Production Info" sheet from PEAR 4.2.9
 * Captures basic production metadata
 */

export type ProductionType = 'Film' | 'TV Production';

export type FilmCategory =
  | 'Tentpole Plus ($130M+)'
  | 'Tentpole ($100M - $130M)'
  | 'Large ($75M - $100M)'
  | 'Medium ($40M - $75M)'
  | 'Small (<$40M)';

export type TVProductionType =
  | '1 Hour Scripted Drama'
  | '1/2 Hour Scripted, Single Camera'
  | '1/2 Hour Scripted Multi-Camera'
  | 'Unscripted Reality'
  | 'Unscripted Variety'
  | 'Unscripted Documentary'
  | 'Unscripted Natural History';

export type Currency = 'USD' | 'CAD' | 'GBP' | 'EUR' | 'AUD' | 'Other';

export type FacilityType =
  | 'On Location'
  | 'Office'
  | 'Warehouse'
  | 'Virtual Production Stage'
  | 'Stage(s)'
  | 'Other Paid Utilities';

export interface ProductionLocation {
  id: string;
  facilityName: string;
  facilityType: FacilityType;
  country: string;
  stateProvince?: string;
  zipCode?: string;
  address?: string;
  fromDate?: Date;
  endDate?: Date;
}

export interface ProductionInfo {
  // Basic Info
  productionType: ProductionType;
  productionName: string;

  // Dates
  firstShootDate?: Date;
  lastShootDate?: Date;
  startDate?: Date;  // Alias for firstShootDate
  endDate?: Date;    // Alias for lastShootDate

  // Film-specific
  filmCategory?: FilmCategory;
  totalShootDays?: number;
  firstUnitShootDays?: number;
  secondUnitShootDays?: number;
  additionalPhotographyDays?: number;

  // TV-specific
  tvProductionType?: TVProductionType;
  numberOfEpisodes?: number;

  // Location Info
  region?: string;
  country?: string;
  mainProductionOfficeLocation?: string;
  headquarterStateProvince?: string;

  // Schedule
  prepDays?: number;
  wrapDays?: number;
  onLocationDays?: number;
  stageDays?: number;

  // Financial
  currency?: Currency;

  // Contact Info
  calculatorContactName?: string;
  calculatorContactPhone?: string;
  calculatorContactDate?: Date;
  coordinatorSignOffName?: string;
  coordinatorSignOffDate?: Date;

  // Facilities and Locations
  locations: ProductionLocation[];

  // Metadata
  lastUpdated: Date;
}

// Form data (for react-hook-form)
export interface ProductionInfoFormData {
  productionType: ProductionType;
  productionName: string;
  firstShootDate?: string;
  lastShootDate?: string;
  filmCategory?: FilmCategory;
  totalShootDays?: string;
  firstUnitShootDays?: string;
  secondUnitShootDays?: string;
  additionalPhotographyDays?: string;
  tvProductionType?: TVProductionType;
  numberOfEpisodes?: string;
  region?: string;
  mainProductionOfficeLocation?: string;
  headquarterStateProvince?: string;
  prepDays?: string;
  wrapDays?: string;
  onLocationDays?: string;
  stageDays?: string;
  currency?: Currency;
  calculatorContactName?: string;
  calculatorContactPhone?: string;
  coordinatorSignOffName?: string;
}
