/**
 * EV Charging Form
 * Form for entering EV charging station data
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormField } from '../../ui/FormField';
import type { EVChargingEntry, EVChargingFormData } from '../../../types/evCharging.types';

const evChargingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  stateProvince: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  electricityUsageKWh: z.string().min(1, 'Electricity usage is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  milesDriven: z.string().optional()
});

interface EVChargingFormProps {
  onSubmit: (entry: EVChargingEntry) => void;
  onCancel?: () => void;
}

export function EVChargingForm({ onSubmit, onCancel }: EVChargingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EVChargingFormData>({
    resolver: zodResolver(evChargingSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      country: 'United States'
    }
  });

  const handleFormSubmit = (data: EVChargingFormData) => {
    const entry: EVChargingEntry = {
      id: `ev-charging-${Date.now()}`,
      date: new Date(data.date),
      description: data.description,
      country: data.country,
      stateProvince: data.stateProvince,
      zipCode: data.zipCode,
      address: data.address,
      electricityUsageKWh: Number(data.electricityUsageKWh),
      milesDriven: data.milesDriven ? Number(data.milesDriven) : undefined
    };

    onSubmit(entry);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Date */}
        <FormField label="Date" htmlFor="date" required error={errors.date?.message}>
          <Input
            id="date"
            type="date"
            {...register('date')}
            error={!!errors.date}
          />
        </FormField>

        {/* Description */}
        <FormField label="Description (Optional)" htmlFor="description" error={errors.description?.message}>
          <Input
            id="description"
            {...register('description')}
            placeholder="e.g., Main lot charging station"
          />
        </FormField>
      </div>

      {/* Location Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Charging Station Location</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Country */}
          <FormField label="Country" htmlFor="country" required error={errors.country?.message}>
            <Select id="country" {...register('country')} error={!!errors.country}>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="World">World (Average)</option>
            </Select>
          </FormField>

          {/* State/Province */}
          <FormField label="State/Province (Optional)" htmlFor="stateProvince">
            <Input
              id="stateProvince"
              {...register('stateProvince')}
              placeholder="e.g., California, Ontario"
            />
          </FormField>

          {/* Zip Code */}
          <FormField label="Zip Code (Optional)" htmlFor="zipCode">
            <Input
              id="zipCode"
              {...register('zipCode')}
              placeholder="e.g., 90210"
            />
          </FormField>

          {/* Address */}
          <FormField label="Address (Optional)" htmlFor="address">
            <Input
              id="address"
              {...register('address')}
              placeholder="e.g., 123 Main St"
            />
          </FormField>
        </div>
      </div>

      {/* Charging Data Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Charging Data</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Electricity Usage */}
          <FormField label="Electricity Usage (kWh)" htmlFor="electricityUsageKWh" required error={errors.electricityUsageKWh?.message}>
            <Input
              id="electricityUsageKWh"
              type="number"
              step="0.01"
              {...register('electricityUsageKWh')}
              placeholder="e.g., 500"
              error={!!errors.electricityUsageKWh}
            />
          </FormField>

          {/* Miles Driven (Optional) */}
          <FormField label="Miles Driven (Optional)" htmlFor="milesDriven">
            <Input
              id="milesDriven"
              type="number"
              step="0.1"
              {...register('milesDriven')}
              placeholder="e.g., 1500"
            />
            <p className="text-xs text-gray-500 mt-1">
              For tracking only, not used in emissions calculation
            </p>
          </FormField>
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
