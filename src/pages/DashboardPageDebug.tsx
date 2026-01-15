/**
 * Dashboard Page - Debug Version
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
import { formatCO2Large } from '../utils/formatters';
import { ProgressIndicator } from '../components/shared/ProgressIndicator';
import { PieChart } from '../components/shared/PieChart';
import { BarChart } from '../components/shared/BarChart';
import { TimelineView } from '../components/shared/TimelineView';
import { ComparisonView } from '../components/shared/ComparisonView';
import { exportComprehensivePDF } from '../services/export/comprehensivePdfExport';

type Page = 'landing' | 'info' | 'dashboard' | 'utilities' | 'fuel' | 'evcharging' | 'hotels' | 'commercial' | 'charter' | 'metrics';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export function DashboardPageDebug({ onNavigate }: DashboardPageProps) {
  // Hooks must be called unconditionally at the top level (cannot be in try/catch)
  console.log('=== Dashboard Debug Start ===');

  const utilitiesStore = useUtilitiesStore();
  const fuelStore = useFuelStore();
  const evChargingStore = useEVChargingStore();
  const hotelsStore = useHotelsStore();
  const commercialTravelStore = useCommercialTravelStore();
  const charterFlightsStore = useCharterFlightsStore();
  const productionInfoStore = useProductionInfoStore();

  console.log('1. Stores loaded');

  try {
    const productionInfo = productionInfoStore.productionInfo;

    const utilitesTotals = utilitiesStore?.totals;
    const fuelTotals = fuelStore?.totals;
    const evChargingTotals = evChargingStore?.totals;
    const hotelsTotals = hotelsStore?.totals;
    const commercialTravelTotals = commercialTravelStore?.totals;
    const charterFlightsTotals = charterFlightsStore?.totals;

    console.log('2. Totals accessed');

    const modules = [
      {
        name: 'Utilities',
        co2e: utilitesTotals?.totalCO2e || 0,
        entries: utilitiesStore?.entries?.length || 0
      },
      {
        name: 'Fuel',
        co2e: fuelTotals?.totalCO2e || 0,
        entries: fuelStore?.entries?.length || 0
      },
      {
        name: 'EV Charging',
        co2e: evChargingTotals?.totalCO2e || 0,
        entries: evChargingStore?.entries?.length || 0
      },
      {
        name: 'Hotels',
        co2e: hotelsTotals?.totalCO2e || 0,
        entries: hotelsStore?.entries?.length || 0
      },
      {
        name: 'Commercial Travel',
        co2e: commercialTravelTotals?.totalCO2e || 0,
        entries: commercialTravelStore?.entries?.length || 0
      },
      {
        name: 'Charter Flights',
        co2e: charterFlightsTotals?.totalCO2e || 0,
        entries: charterFlightsStore?.entries?.length || 0
      }
    ];

    console.log('3. Modules created');

    const totalCO2e = modules.reduce((sum, module) => sum + module.co2e, 0);

    console.log('4. Total calculated:', totalCO2e);

    // Prepare chart data
    const modulesWithEmissions = modules.filter(m => m.co2e > 0);

    const colorMap: Record<string, string> = {
      'Utilities': '#f97316',
      'Fuel': '#a855f7',
      'EV Charging': '#06b6d4',
      'Hotels': '#ec4899',
      'Commercial Travel': '#6366f1',
      'Charter Flights': '#0ea5e9'
    };

    console.log('5. Chart data prepared');

    // Prepare timeline data - safely
    const timelineData = [
      ...(utilitiesStore?.entries || []).map((entry, idx) => ({
        date: entry?.date || new Date(),
        value: utilitiesStore?.results?.[idx]?.totalEmissions || 0,
        label: entry?.locationName || 'Utilities',
        module: 'Utilities' as const
      })),
      ...(fuelStore?.entries || []).map((entry, idx) => ({
        date: entry?.date || new Date(),
        value: fuelStore?.results?.[idx]?.co2e || 0,
        label: entry?.equipmentType || 'Fuel',
        module: 'Fuel' as const
      })),
      ...(evChargingStore?.entries || []).map((entry, idx) => ({
        date: entry?.date || new Date(),
        value: evChargingStore?.results?.[idx]?.totalCO2e || 0,
        label: entry?.locationName || 'EV Charging',
        module: 'EV Charging' as const
      })),
      ...(hotelsStore?.entries || []).map((entry, idx) => ({
        date: entry?.date || new Date(),
        value: hotelsStore?.results?.[idx]?.totalCO2e || 0,
        label: (entry as any)?.hotelName || 'Hotel',
        module: 'Hotels & Housing' as const
      })),
      ...(commercialTravelStore?.entries || []).map((entry, idx) => ({
        date: entry?.date || new Date(),
        value: commercialTravelStore?.results?.[idx]?.totalCO2e || 0,
        label: `${(entry as any)?.origin || 'A'} to ${(entry as any)?.destination || 'B'}`,
        module: 'Commercial Travel' as const
      })),
      ...(charterFlightsStore?.entries || []).map((entry, idx) => ({
        date: entry?.date || new Date(),
        value: charterFlightsStore?.results?.[idx]?.totalCO2e || 0,
        label: `${(entry as any)?.origin || 'A'} to ${(entry as any)?.destination || 'B'}`,
        module: 'Charter Flights' as const
      }))
    ].filter(item => item && item.value > 0);

    console.log('6. Timeline data prepared, length:', timelineData.length);

    // Prepare comparison data
    const comparisonData = modulesWithEmissions.map(m => ({
      label: m.name,
      value: m.co2e,
      color: colorMap[m.name] || '#6b7280'
    }));

    console.log('7. Comparison data prepared');

    // Handle comprehensive PDF export
    const handleExportPDF = () => {
      console.log('Export PDF clicked');
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

    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Debug</h1>
            <p className="text-gray-600 mt-2">Testing incremental component additions</p>
          </div>
          {totalCO2e > 0 && (
            <Button
              variant="primary"
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              Export Full Report
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Total Emissions</h2>
            <p className="text-4xl font-bold text-green-600">
              {formatCO2Large(totalCO2e, false)}
            </p>
            <p className="text-sm text-gray-500">
              {totalCO2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
            </p>
          </CardContent>
        </Card>

        {console.log('8. About to render ProgressIndicator')}
        <ProgressIndicator onNavigate={onNavigate} />
        {console.log('9. ProgressIndicator rendered')}

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Module Breakdown</h2>
            <div className="space-y-2 text-sm">
              {modules.map(m => (
                <p key={m.name}>
                  {m.name}: {m.entries} entries, {formatCO2Large(m.co2e, false)} kg CO₂e
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {console.log('10. About to render charts')}
        {modulesWithEmissions.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emissions Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={modulesWithEmissions.map(m => ({
                    label: m.name,
                    value: m.co2e,
                    color: colorMap[m.name] || '#6b7280'
                  }))}
                  size={250}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emissions by Module</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={modulesWithEmissions.map(m => ({
                    label: m.name,
                    value: m.co2e,
                    color: colorMap[m.name] || '#6b7280'
                  }))}
                  height={300}
                  formatValue={(v) => formatCO2Large(v, false)}
                />
              </CardContent>
            </Card>
          </div>
        )}
        {console.log('11. Charts rendered')}

        {console.log('12. About to render Timeline and Comparison, timelineData.length:', timelineData.length)}
        {timelineData.length > 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            <TimelineView
              data={timelineData}
              title="Emissions Timeline"
              height={300}
            />

            <ComparisonView
              items={comparisonData}
              title="Module Comparison"
              mode="percentage"
            />
          </div>
        )}
        {console.log('13. Timeline and Comparison rendered')}
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-red-600">Dashboard Error</h1>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <p className="text-red-800 font-bold mb-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          {error instanceof Error && error.stack && (
            <pre className="text-xs text-red-600 mt-2 overflow-auto">{error.stack}</pre>
          )}
        </div>
      </div>
    );
  }
}
