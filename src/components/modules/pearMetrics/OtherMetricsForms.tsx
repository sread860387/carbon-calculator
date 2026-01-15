/**
 * Other PEAR Metrics Forms
 * Forms for Donations, Recycled Paper, and Biodiesel tracking
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import type {
  DonationEntry,
  DonationFormData,
  RecycledPaperEntry,
  RecycledPaperFormData,
  BiodieselEntry,
  BiodieselFormData,
  HybridVehicleEntry,
  HybridVehicleFormData,
  OtherFuelSavingEntry,
  OtherFuelSavingFormData
} from '../../../types/pearMetrics.types';

// ============================================================================
// DONATIONS FORM
// ============================================================================

const donationSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  donationType: z.string().min(1, 'Donation type is required'),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  value: z.string()
    .min(1, 'Value is required')
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Must be a non-negative number'
    }),
  comments: z.string().optional()
});

interface DonationFormProps {
  onSubmit: (entry: DonationEntry) => void;
}

export function DonationForm({ onSubmit }: DonationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const handleFormSubmit = (data: DonationFormData) => {
    const entry: DonationEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      donationType: data.donationType,
      quantity: data.quantity ? Number(data.quantity) : undefined,
      unit: data.unit || undefined,
      value: Number(data.value),
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
            Donation Type
          </label>
          <Input
            type="text"
            placeholder="e.g., Food, Equipment, Props"
            {...register('donationType')}
            error={errors.donationType?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity (Optional)
          </label>
          <Input
            type="number"
            step="1"
            min="0"
            placeholder="e.g., 10"
            {...register('quantity')}
            error={errors.quantity?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., boxes, pallets, items"
            {...register('unit')}
            error={errors.unit?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dollar Value
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 500.00"
            {...register('value')}
            error={errors.value?.message}
          />
        </div>

        <div>
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
          Add Donation
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// RECYCLED PAPER FORM
// ============================================================================

const recycledPaperSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  virginReams: z.string()
    .min(1, 'Virgin reams is required')
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Must be a non-negative number'
    }),
  recycledReams: z.string()
    .min(1, 'Recycled reams is required')
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Must be a non-negative number'
    }),
  comments: z.string().optional()
});

interface RecycledPaperFormProps {
  onSubmit: (entry: RecycledPaperEntry) => void;
}

export function RecycledPaperForm({ onSubmit }: RecycledPaperFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RecycledPaperFormData>({
    resolver: zodResolver(recycledPaperSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const handleFormSubmit = (data: RecycledPaperFormData) => {
    const entry: RecycledPaperEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      virginReams: Number(data.virginReams),
      recycledReams: Number(data.recycledReams),
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
            Virgin Paper (Reams)
          </label>
          <Input
            type="number"
            step="1"
            min="0"
            placeholder="e.g., 10"
            {...register('virginReams')}
            error={errors.virginReams?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recycled Paper (Reams)
          </label>
          <Input
            type="number"
            step="1"
            min="0"
            placeholder="e.g., 25"
            {...register('recycledReams')}
            error={errors.recycledReams?.message}
          />
        </div>

        <div>
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

// ============================================================================
// BIODIESEL FORM
// ============================================================================

const biodieselSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  biodieselType: z.enum(['B100', 'B99', 'B40', 'B20', 'B5']),
  amountGallons: z.string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Must be a positive number'
    }),
  comments: z.string().optional()
});

interface BiodieselFormProps {
  onSubmit: (entry: BiodieselEntry) => void;
}

export function BiodieselForm({ onSubmit }: BiodieselFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BiodieselFormData>({
    resolver: zodResolver(biodieselSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      biodieselType: 'B20'
    }
  });

  const handleFormSubmit = (data: BiodieselFormData) => {
    const entry: BiodieselEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      biodieselType: data.biodieselType,
      amountGallons: Number(data.amountGallons),
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
            Biodiesel Type
          </label>
          <Select {...register('biodieselType')} error={errors.biodieselType?.message}>
            <option value="B100">B100 (100% biodiesel)</option>
            <option value="B99">B99 (99% biodiesel)</option>
            <option value="B40">B40 (40% biodiesel)</option>
            <option value="B20">B20 (20% biodiesel)</option>
            <option value="B5">B5 (5% biodiesel)</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (Gallons)
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 50"
            {...register('amountGallons')}
            error={errors.amountGallons?.message}
          />
        </div>

        <div>
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

// ============================================================================
// HYBRID VEHICLE FORM
// ============================================================================

const hybridVehicleSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  vehicleType: z.enum(['Hybrid SUVs', 'Hybrid Cars']),
  fuelAmount: z.string().optional(),
  fuelUnit: z.enum(['gallons', 'liters']).optional(),
  distanceDriven: z.string().optional(),
  fuelCost: z.string().optional(),
  costPerGallon: z.string().optional(),
  comments: z.string().optional()
}).refine(data => {
  // At least one of: fuelAmount, distanceDriven, or fuelCost must be provided
  return data.fuelAmount || data.distanceDriven || data.fuelCost;
}, {
  message: 'Please provide at least one: Fuel Amount, Distance Driven, or Fuel Cost',
  path: ['fuelAmount']
});

interface HybridVehicleFormProps {
  onSubmit: (entry: HybridVehicleEntry) => void;
}

export function HybridVehicleForm({ onSubmit }: HybridVehicleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<HybridVehicleFormData>({
    resolver: zodResolver(hybridVehicleSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      vehicleType: 'Hybrid Cars',
      fuelUnit: 'gallons'
    }
  });

  const handleFormSubmit = (data: HybridVehicleFormData) => {
    const entry: HybridVehicleEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      vehicleType: data.vehicleType,
      fuelAmount: data.fuelAmount ? Number(data.fuelAmount) : undefined,
      fuelUnit: data.fuelUnit,
      distanceDriven: data.distanceDriven ? Number(data.distanceDriven) : undefined,
      fuelCost: data.fuelCost ? Number(data.fuelCost) : undefined,
      costPerGallon: data.costPerGallon ? Number(data.costPerGallon) : undefined,
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
            Vehicle Type
          </label>
          <Select {...register('vehicleType')} error={errors.vehicleType?.message}>
            <option value="Hybrid Cars">Hybrid Cars</option>
            <option value="Hybrid SUVs">Hybrid SUVs</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Amount (Preferred)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 15.5"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance Driven (Miles)
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 250"
            {...register('distanceDriven')}
            error={errors.distanceDriven?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Cost
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 45.00"
            {...register('fuelCost')}
            error={errors.fuelCost?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Per Gallon
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 3.50"
            {...register('costPerGallon')}
            error={errors.costPerGallon?.message}
          />
        </div>

        <div>
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

// ============================================================================
// OTHER FUEL SAVING FORM
// ============================================================================

const otherFuelSavingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  savingType: z.enum(['Electric Cars', 'Solar', 'Electric grid tie in', 'Other']),
  description: z.string().optional(),
  amountSaved: z.string().optional(),
  unit: z.string().optional(),
  comments: z.string().optional()
});

interface OtherFuelSavingFormProps {
  onSubmit: (entry: OtherFuelSavingEntry) => void;
}

export function OtherFuelSavingForm({ onSubmit }: OtherFuelSavingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OtherFuelSavingFormData>({
    resolver: zodResolver(otherFuelSavingSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      savingType: 'Electric Cars'
    }
  });

  const handleFormSubmit = (data: OtherFuelSavingFormData) => {
    const entry: OtherFuelSavingEntry = {
      id: crypto.randomUUID(),
      date: new Date(data.date),
      savingType: data.savingType,
      description: data.description || undefined,
      amountSaved: data.amountSaved ? Number(data.amountSaved) : undefined,
      unit: data.unit || undefined,
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
            Fuel Saving Type
          </label>
          <Select {...register('savingType')} error={errors.savingType?.message}>
            <option value="Electric Cars">Electric Cars</option>
            <option value="Solar">Solar</option>
            <option value="Electric grid tie in">Electric grid tie in</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Input
            type="text"
            placeholder="Describe the fuel saving measure"
            {...register('description')}
            error={errors.description?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Saved
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 100"
            {...register('amountSaved')}
            error={errors.amountSaved?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <Input
            type="text"
            placeholder="e.g., gallons, kWh"
            {...register('unit')}
            error={errors.unit?.message}
          />
        </div>

        <div>
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
