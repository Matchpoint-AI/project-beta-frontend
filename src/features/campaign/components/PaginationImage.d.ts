import React from 'react';
interface PaginationImageProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    approved: boolean;
    images: string[];
}
declare const PaginationImage: React.FC<PaginationImageProps>;
export default PaginationImage;
