/**
 * V2 API Module Exports
 *
 * Central export point for all V2 API services.
 * This module provides protobuf-based API communication.
 */
export { protoLoader } from './proto-loader';
export type { ProtoLoader } from './proto-loader';
export { ProtoService } from './proto-service';
export type { ProtoServiceConfig, RequestOptions } from './proto-service';
export { campaignApiV2, CampaignStatus, GenerationStatus } from './campaign-api';
export type { CampaignApiV2 } from './campaign-api';
export { brandApiV2 } from '../../features/brand/api/brand-api';
export type { BrandApiV2 } from '../../features/brand/api/brand-api';
export type {
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
} from '../../features/brand/api/brand-api';
/**
 * Initialize V2 API system
 * Call this once at app startup
 */
export declare function initializeV2Api(): Promise<void>;
