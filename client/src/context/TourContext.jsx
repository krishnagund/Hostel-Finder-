import React, { createContext, useContext, useState, useEffect } from 'react';

const TourContext = createContext();

export const useTour = () => {
  const context = useContext(TourContext);
  console.log('useTour: Context value:', context);
  if (!context) {
    console.error('useTour: Context not available, component not wrapped in TourProvider');
    return null;
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourSteps, setTourSteps] = useState([]);
  const [completedTours, setCompletedTours] = useState([]);

  // Load completed tours from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedTours');
    if (saved) {
      try {
        setCompletedTours(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const markTourCompleted = (tourName) => {
    const updated = [...completedTours, tourName];
    setCompletedTours(updated);
    try {
      localStorage.setItem('completedTours', JSON.stringify(updated));
    } catch (_) {}
  };

  const startTour = (steps, tourName, forceStart = false) => {
    console.log('TourContext: startTour called with:', { steps, tourName, completedTours, forceStart });
    if (!Array.isArray(steps) || steps.length === 0) return false;
    // prevent restart if completed unless forced
    if (!forceStart && completedTours.includes(tourName)) {
      console.log('TourContext: Tour already completed, not starting. Use forceStart=true to restart.');
      return false;
    }
    setTourSteps(steps);
    setCurrentStep(0);
    setIsTourActive(true);
    return true;
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = (tourName) => {
    setIsTourActive(false);
    setCurrentStep(0);
    setTourSteps([]);
    if (tourName) {
      markTourCompleted(tourName);
    }
  };

  const skipTour = (tourName) => {
    endTour(tourName);
  };

  const isTourCompleted = (tourName) => completedTours.includes(tourName);

  const resetTour = (tourName) => {
    const updated = completedTours.filter((t) => t !== tourName);
    setCompletedTours(updated);
    try {
      localStorage.setItem('completedTours', JSON.stringify(updated));
    } catch (_) {}
  };

  const clearAllTours = () => {
    setCompletedTours([]);
    try {
      localStorage.removeItem('completedTours');
    } catch (_) {}
    console.log('TourContext: All tours cleared');
  };

  const value = {
    isTourActive,
    currentStep,
    tourSteps,
    completedTours,
    startTour,
    nextStep,
    prevStep,
    endTour,
    skipTour,
    isTourCompleted,
    resetTour,
    markTourCompleted,
    clearAllTours,
  };

  console.log('TourContext: Current state:', { isTourActive, currentStep, tourStepsLength: tourSteps.length });

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

export default TourContext;


