/**
 * Transport Page
 * Main page for transport emissions tracking
 */

import { useState } from 'react';
import { useTransportStore } from '../store/useTransportStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { RoadVehicleForm } from '../components/modules/transport/RoadVehicleForm';
import { AirTravelForm } from '../components/modules/transport/AirTravelForm';
import { RailTravelForm } from '../components/modules/transport/RailTravelForm';
import { ExportDialog } from '../components/shared/ExportDialog';
import { formatCO2Large, formatDate } from '../utils/formatters';
import type { TransportEntry } from '../types/transport.types';
import { transportCalculator } from '../services/calculations/transportCalculator';

export function TransportPage() {
  const { entries, totals, results, addEntry, deleteEntry, clearAll, getEntriesByMode } = useTransportStore();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleAddEntry = (entry: TransportEntry) => {
    addEntry(entry);
  };

  // Get full results for export
  const exportData = entries.length > 0 ? transportCalculator.calculateAll(entries) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transport Emissions</h1>
          <p className="text-gray-600 mt-2">
            Track emissions from road vehicles, air travel, and rail transport
          </p>
        </div>
        {entries.length > 0 && (
          <Button
            variant="primary"
            onClick={() => setIsExportDialogOpen(true)}
          >
            📥 Export Data
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      {totals && (
        <div className="grid md:grid-cols-4 gap-6">
          {/* Total */}
          <Card className="md:col-span-4 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90 mb-2">Total Transport Emissions</p>
                <p className="text-5xl font-bold">
                  {formatCO2Large(totals.totalCO2e, false)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {totals.totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Road */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚗</span>
                <span className="text-xs text-gray-500">
                  {getEntriesByMode('road').length} {getEntriesByMode('road').length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Road Vehicles</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCO2Large(totals.byMode.road, false)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.byMode.road >= 1000 ? 'tonnes' : 'kg'} CO₂e
              </p>
            </CardContent>
          </Card>

          {/* Air */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✈️</span>
                <span className="text-xs text-gray-500">
                  {getEntriesByMode('air').length} {getEntriesByMode('air').length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Air Travel</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCO2Large(totals.byMode.air, false)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.byMode.air >= 1000 ? 'tonnes' : 'kg'} CO₂e
              </p>
            </CardContent>
          </Card>

          {/* Rail */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚂</span>
                <span className="text-xs text-gray-500">
                  {getEntriesByMode('rail').length} {getEntriesByMode('rail').length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Rail Travel</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCO2Large(totals.byMode.rail, false)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.byMode.rail >= 1000 ? 'tonnes' : 'kg'} CO₂e
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add New Entry Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Add Transport Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="road">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="road">🚗 Road</TabsTrigger>
              <TabsTrigger value="air">✈️ Air</TabsTrigger>
              <TabsTrigger value="rail">🚂 Rail</TabsTrigger>
            </TabsList>

            <TabsContent value="road" className="mt-6">
              <RoadVehicleForm onSubmit={handleAddEntry} />
            </TabsContent>

            <TabsContent value="air" className="mt-6">
              <AirTravelForm onSubmit={handleAddEntry} />
            </TabsContent>

            <TabsContent value="rail" className="mt-6">
              <RailTravelForm onSubmit={handleAddEntry} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Entries List */}
      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transport Entries ({entries.length})</CardTitle>
              <Button onClick={clearAll} variant="danger" size="sm">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.map((entry) => {
                const result = results.find(r => r.entryId === entry.id);

                return (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {entry.mode === 'road' ? '🚗' : entry.mode === 'air' ? '✈️' : '🚂'}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {entry.description || 'Untitled'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)} • {' '}
                            {entry.mode === 'road' && `${entry.vehicleType} (${entry.fuelType}) - ${entry.distance} ${entry.distanceUnit}`}
                            {entry.mode === 'air' && `${entry.origin} → ${entry.destination} ${entry.returnTrip ? '(Round trip)' : ''}`}
                            {entry.mode === 'rail' && `${entry.railType} - ${entry.distance} ${entry.distanceUnit}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-bold text-lg text-gray-800">
                        {result ? formatCO2Large(result.co2e, false) : '—'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result && result.co2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
                      </p>
                    </div>
                    <Button
                      onClick={() => deleteEntry(entry.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-600"
                    >
                      ✕
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-2">No transport entries yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to add road vehicle, air travel, or rail transport entries
            </p>
          </CardContent>
        </Card>
      )}

      {/* Export Dialog */}
      {exportData && (
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          data={exportData}
        />
      )}
    </div>
  );
}
