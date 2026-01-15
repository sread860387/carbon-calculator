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
