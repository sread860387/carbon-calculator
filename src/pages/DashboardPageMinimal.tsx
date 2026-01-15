/**
 * Dashboard Page - Minimal Test Version
 */

import { useUtilitiesStore } from '../store/useUtilitiesStore';
import { useFuelStore } from '../store/useFuelStore';
import { useEVChargingStore } from '../store/useEVChargingStore';
import { useHotelsStore } from '../store/useHotelsStore';
import { useCommercialTravelStore } from '../store/useCommercialTravelStore';
import { useCharterFlightsStore } from '../store/useCharterFlightsStore';
import { ProgressIndicator } from '../components/shared/ProgressIndicator';
import { TimelineView } from '../components/shared/TimelineView';
import { ComparisonView } from '../components/shared/ComparisonView';

type Page = 'landing' | 'info' | 'dashboard' | 'utilities' | 'fuel' | 'evcharging' | 'hotels' | 'commercial' | 'charter' | 'metrics';

interface DashboardPageMinimalProps {
  onNavigate?: (page: Page) => void;
}

export function DashboardPageMinimal({ onNavigate }: DashboardPageMinimalProps = {}) {
  console.log('Minimal dashboard - start');

  const utilitiesStore = useUtilitiesStore();
  console.log('✓ Utilities store loaded');

  const fuelStore = useFuelStore();
  console.log('✓ Fuel store loaded');

  const evChargingStore = useEVChargingStore();
  console.log('✓ EV Charging store loaded');

  const hotelsStore = useHotelsStore();
  console.log('✓ Hotels store loaded');

  const commercialTravelStore = useCommercialTravelStore();
  console.log('✓ Commercial Travel store loaded');

  const charterFlightsStore = useCharterFlightsStore();
  console.log('✓ Charter Flights store loaded');

  console.log('All stores loaded successfully');

  // Prepare timeline data
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
    }))
  ].filter(item => item && item.value > 0);

  console.log('Timeline data prepared, length:', timelineData.length);

  // Prepare comparison data
  const comparisonData = [
    { label: 'Utilities', value: utilitiesStore?.totals?.totalCO2e || 0, color: '#f97316' },
    { label: 'Fuel', value: fuelStore?.totals?.totalCO2e || 0, color: '#a855f7' }
  ].filter(item => item.value > 0);

  console.log('Comparison data prepared, length:', comparisonData.length);

  console.log('About to render components');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Testing ProgressIndicator</h1>
      <div className="bg-green-100 p-4 rounded space-y-2">
        <p className="text-green-800">✓ All 6 stores loaded</p>
        <p className="text-sm">Utilities entries: {utilitiesStore?.entries?.length || 0}</p>
        <p className="text-sm">Fuel entries: {fuelStore?.entries?.length || 0}</p>
        <p className="text-sm">EV Charging entries: {evChargingStore?.entries?.length || 0}</p>
        <p className="text-sm">Hotels entries: {hotelsStore?.entries?.length || 0}</p>
        <p className="text-sm">Commercial Travel entries: {commercialTravelStore?.entries?.length || 0}</p>
        <p className="text-sm">Charter Flights entries: {charterFlightsStore?.entries?.length || 0}</p>
      </div>

      {onNavigate && <ProgressIndicator onNavigate={onNavigate} />}

      <div className="bg-blue-100 p-4 rounded">
        <p className="text-blue-800">✓ ProgressIndicator rendered successfully</p>
      </div>

      {console.log('Testing TimelineView only first')}
      {timelineData.length > 1 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Testing TimelineView</h2>
          <TimelineView
            data={timelineData}
            title="Emissions Timeline"
            height={300}
          />
          <div className="bg-purple-100 p-4 rounded">
            <p className="text-purple-800">✓ TimelineView rendered successfully</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-600">TimelineView skipped (need at least 2 data points, have {timelineData.length})</p>
        </div>
      )}
      {console.log('TimelineView section complete')}

      {console.log('About to render ComparisonView')}
      {comparisonData.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Testing ComparisonView</h2>
          <ComparisonView
            items={comparisonData}
            title="Module Comparison"
            mode="percentage"
          />
          <div className="bg-orange-100 p-4 rounded">
            <p className="text-orange-800">✓ ComparisonView rendered successfully</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-600">ComparisonView skipped (no data with emissions)</p>
        </div>
      )}
      {console.log('ComparisonView section complete')}
    </div>
  );
}
