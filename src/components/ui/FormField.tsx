/**
 * FormField Component
 * Wrapper component for form fields with label and error message
 */

import { ReactNode } from 'react';
import { Label } from './Label';
import { InfoTooltip } from './Tooltip';
import { cn } from '../../utils/cn';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  tooltip?: string;
  helpText?: string;
}

export function FormField({ label, htmlFor, required, error, children, className, tooltip, helpText }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      {children}
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
