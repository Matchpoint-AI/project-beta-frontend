import { getServiceURL } from '../../../helpers/getServiceURL';

// Types for the new API
export interface BrandCreate {
  name: string;
}

export interface BrandUpdate {
  name?: string;
  status?: 'active' | 'inactive';
}

export interface BrandResponse {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRequest {
  sources: string[];
  maxPages?: number;
}

export interface WorkflowResponse {
  workflowId: string;
  brandId: string;
  status: string;
  sources: string[];
  createdAt: string;
  pagesCrawled: number;
  // Enhanced progress details
  currentStep?: 'crawling' | 'analyzing' | 'completed';
  progress?: number;
  pagesProcessed?: number;
  totalPages?: number;
}

export interface CrawlPageRequest {
  url: string;
  brandId: string;
  extractLinks?: boolean;
  waitForSelector?: string;
}

export interface CrawlPageResponse {
  url: string;
  title?: string;
  textContent?: string;
  metaDescription?: string;
  discoveredUrls: string[];
  statusCode: number;
  error?: string;
}

export interface ExtractKnowledgeRequest {
  workflowId: string;
  crawledPages: Array<Record<string, any>>;
}

export interface BrandKnowledge {
  brandId: string;
  personalityTraits: string[];
  toneAttributes: Record<string, string>;
  colorPalette: string[];
  products: Array<Record<string, any>>;
  brandDescription?: string;
  valueProposition?: string;
  targetAudience?: string;
}

const API_BASE_URL = getServiceURL('content-gen'); // Use content-gen service for now

class BrandV2ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'BrandV2ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    let errorDetails;

    try {
      errorDetails = await response.json();
      errorMessage = errorDetails.detail || errorDetails.message || errorMessage;
    } catch {
      // If we can't parse JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new BrandV2ApiError(errorMessage, response.status, errorDetails);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const makeRequest = async (endpoint: string, options: RequestInit = {}, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

export const brandV2Api = {
  // Brand Management
  async createBrand(data: BrandCreate, token: string): Promise<BrandResponse> {
    return makeRequest(
      '/api/v2/brands',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  },

  async getBrand(brandId: string, token: string): Promise<BrandResponse> {
    return makeRequest(`/api/v2/brands/${brandId}`, {}, token);
  },

  async listBrands(token: string): Promise<BrandResponse[]> {
    return makeRequest('/api/v2/brands', {}, token);
  },

  async updateBrand(brandId: string, data: BrandUpdate, token: string): Promise<BrandResponse> {
    return makeRequest(
      `/api/v2/brands/${brandId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Workflow Management
  async createWorkflow(
    brandId: string,
    data: WorkflowRequest,
    token: string
  ): Promise<WorkflowResponse> {
    return makeRequest(
      `/api/v2/brands/${brandId}/workflows`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  },

  async getWorkflow(brandId: string, token: string): Promise<WorkflowResponse> {
    return makeRequest(`/api/v2/brands/${brandId}/workflows`, {}, token);
  },

  // Page Crawling
  async createPage(
    brandId: string,
    data: CrawlPageRequest,
    token: string
  ): Promise<CrawlPageResponse> {
    return makeRequest(
      `/api/v2/brands/${brandId}/pages`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Knowledge Extraction
  async createKnowledge(
    brandId: string,
    data: ExtractKnowledgeRequest,
    token: string
  ): Promise<BrandKnowledge> {
    return makeRequest(
      `/api/v2/brands/${brandId}/knowledge`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  },

  async getKnowledge(brandId: string, token: string): Promise<BrandKnowledge | null> {
    try {
      return await makeRequest(`/api/v2/brands/${brandId}/knowledge`, {}, token);
    } catch (error) {
      if (error instanceof BrandV2ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Utility functions for workflow management
  async waitForWorkflowCompletion(
    brandId: string,
    token: string,
    onProgress?: (workflow: WorkflowResponse) => void,
    maxAttempts = 60,
    intervalMs = 2000
  ): Promise<WorkflowResponse> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const workflow = await this.getWorkflow(brandId, token);

      if (onProgress) {
        onProgress(workflow);
      }

      if (workflow.status === 'completed' || workflow.currentStep === 'completed') {
        return workflow;
      }

      if (workflow.status === 'failed' || workflow.status === 'error') {
        throw new BrandV2ApiError(`Workflow failed with status: ${workflow.status}`);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }

    throw new BrandV2ApiError('Workflow timeout - maximum attempts exceeded');
  },

  // Complete brand onboarding workflow
  async completeBrandOnboarding(
    name: string,
    website: string,
    token: string,
    maxPages = 50,
    onProgress?: (step: string, progress?: number) => void
  ): Promise<{ brand: BrandResponse; knowledge: BrandKnowledge }> {
    try {
      // Step 1: Create brand (no longer triggers automatic workflow)
      onProgress?.('Creating brand...', 0.1);
      const brand = await this.createBrand(
        {
          name,
        },
        token
      );

      // Step 2: Create workflow for the brand
      onProgress?.('Starting website analysis workflow...', 0.2);
      await this.createWorkflow(
        brand.id,
        {
          sources: [website],
          maxPages,
        },
        token
      );

      // Step 3: Wait for workflow completion with progress updates
      await this.waitForWorkflowCompletion(brand.id, token, (workflowStatus) => {
        const step = workflowStatus.currentStep || 'processing';
        const progress = Math.max(0.3, Math.min(0.9, workflowStatus.progress || 0.5));
        onProgress?.(`${step}...`, progress);
      });

      // Step 4: Get extracted knowledge
      onProgress?.('Retrieving brand knowledge...', 0.95);
      const knowledge = await this.getKnowledge(brand.id, token);

      if (!knowledge) {
        throw new BrandV2ApiError('No knowledge was extracted from the website');
      }

      onProgress?.('Complete!', 1.0);

      return { brand, knowledge };
    } catch (error) {
      if (error instanceof BrandV2ApiError) {
        throw error;
      }
      throw new BrandV2ApiError(
        `Brand onboarding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
};

export { BrandV2ApiError };
