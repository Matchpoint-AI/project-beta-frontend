import React from 'react';
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  prefixText?: string;
}
declare const Pagination: React.FC<PaginationProps>;
export default Pagination;
