import React from 'react';
import { useTour } from '../context/TourContext';
import { getTourConfig } from '../config/tourConfig';

const TourTrigger = ({ 
  tourName, 
  children, 
  className = '', 
  variant = 'button',
  showIcon = true 
}) => {
  const tourContext = useTour();
  if (!tourContext) return null;

  const { startTour, isTourCompleted } = tourContext;

  const handleStartTour = () => {
    const tourConfig = getTourConfig(tourName);
    if (tourConfig) {
      // Force start allows restart even if completed
      startTour(tourConfig.steps, tourName, true);
    }
  };

  const isCompleted = isTourCompleted(tourName);

  if (variant === 'button') {
    return (
      <button
        onClick={handleStartTour}
        className={`flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ${className}`}
        title={isCompleted ? `Restart ${tourName} tour` : `Start ${tourName} tour`}
      >
        {showIcon && <span>🎯</span>}
        <span>{isCompleted ? 'Restart Tour' : 'Take Tour'}</span>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleStartTour}
        className={`p-3 sm:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors ${className}`}
        title={isCompleted ? `Restart ${tourName} tour` : `Start ${tourName} tour`}
      >
        <span className="text-xl sm:text-lg">🎯</span>
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleStartTour}
        className={`text-blue-600 hover:text-blue-800 underline text-sm ${className}`}
      >
        {children || 'Take a tour'}
      </button>
    );
  }

  return (
    <div onClick={handleStartTour} className={className}>
      {children}
    </div>
  );
};

export default TourTrigger;


