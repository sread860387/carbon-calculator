/**
 * Progress Tracking Hook
 * Calculates completion status for each module
 */

import { useProductionInfoStore } from '../store/useProductionInfoStore';
import { useUtilitiesStore } from '../store/useUtilitiesStore';
import { useFuelStore } from '../store/useFuelStore';
import { useEVChargingStore } from '../store/useEVChargingStore';
import { useHotelsStore } from '../store/useHotelsStore';
import { useCommercialTravelStore } from '../store/useCommercialTravelStore';
import { useCharterFlightsStore } from '../store/useCharterFlightsStore';
import { usePEARMetricsStore } from '../store/usePEARMetricsStore';

export interface ModuleProgress {
  name: string;
  slug: string;
  isComplete: boolean;
  hasData: boolean;
  completionPercentage: number;
  requiredFieldsComplete: number;
  totalRequiredFields: number;
}

export function useProgressTracking() {
  const productionInfoStore = useProductionInfoStore();
  const utilitiesStore = useUtilitiesStore();
  const fuelStore = useFuelStore();
  const evStore = useEVChargingStore();
  const hotelsStore = useHotelsStore();
  const travelStore = useCommercialTravelStore();
  const charterStore = useCharterFlightsStore();
  const pearStore = usePEARMetricsStore();

  const productionInfo = productionInfoStore?.productionInfo;
  const utilityEntries = utilitiesStore?.entries || [];
  const fuelEntries = fuelStore?.entries || [];
  const evEntries = evStore?.entries || [];
  const hotelEntries = hotelsStore?.entries || [];
  const travelEntries = travelStore?.entries || [];
  const charterEntries = charterStore?.entries || [];
  const hybridVehicles = pearStore?.hybridVehicleEntries || [];
  const otherFuelSavings = pearStore?.otherFuelSavingEntries || [];
  const wasteReduction = pearStore?.wasteEntries || [];
  const waterConservation = pearStore?.drinkingWaterEntries || [];
  const greenCertifications = pearStore?.donationEntries || [];

  // Production Info progress
  const getProductionInfoProgress = (): ModuleProgress => {
    if (!productionInfo) {
      return {
        name: 'Production Info',
        slug: 'info',
        isComplete: false,
        hasData: false,
        completionPercentage: 0,
        requiredFieldsComplete: 0,
        totalRequiredFields: 2
      };
    }

    let complete = 0;
    const total = 2; // productionType and productionName are required

    if (productionInfo.productionType) complete++;
    if (productionInfo.productionName) complete++;

    return {
      name: 'Production Info',
      slug: 'info',
      isComplete: complete === total,
      hasData: true,
      completionPercentage: (complete / total) * 100,
      requiredFieldsComplete: complete,
      totalRequiredFields: total
    };
  };

  // Utilities progress
  const getUtilitiesProgress = (): ModuleProgress => {
    const hasData = utilityEntries.length > 0;
    return {
      name: 'Utilities',
      slug: 'utilities',
      isComplete: hasData,
      hasData,
      completionPercentage: hasData ? 100 : 0,
      requiredFieldsComplete: hasData ? 1 : 0,
      totalRequiredFields: 1
    };
  };

  // Fuel progress
  const getFuelProgress = (): ModuleProgress => {
    const hasData = fuelEntries.length > 0;
    return {
      name: 'Fuel',
      slug: 'fuel',
      isComplete: hasData,
      hasData,
      completionPercentage: hasData ? 100 : 0,
      requiredFieldsComplete: hasData ? 1 : 0,
      totalRequiredFields: 1
    };
  };

  // EV Charging progress
  const getEVProgress = (): ModuleProgress => {
    const hasData = evEntries.length > 0;
    return {
      name: 'EV Charging',
      slug: 'evcharging',
      isComplete: hasData,
      hasData,
      completionPercentage: hasData ? 100 : 0,
      requiredFieldsComplete: hasData ? 1 : 0,
      totalRequiredFields: 1
    };
  };

  // Hotels progress
  const getHotelsProgress = (): ModuleProgress => {
    const hasData = hotelEntries.length > 0;
    return {
      name: 'Hotels & Housing',
      slug: 'hotels',
      isComplete: hasData,
      hasData,
      completionPercentage: hasData ? 100 : 0,
      requiredFieldsComplete: hasData ? 1 : 0,
      totalRequiredFields: 1
    };
  };

  // Commercial Travel progress
  const getTravelProgress = (): ModuleProgress => {
    const hasData = travelEntries.length > 0;
    return {
      name: 'Commercial Travel',
      slug: 'commercial',
      isComplete: hasData,
      hasData,
      completionPercentage: hasData ? 100 : 0,
      requiredFieldsComplete: hasData ? 1 : 0,
      totalRequiredFields: 1
    };
  };

  // Charter Flights progress
  const getCharterProgress = (): ModuleProgress => {
    const hasData = charterEntries.length > 0;
    return {
      name: 'Charter & Heli Flights',
      slug: 'charter',
      isComplete: hasData,
      hasData,
      completionPercentage: hasData ? 100 : 0,
      requiredFieldsComplete: hasData ? 1 : 0,
      totalRequiredFields: 1
    };
  };

  // PEAR Metrics progress
  const getPEARMetricsProgress = (): ModuleProgress => {
    const hasData =
      hybridVehicles.length > 0 ||
      otherFuelSavings.length > 0 ||
      wasteReduction.length > 0 ||
      waterConservation.length > 0 ||
      greenCertifications.length > 0;

    return {
      name: 'PEAR Metrics',
      slug: 'metrics',
      isComplete: hasData,
      hasData,
      completionPercentage: hasData ? 100 : 0,
      requiredFieldsComplete: hasData ? 1 : 0,
      totalRequiredFields: 1
    };
  };

  const modules: ModuleProgress[] = [
    getProductionInfoProgress(),
    getUtilitiesProgress(),
    getFuelProgress(),
    getEVProgress(),
    getHotelsProgress(),
    getTravelProgress(),
    getCharterProgress(),
    getPEARMetricsProgress()
  ];

  const totalComplete = modules.filter(m => m.isComplete).length;
  const totalModules = modules.length;
  const overallPercentage = (totalComplete / totalModules) * 100;

  return {
    modules,
    totalComplete,
    totalModules,
    overallPercentage,
    isFullyComplete: totalComplete === totalModules
  };
}
