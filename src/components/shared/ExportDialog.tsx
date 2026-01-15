/**
 * Export Dialog Component
 * Modal for selecting export format and options
 */

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormField } from '../ui/FormField';
import type { TransportModuleResults } from '../../types/transport.types';
import { exportTransportToPDF } from '../../services/export/pdfExport';
import { exportTransportToCSV, exportTransportSummaryToCSV } from '../../services/export/csvExport';
import { exportTransportToJSON } from '../../services/export/jsonExport';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: TransportModuleResults;
}

type ExportFormat = 'pdf' | 'csv' | 'csv-summary' | 'json';

export function ExportDialog({ isOpen, onClose, data }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [productionName, setProductionName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      switch (selectedFormat) {
        case 'pdf':
          exportTransportToPDF(data, productionName || undefined);
          break;
        case 'csv':
          exportTransportToCSV(data);
          break;
        case 'csv-summary':
          exportTransportSummaryToCSV(data);
          break;
        case 'json':
          exportTransportToJSON(data, productionName || undefined);
          break;
      }

      // Close modal after short delay
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  const formatOptions = [
    {
      value: 'pdf' as ExportFormat,
      label: 'PDF Report',
      icon: '📄',
      description: 'Professional report with summary and detailed entries'
    },
    {
      value: 'csv' as ExportFormat,
      label: 'CSV (Detailed)',
      icon: '📊',
      description: 'Spreadsheet with all entry details'
    },
    {
      value: 'csv-summary' as ExportFormat,
      label: 'CSV (Summary)',
      icon: '📈',
      description: 'Summary totals only'
    },
    {
      value: 'json' as ExportFormat,
      label: 'JSON Data',
      icon: '💾',
      description: 'Complete data export for backup or integration'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Transport Data" className="max-w-2xl">
      <div className="space-y-6">
        {/* Production Name */}
        <FormField
          label="Production Name (Optional)"
          htmlFor="productionName"
        >
          <Input
            id="productionName"
            value={productionName}
            onChange={(e) => setProductionName(e.target.value)}
            placeholder="e.g., My Film Production 2024"
          />
          <p className="text-xs text-gray-500 mt-1">
            Will be included in the exported file
          </p>
        </FormField>

        {/* Export Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Export Format
          </label>
          <div className="space-y-2">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedFormat(option.value)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all',
                  selectedFormat === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{option.label}</span>
                      {selectedFormat === option.value && (
                        <span className="text-blue-600 text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Export Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• {data.entries.length} total transport {data.entries.length === 1 ? 'entry' : 'entries'}</p>
            <p>• {data.totals.totalCO2e.toFixed(2)} kg CO₂e total emissions</p>
            <p>• Calculated on {new Date(data.metadata.calculatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || data.entries.length === 0}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
