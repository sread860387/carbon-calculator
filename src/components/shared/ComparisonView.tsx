/**
 * Comparison View Component
 * Compare emissions across different categories, time periods, or modules
 */

import { formatCO2 } from '../../utils/formatters';

interface ComparisonItem {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface ComparisonViewProps {
  items: ComparisonItem[];
  title?: string;
  mode?: 'bar' | 'percentage';
}

export function ComparisonView({ items, title = 'Comparison', mode = 'bar' }: ComparisonViewProps) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No comparison data available</p>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...items.map(item => item.value));

  // Calculate percentages if not provided
  const itemsWithPercentages = items.map(item => ({
    ...item,
    percentage: item.percentage !== undefined
      ? item.percentage
      : total > 0
      ? (item.value / total) * 100
      : 0
  }));

  // Sort by value descending
  const sortedItems = [...itemsWithPercentages].sort((a, b) => b.value - a.value);

  const defaultColors = [
    '#3b82f6', '#f97316', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1',
    '#10b981', '#f59e0b', '#ef4444', '#14b8a6'
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="space-y-4">
        {sortedItems.map((item, index) => {
          const color = item.color || defaultColors[index % defaultColors.length];
          const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              {/* Label and value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800">
                    {formatCO2(item.value)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">kg</span>
                  {mode === 'percentage' && (
                    <span className="text-xs text-gray-500 ml-2">
                      ({item.percentage?.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Bar chart */}
              <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: color
                  }}
                />
                {mode === 'percentage' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {item.percentage?.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatCO2(total)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {total >= 1000 ? 'tonnes' : 'kg'} CO₂e
            </span>
          </div>
        </div>
      </div>

      {/* Insights */}
      {sortedItems.length > 1 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">{sortedItems[0].label}</span> accounts for{' '}
            <span className="font-semibold">{sortedItems[0].percentage?.toFixed(1)}%</span> of
            total emissions
            {sortedItems.length > 2 && (
              <>
                , followed by{' '}
                <span className="font-semibold">{sortedItems[1].label}</span> at{' '}
                <span className="font-semibold">{sortedItems[1].percentage?.toFixed(1)}%</span>
              </>
            )}
            .
          </p>
        </div>
      )}
    </div>
  );
}
