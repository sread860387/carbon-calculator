/**
 * Transport Module Types (Disabled)
 * Placeholder to prevent build errors
 */

export interface TransportModuleResults {
  totalCO2e: number;
  entries: any[];
  results: any[];
  totals: {
    totalCO2e: number;
    byMode: any;
    byType: any;
  } | null;
  metadata: any;
  filter: (fn: any) => any;
  forEach: (fn: any) => void;
  length: number;
}
