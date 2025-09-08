// ErrorDisplay.tsx
import React from "react";

const ErrorDisplay = ({ error }) => (
  <div className={`w-full text-center  h-fit ${error ? "" : "hidden"}`}>
    <h1 className="text-lg text-red-600 font-bold">{error}</h1>
  </div>
);

export default ErrorDisplay;
