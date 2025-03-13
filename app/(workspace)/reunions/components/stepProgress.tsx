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
    <div className="w-full mb-[65px]">
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        
        {steps.map((step, index) => (
          <div key={step.number + index} className="relative flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                ${
                  step.isCompleted
                    ? 'bg-rose-500'
                    : step.isActive
                    ? 'bg-rose-400'
                    : 'bg-gray-200'
                } 
                ${step.isActive || step.isCompleted ? 'text-white' : 'text-gray-500'}`}
            >
              {step.isCompleted ? (
                <svg
                  className="w-4 h-4"
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
                step.number
              )}
            </div>

            <div className="absolute mt-12 text-center w-32">
              <p
              >
                Étape {step.number}
              </p>
              <p
                className="text-nowrap"
              >
                {step.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}