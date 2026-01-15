/**
 * Utilities Form
 * Form for entering utilities (electricity and heating) data
 */

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormField } from '../../ui/FormField';
import { ValidationAlert } from '../../ui/ValidationAlert';
import { SmartDefaultsIndicator } from '../../ui/SmartDefaultsIndicator';
import { TemplateSelector } from '../../shared/TemplateSelector';
import { CalculationPreview } from '../../shared/CalculationPreview';
import { DraftIndicator } from '../../shared/DraftIndicator';
import { useProductionInfoStore } from '../../../store/useProductionInfoStore';
import { tooltipContent } from '../../../utils/tooltipContent';
import { validateUtilitiesEntry } from '../../../utils/dataValidation';
import { getSmartDefaults, storeRecentValue, getRecentValue } from '../../../utils/smartDefaults';
import { utilitiesCalculator } from '../../../services/calculations/utilitiesCalculator';
import { useAutosave } from '../../../hooks/useAutosave';
import type { UtilitiesEntry, UtilitiesFormData } from '../../../types/utilities.types';
import type { ValidationWarning } from '../../../utils/dataValidation';

const utilitiesSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  locationName: z.string().min(1, 'Location name is required'),
  buildingType: z.enum(['Office', 'Studio', 'Warehouse', 'Retail', 'Hotel/Motel', 'Restaurant', 'Healthcare', 'Education', 'Other']),
  area: z.string().optional(),
  areaUnit: z.enum(['square feet', 'square meters', 'square yards', 'acres']).optional(),
  daysOccupied: z.string().optional(),
  electricityMethod: z.enum(['usage', 'area', 'none']),
  electricityUsage: z.string().optional(),
  heatFuel: z.enum(['Natural Gas', 'Fuel Oil', 'None', 'Inc. in Elec.']),
  heatMethod: z.enum(['usage', 'area', 'none']),
  naturalGasUsage: z.string().optional(),
  naturalGasUnit: z.enum(['cubic feet', 'cubic meters', 'ccf', 'ccm', 'therms', 'kWh']).optional(),
  fuelOilUsage: z.string().optional(),
  fuelOilUnit: z.enum(['gallons', 'liters', 'Btu', 'Megajoules', 'Gigajoules']).optional()
});

interface UtilitiesFormProps {
  onSubmit: (entry: UtilitiesEntry) => void;
  onCancel?: () => void;
}

