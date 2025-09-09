import React from 'react';
// import TabItems from "./TabItems";
import TabWrapper from './TabWrapper';

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
    biz_variables: {
      brand_name: string;
      [key: string]: unknown;
    };
  };
}
interface TabContentProps {
  currentTab: number;
  campaign: Campaign;
  setStats: React.Dispatch<
    React.SetStateAction<{
      [key: string]: unknown;
      approved: number;
      ready_for_review: number;
    }>
  >;
}

const TabContent: React.FC<TabContentProps> = ({ currentTab, campaign, setStats }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* <TabItems
        currentPage={currentTab}
        onPageChange={setCurrentTab}
        setApprovePopup={setApprovePopup}
      /> */}
      <TabWrapper currentTab={currentTab.toString()} campaign={campaign} setStats={setStats} />
    </div>
  );
};

export default TabContent;
