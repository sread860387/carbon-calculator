/**
 * Progress Indicator Component
 * Shows completion status for all modules
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useProgressTracking } from '../../hooks/useProgressTracking';

interface ProgressIndicatorProps {
  onNavigate?: (page: string) => void;
}

export function ProgressIndicator({ onNavigate }: ProgressIndicatorProps) {
  const { modules, totalComplete, totalModules, overallPercentage, isFullyComplete } = useProgressTracking();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Report Completion Status</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              {Math.round(overallPercentage)}%
            </p>
            <p className="text-xs text-gray-500">
              {totalComplete} of {totalModules} modules
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFullyComplete
                  ? 'bg-green-500'
                  : overallPercentage > 50
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Module List */}
        <div className="space-y-2">
          {modules.map((module) => (
            <div
              key={module.slug}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                onNavigate ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
              onClick={() => onNavigate && onNavigate(module.slug)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  {module.isComplete ? (
                    <span className="text-green-500 text-xl">✓</span>
                  ) : module.hasData ? (
                    <span className="text-amber-500 text-xl">◐</span>
                  ) : (
                    <span className="text-gray-300 text-xl">○</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {module.name}
                  </p>
                  {module.hasData && !module.isComplete && (
                    <p className="text-xs text-gray-500">
                      {module.requiredFieldsComplete}/{module.totalRequiredFields} required fields
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {module.hasData && (
                  <span className="text-xs font-medium text-gray-600">
                    {Math.round(module.completionPercentage)}%
                  </span>
                )}
                {onNavigate && (
                  <span className="text-gray-400">→</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {isFullyComplete && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              🎉 All modules complete! Ready to export your report.
            </p>
          </div>
        )}

        {!isFullyComplete && overallPercentage > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              Keep going! {totalModules - totalComplete} {totalModules - totalComplete === 1 ? 'module' : 'modules'} left to complete.
            </p>
          </div>
        )}

        {overallPercentage === 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 text-center">
              Get started by filling out the Production Info section.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
