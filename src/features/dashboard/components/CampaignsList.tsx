import React, { useContext, useEffect, useState } from 'react';
import EmptyDashboard from './EmptyDashboard';
import Dropdown from '../../../shared/components/ui/Dropdown';
import PromotionComponent from './PromotionComponent';
import { useNavigate } from 'react-router-dom';
import { CampaignContext } from '../../../features/campaign/context/CampaignContext';
import { BrandContext } from '../../brand/context/BrandContext';
import handleNavigate from '../../../shared/utils/handleNavigate';
import { useAuth } from '../../auth/context/AuthContext';

interface Campaign {
  campaign_id: string;
  thread_id?: string;
  status: string;
  timestamp?: string;
  campaign_data: {
    campaign_variables: {
      name?: string;
      product_service?: string;
      start_date?: string;
      duration?: string;
      audience_ethnicity?: string[];
      emotion?: string[];
      audience_interests?: string[];
      product_service_description?: string;
      purpose_topic?: string;
      scene?: string[];
      currentStep?: number;
      key_feature?: string[];
      purpose?: string;
      audience_gender?: string[];
      audience_age?: string[];
      postingFrequency?: number;
      deliveryDay?: string;
      summary?: string;
      durationNum?: number;
    };
  };
}

interface CampaignsListProps {
  campaigns: Campaign[];
  campaignType: string;
  setCampaignType: React.Dispatch<React.SetStateAction<string>>;
}

export default function CampaignsList({
  campaigns,
  campaignType,
  setCampaignType,
}: CampaignsListProps) {
  const { setCampaignInfo } = useContext(CampaignContext);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { businessInfo } = useContext(BrandContext);
  const [campaignStatuses, setCampaignStatuses] = useState<Record<string, string>>({});

  const handleNewCampaign = () => {
    setCampaignInfo({});
    handleNavigate(profile?.id ?? '', '/campaign', navigate);
  };

  // Precompute all campaign statuses
  useEffect(() => {
    const computeStatuses = () => {
      const statuses: Record<string, string> = {};

      // Filter out duplicate campaigns, keeping only the most recent one
      const uniqueCampaigns = campaigns.reduce((acc, campaign) => {
        const existing = acc.find((c) => c.campaign_id === campaign.campaign_id);
        if (
          !existing ||
          new Date(campaign.timestamp || '1970-01-01') >
            new Date(existing.timestamp || '1970-01-01')
        ) {
          // Remove existing if present
          acc = acc.filter((c) => c.campaign_id !== campaign.campaign_id);
          acc.push(campaign);
        }
        return acc;
      }, [] as Campaign[]);

      uniqueCampaigns.forEach((campaign) => {
        const { status, campaign_data } = campaign;

        if (status === 'DRAFT') {
          statuses[campaign.campaign_id] = 'Draft';
        } else {
          const { start_date, durationNum } = campaign_data.campaign_variables;
          if (!start_date || durationNum === undefined) {
            statuses[campaign.campaign_id] = 'Draft';
            return;
          }
          const startDate = new Date(start_date);
          const durationInMilliseconds = durationNum * 7 * 24 * 60 * 60 * 1000; // Convert weeks to milliseconds
          const endDate = new Date(startDate.getTime() + durationInMilliseconds);
          const today = new Date();

          if (today < startDate) {
            // Campaign has not started yet
            statuses[campaign.campaign_id] = 'Upcoming';
          } else if (today >= startDate && today <= endDate) {
            statuses[campaign.campaign_id] = 'Current';
          } else if (today > endDate) {
            statuses[campaign.campaign_id] = 'Past';
          } else {
            statuses[campaign.campaign_id] = 'Draft';
          }
        }
      });

      setCampaignStatuses(statuses);
    };

    computeStatuses();
  }, [campaigns]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const calculatedStatus = campaignStatuses[campaign.campaign_id];

    if (!calculatedStatus) return false;

    if (campaignType === 'All') return true;

    return calculatedStatus === campaignType;
  });

  // Sort by most recent timestamp and remove duplicates
  const sortedCampaigns = [...filteredCampaigns]
    .sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime())
    .reduce((acc, campaign) => {
      if (!acc.find((c) => c.campaign_id === campaign.campaign_id)) {
        acc.push(campaign);
      }
      return acc;
    }, [] as Campaign[]);

  return (
    <>
      {campaigns.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <div className="md:ml-[80px] flex-grow flex flex-col p-8 md:mt-8 mt-[80px] ">
          <div className="flex sm:flex-row flex-col justify-between mb-5">
            <div className="flex-col gap-4">
              <div className="flex gap-4">
                <h1 className="text-[#5145CD] text-2xl font-semibold">
                  {businessInfo.name} Campaigns
                </h1>
                <Dropdown
                  currentValue={campaignType}
                  // type="options"
                  options={['All', 'Current', 'Upcoming', 'Draft', 'Past']}
                  onUpdateContext={(value) => setCampaignType(value)}
                  className="w-fit"
                  dynamic={true}
                />
              </div>
              <p className="my-2 text-base text-black">
                Check out the campaigns you&apos;ve created with Matchpoint below. Click any one of
                them to see your content.
              </p>
            </div>
            <button
              className="bg-[#5145CD] h-[50px] text-white px-4 py-2 whitespace-nowrap rounded-md text-sm flex items-center gap-2 w-fit sm:mt-0 mt-5"
              onClick={handleNewCampaign}
            >
              New Campaign
              <img src="/src/assets/icons/plus_icon.svg" alt="plus icon" />
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-2">
            {sortedCampaigns.map((campaign) => (
              <PromotionComponent
                key={`${campaign.campaign_id}-${campaign.timestamp || 'no-timestamp'}`}
                campaign={{ ...campaign, timestamp: campaign.timestamp || '' } as any}
                status={campaignStatuses[campaign.campaign_id]}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
