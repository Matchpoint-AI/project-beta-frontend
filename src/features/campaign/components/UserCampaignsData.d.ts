import { CampaignData } from '../../users/hooks/useFetchUserData';
export default function UserCampaignsData({ campaign, viewContent, viewThread, }: {
    campaign: CampaignData;
    viewContent: (id: string) => Promise<void>;
    viewThread: (thread_id: string) => Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
