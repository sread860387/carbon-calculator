/**
 * JSON Export Service
 * Export full data as JSON for backup or integration
 */

import type { TransportModuleResults } from '../../types/transport.types';

export function exportTransportToJSON(data: TransportModuleResults, productionName?: string) {
  // Create export object with metadata
  const exportData = {
    exportDate: new Date().toISOString(),
    productionName: productionName || 'Unnamed Production',
    module: 'transport',
    version: data.metadata.emissionFactorsVersion,
    source: data.metadata.source,
    summary: {
      totalCO2e: data.totals.totalCO2e,
      byMode: data.totals.byMode,
      byType: data.totals.byType,
      totalEntries: data.entries.length
    },
    entries: data.entries,
    results: data.results,
    calculationMetadata: data.metadata
  };

  // Convert to JSON string with pretty printing
  const jsonString = JSON.stringify(exportData, null, 2);

  // Download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `transport-data-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
