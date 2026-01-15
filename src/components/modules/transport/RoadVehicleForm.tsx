/**
 * Road Vehicle Form
 * Form for entering road transport emissions data
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormField } from '../../ui/FormField';
import type { RoadVehicleEntry, RoadVehicleFormData } from '../../../types/transport.types';

const roadVehicleSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  vehicleType: z.enum(['car', 'van', 'truck', 'minibus', 'coach', 'motorcycle']),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'lpg']),
  distance: z.string().min(1, 'Distance is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  distanceUnit: z.enum(['km', 'miles']),
  passengers: z.string().optional(),
  fuelConsumption: z.string().optional(),
  fuelUnit: z.enum(['gallons', 'liters']).optional()
});

interface RoadVehicleFormProps {
  onSubmit: (entry: RoadVehicleEntry) => void;
  onCancel?: () => void;
}

export function RoadVehicleForm({ onSubmit, onCancel }: RoadVehicleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<RoadVehicleFormData>({
    resolver: zodResolver(roadVehicleSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      distanceUnit: 'miles',
      vehicleType: 'car',
      fuelType: 'petrol',
      fuelUnit: 'gallons'
    }
  });

  const fuelConsumption = watch('fuelConsumption');

  const handleFormSubmit = (data: RoadVehicleFormData) => {
    const entry: RoadVehicleEntry = {
      id: `road-${Date.now()}`,
      mode: 'road',
      date: new Date(data.date),
      description: data.description,
      vehicleType: data.vehicleType,
      fuelType: data.fuelType,
      distance: Number(data.distance),
      distanceUnit: data.distanceUnit,
      passengers: data.passengers ? Number(data.passengers) : undefined,
      fuelConsumption: data.fuelConsumption ? Number(data.fuelConsumption) : undefined,
      fuelUnit: data.fuelUnit
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
        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Input
            id="description"
            placeholder="e.g., Production van to location"
            {...register('description')}
          />
        </FormField>

        {/* Vehicle Type */}
        <FormField label="Vehicle Type" htmlFor="vehicleType" required error={errors.vehicleType?.message}>
          <Select id="vehicleType" {...register('vehicleType')} error={!!errors.vehicleType}>
            <option value="car">Car</option>
            <option value="van">Van</option>
            <option value="truck">Truck</option>
            <option value="minibus">Minibus</option>
            <option value="coach">Coach</option>
            <option value="motorcycle">Motorcycle</option>
          </Select>
        </FormField>

        {/* Fuel Type */}
        <FormField label="Fuel Type" htmlFor="fuelType" required error={errors.fuelType?.message}>
          <Select id="fuelType" {...register('fuelType')} error={!!errors.fuelType}>
            <option value="petrol">Petrol/Gasoline</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
            <option value="lpg">LPG</option>
          </Select>
        </FormField>

        {/* Distance */}
        <FormField label="Distance" htmlFor="distance" required error={errors.distance?.message}>
          <div className="flex gap-2">
            <Input
              id="distance"
              type="number"
              step="0.1"
              placeholder="0"
              {...register('distance')}
              error={!!errors.distance}
              className="flex-1"
            />
            <Select {...register('distanceUnit')} className="w-24">
              <option value="miles">mi</option>
              <option value="km">km</option>
            </Select>
          </div>
        </FormField>

        {/* Passengers */}
        <FormField label="Number of Passengers" htmlFor="passengers" error={errors.passengers?.message}>
          <Input
            id="passengers"
            type="number"
            min="1"
            placeholder="Optional"
            {...register('passengers')}
          />
        </FormField>

        {/* Optional: Fuel Consumption */}
        <FormField
          label="Fuel Consumed (Optional)"
          htmlFor="fuelConsumption"
          error={errors.fuelConsumption?.message}
          className="md:col-span-2"
        >
          <div className="flex gap-2">
            <Input
              id="fuelConsumption"
              type="number"
              step="0.01"
              placeholder="Leave blank to estimate from distance"
              {...register('fuelConsumption')}
              className="flex-1"
            />
            <Select {...register('fuelUnit')} className="w-28">
              <option value="gallons">gallons</option>
              <option value="liters">liters</option>
            </Select>
          </div>
          {fuelConsumption && (
            <p className="text-xs text-gray-500 mt-1">
              Direct fuel consumption provides more accurate emissions
            </p>
          )}
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end border-t pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          Add Road Vehicle Entry
        </Button>
      </div>
    </form>
  );
}
