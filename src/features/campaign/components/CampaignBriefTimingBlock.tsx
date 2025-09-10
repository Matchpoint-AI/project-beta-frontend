import React from 'react';

interface CampaignBriefBlockProps {
  title: string;
  children: React.ReactNode;
}

export default function CampaignBriefTimingBlock({ title, children }: CampaignBriefBlockProps) {
  return (
    <div className="px-3 pt-2 pb-[14px] bg-[#F6F5FF] border border-gray-300 w-full rounded-md">
      <h1 className="capitalize text-[#42389D] font-medium text-lg leading-7 mb-1">{title}</h1>
      {children}
    </div>
  );
}
