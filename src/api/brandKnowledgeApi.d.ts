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

export interface BrandKnowledgeResponse {
  id: string;
  data: BrandKnowledgeData;
  created_at: string;
  updated_at: string;
}

export interface BrandKnowledgeListResponse {
  items: BrandKnowledgeResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface BrandKnowledgeSummary {
  total_entries: number;
  brands: string[];
  last_updated: string;
}

/**
 * API client for brand knowledge operations
 */
export declare const brandKnowledgeApi: {
  /**
   * Create new brand knowledge
   */
  create: (data: BrandKnowledgeData, token: string) => Promise<BrandKnowledgeResponse>;
  /**
   * Update existing brand knowledge
   */
  update: (id: string, data: BrandKnowledgeData, token: string) => Promise<BrandKnowledgeResponse>;
  /**
   * Get brand knowledge by ID
   */
  get: (id: string, token: string) => Promise<BrandKnowledgeResponse>;
  /**
   * Get brand knowledge by brand ID
   */
  getByBrandId: (brandId: string, token: string) => Promise<BrandKnowledgeResponse>;
  /**
   * List all brand knowledge entries for a user
   */
  list: (token: string, limit?: number, offset?: number) => Promise<BrandKnowledgeListResponse>;
  /**
   * Extract brand knowledge from a single campaign
   */
  extractFromCampaign: (campaignId: string, token: string) => Promise<BrandKnowledgeData>;
  /**
   * Extract and merge brand knowledge from multiple campaigns
   */
  extractFromCampaigns: (campaignIds: string[], token: string) => Promise<BrandKnowledgeData>;
  /**
   * Delete brand knowledge
   */
  delete: (id: string, token: string) => Promise<{ success: boolean }>;
  /**
   * Get summary statistics for brand knowledge
   */
  getSummary: (token: string) => Promise<BrandKnowledgeSummary>;
};
