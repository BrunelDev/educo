import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface StepProgressProps {
  steps: Step[];
}

export function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="w-full mb-8 sm:mb-12 md:mb-[65px]">
      {/* Desktop and tablet view - shows all steps in a horizontal line */}
      <div className="hidden sm:flex relative justify-between">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        
        {steps.map((step, index) => (
          <div key={step.number + index} className="relative flex flex-col items-center">
            {/* Circle indicator */}
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center z-10 
                ${
                  step.isCompleted
                    ? 'bg-gradient-to-r from-[#FE6539] to-crimson-400'
                    : step.isActive
                    ? 'bg-rose-400'
                    : 'bg-gray-200'
                } 
                ${step.isActive || step.isCompleted ? 'text-white' : 'text-gray-500'}
                transition-colors duration-200`}
            >
              {step.isCompleted ? (
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-xs sm:text-sm">{step.number}</span>
              )}
            </div>

            {/* Step text */}
            <div className="absolute mt-10 sm:mt-11 md:mt-12 text-center w-20 sm:w-28 md:w-32">
              <p className="text-xs sm:text-sm text-gray-600">
                Étape {step.number}
              </p>
              <p
                className="text-xs sm:text-sm font-medium truncate"
                title={step.title} // Shows full title on hover
              >
                {step.title}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile view - compact version showing only active step */}
      <div className="sm:hidden flex flex-col items-center space-y-2">
        <div className="flex justify-center items-center w-full space-x-2">
          {steps.map((step, index) => (
            <div 
              key={step.number + index}
              className={`w-2 h-2 rounded-full ${
                step.isCompleted
                  ? 'bg-gradient-to-r from-[#FE6539] to-crimson-400'
                  : step.isActive
                  ? 'bg-rose-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {steps.filter(step => step.isActive).map((step, index) => (
          <div key={index} className="text-center">
            <p className="text-sm font-medium">{step.title}</p>
            <p className="text-xs text-gray-500">Étape {step.number} sur {steps.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}