export function UtilitiesForm({ onSubmit, onCancel }: UtilitiesFormProps) {
  const { productionInfo } = useProductionInfoStore();
  const locations = productionInfo?.locations || [];
  const [validationWarnings, setValidationWarnings] = useState<ValidationWarning[]>([]);

  // Get smart defaults based on production info and user history
  const smartDefaults = getSmartDefaults('utilities', productionInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UtilitiesFormData>({
    resolver: zodResolver(utilitiesSchema),
    defaultValues: {
      date: smartDefaults.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      buildingType: smartDefaults.buildingType || 'Office',
      areaUnit: smartDefaults.areaUnit || 'square feet',
      electricityMethod: smartDefaults.electricityMethod || 'usage',
      heatFuel: smartDefaults.heatFuel || 'None',
      heatMethod: smartDefaults.heatMethod || 'none',
      naturalGasUnit: smartDefaults.naturalGasUnit || 'cubic feet',
      fuelOilUnit: smartDefaults.fuelOilUnit || 'gallons',
      locationName: smartDefaults.locationName || (locations.length > 0 ? locations[0].facilityName : '')
    }
  });

  // Update form when production info changes
  useEffect(() => {
    const newDefaults = getSmartDefaults('utilities', productionInfo);
    reset({
      date: newDefaults.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      buildingType: newDefaults.buildingType || 'Office',
      areaUnit: newDefaults.areaUnit || 'square feet',
      electricityMethod: newDefaults.electricityMethod || 'usage',
      heatFuel: newDefaults.heatFuel || 'None',
      heatMethod: newDefaults.heatMethod || 'none',
      naturalGasUnit: newDefaults.naturalGasUnit || 'cubic feet',
      fuelOilUnit: newDefaults.fuelOilUnit || 'gallons',
      locationName: newDefaults.locationName || (locations.length > 0 ? locations[0].facilityName : '')
    });
  }, [productionInfo, locations, reset]);

  const electricityMethod = watch('electricityMethod');
  const heatFuel = watch('heatFuel');
  const heatMethod = watch('heatMethod');

  // Watch all form values for live calculation preview
  const formValues = watch();

  // Auto-save draft
  const autosave = useAutosave({
    formType: 'utilities',
    data: formValues,
    enabled: true,
    debounceMs: 2000
  });

  // Handle draft restoration
  const handleRestoreDraft = () => {
    const draft = autosave.loadSavedDraft();
    if (draft) {
      reset(draft as UtilitiesFormData);
    }
  };

  // Calculate preview emissions
  const previewResult = useMemo(() => {
    // Check if we have enough data for a meaningful preview
    const hasElectricityData =
      formValues.electricityMethod === 'usage' && formValues.electricityUsage ||
      formValues.electricityMethod === 'area' && formValues.area;

    const hasHeatingData =
      (formValues.heatFuel === 'Natural Gas' && formValues.heatMethod === 'usage' && formValues.naturalGasUsage) ||
      (formValues.heatFuel === 'Fuel Oil' && formValues.heatMethod === 'usage' && formValues.fuelOilUsage) ||
      ((formValues.heatFuel === 'Natural Gas' || formValues.heatFuel === 'Fuel Oil') &&
       formValues.heatMethod === 'area' && formValues.area);

    if (!hasElectricityData && !hasHeatingData) {
      return { co2e: null, breakdown: [] };
    }

    try {
      // Create a temporary entry for calculation
      const tempEntry: UtilitiesEntry = {
        id: 'preview',
        date: new Date(formValues.date || new Date()),
        locationName: formValues.locationName || 'Preview',
        buildingType: formValues.buildingType || 'Office',
        area: formValues.area ? Number(formValues.area) : undefined,
        areaUnit: formValues.areaUnit,
        daysOccupied: formValues.daysOccupied ? Number(formValues.daysOccupied) : undefined,
        electricityMethod: formValues.electricityMethod || 'none',
        electricityUsage: formValues.electricityUsage ? Number(formValues.electricityUsage) : undefined,
        heatFuel: formValues.heatFuel || 'None',
        heatMethod: formValues.heatMethod || 'none',
        naturalGasUsage: formValues.naturalGasUsage ? Number(formValues.naturalGasUsage) : undefined,
        naturalGasUnit: formValues.naturalGasUnit,
        fuelOilUsage: formValues.fuelOilUsage ? Number(formValues.fuelOilUsage) : undefined,
        fuelOilUnit: formValues.fuelOilUnit
      };

      const result = utilitiesCalculator.calculateEntry(tempEntry);

      const breakdown = [];
      if (result.electricityEmissions > 0) {
        breakdown.push({
          label: 'Electricity',
          value: result.electricityEmissions,
          icon: '⚡'
        });
      }
      if (result.heatEmissions > 0) {
        breakdown.push({
          label: 'Heating',
          value: result.heatEmissions,
          icon: '🔥'
        });
      }

      return {
        co2e: result.totalEmissions,
        breakdown
      };
    } catch (error) {
      console.error('Preview calculation error:', error);
      return { co2e: null, breakdown: [] };
    }
  }, [formValues]);

  const handleFormSubmit = (data: UtilitiesFormData) => {
    // Validate the data
    const validationResult = validateUtilitiesEntry({
      ...data,
      electricityUsage: data.electricityUsage ? Number(data.electricityUsage) : undefined,
      area: data.area ? Number(data.area) : undefined,
      naturalGasUsage: data.naturalGasUsage ? Number(data.naturalGasUsage) : undefined,
      fuelOilUsage: data.fuelOilUsage ? Number(data.fuelOilUsage) : undefined
    });

    setValidationWarnings(validationResult.warnings);

    // Don't submit if there are errors
    if (!validationResult.isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Store recent values for smart defaults
    storeRecentValue('buildingType', data.buildingType);
    storeRecentValue('areaUnit', data.areaUnit || 'square feet');
    storeRecentValue('electricityMethod', data.electricityMethod);
    storeRecentValue('heatFuel', data.heatFuel);
    storeRecentValue('heatMethod', data.heatMethod);
    if (data.naturalGasUnit) storeRecentValue('naturalGasUnit', data.naturalGasUnit);
    if (data.fuelOilUnit) storeRecentValue('fuelOilUnit', data.fuelOilUnit);

    const entry: UtilitiesEntry = {
      id: `utilities-${Date.now()}`,
      date: new Date(data.date),
      description: data.description,
      locationName: data.locationName,
      buildingType: data.buildingType,
      area: data.area ? Number(data.area) : undefined,
      areaUnit: data.areaUnit,
      daysOccupied: data.daysOccupied ? Number(data.daysOccupied) : undefined,
      electricityMethod: data.electricityMethod,
      electricityUsage: data.electricityUsage ? Number(data.electricityUsage) : undefined,
      heatFuel: data.heatFuel,
      heatMethod: data.heatMethod,
      naturalGasUsage: data.naturalGasUsage ? Number(data.naturalGasUsage) : undefined,
      naturalGasUnit: data.naturalGasUnit,
      fuelOilUsage: data.fuelOilUsage ? Number(data.fuelOilUsage) : undefined,
      fuelOilUnit: data.fuelOilUnit
    };

    onSubmit(entry);
    reset();
    setValidationWarnings([]);
    autosave.clearSavedDraft(); // Clear draft after successful submission
  };

  const handleLoadTemplate = (templateData: Partial<UtilitiesFormData>) => {
    // Convert date if it exists
    const formData: any = { ...templateData };
    if (formData.date && typeof formData.date === 'string') {
      formData.date = formData.date;
    } else if (formData.date instanceof Date) {
      formData.date = formData.date.toISOString().split('T')[0];
    }

    reset(formData);
  };

  const showAreaFields = electricityMethod === 'area' || heatMethod === 'area';
  const showElectricityUsage = electricityMethod === 'usage';
  const showNaturalGasUsage = heatFuel === 'Natural Gas' && heatMethod === 'usage';
  const showFuelOilUsage = heatFuel === 'Fuel Oil' && heatMethod === 'usage';

  // Check if we have production info or recent values
  const hasProductionInfo = !!productionInfo;
  const hasRecentValues = !!(getRecentValue('buildingType') || getRecentValue('electricityMethod'));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Smart Defaults Indicator */}
      <SmartDefaultsIndicator hasProductionInfo={hasProductionInfo} hasRecentValues={hasRecentValues} />

      {/* Draft Indicator */}
      <DraftIndicator
        hasDraft={autosave.hasDraft}
        lastSavedText={autosave.getLastSavedText()}
        onRestore={handleRestoreDraft}
        onClear={autosave.clearSavedDraft}
      />

      {/* Validation Warnings */}
      <ValidationAlert warnings={validationWarnings} />

      {/* Template Selector */}
      <div className="flex justify-end border-b pb-4">
        <TemplateSelector
          type="utilities"
          currentData={watch()}
          onLoad={handleLoadTemplate}
          excludeFields={['date']}
        />
      </div>

      {/* Live Calculation Preview */}
      <CalculationPreview
        co2e={previewResult.co2e}
        breakdown={previewResult.breakdown}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date */}
        <FormField label="Date" htmlFor="date" required error={errors.date?.message} tooltip={tooltipContent.date}>
          <Input
            id="date"
            type="date"
            {...register('date')}
            error={!!errors.date}
          />
        </FormField>

        {/* Location Name */}
        <FormField label="Location Name" htmlFor="locationName" required error={errors.locationName?.message} tooltip={tooltipContent.locationName}>
          {locations.length > 0 ? (
            <Select id="locationName" {...register('locationName')} error={!!errors.locationName}>
              {locations.map((location) => (
                <option key={location.id} value={location.facilityName}>
                  {location.facilityName}
                </option>
              ))}
            </Select>
          ) : (
            <>
              <Input
                id="locationName"
                {...register('locationName')}
                placeholder="e.g., Main Studio, Office Building"
                error={!!errors.locationName}
              />
              <p className="text-xs text-amber-600 mt-1">
                ℹ️ Add locations in the Production Info tab to pre-populate this field
              </p>
            </>
          )}
        </FormField>

        {/* Description */}
        <FormField label="Description (Optional)" htmlFor="description" error={errors.description?.message} tooltip={tooltipContent.description}>
          <Input
            id="description"
            {...register('description')}
            placeholder="e.g., January utilities for Studio A"
          />
        </FormField>

        {/* Building Type */}
        <FormField label="Building Type" htmlFor="buildingType" required error={errors.buildingType?.message} tooltip={tooltipContent.buildingType}>
          <Select id="buildingType" {...register('buildingType')} error={!!errors.buildingType}>
            <option value="Office">Office</option>
            <option value="Studio">Studio</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Retail">Retail</option>
            <option value="Hotel/Motel">Hotel/Motel</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </Select>
        </FormField>
      </div>

      {/* Electricity Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Electricity</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Electricity Method */}
          <FormField label="Calculation Method" htmlFor="electricityMethod" required tooltip={tooltipContent.electricityMethod}>
            <Select id="electricityMethod" {...register('electricityMethod')}>
              <option value="usage">Direct Usage (kWh)</option>
              <option value="area">Estimate from Area</option>
              <option value="none">None</option>
            </Select>
          </FormField>

          {/* Electricity Usage */}
          {showElectricityUsage && (
            <FormField label="Electricity Usage (kWh)" htmlFor="electricityUsage" required error={errors.electricityUsage?.message} tooltip={tooltipContent.electricityUsage}>
              <Input
                id="electricityUsage"
                type="number"
                step="0.01"
                {...register('electricityUsage')}
                placeholder="e.g., 5000"
                error={!!errors.electricityUsage}
              />
            </FormField>
          )}
        </div>
      </div>

      {/* Heating Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Heating</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Heat Fuel Type */}
          <FormField label="Fuel Type" htmlFor="heatFuel" required>
            <Select id="heatFuel" {...register('heatFuel')}>
              <option value="None">None</option>
              <option value="Natural Gas">Natural Gas</option>
              <option value="Fuel Oil">Fuel Oil</option>
              <option value="Inc. in Elec.">Included in Electricity</option>
            </Select>
          </FormField>

          {/* Heat Method */}
          {heatFuel !== 'None' && heatFuel !== 'Inc. in Elec.' && (
            <FormField label="Calculation Method" htmlFor="heatMethod" required>
              <Select id="heatMethod" {...register('heatMethod')}>
                <option value="usage">Direct Usage</option>
                <option value="area">Estimate from Area</option>
                <option value="none">None</option>
              </Select>
            </FormField>
          )}

          {/* Natural Gas Usage */}
          {showNaturalGasUsage && (
            <>
              <FormField label="Natural Gas Usage" htmlFor="naturalGasUsage" required error={errors.naturalGasUsage?.message}>
                <Input
                  id="naturalGasUsage"
                  type="number"
                  step="0.01"
                  {...register('naturalGasUsage')}
                  placeholder="e.g., 1000"
                  error={!!errors.naturalGasUsage}
                />
              </FormField>
              <FormField label="Unit" htmlFor="naturalGasUnit" required>
                <Select id="naturalGasUnit" {...register('naturalGasUnit')}>
                  <option value="cubic feet">Cubic Feet</option>
                  <option value="cubic meters">Cubic Meters</option>
                  <option value="ccf">CCF (100 cubic feet)</option>
                  <option value="ccm">CCM (100 cubic meters)</option>
                  <option value="therms">Therms</option>
                  <option value="kWh">kWh</option>
                </Select>
              </FormField>
            </>
          )}

          {/* Fuel Oil Usage */}
          {showFuelOilUsage && (
            <>
              <FormField label="Fuel Oil Usage" htmlFor="fuelOilUsage" required error={errors.fuelOilUsage?.message}>
                <Input
                  id="fuelOilUsage"
                  type="number"
                  step="0.01"
                  {...register('fuelOilUsage')}
                  placeholder="e.g., 500"
                  error={!!errors.fuelOilUsage}
                />
              </FormField>
              <FormField label="Unit" htmlFor="fuelOilUnit" required>
                <Select id="fuelOilUnit" {...register('fuelOilUnit')}>
                  <option value="gallons">Gallons</option>
                  <option value="liters">Liters</option>
                  <option value="Btu">Btu</option>
                  <option value="Megajoules">Megajoules</option>
                  <option value="Gigajoules">Gigajoules</option>
                </Select>
              </FormField>
            </>
          )}
        </div>
      </div>

      {/* Area Section (conditionally shown) */}
      {showAreaFields && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Area-Based Estimation</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Area */}
            <FormField label="Total Area" htmlFor="area" required error={errors.area?.message}>
              <Input
                id="area"
                type="number"
                step="0.01"
                {...register('area')}
                placeholder="e.g., 10000"
                error={!!errors.area}
              />
            </FormField>

            {/* Area Unit */}
            <FormField label="Unit" htmlFor="areaUnit" required>
              <Select id="areaUnit" {...register('areaUnit')}>
                <option value="square feet">Square Feet</option>
                <option value="square meters">Square Meters</option>
                <option value="square yards">Square Yards</option>
                <option value="acres">Acres</option>
              </Select>
            </FormField>

            {/* Days Occupied */}
            <FormField label="Days Occupied" htmlFor="daysOccupied" error={errors.daysOccupied?.message}>
              <Input
                id="daysOccupied"
                type="number"
                step="1"
                {...register('daysOccupied')}
                placeholder="365 (default)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank for full year (365 days)
              </p>
            </FormField>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          Add Entry
        </Button>
      </div>
    </form>
  );
}
