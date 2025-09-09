import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignContext } from '../../context/CampaignContext';
import { useAuth } from '../../features/auth/context/AuthContext';
import handleNavigate from '../../helpers/handleNavigate';

interface Campaign {
  campaign_id: string;
  thread_id?: string;
  status: string;
  timestamp: string;
  campaign_data: {
    campaign_variables: {
      name: string;
      product_service: string;
      start_date: string;
      duration: string;
      audience_ethnicity: string[];
      emotion: string[];
      audience_interests: string[];
      product_service_description: string;
      purpose_topic: string;
      scene: string[];
      currentStep: number;
      key_feature: string[];
      purpose: string;
      audience_gender: string[];
      audience_age: string[];
      postingFrequency: number;
      deliveryDay: string;
      summary: string;
      frequency: number;
      durationNum: number;
    };
  };
}

export default function CampaignReviewButton({ campaign }: { campaign: Campaign }) {
  const { setCampaignInfo } = useContext(CampaignContext);
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleCampaignBrief = () => {
    const data = campaign?.campaign_data?.campaign_variables;
    setCampaignInfo((prev) => ({
      ...prev,
      summary: data?.summary,
      name: data?.name,
      product: data?.product_service,
      audienceRace: data?.audience_ethnicity,
      audienceEmotion: data?.emotion,
      audienceInterests: data?.audience_interests,
      productDescription: data?.product_service_description,
      purpose: data?.purpose_topic,
      locations: data?.scene,
      currentStep: 5,
      product_features: data?.key_feature,
      purposeAbout: data?.purpose,
      audienceGender: data?.audience_gender,
      audienceAgeRange: data?.audience_age,
      startDate: data?.start_date,
      duration: data?.duration,
      durationNum: data?.durationNum,
      frequency: data?.frequency,
      postingFrequency: data?.postingFrequency,
      deliveryDay: data?.deliveryDay,
      campaign_id: campaign?.campaign_id,
      campaign_brief: true,
      created_at: campaign?.timestamp,
    }));
    handleNavigate(profile?.id ?? '', '/campaign', navigate);
  };

  return (
    <button
      onClick={handleCampaignBrief}
      className="text-[#5145CD] border self-end border-[#5145CD] text-sm px-2 py-1 rounded-md mr-2  h-9"
    >
      Campaign Brief
    </button>
  );
}
