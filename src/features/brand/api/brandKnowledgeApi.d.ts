export interface BrandKnowledgeData {
    brand_id: string;
    brand_name: string;
    personality: {
        traits: string[];
        tone: Record<string, string>;
        voice_attributes: string[];
    };
    visual_style: {
        color_palette: string[];
        style_tags: string[];
        photography_style: string;
        composition_preferences: string[];
    };
    products: Array<{
        name: string;
        generic_term: string;
        category: string;
        differentiators: string[];
        usage_context: string;
        ingredients: Array<{
            name: string;
            purpose: string;
        }>;
    }>;
    approved_scenes: string[];
    avoid_list: string[];
    guardrails: Record<string, string | boolean | number>;
}
/**
 * API client for brand knowledge operations
 */
export declare const brandKnowledgeApi: {
    /**
     * Create new brand knowledge
     */
    create: (data: BrandKnowledgeData, token: string) => Promise<any>;
    /**
     * Update existing brand knowledge
     */
    update: (id: string, data: BrandKnowledgeData, token: string) => Promise<any>;
    /**
     * Get brand knowledge by ID
     */
    get: (id: string, token: string) => Promise<any>;
    /**
     * Get brand knowledge by brand ID
     */
    getByBrandId: (brandId: string, token: string) => Promise<any>;
    /**
     * List all brand knowledge entries for a user
     */
    list: (token: string, limit?: number, offset?: number) => Promise<any>;
    /**
     * Extract brand knowledge from a single campaign
     */
    extractFromCampaign: (campaignId: string, token: string) => Promise<any>;
    /**
     * Extract and merge brand knowledge from multiple campaigns
     */
    extractFromCampaigns: (campaignIds: string[], token: string) => Promise<any>;
    /**
     * Delete brand knowledge
     */
    delete: (id: string, token: string) => Promise<any>;
    /**
     * Get summary statistics for brand knowledge
     */
    getSummary: (token: string) => Promise<any>;
};
