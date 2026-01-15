/**
 * Locations Manager Component
 * Manages multiple production facilities and locations
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { formatDate } from '../../../utils/formatters';
import type { ProductionLocation, FacilityType } from '../../../types/productionInfo.types';

interface LocationsManagerProps {
  locations: ProductionLocation[];
  onChange: (locations: ProductionLocation[]) => void;
}

export function LocationsManager({ locations, onChange }: LocationsManagerProps) {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProductionLocation>>({
    facilityName: '',
    facilityType: 'Office',
    country: 'United States',
    stateProvince: '',
    zipCode: '',
    address: '',
    fromDate: undefined,
    endDate: undefined
  });

  const handleAdd = () => {
    if (!formData.facilityName || !formData.facilityType || !formData.country) {
      alert('Please fill in required fields: Facility Name, Type, and Country');
      return;
    }

    const newLocation: ProductionLocation = {
      id: crypto.randomUUID(),
      facilityName: formData.facilityName,
      facilityType: formData.facilityType as FacilityType,
      country: formData.country,
      stateProvince: formData.stateProvince || undefined,
      zipCode: formData.zipCode || undefined,
      address: formData.address || undefined,
      fromDate: formData.fromDate || undefined,
      endDate: formData.endDate || undefined
    };

    onChange([...locations, newLocation]);
    setFormData({
      facilityName: '',
      facilityType: 'Office',
      country: 'United States',
      stateProvince: '',
      zipCode: '',
      address: '',
      fromDate: undefined,
      endDate: undefined
    });
    setIsAddingLocation(false);
  };

  const handleUpdate = () => {
    if (!editingId || !formData.facilityName || !formData.facilityType || !formData.country) {
      return;
    }

    const updatedLocations = locations.map(loc =>
      loc.id === editingId
        ? {
            ...loc,
            facilityName: formData.facilityName!,
            facilityType: formData.facilityType as FacilityType,
            country: formData.country!,
            stateProvince: formData.stateProvince || undefined,
            zipCode: formData.zipCode || undefined,
            address: formData.address || undefined,
            fromDate: formData.fromDate || undefined,
            endDate: formData.endDate || undefined
          }
        : loc
    );

    onChange(updatedLocations);
    setEditingId(null);
    setFormData({
      facilityName: '',
      facilityType: 'Office',
      country: 'United States',
      stateProvince: '',
      zipCode: '',
      address: '',
      fromDate: undefined,
      endDate: undefined
    });
  };

  const handleEdit = (location: ProductionLocation) => {
    setEditingId(location.id);
    setFormData({
      facilityName: location.facilityName,
      facilityType: location.facilityType,
      country: location.country,
      stateProvince: location.stateProvince || '',
      zipCode: location.zipCode || '',
      address: location.address || '',
      fromDate: location.fromDate,
      endDate: location.endDate
    });
    setIsAddingLocation(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      onChange(locations.filter(loc => loc.id !== id));
    }
  };

  const handleCancel = () => {
    setIsAddingLocation(false);
    setEditingId(null);
    setFormData({
      facilityName: '',
      facilityType: 'Office',
      country: 'United States',
      stateProvince: '',
      zipCode: '',
      address: '',
      fromDate: undefined,
      endDate: undefined
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Facilities and Locations</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add all production facilities used for utilities tracking (offices, stages, warehouses, etc.)
          </p>
        </div>
        {!isAddingLocation && !editingId && (
          <Button onClick={() => setIsAddingLocation(true)} size="sm">
            + Add Location
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingLocation || editingId) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Location' : 'Add New Location'}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility & Location Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Main Production Office"
                  value={formData.facilityName}
                  onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <Select
                  value={formData.facilityType}
                  onChange={(e) => setFormData({ ...formData, facilityType: e.target.value as FacilityType })}
                >
                  <option value="On Location">On Location</option>
                  <option value="Office">Office</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Virtual Production Stage">Virtual Production Stage</option>
                  <option value="Stage(s)">Stage(s)</option>
                  <option value="Other Paid Utilities">Other Paid Utilities</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., United States"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <Input
                  type="text"
                  placeholder="e.g., California"
                  value={formData.stateProvince}
                  onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code (USA Only)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 90210"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 123 Main St"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date (Optional)
                </label>
                <Input
                  type="date"
                  value={formData.fromDate ? new Date(formData.fromDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <Input
                  type="date"
                  value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? 'Update Location' : 'Add Location'}
              </Button>
              <Button onClick={handleCancel} variant="ghost">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locations List */}
      {locations.length > 0 ? (
        <div className="space-y-3">
          {locations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📍</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{location.facilityName}</h4>
                        <p className="text-sm text-gray-600">{location.facilityType}</p>
                      </div>
                    </div>
                    <div className="ml-11 text-sm text-gray-700">
                      <p>
                        {location.country}
                        {location.stateProvince && `, ${location.stateProvince}`}
                        {location.zipCode && ` ${location.zipCode}`}
                      </p>
                      {location.address && (
                        <p className="text-gray-600">{location.address}</p>
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
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(location)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(location.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-3">📍</div>
            <p className="text-gray-600 mb-2">No locations added yet</p>
            <p className="text-sm text-gray-500">
              Add production facilities for utility electricity and heating tracking
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
