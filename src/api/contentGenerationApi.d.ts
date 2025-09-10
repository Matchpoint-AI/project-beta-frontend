export declare const captionApi: {
  generateCaptions: (
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
  ) => Promise<any>;
  regenerateCaption: (
    contentId: string,
    captionId: string,
    data: {
      style?: 'similar' | 'different' | 'shorter' | 'longer';
      preserve_hashtags?: boolean;
      custom_instruction?: string;
    },
    token: string
  ) => Promise<any>;
  getCaptions: (contentId: string, token: string) => Promise<any>;
  deleteCaption: (contentId: string, captionId: string, token: string) => Promise<any>;
  validateCaption: (
    data: {
      text: string;
      platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
    },
    token: string
  ) => Promise<any>;
};
export declare const policyApi: {
  createPolicy: (
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
  ) => Promise<any>;
  getPolicy: (campaignId: string, token: string) => Promise<any>;
  updatePolicy: (
    campaignId: string,
    policyId: string,
    data: unknown,
    token: string
  ) => Promise<any>;
};
export declare const plannerApi: {
  createPlan: (
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
  ) => Promise<any>;
  getPlan: (campaignId: string, token: string) => Promise<any>;
  getUserPlans: (token: string) => Promise<any>;
};
export declare const imageApi: {
  generateImage: (
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
  ) => Promise<any>;
  generateBatch: (requests: Array<unknown>, token: string) => Promise<any>;
  remixImage: (
    imageId: string,
    data: {
      modifications?: string;
      preserve_style?: boolean;
      variation_strength?: number;
    },
    token: string
  ) => Promise<any>;
  getModels: (token: string) => Promise<any>;
};
