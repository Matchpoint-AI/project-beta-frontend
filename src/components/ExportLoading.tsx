import React from "react";
import { CircularProgress } from "@mui/material";

interface LoadingStep {
  label: string;
  loading: boolean;
  complete: boolean;
}

interface LoadingModalProps {
  steps: LoadingStep[];
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ steps, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-5 lg:p-0">
      <div className="bg-white p-8 rounded shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Exporting Content</h2>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center mb-4">
            {step.loading ? (
              <CircularProgress size={20} />
            ) : step.complete ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.292-4.293a1 1 0 011.414 0l5-5a1 1 0 10-1.414-1.414l-4.293 4.293-1.293-1.293a1 1 0 00-1.414 1.414l2 2z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <CircularProgress size={20} />
            )}
            <span className="ml-4">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingModal;
