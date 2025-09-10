import React from 'react';
interface PaginationImageProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  approved: boolean;
  images: any[];
}
declare const PaginationImage: React.FC<PaginationImageProps>;
export default PaginationImage;
