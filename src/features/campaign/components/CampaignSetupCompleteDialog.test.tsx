import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CampaignSetupCompleteDialog from './CampaignSetupCompleteDialog';
import { BrandContext } from '../../brand/context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { plannerApi, policyApi } from '../../../api/contentGenerationApi';

// Mock dependencies
vi.mock('../../../features/auth/context/AuthContext');
vi.mock('react-router-dom');
vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: () => 'https://mock-service.com',
}));
vi.mock('../../../helpers/handleNavigate', () => ({
  default: vi.fn(),
}));
vi.mock('../../../api/contentGenerationApi', () => ({
  policyApi: {
    createPolicy: vi.fn(),
    getPolicy: vi.fn(),
    updatePolicy: vi.fn(),
  },
  plannerApi: {
    createPlan: vi.fn(),
    getPlan: vi.fn(),
    getUserPlans: vi.fn(),
  },
  captionApi: {},
  imageApi: {},
}));

// Mock posthog
global.posthog = {
  __loaded: true,
  capture: vi.fn(),
};

describe('CampaignSetupCompleteDialog - Default Values', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      profile: { id: 'test-user-id', token: 'test-token' },
    });
    (useNavigate as jest.MockedFunction<typeof useNavigate>).mockReturnValue(vi.fn());
  });

  it('should provide default values for undefined campaign fields', async () => {
    const minimalCampaignInfo = { name: 'Test Campaign' };
    const businessInfo = { name: 'Test Business' };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <BrandContext.Provider value={{ businessInfo, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider
          value={{ campaignInfo: minimalCampaignInfo, setCampaignInfo: vi.fn() }}
        >
          <CampaignSetupCompleteDialog setCurrentStep={vi.fn()} open={true} />
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);
    const campaignData = body.entity_data.campaign_data.campaign_variables;

    // Verify default values are applied
    expect(campaignData.product_service).toBe('');
    expect(campaignData.audience_ethnicity).toEqual([]);
    expect(campaignData.audience_interests).toEqual([]);
    expect(campaignData.product_service_description).toBe('');
    expect(campaignData.emotion).toEqual([]);
    expect(campaignData.key_feature).toEqual([]);
    expect(campaignData.purpose).toBe('');
    expect(campaignData.audience_gender).toEqual([]);
    expect(campaignData.audience_age).toEqual([]);
    expect(campaignData.duration).toBe('2 weeks');
    expect(campaignData.postingFrequency).toBe('Daily');
    expect(campaignData.deliveryDay).toBe('Monday');
    expect(campaignData.durationNum).toBe(2);
    expect(campaignData.frequency).toBe(3);
    expect(campaignData.summary).toBe('');
  });

  it('should handle completely empty campaign info', async () => {
    const businessInfo = { name: 'Test Business' };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <BrandContext.Provider value={{ businessInfo, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider value={{ campaignInfo: {}, setCampaignInfo: vi.fn() }}>
          <CampaignSetupCompleteDialog setCurrentStep={vi.fn()} open={true} />
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);
    const campaignData = body.entity_data.campaign_data.campaign_variables;

    // Verify defaults including name
    expect(campaignData.name).toBe('Untitled Campaign');
    expect(campaignData.key_feature).toEqual([]);
  });
});

