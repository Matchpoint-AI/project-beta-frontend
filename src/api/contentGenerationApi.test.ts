import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captionApi, plannerApi, policyApi } from './contentGenerationApi';

// Mock getServiceURL
vi.mock('../shared/utils/getServiceURL', () => ({
  getServiceURL: () => 'https://mock-service.com',
}));

describe('contentGenerationApi', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  describe('captionApi', () => {
    describe('generateCaptions', () => {
      it('should include content_id in request body', async () => {
        const mockResponse = {
          success: true,
          captions: [{ text: 'Test caption', score: 0.9 }],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        await captionApi.generateCaptions(
          'content-123',
          {
            image_description: 'A beautiful product shot',
            scene_type: 'product',
            brand_voice: 'Professional',
            target_audience: 'Young professionals',
          },
          'test-token'
        );

        expect(mockFetch).toHaveBeenCalledWith(
          'https://mock-service.com/api/v1/content/content-123/captions',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer test-token',
            },
            body: expect.stringContaining('"content_id":"content-123"'),
          })
        );
      });

      it('should transform hashtags to hashtag_preferences', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await captionApi.generateCaptions(
          'content-123',
          {
            image_description: 'Test',
            scene_type: 'lifestyle',
            hashtags: ['#brand', '#product', '#lifestyle'],
          },
          'test-token'
        );

        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);

        expect(body.hashtag_preferences).toEqual({
          suggested: ['#brand', '#product', '#lifestyle'],
          count: 3,
        });
      });

      it('should convert max_length to caption_length', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        // Test long caption
        await captionApi.generateCaptions(
          'content-123',
          {
            image_description: 'Test',
            scene_type: 'product',
            max_length: 2000,
          },
          'test-token'
        );

        let body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.caption_length).toBe('long');

        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        // Test short caption
        await captionApi.generateCaptions(
          'content-123',
          {
            image_description: 'Test',
            scene_type: 'product',
            max_length: 300,
          },
          'test-token'
        );

        body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.caption_length).toBe('short');

        mockFetch.mockClear();
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        // Test medium caption
        await captionApi.generateCaptions(
          'content-123',
          {
            image_description: 'Test',
            scene_type: 'product',
            max_length: 800,
          },
          'test-token'
        );

        body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.caption_length).toBe('medium');
      });

      it('should map include_cta to include_call_to_action', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await captionApi.generateCaptions(
          'content-123',
          {
            image_description: 'Test',
            scene_type: 'product',
            include_cta: false,
          },
          'test-token'
        );

        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.include_call_to_action).toBe(false);
      });

      it('should convert tone to custom_instructions', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await captionApi.generateCaptions(
          'content-123',
          {
            image_description: 'Test',
            scene_type: 'product',
            tone: 'playful',
          },
          'test-token'
        );

        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.custom_instructions).toBe('Use a playful tone.');
      });

      it('should handle API errors', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Unprocessable Entity',
        });

        await expect(
          captionApi.generateCaptions(
            'content-123',
            {
              image_description: 'Test',
              scene_type: 'product',
            },
            'test-token'
          )
        ).rejects.toThrow('Caption generation failed: Unprocessable Entity');
      });
    });

    describe('regenerateCaption', () => {
      it('should include content_id and caption_id in request body', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await captionApi.regenerateCaption(
          'content-123',
          'caption-456',
          {
            style: 'different',
            preserve_hashtags: true,
          },
          'test-token'
        );

        const body = JSON.parse(mockFetch.mock.calls[0][1].body);

        expect(body.content_id).toBe('content-123');
        expect(body.caption_id).toBe('caption-456');
        expect(body.feedback).toBe('Make it different');
        expect(body.preserve_elements).toEqual(['hashtags']);
      });

      it('should convert style to feedback message', async () => {
        const styleMappings = [
          { style: 'shorter', expectedFeedback: 'Make it shorter' },
          { style: 'longer', expectedFeedback: 'Make it longer' },
          { style: 'different', expectedFeedback: 'Make it different' },
          { style: 'similar', expectedFeedback: 'Generate a similar caption' },
        ];

        for (const { style, expectedFeedback } of styleMappings) {
          mockFetch.mockClear();
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
          });

          await captionApi.regenerateCaption(
            'content-123',
            'caption-456',
            { style: style as 'similar' | 'different' | 'shorter' | 'longer' },
            'test-token'
          );

          const body = JSON.parse(mockFetch.mock.calls[0][1].body);
          expect(body.feedback).toBe(expectedFeedback);
        }
      });

      it('should use custom_instruction as feedback when provided', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await captionApi.regenerateCaption(
          'content-123',
          'caption-456',
          {
            custom_instruction: 'Make it more engaging with emojis',
          },
          'test-token'
        );

        const body = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(body.feedback).toBe('Make it more engaging with emojis');
      });
    });
  });

  describe('plannerApi', () => {
    describe('createPlan', () => {
      it('should send correct request with all required fields', async () => {
        const mockResponse = {
          plan_id: 'test-plan-id',
          campaign_id: 'test-campaign',
          campaign_name: 'Test Campaign',
          status: 'draft',
          created_at: '2025-01-23T00:00:00Z',
          updated_at: '2025-01-23T00:00:00Z',
          duration_weeks: 2,
          total_content_slots: 6,
          content_schedule: [],
          metrics: {
            estimated_reach: 6000,
            estimated_engagement_rate: 0.68,
            content_diversity_score: 0.85,
            brand_alignment_score: 0.92,
          },
          optimization_score: 0.87,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const campaignId = 'test-campaign';
        const planData = {
          campaign_name: 'Test Campaign',
          campaign_type: 'brand_awareness' as const,
          duration_weeks: 2,
          target_audience: ['millennials', 'gen-z'],
          content_types: ['post', 'story', 'reel'],
          weekly_post_count: 3,
          themes: ['brand_awareness', 'product_showcase'],
          brand_values: ['innovation', 'quality'],
        };
        const token = 'test-token';

        const result = await plannerApi.createPlan(campaignId, planData, token);

        // Verify fetch was called with correct parameters
        expect(mockFetch).toHaveBeenCalledWith(
          'https://mock-service.com/api/v1/campaigns/test-campaign/plan',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer test-token',
            },
            body: JSON.stringify(planData),
          }
        );

        expect(result).toEqual(mockResponse);
      });

      it('should handle only required fields', async () => {
        const mockResponse = { plan_id: 'test-plan-id' };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

        const planData = {
          campaign_name: 'Minimal Campaign',
          campaign_type: 'product_launch' as const,
          duration_weeks: 1,
          target_audience: ['general'],
        };

        await plannerApi.createPlan('campaign-id', planData, 'token');

        const fetchCall = mockFetch.mock.calls[0];
        const body = JSON.parse(fetchCall[1].body);

        // Verify required fields are present
        expect(body.campaign_name).toBe('Minimal Campaign');
        expect(body.campaign_type).toBe('product_launch');
        expect(body.duration_weeks).toBe(1);
        expect(body.target_audience).toEqual(['general']);

        // Optional fields should be undefined (not sent)
        expect(body.content_types).toBeUndefined();
        expect(body.weekly_post_count).toBeUndefined();
        expect(body.themes).toBeUndefined();
        expect(body.brand_values).toBeUndefined();
      });

      it('should handle all campaign types', async () => {
        const campaignTypes = [
          'product_launch',
          'brand_awareness',
          'seasonal',
          'engagement',
        ] as const;

        for (const campaignType of campaignTypes) {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ plan_id: 'test' }),
          });

          await plannerApi.createPlan(
            'campaign-id',
            {
              campaign_name: 'Test',
              campaign_type: campaignType,
              duration_weeks: 1,
              target_audience: ['test'],
            },
            'token'
          );

          const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
          const body = JSON.parse(lastCall[1].body);
          expect(body.campaign_type).toBe(campaignType);
        }
      });

      it('should throw error when API returns non-ok response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          statusText: 'Unprocessable Entity',
        });

        await expect(
          plannerApi.createPlan(
            'campaign-id',
            {
              campaign_name: 'Test',
              campaign_type: 'brand_awareness',
              duration_weeks: 1,
              target_audience: ['test'],
            },
            'token'
          )
        ).rejects.toThrow('Plan creation failed: Unprocessable Entity');
      });

      it('should include optional fields when provided', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ plan_id: 'test' }),
        });

        const planData = {
          campaign_name: 'Full Campaign',
          campaign_type: 'engagement' as const,
          duration_weeks: 4,
          target_audience: ['young adults', 'professionals'],
          content_types: ['post', 'story', 'reel', 'carousel'],
          weekly_post_count: 7,
          themes: ['community', 'user_stories', 'behind_the_scenes'],
          brand_values: ['authenticity', 'community', 'sustainability'],
        };

        await plannerApi.createPlan('campaign-id', planData, 'token');

        const fetchCall = mockFetch.mock.calls[0];
        const body = JSON.parse(fetchCall[1].body);

        expect(body).toEqual(planData);
      });
    });

    describe('getPlan', () => {
      it('should fetch plan with correct endpoint', async () => {
        const mockPlan = { plan_id: 'test-plan', status: 'active' };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPlan,
        });

        const result = await plannerApi.getPlan('campaign-id', 'token');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://mock-service.com/api/v1/campaigns/campaign-id/plan',
          {
            headers: {
              Authorization: 'Bearer token',
            },
          }
        );

        expect(result).toEqual(mockPlan);
      });
    });

    describe('getUserPlans', () => {
      it('should fetch user plans with correct endpoint', async () => {
        const mockPlans = [{ plan_id: 'plan1' }, { plan_id: 'plan2' }];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPlans,
        });

        const result = await plannerApi.getUserPlans('token');

        expect(mockFetch).toHaveBeenCalledWith('https://mock-service.com/api/v1/plans', {
          headers: {
            Authorization: 'Bearer token',
          },
        });

        expect(result).toEqual(mockPlans);
      });
    });
  });

  describe('policyApi', () => {
    describe('createPolicy', () => {
      it('should maintain existing policy structure', async () => {
        const mockPolicy = { id: 'policy-id', scenes: [] };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockPolicy,
        });

        const policyData = {
          campaign_id: 'campaign-id',
          intent: 'awareness' as const,
          industry: 'saas' as const,
          brand_tier: 'standard' as const,
          target_audience: { demographics: ['young adults'] },
          brand_personality: ['innovative', 'friendly'],
          product_features: ['cloud-based', 'scalable'],
        };

        const result = await policyApi.createPolicy('campaign-id', policyData, 'token');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://mock-service.com/api/v1/campaigns/campaign-id/policy',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer token',
            },
            body: JSON.stringify(policyData),
          }
        );

        expect(result).toEqual(mockPolicy);
      });
    });
  });
});
