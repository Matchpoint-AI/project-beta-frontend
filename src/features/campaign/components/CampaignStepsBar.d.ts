import { CampaignInfoType } from '../../../features/campaign/context/CampaignContext';
interface CampaignStepsBar {
    currentStep: number;
    campaignInfo: CampaignInfoType;
    timing: string;
    service: string;
}
export default function CampaignStepsBar({ currentStep, campaignInfo, timing, service, }: CampaignStepsBar): any;
export {};
