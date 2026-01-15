/**
 * Simple Pie Chart Component
 * Lightweight SVG-based pie chart without external dependencies
 */

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLegend?: boolean;
}

export function PieChart({ data, size = 200, showLegend = true }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-gray-400" style={{ height: size }}>
        No data available
      </div>
    );
  }

  // Calculate pie slices
  let currentAngle = -90; // Start at top
  const slices = data.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle = endAngle;

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate path
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      path,
      percentage: percentage * 100
    };
  });

  return (
    <div className="space-y-4">
      {/* SVG Pie Chart */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        {slices.map((slice, index) => (
          <g key={index}>
            <path
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="transition-opacity hover:opacity-80 cursor-pointer"
            >
              <title>{`${slice.label}: ${slice.percentage.toFixed(1)}%`}</title>
            </path>
          </g>
        ))}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="space-y-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-gray-700">{slice.label}</span>
              </div>
              <span className="font-medium text-gray-800">
                {slice.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
