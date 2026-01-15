/**
 * Waste Tracking Form Component
 * Form for tracking waste (landfill, recycling, composting, etc.)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { WasteEntry, WasteFormData } from '../../../types/pearMetrics.types';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  wasteType: z.enum([
    'Waste to Landfill',
    'Mixed Recycling',
    'Cardboard Recycling',
    'Metal Recycling',
    'Wood Recycling',
    'Compost',
    'Thermal Waste to Energy',
    'E-Waste'
  ]),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Must be a positive number'
    }),
  unit: z.enum(['pounds', 'tons', 'cubic yards']),
  location: z.string().optional(),
  dataSource: z.string().optional(),
  comments: z.string().optional()
});

interface WasteFormProps {
  onSubmit: (entry: WasteEntry) => void;
}

export function WasteForm({ onSubmit }: WasteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<WasteFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      wasteType: 'Mixed Recycling',
      unit: 'pounds'
    }
  });

  const handleFormSubmit = (data: WasteFormData) => {
    const entry: WasteEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      wasteType: data.wasteType,
      amount: Number(data.amount),
      unit: data.unit,
      location: data.location || undefined,
      dataSource: data.dataSource || undefined,
      comments: data.comments || undefined
    };

    onSubmit(entry);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waste Type
          </label>
          <Select {...register('wasteType')} error={errors.wasteType?.message}>
            <optgroup label="Landfill">
              <option value="Waste to Landfill">Waste to Landfill</option>
            </optgroup>
            <optgroup label="Recycling">
              <option value="Mixed Recycling">Mixed Recycling</option>
              <option value="Cardboard Recycling">Cardboard Recycling</option>
              <option value="Metal Recycling">Metal Recycling</option>
              <option value="Wood Recycling">Wood Recycling</option>
            </optgroup>
            <optgroup label="Other">
              <option value="Compost">Compost</option>
              <option value="Thermal Waste to Energy">Thermal Waste to Energy</option>
              <option value="E-Waste">E-Waste</option>
            </optgroup>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 500"
            {...register('amount')}
            error={errors.amount?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <Select {...register('unit')} error={errors.unit?.message}>
            <option value="pounds">Pounds</option>
            <option value="tons">Tons</option>
            <option value="cubic yards">Cubic Yards</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Main Office, Stage 5"
            {...register('location')}
            error={errors.location?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Source (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Hauler report, estimate"
            {...register('dataSource')}
            error={errors.dataSource?.message}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments (Optional)
          </label>
          <Input
            type="text"
            placeholder="Additional notes"
            {...register('comments')}
            error={errors.comments?.message}
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
