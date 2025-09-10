import React from 'react';
import { ButtonBase } from '@mui/material';
import { FaRegEdit } from 'react-icons/fa';

interface CampaignBriefBlockProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onClick?: () => void;
  edit?: boolean;
}

export default function DetailsBlock({
  title,
  description,
  children,
  onClick: _onClick,
  edit = true,
}: CampaignBriefBlockProps) {
  return (
    <div className="p-5 mb-[14px] rounded-md w-full bg-[#F6F5FF] border border-[#D1D5DB]">
      <div className="flex items-center justify-between">
        <h1 className="capitalize text-[#42389D] font-medium text-lg leading-7 mb-1">{title}</h1>
        {edit ? (
          <ButtonBase onClick={_onClick}>
            <FaRegEdit color="#3F83F8" size={16} />
          </ButtonBase>
        ) : null}
      </div>
      <p className="text-[#111928] font-medium text-xs mb-5">{description}</p>
      {children}
    </div>
  );
}
