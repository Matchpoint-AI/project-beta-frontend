import React, { useState } from 'react';

import { CampaignData } from '../hooks/useFetchUserData';
import { CircularProgress } from '@mui/material';

function SecondaryButton({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[#5145CD] border border-[#5145CD] text-sm rounded-md w-32 h-9 sm:ml-0 flex items-center justify-center capitalize"
    >
      {loading ? <CircularProgress sx={{ color: '#5145CD' }} size={20} thickness={4} /> : label}
    </button>
  );
}

export default function UserCampaignsData({
  campaign,
  viewContent,
  viewThread,
}: {
  campaign: CampaignData;
  viewContent: (id: string) => Promise<void>;
  viewThread: (thread_id: string) => Promise<void>;
}) {
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const statusColors = {
    Active: 'text-[#0E9F6E]',
    Current: 'text-[#0E9F6E]',
    Past: 'text-[#D61F69]',
    Inactive: 'text-[#111928]',
    Draft: 'text-orange-700',
  };

  const handleViewContent = async (id: string) => {
    setLoadingContent(true);
    await viewContent(id);
    setLoadingContent(false);
  };

  const handlePromptThread = async (thread_id: string) => {
    setLoadingPrompts(true);
    await viewThread(thread_id);
    setLoadingPrompts(false);
  };

  return (
    <div className="p-5 bg-white rounded-md mb-5 flex sm:flex-row flex-col sm:items-center items-start justify-between gap-5">
      <div className="flex-grow w-full">
        <p className={`${statusColors[campaign.status]} font-medium`}>{campaign.status}</p>
        <div className="flex sm:flex-row flex-col sm:items-center justify-between sm:gap-0 gap-3">
          <h2 className="text-lg text-[#111928] capitalize font-semibold mr-5">{campaign.name}</h2>
          <div className="flex sm:flex-row flex-col sm:items-center sm:gap-12 gap-3 flex-wrap mt-1 flex-grow max-w-[70%]">
            <div>
              <p className="text-[#6B7280] text-sm capitalize">duration: </p>
              <p className="font-medium text-[#111928] capitalize">
                {campaign.duration > 0
                  ? `${campaign.duration} ${campaign.duration > 1 ? 'weeks' : 'week'}`
                  : 'not selected'}
              </p>
            </div>
            <div>
              <p className="text-[#6B7280] text-sm capitalize">post/day: </p>
              <p className="font-medium text-[#111928] capitalize">
                {campaign.frequency > 0 ? campaign.frequency : 'not selected'}
              </p>
            </div>
            <div>
              <p className="text-[#6B7280] text-sm capitalize">created at: </p>
              <p className="font-medium text-[#111928]">{campaign.created_at}</p>
            </div>
          </div>
        </div>
      </div>
      {campaign.thread_id && (
        <SecondaryButton
          label="prompt thread"
          loading={loadingPrompts}
          onClick={() => handlePromptThread(campaign.thread_id!)}
        />
      )}
      {campaign.status !== 'Draft' && (
        <SecondaryButton
          label="View Content"
          loading={loadingContent}
          onClick={() => handleViewContent(campaign.id)}
        />
      )}
    </div>
  );
}
