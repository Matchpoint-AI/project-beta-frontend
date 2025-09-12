/**
 * Campaign API V2 Service
 *
 * Implements campaign-related operations using protobuf messages.
 * All payloads are constructed using protobuf.js as per requirements.
 */
import { ProtoService } from './proto-service';
/**
 * Campaign status enum matching proto definition
 */
export declare enum CampaignStatus {
  CAMPAIGN_STATUS_UNSPECIFIED = 'CAMPAIGN_STATUS_UNSPECIFIED',
  CAMPAIGN_STATUS_DRAFT = 'CAMPAIGN_STATUS_DRAFT',
  CAMPAIGN_STATUS_READY = 'CAMPAIGN_STATUS_READY',
  CAMPAIGN_STATUS_ACTIVE = 'CAMPAIGN_STATUS_ACTIVE',
  CAMPAIGN_STATUS_PAUSED = 'CAMPAIGN_STATUS_PAUSED',
  CAMPAIGN_STATUS_COMPLETED = 'CAMPAIGN_STATUS_COMPLETED',
  CAMPAIGN_STATUS_ARCHIVED = 'CAMPAIGN_STATUS_ARCHIVED',
}
/**
 * Generation status enum
 */
export declare enum GenerationStatus {
  GENERATION_STATUS_UNSPECIFIED = 'GENERATION_STATUS_UNSPECIFIED',
  GENERATION_STATUS_ACCEPTED = 'GENERATION_STATUS_ACCEPTED',
  GENERATION_STATUS_PROCESSING = 'GENERATION_STATUS_PROCESSING',
  GENERATION_STATUS_COMPLETED = 'GENERATION_STATUS_COMPLETED',
  GENERATION_STATUS_FAILED = 'GENERATION_STATUS_FAILED',
}
/**
 * Campaign request/response interfaces
 * These match the protobuf message structures
 */
export interface GetCampaignRequest {
  campaign_id: string;
}
export interface GetCampaignResponse {
  campaign: {
    id: string;
    name: string;
    status: CampaignStatus;
    user_id: string;
    brand_id?: string;
    created_at?: string;
    updated_at?: string;
    metadata?: Record<string, unknown>;
  };
}
export interface GetCampaignContentRequest {
  campaign_id: string;
}
export interface GetCampaignContentResponse {
  generated_content: {
    id: string;
    campaign_id: string;
    weeks: Array<{
      week_number: number;
      posts: Array<{
        id: string;
        content: string;
        media_urls: string[];
        scheduled_at?: string;
        metadata?: Record<string, unknown>;
      }>;
    }>;
    total_posts: number;
    created_at?: string;
    updated_at?: string;
  };
}
export interface GenerateContentRequest {
  campaign_id: string;
  quality_threshold?: number;
  plan_id?: string;
  policy_id?: string;
}
export interface GenerateContentResponse {
  request_id: string;
  status: GenerationStatus;
  campaign_id: string;
  quality_threshold?: number;
  plan_id?: string;
  policy_id?: string;
  user_id: string;
}
export interface ApproveCampaignRequest {
  campaign_id: string;
  approval_notes?: string;
}
export interface ApproveCampaignResponse {
  success: boolean;
  campaign_id: string;
  status: CampaignStatus;
  approved_at: string;
  approved_by: string;
}
export interface CreateCampaignRequest {
  name: string;
  brand_id: string;
  objective?: string;
  target_audience?: string;
  duration_weeks?: number;
  start_date?: string;
  metadata?: Record<string, unknown>;
}
export interface CreateCampaignResponse {
  campaign: {
    id: string;
    name: string;
    status: CampaignStatus;
    brand_id: string;
    created_at: string;
  };
}
export interface UpdateCampaignRequest {
  campaign_id: string;
  name?: string;
  objective?: string;
  target_audience?: string;
  metadata?: Record<string, unknown>;
}
export interface UpdateCampaignResponse {
  campaign: {
    id: string;
    name: string;
    status: CampaignStatus;
    updated_at: string;
  };
}
/**
 * Campaign API V2 Service
 */
export declare class CampaignApiV2 extends ProtoService {
  constructor();
  /**
   * Get campaign details
   */
  getCampaign(campaignId: string, token: string): Promise<GetCampaignResponse>;
  /**
   * Create a new campaign
   */
  createCampaign(data: CreateCampaignRequest, token: string): Promise<CreateCampaignResponse>;
  /**
   * Update campaign details
   */
  updateCampaign(
    campaignId: string,
    data: Omit<UpdateCampaignRequest, 'campaign_id'>,
    token: string
  ): Promise<UpdateCampaignResponse>;
  /**
   * Generate content for a campaign
   */
  generateContent(
    campaignId: string,
    options: Omit<GenerateContentRequest, 'campaign_id'>,
    token: string
  ): Promise<GenerateContentResponse>;
  /**
   * Get generated content for a campaign
   */
  getCampaignContent(campaignId: string, token: string): Promise<GetCampaignContentResponse>;
  /**
   * Approve a campaign
   */
  approveCampaign(
    campaignId: string,
    approvalNotes: string | undefined,
    token: string
  ): Promise<ApproveCampaignResponse>;
  /**
   * Delete a campaign
   */
  deleteCampaign(
    campaignId: string,
    token: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;
  /**
   * Get all campaigns for the user
   */
  getUserCampaigns(
    token: string,
    filters?: {
      status?: CampaignStatus;
      brand_id?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    campaigns: GetCampaignResponse['campaign'][];
  }>;
  /**
   * Get campaign generation status
   */
  getGenerationStatus(
    campaignId: string,
    requestId: string,
    token: string
  ): Promise<GenerateContentResponse>;
  /**
   * Cancel content generation
   */
  cancelGeneration(
    campaignId: string,
    requestId: string,
    token: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;
  /**
   * Export campaign content
   */
  exportCampaign(campaignId: string, format: 'csv' | 'json' | 'xlsx', token: string): Promise<Blob>;
}
export declare const campaignApiV2: CampaignApiV2;
