import React from 'react';
interface TabItemsProps {
  currentPage?: number;
  onPageChange?: (page: number) => void;
  setApprovePopup: React.Dispatch<React.SetStateAction<boolean>>;
  onApprove?: () => void;
}
declare const TabItems: React.FC<TabItemsProps>;
export default TabItems;
