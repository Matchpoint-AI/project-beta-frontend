import React from 'react';

interface ProgressComponentProps {
  progress: number;
}

const ProgressComponent: React.FC<ProgressComponentProps> = ({ progress }) => {
  return (
    <div className="relative pt-1">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
        <div
          style={{ width: `${progress}%` }}
          className="shadow-none flex flex-col text-center whitespace-pre-wrap justify-center bg-gradient-to-r from-[#5145CD] to-[#9B38B7] text-white"
        ></div>
      </div>
    </div>
  );
};

export default ProgressComponent;
