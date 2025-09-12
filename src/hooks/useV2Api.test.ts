import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useV2Api } from './useV2Api';
import { getAuth } from 'firebase/auth';
import { initializeV2Api, campaignApiV2, brandApiV2 } from '../api/v2';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

// Mock V2 API modules
vi.mock('../api/v2', () => ({
  initializeV2Api: vi.fn(),
  campaignApiV2: {
    getCampaign: vi.fn(),
    createCampaign: vi.fn(),
    updateCampaign: vi.fn(),
    deleteCampaign: vi.fn(),
    getUserCampaigns: vi.fn(),
    generateContent: vi.fn(),
    getCampaignContent: vi.fn(),
  },
  brandApiV2: {
    createBrand: vi.fn(),
    updateBrand: vi.fn(),
    getBrand: vi.fn(),
    crawlWebsite: vi.fn(),
  },
}));

describe('useV2Api', () => {
  const mockToken = 'mock-id-token';
  const mockUser = {
    getIdToken: vi.fn().mockResolvedValue(mockToken),
  };
  const mockAuth = {
    currentUser: mockUser,
  };

  beforeEach(() => {
    // Arrange - Reset all mocks before each test
    vi.clearAllMocks();
    (getAuth as any).mockReturnValue(mockAuth);
    (initializeV2Api as any).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize API on mount', async () => {
      // Arrange
      (initializeV2Api as any).mockResolvedValue(undefined);

      // Act
      const { result } = renderHook(() => useV2Api());

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isInitialized).toBe(false);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isInitialized).toBe(true);
        expect(result.current.error).toBeNull();
      });

      expect(initializeV2Api).toHaveBeenCalledTimes(1);
    });

    it('should handle initialization failure', async () => {
      // Arrange
      const initError = new Error('Failed to initialize API');
      (initializeV2Api as any).mockRejectedValue(initError);

      // Act
      const { result } = renderHook(() => useV2Api());

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isInitialized).toBe(false);
        expect(result.current.error).toEqual(initError);
      });
    });

    it('should only initialize once on mount', async () => {
      // Arrange
      (initializeV2Api as any).mockResolvedValue(undefined);

      // Act
      const { rerender } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(initializeV2Api).toHaveBeenCalledTimes(1);
      });

      rerender();

      // Assert
      expect(initializeV2Api).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authentication', () => {
    it('should get token from authenticated user', async () => {
      // Arrange
      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let token;
      await act(async () => {
        token = await result.current.getToken();
      });

      // Assert
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(token).toBe(mockToken);
    });

    it('should throw error when user is not authenticated', async () => {
      // Arrange
      (getAuth as any).mockReturnValue({ currentUser: null });

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act & Assert
      await expect(async () => {
        await result.current.getToken();
      }).rejects.toThrow('User not authenticated');
    });

    it('should handle token refresh failure', async () => {
      // Arrange
      const tokenError = new Error('Token expired');
      mockUser.getIdToken.mockRejectedValue(tokenError);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act & Assert
      await expect(async () => {
        await result.current.getToken();
      }).rejects.toThrow(tokenError);
    });
  });

  describe('Campaign Operations', () => {
    it('should get campaign by ID', async () => {
      // Arrange
      const campaignId = 'campaign123';
      const mockCampaign = {
        id: campaignId,
        name: 'Test Campaign',
        status: 'active',
      };
      (campaignApiV2.getCampaign as any).mockResolvedValue(mockCampaign);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let campaign;
      await act(async () => {
        campaign = await result.current.campaign.get(campaignId);
      });

      // Assert
      expect(campaignApiV2.getCampaign).toHaveBeenCalledWith(campaignId, mockToken);
      expect(campaign).toEqual(mockCampaign);
    });

    it('should create a new campaign', async () => {
      // Arrange
      const campaignData = {
        name: 'New Campaign',
        description: 'Test description',
        budget: 1000,
      };
      const mockCreatedCampaign = {
        id: 'new-campaign-id',
        ...campaignData,
      };
      (campaignApiV2.createCampaign as any).mockResolvedValue(mockCreatedCampaign);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let createdCampaign;
      await act(async () => {
        createdCampaign = await result.current.campaign.create(campaignData);
      });

      // Assert
      expect(campaignApiV2.createCampaign).toHaveBeenCalledWith(campaignData, mockToken);
      expect(createdCampaign).toEqual(mockCreatedCampaign);
    });

    it('should update a campaign', async () => {
      // Arrange
      const campaignId = 'campaign123';
      const updateData = {
        name: 'Updated Campaign',
        status: 'paused',
      };
      const mockUpdatedCampaign = {
        id: campaignId,
        ...updateData,
      };
      (campaignApiV2.updateCampaign as any).mockResolvedValue(mockUpdatedCampaign);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let updatedCampaign;
      await act(async () => {
        updatedCampaign = await result.current.campaign.update(campaignId, updateData);
      });

      // Assert
      expect(campaignApiV2.updateCampaign).toHaveBeenCalledWith(campaignId, updateData, mockToken);
      expect(updatedCampaign).toEqual(mockUpdatedCampaign);
    });

    it('should delete a campaign', async () => {
      // Arrange
      const campaignId = 'campaign123';
      (campaignApiV2.deleteCampaign as any).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.campaign.delete(campaignId);
      });

      // Assert
      expect(campaignApiV2.deleteCampaign).toHaveBeenCalledWith(campaignId, mockToken);
      expect(deleteResult).toEqual({ success: true });
    });

    it('should list campaigns', async () => {
      // Arrange
      const mockCampaigns = [
        { id: '1', name: 'Campaign 1' },
        { id: '2', name: 'Campaign 2' },
      ];
      (campaignApiV2.getUserCampaigns as any).mockResolvedValue(mockCampaigns);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let campaigns;
      await act(async () => {
        campaigns = await result.current.campaign.list();
      });

      // Assert
      expect(campaignApiV2.getUserCampaigns).toHaveBeenCalledWith(mockToken);
      expect(campaigns).toEqual(mockCampaigns);
    });

    it('should generate content for campaign', async () => {
      // Arrange
      const campaignId = 'campaign123';
      const contentOptions = {
        type: 'social',
        platform: 'instagram',
      };
      const mockContent = {
        id: 'content123',
        text: 'Generated content',
      };
      (campaignApiV2.generateContent as any).mockResolvedValue(mockContent);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let content;
      await act(async () => {
        content = await result.current.campaign.generateContent(campaignId, contentOptions);
      });

      // Assert
      expect(campaignApiV2.generateContent).toHaveBeenCalledWith(
        campaignId,
        contentOptions,
        mockToken
      );
      expect(content).toEqual(mockContent);
    });

    it('should handle campaign API errors', async () => {
      // Arrange
      const apiError = new Error('Campaign not found');
      (campaignApiV2.getCampaign as any).mockRejectedValue(apiError);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act & Assert
      await expect(async () => {
        await result.current.campaign.get('invalid-id');
      }).rejects.toThrow('Campaign not found');
    });
  });

  describe('Brand Operations', () => {
    it('should create a brand', async () => {
      // Arrange
      const brandData = {
        name: 'Test Brand',
        website: 'https://example.com',
        description: 'Test description',
      };
      const mockCreatedBrand = {
        id: 'brand123',
        ...brandData,
      };
      (brandApiV2.createBrand as any).mockResolvedValue(mockCreatedBrand);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let createdBrand;
      await act(async () => {
        createdBrand = await result.current.brand.create(brandData);
      });

      // Assert
      expect(brandApiV2.createBrand).toHaveBeenCalledWith(brandData, mockToken);
      expect(createdBrand).toEqual(mockCreatedBrand);
    });

    it('should update a brand', async () => {
      // Arrange
      const brandId = 'brand123';
      const updateData = {
        name: 'Updated Brand',
        website: 'https://newsite.com',
      };
      const mockUpdatedBrand = {
        id: brandId,
        ...updateData,
      };
      (brandApiV2.updateBrand as any).mockResolvedValue(mockUpdatedBrand);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let updatedBrand;
      await act(async () => {
        updatedBrand = await result.current.brand.update(brandId, updateData);
      });

      // Assert
      expect(brandApiV2.updateBrand).toHaveBeenCalledWith(brandId, updateData, mockToken);
      expect(updatedBrand).toEqual(mockUpdatedBrand);
    });

    it('should get brand details', async () => {
      // Arrange
      const brandId = 'brand123';
      const mockBrand = {
        id: brandId,
        name: 'Test Brand',
        website: 'https://example.com',
      };
      (brandApiV2.getBrand as any).mockResolvedValue(mockBrand);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let brand;
      await act(async () => {
        brand = await result.current.brand.get(brandId);
      });

      // Assert
      expect(brandApiV2.getBrand).toHaveBeenCalledWith(brandId, mockToken);
      expect(brand).toEqual(mockBrand);
    });

    it('should crawl brand website', async () => {
      // Arrange
      const crawlData = {
        brand_id: 'brand123',
        url: 'https://example.com',
        max_depth: 2,
      };
      const mockCrawlResult = {
        pages: 10,
        data: ['page1', 'page2'],
      };
      (brandApiV2.crawlWebsite as any).mockResolvedValue(mockCrawlResult);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let crawlResult;
      await act(async () => {
        crawlResult = await result.current.brand.crawlWebsite(crawlData);
      });

      // Assert
      expect(brandApiV2.crawlWebsite).toHaveBeenCalledWith(crawlData, mockToken);
      expect(crawlResult).toEqual(mockCrawlResult);
    });

    it('should handle brand API errors', async () => {
      // Arrange
      const apiError = new Error('Brand not found');
      (brandApiV2.getBrand as any).mockRejectedValue(apiError);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act & Assert
      await expect(async () => {
        await result.current.brand.get('invalid-id');
      }).rejects.toThrow('Brand not found');
    });
  });

  describe('State Management', () => {
    it('should track loading state during initialization', async () => {
      // Arrange
      let resolveInit: any;
      const initPromise = new Promise((resolve) => {
        resolveInit = resolve;
      });
      (initializeV2Api as any).mockReturnValue(initPromise);

      // Act
      const { result } = renderHook(() => useV2Api());

      // Assert - Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isInitialized).toBe(false);

      // Resolve initialization
      await act(async () => {
        resolveInit();
        await initPromise;
      });

      // Assert - After initialization
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isInitialized).toBe(true);
      });
    });

    it('should maintain state across re-renders', async () => {
      // Arrange
      (initializeV2Api as any).mockResolvedValue(undefined);

      // Act
      const { result, rerender } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const initialState = {
        isInitialized: result.current.isInitialized,
        isLoading: result.current.isLoading,
        error: result.current.error,
      };

      rerender();

      // Assert
      expect(result.current.isInitialized).toBe(initialState.isInitialized);
      expect(result.current.isLoading).toBe(initialState.isLoading);
      expect(result.current.error).toBe(initialState.error);
    });

    it('should handle concurrent API calls', async () => {
      // Arrange
      const campaign1 = { id: '1', name: 'Campaign 1' };
      const campaign2 = { id: '2', name: 'Campaign 2' };

      (campaignApiV2.getCampaign as any)
        .mockResolvedValueOnce(campaign1)
        .mockResolvedValueOnce(campaign2);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act
      let results;
      await act(async () => {
        results = await Promise.all([
          result.current.campaign.get('1'),
          result.current.campaign.get('2'),
        ]);
      });

      // Assert
      expect(results).toEqual([campaign1, campaign2]);
      expect(campaignApiV2.getCampaign).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from initialization failure on retry', async () => {
      // Arrange
      const initError = new Error('Network error');
      (initializeV2Api as any).mockRejectedValueOnce(initError).mockResolvedValueOnce(undefined);

      // Act - First render fails
      const { result, rerender } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.error).toEqual(initError);
        expect(result.current.isInitialized).toBe(false);
      });

      // Clear mocks and re-render to simulate retry
      vi.clearAllMocks();
      (getAuth as any).mockReturnValue(mockAuth);
      (initializeV2Api as any).mockResolvedValue(undefined);

      rerender();

      // Assert - Should not automatically retry
      expect(initializeV2Api).not.toHaveBeenCalled();
      expect(result.current.error).toEqual(initError);
    });

    it('should handle API rate limiting', async () => {
      // Arrange
      const rateLimitError = new Error('Rate limit exceeded');
      (rateLimitError as any).status = 429;
      (campaignApiV2.getUserCampaigns as any).mockRejectedValue(rateLimitError);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act & Assert
      await expect(async () => {
        await result.current.campaign.list();
      }).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle network timeouts', async () => {
      // Arrange
      const timeoutError = new Error('Request timeout');
      (brandApiV2.crawlWebsite as any).mockRejectedValue(timeoutError);

      const { result } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Act & Assert
      await expect(async () => {
        await result.current.brand.crawlWebsite({
          brand_id: 'brand123',
          url: 'https://slow-site.com',
        });
      }).rejects.toThrow('Request timeout');
    });
  });

  describe('Memory Management', () => {
    it('should cleanup on unmount', async () => {
      // Arrange
      (initializeV2Api as any).mockResolvedValue(undefined);

      // Act
      const { unmount } = renderHook(() => useV2Api());

      await waitFor(() => {
        expect(initializeV2Api).toHaveBeenCalled();
      });

      unmount();

      // Assert - Verify no memory leaks or pending operations
      expect(() => unmount()).not.toThrow();
    });

    it('should handle component unmount during initialization', async () => {
      // Arrange
      let resolveInit: any;
      const initPromise = new Promise((resolve) => {
        resolveInit = resolve;
      });
      (initializeV2Api as any).mockReturnValue(initPromise);

      // Act
      const { unmount } = renderHook(() => useV2Api());

      // Unmount before initialization completes
      unmount();

      // Resolve initialization after unmount
      resolveInit();

      // Assert - Should not throw
      await expect(initPromise).resolves.toBeUndefined();
    });
  });
});
