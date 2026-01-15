/**
 * Simple Bar Chart Component
 * Lightweight SVG-based bar chart without external dependencies
 */

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  formatValue?: (value: number) => string;
}

export function BarChart({ data, height = 300, formatValue = (v) => v.toFixed(0) }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = 60;
  const gap = 20;
  const width = data.length * (barWidth + gap) + gap;
  const chartHeight = height - 60; // Leave space for labels

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction, index) => {
          const y = 40 + chartHeight * (1 - fraction);
          return (
            <g key={index}>
              <line
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray={fraction === 0 ? "0" : "4"}
              />
              <text
                x={5}
                y={y - 5}
                fontSize="10"
                fill="#9ca3af"
              >
                {formatValue(maxValue * fraction)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const x = gap + index * (barWidth + gap);
          const barHeight = (item.value / maxValue) * chartHeight;
          const y = 40 + chartHeight - barHeight;

          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
                rx="4"
              >
                <title>{`${item.label}: ${formatValue(item.value)}`}</title>
              </rect>

              {/* Value label on top of bar */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#374151"
              >
                {formatValue(item.value)}
              </text>

              {/* Label below bar */}
              <text
                x={x + barWidth / 2}
                y={40 + chartHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="#6b7280"
                className="max-w-[60px]"
              >
                {item.label.length > 10 ? `${item.label.substring(0, 10)}...` : item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
