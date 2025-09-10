/**
 * Hook for V2 API usage
 */
export declare function useV2Api(): {
  campaign: {
    /**
     * Get campaign details
     */
    get: (campaignId: string) => Promise<import('../api/v2').GetCampaignResponse>;
    /**
     * Create a new campaign
     */
    create: (data: any) => Promise<import('../api/v2').CreateCampaignResponse>;
    /**
     * Update campaign
     */
    update: (campaignId: string, data: any) => Promise<import('../api/v2').UpdateCampaignResponse>;
    /**
     * Delete campaign
     */
    delete: (campaignId: string) => Promise<{
      success: boolean;
      message: string;
    }>;
    /**
     * Generate content for campaign
     */
    generateContent: (
      campaignId: string,
      options?: any
    ) => Promise<import('../api/v2').GenerateContentResponse>;
    /**
     * Get campaign content
     */
    getContent: (campaignId: string) => Promise<import('../api/v2').GetCampaignContentResponse>;
    /**
     * List campaigns
     */
    list: (filters?: any) => Promise<{
      campaigns: import('../api/v2').GetCampaignResponse['campaign'][];
    }>;
  };
  brand: {
    /**
     * Create brand
     */
    create: (data: any) => Promise<import('../api/v2').Brand>;
    /**
     * Get brand details
     */
    get: (brandId: string) => Promise<import('../api/v2').Brand>;
    /**
     * Update brand
     */
    update: (brandId: string, data: any) => Promise<import('../api/v2').Brand>;
    /**
     * Delete brand
     */
    delete: (brandId: string) => Promise<{
      success: boolean;
      message: string;
    }>;
    /**
     * List brands
     */
    list: (filters?: any) => Promise<{
      brands: import('../api/v2').Brand[];
    }>;
    /**
     * Crawl website
     */
    crawlWebsite: (data: any) => Promise<import('../api/v2').CrawlWebsiteResponse>;
    /**
     * Get brand knowledge
     */
    getKnowledge: (brandId: string) => Promise<import('../api/v2').BrandKnowledge>;
  };
  getToken: () => Promise<string>;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
};
/**
 * Example usage in a React component:
 *
 * ```tsx
 * function CampaignList() {
 *   const v2Api = useV2Api();
 *   const [campaigns, setCampaigns] = useState([]);
 *   const [loading, setLoading] = useState(false);
 *
 *   useEffect(() => {
 *     const loadCampaigns = async () => {
 *       if (!v2Api.isInitialized) return;
 *
 *       setLoading(true);
 *       try {
 *         const result = await v2Api.campaign.list();
 *         setCampaigns(result.campaigns);
 *       } catch (error) {
 *         console.error('Failed to load campaigns:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadCampaigns();
 *   }, [v2Api.isInitialized]);
 *
 *   return (
 *     <div>
 *       <p>Using V2 API with Protobuf</p>
 *       {loading ? (
 *         <p>Loading campaigns...</p>
 *       ) : (
 *         <ul>
 *           {campaigns.map(campaign => (
 *             <li key={campaign.id}>{campaign.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
