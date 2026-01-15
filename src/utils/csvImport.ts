/**
 * CSV Import Utilities
 * Parse and validate CSV files for importing data
 */

import Papa from 'papaparse';

export interface CSVRow {
  [key: string]: string;
}

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
  warnings: string[];
}

export interface ColumnMapping {
  csvColumn: string;
  appField: string;
}

/**
 * Parse a CSV file
 */
export function parseCSV(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as CSVRow[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Get available columns from CSV data
 */
export function getCSVColumns(data: CSVRow[]): string[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]);
}

/**
 * Map CSV data to application format
 */
export function mapCSVData<T>(
  csvData: CSVRow[],
  mapping: ColumnMapping[],
  transform: (row: Record<string, string>) => T | null
): ImportResult<T> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data: T[] = [];

  csvData.forEach((row, index) => {
    try {
      // Map CSV columns to app fields
      const mappedRow: Record<string, string> = {};
      mapping.forEach(({ csvColumn, appField }) => {
        if (row[csvColumn] !== undefined) {
          mappedRow[appField] = row[csvColumn];
        }
      });

      // Transform the row
      const transformed = transform(mappedRow);
      if (transformed) {
        data.push(transformed);
      } else {
        warnings.push(`Row ${index + 2}: Skipped due to missing required fields`);
      }
    } catch (error) {
      errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    success: errors.length === 0,
    data,
    errors,
    warnings
  };
}

/**
 * Auto-detect column mappings based on field names
 */
export function autoDetectMapping(
  csvColumns: string[],
  appFields: string[]
): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];

  appFields.forEach(appField => {
    // Try to find matching column (case-insensitive, flexible matching)
    const normalizedAppField = appField.toLowerCase().replace(/[_\s]/g, '');

    const matchingColumn = csvColumns.find(csvColumn => {
      const normalizedCsvColumn = csvColumn.toLowerCase().replace(/[_\s]/g, '');
      return (
        normalizedCsvColumn === normalizedAppField ||
        normalizedCsvColumn.includes(normalizedAppField) ||
        normalizedAppField.includes(normalizedCsvColumn)
      );
    });

    if (matchingColumn) {
      mappings.push({
        csvColumn: matchingColumn,
        appField
      });
    }
  });

  return mappings;
}

/**
 * Validate required fields are mapped
 */
export function validateMapping(
  mapping: ColumnMapping[],
  requiredFields: string[]
): { valid: boolean; missingFields: string[] } {
  const mappedFields = mapping.map(m => m.appField);
  const missingFields = requiredFields.filter(field => !mappedFields.includes(field));

  return {
    valid: missingFields.length === 0,
    missingFields
  };
}
