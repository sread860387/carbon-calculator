import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ProductionInfoPage } from './pages/ProductionInfoPage';
import { DashboardPage } from './pages/DashboardPage';
import { UtilitiesPage } from './pages/UtilitiesPage';
import { FuelPage } from './pages/FuelPage';
import { EVChargingPage } from './pages/EVChargingPage';
import { HotelsPage } from './pages/HotelsPage';
import { CommercialTravelPage } from './pages/CommercialTravelPage';
import { CharterFlightsPage } from './pages/CharterFlightsPage';
import { PEARMetricsPage } from './pages/PEARMetricsPage';
import { Breadcrumbs } from './components/shared/Breadcrumbs';
import { OnboardingTour } from './components/shared/OnboardingTour';
import { resetTour } from './utils/onboarding';

type Page = 'landing' | 'info' | 'dashboard' | 'utilities' | 'fuel' | 'evcharging' | 'hotels' | 'commercial' | 'charter' | 'metrics';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [showTour, setShowTour] = useState(false);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleRestartTour = () => {
    resetTour();
    setShowTour(true);
    // Force a re-render by setting state
    setTimeout(() => {
      setShowTour(false);
      setTimeout(() => setShowTour(true), 100);
    }, 0);
  };

  // Get breadcrumb items based on current page
  const getBreadcrumbs = () => {
    const pageNames: Record<Page, string> = {
      landing: 'Home',
      info: 'Production Info',
      dashboard: 'Dashboard',
      utilities: 'Utilities',
      fuel: 'Fuel',
      evcharging: 'EV Charging',
      hotels: 'Hotels & Housing',
      commercial: 'Commercial Travel',
      charter: 'Charter & Heli Flights',
      metrics: 'PEAR Metrics'
    };

    if (currentPage === 'landing') {
      return [{ label: 'Home' }];
    }

    return [
      { label: 'Home', onClick: () => setCurrentPage('landing') },
      { label: pageNames[currentPage] }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-6 md:mb-8 relative">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 px-2">
            Carbon Calculator for Film & TV Production
          </h1>
          <p className="text-sm md:text-base text-gray-600 px-2">
            Track and calculate your production's carbon footprint
          </p>

          {/* Help Button */}
          <button
            onClick={handleRestartTour}
            className="absolute top-0 right-0 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Take a tour of the app"
          >
            <span className="hidden sm:inline">?</span> Help<span className="hidden sm:inline"> & Tour</span>
          </button>
        </header>

        {/* Breadcrumbs */}
        {currentPage !== 'landing' && (
          <div className="mb-6">
            <Breadcrumbs items={getBreadcrumbs()} />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 flex-wrap gap-1 max-w-full">
            <button
              onClick={() => setCurrentPage('landing')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'landing'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              🏠 <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={() => setCurrentPage('info')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'info'
                  ? 'bg-slate-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="hidden sm:inline">Production </span>Info
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'dashboard'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              📊 <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentPage('utilities')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'utilities'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Utilities
            </button>
            <button
              onClick={() => setCurrentPage('fuel')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'fuel'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Fuel
            </button>
            <button
              onClick={() => setCurrentPage('evcharging')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'evcharging'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              EV <span className="hidden sm:inline">Charging</span>
            </button>
            <button
              onClick={() => setCurrentPage('hotels')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'hotels'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Hotels
            </button>
            <button
              onClick={() => setCurrentPage('commercial')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'commercial'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="hidden sm:inline">Commercial </span>Travel
            </button>
            <button
              onClick={() => setCurrentPage('charter')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'charter'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="hidden sm:inline">Charter </span>Flights
            </button>
            <button
              onClick={() => setCurrentPage('metrics')}
              className={`
                px-3 py-1.5 md:px-6 md:py-2 rounded-md text-sm md:text-base font-medium transition-all
                ${currentPage === 'metrics'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              Metrics
            </button>
          </div>
        </div>

        {/* Main Content */}
        {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
        {currentPage === 'info' && <ProductionInfoPage />}
        {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
        {currentPage === 'utilities' && <UtilitiesPage />}
        {currentPage === 'fuel' && <FuelPage />}
        {currentPage === 'evcharging' && <EVChargingPage />}
        {currentPage === 'hotels' && <HotelsPage />}
        {currentPage === 'commercial' && <CommercialTravelPage />}
        {currentPage === 'charter' && <CharterFlightsPage />}
        {currentPage === 'metrics' && <PEARMetricsPage />}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>Based on DEFRA 2023 Greenhouse Gas Reporting Conversion Factors</p>
          <p className="mt-2">Version 4.2.9</p>
        </footer>
      </div>

      {/* Onboarding Tour */}
      <OnboardingTour
        forceShow={showTour}
        onComplete={() => {
          setShowTour(false);
          // Optionally navigate to production info page after tour
          if (currentPage === 'landing') {
            setCurrentPage('info');
          }
        }}
        onSkip={() => {
          setShowTour(false);
        }}
      />
    </div>
  );
}

export default App;
