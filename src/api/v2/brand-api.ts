/**
 * Brand API V2 Service
 *
 * Implements brand-related operations using protobuf messages.
 * All payloads are constructed using protobuf.js as per requirements.
 */
import { ProtoService } from './proto-service';

/**
 * Brand request/response interfaces matching protobuf messages
 */
export interface Brand {
  id: string;
  name: string;
  website?: string;
  logo_url?: string;
  description?: string;
  industry?: string;
  target_audience?: string;
  brand_voice?: string;
  brand_values?: string[];
  social_handles?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
  };
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface BrandKnowledge {
  brand_id: string;
  products?: Product[];
  competitors?: string[];
  unique_selling_points?: string[];
  brand_story?: string;
  visual_guidelines?: VisualGuidelines;
  tone_guidelines?: ToneGuidelines;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  features?: string[];
  images?: string[];
}

export interface VisualGuidelines {
  primary_colors?: string[];
  secondary_colors?: string[];
  font_families?: string[];
  logo_usage?: string;
  image_style?: string;
  avoid_visuals?: string[];
}

export interface ToneGuidelines {
  voice_attributes?: string[];
  writing_style?: string;
  key_phrases?: string[];
  avoid_phrases?: string[];
  emoji_usage?: 'never' | 'minimal' | 'moderate' | 'frequent';
}

export interface CreateBrandRequest {
  name: string;
  website?: string;
  logo_url?: string;
  description?: string;
  industry?: string;
  target_audience?: string;
  brand_voice?: string;
  brand_values?: string[];
  social_handles?: Brand['social_handles'];
  metadata?: Record<string, any>;
}

export interface UpdateBrandRequest {
  brand_id: string;
  name?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  industry?: string;
  target_audience?: string;
  brand_voice?: string;
  brand_values?: string[];
  social_handles?: Brand['social_handles'];
  metadata?: Record<string, any>;
}

export interface CreateBrandKnowledgeRequest {
  brand_id: string;
  products?: Product[];
  competitors?: string[];
  unique_selling_points?: string[];
  brand_story?: string;
  visual_guidelines?: VisualGuidelines;
  tone_guidelines?: ToneGuidelines;
}

export interface UpdateBrandKnowledgeRequest extends CreateBrandKnowledgeRequest {
  knowledge_id: string;
}

export interface CrawlWebsiteRequest {
  brand_id: string;
  url: string;
  max_depth?: number;
  include_images?: boolean;
  extract_products?: boolean;
  extract_social_links?: boolean;
}

export interface CrawlWebsiteResponse {
  job_id: string;
  brand_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url: string;
  pages_crawled?: number;
  products_found?: number;
  created_at: string;
}

export interface ExtractBrandInfoRequest {
  brand_id: string;
  content: string;
  content_type: 'html' | 'text' | 'pdf';
  extract_options?: {
    extract_products?: boolean;
    extract_values?: boolean;
    extract_tone?: boolean;
    extract_visuals?: boolean;
  };
}

export interface ExtractBrandInfoResponse {
  brand_id: string;
  extracted_data: {
    products?: Product[];
    brand_values?: string[];
    tone_attributes?: string[];
    visual_elements?: string[];
    key_phrases?: string[];
  };
  confidence_scores?: Record<string, number>;
}

/**
 * Brand API V2 Service
 */
export class BrandApiV2 extends ProtoService {
  constructor() {
    super({
      serviceName: 'Brand V2 API',
      baseUrl: '/api/v2',
    });
  }

  /**
   * Create a new brand
   */
  async createBrand(data: CreateBrandRequest, token: string): Promise<Brand> {
    return this.post<CreateBrandRequest, Brand>(
      '/brands',
      data,
      { package: 'protos', message: 'Brand' },
      { package: 'protos', message: 'Brand' },
      { token }
    );
  }

  /**
   * Get brand by ID
   */
  async getBrand(brandId: string, token: string): Promise<Brand> {
    return this.get<Brand>(
      `/brands/${brandId}`,
      { package: 'protos', message: 'Brand' },
      { token }
    );
  }

  /**
   * Update brand information
   */
  async updateBrand(
    brandId: string,
    data: Omit<UpdateBrandRequest, 'brand_id'>,
    token: string
  ): Promise<Brand> {
    const request: UpdateBrandRequest = {
      brand_id: brandId,
      ...data,
    };

    return this.put<UpdateBrandRequest, Brand>(
      `/brands/${brandId}`,
      request,
      { package: 'protos', message: 'Brand' },
      { package: 'protos', message: 'Brand' },
      { token }
    );
  }

  /**
   * Delete a brand
   */
  async deleteBrand(
    brandId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(
      `/brands/${brandId}`,
      { package: 'protos', message: 'Empty' },
      { token }
    );
  }

