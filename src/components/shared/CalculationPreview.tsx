/**
 * Calculation Preview Component
 * Shows real-time CO2e emissions preview as user fills out form
 */

import { formatCO2 } from '../../utils/formatters';

interface CalculationPreviewProps {
  co2e: number | null;
  isCalculating?: boolean;
  breakdown?: Array<{
    label: string;
    value: number;
    icon?: string;
  }>;
}

export function CalculationPreview({ co2e, isCalculating = false, breakdown }: CalculationPreviewProps) {
  if (isCalculating) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-sm text-blue-800">Calculating emissions...</p>
        </div>
      </div>
    );
  }

  if (co2e === null || co2e === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">Fill out the form to see estimated emissions</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">Estimated Emissions</p>
        <span className="text-xs text-gray-500">Preview</span>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-green-800">
          {formatCO2(co2e)}
        </p>
        <p className="text-sm text-gray-600">
          {co2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
        </p>
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="text-xs font-medium text-gray-600 mb-2">Breakdown:</p>
          <div className="space-y-1">
            {breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
                <span className="font-medium text-gray-800">
                  {formatCO2(item.value)} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-green-200">
        <p className="text-xs text-gray-500">
          This is an estimate. Final values will be calculated when you submit.
        </p>
      </div>
    </div>
  );
}
