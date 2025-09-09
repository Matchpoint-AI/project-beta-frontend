import React from 'react';
import ContentLibrary from './ContentLibrary';
import ExportComponent from './ExportComponent';
import CalendarCampaign from './CalendarCampaign';
import SceneMixPlanner from './SceneMixPlanner';

export interface Campaign {
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
    biz_variables: {
      brand_name: string;
      [key: string]: unknown;
    };
  };
}

interface TabWrapperProps {
  currentTab: string;
  campaign: Campaign;
  setStats: React.Dispatch<
    React.SetStateAction<{
      [key: string]: unknown;
      approved: number;
      ready_for_review: number;
    }>
  >;
}

const TabWrapper: React.FC<TabWrapperProps> = ({ currentTab, campaign, setStats }) => {
  if (currentTab === '1') {
    return <ContentLibrary campaign={campaign} setStats={setStats} />;
  } else if (currentTab === '2') {
    return <CalendarCampaign campaign={campaign} />;
  } else if (currentTab === '3') {
    return <ExportComponent campaign={campaign} />;
  } else if (currentTab === '4') {
    // Scene Mix Planner tab
    return (
      <SceneMixPlanner
        campaignId={campaign.campaign_id}
        campaignName={campaign.campaign_data.campaign_variables.name}
        weeks={campaign.campaign_data.campaign_variables.durationNum}
        postsPerWeek={campaign.campaign_data.campaign_variables.frequency * 7}
      />
    );
  } else {
    return (
      <div>
        <h1>Invalid Tab</h1>
      </div>
    );
  }
};

export default TabWrapper;
