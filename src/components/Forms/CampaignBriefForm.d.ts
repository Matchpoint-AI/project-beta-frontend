import React from 'react';
type CampaignBriefFormProps = {
  onClose?: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleBack: () => void;
  handleApprove: () => void;
  setTiming: React.Dispatch<React.SetStateAction<string>>;
  setService: React.Dispatch<React.SetStateAction<string>>;
};
declare const CampaignBriefForm: React.FC<CampaignBriefFormProps>;
export default CampaignBriefForm;
