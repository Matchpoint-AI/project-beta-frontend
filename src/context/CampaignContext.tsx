import { createContext } from 'react';

export type CampaignInfoType = {
  name?: string;
  audienceEmotion?: string[];
  audienceInterests?: string[];
  audienceGender?: string[];
  audienceRace?: string[];
  audienceAgeRange?: string[];
  product_features?: string[];
  product_description?: string;
  product_link?: string;
  start_date?: string;
  durationNum?: number;
  industry?: string;
  vertical?: string;
  mission?: string;
  values?: string[];
  persona?: string[];
  toneAndVoice?: string[];
  purpose?: string;
  purposeAbout?: string;
  product?: string;
  frequency?: number;
  deliveryDay?: string;
  campaignSummary?: string;
  campaignStrategy?: string;
  campaignDetails?: string;
  campaignSchedule?: string;
  postingFrequency?: number;
  summary?: string;
  currentStep?: number;
  campaign_id?: string;
  campaign_brief?: boolean;
  created_at?: string;
  startDate?: string;
  duration?: string;
  productDescription?: string;
  locations?: string[];
  campaign_data?: {
    campaign_variables: {
      name: string;
      durationNum: number;
      start_date: string;
      product_service?: string;
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
      frequency?: number;
      duration?: string;
    };
  };
};

export const CampaignContext = createContext<{
  campaignInfo: CampaignInfoType;
  setCampaignInfo: (
    info: CampaignInfoType | ((prev: CampaignInfoType) => CampaignInfoType)
  ) => void;
  campaignId: string | null;
  setCampaignId: (id: string | null) => void;
}>({
  campaignInfo: {},
  setCampaignInfo: () => {},
  campaignId: null,
  setCampaignId: () => {},
});

/*import { createContext, useState } from 'react';

export const CampaignContext = createContext({
  campaignInfo: {},
  setCampaignInfo: () => {},
  campaignId: null, // Add campaignId to the context
  setCampaignId: () => {}, // Add setter for campaignId
});

export const CampaignProvider = ({ children }) => {
  const [campaignInfo, setCampaignInfo] = useState({});
  const [campaignId, setCampaignId] = useState(null); // State to hold campaignId

  const value = { campaignInfo, setCampaignInfo, campaignId, setCampaignId };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};*/
