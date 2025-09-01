import React, { useState, useEffect } from "react";

const AnalysisProgress = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (steps && steps.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            setCompletedSteps(prevCompleted => [...prevCompleted, prev]);
            return prev + 1;
          } else {
            setCompletedSteps(prevCompleted => [...prevCompleted, prev]);
            clearInterval(interval);
            if (onComplete) onComplete();
            return prev;
          }
        });
      }, 1500); // Cada paso toma 1.5 segundos

      return () => clearInterval(interval);
    }
  }, [steps, onComplete]);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Proceso de Análisis en Tiempo Real
      </h3>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isPending = index > currentStep;

          return (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-500 ${
                isCompleted
                  ? "bg-green-50 border border-green-200"
                  : isCurrent
                    ? "bg-blue-50 border border-blue-200 animate-pulse"
                    : "bg-gray-50 border border-gray-200 opacity-60"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-600 text-white"
                    : isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-400 text-white"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.step
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{step.title}</div>
                <div className="text-sm text-gray-600">{step.description}</div>
                <div className="text-xs text-blue-600 mt-1">
                  Duración: {step.duration}
                </div>
                {isCurrent && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500"
                      : isCurrent
                        ? "bg-blue-500 animate-ping"
                        : "bg-gray-300"
                  }`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisProgress;
