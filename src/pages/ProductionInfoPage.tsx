/**
 * Production Info Page
 * Main page for managing production metadata and details
 */

import { useState } from 'react';
import { useProductionInfoStore } from '../store/useProductionInfoStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProductionInfoForm } from '../components/modules/productionInfo/ProductionInfoForm';
import { formatDate } from '../utils/formatters';
import type { ProductionInfo } from '../types/productionInfo.types';

export function ProductionInfoPage() {
  const { productionInfo, updateProductionInfo, clearProductionInfo } = useProductionInfoStore();
  const [isEditing, setIsEditing] = useState(!productionInfo);

  const handleSubmit = (info: ProductionInfo) => {
    updateProductionInfo(info);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all production information?')) {
      clearProductionInfo();
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Production Information</h1>
          <p className="text-gray-600 mt-2">
            Basic metadata and details about your production
          </p>
        </div>
        {productionInfo && !isEditing && (
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="primary">
              Edit Information
            </Button>
            <Button onClick={handleClear} variant="danger" size="sm">
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Summary Card (when not editing) */}
      {productionInfo && !isEditing && (
        <Card className="bg-gradient-to-r from-slate-500 to-gray-600 text-white border-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold">{productionInfo.productionName}</h2>
                <p className="text-sm opacity-90 mt-1">
                  {productionInfo.productionType}
                  {productionInfo.filmCategory && ` • ${productionInfo.filmCategory}`}
                  {productionInfo.tvProductionType && ` • ${productionInfo.tvProductionType}`}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/20">
                {productionInfo.firstShootDate && productionInfo.lastShootDate && (
                  <div>
                    <p className="text-xs opacity-75">Shoot Dates</p>
                    <p className="font-semibold">
                      {formatDate(productionInfo.firstShootDate)} - {formatDate(productionInfo.lastShootDate)}
                    </p>
                  </div>
                )}

                {productionInfo.totalShootDays && (
                  <div>
                    <p className="text-xs opacity-75">Total Shoot Days</p>
                    <p className="font-semibold">{productionInfo.totalShootDays} days</p>
                  </div>
                )}

                {productionInfo.numberOfEpisodes && (
                  <div>
                    <p className="text-xs opacity-75">Episodes</p>
                    <p className="font-semibold">{productionInfo.numberOfEpisodes} episodes</p>
                  </div>
                )}

                {productionInfo.region && (
                  <div>
                    <p className="text-xs opacity-75">Region</p>
                    <p className="font-semibold">{productionInfo.region}</p>
                  </div>
                )}

                {productionInfo.currency && (
                  <div>
                    <p className="text-xs opacity-75">Currency</p>
                    <p className="font-semibold">{productionInfo.currency}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Table (when not editing) */}
      {productionInfo && !isEditing && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Schedule Details */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productionInfo.prepDays !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Prep Days</span>
                    <span className="font-medium">{productionInfo.prepDays}</span>
                  </div>
                )}
                {productionInfo.wrapDays !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Wrap Days</span>
                    <span className="font-medium">{productionInfo.wrapDays}</span>
                  </div>
                )}
                {productionInfo.onLocationDays !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">On Location Days</span>
                    <span className="font-medium">{productionInfo.onLocationDays}</span>
                  </div>
                )}
                {productionInfo.stageDays !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Stage Days</span>
                    <span className="font-medium">{productionInfo.stageDays}</span>
                  </div>
                )}
                {productionInfo.productionType === 'Film' && (
                  <>
                    {productionInfo.firstUnitShootDays !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">1st Unit Shoot Days</span>
                        <span className="font-medium">{productionInfo.firstUnitShootDays}</span>
                      </div>
                    )}
                    {productionInfo.secondUnitShootDays !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">2nd Unit Shoot Days</span>
                        <span className="font-medium">{productionInfo.secondUnitShootDays}</span>
                      </div>
                    )}
                    {productionInfo.additionalPhotographyDays !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Additional Photography Days</span>
                        <span className="font-medium">{productionInfo.additionalPhotographyDays}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productionInfo.mainProductionOfficeLocation && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-gray-600">Main Production Office</span>
                    <p className="font-medium">{productionInfo.mainProductionOfficeLocation}</p>
                  </div>
                )}
                {productionInfo.headquarterStateProvince && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-gray-600">Headquarter State/Province</span>
                    <p className="font-medium">{productionInfo.headquarterStateProvince}</p>
                  </div>
                )}
                {productionInfo.calculatorContactName && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-gray-600">Calculator Contact</span>
                    <p className="font-medium">{productionInfo.calculatorContactName}</p>
                    {productionInfo.calculatorContactPhone && (
                      <p className="text-sm text-gray-500">{productionInfo.calculatorContactPhone}</p>
                    )}
                  </div>
                )}
                {productionInfo.coordinatorSignOffName && (
                  <div className="py-2 border-b">
                    <span className="text-sm text-gray-600">Coordinator Sign-Off</span>
                    <p className="font-medium">{productionInfo.coordinatorSignOffName}</p>
                    {productionInfo.coordinatorSignOffDate && (
                      <p className="text-sm text-gray-500">
                        {formatDate(productionInfo.coordinatorSignOffDate)}
                      </p>
                    )}
                  </div>
                )}
                <div className="py-2">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <p className="text-sm text-gray-500">
                    {formatDate(productionInfo.lastUpdated)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Facilities and Locations (when not editing) */}
      {productionInfo && !isEditing && productionInfo.locations && productionInfo.locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Facilities and Locations ({productionInfo.locations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {productionInfo.locations.map((location) => (
                <div key={location.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{location.facilityName}</h4>
                      <p className="text-sm text-gray-600 mb-2">{location.facilityType}</p>
                      <div className="text-sm text-gray-700">
                        <p>
                          {location.country}
                          {location.stateProvince && `, ${location.stateProvince}`}
                          {location.zipCode && ` ${location.zipCode}`}
                        </p>
                        {location.address && (
                          <p className="text-gray-600 mt-1">{location.address}</p>
                        )}
                        {(location.fromDate || location.endDate) && (
                          <p className="text-gray-800 font-medium mt-1">
                            {location.fromDate && formatDate(location.fromDate)}
                            {location.fromDate && location.endDate && ' - '}
                            {location.endDate && formatDate(location.endDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Card (when editing or no data) */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {productionInfo ? 'Edit Production Information' : 'Enter Production Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductionInfoForm
              initialData={productionInfo || undefined}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!productionInfo && !isEditing && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No production information entered yet</p>
            <Button onClick={() => setIsEditing(true)}>
              Enter Production Information
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
