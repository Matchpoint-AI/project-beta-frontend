/**
 * React Hook for V2 API Integration
 *
 * Provides a clean interface for components to interact with
 * the V2 API while handling loading states and errors.
 */
import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeV2Api, campaignApiV2, brandApiV2 } from '../api/v2';

/**
 * Hook state interface
 */
interface UseV2ApiState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for V2 API usage
 */
export function useV2Api() {
  const [state, setState] = useState<UseV2ApiState>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });

  // Initialize V2 API on mount
  useEffect(() => {
    const init = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        await initializeV2Api();

        // Update API version state
        setState((prev) => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isInitialized: false,
          isLoading: false,
          error: error as Error,
        }));
      }
    };

    init();
  }, []);

  // Get current user token
  const getToken = useCallback(async (): Promise<string> => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.getIdToken();
  }, []);

  // Campaign operations
  const campaign = {
    /**
     * Get campaign details
     */
    get: useCallback(
      async (campaignId: string) => {
        const token = await getToken();
        return campaignApiV2.getCampaign(campaignId, token);
      },
      [getToken]
    ),

    /**
     * Create a new campaign
     */
    create: useCallback(
      async (data: Record<string, unknown>) => {
        const token = await getToken();
        return campaignApiV2.createCampaign(data, token);
      },
      [getToken]
    ),

    /**
     * Update campaign
     */
    update: useCallback(
      async (campaignId: string, data: Record<string, unknown>) => {
        const token = await getToken();
        return campaignApiV2.updateCampaign(campaignId, data, token);
      },
      [getToken]
    ),

    /**
     * Delete campaign
     */
    delete: useCallback(
      async (campaignId: string) => {
        const token = await getToken();
        return campaignApiV2.deleteCampaign(campaignId, token);
      },
      [getToken]
    ),

    /**
     * Generate content for campaign
     */
    generateContent: useCallback(
      async (campaignId: string, options?: Record<string, unknown>) => {
        const token = await getToken();
        return campaignApiV2.generateContent(campaignId, options || {}, token);
      },
      [getToken]
    ),

    /**
     * Get campaign content
     */
    getContent: useCallback(
      async (campaignId: string) => {
        const token = await getToken();
        return campaignApiV2.getCampaignContent(campaignId, token);
      },
      [getToken]
    ),

    /**
     * List campaigns
     */
    list: useCallback(
      async (filters?: Record<string, unknown>) => {
        const token = await getToken();
        return campaignApiV2.getUserCampaigns(token, filters);
      },
      [getToken]
    ),
  };

  // Brand operations
  const brand = {
    /**
     * Create brand
     */
    create: useCallback(
      async (data: Record<string, unknown>) => {
        const token = await getToken();
        return brandApiV2.createBrand(data, token);
      },
      [getToken]
    ),

    /**
     * Get brand details
     */
    get: useCallback(
      async (brandId: string) => {
        const token = await getToken();
        return brandApiV2.getBrand(brandId, token);
      },
      [getToken]
    ),

    /**
     * Update brand
     */
    update: useCallback(
      async (brandId: string, data: Record<string, unknown>) => {
        const token = await getToken();
        return brandApiV2.updateBrand(brandId, data, token);
      },
      [getToken]
    ),

    /**
     * Delete brand
     */
    delete: useCallback(
      async (brandId: string) => {
        const token = await getToken();
        return brandApiV2.deleteBrand(brandId, token);
      },
      [getToken]
    ),

    /**
     * List brands
     */
    list: useCallback(
      async (filters?: Record<string, unknown>) => {
        const token = await getToken();
        return brandApiV2.getUserBrands(token, filters);
      },
      [getToken]
    ),

    /**
     * Crawl website
     */
    crawlWebsite: useCallback(
      async (data: Record<string, unknown>) => {
        const token = await getToken();
        return brandApiV2.crawlWebsite(data, token);
      },
      [getToken]
    ),

    /**
     * Get brand knowledge
     */
    getKnowledge: useCallback(
      async (brandId: string) => {
        const token = await getToken();
        return brandApiV2.getBrandKnowledge(brandId, token);
      },
      [getToken]
    ),
  };

  return {
    ...state,
    campaign,
    brand,
    getToken,
  };
}

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
