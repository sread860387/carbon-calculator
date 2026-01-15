/**
 * Charter & Helicopter Flights Page
 * Main page for charter jet and helicopter emissions tracking
 */

import { useState } from 'react';
import { useCharterFlightsStore } from '../store/useCharterFlightsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CharterFlightsForm } from '../components/modules/charterFlights/CharterFlightsForm';
import { formatCO2Large, formatDate } from '../utils/formatters';
import type { CharterFlightsEntry } from '../types/charterFlights.types';

export function CharterFlightsPage() {
  const { entries, totals, results, addEntry, deleteEntry, clearAll } = useCharterFlightsStore();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleAddEntry = (entry: CharterFlightsEntry) => {
    addEntry(entry);
  };

  const getAircraftIcon = (aircraftType: string) => {
    if (aircraftType === 'Helicopter') return '🚁';
    return '✈️';
  };

  const getCalculationMethodLabel = (method: string) => {
    switch (method) {
      case 'fuel': return 'Fuel Amount';
      case 'hours': return 'Hours Flown';
      case 'distance': return 'Distance Flown';
      default: return method;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Charter & Helicopter Flights</h1>
          <p className="text-gray-600 mt-2">
            Track emissions from chartered jets and helicopter flights
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {totals && totals.totalCO2e > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total */}
          <Card className="md:col-span-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90 mb-2">Total Charter Flight Emissions</p>
                <p className="text-5xl font-bold">
                  {formatCO2Large(totals.totalCO2e, false)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {totals.totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {totals.totalFuelGallons.toFixed(1)} gallons of fuel used
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Fuel */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⛽</span>
                <span className="text-xs text-gray-500">total</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Fuel</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.totalFuelGallons.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">gallons</p>
            </CardContent>
          </Card>

          {/* Total Flights */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✈️</span>
                <span className="text-xs text-gray-500">flights</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Flights</p>
              <p className="text-2xl font-bold text-gray-800">
                {entries.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {entries.length === 1 ? 'flight' : 'flights'} recorded
              </p>
            </CardContent>
          </Card>

          {/* Hours/Distance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⏱️</span>
                <span className="text-xs text-gray-500">tracked</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Flight Time</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.totalHoursFlown > 0 ? totals.totalHoursFlown.toFixed(1) : '—'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.totalHoursFlown > 0 ? 'hours' : 'not tracked'}
                {totals.totalDistanceFlown > 0 && ` • ${totals.totalDistanceFlown.toFixed(0)} mi`}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Breakdown by Aircraft Type */}
      {totals && Object.keys(totals.byAircraftType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breakdown by Aircraft Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(totals.byAircraftType)
                .sort(([, a], [, b]) => b - a)
                .map(([aircraftType, co2e]) => (
                  <div key={aircraftType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {getAircraftIcon(aircraftType)}
                      </span>
                      <span className="font-medium text-gray-800">{aircraftType}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {formatCO2Large(co2e, false)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {co2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Breakdown by Calculation Method */}
      {totals && Object.keys(totals.byCalculationMethod).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breakdown by Calculation Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(totals.byCalculationMethod)
                .sort(([, a], [, b]) => b - a)
                .map(([method, co2e]) => (
                  <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📊</span>
                      <span className="font-medium text-gray-800">{getCalculationMethodLabel(method)}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {formatCO2Large(co2e, false)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {co2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Entry Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Charter Flight Entry</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              {isFormVisible ? 'Hide' : 'Show'} Form
            </Button>
          </div>
        </CardHeader>
        {isFormVisible && (
          <CardContent>
            <CharterFlightsForm onSubmit={handleAddEntry} />
          </CardContent>
        )}
      </Card>

      {/* Entries List */}
      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Charter Flight Entries ({entries.length})</CardTitle>
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
                          {getAircraftIcon(entry.aircraftType)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {entry.aircraftType}
                            {entry.model && ` (${entry.model})`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)} • {getCalculationMethodLabel(entry.calculationMethod)}
                          </p>
                          {result && (
                            <p className="text-xs text-gray-400 mt-1">
                              {result.fuelUsedGallons.toFixed(1)} gal fuel
                              {entry.hoursFlown && ` • ${entry.hoursFlown} hrs`}
                              {entry.description && ` • ${entry.description}`}
                            </p>
                          )}
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
            <p className="text-gray-500 mb-2">No charter flight entries yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to add chartered jet or helicopter flight data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
