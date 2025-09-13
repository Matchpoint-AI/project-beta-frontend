// Removed getServiceURL import - using environment variables instead

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
    ingredients: Array<{ name: string; purpose: string }>;
  }>;
  approved_scenes: string[];
  avoid_list: string[];
  guardrails: Record<string, string | boolean | number>;
}

// Use environment variable for content generation service URL
const CONTENT_GEN_URL = import.meta.env.VITE_CONTENT_GEN_URL || 'https://localhost:7653';

/**
 * API client for brand knowledge operations
 */
export const brandKnowledgeApi = {
  /**
   * Create new brand knowledge
   */
  create: async (data: BrandKnowledgeData, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/brand-knowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create brand knowledge');
    }

    return response.json();
  },

  /**
   * Update existing brand knowledge
   */
  update: async (id: string, data: BrandKnowledgeData, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/brand-knowledge/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update brand knowledge');
    }

    return response.json();
  },

  /**
   * Get brand knowledge by ID
   */
  get: async (id: string, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/brand-knowledge/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch brand knowledge');
    }

    return response.json();
  },

  /**
   * Get brand knowledge by brand ID
   */
  getByBrandId: async (brandId: string, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/brand-knowledge/by-brand/${brandId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch brand knowledge');
    }

    if (response.status === 404) {
      return null;
    }

    return response.json();
  },

  /**
   * List all brand knowledge entries for a user
   */
  list: async (token: string, limit = 10, offset = 0) => {
    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/brand-knowledge?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to list brand knowledge');
    }

    return response.json();
  },

  /**
   * Extract brand knowledge from a single campaign
   */
  extractFromCampaign: async (campaignId: string, token: string) => {
    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/brand-knowledge/extract-from-campaign`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaign_id: campaignId }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to extract brand knowledge');
    }

    return response.json();
  },

  /**
   * Extract and merge brand knowledge from multiple campaigns
   */
  extractFromCampaigns: async (campaignIds: string[], token: string) => {
    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/brand-knowledge/extract-from-campaigns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaign_ids: campaignIds }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to extract brand knowledge');
    }

    return response.json();
  },

  /**
   * Delete brand knowledge
   */
  delete: async (id: string, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/brand-knowledge/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete brand knowledge');
    }

    return response.json();
  },

  /**
   * Get summary statistics for brand knowledge
   */
  getSummary: async (token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/brand-knowledge/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch summary');
    }

    return response.json();
  },
};
