import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFetchUserData } from './useFetchUserData';
import type { CampaignData } from './useFetchUserData';

describe('useFetchUserData (Campaign)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial stub state', () => {
    const { result } = renderHook(() => useFetchUserData());

    expect(result.current).toEqual({
      data: [],
      loading: false,
      error: null,
    });
  });

  it('should return consistent state on multiple renders', () => {
    const { result, rerender } = renderHook(() => useFetchUserData());

    const firstRender = result.current;
    rerender();
    const secondRender = result.current;

    expect(firstRender).toEqual(secondRender);
    expect(firstRender.data).toEqual([]);
    expect(firstRender.loading).toBe(false);
    expect(firstRender.error).toBeNull();
  });

  it('should have correct TypeScript types for CampaignData', () => {
    // This test ensures the interface is properly defined
    const mockCampaignData: CampaignData = {
      campaign_id: 'campaign-123',
      status: 'active',
      name: 'Test Campaign',
      duration: 30,
      thread_id: 'thread-456',
      customField: 'custom value', // Testing the [key: string]: any; property
    };

    expect(mockCampaignData.campaign_id).toBe('campaign-123');
    expect(mockCampaignData.status).toBe('active');
    expect(mockCampaignData.name).toBe('Test Campaign');
    expect(mockCampaignData.duration).toBe(30);
    expect(mockCampaignData.thread_id).toBe('thread-456');
    expect(mockCampaignData.customField).toBe('custom value');
  });

  it('should handle optional thread_id in CampaignData', () => {
    const campaignWithoutThreadId: CampaignData = {
      campaign_id: 'campaign-789',
      status: 'draft',
      name: 'Draft Campaign',
      duration: 14,
    };

    expect(campaignWithoutThreadId.thread_id).toBeUndefined();
    expect(campaignWithoutThreadId.campaign_id).toBe('campaign-789');
  });

  it('should be stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useFetchUserData());

    const initialResult = result.current;

    // Re-render multiple times
    for (let i = 0; i < 5; i++) {
      rerender();
      expect(result.current).toEqual(initialResult);
    }
  });

  // Test for the default export
  it('should export the same hook as default', async () => {
    const { result: namedExportResult } = renderHook(() => useFetchUserData());

    // Import the default export
    const defaultHook = (await import('./useFetchUserData')).default;
    const { result: defaultExportResult } = renderHook(() => defaultHook());

    expect(namedExportResult.current).toEqual(defaultExportResult.current);
  });

  // Future-proofing test for when implementation is added
  it('should be ready for future implementation', () => {
    const { result } = renderHook(() => useFetchUserData());

    // The structure should be ready for loading states and error handling
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');

    // Data should be an array (ready for campaign data)
    expect(Array.isArray(result.current.data)).toBe(true);

    // Loading should be a boolean
    expect(typeof result.current.loading).toBe('boolean');

    // Error should be nullable
    expect(result.current.error === null || result.current.error instanceof Error).toBe(true);
  });

  describe('CampaignData interface validation', () => {
    it('should accept all required fields', () => {
      const validCampaign: CampaignData = {
        campaign_id: 'valid-id',
        status: 'running',
        name: 'Valid Campaign',
        duration: 45,
      };

      // Should compile without TypeScript errors
      expect(validCampaign.campaign_id).toBeTruthy();
      expect(validCampaign.status).toBeTruthy();
      expect(validCampaign.name).toBeTruthy();
      expect(typeof validCampaign.duration).toBe('number');
    });

    it('should accept additional properties due to index signature', () => {
      const extendedCampaign: CampaignData = {
        campaign_id: 'extended-id',
        status: 'paused',
        name: 'Extended Campaign',
        duration: 60,
        // Additional properties allowed by [key: string]: any;
        priority: 'high',
        tags: ['marketing', 'social'],
        settings: {
          autoPost: true,
          timezone: 'UTC',
        },
      };

      expect(extendedCampaign.priority).toBe('high');
      expect(extendedCampaign.tags).toEqual(['marketing', 'social']);
      expect(extendedCampaign.settings).toEqual({
        autoPost: true,
        timezone: 'UTC',
      });
    });
  });
});