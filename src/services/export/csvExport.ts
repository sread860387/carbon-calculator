/**
 * CSV Export Service
 * Export data to CSV format using PapaParse
 */

import Papa from 'papaparse';
import type { TransportModuleResults } from '../../types/transport.types';
import { formatDate } from '../../utils/formatters';

export function exportTransportToCSV(data: TransportModuleResults) {
  // Prepare data rows
  const rows: any[] = data.entries.map((entry, index) => {
    const result = data.results[index];

    const baseRow = {
      Date: formatDate(entry.date, 'yyyy-MM-dd'),
      Mode: entry.mode,
      Description: entry.description || '',
      'CO2e (kg)': result.co2e.toFixed(2),
      'Emission Factor': result.emissionFactor.toFixed(4),
      'Emission Factor Unit': result.emissionFactorUnit
    };

    // Add mode-specific fields
    if (entry.mode === 'road') {
      return {
        ...baseRow,
        'Vehicle Type': entry.vehicleType,
        'Fuel Type': entry.fuelType,
        Distance: entry.distance,
        'Distance Unit': entry.distanceUnit,
        Passengers: entry.passengers || '',
        'Fuel Consumed': entry.fuelConsumption || '',
        'Fuel Unit': entry.fuelUnit || '',
        Origin: '',
        Destination: '',
        'Flight Class': '',
        'Return Trip': '',
        'Rail Type': ''
      };
    } else if (entry.mode === 'air') {
      return {
        ...baseRow,
        'Vehicle Type': '',
        'Fuel Type': '',
        Distance: entry.distance,
        'Distance Unit': entry.distanceUnit,
        Passengers: entry.passengers,
        'Fuel Consumed': '',
        'Fuel Unit': '',
        Origin: entry.origin,
        Destination: entry.destination,
        'Flight Class': entry.flightClass,
        'Return Trip': entry.returnTrip ? 'Yes' : 'No',
        'Rail Type': ''
      };
    } else {
      return {
        ...baseRow,
        'Vehicle Type': '',
        'Fuel Type': '',
        Distance: entry.distance,
        'Distance Unit': entry.distanceUnit,
        Passengers: entry.passengers || '',
        'Fuel Consumed': '',
        'Fuel Unit': '',
        Origin: '',
        Destination: '',
        'Flight Class': '',
        'Return Trip': '',
        'Rail Type': entry.railType
      };
    }
  });

  // Convert to CSV
  const csv = Papa.unparse(rows);

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `transport-emissions-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTransportSummaryToCSV(data: TransportModuleResults) {
  // Create summary data
  const summaryRows = [
    { Category: 'Total Transport Emissions', Value: `${data.totals.totalCO2e.toFixed(2)} kg CO2e` },
    { Category: 'Road Vehicle Emissions', Value: `${data.totals.byMode.road.toFixed(2)} kg CO2e` },
    { Category: 'Air Travel Emissions', Value: `${data.totals.byMode.air.toFixed(2)} kg CO2e` },
    { Category: 'Rail Travel Emissions', Value: `${data.totals.byMode.rail.toFixed(2)} kg CO2e` },
    { Category: 'Total Entries', Value: data.entries.length.toString() },
    { Category: 'Road Entries', Value: data.entries.filter(e => e.mode === 'road').length.toString() },
    { Category: 'Air Entries', Value: data.entries.filter(e => e.mode === 'air').length.toString() },
    { Category: 'Rail Entries', Value: data.entries.filter(e => e.mode === 'rail').length.toString() },
    { Category: 'Report Generated', Value: formatDate(new Date(), 'yyyy-MM-dd HH:mm') },
    { Category: 'Emission Factors Version', Value: data.metadata.emissionFactorsVersion },
    { Category: 'Source', Value: data.metadata.source }
  ];

  const csv = Papa.unparse(summaryRows);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `transport-summary-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Comprehensive CSV Export
 * Export production-wide summary to CSV
 */

interface ModuleData {
  name: string;
  totalCO2e: number;
  entries: number;
}

interface ProductionData {
  productionName?: string;
  productionType?: string;
  country?: string;
  totalShootDays?: number;
  startDate?: Date;
  endDate?: Date;
}

interface ScopeBreakdown {
  scope1: number;
  scope2: number;
  scope3: number;
}

interface ComprehensiveReportData {
  production: ProductionData;
  modules: ModuleData[];
  totalEmissions: number;
  scopeBreakdown?: ScopeBreakdown;
  generatedAt: Date;
}

export function exportComprehensiveCSV(data: ComprehensiveReportData) {
  // Production Information Section
  const productionRows: any[] = [];

  productionRows.push({ Section: 'PRODUCTION INFORMATION', Value: '' });
  if (data.production.productionName) {
    productionRows.push({ Section: 'Production Name', Value: data.production.productionName });
  }
  if (data.production.productionType) {
    productionRows.push({ Section: 'Production Type', Value: data.production.productionType });
  }
  if (data.production.country) {
    productionRows.push({ Section: 'Country', Value: data.production.country });
  }
  if (data.production.totalShootDays) {
    productionRows.push({ Section: 'Total Shoot Days', Value: data.production.totalShootDays.toString() });
  }
  if (data.production.startDate) {
    productionRows.push({ Section: 'Start Date', Value: formatDate(data.production.startDate, 'yyyy-MM-dd') });
  }
  if (data.production.endDate) {
    productionRows.push({ Section: 'End Date', Value: formatDate(data.production.endDate, 'yyyy-MM-dd') });
  }

  productionRows.push({ Section: '', Value: '' }); // Empty row

  // Total Emissions Section
  productionRows.push({ Section: 'TOTAL CARBON FOOTPRINT', Value: '' });
  productionRows.push({
    Section: 'Total Emissions',
    Value: `${data.totalEmissions.toFixed(2)} kg CO2e`
  });

  if (data.totalEmissions >= 1000) {
    productionRows.push({
      Section: 'Total Emissions (tonnes)',
      Value: `${(data.totalEmissions / 1000).toFixed(2)} tonnes CO2e`
    });
  }

  if (data.production.totalShootDays && data.production.totalShootDays > 0) {
    const perDay = data.totalEmissions / data.production.totalShootDays;
    productionRows.push({
      Section: 'Average per Shoot Day',
      Value: `${perDay.toFixed(2)} kg CO2e`
    });
  }

  productionRows.push({ Section: '', Value: '' }); // Empty row

  // Scope 1 & 2 Breakdown (if provided)
  if (data.scopeBreakdown) {
    productionRows.push({ Section: 'SCOPE 1 & 2 EMISSIONS BREAKDOWN', Value: '' });
    productionRows.push({ Section: 'Methodology', Value: 'SEA & BAFTA albert' });
    productionRows.push({ Section: '', Value: '' });

    productionRows.push({
      Section: 'Scope 1 (Direct emissions)',
      Value: `${data.scopeBreakdown.scope1.toFixed(2)} kg CO2e`
    });
    productionRows.push({
      Section: 'Scope 1 Percentage',
      Value: `${((data.scopeBreakdown.scope1 / data.totalEmissions) * 100).toFixed(1)}%`
    });

    productionRows.push({
      Section: 'Scope 2 (Purchased electricity)',
      Value: `${data.scopeBreakdown.scope2.toFixed(2)} kg CO2e`
    });
    productionRows.push({
      Section: 'Scope 2 Percentage',
      Value: `${((data.scopeBreakdown.scope2 / data.totalEmissions) * 100).toFixed(1)}%`
    });

    const scope1And2 = data.scopeBreakdown.scope1 + data.scopeBreakdown.scope2;
    productionRows.push({
      Section: 'Scope 1 & 2 Total (Minimum boundary)',
      Value: `${scope1And2.toFixed(2)} kg CO2e`
    });
    productionRows.push({
      Section: 'Scope 1 & 2 Percentage',
      Value: `${((scope1And2 / data.totalEmissions) * 100).toFixed(1)}%`
    });

    productionRows.push({
      Section: 'Scope 3 (Other indirect)',
      Value: `${data.scopeBreakdown.scope3.toFixed(2)} kg CO2e`
    });
    productionRows.push({
      Section: 'Scope 3 Percentage',
      Value: `${((data.scopeBreakdown.scope3 / data.totalEmissions) * 100).toFixed(1)}%`
    });

    productionRows.push({ Section: '', Value: '' });
  }

  // Emissions by Module Section
  productionRows.push({ Section: 'EMISSIONS BY MODULE', Value: '' });

  const modulesWithEmissions = data.modules.filter(m => m.totalCO2e > 0);

  const moduleRows: any[] = [
    { Module: 'Module Name', Entries: 'Entries', 'Emissions (kg CO2e)': 'Emissions (kg CO2e)', 'Percentage': 'Percentage' }
  ];

  modulesWithEmissions.forEach(module => {
    const percentage = ((module.totalCO2e / data.totalEmissions) * 100).toFixed(1);
    moduleRows.push({
      Module: module.name,
      Entries: module.entries.toString(),
      'Emissions (kg CO2e)': module.totalCO2e.toFixed(2),
      Percentage: `${percentage}%`
    });
  });

  // Add total row
  moduleRows.push({
    Module: 'TOTAL',
    Entries: data.modules.reduce((sum, m) => sum + m.entries, 0).toString(),
    'Emissions (kg CO2e)': data.totalEmissions.toFixed(2),
    Percentage: '100.0%'
  });

  // Combine all sections
  const summarySection = Papa.unparse(productionRows);
  const moduleSection = Papa.unparse(moduleRows);

  const csv = summarySection + '\n\n' + moduleSection + '\n\n' +
    `Report Generated,${formatDate(data.generatedAt, 'yyyy-MM-dd HH:mm')}\n` +
    `Source,DEFRA 2023 Greenhouse Gas Reporting Conversion Factors\n`;

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `carbon-footprint-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
