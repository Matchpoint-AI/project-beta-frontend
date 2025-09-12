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
export default function CampaignReviewButton({
  campaign,
}: {
  campaign: Campaign;
}): import('react/jsx-runtime').JSX.Element;
export {};