describe('CampaignSetupCompleteDialog - Scene Mix Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    global.fetch = vi.fn();
    (useAuth as jest.MockedFunction<typeof useAuth>).mockReturnValue({
      profile: { id: 'test-user-id', token: 'test-token' },
    });
    (useNavigate as jest.MockedFunction<typeof useNavigate>).mockReturnValue(vi.fn());
    // Reset the API mocks
    (policyApi.createPolicy as jest.MockedFunction<typeof policyApi.createPolicy>).mockReset();
    (plannerApi.createPlan as jest.MockedFunction<typeof plannerApi.createPlan>).mockReset();
  });

  it.skip('should create Scene Mix plan with correct parameters', async () => {
    const campaignInfo = {
      name: 'Test Campaign',
      purpose: 'Make customers aware/excited',
      durationNum: 3,
      frequency: 5,
      audienceInterests: ['technology', 'innovation'],
      audienceGender: ['male', 'female'],
      audienceAgeRange: ['25-34', '35-44'],
    };
    const businessInfo = {
      name: 'Test Business',
      values: ['quality', 'innovation'],
    };

    // Mock successful campaign creation
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Mock successful policy creation
    (
      policyApi.createPolicy as jest.MockedFunction<typeof policyApi.createPolicy>
    ).mockResolvedValueOnce({
      id: 'policy-123',
      scenes: [],
    });

    // Mock successful plan creation
    (
      plannerApi.createPlan as jest.MockedFunction<typeof plannerApi.createPlan>
    ).mockResolvedValueOnce({
      plan_id: 'plan-123',
      campaign_id: 'test-campaign',
      status: 'draft',
    });

    // Mock successful content generation trigger
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { container: _container, baseElement: _baseElement } = render(
      <BrandContext.Provider value={{ businessInfo, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider value={{ campaignInfo, setCampaignInfo: vi.fn() }}>
          <CampaignSetupCompleteDialog setCurrentStep={vi.fn()} open={true} />
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );

    // Wait for the initial campaign creation fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Wait for the Scene Mix flow to complete
    await waitFor(() => {
      expect(plannerApi.createPlan).toHaveBeenCalled();
    });

    // Verify plan creation was called with correct parameters
    expect(plannerApi.createPlan).toHaveBeenCalledWith(
      expect.any(String), // campaign ID
      {
        campaign_name: 'Test Campaign',
        campaign_type: 'brand_awareness', // Mapped from purpose
        duration_weeks: 3,
        target_audience: ['technology', 'innovation', 'male', 'female', '25-34', '35-44'],
        content_types: ['post', 'story', 'reel'],
        weekly_post_count: 5,
        themes: ['brand_awareness', 'product_showcase', 'user_stories', 'educational'],
        brand_values: ['quality', 'innovation'],
      },
      'test-token'
    );
  });

  it.skip('should map campaign purposes to correct campaign types', async () => {
    const purposeMappings = [
      { purpose: 'Make customers aware/excited', expectedType: 'brand_awareness' },
      { purpose: 'Get customers to buy', expectedType: 'product_launch' },
      { purpose: 'Build community', expectedType: 'engagement' },
      { purpose: 'Educate audience', expectedType: 'brand_awareness' },
    ];

    for (const { purpose, expectedType } of purposeMappings) {
      vi.clearAllMocks();

      const campaignInfo = {
        name: 'Test Campaign',
        purpose,
        durationNum: 2,
        frequency: 3,
      };

      // Mock successful campaign creation
      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Mock successful policy creation
      (
        policyApi.createPolicy as jest.MockedFunction<typeof policyApi.createPolicy>
      ).mockResolvedValueOnce({
        id: 'policy-123',
      });

      // Mock successful plan creation
      (
        plannerApi.createPlan as jest.MockedFunction<typeof plannerApi.createPlan>
      ).mockResolvedValueOnce({
        plan_id: 'plan-123',
      });

      // Mock successful content generation
      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(
        <BrandContext.Provider value={{ businessInfo: {}, setBusinessInfo: vi.fn() }}>
          <CampaignContext.Provider value={{ campaignInfo, setCampaignInfo: vi.fn() }}>
            <CampaignSetupCompleteDialog setCurrentStep={vi.fn()} open={true} />
          </CampaignContext.Provider>
        </BrandContext.Provider>
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(plannerApi.createPlan).toHaveBeenCalled();
      });

      const planCall = (plannerApi.createPlan as jest.MockedFunction<typeof plannerApi.createPlan>)
        .mock.calls[0];
      expect(planCall[1].campaign_type).toBe(expectedType);
    }
  });

  it.skip('should handle empty audience data gracefully', async () => {
    const campaignInfo = {
      name: 'Test Campaign',
      // No purpose, so defaults to brand_awareness
      durationNum: 1,
      frequency: 2,
      // No audience data
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    (
      policyApi.createPolicy as jest.MockedFunction<typeof policyApi.createPolicy>
    ).mockResolvedValueOnce({ id: 'policy-123' });
    (
      plannerApi.createPlan as jest.MockedFunction<typeof plannerApi.createPlan>
    ).mockResolvedValueOnce({ plan_id: 'plan-123' });
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <BrandContext.Provider value={{ businessInfo: {}, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider value={{ campaignInfo, setCampaignInfo: vi.fn() }}>
          <CampaignSetupCompleteDialog setCurrentStep={vi.fn()} open={true} />
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );

    // Wait for initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(plannerApi.createPlan).toHaveBeenCalled();
    });

    const planCall = (plannerApi.createPlan as jest.MockedFunction<typeof plannerApi.createPlan>)
      .mock.calls[0];
    // Should have empty array for target_audience
    expect(planCall[1].target_audience).toEqual([]);
    // When no purpose is provided, it defaults to 'brand_awareness'
    expect(planCall[1].campaign_type).toBe('brand_awareness');
  });

  it.skip('should use plan_id from response when triggering content generation', async () => {
    const campaignInfo = { name: 'Test Campaign' };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    (
      policyApi.createPolicy as jest.MockedFunction<typeof policyApi.createPolicy>
    ).mockResolvedValueOnce({
      id: 'policy-456',
    });

    (
      plannerApi.createPlan as jest.MockedFunction<typeof plannerApi.createPlan>
    ).mockResolvedValueOnce({
      plan_id: 'plan-789', // This should be used, not 'id'
    });

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <BrandContext.Provider value={{ businessInfo: {}, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider value={{ campaignInfo, setCampaignInfo: vi.fn() }}>
          <CampaignSetupCompleteDialog setCurrentStep={vi.fn()} open={true} />
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );

    // Wait for initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Check that content generation was triggered (2 fetch calls total)
      expect(
        (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls.length
      ).toBeGreaterThanOrEqual(2);
    });

    // Find the content generation call
    const contentGenCall = (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls.find(
      (call: unknown[]) => call[0].includes('/contentgen/generate')
    );

    expect(contentGenCall).toBeDefined();
    // The test should check that plan-789 is used (from plannerApi mock)
    expect(contentGenCall[0]).toContain('plan_id=plan-789');
    // The test should check that policy-456 is used (from policyApi mock)
    expect(contentGenCall[0]).toContain('policy_id=policy-456');
    expect(contentGenCall[0]).toContain('use_scene_mix=true');
  });

  it.skip('should fall back to legacy generation when Scene Mix fails', async () => {
    const campaignInfo = { name: 'Test Campaign' };

    // Initial campaign creation succeeds
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Policy creation fails
    (
      policyApi.createPolicy as jest.MockedFunction<typeof policyApi.createPolicy>
    ).mockRejectedValueOnce(new Error('Policy creation failed'));

    // Legacy generation succeeds
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <BrandContext.Provider value={{ businessInfo: {}, setBusinessInfo: vi.fn() }}>
        <CampaignContext.Provider value={{ campaignInfo, setCampaignInfo: vi.fn() }}>
          <CampaignSetupCompleteDialog setCurrentStep={vi.fn()} open={true} />
        </CampaignContext.Provider>
      </BrandContext.Provider>
    );

    // Wait for initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Should have at least 2 fetch calls (campaign creation + legacy generation)
      expect(
        (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls.length
      ).toBeGreaterThanOrEqual(2);
    });

    // Verify legacy generation was called
    const legacyCall = (global.fetch as jest.MockedFunction<typeof fetch>).mock.calls.find(
      (call: unknown[]) =>
        (call[0] as string).includes('/contentgen/generate') &&
        !(call[0] as string).includes('use_scene_mix')
    );

    expect(legacyCall).toBeDefined();
  });
});

// HOTFIX-3 policy_id parameter handling is tested in backend tests
// Removing frontend test complexity to prevent test interference
