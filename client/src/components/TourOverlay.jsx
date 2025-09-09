import React, { useEffect, useRef } from 'react';
import { useTour } from '../context/TourContext';

const TourOverlay = () => {
  const tourContext = useTour();
  if (!tourContext) return null;

  const { 
    isTourActive, 
    currentStep, 
    tourSteps, 
    nextStep, 
    prevStep, 
    skipTour 
  } = tourContext;

  const overlayRef = useRef(null);

  useEffect(() => {
    if (isTourActive && tourSteps.length > 0) {
      const stepData = tourSteps[currentStep];
      const el = document.querySelector(stepData.target);
      if (el) {
        // Ensure element is in view and highlighted
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        el.classList.add('tour-highlight');
        const remove = () => el.classList.remove('tour-highlight');
        const t = setTimeout(remove, 400);
        return () => clearTimeout(t);
      }
    }
  }, [isTourActive, currentStep, tourSteps]);

  if (!isTourActive || !tourSteps.length || !tourSteps[currentStep]) return null;

  const currentStepData = tourSteps[currentStep];
  const targetElement = document.querySelector(currentStepData.target);
  const hasTarget = !!targetElement;
  const rect = hasTarget
    ? targetElement.getBoundingClientRect()
    : { top: window.innerHeight * 0.2, left: (window.innerWidth / 2) - 1, right: (window.innerWidth / 2) + 1, bottom: window.innerHeight * 0.2 + 2, width: 2, height: 2 };

  const isMobileScreen = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const getTooltipPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 768;
    const tooltipWidth = isMobile ? Math.min(viewportWidth - 24, 320) : Math.min(360, viewportWidth - 32);
    const tooltipHeight = isMobile ? 180 : 200;
    let top = rect.bottom + 10;
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    if (left < 12) left = 12;
    if (left + tooltipWidth > viewportWidth - 12) left = Math.max(12, (viewportWidth - tooltipWidth) / 2);
    if (top + tooltipHeight > viewportHeight - 10) top = rect.top - tooltipHeight - 10;
    if (top < 10) top = 10;
    return { top, left, width: tooltipWidth };
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      {/* Overlay: black-out for both desktop and mobile */}
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-black bg-opacity-80 z-40 pointer-events-auto"
      />

      {/* Tooltip */}
      <div
        className="fixed bg-white rounded-lg shadow-xl p-3 sm:p-4 z-50"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          width: `${tooltipPosition.width}px`,
          maxWidth: '95vw'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-[#3A2C99] text-white text-xs px-2 py-1 rounded-full">
              {currentStep + 1} of {tourSteps.length}
            </span>
            {currentStepData.icon && (
              <span className="text-lg">{currentStepData.icon}</span>
            )}
          </div>
          <button
            onClick={() => skipTour(currentStepData.tourName)}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="mb-3 sm:mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
            {currentStepData.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex space-x-2 order-2 sm:order-1">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 flex-1 sm:flex-none"
              >
                ← Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-2 order-1 sm:order-2">
            <button
              onClick={() => skipTour(currentStepData.tourName)}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800 flex-1 sm:flex-none text-center"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="px-3 sm:px-4 py-1 text-xs sm:text-sm bg-[#3A2C99] text-white rounded hover:bg-[#2a1f6b] flex-1 sm:flex-none text-center"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>

        <div className="flex justify-center space-x-1 mt-3">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep 
                  ? 'bg-[#3A2C99]' 
                  : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 4px rgba(58, 44, 153, 0.3);
          border-radius: 4px;
          transition: box-shadow 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default TourOverlay;


