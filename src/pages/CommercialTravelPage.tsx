/**
 * Commercial Travel Page
 * Main page for commercial travel emissions tracking (flights, rail, ferry)
 */

import { useState } from 'react';
import { useCommercialTravelStore } from '../store/useCommercialTravelStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CommercialTravelForm } from '../components/modules/commercialTravel/CommercialTravelForm';
import { formatCO2Large, formatDate } from '../utils/formatters';
import type { CommercialTravelEntry } from '../types/commercialTravel.types';

export function CommercialTravelPage() {
  const { entries, totals, results, addEntry, deleteEntry, clearAll } = useCommercialTravelStore();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleAddEntry = (entry: CommercialTravelEntry) => {
    addEntry(entry);
  };

  const getTransportIcon = (transportType: string) => {
    switch (transportType) {
      case 'Flight': return '✈️';
      case 'National rail':
      case 'International rail':
      case 'Light rail and tram': return '🚆';
      case 'Ferry': return '⛴️';
      default: return '🚊';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Commercial Travel Emissions</h1>
          <p className="text-gray-600 mt-2">
            Track emissions from commercial flights, rail, and ferry travel
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {totals && totals.totalCO2e > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total */}
          <Card className="md:col-span-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90 mb-2">Total Commercial Travel Emissions</p>
                <p className="text-5xl font-bold">
                  {formatCO2Large(totals.totalCO2e, false)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {totals.totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {totals.totalPassengerMiles.toFixed(1)} passenger-miles total
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Distance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📏</span>
                <span className="text-xs text-gray-500">total</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Passenger Distance</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.totalPassengerMiles.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">passenger-miles</p>
            </CardContent>
          </Card>

          {/* Total Trips */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎫</span>
                <span className="text-xs text-gray-500">trips</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Trips</p>
              <p className="text-2xl font-bold text-gray-800">
                {entries.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {entries.length === 1 ? 'trip' : 'trips'} recorded
              </p>
            </CardContent>
          </Card>

          {/* Average per Mile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📊</span>
                <span className="text-xs text-gray-500">average</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Intensity</p>
              <p className="text-2xl font-bold text-gray-800">
                {(totals.totalCO2e / totals.totalPassengerMiles).toFixed(3)}
              </p>
              <p className="text-xs text-gray-500 mt-1">kg CO₂e/pax-mile</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Breakdown by Transport Type */}
      {totals && Object.keys(totals.byTransportType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breakdown by Transport Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(totals.byTransportType)
                .sort(([, a], [, b]) => b - a)
                .map(([transportType, co2e]) => (
                  <div key={transportType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {getTransportIcon(transportType)}
                      </span>
                      <span className="font-medium text-gray-800">{transportType}</span>
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

      {/* Breakdown by Flight Classification */}
      {totals && totals.byFlightClassification && Object.keys(totals.byFlightClassification).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flight Distance Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(totals.byFlightClassification)
                .sort(([, a], [, b]) => b - a)
                .map(([classification, co2e]) => (
                  <div key={classification} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✈️</span>
                      <div>
                        <span className="font-medium text-gray-800">{classification} Distance</span>
                        <p className="text-xs text-gray-500">
                          {classification === 'Short' && '< 288 miles'}
                          {classification === 'Medium' && '288-688 miles'}
                          {classification === 'Long' && '> 688 miles'}
                          {classification === 'Average' && 'Unknown distance'}
                        </p>
                      </div>
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
            <CardTitle>Add Commercial Travel Entry</CardTitle>
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
            <CommercialTravelForm onSubmit={handleAddEntry} />
          </CardContent>
        )}
      </Card>

      {/* Entries List */}
      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Commercial Travel Entries ({entries.length})</CardTitle>
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
                          {getTransportIcon(entry.transportType)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {entry.transportType}
                            {result?.flightClassification && ` (${result.flightClassification})`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)}
                            {entry.departureCity && entry.arrivalCity && (
                              <> • {entry.departureCity} → {entry.arrivalCity}</>
                            )}
                          </p>
                          {result && (
                            <p className="text-xs text-gray-400 mt-1">
                              {result.distanceInMiles.toFixed(1)} pax-miles
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
            <p className="text-gray-500 mb-2">No commercial travel entries yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to add commercial flights, rail, or ferry travel
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
