/**
 * PEAR Metrics Page
 * Main page for sustainability metrics tracking
 */

import { useState } from 'react';
import { usePEARMetricsStore } from '../store/usePEARMetricsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DrinkingWaterForm } from '../components/modules/pearMetrics/DrinkingWaterForm';
import { WasteForm } from '../components/modules/pearMetrics/WasteForm';
import { DonationForm, RecycledPaperForm, BiodieselForm, HybridVehicleForm, OtherFuelSavingForm } from '../components/modules/pearMetrics/OtherMetricsForms';
import { formatDate } from '../utils/formatters';
import type {
  DrinkingWaterEntry,
  WasteEntry,
  DonationEntry,
  RecycledPaperEntry,
  BiodieselEntry,
  HybridVehicleEntry,
  OtherFuelSavingEntry
} from '../types/pearMetrics.types';

type Tab = 'water' | 'waste' | 'donations' | 'paper' | 'biodiesel' | 'fuel-savings';

export function PEARMetricsPage() {
  const [currentTab, setCurrentTab] = useState<Tab>('water');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  const {
    // Drinking Water
    drinkingWaterEntries,
    drinkingWaterTotals,
    addDrinkingWaterEntry,
    deleteDrinkingWaterEntry,
    clearDrinkingWater,

    // Waste
    wasteEntries,
    wasteTotals,
    addWasteEntry,
    deleteWasteEntry,
    clearWaste,

    // Donations
    donationEntries,
    donationTotals,
    addDonationEntry,
    deleteDonationEntry,
    clearDonations,

    // Recycled Paper
    recycledPaperEntries,
    recycledPaperTotals,
    addRecycledPaperEntry,
    deleteRecycledPaperEntry,
    clearRecycledPaper,

    // Biodiesel
    biodieselEntries,
    biodieselTotals,
    addBiodieselEntry,
    deleteBiodieselEntry,
    clearBiodiesel,

    // Hybrid Vehicles
    hybridVehicleEntries,
    hybridVehicleTotals,
    addHybridVehicleEntry,
    deleteHybridVehicleEntry,
    clearHybridVehicles,

    // Other Fuel Savings
    otherFuelSavingEntries,
    otherFuelSavingTotals,
    addOtherFuelSavingEntry,
    deleteOtherFuelSavingEntry,
    clearOtherFuelSavings,

    clearAll
  } = usePEARMetricsStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">PEAR Sustainability Metrics</h1>
          <p className="text-gray-600 mt-2">
            Production Environmental Accounting Report - Track environmental activities and sustainability practices
          </p>
        </div>
        <Button onClick={clearAll} variant="danger" size="sm">
          Clear All Data
        </Button>
      </div>

      {/* Introduction Section */}
      {showIntro && (
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <CardTitle>About PEAR Metrics</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowIntro(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Dismiss
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The PEAR Metrics section tracks environmental activities and resource conservation efforts
                beyond carbon emissions. This includes waste diversion, water conservation, donations,
                recycled materials, and fuel-saving initiatives.
              </p>

              <div className="bg-white rounded-lg p-4 border border-emerald-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📊</span>
                  What You Can Track:
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">💧</span>
                    <div>
                      <p className="font-medium text-gray-800">Drinking Water</p>
                      <p className="text-gray-600">Track water bottles and reusable containers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">♻️</span>
                    <div>
                      <p className="font-medium text-gray-800">Waste Management</p>
                      <p className="text-gray-600">Monitor landfill, recycling, and compost</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500">🎁</span>
                    <div>
                      <p className="font-medium text-gray-800">Donations</p>
                      <p className="text-gray-600">Record food, equipment, and wrap donations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500">📄</span>
                    <div>
                      <p className="font-medium text-gray-800">Recycled Paper</p>
                      <p className="text-gray-600">Track virgin vs. recycled paper usage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500">⛽</span>
                    <div>
                      <p className="font-medium text-gray-800">Biodiesel</p>
                      <p className="text-gray-600">Monitor biodiesel fuel consumption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-500">🚗</span>
                    <div>
                      <p className="font-medium text-gray-800">Fuel Savings</p>
                      <p className="text-gray-600">Track hybrid vehicles and alternative energy</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Tips for Success:
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
                  <li>Enter data regularly throughout production to ensure accuracy</li>
                  <li>Not all categories are required - only track what applies to your production</li>
                  <li>Consult with your waste hauler, catering, and facilities teams for data</li>
                  <li>Use the comments field to note data sources and any special circumstances</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!showIntro && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowIntro(true)}
            className="text-emerald-600 hover:text-emerald-700"
          >
            📋 Show PEAR Metrics Guide
          </Button>
        </div>
      )}

      {/* Progress Overview */}
      {(() => {
        const categories = [
          { name: 'Water', count: drinkingWaterEntries.length },
          { name: 'Waste', count: wasteEntries.length },
          { name: 'Donations', count: donationEntries.length },
          { name: 'Paper', count: recycledPaperEntries.length },
          { name: 'Biodiesel', count: biodieselEntries.length },
          { name: 'Fuel Savings', count: hybridVehicleEntries.length + otherFuelSavingEntries.length }
        ];
        const categoriesWithData = categories.filter(c => c.count > 0).length;
        const totalEntries = categories.reduce((sum, c) => sum + c.count, 0);

        if (totalEntries > 0) {
          return (
            <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <span className="text-3xl">✅</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">PEAR Metrics Progress</p>
                      <p className="text-2xl font-bold">{categoriesWithData} of 6 Categories</p>
                      <p className="text-sm opacity-90">{totalEntries} total entries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">{Math.round((categoriesWithData / 6) * 100)}%</p>
                    <p className="text-sm opacity-90">Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 flex-wrap">
          <button
            onClick={() => setCurrentTab('water')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all relative
              ${currentTab === 'water'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            💧 Water
            {drinkingWaterEntries.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'water' ? 'bg-white text-blue-500' : 'bg-blue-100 text-blue-700'
              }`}>
                {drinkingWaterEntries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('waste')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all
              ${currentTab === 'waste'
                ? 'bg-green-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            ♻️ Waste
            {wasteEntries.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'waste' ? 'bg-white text-green-500' : 'bg-green-100 text-green-700'
              }`}>
                {wasteEntries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('donations')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all
              ${currentTab === 'donations'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            🎁 Donations
            {donationEntries.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'donations' ? 'bg-white text-purple-500' : 'bg-purple-100 text-purple-700'
              }`}>
                {donationEntries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('paper')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all
              ${currentTab === 'paper'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            📄 Paper
            {recycledPaperEntries.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'paper' ? 'bg-white text-amber-500' : 'bg-amber-100 text-amber-700'
              }`}>
                {recycledPaperEntries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('biodiesel')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all
              ${currentTab === 'biodiesel'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            ⛽ Biodiesel
            {biodieselEntries.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'biodiesel' ? 'bg-white text-emerald-500' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {biodieselEntries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('fuel-savings')}
            className={`
              px-4 py-2 rounded-md font-medium transition-all
              ${currentTab === 'fuel-savings'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            🚗 Fuel Savings
            {(hybridVehicleEntries.length + otherFuelSavingEntries.length) > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                currentTab === 'fuel-savings' ? 'bg-white text-teal-500' : 'bg-teal-100 text-teal-700'
              }`}>
                {hybridVehicleEntries.length + otherFuelSavingEntries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Drinking Water Tab */}
      {currentTab === 'water' && (
        <div className="space-y-8">
          {/* Context Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💧</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">What to Track</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Record all drinking water containers used on your production, including plastic bottles,
                    reusable bottles, boxed water, and aluminum containers. Track both single-use and refillable options.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Data Sources:</strong> Catering invoices, craft services receipts, production office water delivery records
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          {drinkingWaterTotals && drinkingWaterTotals.totalBottles > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium opacity-90 mb-2">Total Containers</p>
                    <p className="text-5xl font-bold">{drinkingWaterTotals.totalBottles}</p>
                    <p className="text-sm opacity-90 mt-1">containers tracked</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">💰</span>
                    <span className="text-xs text-gray-500">total</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${drinkingWaterTotals.totalCost.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">📊</span>
                    <span className="text-xs text-gray-500">entries</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-800">{drinkingWaterEntries.length}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Drinking Water Entry</CardTitle>
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
                <DrinkingWaterForm onSubmit={addDrinkingWaterEntry} />
              </CardContent>
            )}
          </Card>

          {/* Entries List */}
          {drinkingWaterEntries.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Drinking Water Entries ({drinkingWaterEntries.length})</CardTitle>
                  <Button onClick={clearDrinkingWater} variant="danger" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drinkingWaterEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💧</span>
                          <div>
                            <p className="font-medium text-gray-800">{entry.containerType}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.date)} • {entry.quantity} containers
                              {entry.totalCost && ` • $${entry.totalCost.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteDrinkingWaterEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-blue-200">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">💧</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Drinking Water Entries Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start tracking your production's water container usage to monitor sustainability efforts
                </p>
                <p className="text-sm text-gray-500">
                  💡 Tip: Reusable bottles and 5-gallon jugs significantly reduce plastic waste
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Waste Tab */}
      {currentTab === 'waste' && (
        <div className="space-y-8">
          {/* Context Info */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">♻️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">What to Track</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Record waste sent to landfill, recycling (mixed, cardboard, metal, wood), compost, and e-waste.
                    Track by weight (pounds/tons) or volume (cubic yards). Higher diversion rates indicate better sustainability.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Data Sources:</strong> Waste hauler reports, dumpster pickup manifests, on-site weighing, facility management records
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          {wasteTotals && wasteTotals.totalPounds > 0 && (
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium opacity-90 mb-2">Diversion Rate</p>
                    <p className="text-5xl font-bold">{wasteTotals.diversionRate.toFixed(1)}%</p>
                    <p className="text-sm opacity-90 mt-1">waste diverted</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Waste</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {wasteTotals.totalPounds.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">pounds</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Recycled</p>
                  <p className="text-2xl font-bold text-green-600">
                    {wasteTotals.recycledPounds.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">pounds</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Landfill</p>
                  <p className="text-2xl font-bold text-red-600">
                    {wasteTotals.landfillPounds.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">pounds</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Waste Entry</CardTitle>
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
                <WasteForm onSubmit={addWasteEntry} />
              </CardContent>
            )}
          </Card>

          {/* Entries List */}
          {wasteEntries.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Waste Entries ({wasteEntries.length})</CardTitle>
                  <Button onClick={clearWaste} variant="danger" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wasteEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">♻️</span>
                          <div>
                            <p className="font-medium text-gray-800">{entry.wasteType}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.date)} • {entry.amount} {entry.unit}
                              {entry.location && ` • ${entry.location}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteWasteEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-green-200">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">♻️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Waste Entries Yet</h3>
                <p className="text-gray-600 mb-4">
                  Track landfill, recycling, and compost to calculate your waste diversion rate
                </p>
                <p className="text-sm text-gray-500">
                  💡 Tip: Industry best practices aim for 50%+ waste diversion from landfills
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Donations Tab */}
      {currentTab === 'donations' && (
        <div className="space-y-8">
          {/* Context Info */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎁</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">What to Track</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Record donations of food, equipment, props, sets, costumes, and other materials to charitable organizations.
                    Track quantities and estimated dollar values for tax and reporting purposes.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Data Sources:</strong> Donation receipts, set/prop department records, wrap coordinator reports, catering logs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {donationTotals && donationTotals.totalValue > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium opacity-90 mb-2">Total Donation Value</p>
                    <p className="text-5xl font-bold">${donationTotals.totalValue.toFixed(0)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-800">{donationEntries.length}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Donation Entry</CardTitle>
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
                <DonationForm onSubmit={addDonationEntry} />
              </CardContent>
            )}
          </Card>

          {donationEntries.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Donation Entries ({donationEntries.length})</CardTitle>
                  <Button onClick={clearDonations} variant="danger" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donationEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🎁</span>
                          <div>
                            <p className="font-medium text-gray-800">{entry.donationType}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.date)} • ${entry.value.toFixed(2)}
                              {entry.quantity && entry.unit && ` • ${entry.quantity} ${entry.unit}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteDonationEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-purple-200">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Donation Entries Yet</h3>
                <p className="text-gray-600 mb-4">
                  Record donations to demonstrate your production's community impact and sustainability
                </p>
                <p className="text-sm text-gray-500">
                  💡 Tip: Donating sets, props, and excess food reduces waste and helps the community
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recycled Paper Tab */}
      {currentTab === 'paper' && (
        <div className="space-y-8">
          {/* Context Info */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">What to Track</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Track the number of reams (500 sheets) of virgin paper versus recycled content paper used throughout
                    production. Higher recycled percentages reduce environmental impact.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Data Sources:</strong> Office supply orders, production office records, print shop invoices, script department
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {recycledPaperTotals && (recycledPaperTotals.totalVirginReams + recycledPaperTotals.totalRecycledReams) > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium opacity-90 mb-2">Recycled Content</p>
                    <p className="text-5xl font-bold">{recycledPaperTotals.recycledPercentage.toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Virgin Paper</p>
                  <p className="text-2xl font-bold text-gray-800">{recycledPaperTotals.totalVirginReams}</p>
                  <p className="text-xs text-gray-500 mt-1">reams</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Recycled Paper</p>
                  <p className="text-2xl font-bold text-green-600">{recycledPaperTotals.totalRecycledReams}</p>
                  <p className="text-xs text-gray-500 mt-1">reams</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Recycled Paper Entry</CardTitle>
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
                <RecycledPaperForm onSubmit={addRecycledPaperEntry} />
              </CardContent>
            )}
          </Card>

          {recycledPaperEntries.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recycled Paper Entries ({recycledPaperEntries.length})</CardTitle>
                  <Button onClick={clearRecycledPaper} variant="danger" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recycledPaperEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="font-medium text-gray-800">
                              Virgin: {entry.virginReams} • Recycled: {entry.recycledReams}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.date)} • Total: {entry.virginReams + entry.recycledReams} reams
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteRecycledPaperEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-amber-200">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Recycled Paper Entries Yet</h3>
                <p className="text-gray-600 mb-4">
                  Track virgin and recycled paper usage to monitor your sustainable paper practices
                </p>
                <p className="text-sm text-gray-500">
                  💡 Tip: Using recycled content paper saves trees and reduces production impact
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Biodiesel Tab */}
      {currentTab === 'biodiesel' && (
        <div className="space-y-8">
          {/* Context Info */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⛽</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">What to Track</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Record biodiesel fuel usage by type (B5, B20, B40, B99, B100). The number indicates the percentage
                    of biodiesel blend - B20 means 20% biodiesel, 80% petroleum diesel.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Data Sources:</strong> Fuel receipts, transportation department logs, generator fuel records, vehicle fleet reports
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {biodieselTotals && biodieselTotals.totalGallons > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium opacity-90 mb-2">Total Biodiesel</p>
                    <p className="text-5xl font-bold">{biodieselTotals.totalGallons.toFixed(1)}</p>
                    <p className="text-sm opacity-90 mt-1">gallons</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-800">{biodieselEntries.length}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Biodiesel Entry</CardTitle>
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
                <BiodieselForm onSubmit={addBiodieselEntry} />
              </CardContent>
            )}
          </Card>

          {biodieselEntries.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Biodiesel Entries ({biodieselEntries.length})</CardTitle>
                  <Button onClick={clearBiodiesel} variant="danger" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {biodieselEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">⛽</span>
                          <div>
                            <p className="font-medium text-gray-800">{entry.biodieselType}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.date)} • {entry.amountGallons.toFixed(1)} gallons
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteBiodieselEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-emerald-200">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">⛽</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Biodiesel Entries Yet</h3>
                <p className="text-gray-600 mb-4">
                  Track biodiesel fuel usage to demonstrate renewable fuel adoption
                </p>
                <p className="text-sm text-gray-500">
                  💡 Tip: Biodiesel blends reduce greenhouse gas emissions compared to petroleum diesel
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Fuel Savings Tab */}
      {currentTab === 'fuel-savings' && (
        <div className="space-y-8">
          {/* Context Info */}
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚗</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">What to Track</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Record fuel-saving initiatives including hybrid vehicle usage (cars and SUVs) and other alternative
                    energy sources like electric vehicles, solar power, and grid tie-ins. For hybrids, track fuel consumption,
                    distance driven, or fuel costs.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Data Sources:</strong> Transportation logs, vehicle fleet reports, fuel receipts, facilities energy records
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          {hybridVehicleTotals && hybridVehicleTotals.totalFuelGallons > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium opacity-90 mb-2">Hybrid Vehicle Fuel</p>
                    <p className="text-5xl font-bold">{hybridVehicleTotals.totalFuelGallons.toFixed(1)}</p>
                    <p className="text-sm opacity-90 mt-1">gallons</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {hybridVehicleEntries.length + otherFuelSavingEntries.length}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hybrid Vehicle Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Hybrid Vehicle Entry</CardTitle>
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
                <HybridVehicleForm onSubmit={addHybridVehicleEntry} />
              </CardContent>
            )}
          </Card>

          {/* Hybrid Vehicle Entries */}
          {hybridVehicleEntries.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Hybrid Vehicle Entries ({hybridVehicleEntries.length})</CardTitle>
                  <Button onClick={clearHybridVehicles} variant="danger" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hybridVehicleEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🚗</span>
                          <div>
                            <p className="font-medium text-gray-800">{entry.vehicleType}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.date)}
                              {entry.fuelAmount && ` • ${entry.fuelAmount} ${entry.fuelUnit}`}
                              {entry.distanceDriven && ` • ${entry.distanceDriven} miles`}
                              {entry.fuelCost && ` • $${entry.fuelCost.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteHybridVehicleEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Fuel Saving Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Other Fuel Saving Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <OtherFuelSavingForm onSubmit={addOtherFuelSavingEntry} />
            </CardContent>
          </Card>

          {/* Other Fuel Saving Entries */}
          {otherFuelSavingEntries.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Other Fuel Saving Entries ({otherFuelSavingEntries.length})</CardTitle>
                  <Button onClick={clearOtherFuelSavings} variant="danger" size="sm">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {otherFuelSavingEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💡</span>
                          <div>
                            <p className="font-medium text-gray-800">{entry.savingType}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.date)}
                              {entry.description && ` • ${entry.description}`}
                              {entry.amountSaved && entry.unit && ` • ${entry.amountSaved} ${entry.unit}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteOtherFuelSavingEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {hybridVehicleEntries.length === 0 && otherFuelSavingEntries.length === 0 && (
            <Card className="border-2 border-dashed border-teal-200">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Fuel Saving Entries Yet</h3>
                <p className="text-gray-600 mb-4">
                  Track hybrid vehicles, electric vehicles, and alternative energy use to showcase fuel efficiency
                </p>
                <p className="text-sm text-gray-500">
                  💡 Tip: Hybrid and electric vehicles can significantly reduce fuel consumption and emissions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
