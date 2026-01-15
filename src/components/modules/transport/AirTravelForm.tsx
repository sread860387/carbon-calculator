/**
 * Air Travel Form
 * Form for entering air travel emissions data
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormField } from '../../ui/FormField';
import type { AirTravelEntry, AirTravelFormData } from '../../../types/transport.types';

const airTravelSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  flightClass: z.enum(['economy', 'premium-economy', 'business', 'first']),
  flightType: z.enum(['domestic', 'short-haul', 'long-haul']),
  distance: z.string().min(1, 'Distance is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  distanceUnit: z.enum(['km', 'miles']),
  passengers: z.string().min(1, 'Number of passengers is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Must be at least 1'),
  returnTrip: z.boolean()
});

interface AirTravelFormProps {
  onSubmit: (entry: AirTravelEntry) => void;
  onCancel?: () => void;
}

export function AirTravelForm({ onSubmit, onCancel }: AirTravelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<AirTravelFormData>({
    resolver: zodResolver(airTravelSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      distanceUnit: 'miles',
      flightClass: 'economy',
      flightType: 'domestic',
      returnTrip: false,
      passengers: '1'
    }
  });

  const returnTrip = watch('returnTrip');

  const handleFormSubmit = (data: AirTravelFormData) => {
    const entry: AirTravelEntry = {
      id: `air-${Date.now()}`,
      mode: 'air',
      date: new Date(data.date),
      description: data.description,
      origin: data.origin,
      destination: data.destination,
      flightClass: data.flightClass,
      flightType: data.flightType,
      distance: Number(data.distance),
      distanceUnit: data.distanceUnit,
      passengers: Number(data.passengers),
      returnTrip: data.returnTrip
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
            placeholder="e.g., Crew flight to location"
            {...register('description')}
          />
        </FormField>

        {/* Origin */}
        <FormField label="Origin" htmlFor="origin" required error={errors.origin?.message}>
          <Input
            id="origin"
            placeholder="e.g., Los Angeles"
            {...register('origin')}
            error={!!errors.origin}
          />
        </FormField>

        {/* Destination */}
        <FormField label="Destination" htmlFor="destination" required error={errors.destination?.message}>
          <Input
            id="destination"
            placeholder="e.g., New York"
            {...register('destination')}
            error={!!errors.destination}
          />
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
          <p className="text-xs text-gray-500 mt-1">
            Use a flight distance calculator if unknown
          </p>
        </FormField>

        {/* Flight Type */}
        <FormField label="Flight Type" htmlFor="flightType" required error={errors.flightType?.message}>
          <Select id="flightType" {...register('flightType')} error={!!errors.flightType}>
            <option value="domestic">Domestic (&lt;300 mi)</option>
            <option value="short-haul">Short-haul (300-700 mi)</option>
            <option value="long-haul">Long-haul (&gt;700 mi)</option>
          </Select>
        </FormField>

        {/* Flight Class */}
        <FormField label="Flight Class" htmlFor="flightClass" required error={errors.flightClass?.message}>
          <Select id="flightClass" {...register('flightClass')} error={!!errors.flightClass}>
            <option value="economy">Economy</option>
            <option value="premium-economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </Select>
        </FormField>

        {/* Passengers */}
        <FormField label="Number of Passengers" htmlFor="passengers" required error={errors.passengers?.message}>
          <Input
            id="passengers"
            type="number"
            min="1"
            {...register('passengers')}
            error={!!errors.passengers}
          />
        </FormField>

        {/* Return Trip */}
        <FormField label="Trip Type" htmlFor="returnTrip" className="md:col-span-2">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('returnTrip')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Return trip (double the distance)</span>
            </label>
          </div>
          {returnTrip && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Emissions will be calculated for round trip
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
          Add Air Travel Entry
        </Button>
      </div>
    </form>
  );
}
