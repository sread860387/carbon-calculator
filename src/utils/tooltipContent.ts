/**
 * Tooltip Content
 * Centralized help text for form fields across the application
 */

export const tooltipContent = {
  // Production Info
  productionType: 'Select whether this is a Film or TV Production',
  productionName: 'The official name of your production',
  firstShootDate: 'The first day of principal photography',
  lastShootDate: 'The final day of principal photography',
  filmCategory: 'Budget category helps estimate typical production emissions',
  totalShootDays: 'Total number of days with cameras rolling',
  tvProductionType: 'Type of TV show affects typical crew size and resource usage',
  numberOfEpisodes: 'Total episodes produced in this season/batch',
  region: 'Primary filming region (e.g., Los Angeles, Atlanta, London)',
  mainProductionOffice: 'Location of your main production office',
  headquarterState: 'State or province where your production company is headquartered',
  prepDays: 'Number of days in pre-production phase',
  wrapDays: 'Number of days for post-shoot wrap activities',
  onLocationDays: 'Days filming on practical locations (not on soundstages)',
  stageDays: 'Days filming on soundstages or studios',
  currency: 'All costs should be converted to this currency',

  // Utilities
  electricityMethod: 'Use actual kWh from bills when available, or estimate from building area',
  electricityUsage: 'Total kWh consumed during the billing period (found on utility bills)',
  buildingType: 'Type of building affects energy usage estimates',
  area: 'Total square footage/meters of the space',
  daysOccupied: 'Number of days the space was actively used (default: 365)',
  heatFuel: 'Type of fuel used for heating (Natural Gas, Fuel Oil, or None)',
  heatMethod: 'Use actual usage from bills when available',
  naturalGasUsage: 'Amount of natural gas consumed (check your gas bill)',
  fuelOilUsage: 'Amount of fuel oil consumed for heating',

  // Fuel
  fuelType: 'Type of fuel used in the vehicle or generator',
  fuelAmount: 'Total amount of fuel purchased or consumed',
  vehicleType: 'Type of vehicle helps determine typical fuel efficiency',
  distance: 'Total miles/kilometers driven (if known)',
  mpg: 'Miles per gallon or kilometers per liter',

  // EV Charging
  evChargingKWh: 'Total kWh charged to electric vehicles',
  evChargerType: 'Type of charger affects charging speed and emissions calculations',

  // Hotels
  hotelNights: 'Total number of room-nights (rooms × nights)',
  hotelType: 'Hotel type affects energy usage per room',
  hotelCountry: 'Country where hotel is located (affects emission factors)',

  // Commercial Travel
  flightDistance: 'Total flight distance in miles or kilometers',
  flightClass: 'Cabin class affects emissions due to space per passenger',
  numberOfPassengers: 'Total passengers traveling',

  // Charter Flights
  charterFlightHours: 'Total hours of flight time',
  aircraftType: 'Type of aircraft affects fuel burn rate',

  // PEAR Metrics
  hybridVehicles: 'Vehicles using hybrid or electric powertrains',
  otherFuelSavings: 'Alternative fuels or fuel-saving initiatives',
  wasteReduction: 'Waste diversion, recycling, and reduction programs',
  waterConservation: 'Water-saving measures and conservation efforts',
  greenCertifications: 'Environmental certifications and sustainability achievements',

  // General
  description: 'Optional note to help identify this entry later',
  date: 'Date when this activity occurred or billing period start',
  locationName: 'Name of the facility or location',
  fromDate: 'Start date for this facility usage period',
  endDate: 'End date for this facility usage period'
};
