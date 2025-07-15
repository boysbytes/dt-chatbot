import React from 'react';
import { CheckCircle } from 'lucide-react';

const Timeline = ({ steps, currentStep, navigateToStep }) => {
  return (
    <div className="w-64 bg-gray-50 p-6 border-r border-gray-200 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Design Thinking Process</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${
              index === currentStep
                ? 'bg-blue-100 border-l-4 border-blue-500'
                : index < currentStep
                ? 'bg-green-50 border-l-4 border-green-500'
                : 'bg-white border-l-4 border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => navigateToStep(index)}
          >
            <div className="flex-shrink-0 mr-3">
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                  index === currentStep
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {index + 1}
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-800">{step.name}</div>
              <div className="text-sm text-gray-600">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
