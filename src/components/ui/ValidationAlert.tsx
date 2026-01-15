/**
 * Validation Alert Component
 * Displays validation warnings and errors
 */

import type { ValidationWarning } from '../../utils/dataValidation';

interface ValidationAlertProps {
  warnings: ValidationWarning[];
}

export function ValidationAlert({ warnings }: ValidationAlertProps) {
  if (warnings.length === 0) return null;

  const severityStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '❌'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️'
    }
  };

  // Group warnings by severity
  const errors = warnings.filter(w => w.severity === 'error');
  const warningsOnly = warnings.filter(w => w.severity === 'warning');
  const infos = warnings.filter(w => w.severity === 'info');

  return (
    <div className="space-y-2 mb-4">
      {/* Errors */}
      {errors.length > 0 && (
        <div className={`p-4 rounded-lg border ${severityStyles.error.bg} ${severityStyles.error.border}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{severityStyles.error.icon}</span>
            <div className="flex-1">
              <h4 className={`font-semibold ${severityStyles.error.text} mb-2`}>
                {errors.length === 1 ? 'Error' : `${errors.length} Errors`}
              </h4>
              <ul className={`text-sm ${severityStyles.error.text} space-y-1`}>
                {errors.map((warning, index) => (
                  <li key={index}>• {warning.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warningsOnly.length > 0 && (
        <div className={`p-4 rounded-lg border ${severityStyles.warning.bg} ${severityStyles.warning.border}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{severityStyles.warning.icon}</span>
            <div className="flex-1">
              <h4 className={`font-semibold ${severityStyles.warning.text} mb-2`}>
                {warningsOnly.length === 1 ? 'Warning' : `${warningsOnly.length} Warnings`}
              </h4>
              <ul className={`text-sm ${severityStyles.warning.text} space-y-1`}>
                {warningsOnly.map((warning, index) => (
                  <li key={index}>• {warning.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      {infos.length > 0 && (
        <div className={`p-3 rounded-lg border ${severityStyles.info.bg} ${severityStyles.info.border}`}>
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">{severityStyles.info.icon}</span>
            <div className="flex-1">
              <ul className={`text-sm ${severityStyles.info.text} space-y-1`}>
                {infos.map((info, index) => (
                  <li key={index}>• {info.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
