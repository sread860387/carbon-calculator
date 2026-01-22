/**
 * Dashboard Page
 * Aggregates and displays total emissions across all modules
 */

import { useUtilitiesStore } from '../store/useUtilitiesStore';
import { useFuelStore } from '../store/useFuelStore';
import { useEVChargingStore } from '../store/useEVChargingStore';
import { useHotelsStore } from '../store/useHotelsStore';
import { useCommercialTravelStore } from '../store/useCommercialTravelStore';
import { useCharterFlightsStore } from '../store/useCharterFlightsStore';
import { useProductionInfoStore } from '../store/useProductionInfoStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressIndicator } from '../components/shared/ProgressIndicator';
import { PieChart } from '../components/shared/PieChart';
import { BarChart } from '../components/shared/BarChart';
import { ComparisonView } from '../components/shared/ComparisonView';
import { formatCO2Large } from '../utils/formatters';
import { exportComprehensivePDF } from '../services/export/comprehensivePdfExport';
import { exportComprehensiveCSV } from '../services/export/csvExport';

interface ModuleData {
  name: string;
  co2e: number;
  color: string;
  icon: string;
  entries: number;
  page: 'utilities' | 'fuel' | 'evcharging' | 'hotels' | 'commercial' | 'charter';
}

type Page = 'landing' | 'info' | 'dashboard' | 'utilities' | 'fuel' | 'evcharging' | 'hotels' | 'commercial' | 'charter' | 'metrics';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const utilitiesStore = useUtilitiesStore();
  const fuelStore = useFuelStore();
  const evChargingStore = useEVChargingStore();
  const hotelsStore = useHotelsStore();
  const commercialTravelStore = useCommercialTravelStore();
  const charterFlightsStore = useCharterFlightsStore();
  const productionInfoStore = useProductionInfoStore();

  const utilitesTotals = utilitiesStore.totals;
  const fuelTotals = fuelStore.totals;
  const evChargingTotals = evChargingStore.totals;
  const hotelsTotals = hotelsStore.totals;
  const commercialTravelTotals = commercialTravelStore.totals;
  const charterFlightsTotals = charterFlightsStore.totals;
  const productionInfo = productionInfoStore.productionInfo;

  const utilitiesEntries = utilitiesStore.entries?.length || 0;
  const fuelEntries = fuelStore.entries?.length || 0;
  const evChargingEntries = evChargingStore.entries?.length || 0;
  const hotelsEntries = hotelsStore.entries?.length || 0;
  const commercialTravelEntries = commercialTravelStore.entries?.length || 0;
  const charterFlightsEntries = charterFlightsStore.entries?.length || 0;

  // Calculate module data
  const modules: ModuleData[] = [
    {
      name: 'Utilities',
      co2e: utilitesTotals?.totalCO2e || 0,
      color: 'from-orange-500 to-orange-600',
      icon: '⚡',
      entries: utilitiesEntries,
      page: 'utilities'
    },
    {
      name: 'Fuel',
      co2e: fuelTotals?.totalCO2e || 0,
      color: 'from-purple-500 to-purple-600',
      icon: '⛽',
      entries: fuelEntries,
      page: 'fuel'
    },
    {
      name: 'EV Charging',
      co2e: evChargingTotals?.totalCO2e || 0,
      color: 'from-cyan-500 to-cyan-600',
      icon: '🔌',
      entries: evChargingEntries,
      page: 'evcharging'
    },
    {
      name: 'Hotels & Housing',
      co2e: hotelsTotals?.totalCO2e || 0,
      color: 'from-pink-500 to-pink-600',
      icon: '🏨',
      entries: hotelsEntries,
      page: 'hotels'
    },
    {
      name: 'Commercial Travel',
      co2e: commercialTravelTotals?.totalCO2e || 0,
      color: 'from-indigo-500 to-indigo-600',
      icon: '✈️',
      entries: commercialTravelEntries,
      page: 'commercial'
    },
    {
      name: 'Charter Flights',
      co2e: charterFlightsTotals?.totalCO2e || 0,
      color: 'from-sky-500 to-sky-600',
      icon: '🚁',
      entries: charterFlightsEntries,
      page: 'charter'
    }
  ];

  // Map Tailwind gradient classes to actual colors for charts
  const colorMap: Record<string, string> = {
    'from-orange-500 to-orange-600': '#f97316',
    'from-purple-500 to-purple-600': '#a855f7',
    'from-cyan-500 to-cyan-600': '#06b6d4',
    'from-pink-500 to-pink-600': '#ec4899',
    'from-indigo-500 to-indigo-600': '#6366f1',
    'from-sky-500 to-sky-600': '#0ea5e9'
  };

  // Calculate totals
  const totalCO2e = modules.reduce((sum, module) => sum + module.co2e, 0);
  const totalEntries = modules.reduce((sum, module) => sum + module.entries, 0);
  const activeModules = modules.filter(m => m.co2e > 0).length;

  // Sort modules by emissions (descending)
  const sortedModules = [...modules].sort((a, b) => b.co2e - a.co2e);

  // Calculate percentages for modules with emissions
  const modulesWithEmissions = sortedModules.filter(m => m.co2e > 0);

  // Prepare comparison data
  const comparisonData = modulesWithEmissions.map(m => ({
    label: m.name,
    value: m.co2e,
    color: colorMap[m.color] || '#6b7280'
  }));

  // Handle comprehensive PDF export
  const handleExportPDF = () => {
    exportComprehensivePDF({
      production: {
        productionName: productionInfo?.productionName,
        productionType: productionInfo?.productionType,
        country: productionInfo?.country,
        totalShootDays: productionInfo?.totalShootDays,
        startDate: productionInfo?.startDate,
        endDate: productionInfo?.endDate
      },
      modules: modules.map(m => ({
        name: m.name,
        totalCO2e: m.co2e,
        entries: m.entries
      })),
      totalEmissions: totalCO2e,
      generatedAt: new Date()
    });
  };

  // Handle comprehensive CSV export
  const handleExportCSV = () => {
    exportComprehensiveCSV({
      production: {
        productionName: productionInfo?.productionName,
        productionType: productionInfo?.productionType,
        country: productionInfo?.country,
        totalShootDays: productionInfo?.totalShootDays,
        startDate: productionInfo?.startDate,
        endDate: productionInfo?.endDate
      },
      modules: modules.map(m => ({
        name: m.name,
        totalCO2e: m.co2e,
        entries: m.entries
      })),
      totalEmissions: totalCO2e,
      generatedAt: new Date()
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {productionInfo?.productionName || 'Carbon Footprint Dashboard'}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            {productionInfo ? (
              <>
                {productionInfo.productionType}
                {productionInfo.filmCategory && ` • ${productionInfo.filmCategory}`}
                {productionInfo.tvProductionType && ` • ${productionInfo.tvProductionType}`}
              </>
            ) : (
              'Total emissions across all modules'
            )}
          </p>
        </div>
        {totalCO2e > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={handleExportPDF}
              className="flex items-center gap-2 text-base md:text-lg font-semibold bg-sea-bright-green text-sea-green hover:bg-sea-bright-green/90 px-6 py-3 shadow-lg"
            >
              📄 Download PDF Report
            </Button>
            <Button
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-base md:text-lg font-semibold bg-sea-green text-white hover:bg-sea-green-shadow px-6 py-3 shadow-lg"
            >
              📊 Download CSV
            </Button>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <Card className="bg-gradient-to-r from-sea-green via-sea-green-shadow to-sea-green text-white border-0">
        <CardContent className="p-4 md:p-8">
          <div className="text-center">
            <p className="text-base md:text-lg font-medium opacity-90 mb-2 md:mb-3">
              Total Production Carbon Footprint
            </p>
            <p className="text-4xl sm:text-5xl md:text-7xl font-bold mb-2 md:mb-3">
              {formatCO2Large(totalCO2e, false)}
            </p>
            <p className="text-lg md:text-xl opacity-90 mb-3 md:mb-4">
              {totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm opacity-90 pt-3 md:pt-4 border-t border-white/20">
              <div>
                <p className="font-semibold text-base md:text-lg">{activeModules}</p>
                <p className="opacity-75">Active Modules</p>
              </div>
              <div>
                <p className="font-semibold text-base md:text-lg">{totalEntries}</p>
                <p className="opacity-75">Total Entries</p>
              </div>
              {productionInfo?.totalShootDays && (
                <div>
                  <p className="font-semibold text-base md:text-lg">{productionInfo.totalShootDays}</p>
                  <p className="opacity-75">Shoot Days</p>
                </div>
              )}
              {productionInfo?.totalShootDays && totalCO2e > 0 && (
                <div>
                  <p className="font-semibold text-base md:text-lg">
                    {(totalCO2e / productionInfo.totalShootDays).toFixed(1)}
                  </p>
                  <p className="opacity-75 whitespace-nowrap">
                    {totalCO2e >= 1000 ? 'tonnes' : 'kg'} CO₂e / day
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <ProgressIndicator onNavigate={onNavigate} />

      {/* Module Breakdown */}
      {totalCO2e > 0 ? (
        <>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              Emissions by Module
              <span className="ml-2 md:ml-3 text-xs md:text-sm font-normal text-gray-500 hidden sm:inline">Click any module to view details</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {modulesWithEmissions.map((module) => {
                const percentage = (module.co2e / totalCO2e) * 100;

                return (
                  <Card
                    key={module.name}
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 group"
                    onClick={() => onNavigate(module.page)}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                          <span className="text-2xl md:text-3xl flex-shrink-0">{module.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 md:gap-2">
                              <h3 className="font-semibold text-sm md:text-base text-gray-800 truncate">{module.name}</h3>
                              <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">→</span>
                            </div>
                            <p className="text-xs text-gray-500">{module.entries} entries</p>
                          </div>
                        </div>
                        <div className={`px-2 md:px-3 py-1 rounded-full bg-gradient-to-r ${module.color} text-white text-xs font-semibold flex-shrink-0`}>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl md:text-2xl font-bold text-gray-800">
                            {formatCO2Large(module.co2e, false)}
                          </span>
                          <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                            {module.co2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${module.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Top 3 Contributors */}
          <Card>
            <CardHeader>
              <CardTitle>
                Top 3 Emission Sources
                <span className="ml-3 text-xs md:text-sm font-normal text-gray-500 hidden sm:inline">Click to view details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modulesWithEmissions.slice(0, 3).map((module, index) => {
                  const percentage = (module.co2e / totalCO2e) * 100;

                  return (
                    <div
                      key={module.name}
                      className="flex items-center gap-2 md:gap-4 cursor-pointer hover:bg-gray-50 p-2 md:p-3 -mx-2 md:-mx-3 rounded-lg transition-colors group"
                      onClick={() => onNavigate(module.page)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 font-bold text-sm md:text-base text-gray-600 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg md:text-xl flex-shrink-0">{module.icon}</span>
                            <span className="font-semibold text-sm md:text-base text-gray-800 truncate">{module.name}</span>
                            <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">→</span>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <p className="font-bold text-sm md:text-base text-gray-800">
                              {formatCO2Large(module.co2e, false)} {module.co2e >= 1000 ? 'tonnes' : 'kg'}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">{percentage.toFixed(1)}% of total</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                          <div
                            className={`h-2 md:h-3 rounded-full bg-gradient-to-r ${module.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* All Modules Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                All Modules Summary
                <span className="ml-3 text-sm font-normal text-gray-500">Click any row to view details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Module</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Entries</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Emissions (kg CO₂e)</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedModules.map((module) => {
                      const percentage = totalCO2e > 0 ? (module.co2e / totalCO2e) * 100 : 0;

                      return (
                        <tr
                          key={module.name}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => onNavigate(module.page)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{module.icon}</span>
                              <span className="font-medium">{module.name}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">
                            {module.entries}
                          </td>
                          <td className="text-right py-3 px-4 font-semibold">
                            {module.co2e.toFixed(2)}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              module.co2e > 0
                                ? `bg-gradient-to-r ${module.color} text-white`
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td className="py-3 px-4">TOTAL</td>
                      <td className="text-right py-3 px-4">{totalEntries}</td>
                      <td className="text-right py-3 px-4">{totalCO2e.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">100.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Emissions Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={modulesWithEmissions.map(m => ({
                    label: m.name,
                    value: m.co2e,
                    color: colorMap[m.color] || '#6b7280'
                  }))}
                  size={250}
                />
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Emissions by Module</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={modulesWithEmissions.map(m => ({
                    label: m.name,
                    value: m.co2e,
                    color: colorMap[m.color] || '#6b7280'
                  }))}
                  height={300}
                  formatValue={(v) => formatCO2Large(v, false)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Comparison View */}
          {modulesWithEmissions.length > 0 && (
            <ComparisonView
              items={comparisonData}
              title="Module Comparison"
              mode="percentage"
            />
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Emissions Data Yet</h2>
            <p className="text-gray-500 mb-6">
              Start tracking emissions by adding entries to any of the modules above
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {modules.map((module) => (
                <div key={module.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">{module.icon}</div>
                  <p className="text-sm font-medium text-gray-700">{module.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
