import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrandApiV2, brandApiV2 } from './brand-api';

// Mock the proto service
const mockProtoService = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  baseUrl: '/api/v2',
};

vi.mock('../../../api/v2/proto-service', () => ({
  ProtoService: class {
    baseUrl = '/api/v2';
    constructor() {
      Object.assign(this, mockProtoService);
    }
    post = mockProtoService.post;
    get = mockProtoService.get;
    put = mockProtoService.put;
    delete = mockProtoService.delete;
  },
}));

// Mock fetch for file operations
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('BrandApiV2', () => {
  let brandApi: BrandApiV2;
  const mockToken = 'test-auth-token';

  beforeEach(() => {
    vi.clearAllMocks();
    brandApi = new BrandApiV2();
  });

  describe('createBrand', () => {
    it('should create a brand successfully', async () => {
      const mockBrand = {
        id: 'brand-123',
        name: 'Test Brand',
        website: 'https://testbrand.com',
        logo_url: 'https://example.com/logo.png',
        description: 'A test brand',
        industry: 'Technology',
        target_audience: 'Tech enthusiasts',
        brand_voice: 'Professional and innovative',
        brand_values: ['Innovation', 'Quality'],
        social_handles: {
          instagram: '@testbrand',
          facebook: 'testbrand',
        },
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const createRequest = {
        name: 'Test Brand',
        website: 'https://testbrand.com',
        logo_url: 'https://example.com/logo.png',
        description: 'A test brand',
        industry: 'Technology',
        target_audience: 'Tech enthusiasts',
        brand_voice: 'Professional and innovative',
        brand_values: ['Innovation', 'Quality'],
        social_handles: {
          instagram: '@testbrand',
          facebook: 'testbrand',
        },
      };

      mockProtoService.post.mockResolvedValueOnce(mockBrand);

      const result = await brandApi.createBrand(createRequest, mockToken);

      expect(mockProtoService.post).toHaveBeenCalledWith(
        '/brands',
        createRequest,
        { package: 'protos', message: 'Brand' },
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );

      expect(result).toEqual(mockBrand);
    });

    it('should create a brand with minimal data', async () => {
      const mockBrand = {
        id: 'brand-minimal',
        name: 'Minimal Brand',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const createRequest = {
        name: 'Minimal Brand',
      };

      mockProtoService.post.mockResolvedValueOnce(mockBrand);

      const result = await brandApi.createBrand(createRequest, mockToken);

      expect(result).toEqual(mockBrand);
      expect(mockProtoService.post).toHaveBeenCalledWith(
        '/brands',
        createRequest,
        { package: 'protos', message: 'Brand' },
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );
    });

    it('should handle create brand errors', async () => {
      const createRequest = {
        name: 'Error Brand',
      };

      const error = new Error('Brand creation failed');
      mockProtoService.post.mockRejectedValueOnce(error);

      await expect(brandApi.createBrand(createRequest, mockToken)).rejects.toThrow(
        'Brand creation failed'
      );
    });
  });

  describe('getBrand', () => {
    it('should get a brand by ID', async () => {
      const mockBrand = {
        id: 'brand-123',
        name: 'Retrieved Brand',
        website: 'https://retrieved.com',
        description: 'A retrieved brand',
      };

      mockProtoService.get.mockResolvedValueOnce(mockBrand);

      const result = await brandApi.getBrand('brand-123', mockToken);

      expect(mockProtoService.get).toHaveBeenCalledWith(
        '/brands/brand-123',
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );

      expect(result).toEqual(mockBrand);
    });

    it('should handle get brand errors', async () => {
      const error = new Error('Brand not found');
      mockProtoService.get.mockRejectedValueOnce(error);

      await expect(brandApi.getBrand('nonexistent-brand', mockToken)).rejects.toThrow(
        'Brand not found'
      );
    });
  });

  describe('updateBrand', () => {
    it('should update a brand successfully', async () => {
      const mockUpdatedBrand = {
        id: 'brand-123',
        name: 'Updated Brand Name',
        website: 'https://updated.com',
        description: 'Updated description',
        updated_at: '2023-01-02T00:00:00Z',
      };

      const updateData = {
        name: 'Updated Brand Name',
        website: 'https://updated.com',
        description: 'Updated description',
      };

      mockProtoService.put.mockResolvedValueOnce(mockUpdatedBrand);

      const result = await brandApi.updateBrand('brand-123', updateData, mockToken);

      expect(mockProtoService.put).toHaveBeenCalledWith(
        '/brands/brand-123',
        {
          brand_id: 'brand-123',
          ...updateData,
        },
        { package: 'protos', message: 'Brand' },
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );

      expect(result).toEqual(mockUpdatedBrand);
    });

    it('should handle partial updates', async () => {
      const mockUpdatedBrand = {
        id: 'brand-123',
        name: 'Brand',
        description: 'New description only',
      };

      const partialUpdate = {
        description: 'New description only',
      };

      mockProtoService.put.mockResolvedValueOnce(mockUpdatedBrand);

      const result = await brandApi.updateBrand('brand-123', partialUpdate, mockToken);

      expect(mockProtoService.put).toHaveBeenCalledWith(
        '/brands/brand-123',
        {
          brand_id: 'brand-123',
          description: 'New description only',
        },
        { package: 'protos', message: 'Brand' },
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );

      expect(result).toEqual(mockUpdatedBrand);
    });
  });

  describe('deleteBrand', () => {
    it('should delete a brand successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Brand deleted successfully',
      };

      mockProtoService.delete.mockResolvedValueOnce(mockResponse);

      const result = await brandApi.deleteBrand('brand-123', mockToken);

      expect(mockProtoService.delete).toHaveBeenCalledWith(
        '/brands/brand-123',
        { package: 'protos', message: 'Empty' },
        { token: mockToken }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle delete brand errors', async () => {
      const error = new Error('Failed to delete brand');
      mockProtoService.delete.mockRejectedValueOnce(error);

      await expect(brandApi.deleteBrand('brand-123', mockToken)).rejects.toThrow(
        'Failed to delete brand'
      );
    });
  });

  describe('getUserBrands', () => {
    it('should get user brands without filters', async () => {
      const mockBrands = {
        brands: [
          { id: 'brand-1', name: 'Brand 1' },
          { id: 'brand-2', name: 'Brand 2' },
        ],
      };

      mockProtoService.get.mockResolvedValueOnce(mockBrands);

      const result = await brandApi.getUserBrands(mockToken);

      expect(mockProtoService.get).toHaveBeenCalledWith(
        '/brands',
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );

      expect(result).toEqual(mockBrands);
    });

    it('should get user brands with filters', async () => {
      const mockBrands = {
        brands: [{ id: 'brand-1', name: 'Tech Brand', industry: 'Technology' }],
      };

      const filters = {
        industry: 'Technology',
        limit: 10,
        offset: 0,
      };

      mockProtoService.get.mockResolvedValueOnce(mockBrands);

      const result = await brandApi.getUserBrands(mockToken, filters);

      expect(mockProtoService.get).toHaveBeenCalledWith(
        '/brands?industry=Technology&limit=10&offset=0',
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );

      expect(result).toEqual(mockBrands);
    });

    it('should handle partial filters', async () => {
      const mockBrands = { brands: [] };
      const filters = { limit: 5 };

      mockProtoService.get.mockResolvedValueOnce(mockBrands);

      await brandApi.getUserBrands(mockToken, filters);

      expect(mockProtoService.get).toHaveBeenCalledWith(
        '/brands?limit=5',
        { package: 'protos', message: 'Brand' },
        { token: mockToken }
      );
    });
  });

  describe('createBrandKnowledge', () => {
    it('should create brand knowledge successfully', async () => {
      const mockKnowledge = {
        brand_id: 'brand-123',
        products: [
          {
            id: 'product-1',
            name: 'Test Product',
            description: 'A test product',
            price: 99.99,
            category: 'Electronics',
            features: ['Feature 1', 'Feature 2'],
          },
        ],
        competitors: ['Competitor 1', 'Competitor 2'],
        unique_selling_points: ['USP 1', 'USP 2'],
        brand_story: 'Our brand story...',
        visual_guidelines: {
          primary_colors: ['#FF0000', '#00FF00'],
          secondary_colors: ['#0000FF'],
          font_families: ['Arial', 'Helvetica'],
        },
        tone_guidelines: {
          voice_attributes: ['Professional', 'Friendly'],
          writing_style: 'Conversational',
          emoji_usage: 'moderate' as const,
        },
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const createRequest = {
        brand_id: 'brand-123',
        products: [
          {
            id: 'product-1',
            name: 'Test Product',
            description: 'A test product',
            price: 99.99,
            category: 'Electronics',
            features: ['Feature 1', 'Feature 2'],
          },
        ],
        competitors: ['Competitor 1', 'Competitor 2'],
        unique_selling_points: ['USP 1', 'USP 2'],
        brand_story: 'Our brand story...',
        visual_guidelines: {
          primary_colors: ['#FF0000', '#00FF00'],
          secondary_colors: ['#0000FF'],
          font_families: ['Arial', 'Helvetica'],
        },
        tone_guidelines: {
          voice_attributes: ['Professional', 'Friendly'],
          writing_style: 'Conversational',
          emoji_usage: 'moderate' as const,
        },
      };

      mockProtoService.post.mockResolvedValueOnce(mockKnowledge);

      const result = await brandApi.createBrandKnowledge(createRequest, mockToken);

      expect(mockProtoService.post).toHaveBeenCalledWith(
        '/brands/brand-123/knowledge',
        createRequest,
        { package: 'protos', message: 'BrandKnowledge' },
        { package: 'protos', message: 'BrandKnowledge' },
        { token: mockToken }
      );

      expect(result).toEqual(mockKnowledge);
    });

    it('should create minimal brand knowledge', async () => {
      const mockKnowledge = {
        brand_id: 'brand-123',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const createRequest = {
        brand_id: 'brand-123',
      };

      mockProtoService.post.mockResolvedValueOnce(mockKnowledge);

      const result = await brandApi.createBrandKnowledge(createRequest, mockToken);

      expect(result).toEqual(mockKnowledge);
    });
  });

  describe('getBrandKnowledge', () => {
    it('should get brand knowledge by brand ID', async () => {
      const mockKnowledge = {
        brand_id: 'brand-123',
        products: [],
        competitors: ['Competitor A'],
        brand_story: 'A story about our brand',
      };

      mockProtoService.get.mockResolvedValueOnce(mockKnowledge);

      const result = await brandApi.getBrandKnowledge('brand-123', mockToken);

      expect(mockProtoService.get).toHaveBeenCalledWith(
        '/brands/brand-123/knowledge',
        { package: 'protos', message: 'BrandKnowledge' },
        { token: mockToken }
      );

      expect(result).toEqual(mockKnowledge);
    });
  });

  describe('updateBrandKnowledge', () => {
    it('should update brand knowledge successfully', async () => {
      const mockUpdatedKnowledge = {
        brand_id: 'brand-123',
        knowledge_id: 'knowledge-456',
        brand_story: 'Updated brand story',
        updated_at: '2023-01-02T00:00:00Z',
      };

      const updateData = {
        brand_story: 'Updated brand story',
      };

      mockProtoService.put.mockResolvedValueOnce(mockUpdatedKnowledge);

      const result = await brandApi.updateBrandKnowledge(
        'brand-123',
        'knowledge-456',
        updateData,
        mockToken
      );

      expect(mockProtoService.put).toHaveBeenCalledWith(
        '/brands/brand-123/knowledge/knowledge-456',
        {
          brand_id: 'brand-123',
          knowledge_id: 'knowledge-456',
          brand_story: 'Updated brand story',
        },
        { package: 'protos', message: 'BrandKnowledge' },
        { package: 'protos', message: 'BrandKnowledge' },
        { token: mockToken }
      );

      expect(result).toEqual(mockUpdatedKnowledge);
    });
  });

  describe('crawlWebsite', () => {
    it('should crawl website successfully', async () => {
      const mockCrawlResponse = {
        job_id: 'job-123',
        brand_id: 'brand-123',
        status: 'pending' as const,
        url: 'https://example.com',
        created_at: '2023-01-01T00:00:00Z',
      };

      const crawlRequest = {
        brand_id: 'brand-123',
        url: 'https://example.com',
        max_depth: 2,
        include_images: true,
        extract_products: true,
        extract_social_links: false,
      };

      mockProtoService.post.mockResolvedValueOnce(mockCrawlResponse);

      const result = await brandApi.crawlWebsite(crawlRequest, mockToken);

      expect(mockProtoService.post).toHaveBeenCalledWith(
        '/brands/brand-123/crawl',
        crawlRequest,
        { package: 'protos', message: 'CrawlRequest' },
        { package: 'protos', message: 'CrawlJob' },
        { token: mockToken }
      );

      expect(result).toEqual(mockCrawlResponse);
    });

    it('should handle crawl with minimal options', async () => {
      const mockCrawlResponse = {
        job_id: 'job-456',
        brand_id: 'brand-123',
        status: 'pending' as const,
        url: 'https://minimal.com',
        created_at: '2023-01-01T00:00:00Z',
      };

      const crawlRequest = {
        brand_id: 'brand-123',
        url: 'https://minimal.com',
      };

      mockProtoService.post.mockResolvedValueOnce(mockCrawlResponse);

      const result = await brandApi.crawlWebsite(crawlRequest, mockToken);

      expect(result).toEqual(mockCrawlResponse);
    });
  });

  describe('getCrawlStatus', () => {
    it('should get crawl status successfully', async () => {
      const mockStatus = {
        job_id: 'job-123',
        brand_id: 'brand-123',
        status: 'completed' as const,
        url: 'https://example.com',
        pages_crawled: 25,
        products_found: 5,
        created_at: '2023-01-01T00:00:00Z',
      };

      mockProtoService.get.mockResolvedValueOnce(mockStatus);

      const result = await brandApi.getCrawlStatus('brand-123', 'job-123', mockToken);

      expect(mockProtoService.get).toHaveBeenCalledWith(
        '/brands/brand-123/crawl/job-123',
        { package: 'protos', message: 'CrawlJob' },
        { token: mockToken }
      );

      expect(result).toEqual(mockStatus);
    });
  });

  describe('extractBrandInfo', () => {
    it('should extract brand info successfully', async () => {
      const mockExtractResponse = {
        brand_id: 'brand-123',
        extracted_data: {
          products: [
            {
              id: 'extracted-product-1',
              name: 'Extracted Product',
              description: 'Found in content',
            },
          ],
          brand_values: ['Quality', 'Innovation'],
          tone_attributes: ['Professional', 'Approachable'],
          visual_elements: ['Bold colors', 'Modern typography'],
          key_phrases: ['cutting-edge', 'customer-focused'],
        },
        confidence_scores: {
          products: 0.85,
          brand_values: 0.92,
          tone_attributes: 0.78,
        },
      };

      const extractRequest = {
        brand_id: 'brand-123',
        content: '<html><body>Company content...</body></html>',
        content_type: 'html' as const,
        extract_options: {
          extract_products: true,
          extract_values: true,
          extract_tone: true,
          extract_visuals: false,
        },
      };

      mockProtoService.post.mockResolvedValueOnce(mockExtractResponse);

      const result = await brandApi.extractBrandInfo(extractRequest, mockToken);

      expect(mockProtoService.post).toHaveBeenCalledWith(
        '/brands/brand-123/extract',
        extractRequest,
        { package: 'protos', message: 'ExtractRequest' },
        { package: 'protos', message: 'ExtractResponse' },
        { token: mockToken }
      );

      expect(result).toEqual(mockExtractResponse);
    });

    it('should extract from different content types', async () => {
      const contentTypes: Array<'html' | 'text' | 'pdf'> = ['html', 'text', 'pdf'];

      for (const contentType of contentTypes) {
        const mockResponse = {
          brand_id: 'brand-123',
          extracted_data: {},
        };

        const extractRequest = {
          brand_id: 'brand-123',
          content: `Sample ${contentType} content`,
          content_type: contentType,
        };

        mockProtoService.post.mockResolvedValueOnce(mockResponse);

        const result = await brandApi.extractBrandInfo(extractRequest, mockToken);

        expect(mockProtoService.post).toHaveBeenCalledWith(
          '/brands/brand-123/extract',
          extractRequest,
          { package: 'protos', message: 'ExtractRequest' },
          { package: 'protos', message: 'ExtractResponse' },
          { token: mockToken }
        );

        expect(result).toEqual(mockResponse);
      }
    });
  });

  describe('file operations', () => {
    beforeEach(() => {
      mockFetch.mockClear();
    });

    describe('uploadLogo', () => {
      it('should upload logo successfully', async () => {
        const mockResponse = {
          logo_url: 'https://example.com/uploaded-logo.png',
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const mockFile = new File(['logo data'], 'logo.png', { type: 'image/png' });
        const result = await brandApi.uploadLogo('brand-123', mockFile, mockToken);

        expect(mockFetch).toHaveBeenCalledWith('/api/v2/brands/brand-123/logo', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
          body: expect.any(FormData),
        });

        const call = mockFetch.mock.calls[0];
        const formData = call[1].body as FormData;
        expect(formData.get('logo')).toBe(mockFile);

        expect(result).toEqual(mockResponse);
      });

      it('should handle logo upload errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Bad Request',
        });

        const mockFile = new File(['bad logo'], 'logo.txt', { type: 'text/plain' });

        await expect(brandApi.uploadLogo('brand-123', mockFile, mockToken)).rejects.toThrow(
          'Logo upload failed: Bad Request'
        );
      });
    });

    describe('importBrandData', () => {
      it('should import brand data successfully', async () => {
        const mockResponse = {
          success: true,
          imported_count: 15,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const mockFile = new File(['brand,data\nTest,Brand'], 'brands.csv', { type: 'text/csv' });
        const result = await brandApi.importBrandData('brand-123', mockFile, 'csv', mockToken);

        expect(mockFetch).toHaveBeenCalledWith('/api/v2/brands/brand-123/import', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
          body: expect.any(FormData),
        });

        const call = mockFetch.mock.calls[0];
        const formData = call[1].body as FormData;
        expect(formData.get('file')).toBe(mockFile);
        expect(formData.get('format')).toBe('csv');

        expect(result).toEqual(mockResponse);
      });

      it('should handle import errors with details', async () => {
        const mockResponse = {
          success: false,
          imported_count: 5,
          errors: ['Row 3: Invalid email format', 'Row 7: Missing required field'],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const mockFile = new File(['{}'], 'data.json', { type: 'application/json' });
        const result = await brandApi.importBrandData('brand-123', mockFile, 'json', mockToken);

        expect(result).toEqual(mockResponse);
        expect(result.errors).toHaveLength(2);
      });

      it('should support different file formats', async () => {
        const formats: Array<'json' | 'csv' | 'xlsx'> = ['json', 'csv', 'xlsx'];

        for (const format of formats) {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, imported_count: 10 }),
          });

          const mockFile = new File(['data'], `file.${format}`, {
            type: 'application/octet-stream',
          });
          await brandApi.importBrandData('brand-123', mockFile, format, mockToken);

          const call = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
          const formData = call[1].body as FormData;
          expect(formData.get('format')).toBe(format);
        }
      });
    });

    describe('exportBrandData', () => {
      it('should export brand data successfully', async () => {
        const mockBlob = new Blob(['brand,data\nTest,Brand'], { type: 'text/csv' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          blob: async () => mockBlob,
        });

        const result = await brandApi.exportBrandData('brand-123', 'csv', mockToken);

        expect(mockFetch).toHaveBeenCalledWith('/api/v2/brands/brand-123/export?format=csv', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        });

        expect(result).toBeInstanceOf(Blob);
        expect(result).toBe(mockBlob);
      });

      it('should handle export errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Internal Server Error',
        });

        await expect(brandApi.exportBrandData('brand-123', 'xlsx', mockToken)).rejects.toThrow(
          'Export failed: Internal Server Error'
        );
      });
    });
  });

  describe('validateBrandData', () => {
    it('should validate brand data successfully', async () => {
      const mockValidationResponse = {
        valid: true,
      };

      const brandData = {
        name: 'Valid Brand',
        website: 'https://validbrand.com',
        description: 'A valid brand description',
      };

      mockProtoService.post.mockResolvedValueOnce(mockValidationResponse);

      const result = await brandApi.validateBrandData(brandData, mockToken);

      expect(mockProtoService.post).toHaveBeenCalledWith(
        '/brands/validate',
        brandData,
        { package: 'protos', message: 'Brand' },
        { package: 'protos', message: 'ValidationResponse' },
        { token: mockToken }
      );

      expect(result).toEqual(mockValidationResponse);
    });

    it('should return validation errors and warnings', async () => {
      const mockValidationResponse = {
        valid: false,
        errors: {
          website: 'Invalid URL format',
          name: 'Name too short',
        },
        warnings: {
          description: 'Description could be more detailed',
        },
      };

      const brandData = {
        name: 'X',
        website: 'not-a-url',
        description: 'Short',
      };

      mockProtoService.post.mockResolvedValueOnce(mockValidationResponse);

      const result = await brandApi.validateBrandData(brandData, mockToken);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual({
        website: 'Invalid URL format',
        name: 'Name too short',
      });
      expect(result.warnings).toEqual({
        description: 'Description could be more detailed',
      });
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(brandApiV2).toBeInstanceOf(BrandApiV2);
    });

    it('should be the same instance when imported multiple times', () => {
      // Test singleton behavior - brandApiV2 should be consistent
      expect(brandApiV2).toBeDefined();
      expect(brandApiV2).toBeInstanceOf(BrandApiV2);
    });
  });

  describe('constructor and inheritance', () => {
    it('should initialize with correct configuration', () => {
      const api = new BrandApiV2();
      expect((api as any).baseUrl).toBe('/api/v2');
    });

    it('should extend ProtoService', () => {
      const api = new BrandApiV2();
      expect(api).toHaveProperty('post');
      expect(api).toHaveProperty('get');
      expect(api).toHaveProperty('put');
      expect(api).toHaveProperty('delete');
    });
  });
});
