/**
 * Draft Indicator Component
 * Shows auto-save status and draft restoration options
 */

import { Button } from '../ui/Button';

interface DraftIndicatorProps {
  hasDraft: boolean;
  lastSavedText: string | null;
  onRestore?: () => void;
  onClear?: () => void;
}

export function DraftIndicator({ hasDraft, lastSavedText, onRestore, onClear }: DraftIndicatorProps) {
  if (!hasDraft && !lastSavedText) {
    return null;
  }

  // Show restore option if draft exists and hasn't been loaded yet
  if (hasDraft && onRestore) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-800 font-medium">Draft Found</span>
              {lastSavedText && (
                <span className="text-xs text-blue-600">• Saved {lastSavedText}</span>
              )}
            </div>
            <p className="text-sm text-blue-700">
              You have an unsaved draft. Would you like to restore it?
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="primary" size="sm" onClick={onRestore}>
              Restore
            </Button>
            {onClear && (
              <Button variant="ghost" size="sm" onClick={onClear}>
                Discard
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show auto-save indicator
  if (lastSavedText) {
    return (
      <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span>Draft saved {lastSavedText}</span>
      </div>
    );
  }

  return null;
}
