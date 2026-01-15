/**
 * Smart Defaults Indicator
 * Shows when smart defaults are being used to help users
 */

interface SmartDefaultsIndicatorProps {
  hasProductionInfo: boolean;
  hasRecentValues: boolean;
}

export function SmartDefaultsIndicator({ hasProductionInfo, hasRecentValues }: SmartDefaultsIndicatorProps) {
  if (!hasProductionInfo && !hasRecentValues) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            Smart Defaults Active
          </h4>
          <p className="text-xs text-blue-800">
            {hasProductionInfo && hasRecentValues && (
              <>Form values are pre-filled based on your production info and recent entries.</>
            )}
            {hasProductionInfo && !hasRecentValues && (
              <>Form values are pre-filled based on your production info.</>
            )}
            {!hasProductionInfo && hasRecentValues && (
              <>Form values are pre-filled based on your recent entries.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
