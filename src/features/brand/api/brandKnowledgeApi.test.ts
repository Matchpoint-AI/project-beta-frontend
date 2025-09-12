import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { brandKnowledgeApi, BrandKnowledgeData } from './brandKnowledgeApi';

// Mock getServiceURL
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'http://mock-content-gen'),
}));

// Mock fetch
global.fetch = vi.fn();

describe('brandKnowledgeApi', () => {
  const mockToken = 'mock-jwt-token';
  const mockBrandKnowledgeData: BrandKnowledgeData = {
    brand_id: 'brand-123',
    brand_name: 'Test Brand',
    personality: {
      traits: ['innovative', 'reliable'],
      tone: { formal: 'professional', casual: 'friendly' },
      voice_attributes: ['clear', 'confident'],
    },
    visual_style: {
      color_palette: ['#FF0000', '#00FF00'],
      style_tags: ['modern', 'minimalist'],
      photography_style: 'lifestyle',
      composition_preferences: ['rule-of-thirds', 'symmetrical'],
    },
    products: [
      {
        name: 'Product A',
        generic_term: 'widget',
        category: 'electronics',
        differentiators: ['high-quality', 'eco-friendly'],
        usage_context: 'daily use',
        ingredients: [{ name: 'Component X', purpose: 'main functionality' }],
      },
    ],
    approved_scenes: ['office', 'home'],
    avoid_list: ['competitors', 'negative imagery'],
    guardrails: { max_length: 100, allow_emojis: false },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create brand knowledge', async () => {
      // Arrange
      const mockResponse = { id: 'knowledge-123', ...mockBrandKnowledgeData };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.create(mockBrandKnowledgeData, mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('http://mock-content-gen/api/v1/brand-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockBrandKnowledgeData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when creation fails', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Invalid data' }),
      });

      // Act & Assert
      await expect(brandKnowledgeApi.create(mockBrandKnowledgeData, mockToken)).rejects.toThrow(
        'Invalid data'
      );
    });

    it('should use default error message when detail is missing', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      // Act & Assert
      await expect(brandKnowledgeApi.create(mockBrandKnowledgeData, mockToken)).rejects.toThrow(
        'Failed to create brand knowledge'
      );
    });
  });

  describe('update', () => {
    it('should successfully update brand knowledge', async () => {
      // Arrange
      const knowledgeId = 'knowledge-123';
      const mockResponse = { id: knowledgeId, ...mockBrandKnowledgeData };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.update(knowledgeId, mockBrandKnowledgeData, mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        `http://mock-content-gen/api/v1/brand-knowledge/${knowledgeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockBrandKnowledgeData),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when update fails', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Not found' }),
      });

      // Act & Assert
      await expect(
        brandKnowledgeApi.update('invalid-id', mockBrandKnowledgeData, mockToken)
      ).rejects.toThrow('Not found');
    });
  });

  describe('get', () => {
    it('should successfully fetch brand knowledge by ID', async () => {
      // Arrange
      const knowledgeId = 'knowledge-123';
      const mockResponse = { id: knowledgeId, ...mockBrandKnowledgeData };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.get(knowledgeId, mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        `http://mock-content-gen/api/v1/brand-knowledge/${knowledgeId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Unauthorized' }),
      });

      // Act & Assert
      await expect(brandKnowledgeApi.get('knowledge-123', mockToken)).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('getByBrandId', () => {
    it('should successfully fetch brand knowledge by brand ID', async () => {
      // Arrange
      const brandId = 'brand-123';
      const mockResponse = { id: 'knowledge-123', ...mockBrandKnowledgeData };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.getByBrandId(brandId, mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        `http://mock-content-gen/api/v1/brand-knowledge/by-brand/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return null when brand knowledge not found (404)', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Act
      const result = await brandKnowledgeApi.getByBrandId('non-existent', mockToken);

      // Assert
      expect(result).toBeNull();
    });

    it('should throw error for non-404 errors', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Server error' }),
      });

      // Act & Assert
      await expect(brandKnowledgeApi.getByBrandId('brand-123', mockToken)).rejects.toThrow(
        'Server error'
      );
    });
  });

  describe('list', () => {
    it('should successfully list brand knowledge with default pagination', async () => {
      // Arrange
      const mockResponse = {
        items: [mockBrandKnowledgeData],
        total: 1,
        limit: 10,
        offset: 0,
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.list(mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://mock-content-gen/api/v1/brand-knowledge?limit=10&offset=0',
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should list with custom pagination parameters', async () => {
      // Arrange
      const mockResponse = { items: [], total: 0, limit: 20, offset: 5 };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.list(mockToken, 20, 5);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://mock-content-gen/api/v1/brand-knowledge?limit=20&offset=5',
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when list fails', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Database error' }),
      });

      // Act & Assert
      await expect(brandKnowledgeApi.list(mockToken)).rejects.toThrow('Database error');
    });
  });

  describe('extractFromCampaign', () => {
    it('should successfully extract brand knowledge from a campaign', async () => {
      // Arrange
      const campaignId = 'campaign-123';
      const mockResponse = { extracted: true, ...mockBrandKnowledgeData };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.extractFromCampaign(campaignId, mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://mock-content-gen/api/v1/brand-knowledge/extract-from-campaign',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify({ campaign_id: campaignId }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when extraction fails', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Campaign not found' }),
      });

      // Act & Assert
      await expect(
        brandKnowledgeApi.extractFromCampaign('invalid-campaign', mockToken)
      ).rejects.toThrow('Campaign not found');
    });
  });

  describe('extractFromCampaigns', () => {
    it('should successfully extract and merge brand knowledge from multiple campaigns', async () => {
      // Arrange
      const campaignIds = ['campaign-1', 'campaign-2', 'campaign-3'];
      const mockResponse = { merged: true, ...mockBrandKnowledgeData };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.extractFromCampaigns(campaignIds, mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://mock-content-gen/api/v1/brand-knowledge/extract-from-campaigns',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify({ campaign_ids: campaignIds }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty campaign array', async () => {
      // Arrange
      const mockResponse = { items: [] };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.extractFromCampaigns([], mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://mock-content-gen/api/v1/brand-knowledge/extract-from-campaigns',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify({ campaign_ids: [] }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should successfully delete brand knowledge', async () => {
      // Arrange
      const knowledgeId = 'knowledge-123';
      const mockResponse = { message: 'Deleted successfully' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.delete(knowledgeId, mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        `http://mock-content-gen/api/v1/brand-knowledge/${knowledgeId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when deletion fails', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Permission denied' }),
      });

      // Act & Assert
      await expect(brandKnowledgeApi.delete('knowledge-123', mockToken)).rejects.toThrow(
        'Permission denied'
      );
    });
  });

  describe('getSummary', () => {
    it('should successfully fetch summary statistics', async () => {
      // Arrange
      const mockResponse = {
        total_brands: 5,
        total_products: 20,
        last_updated: '2024-01-01',
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandKnowledgeApi.getSummary(mockToken);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(
        'http://mock-content-gen/api/v1/brand-knowledge/summary',
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetching summary fails', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Service unavailable' }),
      });

      // Act & Assert
      await expect(brandKnowledgeApi.getSummary(mockToken)).rejects.toThrow('Service unavailable');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Arrange
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(brandKnowledgeApi.get('knowledge-123', mockToken)).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle JSON parsing errors', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      // Act & Assert
      await expect(brandKnowledgeApi.get('knowledge-123', mockToken)).rejects.toThrow(
        'Invalid JSON'
      );
    });

    it('should handle missing error details', async () => {
      // Arrange
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => null,
      });

      // Act & Assert
      await expect(brandKnowledgeApi.create(mockBrandKnowledgeData, mockToken)).rejects.toThrow();
    });
  });
});
