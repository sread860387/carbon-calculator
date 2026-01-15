/**
 * Fuel Page
 * Main page for fuel consumption emissions tracking
 */

import { useState } from 'react';
import { useFuelStore } from '../store/useFuelStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FuelForm } from '../components/modules/fuel/FuelForm';
import { formatCO2Large, formatDate } from '../utils/formatters';
import type { FuelEntry } from '../types/fuel.types';

export function FuelPage() {
  const { entries, totals, results, addEntry, deleteEntry, clearAll } = useFuelStore();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleAddEntry = (entry: FuelEntry) => {
    addEntry(entry);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fuel Emissions</h1>
          <p className="text-gray-600 mt-2">
            Track fuel consumption for equipment, vehicles, and generators
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {totals && totals.totalCO2e > 0 && (
        <div className="grid md:grid-cols-4 gap-6">
          {/* Total */}
          <Card className="md:col-span-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90 mb-2">Total Fuel Emissions</p>
                <p className="text-5xl font-bold">
                  {formatCO2Large(totals.totalCO2e, false)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {totals.totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {totals.totalFuelGallons.toFixed(1)} gallons equivalent
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚗</span>
                <span className="text-xs text-gray-500">
                  {entries.filter(e => ['Cars', 'Motorcycles', 'Buses', 'Vans, Pickups, SUVs', 'Trucks (<18 wheel)', 'Fueler Truck', '18 Wheelers', 'All Vehicles', 'Hybrid SUVs', 'Hybrid Cars'].includes(e.equipmentType)).length} entries
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Vehicles</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCO2Large(totals.byEquipmentCategory.Vehicle, false)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.byEquipmentCategory.Vehicle >= 1000 ? 'tonnes' : 'kg'} CO₂e
              </p>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚙️</span>
                <span className="text-xs text-gray-500">
                  {entries.filter(e => ['Boat', 'Generator', 'Trailer', 'Cooking Equipment', 'Lift', 'Heater', 'Other'].includes(e.equipmentType)).length} entries
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Equipment</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCO2Large(totals.byEquipmentCategory.Equipment, false)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.byEquipmentCategory.Equipment >= 1000 ? 'tonnes' : 'kg'} CO₂e
              </p>
            </CardContent>
          </Card>

          {/* Top Fuel Type */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⛽</span>
                <span className="text-xs text-gray-500">by type</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Top Fuel Type</p>
              {Object.keys(totals.byFuelType).length > 0 ? (
                <>
                  <p className="text-lg font-bold text-gray-800">
                    {Object.entries(totals.byFuelType).sort((a, b) => b[1] - a[1])[0][0]}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCO2Large(Object.entries(totals.byFuelType).sort((a, b) => b[1] - a[1])[0][1], false)} kg CO₂e
                  </p>
                </>
              ) : (
                <p className="text-lg text-gray-400">—</p>
              )}
            </CardContent>
          </Card>

          {/* Total Entries */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📊</span>
                <span className="text-xs text-gray-500">entries</span>
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
        </div>
      )}

      {/* Add New Entry Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Fuel Entry</CardTitle>
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
            <FuelForm onSubmit={handleAddEntry} />
          </CardContent>
        )}
      </Card>

      {/* Entries List */}
      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fuel Entries ({entries.length})</CardTitle>
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
                          {['Cars', 'Motorcycles', 'Buses', 'Vans, Pickups, SUVs', 'Trucks (<18 wheel)', 'Fueler Truck', '18 Wheelers', 'All Vehicles', 'Hybrid SUVs', 'Hybrid Cars'].includes(entry.equipmentType) ? '🚗' : '⚙️'}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {entry.equipmentType} • {entry.fuelType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)}
                            {entry.endDate && ` - ${formatDate(entry.endDate)}`}
                            {entry.reasonForUse && ` • ${entry.reasonForUse}`}
                          </p>
                          {result && (
                            <p className="text-xs text-gray-400 mt-1">
                              {result.calculationMethod} • {result.fuelGallons.toFixed(1)} gal equiv
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
            <p className="text-gray-500 mb-2">No fuel entries yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to add fuel consumption for equipment and vehicles
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
