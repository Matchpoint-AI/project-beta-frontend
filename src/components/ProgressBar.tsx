import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  // Assume there are 4 steps in total
  const totalSteps = 4;
  const corrections = [0, 27, 18, 14, 10];
  const progress = (currentStep / totalSteps) * 100 + corrections[currentStep];

  return (
    <div className="w-2 h-[350px] bg-gray-300 relative rounded-md ">
      <div
        style={{ height: `${progress}%` }}
        className="w-full bg-[#5145CD] rounded-md absolute top-0"
      ></div>
    </div>
  );
};

export default ProgressBar;