  /**
   * Get all brands for the user
   */
  async getUserBrands(
    token: string,
    filters?: {
      industry?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ brands: Brand[] }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.industry) queryParams.append('industry', filters.industry);
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.offset) queryParams.append('offset', filters.offset.toString());
    }

    const endpoint = `/brands${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.get<{ brands: Brand[] }>(
      endpoint,
      { package: 'protos', message: 'Brand' },
      { token }
    );
  }

  /**
   * Create brand knowledge
   */
  async createBrandKnowledge(
    data: CreateBrandKnowledgeRequest,
    token: string
  ): Promise<BrandKnowledge> {
    return this.post<CreateBrandKnowledgeRequest, BrandKnowledge>(
      `/brands/${data.brand_id}/knowledge`,
      data,
      { package: 'protos', message: 'BrandKnowledge' },
      { package: 'protos', message: 'BrandKnowledge' },
      { token }
    );
  }

  /**
   * Get brand knowledge
   */
  async getBrandKnowledge(brandId: string, token: string): Promise<BrandKnowledge> {
    return this.get<BrandKnowledge>(
      `/brands/${brandId}/knowledge`,
      { package: 'protos', message: 'BrandKnowledge' },
      { token }
    );
  }

  /**
   * Update brand knowledge
   */
  async updateBrandKnowledge(
    brandId: string,
    knowledgeId: string,
    data: Omit<UpdateBrandKnowledgeRequest, 'brand_id' | 'knowledge_id'>,
    token: string
  ): Promise<BrandKnowledge> {
    const request: UpdateBrandKnowledgeRequest = {
      brand_id: brandId,
      knowledge_id: knowledgeId,
      ...data,
    };

    return this.put<UpdateBrandKnowledgeRequest, BrandKnowledge>(
      `/brands/${brandId}/knowledge/${knowledgeId}`,
      request,
      { package: 'protos', message: 'BrandKnowledge' },
      { package: 'protos', message: 'BrandKnowledge' },
      { token }
    );
  }

  /**
   * Crawl website for brand information
   */
  async crawlWebsite(data: CrawlWebsiteRequest, token: string): Promise<CrawlWebsiteResponse> {
    return this.post<CrawlWebsiteRequest, CrawlWebsiteResponse>(
      `/brands/${data.brand_id}/crawl`,
      data,
      { package: 'protos', message: 'CrawlRequest' },
      { package: 'protos', message: 'CrawlJob' },
      { token }
    );
  }

  /**
   * Get crawl job status
   */
  async getCrawlStatus(
    brandId: string,
    jobId: string,
    token: string
  ): Promise<CrawlWebsiteResponse> {
    return this.get<CrawlWebsiteResponse>(
      `/brands/${brandId}/crawl/${jobId}`,
      { package: 'protos', message: 'CrawlJob' },
      { token }
    );
  }

  /**
   * Extract brand information from content
   */
  async extractBrandInfo(
    data: ExtractBrandInfoRequest,
    token: string
  ): Promise<ExtractBrandInfoResponse> {
    return this.post<ExtractBrandInfoRequest, ExtractBrandInfoResponse>(
      `/brands/${data.brand_id}/extract`,
      data,
      { package: 'protos', message: 'ExtractRequest' },
      { package: 'protos', message: 'ExtractResponse' },
      { token }
    );
  }

  /**
   * Upload brand logo
   */
  async uploadLogo(brandId: string, file: File, token: string): Promise<{ logo_url: string }> {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(`${this.baseUrl}/brands/${brandId}/logo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Logo upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Import brand data from file
   */
  async importBrandData(
    brandId: string,
    file: File,
    format: 'json' | 'csv' | 'xlsx',
    token: string
  ): Promise<{
    success: boolean;
    imported_count: number;
    errors?: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    const response = await fetch(`${this.baseUrl}/brands/${brandId}/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Export brand data
   */
  async exportBrandData(
    brandId: string,
    format: 'json' | 'csv' | 'xlsx',
    token: string
  ): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/brands/${brandId}/export?format=${format}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Validate brand data
   */
  async validateBrandData(
    data: CreateBrandRequest,
    token: string
  ): Promise<{
    valid: boolean;
    errors?: Record<string, string>;
    warnings?: Record<string, string>;
  }> {
    return this.post<
      CreateBrandRequest,
      {
        valid: boolean;
        errors?: Record<string, string>;
        warnings?: Record<string, string>;
      }
    >(
      '/brands/validate',
      data,
      { package: 'protos', message: 'Brand' },
      { package: 'protos', message: 'ValidationResponse' },
      { token }
    );
  }
}

// Export singleton instance
export const brandApiV2 = new BrandApiV2();
