/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface BackButtonProps {
  onClick: (e?: any) => void;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, text = 'Back' }) => {
  return (
    <button
      type="button"
      className="h-12 px-5 py-3 flex items-center text-[#1F2A37] border border-[#1F2A37] hover:text-[#111928] hover:border-[#111928] font-normal rounded-lg text-sm text-center me-2 mb-2"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M6.04198 7.99958L11.6829 2.47985C12.0859 2.08491 12.1079 1.42179 11.7309 0.998568C11.3549 0.575343 10.7199 0.553344 10.3179 0.948284L4.61699 6.52773C4.219 6.91743 4 7.43913 4 7.99958C4 8.56004 4.219 9.08174 4.61599 9.47144L10.3169 15.0509C10.5099 15.2394 10.7549 15.3327 10.9999 15.3327C11.2679 15.3327 11.5339 15.2216 11.7299 15.0006C12.1069 14.5774 12.0849 13.9153 11.6819 13.5193L6.04198 7.99958Z"
          fill="#1F2A37"
        />
      </svg>
      {text}
    </button>
  );
};

export default BackButton;
