/**
 * Onboarding Tour Component
 * Interactive tour for first-time users
 */

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { tourSteps, completeTour, skipTour, shouldShowTour } from '../../utils/onboarding';
import type { TourStep } from '../../utils/onboarding';

interface OnboardingTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
  forceShow?: boolean;
}

export function OnboardingTour({ onComplete, onSkip, forceShow }: OnboardingTourProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if tour should be shown
    if (forceShow || shouldShowTour()) {
      // Small delay before showing tour
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  if (!isVisible) {
    return null;
  }

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    skipTour();
    setIsVisible(false);
    onSkip?.();
  };

  const handleComplete = () => {
    completeTour();
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm" />

      {/* Tour Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full pointer-events-auto overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold">
                  {currentStep + 1}
                </div>
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Skip tour
              </button>
            </div>

            {/* Icon */}
            {currentStep === 0 && (
              <div className="text-center mb-6">
                <span className="text-6xl">🌱</span>
              </div>
            )}
            {currentStep === 1 && (
              <div className="text-center mb-6">
                <span className="text-6xl">📋</span>
              </div>
            )}
            {currentStep === 2 && (
              <div className="text-center mb-6">
                <span className="text-6xl">📊</span>
              </div>
            )}
            {currentStep === 3 && (
              <div className="text-center mb-6">
                <span className="text-6xl">✨</span>
              </div>
            )}
            {currentStep === 4 && (
              <div className="text-center mb-6">
                <span className="text-6xl">📈</span>
              </div>
            )}
            {currentStep === 5 && (
              <div className="text-center mb-6">
                <span className="text-6xl">📄</span>
              </div>
            )}
            {currentStep === 6 && (
              <div className="text-center mb-6">
                <span className="text-6xl">🚀</span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 text-center leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Key Features (for specific steps) */}
            {currentStep === 2 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: '⚡', label: 'Utilities' },
                  { icon: '⛽', label: 'Fuel' },
                  { icon: '🔌', label: 'EV Charging' },
                  { icon: '🏨', label: 'Hotels' },
                  { icon: '✈️', label: 'Travel' },
                  { icon: '🛩️', label: 'Charter' }
                ].map((module) => (
                  <div
                    key={module.label}
                    className="bg-gray-50 rounded-lg p-3 text-center"
                  >
                    <div className="text-2xl mb-1">{module.icon}</div>
                    <div className="text-xs font-medium text-gray-700">
                      {module.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Smart Features Highlights */}
            {currentStep === 3 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Smart defaults remember your preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Save templates for recurring entries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Live calculation previews as you type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Data validation to catch errors early</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-green-500 w-6'
                      : index < currentStep
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={isFirstStep}
              >
                Back
              </Button>

              <div className="flex gap-3">
                {!isLastStep && (
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip
                  </Button>
                )}
                <Button variant="primary" onClick={handleNext}>
                  {isLastStep ? 'Get Started!' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
