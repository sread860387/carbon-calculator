/**
 * Stats Cards Component
 * Displays statistical information and comparisons
 */

import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatCard({ label, value, icon, subtext, trend, trendValue }: StatCardProps) {
  const trendColors = {
    up: 'text-red-600 bg-red-50',
    down: 'text-green-600 bg-green-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtext && (
              <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            )}
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
        {trend && trendValue && (
          <div className={`mt-3 px-2 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1 ${trendColors[trend]}`}>
            <span>{trendIcons[trend]}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  stats: StatCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
