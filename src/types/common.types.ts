/**
 * Common Types
 * Shared type definitions used across the application
 */

export type ModuleType = 'transport' | 'energy' | 'waste' | 'accommodation' | 'materials';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ProductionInfo {
  name: string;
  type: 'film' | 'tv' | 'commercial' | 'other';
  startDate?: Date;
  endDate?: Date;
  location?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  includeDetails: boolean;
  dateRange?: DateRange;
  modules?: ModuleType[];
  productionName?: string;
}

export interface CalculationMetadata {
  calculatedAt: Date;
  version: string;
  source: string;
}
