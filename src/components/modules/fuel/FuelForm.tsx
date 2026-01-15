/**
 * Fuel Form
 * Form for entering fuel consumption data for equipment and vehicles
 */

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormField } from '../../ui/FormField';
import { SmartDefaultsIndicator } from '../../ui/SmartDefaultsIndicator';
import { CalculationPreview } from '../../shared/CalculationPreview';
import { DraftIndicator } from '../../shared/DraftIndicator';
import { useProductionInfoStore } from '../../../store/useProductionInfoStore';
import { getSmartDefaults, storeRecentValue, getRecentValue } from '../../../utils/smartDefaults';
import { fuelCalculator } from '../../../services/calculations/fuelCalculator';
import { useAutosave } from '../../../hooks/useAutosave';
import type { FuelEntry, FuelFormData } from '../../../types/fuel.types';

const fuelSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  endDate: z.string().optional(),
  equipmentType: z.enum([
    'Cars', 'Motorcycles', 'Buses', 'Vans, Pickups, SUVs', 'Trucks (<18 wheel)',
    'Fueler Truck', '18 Wheelers', 'All Vehicles', 'Hybrid SUVs', 'Hybrid Cars',
    'Boat', 'Generator', 'Trailer', 'Cooking Equipment', 'Lift', 'Heater', 'Other'
  ]),
  fuelType: z.enum([
    'Gasoline', 'Diesel Fuel', 'Diesel (Red)', 'Propane', 'Butane', 'LPG', 'CNG',
    'LNG', 'Natural gas', 'Jet Fuel', 'Aviation Gasoline', 'Kerosene', 'Fuel Oil',
    'RFO (Ships)', 'Ethanol (E100)', 'E85', 'Hydrogen', 'Acetylene'
  ]),
  reasonForUse: z.string().optional(),
  calculationMethod: z.enum(['amount', 'mileage', 'cost']),
  fuelAmount: z.string().optional(),
  fuelUnit: z.enum(['gallons', 'liters', 'cubic feet', 'cubic meters', 'kg', 'lbs', 'ccf', 'ccm', 'sterno cans']).optional(),
  milesDriven: z.string().optional(),
  totalCost: z.string().optional(),
  averagePricePerGallon: z.string().optional()
});

interface FuelFormProps {
  onSubmit: (entry: FuelEntry) => void;
  onCancel?: () => void;
}

