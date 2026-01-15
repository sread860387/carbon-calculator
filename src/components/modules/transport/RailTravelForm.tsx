/**
 * Rail Travel Form
 * Form for entering rail travel emissions data
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { FormField } from '../../ui/FormField';
import type { RailTravelEntry, RailTravelFormData } from '../../../types/transport.types';

const railTravelSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  railType: z.enum(['national', 'international', 'light-rail', 'underground']),
  distance: z.string().min(1, 'Distance is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  distanceUnit: z.enum(['km', 'miles']),
  passengers: z.string().optional()
});

interface RailTravelFormProps {
  onSubmit: (entry: RailTravelEntry) => void;
  onCancel?: () => void;
}

export function RailTravelForm({ onSubmit, onCancel }: RailTravelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RailTravelFormData>({
    resolver: zodResolver(railTravelSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      distanceUnit: 'miles',
      railType: 'national'
    }
  });

  const handleFormSubmit = (data: RailTravelFormData) => {
    const entry: RailTravelEntry = {
      id: `rail-${Date.now()}`,
      mode: 'rail',
      date: new Date(data.date),
      description: data.description,
      railType: data.railType,
      distance: Number(data.distance),
      distanceUnit: data.distanceUnit,
      passengers: data.passengers ? Number(data.passengers) : undefined
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
            placeholder="e.g., Commute to studio"
            {...register('description')}
          />
        </FormField>

        {/* Rail Type */}
        <FormField label="Rail Type" htmlFor="railType" required error={errors.railType?.message}>
          <Select id="railType" {...register('railType')} error={!!errors.railType}>
            <option value="national">National Rail</option>
            <option value="international">International Rail</option>
            <option value="light-rail">Light Rail / Tram</option>
            <option value="underground">Underground / Metro</option>
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
        <FormField label="Number of Passengers" htmlFor="passengers" error={errors.passengers?.message} className="md:col-span-2">
          <Input
            id="passengers"
            type="number"
            min="1"
            placeholder="Leave blank for single passenger"
            {...register('passengers')}
          />
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
          Add Rail Travel Entry
        </Button>
      </div>
    </form>
  );
}
