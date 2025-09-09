// ErrorDisplay.tsx
import React from "react";

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className={`w-full text-center  h-fit ${error ? "" : "hidden"}`}>
    <h1 className="text-lg text-red-600 font-bold">{error}</h1>
  </div>
);

export default ErrorDisplay;