export function FuelForm({ onSubmit, onCancel }: FuelFormProps) {
  const { productionInfo } = useProductionInfoStore();

  // Get smart defaults based on production info and user history
  const smartDefaults = getSmartDefaults('fuel', productionInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FuelFormData>({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      date: smartDefaults.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      equipmentType: smartDefaults.equipmentType || 'Generator',
      fuelType: smartDefaults.fuelType || 'Diesel Fuel',
      calculationMethod: smartDefaults.calculationMethod || 'amount',
      fuelUnit: smartDefaults.fuelUnit || 'gallons'
    }
  });

  // Update form when production info changes
  useEffect(() => {
    const newDefaults = getSmartDefaults('fuel', productionInfo);
    reset({
      date: newDefaults.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      equipmentType: newDefaults.equipmentType || 'Generator',
      fuelType: newDefaults.fuelType || 'Diesel Fuel',
      calculationMethod: newDefaults.calculationMethod || 'amount',
      fuelUnit: newDefaults.fuelUnit || 'gallons'
    });
  }, [productionInfo, reset]);

  const calculationMethod = watch('calculationMethod');
  const equipmentType = watch('equipmentType');

  // Watch all form values for live calculation preview
  const formValues = watch();

  // Auto-save draft
  const autosave = useAutosave({
    formType: 'fuel',
    data: formValues,
    enabled: true,
    debounceMs: 2000
  });

  // Handle draft restoration
  const handleRestoreDraft = () => {
    const draft = autosave.loadSavedDraft();
    if (draft) {
      reset(draft as FuelFormData);
    }
  };

  // Calculate preview emissions
  const previewResult = useMemo(() => {
    // Check if we have enough data for a meaningful preview
    const hasAmountData =
      formValues.calculationMethod === 'amount' &&
      formValues.fuelAmount &&
      formValues.fuelUnit;

    const hasMileageData =
      formValues.calculationMethod === 'mileage' &&
      formValues.milesDriven;

    const hasCostData =
      formValues.calculationMethod === 'cost' &&
      formValues.totalCost &&
      formValues.averagePricePerGallon;

    if (!hasAmountData && !hasMileageData && !hasCostData) {
      return { co2e: null };
    }

    try {
      // Create a temporary entry for calculation
      const tempEntry: FuelEntry = {
        id: 'preview',
        date: new Date(formValues.date || new Date()),
        endDate: formValues.endDate ? new Date(formValues.endDate) : undefined,
        equipmentType: formValues.equipmentType || 'Generator',
        fuelType: formValues.fuelType || 'Diesel Fuel',
        reasonForUse: formValues.reasonForUse,
        calculationMethod: formValues.calculationMethod || 'amount',
        fuelAmount: formValues.fuelAmount ? Number(formValues.fuelAmount) : undefined,
        fuelUnit: formValues.fuelUnit,
        milesDriven: formValues.milesDriven ? Number(formValues.milesDriven) : undefined,
        totalCost: formValues.totalCost ? Number(formValues.totalCost) : undefined,
        averagePricePerGallon: formValues.averagePricePerGallon ? Number(formValues.averagePricePerGallon) : undefined
      };

      const result = fuelCalculator.calculateEntry(tempEntry);

      return {
        co2e: result.co2e
      };
    } catch (error) {
      console.error('Preview calculation error:', error);
      return { co2e: null };
    }
  }, [formValues]);

  const handleFormSubmit = (data: FuelFormData) => {
    // Store recent values for smart defaults
    storeRecentValue('equipmentType', data.equipmentType);
    storeRecentValue('fuelType', data.fuelType);
    storeRecentValue('calculationMethod', data.calculationMethod);
    if (data.fuelUnit) storeRecentValue('fuelUnit', data.fuelUnit);

    const entry: FuelEntry = {
      id: `fuel-${Date.now()}`,
      date: new Date(data.date),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      equipmentType: data.equipmentType,
      fuelType: data.fuelType,
      reasonForUse: data.reasonForUse,
      calculationMethod: data.calculationMethod,
      fuelAmount: data.fuelAmount ? Number(data.fuelAmount) : undefined,
      fuelUnit: data.fuelUnit,
      milesDriven: data.milesDriven ? Number(data.milesDriven) : undefined,
      totalCost: data.totalCost ? Number(data.totalCost) : undefined,
      averagePricePerGallon: data.averagePricePerGallon ? Number(data.averagePricePerGallon) : undefined
    };

    onSubmit(entry);
    reset();
    autosave.clearSavedDraft(); // Clear draft after successful submission
  };

  const showAmountFields = calculationMethod === 'amount';
  const showMileageFields = calculationMethod === 'mileage';
  const showCostFields = calculationMethod === 'cost';

  // Check if equipment is a vehicle (for mileage option)
  const isVehicle = ['Cars', 'Motorcycles', 'Buses', 'Vans, Pickups, SUVs', 'Trucks (<18 wheel)',
    'Fueler Truck', '18 Wheelers', 'All Vehicles', 'Hybrid SUVs', 'Hybrid Cars'].includes(equipmentType);

  // Check if we have production info or recent values
  const hasProductionInfo = !!productionInfo;
  const hasRecentValues = !!(getRecentValue('equipmentType') || getRecentValue('fuelType'));

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

      {/* Live Calculation Preview */}
      <CalculationPreview co2e={previewResult.co2e} />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date */}
        <FormField label="Start Date" htmlFor="date" required error={errors.date?.message}>
          <Input
            id="date"
            type="date"
            {...register('date')}
            error={!!errors.date}
          />
        </FormField>

        {/* End Date */}
        <FormField label="End Date (Optional)" htmlFor="endDate" error={errors.endDate?.message}>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
          />
        </FormField>

        {/* Equipment Type */}
        <FormField label="Equipment Type" htmlFor="equipmentType" required error={errors.equipmentType?.message}>
          <Select id="equipmentType" {...register('equipmentType')} error={!!errors.equipmentType}>
            <optgroup label="Vehicles">
              <option value="Cars">Cars</option>
              <option value="Motorcycles">Motorcycles</option>
              <option value="Buses">Buses</option>
              <option value="Vans, Pickups, SUVs">Vans, Pickups, SUVs</option>
              <option value="Trucks (<18 wheel)">Trucks (&lt;18 wheel)</option>
              <option value="Fueler Truck">Fueler Truck</option>
              <option value="18 Wheelers">18 Wheelers</option>
              <option value="All Vehicles">All Vehicles</option>
              <option value="Hybrid SUVs">Hybrid SUVs</option>
              <option value="Hybrid Cars">Hybrid Cars</option>
            </optgroup>
            <optgroup label="Equipment">
              <option value="Boat">Boat</option>
              <option value="Generator">Generator</option>
              <option value="Trailer">Trailer</option>
              <option value="Cooking Equipment">Cooking Equipment</option>
              <option value="Lift">Lift</option>
              <option value="Heater">Heater</option>
              <option value="Other">Other</option>
            </optgroup>
          </Select>
        </FormField>

        {/* Fuel Type */}
        <FormField label="Fuel Type" htmlFor="fuelType" required error={errors.fuelType?.message}>
          <Select id="fuelType" {...register('fuelType')} error={!!errors.fuelType}>
            <optgroup label="Common Liquid Fuels">
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel Fuel">Diesel Fuel</option>
              <option value="Diesel (Red)">Diesel (Red)</option>
            </optgroup>
            <optgroup label="Gas Fuels">
              <option value="Propane">Propane</option>
              <option value="Butane">Butane</option>
              <option value="LPG">LPG</option>
              <option value="CNG">CNG (Compressed Natural Gas)</option>
              <option value="LNG">LNG (Liquefied Natural Gas)</option>
              <option value="Natural gas">Natural Gas</option>
            </optgroup>
            <optgroup label="Aviation & Marine">
              <option value="Jet Fuel">Jet Fuel</option>
              <option value="Aviation Gasoline">Aviation Gasoline</option>
              <option value="RFO (Ships)">RFO (Ships)</option>
            </optgroup>
            <optgroup label="Other">
              <option value="Kerosene">Kerosene</option>
              <option value="Fuel Oil">Fuel Oil</option>
              <option value="Ethanol (E100)">Ethanol (E100)</option>
              <option value="E85">E85</option>
              <option value="Hydrogen">Hydrogen</option>
              <option value="Acetylene">Acetylene</option>
            </optgroup>
          </Select>
        </FormField>

        {/* Reason for Use */}
        <FormField label="Reason for Use (Optional)" htmlFor="reasonForUse" error={errors.reasonForUse?.message}>
          <Input
            id="reasonForUse"
            {...register('reasonForUse')}
            placeholder="e.g., Generator for lighting, Production vehicles"
          />
        </FormField>
      </div>

      {/* Calculation Method Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Method</h3>
        <div className="grid md:grid-cols-1 gap-6">
          {/* Calculation Method */}
          <FormField label="How do you want to calculate emissions?" htmlFor="calculationMethod" required>
            <Select id="calculationMethod" {...register('calculationMethod')}>
              <option value="amount">Direct Fuel Amount (Preferred)</option>
              {isVehicle && <option value="mileage">Miles Driven</option>}
              <option value="cost">Total Cost of Fuel</option>
            </Select>
          </FormField>

          {/* Method 1: Direct Amount */}
          {showAmountFields && (
            <div className="grid md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg">
              <FormField label="Fuel Amount" htmlFor="fuelAmount" required error={errors.fuelAmount?.message}>
                <Input
                  id="fuelAmount"
                  type="number"
                  step="0.01"
                  {...register('fuelAmount')}
                  placeholder="e.g., 100"
                  error={!!errors.fuelAmount}
                />
              </FormField>
              <FormField label="Unit" htmlFor="fuelUnit" required>
                <Select id="fuelUnit" {...register('fuelUnit')}>
                  <option value="gallons">Gallons</option>
                  <option value="liters">Liters</option>
                  <option value="cubic feet">Cubic Feet</option>
                  <option value="cubic meters">Cubic Meters</option>
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                  <option value="ccf">CCF (100 cubic feet)</option>
                  <option value="ccm">CCM (100 cubic meters)</option>
                  <option value="sterno cans">Sterno Cans</option>
                </Select>
              </FormField>
            </div>
          )}

          {/* Method 2: Mileage */}
          {showMileageFields && (
            <div className="bg-green-50 p-4 rounded-lg">
              <FormField label="Miles Driven" htmlFor="milesDriven" required error={errors.milesDriven?.message}>
                <Input
                  id="milesDriven"
                  type="number"
                  step="0.1"
                  {...register('milesDriven')}
                  placeholder="e.g., 500"
                  error={!!errors.milesDriven}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fuel consumption will be estimated based on average efficiency for {equipmentType}
                </p>
              </FormField>
            </div>
          )}

          {/* Method 3: Cost */}
          {showCostFields && (
            <div className="grid md:grid-cols-2 gap-6 bg-yellow-50 p-4 rounded-lg">
              <FormField label="Total Cost ($US)" htmlFor="totalCost" required error={errors.totalCost?.message}>
                <Input
                  id="totalCost"
                  type="number"
                  step="0.01"
                  {...register('totalCost')}
                  placeholder="e.g., 350.00"
                  error={!!errors.totalCost}
                />
              </FormField>
              <FormField label="Average Price per Gallon ($US)" htmlFor="averagePricePerGallon" required error={errors.averagePricePerGallon?.message}>
                <Input
                  id="averagePricePerGallon"
                  type="number"
                  step="0.01"
                  {...register('averagePricePerGallon')}
                  placeholder="e.g., 3.50"
                  error={!!errors.averagePricePerGallon}
                />
              </FormField>
            </div>
          )}
        </div>
      </div>

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
