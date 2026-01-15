/**
 * Commercial Travel Form Component
 * Form for entering commercial travel data (flights, rail, ferry)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type { CommercialTravelEntry, CommercialTravelFormData } from '../../../types/commercialTravel.types';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  departureCity: z.string().optional(),
  arrivalCity: z.string().optional(),
  transportType: z.enum([
    'Flight',
    'National rail',
    'International rail',
    'Light rail and tram',
    'Ferry'
  ]),
  passengerDistance: z.string()
    .min(1, 'Passenger distance is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Must be a positive number'
    }),
  distanceUnit: z.enum(['miles', 'kilometers']),
  description: z.string().optional()
});

interface CommercialTravelFormProps {
  onSubmit: (entry: CommercialTravelEntry) => void;
}

export function CommercialTravelForm({ onSubmit }: CommercialTravelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CommercialTravelFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      transportType: 'Flight',
      distanceUnit: 'miles'
    }
  });

  const transportType = watch('transportType');

  const handleFormSubmit = (data: CommercialTravelFormData) => {
    const entry: CommercialTravelEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      departureCity: data.departureCity || undefined,
      arrivalCity: data.arrivalCity || undefined,
      transportType: data.transportType,
      passengerDistance: Number(data.passengerDistance),
      distanceUnit: data.distanceUnit,
      description: data.description || undefined
    };

    onSubmit(entry);
    reset();
  };

  const getTransportIcon = () => {
    switch (transportType) {
      case 'Flight': return '✈️';
      case 'National rail':
      case 'International rail':
      case 'Light rail and tram': return '🚆';
      case 'Ferry': return '⛴️';
      default: return '🚊';
    }
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

        {/* Transport Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getTransportIcon()} Transport Type
          </label>
          <Select {...register('transportType')} error={errors.transportType?.message}>
            <optgroup label="Air Travel">
              <option value="Flight">Commercial Flight</option>
            </optgroup>
            <optgroup label="Rail Travel">
              <option value="National rail">National Rail</option>
              <option value="International rail">International Rail</option>
              <option value="Light rail and tram">Light Rail / Tram</option>
            </optgroup>
            <optgroup label="Water Travel">
              <option value="Ferry">Ferry</option>
            </optgroup>
          </Select>
        </div>

        {/* Departure City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure City (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Los Angeles"
            {...register('departureCity')}
            error={errors.departureCity?.message}
          />
        </div>

        {/* Arrival City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arrival City (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., New York"
            {...register('arrivalCity')}
            error={errors.arrivalCity?.message}
          />
        </div>

        {/* Passenger Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Passenger Distance
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 250"
            {...register('passengerDistance')}
            error={errors.passengerDistance?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Distance × number of passengers (e.g., 250 miles × 1 person = 250)
          </p>
        </div>

        {/* Distance Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance Unit
          </label>
          <Select {...register('distanceUnit')} error={errors.distanceUnit?.message}>
            <option value="miles">Miles</option>
            <option value="kilometers">Kilometers</option>
          </Select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Production crew travel to location"
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
