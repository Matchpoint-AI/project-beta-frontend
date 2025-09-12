import React from 'react';
interface CampaignHeaderProps {
    title: string;
    service: string;
    timeFrame: string;
    currentTab: number;
    postingSchdule: string;
    handleNavigate: () => void;
}
declare const CampaignHeader: React.FC<CampaignHeaderProps>;
export default CampaignHeader;
