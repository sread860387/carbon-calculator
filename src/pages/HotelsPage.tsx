/**
 * Hotels & Housing Page
 * Main page for hotels and housing emissions tracking
 */

import { useState } from 'react';
import { useHotelsStore } from '../store/useHotelsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HotelsForm } from '../components/modules/hotels/HotelsForm';
import { formatCO2Large, formatDate } from '../utils/formatters';
import type { HotelsEntry } from '../types/hotels.types';

export function HotelsPage() {
  const { entries, totals, results, addEntry, deleteEntry, clearAll } = useHotelsStore();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleAddEntry = (entry: HotelsEntry) => {
    addEntry(entry);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hotels & Housing Emissions</h1>
          <p className="text-gray-600 mt-2">
            Track emissions from hotel stays and crew housing
          </p>
        </div>
      </div>

      {/* Important Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">Scope Classification Note</p>
              <p className="text-sm text-blue-800">
                This module is for <strong>crew accommodation</strong> (temporary lodging), which is classified as <strong>Scope 3: Business Travel</strong>.
                If you're using hotel rooms as <strong>production offices</strong> (working spaces where you have operational control),
                those should be entered as locations on the <a href="#/production-info" className="underline font-medium hover:text-blue-600">Production Info</a> tab
                and their energy consumption tracked in the <a href="#/utilities" className="underline font-medium hover:text-blue-600">Utilities</a> module (Scope 1 & 2).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {totals && totals.totalCO2e > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total */}
          <Card className="md:col-span-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90 mb-2">Total Hotels & Housing Emissions</p>
                <p className="text-5xl font-bold">
                  {formatCO2Large(totals.totalCO2e, false)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {totals.totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {totals.totalNights} total nights
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Nights */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🛏️</span>
                <span className="text-xs text-gray-500">total</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Nights</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.totalNights}
              </p>
              <p className="text-xs text-gray-500 mt-1">room nights</p>
            </CardContent>
          </Card>

          {/* Total Entries */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏨</span>
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

          {/* Average per Night */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📊</span>
                <span className="text-xs text-gray-500">average</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average per Night</p>
              <p className="text-2xl font-bold text-gray-800">
                {(totals.totalCO2e / totals.totalNights).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">kg CO₂e/night</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Breakdown by Room Type */}
      {totals && Object.keys(totals.byRoomType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breakdown by Room Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(totals.byRoomType)
                .sort(([, a], [, b]) => b - a)
                .map(([roomType, co2e]) => (
                  <div key={roomType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {roomType.includes('Hotel') ? '🏨' : '🏠'}
                      </span>
                      <span className="font-medium text-gray-800">{roomType}</span>
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

      {/* Breakdown by Country */}
      {totals && Object.keys(totals.byCountry).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Breakdown by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(totals.byCountry)
                .sort(([, a], [, b]) => b - a)
                .map(([country, co2e]) => (
                  <div key={country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌍</span>
                      <span className="font-medium text-gray-800">{country}</span>
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
            <CardTitle>Add Hotels/Housing Entry</CardTitle>
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
            <HotelsForm onSubmit={handleAddEntry} />
          </CardContent>
        )}
      </Card>

      {/* Entries List */}
      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hotels & Housing Entries ({entries.length})</CardTitle>
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
                          {entry.roomType.includes('Hotel') ? '🏨' : '🏠'}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {entry.roomType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)} • {entry.country}
                            {entry.stateProvince && `, ${entry.stateProvince}`}
                          </p>
                          {result && (
                            <p className="text-xs text-gray-400 mt-1">
                              {entry.totalNights} nights
                              {entry.city && ` • ${entry.city}`}
                              {result.kWhPerYear && ` • ${result.kWhPerYear.toFixed(0)} kWh/year`}
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
              })}</div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-2">No hotels or housing entries yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to add hotel stays or crew housing data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
