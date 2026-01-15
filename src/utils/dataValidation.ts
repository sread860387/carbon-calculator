/**
 * Data Validation and Quality Checks
 * Identifies potential issues in user-entered data
 */

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
}

// Utilities validation
export function validateUtilitiesEntry(data: any): ValidationResult {
  const warnings: ValidationWarning[] = [];

  // Check for unusually high electricity usage
  if (data.electricityUsage && data.electricityUsage > 100000) {
    warnings.push({
      field: 'electricityUsage',
      message: `Electricity usage (${data.electricityUsage.toLocaleString()} kWh) seems very high. Please verify this value.`,
      severity: 'warning'
    });
  }

  // Check for very low values that might be data entry errors
  if (data.electricityUsage && data.electricityUsage < 1) {
    warnings.push({
      field: 'electricityUsage',
      message: 'Electricity usage is less than 1 kWh. Did you mean a higher value?',
      severity: 'warning'
    });
  }

  // Check for area-based estimates without area
  if (data.electricityMethod === 'area' && !data.area) {
    warnings.push({
      field: 'area',
      message: 'Area is required when using area-based estimation',
      severity: 'error'
    });
  }

  // Check for usage-based estimates without usage
  if (data.electricityMethod === 'usage' && !data.electricityUsage) {
    warnings.push({
      field: 'electricityUsage',
      message: 'Electricity usage is required when using usage-based calculation',
      severity: 'error'
    });
  }

  // Check for heating fuel without usage
  if (data.heatFuel === 'Natural Gas' && data.heatMethod === 'usage' && !data.naturalGasUsage) {
    warnings.push({
      field: 'naturalGasUsage',
      message: 'Natural gas usage is required',
      severity: 'error'
    });
  }

  if (data.heatFuel === 'Fuel Oil' && data.heatMethod === 'usage' && !data.fuelOilUsage) {
    warnings.push({
      field: 'fuelOilUsage',
      message: 'Fuel oil usage is required',
      severity: 'error'
    });
  }

  // Info: Suggest adding description for better tracking
  if (!data.description) {
    warnings.push({
      field: 'description',
      message: 'Adding a description helps identify entries later',
      severity: 'info'
    });
  }

  return {
    isValid: warnings.filter(w => w.severity === 'error').length === 0,
    warnings
  };
}

// Fuel validation
export function validateFuelEntry(data: any): ValidationResult {
  const warnings: ValidationWarning[] = [];

  // Check for unusually high fuel amounts
  if (data.fuelAmount && data.fuelAmount > 10000) {
    warnings.push({
      field: 'fuelAmount',
      message: `Fuel amount (${data.fuelAmount.toLocaleString()}) seems very high. Please verify.`,
      severity: 'warning'
    });
  }

  // Check for very low values
  if (data.fuelAmount && data.fuelAmount < 0.1) {
    warnings.push({
      field: 'fuelAmount',
      message: 'Fuel amount is very small. Did you mean a higher value?',
      severity: 'warning'
    });
  }

  return {
    isValid: warnings.filter(w => w.severity === 'error').length === 0,
    warnings
  };
}

// Generic validation for number ranges
export function validateNumberRange(
  value: number,
  field: string,
  min?: number,
  max?: number,
  typical?: { min: number; max: number }
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (min !== undefined && value < min) {
    warnings.push({
      field,
      message: `Value must be at least ${min}`,
      severity: 'error'
    });
  }

  if (max !== undefined && value > max) {
    warnings.push({
      field,
      message: `Value must not exceed ${max}`,
      severity: 'error'
    });
  }

  if (typical) {
    if (value < typical.min) {
      warnings.push({
        field,
        message: `Value (${value}) is below typical range (${typical.min}-${typical.max}). Please verify.`,
        severity: 'warning'
      });
    }
    if (value > typical.max) {
      warnings.push({
        field,
        message: `Value (${value}) is above typical range (${typical.min}-${typical.max}). Please verify.`,
        severity: 'warning'
      });
    }
  }

  return warnings;
}
