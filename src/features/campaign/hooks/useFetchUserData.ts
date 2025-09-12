// Stub implementation for useFetchUserData hook

export interface CampaignData {
  campaign_id: string;
  status: string;
  name: string;
  duration: number;
  thread_id?: string;
  [key: string]: any;
}

export const useFetchUserData = () => {
  // TODO: Implement actual data fetching logic
  return {
    data: [] as CampaignData[],
    loading: false,
    error: null,
  };
};

export default useFetchUserData;