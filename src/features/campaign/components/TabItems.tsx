// TabItems.tsx

import React from 'react';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { MdCalendarToday } from 'react-icons/md';
import { PiExportBold } from 'react-icons/pi';
import { MdAutoAwesome } from 'react-icons/md';

interface TabItemsProps {
  currentPage?: number;
  onPageChange?: (page: number) => void;
  setApprovePopup: React.Dispatch<React.SetStateAction<boolean>>;
  onApprove?: () => void;
}

const TabItems: React.FC<TabItemsProps> = ({
  currentPage = 1,
  onPageChange,
  setApprovePopup,
  onApprove,
}) => {
  const { id } = useParams();
  const { profile } = useAuth();

  const handleExportChange = async () => {
    const endpointUrl = getServiceURL('data');
    try {
      const params = new URLSearchParams({
        campaign_id: id as string,
      });

      const response = await fetch(`${endpointUrl}/api/v1/check-approved?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      const { approved } = data;
      setApprovePopup(approved);
      if (approved) {
        onApprove?.();
      }
      if (onPageChange && approved === false) onPageChange(3);
    } catch (_error) {
      // Error handled silently
    }
  };

  return (
    <div className="flex flex-row gap-4">
      {/* Content Library button */}
      <button
        onClick={() => onPageChange && onPageChange(1)}
        className={`flex p-3 gap-2 items-center rounded-md ${
          currentPage === 1
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        }`}
      >
        {/* <HiCollection /> */}
        {currentPage === 1 ? (
          <img src="/collection-active.svg" alt="Active Collection" />
        ) : (
          <img src="/collection-disabled.svg" alt="Disabled Collection" className="w-6 h-6" />
        )}
        <span className="font-normal text-base leading-5">Library View</span>
      </button>

      {/* Calendar button */}
      <button
        onClick={() => onPageChange && onPageChange(2)}
        className={`flex gap-2 items-center p-3 rounded-md ${
          currentPage === 2
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        }`}
      >
        <MdCalendarToday size={24} />
        <span className="font-normal text-base leading-5">Calendar View</span>
      </button>

      {/* Export button */}
      <button
        onClick={handleExportChange}
        className={`flex p-3 gap-2 items-center rounded-md ${
          currentPage === 3
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        }`}
      >
        <PiExportBold size={24} />
        <span className="font-normal text-base leading-5">Export View</span>
      </button>

      {/* Scene Mix Planner button */}
      <button
        onClick={() => onPageChange && onPageChange(4)}
        className={`flex p-3 gap-2 items-center rounded-md ${
          currentPage === 4
            ? 'text-white bg-[#5145CD]'
            : 'text-[#5145CD] bg-white border-[1px] border-[#E5E7EB]'
        }`}
      >
        <MdAutoAwesome size={24} />
        <span className="font-normal text-base leading-5">AI Planner</span>
      </button>
    </div>
  );
};

export default TabItems;
