// Pagination.tsx

import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  prefixText?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  prefixText = "",
}) => {
  return (
    <div className="flex items-center mt-2 h-9">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`px-4 py-1 ${index === 0 ? "rounded-l-md" : ""} ${
            index === totalPages - 1 ? "rounded-r-md" : ""
          } ${
            currentPage === index + 1
              ? "bg-[#E5EDFF] text-[#5145CD] border border-indigo-100"
              : "bg-white text-gray-400 border border-gray-200"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {!prefixText ? index + 1 : `${prefixText} ${index + 1}`}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
