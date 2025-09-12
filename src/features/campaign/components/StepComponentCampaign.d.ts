import React from 'react';
interface StepCampaignProps {
  title?: string;
  name: string;
  description?: string;
  isActive: boolean;
  currentStep: number;
  globalStep: number;
}
declare const StepCampaignComponent: React.FC<StepCampaignProps>;
export default StepCampaignComponent;
