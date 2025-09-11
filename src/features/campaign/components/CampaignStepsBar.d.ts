import { CampaignInfoType } from '../../../context/CampaignContext';
interface CampaignStepsBar {
    currentStep: number;
    campaignInfo: CampaignInfoType;
    timing: string;
    service: string;
}
export default function CampaignStepsBar({ currentStep, campaignInfo, timing, service, }: CampaignStepsBar): import("react/jsx-runtime").JSX.Element;
export {};
