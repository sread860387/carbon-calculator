/**
 * Onboarding Tour Utilities
 * Manage first-time user onboarding experience
 */

const TOUR_STORAGE_KEY = 'carbon-calculator-tour-completed';
const TOUR_SKIP_KEY = 'carbon-calculator-tour-skipped';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Check if user has completed the onboarding tour
 */
export function hasCompletedTour(): boolean {
  try {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  } catch {
    return true; // If localStorage fails, don't show tour
  }
}

/**
 * Check if user has skipped the tour
 */
export function hasSkippedTour(): boolean {
  try {
    return localStorage.getItem(TOUR_SKIP_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark tour as completed
 */
export function completeTour(): void {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    localStorage.removeItem(TOUR_SKIP_KEY);
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Mark tour as skipped
 */
export function skipTour(): void {
  try {
    localStorage.setItem(TOUR_SKIP_KEY, 'true');
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Reset tour (for testing or re-showing)
 */
export function resetTour(): void {
  try {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    localStorage.removeItem(TOUR_SKIP_KEY);
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Check if user should see the tour
 */
export function shouldShowTour(): boolean {
  return !hasCompletedTour() && !hasSkippedTour();
}

/**
 * Define tour steps
 */
export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Carbon Calculator',
    description: 'Track and calculate carbon emissions for your film and TV production. This quick tour will show you the key features.'
  },
  {
    id: 'production-info',
    title: 'Start with Production Info',
    description: 'First, enter your production details. This helps pre-populate forms and provides context for your emissions tracking.'
  },
  {
    id: 'modules',
    title: 'Emission Tracking Modules',
    description: 'Track emissions across different categories: Utilities, Fuel, EV Charging, Hotels, Commercial Travel, and Charter Flights. Each module has specialized forms for accurate tracking.'
  },
  {
    id: 'smart-features',
    title: 'Smart Features',
    description: 'The app learns from your entries! Smart defaults remember your preferences, and you can save templates for recurring entries. Live previews show emissions as you type.'
  },
  {
    id: 'dashboard',
    title: 'Dashboard & Analytics',
    description: 'View your total carbon footprint, see breakdowns by module, track progress over time with charts, and compare emissions across categories.'
  },
  {
    id: 'export',
    title: 'Export & Reports',
    description: 'Export your data to CSV, JSON, or generate PDF reports. Import bulk data via CSV to quickly add multiple entries.'
  },
  {
    id: 'get-started',
    title: 'Ready to Start!',
    description: 'You\'re all set! Start by entering your production information, then begin tracking emissions. Need help? Look for tooltips and info icons throughout the app.'
  }
];
