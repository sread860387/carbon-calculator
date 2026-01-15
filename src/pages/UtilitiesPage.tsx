/**
 * Utilities Page
 * Main page for utilities (electricity and heating) emissions tracking
 */

import { useState } from 'react';
import { useUtilitiesStore } from '../store/useUtilitiesStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SearchBar } from '../components/shared/SearchBar';
import { StatsGrid } from '../components/shared/StatsCards';
import { ImportDialog } from '../components/shared/ImportDialog';
import { UtilitiesForm } from '../components/modules/utilities/UtilitiesForm';
import { formatCO2Large, formatDate } from '../utils/formatters';
import type { UtilitiesEntry } from '../types/utilities.types';

export function UtilitiesPage() {
  const { entries, totals, results, addEntry, deleteEntry, duplicateEntry, clearAll } = useUtilitiesStore();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'electricity' | 'heating'>('all');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleAddEntry = (entry: UtilitiesEntry) => {
    addEntry(entry);
  };

  const handleClearAll = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Clear All Utilities Entries?',
      message: 'This will permanently delete all utilities entries and their calculated emissions. This action cannot be undone.',
      onConfirm: clearAll
    });
  };

  const handleDeleteEntry = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Entry?',
      message: 'Are you sure you want to delete this entry? This action cannot be undone.',
      onConfirm: () => deleteEntry(id)
    });
  };

  const handleBulkImport = (importedEntries: UtilitiesEntry[]) => {
    importedEntries.forEach(entry => addEntry(entry));
    alert(`Successfully imported ${importedEntries.length} ${importedEntries.length === 1 ? 'entry' : 'entries'}`);
  };

  const transformCSVRow = (row: Record<string, string>): UtilitiesEntry | null => {
    try {
      if (!row.date || !row.locationName || !row.buildingType) {
        return null;
      }

      return {
        id: `utilities-${Date.now()}-${Math.random()}`,
        date: new Date(row.date),
        description: row.description,
        locationName: row.locationName,
        buildingType: row.buildingType as any,
        area: row.area ? Number(row.area) : undefined,
        areaUnit: row.areaUnit as any,
        daysOccupied: row.daysOccupied ? Number(row.daysOccupied) : undefined,
        electricityMethod: (row.electricityMethod || 'usage') as any,
        electricityUsage: row.electricityUsage ? Number(row.electricityUsage) : undefined,
        heatFuel: (row.heatFuel || 'None') as any,
        heatMethod: (row.heatMethod || 'none') as any,
        naturalGasUsage: row.naturalGasUsage ? Number(row.naturalGasUsage) : undefined,
        naturalGasUnit: row.naturalGasUnit as any,
        fuelOilUsage: row.fuelOilUsage ? Number(row.fuelOilUsage) : undefined,
        fuelOilUnit: row.fuelOilUnit as any
      };
    } catch {
      return null;
    }
  };

  // Filter and search entries
  const filteredEntries = entries.filter((entry) => {
    // Apply type filter
    if (filterType === 'electricity' && entry.electricityMethod === 'none') return false;
    if (filterType === 'heating' && (entry.heatFuel === 'None' || entry.heatFuel === 'Inc. in Elec.')) return false;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entry.locationName.toLowerCase().includes(query) ||
        entry.description?.toLowerCase().includes(query) ||
        entry.buildingType.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate statistics
  const stats = results.length > 0 ? {
    average: results.reduce((sum, r) => sum + r.totalEmissions, 0) / results.length,
    highest: Math.max(...results.map(r => r.totalEmissions)),
    mostRecentDate: entries.length > 0
      ? new Date(Math.max(...entries.map(e => new Date(e.date).getTime())))
      : new Date(),
    totalKWh: totals?.totalElectricityKWh || 0
  } : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Utilities Emissions</h1>
          <p className="text-gray-600 mt-2">
            Track emissions from electricity and heating fuel usage
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {totals && totals.totalCO2e > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-6">
          {/* Total */}
          <Card className="md:col-span-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90 mb-2">Total Utilities Emissions</p>
                <p className="text-5xl font-bold">
                  {formatCO2Large(totals.totalCO2e, false)}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {totals.totalCO2e >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Electricity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-xs text-gray-500">
                  {totals.totalElectricityKWh.toFixed(0)} kWh
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Electricity</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCO2Large(totals.electricityCO2e, false)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.electricityCO2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
              </p>
            </CardContent>
          </Card>

          {/* Heating */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🔥</span>
                <span className="text-xs text-gray-500">
                  {entries.filter(e => e.heatFuel !== 'None' && e.heatFuel !== 'Inc. in Elec.').length} {entries.filter(e => e.heatFuel !== 'None' && e.heatFuel !== 'Inc. in Elec.').length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Heating</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCO2Large(totals.heatCO2e, false)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {totals.heatCO2e >= 1000 ? 'tonnes' : 'kg'} CO₂e
              </p>
            </CardContent>
          </Card>

          {/* Total Entries */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📍</span>
                <span className="text-xs text-gray-500">locations</span>
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

        {/* Statistics Cards */}
        {stats && (
          <StatsGrid
            stats={[
              {
                label: 'Average per Entry',
                value: formatCO2Large(stats.average, false),
                icon: '📊',
                subtext: stats.average >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'
              },
              {
                label: 'Highest Entry',
                value: formatCO2Large(stats.highest, false),
                icon: '⚠️',
                subtext: stats.highest >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'
              },
              {
                label: 'Total Electricity',
                value: stats.totalKWh.toFixed(0),
                icon: '⚡',
                subtext: 'kWh consumed'
              },
              {
                label: 'Most Recent Entry',
                value: formatDate(stats.mostRecentDate).split('/')[0] + '/' + formatDate(stats.mostRecentDate).split('/')[1],
                icon: '📅',
                subtext: formatDate(stats.mostRecentDate)
              }
            ]}
          />
        )}
      </>
      )}

      {/* Add New Entry Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Utilities Entry</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsImportDialogOpen(true)}
              >
                📥 Import CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFormVisible(!isFormVisible)}
              >
                {isFormVisible ? 'Hide' : 'Show'} Form
              </Button>
            </div>
          </div>
        </CardHeader>
        {isFormVisible && (
          <CardContent>
            <UtilitiesForm onSubmit={handleAddEntry} />
          </CardContent>
        )}
      </Card>

      {/* Entries List */}
      {entries.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Utilities Entries ({entries.length})</CardTitle>
              <Button onClick={handleClearAll} variant="danger" size="sm">
                Clear All
              </Button>
            </div>
            {/* Search and Filter */}
            <SearchBar
              placeholder="Search by location, description, or building type..."
              onSearch={setSearchQuery}
              filterOptions={[
                { value: 'all', label: 'All Entries' },
                { value: 'electricity', label: 'Electricity Only' },
                { value: 'heating', label: 'Heating Only' }
              ]}
              onFilterChange={(value) => setFilterType(value as 'all' | 'electricity' | 'heating')}
              currentFilter={filterType}
            />
          </CardHeader>
          <CardContent>
            {filteredEntries.length > 0 ? (
              <div className="space-y-3">
                {filteredEntries.map((entry) => {
                const result = results.find(r => r.entryId === entry.id);

                return (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {entry.heatFuel === 'Natural Gas' || entry.heatFuel === 'Fuel Oil' ? '🔥' : '⚡'}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {entry.locationName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.date)} • {entry.buildingType}
                            {entry.description && ` • ${entry.description}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {entry.electricityMethod !== 'none' && `Electricity: ${entry.electricityMethod}`}
                            {entry.heatFuel !== 'None' && entry.heatFuel !== 'Inc. in Elec.' && (
                              ` • Heating: ${entry.heatFuel} (${entry.heatMethod})`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-bold text-lg text-gray-800">
                        {result ? formatCO2Large(result.totalEmissions, false) : '—'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result && result.totalEmissions >= 1000 ? 'tonnes' : 'kg'} CO₂e
                      </p>
                      {result && (
                        <p className="text-xs text-gray-400 mt-1">
                          ⚡ {formatCO2Large(result.electricityEmissions, false)} • 🔥 {formatCO2Large(result.heatEmissions, false)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => duplicateEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-blue-600"
                        title="Duplicate this entry"
                      >
                        📋
                      </Button>
                      <Button
                        onClick={() => handleDeleteEntry(entry.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                        title="Delete this entry"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                );
              })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No entries match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-2">No utilities entries yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to add electricity and heating emissions
            </p>
          </CardContent>
        </Card>
      )}

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleBulkImport}
        title="Import Utilities Data from CSV"
        requiredFields={[
          { field: 'date', label: 'Date' },
          { field: 'locationName', label: 'Location Name' },
          { field: 'buildingType', label: 'Building Type' }
        ]}
        optionalFields={[
          { field: 'description', label: 'Description' },
          { field: 'area', label: 'Area' },
          { field: 'areaUnit', label: 'Area Unit' },
          { field: 'daysOccupied', label: 'Days Occupied' },
          { field: 'electricityMethod', label: 'Electricity Method' },
          { field: 'electricityUsage', label: 'Electricity Usage (kWh)' },
          { field: 'heatFuel', label: 'Heat Fuel Type' },
          { field: 'heatMethod', label: 'Heat Method' },
          { field: 'naturalGasUsage', label: 'Natural Gas Usage' },
          { field: 'naturalGasUnit', label: 'Natural Gas Unit' },
          { field: 'fuelOilUsage', label: 'Fuel Oil Usage' },
          { field: 'fuelOilUnit', label: 'Fuel Oil Unit' }
        ]}
        transform={transformCSVRow}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
}
