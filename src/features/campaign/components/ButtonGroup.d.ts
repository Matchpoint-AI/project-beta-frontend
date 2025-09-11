import React from 'react';
import { CampaignInfoType } from '../../../context/CampaignContext';
interface Stats {
    approved: number;
    ready_for_review: number;
    total_posts: number;
}
interface ButtonGroupProps {
    campaign: CampaignInfoType;
    currentTab: number;
    setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
    setApprovePopup: React.Dispatch<React.SetStateAction<boolean>>;
    stats: Stats;
    onApprove?: () => void;
}
declare const ButtonGroup: React.FC<ButtonGroupProps>;
export default ButtonGroup;
