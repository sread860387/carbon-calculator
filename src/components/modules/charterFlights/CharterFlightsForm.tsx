/**
 * Charter Flights Form Component
 * Form for entering charter jet and helicopter flight data
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { CharterFlightsEntry, CharterFlightsFormData } from '../../../types/charterFlights.types';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  aircraftType: z.enum([
    'Chartered Commercial Jet',
    'Large Private Jet',
    'Small Private Jet',
    'Helicopter'
  ]),
  model: z.string().optional(),
  calculationMethod: z.enum(['fuel', 'hours', 'distance']),
  fuelAmount: z.string().optional(),
  fuelUnit: z.enum(['gallons', 'liters']).optional(),
  hoursFlown: z.string().optional(),
  distanceFlown: z.string().optional(),
  distanceUnit: z.enum(['miles', 'kilometers']).optional(),
  description: z.string().optional()
}).refine((data) => {
  // Validate that the appropriate field is filled based on calculation method
  if (data.calculationMethod === 'fuel') {
    return data.fuelAmount && Number(data.fuelAmount) > 0;
  }
  if (data.calculationMethod === 'hours') {
    return data.hoursFlown && Number(data.hoursFlown) > 0;
  }
  if (data.calculationMethod === 'distance') {
    return data.distanceFlown && Number(data.distanceFlown) > 0;
  }
  return false;
}, {
  message: 'Please enter the required value for the selected calculation method',
  path: ['calculationMethod']
});

interface CharterFlightsFormProps {
  onSubmit: (entry: CharterFlightsEntry) => void;
}

export function CharterFlightsForm({ onSubmit }: CharterFlightsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CharterFlightsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      aircraftType: 'Large Private Jet',
      calculationMethod: 'fuel',
      fuelUnit: 'gallons',
      distanceUnit: 'miles'
    }
  });

  const calculationMethod = watch('calculationMethod');
  const aircraftType = watch('aircraftType');

  const handleFormSubmit = (data: CharterFlightsFormData) => {
    const entry: CharterFlightsEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      aircraftType: data.aircraftType,
      model: data.model || undefined,
      calculationMethod: data.calculationMethod,
      description: data.description || undefined
    };

    // Add the appropriate fields based on calculation method
    if (data.calculationMethod === 'fuel' && data.fuelAmount) {
      entry.fuelAmount = Number(data.fuelAmount);
      entry.fuelUnit = data.fuelUnit || 'gallons';
    } else if (data.calculationMethod === 'hours' && data.hoursFlown) {
      entry.hoursFlown = Number(data.hoursFlown);
    } else if (data.calculationMethod === 'distance' && data.distanceFlown) {
      entry.distanceFlown = Number(data.distanceFlown);
      entry.distanceUnit = data.distanceUnit || 'miles';
    }

    onSubmit(entry);
    reset();
  };

  const getAircraftIcon = () => {
    if (aircraftType === 'Helicopter') return '🚁';
    return '✈️';
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <Input
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />
        </div>

        {/* Aircraft Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getAircraftIcon()} Aircraft Type
          </label>
          <Select {...register('aircraftType')} error={errors.aircraftType?.message}>
            <optgroup label="Jets">
              <option value="Chartered Commercial Jet">Chartered Commercial Jet (&gt;20 pax)</option>
              <option value="Large Private Jet">Large Private Jet (14-20 pax)</option>
              <option value="Small Private Jet">Small Private Jet (5-13 pax)</option>
            </optgroup>
            <optgroup label="Helicopters">
              <option value="Helicopter">Helicopter</option>
            </optgroup>
          </Select>
        </div>

        {/* Model (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Gulfstream G650"
            {...register('model')}
            error={errors.model?.message}
          />
        </div>

        {/* Calculation Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calculation Method
          </label>
          <Select {...register('calculationMethod')} error={errors.calculationMethod?.message}>
            <option value="fuel">Fuel Amount (Preferred)</option>
            <option value="hours">Hours Flown</option>
            <option value="distance">Distance Flown</option>
          </Select>
        </div>

        {/* Conditional Fields Based on Calculation Method */}
        {calculationMethod === 'fuel' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Amount
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g., 500"
                {...register('fuelAmount')}
                error={errors.fuelAmount?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Unit
              </label>
              <Select {...register('fuelUnit')} error={errors.fuelUnit?.message}>
                <option value="gallons">Gallons</option>
                <option value="liters">Liters</option>
              </Select>
            </div>
          </>
        )}

        {calculationMethod === 'hours' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Hours Flown
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g., 2.5"
              {...register('hoursFlown')}
              error={errors.hoursFlown?.message}
            />
            <p className="text-xs text-gray-500 mt-1">
              Flight time in hours
            </p>
          </div>
        )}

        {calculationMethod === 'distance' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Distance Flown
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g., 500"
                {...register('distanceFlown')}
                error={errors.distanceFlown?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance Unit
              </label>
              <Select {...register('distanceUnit')} error={errors.distanceUnit?.message}>
                <option value="miles">Miles</option>
                <option value="kilometers">Kilometers</option>
              </Select>
            </div>
          </>
        )}

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Location scout helicopter flight"
            {...register('description')}
            error={errors.description?.message}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Add Entry
        </Button>
      </div>
    </form>
  );
}
