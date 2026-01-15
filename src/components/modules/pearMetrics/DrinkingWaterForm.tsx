/**
 * Drinking Water Form Component
 * Form for tracking drinking water container usage
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { DrinkingWaterEntry, DrinkingWaterFormData } from '../../../types/pearMetrics.types';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  containerType: z.enum([
    '0.5L Plastic water bottles',
    '5 gallon jugs',
    'Reusable bottles',
    'Boxed Water',
    'Aluminum Canned Water',
    'Aluminum Bottled Water',
    'Single Use Other (Non-Plastic)'
  ]),
  quantity: z.string()
    .min(1, 'Quantity is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Must be a positive number'
    }),
  totalCost: z.string().optional(),
  comments: z.string().optional()
});

interface DrinkingWaterFormProps {
  onSubmit: (entry: DrinkingWaterEntry) => void;
}

export function DrinkingWaterForm({ onSubmit }: DrinkingWaterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DrinkingWaterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      containerType: 'Reusable bottles'
    }
  });

  const handleFormSubmit = (data: DrinkingWaterFormData) => {
    const entry: DrinkingWaterEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      containerType: data.containerType,
      quantity: Number(data.quantity),
      totalCost: data.totalCost ? Number(data.totalCost) : undefined,
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
            Container Type
          </label>
          <Select {...register('containerType')} error={errors.containerType?.message}>
            <optgroup label="Reusable">
              <option value="Reusable bottles">Reusable bottles</option>
              <option value="5 gallon jugs">5 gallon jugs</option>
            </optgroup>
            <optgroup label="Single-Use">
              <option value="0.5L Plastic water bottles">0.5L Plastic water bottles</option>
              <option value="Boxed Water">Boxed Water</option>
              <option value="Aluminum Canned Water">Aluminum Canned Water</option>
              <option value="Aluminum Bottled Water">Aluminum Bottled Water</option>
              <option value="Single Use Other (Non-Plastic)">Single Use Other (Non-Plastic)</option>
            </optgroup>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <Input
            type="number"
            step="1"
            min="0"
            placeholder="e.g., 50"
            {...register('quantity')}
            error={errors.quantity?.message}
          />
          <p className="text-xs text-gray-500 mt-1">Number of containers</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Cost (Optional)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 25.00"
            {...register('totalCost')}
            error={errors.totalCost?.message}
          />
          <p className="text-xs text-gray-500 mt-1">Dollar amount</p>
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
