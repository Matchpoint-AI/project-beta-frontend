import { getServiceURL } from "../shared/utils/getServiceURL";

const CONTENT_GEN_URL = getServiceURL('content-gen');

// Caption Generator API endpoints
export const captionApi = {
  // Generate new captions for content
  generateCaptions: async (
    contentId: string,
    data: {
      image_description: string;
      scene_type: 'product' | 'lifestyle' | 'human' | 'text' | 'infographic';
      brand_voice?: string;
      target_audience?: string;
      hashtags?: string[];
      max_length?: number;
      include_cta?: boolean;
      tone?: 'professional' | 'casual' | 'playful' | 'inspirational' | 'educational';
      campaign_goals?: string[];
      product_features?: string[];
    },
    token: string
  ) => {
    // Transform frontend data format to match backend expectations
    const requestBody = {
      content_id: contentId,
      image_description: data.image_description,
      scene_type: data.scene_type,
      brand_voice: data.brand_voice,
      target_audience: data.target_audience,
      campaign_goals: data.campaign_goals || [],
      // Convert hashtags array to hashtag_preferences dict
      hashtag_preferences: data.hashtags
        ? {
            suggested: data.hashtags,
            count: Math.min(data.hashtags.length, 30),
          }
        : undefined,
      // Convert max_length to caption_length
      caption_length:
        data.max_length && data.max_length > 1500
          ? 'long'
          : data.max_length && data.max_length < 500
            ? 'short'
            : 'medium',
      include_call_to_action: data.include_cta !== undefined ? data.include_cta : true,
      product_features: data.product_features || [],
      // Map tone to custom_instructions if needed
      custom_instructions: data.tone ? `Use a ${data.tone} tone.` : undefined,
    };

    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/content/${contentId}/captions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      throw new Error(`Caption generation failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Regenerate a specific caption
  regenerateCaption: async (
    contentId: string,
    captionId: string,
    data: {
      style?: 'similar' | 'different' | 'shorter' | 'longer';
      preserve_hashtags?: boolean;
      custom_instruction?: string;
    },
    token: string
  ) => {
    // Transform to match backend RegenerateCaptionRequest model
    const requestBody = {
      content_id: contentId,
      caption_id: captionId,
      feedback:
        data.custom_instruction ||
        (data.style === 'shorter'
          ? 'Make it shorter'
          : data.style === 'longer'
            ? 'Make it longer'
            : data.style === 'different'
              ? 'Make it different'
              : 'Generate a similar caption'),
      preserve_elements: data.preserve_hashtags ? ['hashtags'] : [],
    };

    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/content/${contentId}/captions/${captionId}/regenerate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );
    if (!response.ok) {
      throw new Error(`Caption regeneration failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Get all captions for content
  getCaptions: async (contentId: string, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/content/${contentId}/captions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch captions: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete a caption
  deleteCaption: async (contentId: string, captionId: string, token: string) => {
    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/content/${contentId}/captions/${captionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete caption: ${response.statusText}`);
    }
    return response.json();
  },

  // Validate caption
  validateCaption: async (
    data: {
      text: string;
      platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
    },
    token: string
  ) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/captions/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Caption validation failed: ${response.statusText}`);
    }
    return response.json();
  },
};

// Scene Mix Policy API endpoints
export const policyApi = {
  // Create a new policy
  createPolicy: async (
    campaignId: string,
    data: {
      campaign_id: string;
      intent: 'awareness' | 'conversion' | 'engagement' | 'education';
      industry:
        | 'consumable'
        | 'wearable'
        | 'device'
        | 'service'
        | 'venue'
        | 'food_beverage'
        | 'cosmetic'
        | 'supplement'
        | 'saas';
      brand_tier?: 'premium' | 'standard' | 'budget';
      target_audience?: unknown;
      brand_personality?: string[];
      product_features?: string[];
      seasonal_context?: string;
      region?: string;
      has_ingredients?: boolean;
      visual_restrictions?: string[];
      performance_history?: Record<string, number>;
      force_regenerate?: boolean;
    },
    token: string
  ) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/campaigns/${campaignId}/policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Policy creation failed: ${response.statusText} - ${errorText}`);
    }
    return response.json();
  },

  // Get policy for a campaign
  getPolicy: async (campaignId: string, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/campaigns/${campaignId}/policy`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch policy: ${response.statusText}`);
    }
    return response.json();
  },

  // Update policy
  updatePolicy: async (campaignId: string, policyId: string, data: unknown, token: string) => {
    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/campaigns/${campaignId}/policy/${policyId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Policy update failed: ${response.statusText}`);
    }
    return response.json();
  },
};

// Scene Mix Planner API endpoints
export const plannerApi = {
  // Create a content plan
  createPlan: async (
    campaignId: string,
    data: {
      campaign_name: string;
      campaign_type: 'product_launch' | 'brand_awareness' | 'seasonal' | 'engagement';
      duration_weeks: number;
      target_audience: string[];
      content_types?: string[];
      weekly_post_count?: number;
      themes?: string[];
      brand_values?: string[];
    },
    token: string
  ) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/campaigns/${campaignId}/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Plan creation failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Get content plan
  getPlan: async (campaignId: string, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/campaigns/${campaignId}/plan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch plan: ${response.statusText}`);
    }
    return response.json();
  },

  // Get all plans for user
  getUserPlans: async (token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/plans`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user plans: ${response.statusText}`);
    }
    return response.json();
  },
};

// Image Generation API endpoints
export const imageApi = {
  // Generate image with Flux/FAL
  generateImage: async (
    data: {
      prompt: string;
      model?:
        | 'flux-pro'
        | 'flux-dev'
        | 'flux-schnell'
        | 'stable-diffusion-xl'
        | 'dall-e-3'
        | 'midjourney';
      style?:
        | 'photorealistic'
        | 'artistic'
        | 'digital-art'
        | 'illustration'
        | 'cinematic'
        | 'product-shot'
        | 'fashion'
        | 'food';
      aspect_ratio?: string;
      negative_prompt?: string;
      width?: number;
      height?: number;
      num_inference_steps?: number;
      guidance_scale?: number;
      seed?: number;
      enhance_prompt?: boolean;
    },
    token: string
  ) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/images/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Generate images in batch
  generateBatch: async (requests: Array<unknown>, token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/images/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requests }),
    });
    if (!response.ok) {
      throw new Error(`Batch generation failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Remix existing image
  remixImage: async (
    imageId: string,
    data: {
      modifications?: string;
      preserve_style?: boolean;
      variation_strength?: number;
    },
    token: string
  ) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/images/remix/${imageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Image remix failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Get available models
  getModels: async (token: string) => {
    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/images/models`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    return response.json();
  },
};
