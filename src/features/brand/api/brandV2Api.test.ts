import { describe, it, expect, vi, beforeEach } from 'vitest';
import { brandV2Api, BrandCreate, BrandUpdate } from './brandV2Api';

// Mock getServiceURL
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'http://localhost:8000'),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('brandV2Api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('createBrand', () => {
    it('should create a brand successfully', async () => {
      // Arrange
      const brandData: BrandCreate = {
        name: 'Test Brand',
      };

      const mockResponse = {
        id: 'brand-123',
        name: 'Test Brand',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandV2Api.createBrand(brandData, 'test-token');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/v2/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify(brandData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when brand creation fails', async () => {
      // Arrange
      const brandData: BrandCreate = {
        name: 'Test Brand',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ detail: 'Invalid brand data' }),
      });

      // Act & Assert
      await expect(brandV2Api.createBrand(brandData, 'test-token')).rejects.toThrow(
        'Invalid brand data'
      );
    });
  });

  describe('getBrand', () => {
    it('should get a brand by ID successfully', async () => {
      // Arrange
      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrand,
      });

      // Act
      const result = await brandV2Api.getBrand('brand-123', 'test-token');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/v2/brands/brand-123', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockBrand);
    });

    it('should throw error when brand not found', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ detail: 'Brand not found' }),
      });

      // Act & Assert
      await expect(brandV2Api.getBrand('brand-123', 'test-token')).rejects.toThrow(
        'Brand not found'
      );
    });
  });

  describe('listBrands', () => {
    it('should list brands successfully', async () => {
      // Arrange
      const mockBrands = [
        {
          id: 'brand-1',
          name: 'Brand 1',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'brand-2',
          name: 'Brand 2',
          status: 'inactive',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBrands,
      });

      // Act
      const result = await brandV2Api.listBrands('test-token');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/v2/brands', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockBrands);
    });
  });

  describe('updateBrand', () => {
    it('should update a brand successfully', async () => {
      // Arrange
      const updateData: BrandUpdate = {
        name: 'Updated Brand',
        status: 'inactive',
      };

      const mockResponse = {
        id: 'brand-123',
        name: 'Updated Brand',
        status: 'inactive',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await brandV2Api.updateBrand('brand-123', updateData, 'test-token');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/v2/brands/brand-123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getKnowledge', () => {
    it('should get brand knowledge successfully', async () => {
      // Arrange
      const mockKnowledge = {
        brandId: 'brand-123',
        personalityTraits: ['innovative', 'reliable'],
        toneAttributes: { formality: 'casual', enthusiasm: 'high' },
        colorPalette: ['#FF6B35', '#004E89'],
        products: [{ name: 'Product A', category: 'software' }],
        brandDescription: 'Test brand description',
        valueProposition: 'Test value proposition',
        targetAudience: 'Test target audience',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockKnowledge,
      });

      // Act
      const result = await brandV2Api.getKnowledge('brand-123', 'test-token');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v2/brands/brand-123/knowledge',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        }
      );
      expect(result).toEqual(mockKnowledge);
    });

    it('should handle fetch error gracefully', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(brandV2Api.getKnowledge('brand-123', 'test-token')).rejects.toThrow();
    });
  });

  describe('createWorkflow', () => {
    it('should create a workflow successfully', async () => {
      // Arrange
      const workflowData = {
        sources: ['https://example.com'],
        maxPages: 50,
      };

      const mockWorkflow = {
        workflowId: 'workflow-123',
        brandId: 'brand-123',
        status: 'running',
        sources: ['https://example.com'],
        createdAt: '2024-01-01T00:00:00Z',
        pagesCrawled: 0,
        currentStep: 'crawling',
        progress: 0,
        pagesProcessed: 0,
        totalPages: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWorkflow,
      });

      // Act
      const result = await brandV2Api.createWorkflow('brand-123', workflowData, 'test-token');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v2/brands/brand-123/workflows',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
          body: JSON.stringify(workflowData),
        }
      );
      expect(result).toEqual(mockWorkflow);
    });
  });

  describe('getWorkflow', () => {
    it('should get workflow status successfully', async () => {
      // Arrange
      const mockWorkflow = {
        workflowId: 'workflow-123',
        brandId: 'brand-123',
        status: 'completed',
        sources: ['https://example.com'],
        createdAt: '2024-01-01T00:00:00Z',
        pagesCrawled: 25,
        currentStep: 'completed',
        progress: 100,
        pagesProcessed: 25,
        totalPages: 50,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWorkflow,
      });

      // Act
      const result = await brandV2Api.getWorkflow('brand-123', 'test-token');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v2/brands/brand-123/workflows',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        }
      );
      expect(result).toEqual(mockWorkflow);
    });
  });
});
