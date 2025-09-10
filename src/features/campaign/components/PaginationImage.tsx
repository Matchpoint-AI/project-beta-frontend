// PaginationImage.tsx

import React from 'react';

interface PaginationImageProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  approved: boolean;
  images: string[];
}

const PaginationImage: React.FC<PaginationImageProps> = ({
  currentPage,
  approved,
  onPageChange,
  images,
}) => {
  return (
    <div className="flex justify-center items-center h-full mt-0 text-black font-semibold">
      {images.slice(0, 3).map((_, i) => {
        const isCurrent = i + 1 === currentPage;

        return (
          <button
            key={i}
            disabled={approved}
            onClick={() => onPageChange(i + 1)}
            className={`
          px-4 py-1 border
          first:rounded-l-md
          last:rounded-r-md 
          ${approved ? 'hover:cursor-not-allowed' : ''}
        `}
          >
            {isCurrent ? (
              <span className="block rounded-full bg-[#5145CD]/30 px-2 py-0.5">{i + 1} </span>
            ) : (
              <span className="block rounded-full bg-transparent px-2 py-0.5">{i + 1} </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PaginationImage;
