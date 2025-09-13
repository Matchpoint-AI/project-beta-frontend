import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useV2Api } from './useV2Api';

// Mock Firebase auth
const mockUser = {
  getIdToken: vi.fn(() => Promise.resolve('mock-firebase-token')),
};

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: mockUser,
  })),
}));

// Mock V2 API modules
vi.mock('../api/v2', () => {
  const mockCampaignApiV2 = {
    getCampaign: vi.fn(),
    createCampaign: vi.fn(),
    updateCampaign: vi.fn(),
    deleteCampaign: vi.fn(),
    generateContent: vi.fn(),
    getCampaignContent: vi.fn(),
    getUserCampaigns: vi.fn(),
  };

  const mockBrandApiV2 = {
    createBrand: vi.fn(),
    getBrand: vi.fn(),
    updateBrand: vi.fn(),
    deleteBrand: vi.fn(),
    getUserBrands: vi.fn(),
    crawlWebsite: vi.fn(),
    getBrandKnowledge: vi.fn(),
  };

  const mockInitializeV2Api = vi.fn();

  return {
    initializeV2Api: mockInitializeV2Api,
    campaignApiV2: mockCampaignApiV2,
    brandApiV2: mockBrandApiV2,
  };
});

describe('useV2Api', () => {
  let mockInitializeV2Api: any;
  let mockCampaignApiV2: any;
  let mockBrandApiV2: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get the mocked modules
    const mockedV2Api = await import('../api/v2');
    mockInitializeV2Api = mockedV2Api.initializeV2Api;
    mockCampaignApiV2 = mockedV2Api.campaignApiV2;
    mockBrandApiV2 = mockedV2Api.brandApiV2;

    mockInitializeV2Api.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useV2Api());

      expect(result.current.isInitialized).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should initialize V2 API successfully', async () => {
      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });

      expect(mockInitializeV2Api).toHaveBeenCalledOnce();
    });

    it('should handle initialization error', async () => {
      const initError = new Error('API initialization failed');
      mockInitializeV2Api.mockRejectedValueOnce(initError);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toEqual(initError);
      });
    });
  });

  describe('getToken', () => {
    it('should return token from Firebase user', async () => {
      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const token = await result.current.getToken();
      expect(token).toBe('mock-firebase-token');
      expect(mockUser.getIdToken).toHaveBeenCalledOnce();
    });

    it('should throw error when user is not authenticated', async () => {
      const { getAuth } = await import('firebase/auth');
      (getAuth as any).mockReturnValue({ currentUser: null });

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await expect(result.current.getToken()).rejects.toThrow('User not authenticated');
    });
  });

  describe('campaign operations', () => {
    it('should get campaign successfully', async () => {
      const mockCampaign = { id: 'campaign-1', name: 'Test Campaign' };
      mockCampaignApiV2.getCampaign.mockResolvedValue(mockCampaign);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const campaign = await result.current.campaign.get('campaign-1');

      expect(campaign).toEqual(mockCampaign);
      expect(mockCampaignApiV2.getCampaign).toHaveBeenCalledWith(
        'campaign-1',
        'mock-firebase-token'
      );
    });

    it('should create campaign successfully', async () => {
      const campaignData = { name: 'New Campaign', duration: 30 };
      const mockCreatedCampaign = { id: 'campaign-2', ...campaignData };
      mockCampaignApiV2.createCampaign.mockResolvedValue(mockCreatedCampaign);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const campaign = await result.current.campaign.create(campaignData);

      expect(campaign).toEqual(mockCreatedCampaign);
      expect(mockCampaignApiV2.createCampaign).toHaveBeenCalledWith(
        campaignData,
        'mock-firebase-token'
      );
    });

    it('should update campaign successfully', async () => {
      const updateData = { name: 'Updated Campaign' };
      const mockUpdatedCampaign = { id: 'campaign-1', ...updateData };
      mockCampaignApiV2.updateCampaign.mockResolvedValue(mockUpdatedCampaign);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const campaign = await result.current.campaign.update('campaign-1', updateData);

      expect(campaign).toEqual(mockUpdatedCampaign);
      expect(mockCampaignApiV2.updateCampaign).toHaveBeenCalledWith(
        'campaign-1',
        updateData,
        'mock-firebase-token'
      );
    });

    it('should delete campaign successfully', async () => {
      mockCampaignApiV2.deleteCampaign.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const result_delete = await result.current.campaign.delete('campaign-1');

      expect(result_delete).toEqual({ success: true });
      expect(mockCampaignApiV2.deleteCampaign).toHaveBeenCalledWith(
        'campaign-1',
        'mock-firebase-token'
      );
    });

    it('should generate content for campaign', async () => {
      const mockContent = { posts: ['Post 1', 'Post 2'] };
      const options = { tone: 'professional' };
      mockCampaignApiV2.generateContent.mockResolvedValue(mockContent);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const content = await result.current.campaign.generateContent('campaign-1', options);

      expect(content).toEqual(mockContent);
      expect(mockCampaignApiV2.generateContent).toHaveBeenCalledWith(
        'campaign-1',
        options,
        'mock-firebase-token'
      );
    });

    it('should generate content with default options', async () => {
      const mockContent = { posts: ['Post 1', 'Post 2'] };
      mockCampaignApiV2.generateContent.mockResolvedValue(mockContent);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const content = await result.current.campaign.generateContent('campaign-1');

      expect(content).toEqual(mockContent);
      expect(mockCampaignApiV2.generateContent).toHaveBeenCalledWith(
        'campaign-1',
        {},
        'mock-firebase-token'
      );
    });

    it('should get campaign content', async () => {
      const mockContent = { posts: ['Post 1', 'Post 2'] };
      mockCampaignApiV2.getCampaignContent.mockResolvedValue(mockContent);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const content = await result.current.campaign.getContent('campaign-1');

      expect(content).toEqual(mockContent);
      expect(mockCampaignApiV2.getCampaignContent).toHaveBeenCalledWith(
        'campaign-1',
        'mock-firebase-token'
      );
    });

    it('should list campaigns', async () => {
      const mockCampaigns = [{ id: 'campaign-1' }, { id: 'campaign-2' }];
      const filters = { status: 'active' };
      mockCampaignApiV2.getUserCampaigns.mockResolvedValue(mockCampaigns);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const campaigns = await result.current.campaign.list(filters);

      expect(campaigns).toEqual(mockCampaigns);
      expect(mockCampaignApiV2.getUserCampaigns).toHaveBeenCalledWith(
        'mock-firebase-token',
        filters
      );
    });
  });

  describe('brand operations', () => {
    it('should create brand successfully', async () => {
      const brandData = { name: 'Test Brand', website: 'https://test.com' };
      const mockCreatedBrand = { id: 'brand-1', ...brandData };
      mockBrandApiV2.createBrand.mockResolvedValue(mockCreatedBrand);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const brand = await result.current.brand.create(brandData as any);

      expect(brand).toEqual(mockCreatedBrand);
      expect(mockBrandApiV2.createBrand).toHaveBeenCalledWith(brandData, 'mock-firebase-token');
    });

    it('should get brand successfully', async () => {
      const mockBrand = { id: 'brand-1', name: 'Test Brand' };
      mockBrandApiV2.getBrand.mockResolvedValue(mockBrand);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const brand = await result.current.brand.get('brand-1');

      expect(brand).toEqual(mockBrand);
      expect(mockBrandApiV2.getBrand).toHaveBeenCalledWith('brand-1', 'mock-firebase-token');
    });

    it('should update brand successfully', async () => {
      const updateData = { name: 'Updated Brand' };
      const mockUpdatedBrand = { id: 'brand-1', ...updateData };
      mockBrandApiV2.updateBrand.mockResolvedValue(mockUpdatedBrand);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const brand = await result.current.brand.update('brand-1', updateData);

      expect(brand).toEqual(mockUpdatedBrand);
      expect(mockBrandApiV2.updateBrand).toHaveBeenCalledWith(
        'brand-1',
        updateData,
        'mock-firebase-token'
      );
    });

    it('should delete brand successfully', async () => {
      mockBrandApiV2.deleteBrand.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const result_delete = await result.current.brand.delete('brand-1');

      expect(result_delete).toEqual({ success: true });
      expect(mockBrandApiV2.deleteBrand).toHaveBeenCalledWith('brand-1', 'mock-firebase-token');
    });

    it('should list brands successfully', async () => {
      const mockBrands = [{ id: 'brand-1' }, { id: 'brand-2' }];
      const filters = { industry: 'tech', limit: 10 };
      mockBrandApiV2.getUserBrands.mockResolvedValue(mockBrands);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const brands = await result.current.brand.list(filters);

      expect(brands).toEqual(mockBrands);
      expect(mockBrandApiV2.getUserBrands).toHaveBeenCalledWith('mock-firebase-token', filters);
    });

    it('should crawl website successfully', async () => {
      const crawlData = { url: 'https://example.com', depth: 2 };
      const mockCrawlResult = { status: 'completed', pages: 5 };
      mockBrandApiV2.crawlWebsite.mockResolvedValue(mockCrawlResult);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const crawlResult = await result.current.brand.crawlWebsite(crawlData as any);

      expect(crawlResult).toEqual(mockCrawlResult);
      expect(mockBrandApiV2.crawlWebsite).toHaveBeenCalledWith(crawlData, 'mock-firebase-token');
    });

    it('should get brand knowledge successfully', async () => {
      const mockKnowledge = { topics: ['topic1', 'topic2'], insights: [] };
      mockBrandApiV2.getBrandKnowledge.mockResolvedValue(mockKnowledge);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const knowledge = await result.current.brand.getKnowledge('brand-1');

      expect(knowledge).toEqual(mockKnowledge);
      expect(mockBrandApiV2.getBrandKnowledge).toHaveBeenCalledWith(
        'brand-1',
        'mock-firebase-token'
      );
    });
  });

  describe('error handling', () => {
    it('should handle campaign operation errors', async () => {
      const error = new Error('API error');
      mockCampaignApiV2.getCampaign.mockRejectedValue(error);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await expect(result.current.campaign.get('campaign-1')).rejects.toThrow('API error');
    });

    it('should handle brand operation errors', async () => {
      const error = new Error('Brand API error');
      mockBrandApiV2.getBrand.mockRejectedValue(error);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await expect(result.current.brand.get('brand-1')).rejects.toThrow('Brand API error');
    });

    it('should handle token retrieval errors', async () => {
      mockUser.getIdToken.mockRejectedValue(new Error('Token error'));

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await expect(result.current.campaign.get('campaign-1')).rejects.toThrow('Token error');
    });
  });
});
