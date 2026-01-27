/**
 * Scope Classifications for GHG Accounting
 * Based on SEA & BAFTA albert Whitepaper on Scopes 1 & 2 Emissions
 *
 * Scope determination is based on operational control - whether the production
 * owns, leases, or has a rental/operating license for the emission source.
 */

export interface ScopeBreakdown {
  scope1: number;  // Direct emissions from owned/controlled sources (kg CO2e)
  scope2: number;  // Indirect emissions from purchased electricity (kg CO2e)
  scope3: number;  // All other indirect emissions (kg CO2e)
  total: number;   // Total emissions (kg CO2e)
}

export interface ModuleScopeBreakdown {
  moduleName: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

/**
 * Calculate Scope 1 & 2 breakdown from module totals
 *
 * Scope 1 (Direct emissions):
 * - Utilities: Natural gas and fuel oil combustion
 * - Fuel: Generators and production vehicles (owned/controlled)
 *
 * Scope 2 (Purchased electricity):
 * - Utilities: Grid-purchased electricity
 * - EV Charging: Grid-purchased electricity for vehicles
 *
 * Scope 3 (Other indirect):
 * - Hotels: Crew accommodation
 * - Commercial Travel: Flights, crew-owned vehicles
 * - Charter Flights: When not operationally controlled by production
 */
export function calculateScopeBreakdown(
  utilitiesTotals: { totalCO2e: number; electricityCO2e: number; heatCO2e: number } | undefined,
  fuelTotals: { totalCO2e: number } | undefined,
  evChargingTotals: { totalCO2e: number } | undefined,
  hotelsTotals: { totalCO2e: number } | undefined,
  commercialTravelTotals: { totalCO2e: number } | undefined,
  charterFlightsTotals: { totalCO2e: number } | undefined
): ScopeBreakdown {

  // SCOPE 1: Direct emissions from owned/controlled sources
  const scope1 =
    (utilitiesTotals?.heatCO2e || 0) +  // Natural gas + fuel oil
    (fuelTotals?.totalCO2e || 0);        // Generators + production vehicles

  // SCOPE 2: Purchased electricity
  const scope2 =
    (utilitiesTotals?.electricityCO2e || 0) +  // Grid electricity at facilities
    (evChargingTotals?.totalCO2e || 0);         // EV charging (grid electricity)

  // SCOPE 3: All other indirect emissions
  const scope3 =
    (hotelsTotals?.totalCO2e || 0) +            // Crew accommodation
    (commercialTravelTotals?.totalCO2e || 0) +  // Business travel
    (charterFlightsTotals?.totalCO2e || 0);     // Charter flights (typically not controlled)

  const total = scope1 + scope2 + scope3;

  return { scope1, scope2, scope3, total };
}

/**
 * Get detailed breakdown by module showing which scope each belongs to
 */
export function getModuleScopeBreakdowns(
  utilitiesTotals: { totalCO2e: number; electricityCO2e: number; heatCO2e: number } | undefined,
  fuelTotals: { totalCO2e: number } | undefined,
  evChargingTotals: { totalCO2e: number } | undefined,
  hotelsTotals: { totalCO2e: number } | undefined,
  commercialTravelTotals: { totalCO2e: number } | undefined,
  charterFlightsTotals: { totalCO2e: number } | undefined
): ModuleScopeBreakdown[] {

  const breakdowns: ModuleScopeBreakdown[] = [];

  // Utilities (split between Scope 1 and Scope 2)
  if (utilitiesTotals && utilitiesTotals.totalCO2e > 0) {
    breakdowns.push({
      moduleName: 'Utilities',
      scope1: utilitiesTotals.heatCO2e || 0,  // Natural gas + fuel oil
      scope2: utilitiesTotals.electricityCO2e || 0,  // Electricity
      scope3: 0,
      total: utilitiesTotals.totalCO2e
    });
  }

  // Fuel (Scope 1)
  if (fuelTotals && fuelTotals.totalCO2e > 0) {
    breakdowns.push({
      moduleName: 'Fuel',
      scope1: fuelTotals.totalCO2e,
      scope2: 0,
      scope3: 0,
      total: fuelTotals.totalCO2e
    });
  }

  // EV Charging (Scope 2)
  if (evChargingTotals && evChargingTotals.totalCO2e > 0) {
    breakdowns.push({
      moduleName: 'EV Charging',
      scope1: 0,
      scope2: evChargingTotals.totalCO2e,
      scope3: 0,
      total: evChargingTotals.totalCO2e
    });
  }

  // Hotels (Scope 3)
  if (hotelsTotals && hotelsTotals.totalCO2e > 0) {
    breakdowns.push({
      moduleName: 'Hotels & Housing',
      scope1: 0,
      scope2: 0,
      scope3: hotelsTotals.totalCO2e,
      total: hotelsTotals.totalCO2e
    });
  }

  // Commercial Travel (Scope 3)
  if (commercialTravelTotals && commercialTravelTotals.totalCO2e > 0) {
    breakdowns.push({
      moduleName: 'Commercial Travel',
      scope1: 0,
      scope2: 0,
      scope3: commercialTravelTotals.totalCO2e,
      total: commercialTravelTotals.totalCO2e
    });
  }

  // Charter Flights (Scope 3)
  if (charterFlightsTotals && charterFlightsTotals.totalCO2e > 0) {
    breakdowns.push({
      moduleName: 'Charter Flights',
      scope1: 0,
      scope2: 0,
      scope3: charterFlightsTotals.totalCO2e,
      total: charterFlightsTotals.totalCO2e
    });
  }

  return breakdowns;
}

/**
 * Get scope classification description for documentation
 */
export function getScopeDescription(scope: 1 | 2 | 3): string {
  switch (scope) {
    case 1:
      return 'Direct emissions from owned or controlled sources (fuel combustion in generators, production vehicles, facility heating)';
    case 2:
      return 'Indirect emissions from purchased electricity (grid electricity at facilities, EV charging)';
    case 3:
      return 'All other indirect emissions (hotels, commercial travel, charter flights)';
  }
}

/**
 * Get module scope classification
 */
export function getModuleScopeClassification(moduleName: string): {
  primaryScope: 1 | 2 | 3;
  description: string;
} {
  switch (moduleName) {
    case 'Utilities':
      return {
        primaryScope: 1, // Mixed - both Scope 1 (heat) and Scope 2 (electricity)
        description: 'Electricity (Scope 2), Natural Gas & Fuel Oil (Scope 1)'
      };
    case 'Fuel':
      return {
        primaryScope: 1,
        description: 'Scope 1: Direct fuel combustion in generators and production vehicles'
      };
    case 'EV Charging':
      return {
        primaryScope: 2,
        description: 'Scope 2: Grid electricity for vehicle charging'
      };
    case 'Hotels & Housing':
      return {
        primaryScope: 3,
        description: 'Scope 3: Crew accommodation (business travel)'
      };
    case 'Commercial Travel':
      return {
        primaryScope: 3,
        description: 'Scope 3: Business travel (flights, crew-owned vehicles)'
      };
    case 'Charter Flights':
      return {
        primaryScope: 3,
        description: 'Scope 3: Charter services (when not operationally controlled)'
      };
    default:
      return {
        primaryScope: 3,
        description: 'Scope 3: Other indirect emissions'
      };
  }
}
