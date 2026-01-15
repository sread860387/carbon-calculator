/**
 * CSV Import Dialog
 * Generic component for importing CSV data
 */

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { parseCSV, getCSVColumns, autoDetectMapping, validateMapping, mapCSVData, type CSVRow, type ColumnMapping, type ImportResult } from '../../utils/csvImport';

interface ImportDialogProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: T[]) => void;
  requiredFields: Array<{ field: string; label: string }>;
  optionalFields?: Array<{ field: string; label: string }>;
  transform: (row: Record<string, string>) => T | null;
  title: string;
}

export function ImportDialog<T>({
  isOpen,
  onClose,
  onImport,
  requiredFields,
  optionalFields = [],
  transform,
  title
}: ImportDialogProps<T>) {
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [csvColumns, setCSVColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping[]>([]);
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');
  const [importResult, setImportResult] = useState<ImportResult<T> | null>(null);
  const [fileName, setFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setFileName(file.name);
      const data = await parseCSV(file);
      const columns = getCSVColumns(data);

      setCSVData(data);
      setCSVColumns(columns);

      // Auto-detect mappings
      const allFields = [...requiredFields, ...optionalFields].map(f => f.field);
      const autoMappings = autoDetectMapping(columns, allFields);
      setMapping(autoMappings);

      setStep('map');
    } catch (error) {
      alert(`Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMappingChange = (appField: string, csvColumn: string) => {
    setMapping(prev => {
      const filtered = prev.filter(m => m.appField !== appField);
      if (csvColumn) {
        return [...filtered, { csvColumn, appField }];
      }
      return filtered;
    });
  };

  const handlePreview = () => {
    const requiredFieldNames = requiredFields.map(f => f.field);
    const validation = validateMapping(mapping, requiredFieldNames);

    if (!validation.valid) {
      alert(`Missing required fields: ${validation.missingFields.join(', ')}`);
      return;
    }

    const result = mapCSVData(csvData, mapping, transform);
    setImportResult(result);
    setStep('preview');
  };

  const handleImport = () => {
    if (importResult && importResult.data.length > 0) {
      onImport(importResult.data);
      handleClose();
    }
  };

  const handleClose = () => {
    setCSVData([]);
    setCSVColumns([]);
    setMapping([]);
    setStep('upload');
    setImportResult(null);
    setFileName('');
    onClose();
  };

  const getMappedColumn = (appField: string): string => {
    return mapping.find(m => m.appField === appField)?.csvColumn || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-4">
            <div className={`flex items-center ${step === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'upload' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Upload</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300" />
            <div className={`flex items-center ${step === 'map' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'map' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Map Fields</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300" />
            <div className={`flex items-center ${step === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'preview' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Preview & Import</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">Upload a CSV file</span>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">CSV files only</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• First row must contain column headers</li>
                  <li>• Required fields: {requiredFields.map(f => f.label).join(', ')}</li>
                  {optionalFields.length > 0 && (
                    <li>• Optional fields: {optionalFields.map(f => f.label).join(', ')}</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Map Fields */}
          {step === 'map' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  File: <span className="font-medium">{fileName}</span> ({csvData.length} rows)
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Required Fields</h3>
                {requiredFields.map(({ field, label }) => (
                  <div key={field} className="grid grid-cols-2 gap-4 items-center">
                    <label className="font-medium text-gray-700">{label} *</label>
                    <Select
                      value={getMappedColumn(field)}
                      onChange={(e) => handleMappingChange(field, e.target.value)}
                    >
                      <option value="">-- Select Column --</option>
                      {csvColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>

              {optionalFields.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-gray-800">Optional Fields</h3>
                  {optionalFields.map(({ field, label }) => (
                    <div key={field} className="grid grid-cols-2 gap-4 items-center">
                      <label className="font-medium text-gray-700">{label}</label>
                      <Select
                        value={getMappedColumn(field)}
                        onChange={(e) => handleMappingChange(field, e.target.value)}
                      >
                        <option value="">-- Skip --</option>
                        {csvColumns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && importResult && (
            <div className="space-y-4">
              {importResult.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Ready to import {importResult.data.length} {importResult.data.length === 1 ? 'entry' : 'entries'}
                  </p>
                </div>
              )}

              {importResult.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">Warnings:</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    {importResult.warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {importResult.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Preview (first 5 entries):
                </h4>
                <p className="text-xs text-gray-500">
                  {importResult.data.length} total {importResult.data.length === 1 ? 'entry' : 'entries'} will be imported
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <div className="flex gap-3">
            {step === 'map' && (
              <Button variant="secondary" onClick={() => setStep('upload')}>
                Back
              </Button>
            )}
            {step === 'preview' && (
              <Button variant="secondary" onClick={() => setStep('map')}>
                Back
              </Button>
            )}
            {step === 'map' && (
              <Button variant="primary" onClick={handlePreview}>
                Preview Import
              </Button>
            )}
            {step === 'preview' && importResult && importResult.data.length > 0 && (
              <Button variant="primary" onClick={handleImport}>
                Import {importResult.data.length} {importResult.data.length === 1 ? 'Entry' : 'Entries'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
