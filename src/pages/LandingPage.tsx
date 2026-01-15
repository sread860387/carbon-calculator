/**
 * Landing Page
 * Introduction and guide for the Environmental Accounting Report Calculator
 * Based on "Full PEAR Intro" from PEAR 4.2.9
 */

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type Page = 'landing' | 'info' | 'dashboard' | 'utilities' | 'fuel' | 'evcharging' | 'hotels' | 'commercial' | 'charter' | 'metrics';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const modules = [
    {
      name: 'Production Information',
      page: 'info' as Page,
      icon: '📋',
      color: 'from-slate-500 to-gray-600',
      description: 'Calculator contact information & general production information including production name, headquarters location & schedule. Production location information used for utility tracking.',
      dataSources: 'Production office records, production manager'
    },
    {
      name: 'Utilities',
      page: 'utilities' as Page,
      icon: '⚡',
      color: 'from-orange-500 to-orange-600',
      description: 'Total electricity, natural gas and/or heating oil used for all locations entered in Production Info',
      dataSources: 'Utility bills, lease information, procurement records'
    },
    {
      name: 'Fuel',
      page: 'fuel' as Page,
      icon: '⛽',
      color: 'from-purple-500 to-purple-600',
      description: 'Fuel used for equipment (e.g., generators) and vehicles',
      dataSources: 'Fuel receipts, transportation department logs'
    },
    {
      name: 'Electric Vehicle Charging',
      page: 'evcharging' as Page,
      icon: '🔌',
      color: 'from-cyan-500 to-cyan-600',
      description: 'Electricity used by electric vehicles at off-location charging stations',
      dataSources: 'Charging station receipts, vehicle fleet reports'
    },
    {
      name: 'Hotels & Housing',
      page: 'hotels' as Page,
      icon: '🏨',
      color: 'from-pink-500 to-pink-600',
      description: 'Number of days and location of hotels, houses and condos rented during the production',
      dataSources: 'Hotel invoices, housing coordinator records'
    },
    {
      name: 'Commercial Travel',
      page: 'commercial' as Page,
      icon: '✈️',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Passenger miles and routes (if applicable) traveled on commercial airlines, ferries and trains',
      dataSources: 'Travel booking confirmations, expense reports'
    },
    {
      name: 'Charter Flights',
      page: 'charter' as Page,
      icon: '🚁',
      color: 'from-sky-500 to-sky-600',
      description: 'Fuel, hours or distance traveled on charter jets and helicopters',
      dataSources: 'Charter company invoices, flight logs'
    },
    {
      name: 'PEAR Metrics',
      page: 'metrics' as Page,
      icon: '📊',
      color: 'from-emerald-500 to-teal-600',
      description: 'Environmental activities including waste (landfill, compost, recycling), drinking water, donations, recycled paper, biodiesel, and fuel savings',
      dataSources: 'Waste hauler reports, catering records, donation receipts'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border-0">
        <CardContent className="p-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">
              Production Environmental Accounting Report
            </h1>
            <p className="text-xl opacity-95 mb-6 leading-relaxed">
              This calculator measures the carbon emissions generated and resources used and saved by your production
              based on information you enter on emission sources such as utility electricity and heating, fuel, flight
              and hotel use.
            </p>
            <p className="text-lg opacity-90 mb-8">
              Information for each emission source is collected on a separate worksheet tab. Information is not
              required for every tab, and should only be entered for the emission sources associated with your production.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => onNavigate('info')}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Get Started
              </Button>
              <Button
                onClick={() => onNavigate('dashboard')}
                variant="ghost"
                className="bg-white/20 text-white hover:bg-white/30 px-8 py-3 text-lg font-semibold"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enter Production Info</h3>
              <p className="text-gray-600 text-sm">
                Start by entering basic production details, locations, and schedule information
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Emissions</h3>
              <p className="text-gray-600 text-sm">
                Add data for relevant emission sources: utilities, fuel, travel, hotels, and more
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">View Results</h3>
              <p className="text-gray-600 text-sm">
                Review your carbon footprint on the dashboard and track sustainability metrics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Modules */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculator Modules</h2>
        <p className="text-gray-600 mb-6">
          Click on any module below to start entering data. Each module tracks a different emission source
          or environmental activity.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <Card
              key={module.name}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-102 group"
              onClick={() => onNavigate(module.page)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${module.color} text-white rounded-lg p-3 flex-shrink-0`}>
                    <span className="text-3xl">{module.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">{module.name}</h3>
                      <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {module.description}
                    </p>
                    <div className="bg-gray-50 rounded px-3 py-2">
                      <p className="text-xs text-gray-600">
                        <strong className="text-gray-700">Data Sources:</strong> {module.dataSources}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips & Best Practices */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💡</span>
            Tips & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Data Collection</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Enter data regularly throughout production for best accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Only track emission sources relevant to your production</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Work with your facilities, transportation, and catering teams</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Keep receipts and invoices organized for reference</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Using the Calculator</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">→</span>
                  <span>Start with Production Information to set up your project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">→</span>
                  <span>Use the Dashboard to view your overall carbon footprint</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">→</span>
                  <span>Add comments to entries to note data sources and details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">→</span>
                  <span>Track PEAR Metrics to showcase sustainability efforts</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Based on DEFRA 2023 Greenhouse Gas Reporting Conversion Factors</p>
        <p className="mt-1">Production Environmental Accounting Report • Version 4.2.9 • Updated Sept 2025</p>
      </div>
    </div>
  );
}
