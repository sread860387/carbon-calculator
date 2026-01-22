/**
 * Contribute Data Modal
 * Modal for contributing production data to SEA's benchmarking report
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface ContributeDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContributeDataFormData) => Promise<void>;
  productionData: {
    productionName?: string;
    totalEmissions: number;
    moduleBreakdown: Array<{ name: string; co2e: number; entries: number }>;
  };
}

export interface ContributeDataFormData {
  contactName: string;
  contactEmail: string;
  organization?: string;
  consentGiven: boolean;
  includeContactInfo: boolean;
}

export function ContributeDataModal({
  isOpen,
  onClose,
  onSubmit,
  productionData
}: ContributeDataModalProps) {
  const [formData, setFormData] = useState<ContributeDataFormData>({
    contactName: '',
    contactEmail: '',
    organization: '',
    consentGiven: false,
    includeContactInfo: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.consentGiven) {
      setError('Please agree to the data sharing terms to continue.');
      return;
    }

    if (!formData.contactName || !formData.contactEmail) {
      setError('Please provide your name and email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          contactName: '',
          contactEmail: '',
          organization: '',
          consentGiven: false,
          includeContactInfo: false
        });
      }, 2000);
    } catch (err) {
      setError('Failed to submit data. Please try again or contact info@sustainableentertainmentalliance.org directly.');
      console.error('Contribution error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalModules = productionData.moduleBreakdown.filter(m => m.co2e > 0).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Contribute to SEA's Benchmarking Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h3>
              <p className="text-gray-600">
                Your data has been submitted successfully to the Sustainable Entertainment Alliance.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">About the Benchmarking Report</h3>
                <p className="text-sm text-blue-800 mb-3">
                  The Sustainable Entertainment Alliance conducts a comprehensive benchmarking study
                  every two years to assess average carbon emissions across different types of film
                  and TV productions. Your contribution helps us:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>• Establish industry-wide emission baselines</li>
                  <li>• Identify best practices and improvement opportunities</li>
                  <li>• Track progress toward sustainability goals</li>
                  <li>• Support evidence-based policy recommendations</li>
                </ul>
              </div>

              {/* Data Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Data to be Shared:</h4>
                <div className="space-y-2 text-sm">
                  {productionData.productionName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Production:</span>
                      <span className="font-medium">{productionData.productionName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Emissions:</span>
                    <span className="font-medium">
                      {productionData.totalEmissions >= 1000
                        ? `${(productionData.totalEmissions / 1000).toFixed(2)} tonnes CO₂e`
                        : `${productionData.totalEmissions.toFixed(2)} kg CO₂e`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Modules with Data:</span>
                    <span className="font-medium">{totalModules}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Your Contact Information</h4>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sea-green focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sea-green focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization (Optional)
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sea-green focus:border-transparent"
                  />
                </div>
              </div>

              {/* Privacy Options */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="includeContactInfo"
                    checked={formData.includeContactInfo}
                    onChange={(e) => setFormData({ ...formData, includeContactInfo: e.target.checked })}
                    className="mt-1 h-4 w-4 text-sea-green focus:ring-sea-green border-gray-300 rounded"
                  />
                  <label htmlFor="includeContactInfo" className="text-sm text-gray-700">
                    Include my contact information in the submission (optional). This allows SEA to
                    follow up with questions or share benchmarking results directly with you.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consentGiven"
                    checked={formData.consentGiven}
                    onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                    className="mt-1 h-4 w-4 text-sea-green focus:ring-sea-green border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="consentGiven" className="text-sm text-gray-700">
                    <strong>I consent to sharing this production data *</strong>
                    <span className="block mt-1 text-gray-600">
                      I understand that the Sustainable Entertainment Alliance will use this data for
                      benchmarking purposes. Production names will be anonymized in published reports
                      unless explicitly agreed otherwise. Data will be handled in accordance with SEA's
                      privacy policy and will not be shared with third parties for commercial purposes.
                    </span>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-sea-green text-white hover:bg-sea-green-shadow"
                  disabled={isSubmitting || !formData.consentGiven}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Data to SEA'}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Questions? Contact{' '}
                <a
                  href="mailto:info@sustainableentertainmentalliance.org"
                  className="text-sea-green hover:underline"
                >
                  info@sustainableentertainmentalliance.org
                </a>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
