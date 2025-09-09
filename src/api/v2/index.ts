/**
 * V2 API Module Exports
 *
 * Central export point for all V2 API services.
 * This module provides protobuf-based API communication.
 */

// Core protobuf functionality
export { protoLoader } from './proto-loader';
export type { ProtoLoader } from './proto-loader';
export { ProtoService } from './proto-service';
export type { ProtoServiceConfig, RequestOptions } from './proto-service';

// API Services
export { campaignApiV2, CampaignStatus, GenerationStatus } from './campaign-api';
export type { CampaignApiV2 } from './campaign-api';
export { brandApiV2 } from './brand-api';
export type { BrandApiV2 } from './brand-api';

// Re-export types for convenience
export type {
  // Campaign types
  GetCampaignRequest,
  GetCampaignResponse,
  GetCampaignContentRequest,
  GetCampaignContentResponse,
  GenerateContentRequest,
  GenerateContentResponse,
  ApproveCampaignRequest,
  ApproveCampaignResponse,
  CreateCampaignRequest,
  CreateCampaignResponse,
  UpdateCampaignRequest,
  UpdateCampaignResponse,
} from './campaign-api';

export type {
  // Brand types
  Brand,
  BrandKnowledge,
  Product,
  VisualGuidelines,
  ToneGuidelines,
  CreateBrandRequest,
  UpdateBrandRequest,
  CreateBrandKnowledgeRequest,
  UpdateBrandKnowledgeRequest,
  CrawlWebsiteRequest,
  CrawlWebsiteResponse,
  ExtractBrandInfoRequest,
  ExtractBrandInfoResponse,
} from './brand-api';

/**
 * Initialize V2 API system
 * Call this once at app startup
 */
export async function initializeV2Api(): Promise<void> {
  // Import protoLoader inside the function to avoid circular dependency issues
  const { protoLoader } = await import('./proto-loader');

  try {
    // Preload proto definitions
    await protoLoader.loadProtos();
  } catch (error) {
    console.error('Failed to initialize V2 API:', error);
    // Don't throw - allow app to continue
  }
}
