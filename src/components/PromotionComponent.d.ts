import React from 'react';
interface Campaign {
  campaign_id: string;
  thread_id?: string;
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
    };
  };
}
interface PromotionComponentProps {
  campaign: Campaign;
  status: string;
}
declare const PromotionComponent: React.FC<PromotionComponentProps>;
export default PromotionComponent;
