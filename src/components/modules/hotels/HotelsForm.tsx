/**
 * Hotels Form Component
 * Form for entering hotel/housing stay data
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { HotelsEntry, HotelsFormData } from '../../../types/hotels.types';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  roomType: z.enum([
    'Economy Hotel',
    'Midscale Hotel',
    'Upscale Hotel',
    'Luxury Hotel',
    'Average House',
    'Apartment/Condo',
    'Large House'
  ]),
  city: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  stateProvince: z.string().optional(),
  totalNights: z.string()
    .min(1, 'Total nights is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Must be a positive number'
    })
});

interface HotelsFormProps {
  onSubmit: (entry: HotelsEntry) => void;
}

export function HotelsForm({ onSubmit }: HotelsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<HotelsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      roomType: 'Midscale Hotel',
      country: 'United States'
    }
  });

  const country = watch('country');

  const handleFormSubmit = (data: HotelsFormData) => {
    const entry: HotelsEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      roomType: data.roomType,
      city: data.city || undefined,
      country: data.country,
      stateProvince: data.stateProvince || undefined,
      totalNights: Number(data.totalNights)
    };

    onSubmit(entry);
    reset();
  };

  const showStateProvince = country === 'United States' || country === 'Canada';

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

        {/* Room/Housing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room/Housing Type
          </label>
          <Select {...register('roomType')} error={errors.roomType?.message}>
            <optgroup label="Hotels">
              <option value="Economy Hotel">Economy Hotel</option>
              <option value="Midscale Hotel">Midscale Hotel</option>
              <option value="Upscale Hotel">Upscale Hotel</option>
              <option value="Luxury Hotel">Luxury Hotel</option>
            </optgroup>
            <optgroup label="Housing">
              <option value="Average House">Average House</option>
              <option value="Apartment/Condo">Apartment/Condo</option>
              <option value="Large House">Large House</option>
            </optgroup>
          </Select>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <Select {...register('country')} error={errors.country?.message}>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
            <option value="Italy">Italy</option>
            <option value="Australia">Australia</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="Mexico">Mexico</option>
            <option value="Brazil">Brazil</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        {/* State/Province (conditional) */}
        {showStateProvince && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Province
            </label>
            <Input
              type="text"
              placeholder={country === 'United States' ? 'e.g., California' : 'e.g., Ontario'}
              {...register('stateProvince')}
              error={errors.stateProvince?.message}
            />
          </div>
        )}

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Los Angeles"
            {...register('city')}
            error={errors.city?.message}
          />
        </div>

        {/* Total Nights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Nights
          </label>
          <Input
            type="number"
            step="1"
            min="1"
            placeholder="e.g., 5"
            {...register('totalNights')}
            error={errors.totalNights?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of room nights (rooms × nights)
          </p>
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
