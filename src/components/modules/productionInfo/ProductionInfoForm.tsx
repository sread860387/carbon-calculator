/**
 * Production Info Form Component
 * Form for capturing production metadata and details
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { LocationsManager } from './LocationsManager';
import type { ProductionInfo, ProductionInfoFormData, ProductionLocation } from '../../../types/productionInfo.types';

const formSchema = z.object({
  productionType: z.enum(['Film', 'TV Production']),
  productionName: z.string().min(1, 'Production name is required'),
  firstShootDate: z.string().optional(),
  lastShootDate: z.string().optional(),
  filmCategory: z.enum([
    'Tentpole Plus ($130M+)',
    'Tentpole ($100M - $130M)',
    'Large ($75M - $100M)',
    'Medium ($40M - $75M)',
    'Small (<$40M)'
  ]).optional(),
  totalShootDays: z.string().optional(),
  firstUnitShootDays: z.string().optional(),
  secondUnitShootDays: z.string().optional(),
  additionalPhotographyDays: z.string().optional(),
  tvProductionType: z.enum([
    '1 Hour Scripted Drama',
    '1/2 Hour Scripted, Single Camera',
    '1/2 Hour Scripted Multi-Camera',
    'Unscripted Reality',
    'Unscripted Variety',
    'Unscripted Documentary',
    'Unscripted Natural History'
  ]).optional(),
  numberOfEpisodes: z.string().optional(),
  region: z.string().optional(),
  mainProductionOfficeLocation: z.string().optional(),
  headquarterStateProvince: z.string().optional(),
  prepDays: z.string().optional(),
  wrapDays: z.string().optional(),
  onLocationDays: z.string().optional(),
  stageDays: z.string().optional(),
  currency: z.enum(['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'Other']).optional(),
  calculatorContactName: z.string().optional(),
  calculatorContactPhone: z.string().optional(),
  coordinatorSignOffName: z.string().optional()
});

interface ProductionInfoFormProps {
  initialData?: ProductionInfo;
  onSubmit: (info: ProductionInfo) => void;
}

export function ProductionInfoForm({ initialData, onSubmit }: ProductionInfoFormProps) {
  const [locations, setLocations] = useState<ProductionLocation[]>(initialData?.locations || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ProductionInfoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      productionType: initialData.productionType,
      productionName: initialData.productionName,
      firstShootDate: initialData.firstShootDate ? new Date(initialData.firstShootDate).toISOString().split('T')[0] : undefined,
      lastShootDate: initialData.lastShootDate ? new Date(initialData.lastShootDate).toISOString().split('T')[0] : undefined,
      filmCategory: initialData.filmCategory,
      totalShootDays: initialData.totalShootDays?.toString(),
      firstUnitShootDays: initialData.firstUnitShootDays?.toString(),
      secondUnitShootDays: initialData.secondUnitShootDays?.toString(),
      additionalPhotographyDays: initialData.additionalPhotographyDays?.toString(),
      tvProductionType: initialData.tvProductionType,
      numberOfEpisodes: initialData.numberOfEpisodes?.toString(),
      region: initialData.region,
      mainProductionOfficeLocation: initialData.mainProductionOfficeLocation,
      headquarterStateProvince: initialData.headquarterStateProvince,
      prepDays: initialData.prepDays?.toString(),
      wrapDays: initialData.wrapDays?.toString(),
      onLocationDays: initialData.onLocationDays?.toString(),
      stageDays: initialData.stageDays?.toString(),
      currency: initialData.currency,
      calculatorContactName: initialData.calculatorContactName,
      calculatorContactPhone: initialData.calculatorContactPhone,
      coordinatorSignOffName: initialData.coordinatorSignOffName
    } : {
      productionType: 'Film',
      currency: 'USD'
    }
  });

  const productionType = watch('productionType');

  const handleFormSubmit = (data: ProductionInfoFormData) => {
    const info: ProductionInfo = {
      productionType: data.productionType,
      productionName: data.productionName,
      firstShootDate: data.firstShootDate ? new Date(data.firstShootDate) : undefined,
      lastShootDate: data.lastShootDate ? new Date(data.lastShootDate) : undefined,
      filmCategory: data.filmCategory,
      totalShootDays: data.totalShootDays ? Number(data.totalShootDays) : undefined,
      firstUnitShootDays: data.firstUnitShootDays ? Number(data.firstUnitShootDays) : undefined,
      secondUnitShootDays: data.secondUnitShootDays ? Number(data.secondUnitShootDays) : undefined,
      additionalPhotographyDays: data.additionalPhotographyDays ? Number(data.additionalPhotographyDays) : undefined,
      tvProductionType: data.tvProductionType,
      numberOfEpisodes: data.numberOfEpisodes ? Number(data.numberOfEpisodes) : undefined,
      region: data.region,
      mainProductionOfficeLocation: data.mainProductionOfficeLocation,
      headquarterStateProvince: data.headquarterStateProvince,
      prepDays: data.prepDays ? Number(data.prepDays) : undefined,
      wrapDays: data.wrapDays ? Number(data.wrapDays) : undefined,
      onLocationDays: data.onLocationDays ? Number(data.onLocationDays) : undefined,
      stageDays: data.stageDays ? Number(data.stageDays) : undefined,
      currency: data.currency,
      calculatorContactName: data.calculatorContactName,
      calculatorContactPhone: data.calculatorContactPhone,
      calculatorContactDate: new Date(),
      coordinatorSignOffName: data.coordinatorSignOffName,
      coordinatorSignOffDate: data.coordinatorSignOffName ? new Date() : undefined,
      locations: locations,
      lastUpdated: new Date()
    };

    onSubmit(info);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Production Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Production Information</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Row 1: Production Type */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Production Type *
            </label>
            <Select {...register('productionType')} error={errors.productionType?.message}>
              <option value="Film">Film</option>
              <option value="TV Production">TV Production</option>
            </Select>
          </div>

          {/* Row 2: Production Name, First Shoot Date, Last Shoot Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Production Name *
            </label>
            <Input
              type="text"
              placeholder="e.g., The Great Adventure"
              {...register('productionName')}
              error={errors.productionName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Shoot Date (MM/DD/YY)
            </label>
            <Input
              type="date"
              {...register('firstShootDate')}
              error={errors.firstShootDate?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Shoot Date (MM/DD/YY)
            </label>
            <Input
              type="date"
              {...register('lastShootDate')}
              error={errors.lastShootDate?.message}
            />
          </div>

          {/* Row 3 (Film): Category, Total Shoot Days, Region */}
          {productionType === 'Film' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category of Film by Budget
                </label>
                <Select {...register('filmCategory')} error={errors.filmCategory?.message}>
                  <option value="">Select category...</option>
                  <option value="Tentpole Plus ($130M+)">Tentpole Plus ($130M+)</option>
                  <option value="Tentpole ($100M - $130M)">Tentpole ($100M - $130M)</option>
                  <option value="Large ($75M - $100M)">Large ($75M - $100M)</option>
                  <option value="Medium ($40M - $75M)">Medium ($40M - $75M)</option>
                  <option value="Small (<$40M)">Small (&lt;$40M)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Number of Shoot Days
                </label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="e.g., 45"
                  {...register('totalShootDays')}
                  error={errors.totalShootDays?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Los Angeles, CA"
                  {...register('region')}
                  error={errors.region?.message}
                />
              </div>
            </>
          )}

          {/* Row 3 (TV): Type of TV Production, Number Episodes */}
          {productionType === 'TV Production' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of TV Production
                </label>
                <Select {...register('tvProductionType')} error={errors.tvProductionType?.message}>
                  <option value="">Select type...</option>
                  <option value="1 Hour Scripted Drama">1 Hour Scripted Drama</option>
                  <option value="1/2 Hour Scripted, Single Camera">1/2 Hour Scripted, Single Camera</option>
                  <option value="1/2 Hour Scripted Multi-Camera">1/2 Hour Scripted Multi-Camera</option>
                  <option value="Unscripted Reality">Unscripted Reality</option>
                  <option value="Unscripted Variety">Unscripted Variety</option>
                  <option value="Unscripted Documentary">Unscripted Documentary</option>
                  <option value="Unscripted Natural History">Unscripted Natural History</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number Episodes
                </label>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="e.g., 10"
                  {...register('numberOfEpisodes')}
                  error={errors.numberOfEpisodes?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Los Angeles, CA"
                  {...register('region')}
                  error={errors.region?.message}
                />
              </div>
            </>
          )}

          {/* Row 4: Main Production Office, Prep Days, Wrap Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Production Office Location
            </label>
            <Input
              type="text"
              placeholder="e.g., Studio City, CA"
              {...register('mainProductionOfficeLocation')}
              error={errors.mainProductionOfficeLocation?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days for Prep
            </label>
            <Input
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 30"
              {...register('prepDays')}
              error={errors.prepDays?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days for Wrap
            </label>
            <Input
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 15"
              {...register('wrapDays')}
              error={errors.wrapDays?.message}
            />
          </div>

          {/* Row 5 (Film): 1st Unit, 2nd Unit, Additional Photography - HIDDEN FOR NOW */}
          {/* {productionType === 'Film' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Number of 1st Unit Shoot Days
                </label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="e.g., 40"
                  {...register('firstUnitShootDays')}
                  error={errors.firstUnitShootDays?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Number of 2nd Unit Shoot Days
                </label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="e.g., 10"
                  {...register('secondUnitShootDays')}
                  error={errors.secondUnitShootDays?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other/Additional Photography Shoot Days
                </label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="e.g., 5"
                  {...register('additionalPhotographyDays')}
                  error={errors.additionalPhotographyDays?.message}
                />
              </div>
            </>
          )} */}

          {/* Row 6: Headquarter State, On Location Days, Stage Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headquarter State/Province
            </label>
            <Input
              type="text"
              placeholder="e.g., California"
              {...register('headquarterStateProvince')}
              error={errors.headquarterStateProvince?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of On Location Days
            </label>
            <Input
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 20"
              {...register('onLocationDays')}
              error={errors.onLocationDays?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Stage Days
            </label>
            <Input
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 25"
              {...register('stageDays')}
              error={errors.stageDays?.message}
            />
          </div>

          {/* Row 7: Currency (full width) */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Used
            </label>
            <Select {...register('currency')} error={errors.currency?.message}>
              <option value="USD">USD ($)</option>
              <option value="CAD">CAD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AUD">AUD ($)</option>
              <option value="Other">Other</option>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              NOTE: Please convert all expenses to the same currency and indicate that currency.
            </p>
          </div>
        </div>
      </div>

      {/* Facilities and Locations */}
      <div className="space-y-6">
        <LocationsManager locations={locations} onChange={setLocations} />
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calculator Contact Name
            </label>
            <Input
              type="text"
              placeholder="e.g., John Smith"
              {...register('calculatorContactName')}
              error={errors.calculatorContactName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calculator Contact Phone
            </label>
            <Input
              type="tel"
              placeholder="e.g., (555) 123-4567"
              {...register('calculatorContactPhone')}
              error={errors.calculatorContactPhone?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Production Coordinator Sign-Off Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Jane Doe"
              {...register('coordinatorSignOffName')}
              error={errors.coordinatorSignOffName?.message}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">
          Save Production Information
        </Button>
      </div>
    </form>
  );
}
