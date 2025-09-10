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
  metadata?: Record<string, unknown>;
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
  metadata?: Record<string, unknown>;
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
  metadata?: Record<string, unknown>;
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
export declare class BrandApiV2 extends ProtoService {
  constructor();
  /**
   * Create a new brand
   */
  createBrand(data: CreateBrandRequest, token: string): Promise<Brand>;
  /**
   * Get brand by ID
   */
  getBrand(brandId: string, token: string): Promise<Brand>;
  /**
   * Update brand information
   */
  updateBrand(
    brandId: string,
    data: Omit<UpdateBrandRequest, 'brand_id'>,
    token: string
  ): Promise<Brand>;
  /**
   * Delete a brand
   */
  deleteBrand(
    brandId: string,
    token: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;
  /**
   * Get all brands for the user
   */
  getUserBrands(
    token: string,
    filters?: {
      industry?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    brands: Brand[];
  }>;
  /**
   * Create brand knowledge
   */
  createBrandKnowledge(data: CreateBrandKnowledgeRequest, token: string): Promise<BrandKnowledge>;
  /**
   * Get brand knowledge
   */
  getBrandKnowledge(brandId: string, token: string): Promise<BrandKnowledge>;
  /**
   * Update brand knowledge
   */
  updateBrandKnowledge(
    brandId: string,
    knowledgeId: string,
    data: Omit<UpdateBrandKnowledgeRequest, 'brand_id' | 'knowledge_id'>,
    token: string
  ): Promise<BrandKnowledge>;
  /**
   * Crawl website for brand information
   */
  crawlWebsite(data: CrawlWebsiteRequest, token: string): Promise<CrawlWebsiteResponse>;
  /**
   * Get crawl job status
   */
  getCrawlStatus(brandId: string, jobId: string, token: string): Promise<CrawlWebsiteResponse>;
  /**
   * Extract brand information from content
   */
  extractBrandInfo(data: ExtractBrandInfoRequest, token: string): Promise<ExtractBrandInfoResponse>;
  /**
   * Upload brand logo
   */
  uploadLogo(
    brandId: string,
    file: File,
    token: string
  ): Promise<{
    logo_url: string;
  }>;
  /**
   * Import brand data from file
   */
  importBrandData(
    brandId: string,
    file: File,
    format: 'json' | 'csv' | 'xlsx',
    token: string
  ): Promise<{
    success: boolean;
    imported_count: number;
    errors?: string[];
  }>;
  /**
   * Export brand data
   */
  exportBrandData(brandId: string, format: 'json' | 'csv' | 'xlsx', token: string): Promise<Blob>;
  /**
   * Validate brand data
   */
  validateBrandData(
    data: CreateBrandRequest,
    token: string
  ): Promise<{
    valid: boolean;
    errors?: Record<string, string>;
    warnings?: Record<string, string>;
  }>;
}
export declare const brandApiV2: BrandApiV2;
