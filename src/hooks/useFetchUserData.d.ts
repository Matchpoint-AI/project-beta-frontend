export type BrandData = {
    name: string;
    website: string;
    logo: string;
    industry: string;
    vertical: string;
};
export type CampaignData = {
    id: string;
    duration: number;
    frequency: number;
    name: string;
    thread_id: string | null;
    status: 'Current' | 'Past' | 'Inactive' | 'Draft';
    created_at: string;
};
export type UserData = {
    id: string;
    name: string;
    email: string;
    plan: string;
    created_at: string;
    brand: BrandData;
    campaigns: CampaignData[];
};
export default function useFetchUserData(): readonly [UserData | null, any, () => void];
