/**
 * Timeline View Component
 * Visualizes emissions over time with a timeline chart
 */

import { formatCO2, formatDate } from '../../utils/formatters';

interface TimelineDataPoint {
  date: Date;
  value: number;
  label?: string;
  module?: string;
}

interface TimelineViewProps {
  data: TimelineDataPoint[];
  title?: string;
  height?: number;
}

export function TimelineView({ data, title = 'Emissions Timeline', height = 300 }: TimelineViewProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  // Sort data by date (handle both Date objects and strings)
  const sortedData = [...data].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  // Calculate max value for scaling
  const maxValue = Math.max(...sortedData.map(d => d.value), 1); // Ensure at least 1 to avoid division by zero
  const minValue = Math.min(...sortedData.map(d => d.value));

  // Group by module if available
  const moduleColors: Record<string, string> = {
    'Transport': '#3b82f6',
    'Utilities': '#f97316',
    'Fuel': '#8b5cf6',
    'EV Charging': '#06b6d4',
    'Hotels': '#ec4899',
    'Commercial Travel': '#6366f1'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      {/* Chart Area */}
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
          <span>{formatCO2(maxValue)}</span>
          <span>{formatCO2(maxValue * 0.75)}</span>
          <span>{formatCO2(maxValue * 0.5)}</span>
          <span>{formatCO2(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart content */}
        <div className="absolute left-16 right-0 top-0 bottom-8 ml-4">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-gray-200" />
            ))}
          </div>

          {/* Data points and lines */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Draw lines connecting points */}
            {sortedData.length > 1 && sortedData.map((point, index) => {
              if (index === sortedData.length - 1) return null;

              const nextPoint = sortedData[index + 1];
              const x1 = (index / (sortedData.length - 1)) * 100;
              const x2 = ((index + 1) / (sortedData.length - 1)) * 100;
              const y1 = 100 - ((point.value / maxValue) * 100);
              const y2 = 100 - ((nextPoint.value / maxValue) * 100);

              const color = point.module ? moduleColors[point.module] || '#6b7280' : '#6b7280';

              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.6"
                />
              );
            })}

            {/* Draw points */}
            {sortedData.map((point, index) => {
              const x = sortedData.length > 1 ? (index / (sortedData.length - 1)) * 100 : 50;
              const y = 100 - ((point.value / maxValue) * 100);
              const color = point.module ? moduleColors[point.module] || '#6b7280' : '#6b7280';
              const pointDate = point.date instanceof Date ? point.date : new Date(point.date);

              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="6"
                    fill={color}
                    className="cursor-pointer hover:r-8 transition-all"
                  />
                  <title>{`${point.label || formatDate(pointDate)}: ${formatCO2(point.value)} kg CO₂e`}</title>
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-16 right-0 bottom-0 ml-4 flex justify-between text-xs text-gray-500">
          {sortedData.map((point, index) => {
            // Show every nth label to avoid crowding
            const showEvery = Math.max(1, Math.floor(sortedData.length / 6));
            if (index % showEvery !== 0 && index !== sortedData.length - 1) return null;

            const pointDate = point.date instanceof Date ? point.date : new Date(point.date);
            return (
              <span key={index} className="transform -rotate-45 origin-top-left mt-2">
                {formatDate(pointDate).split('/')[0]}/{formatDate(pointDate).split('/')[1]}
              </span>
            );
          })}
        </div>
      </div>

      {/* Legend (if modules present) */}
      {data.some(d => d.module) && (
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
          {Object.entries(
            data.reduce((acc, d) => {
              if (d.module) acc[d.module] = true;
              return acc;
            }, {} as Record<string, boolean>)
          ).map(([module]) => (
            <div key={module} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: moduleColors[module] || '#6b7280' }}
              />
              <span className="text-sm text-gray-600">{module}</span>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">Total Entries</p>
          <p className="text-lg font-semibold text-gray-800">{sortedData.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatCO2(sortedData.reduce((sum, d) => sum + d.value, 0) / sortedData.length)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Peak</p>
          <p className="text-lg font-semibold text-gray-800">{formatCO2(maxValue)}</p>
        </div>
      </div>
    </div>
  );
}
