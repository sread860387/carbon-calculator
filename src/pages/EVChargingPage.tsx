/**
 * EV Charging Page
 * Main page for EV charging station emissions tracking
 */

import { useState } from 'react';
import { useEVChargingStore } from '../store/useEVChargingStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EVChargingForm } from '../components/modules/evcharging/EVChargingForm';
import { formatCO2Large, formatDate } from '../utils/formatters';
import type { EVChargingEntry } from '../types/evCharging.types';

export function EVChargingPage() {
  const { entries, totals, results, addEntry, deleteEntry, clearAll } = useEVChargingStore();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleAddEntry = (entry: EVChargingEntry) => {
    addEntry(entry);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">EV Charging Emissions</h1>
          <p className="text-gray-600 mt-2">
            Track emissions from electric vehicle charging stations
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {totals && totals.totalCO2e > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total */}
          <Card className="md:col-span-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90 mb-2">Total EV Charging Emissions</p>
                <p className="text-5xl font-bold">
                  {formatCO2Large(totals.totalCO2e, false)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {totals.totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {totals.totalElectricityKWh.toFixed(1)} kWh total
                  {totals.totalMilesDriven > 0 && ` • ${totals.totalMilesDriven.toFixed(0)} miles driven`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Electricity Usage */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-xs text-gray-500">total kWh</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Electricity Used</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.totalElectricityKWh.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">kWh</p>
            </CardContent>
          </Card>

          {/* Charging Stations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🔌</span>
                <span className="text-xs text-gray-500">stations</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-gray-800">
                {entries.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {entries.length === 1 ? 'entry' : 'entries'} recorded
              </p>
            </CardContent>
          </Card>

          {/* Miles Driven */}
          {totals.totalMilesDriven > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🚗</span>
                  <span className="text-xs text-gray-500">tracked</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Miles Driven</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totals.totalMilesDriven.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">miles (tracked)</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Add New Entry Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add EV Charging Entry</CardTitle>
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
            <EVChargingForm onSubmit={handleAddEntry} />
          </CardContent>
        )}
      </Card>

      {/* Entries List */}
      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>EV Charging Entries ({entries.length})</CardTitle>
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
                        <span className="text-2xl">🔌</span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {entry.description || 'EV Charging Station'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)} • {entry.country}
                            {entry.stateProvince && `, ${entry.stateProvince}`}
                          </p>
                          {result && (
                            <p className="text-xs text-gray-400 mt-1">
                              {entry.electricityUsageKWh.toFixed(1)} kWh
                              {entry.milesDriven && ` • ${entry.milesDriven.toFixed(0)} miles`}
                              {entry.address && ` • ${entry.address}`}
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
            <p className="text-gray-500 mb-2">No EV charging entries yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to add electric vehicle charging station data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
