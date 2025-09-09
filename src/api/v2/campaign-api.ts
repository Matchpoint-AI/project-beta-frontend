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
export enum CampaignStatus {
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
export enum GenerationStatus {
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
    metadata?: Record<string, any>;
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
        metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
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
export class CampaignApiV2 extends ProtoService {
  constructor() {
    super({
      serviceName: 'Campaign V2 API',
      baseUrl: '/api/v2',
    });
  }

  /**
   * Get campaign details
   */
  async getCampaign(campaignId: string, token: string): Promise<GetCampaignResponse> {
    const request: GetCampaignRequest = {
      campaign_id: campaignId,
    };

    return this.post<GetCampaignRequest, GetCampaignResponse>(
      `/campaigns/${campaignId}`,
      request,
      { package: 'protos', message: 'GetCampaignRequest' },
      { package: 'protos', message: 'GetCampaignResponse' },
      { token }
    );
  }

  /**
   * Create a new campaign
   */
  async createCampaign(
    data: CreateCampaignRequest,
    token: string
  ): Promise<CreateCampaignResponse> {
    return this.post<CreateCampaignRequest, CreateCampaignResponse>(
      '/campaigns',
      data,
      { package: 'protos', message: 'Campaign' },
      { package: 'protos', message: 'Campaign' },
      { token }
    );
  }

  /**
   * Update campaign details
   */
  async updateCampaign(
    campaignId: string,
    data: Omit<UpdateCampaignRequest, 'campaign_id'>,
    token: string
  ): Promise<UpdateCampaignResponse> {
    const request: UpdateCampaignRequest = {
      campaign_id: campaignId,
      ...data,
    };

    return this.put<UpdateCampaignRequest, UpdateCampaignResponse>(
      `/campaigns/${campaignId}`,
      request,
      { package: 'protos', message: 'Campaign' },
      { package: 'protos', message: 'Campaign' },
      { token }
    );
  }

  /**
   * Generate content for a campaign
   */
  async generateContent(
    campaignId: string,
    options: Omit<GenerateContentRequest, 'campaign_id'>,
    token: string
  ): Promise<GenerateContentResponse> {
    const request: GenerateContentRequest = {
      campaign_id: campaignId,
      ...options,
    };

    return this.post<GenerateContentRequest, GenerateContentResponse>(
      `/campaigns/${campaignId}/content`,
      request,
      { package: 'protos', message: 'GenerationRequest' },
      { package: 'protos', message: 'GenerationRequest' },
      { token }
    );
  }

  /**
   * Get generated content for a campaign
   */
  async getCampaignContent(campaignId: string, token: string): Promise<GetCampaignContentResponse> {
    const request: GetCampaignContentRequest = {
      campaign_id: campaignId,
    };

    return this.post<GetCampaignContentRequest, GetCampaignContentResponse>(
      `/campaigns/${campaignId}/content`,
      request,
      { package: 'protos', message: 'GetCampaignContentRequest' },
      { package: 'protos', message: 'GetCampaignContentResponse' },
      { token }
    );
  }

  /**
   * Approve a campaign
   */
  async approveCampaign(
    campaignId: string,
    approvalNotes: string | undefined,
    token: string
  ): Promise<ApproveCampaignResponse> {
    const request: ApproveCampaignRequest = {
      campaign_id: campaignId,
      approval_notes: approvalNotes,
    };

    return this.post<ApproveCampaignRequest, ApproveCampaignResponse>(
      `/campaigns/${campaignId}/approve`,
      request,
      { package: 'protos', message: 'Campaign' },
      { package: 'protos', message: 'Campaign' },
      { token }
    );
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(
    campaignId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(
      `/campaigns/${campaignId}`,
      { package: 'protos', message: 'Empty' },
      { token }
    );
  }

  /**
   * Get all campaigns for the user
   */
  async getUserCampaigns(
    token: string,
    filters?: {
      status?: CampaignStatus;
      brand_id?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ campaigns: GetCampaignResponse['campaign'][] }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.brand_id) queryParams.append('brand_id', filters.brand_id);
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.offset) queryParams.append('offset', filters.offset.toString());
    }

    const endpoint = `/campaigns${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    return this.get<{ campaigns: GetCampaignResponse['campaign'][] }>(
      endpoint,
      { package: 'protos', message: 'Campaign' },
      { token }
    );
  }

  /**
   * Get campaign generation status
   */
  async getGenerationStatus(
    campaignId: string,
    requestId: string,
    token: string
  ): Promise<GenerateContentResponse> {
    return this.get<GenerateContentResponse>(
      `/campaigns/${campaignId}/generation/${requestId}/status`,
      { package: 'protos', message: 'GenerationRequest' },
      { token }
    );
  }

  /**
   * Cancel content generation
   */
  async cancelGeneration(
    campaignId: string,
    requestId: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    return this.makeProtoRequest<null, { success: boolean; message: string }>(
      'POST',
      `/campaigns/${campaignId}/generation/${requestId}/cancel`,
      null,
      null,
      { package: 'protos', message: 'Empty' },
      { token }
    );
  }

  /**
   * Export campaign content
   */
  async exportCampaign(
    campaignId: string,
    format: 'csv' | 'json' | 'xlsx',
    token: string
  ): Promise<Blob> {
    const response = await fetch(
      `${this.baseUrl}/campaigns/${campaignId}/export?format=${format}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Export singleton instance
export const campaignApiV2 = new CampaignApiV2();
