import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchCostOptimizationData,
  trackApiUsage,
  fetchModelComparison,
  exportCostData,
  updateOptimizationSettings,
  generateMockCostData,
  costOptimizationApi,
  CostOptimizationApiError,
} from './costOptimizationApi';

// Mock the auth utilities
vi.mock('../../auth/utils/authFetch', () => ({
  getAuthToken: vi.fn(),
}));

// Mock environment variables
vi.mock('./costOptimizationApi', async () => {
  const actual = await vi.importActual('./costOptimizationApi');
  return {
    ...actual,
    // No need to mock the URL here since it's defined in the file
  };
});

// Set up environment variables before importing
process.env.NEXT_PUBLIC_CONTENT_GEN_URL = 'https://test-content-gen.com';

describe('costOptimizationApi', () => {
  const mockFetch = vi.fn();
  const mockGetAuthToken = vi.fn();
  const mockToken = 'test-auth-token';

  beforeEach(async () => {
    vi.clearAllMocks();
    global.fetch = mockFetch;

    // Mock the getAuthToken function
    const authModule = await import('../../auth/utils/authFetch');
    vi.mocked(authModule.getAuthToken).mockResolvedValue(mockToken);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchCostOptimizationData', () => {
    it('should fetch dashboard data successfully with date parameters', async () => {
      const mockData = {
        period_start: '2023-01-01T00:00:00Z',
        period_end: '2023-01-31T23:59:59Z',
        total_baseline_cost: 1000.0,
        total_optimized_cost: 750.0,
        total_absolute_savings: 250.0,
        total_percentage_savings: 25.0,
        projected_annual_savings: 3000.0,
        optimization_metrics: [
          {
            optimization_type: 'model_routing',
            period_start: '2023-01-01T00:00:00Z',
            period_end: '2023-01-31T23:59:59Z',
            baseline_cost: 500,
            baseline_requests: 1000,
            baseline_cost_per_request: 0.5,
            baseline_model: 'gpt-4',
            optimized_cost: 300,
            optimized_requests: 1000,
            optimized_cost_per_request: 0.3,
            optimized_model: 'gpt-3.5-turbo',
            absolute_savings: 200,
            percentage_savings: 40,
            projected_annual_savings: 2400,
            quality_before: 0.95,
            quality_after: 0.92,
            quality_impact: -3.16,
            latency_before: 2500,
            latency_after: 1800,
            latency_impact: -28,
          },
        ],
        current_model_distribution: {
          'gpt-4': { requests: 250, cost: 375, percentage: 50 },
          'gpt-3.5-turbo': { requests: 750, cost: 225, percentage: 50 },
        },
        daily_savings: [],
        cost_efficiency_trend: [],
        overall_quality_impact: 0.05,
        quality_by_optimization: {},
        top_savings_by_optimization: [],
        budget_utilization: 0.75,
        cost_alerts: [],
        optimization_recommendations: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const startDate = '2023-01-01T00:00:00Z';
      const endDate = '2023-01-31T23:59:59Z';

      const result = await fetchCostOptimizationData(startDate, endDate);

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/v1/cost-optimization/dashboard?start_date=${startDate}&end_date=${endDate}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(result).toEqual(mockData);
    });

    it('should fetch dashboard data without date parameters', async () => {
      const mockData = {
        period_start: '2023-01-01T00:00:00Z',
        period_end: '2023-01-31T23:59:59Z',
        total_baseline_cost: 500.0,
        total_optimized_cost: 400.0,
        total_absolute_savings: 100.0,
        total_percentage_savings: 20.0,
        projected_annual_savings: 1200.0,
        optimization_metrics: [],
        current_model_distribution: {},
        daily_savings: [],
        cost_efficiency_trend: [],
        overall_quality_impact: 0,
        quality_by_optimization: {},
        top_savings_by_optimization: [],
        budget_utilization: 0.5,
        cost_alerts: [],
        optimization_recommendations: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCostOptimizationData();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/cost-optimization/dashboard?',
        expect.any(Object)
      );

      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Invalid date range';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => errorMessage,
      });

      await expect(fetchCostOptimizationData('invalid-date')).rejects.toThrow(
        CostOptimizationApiError
      );

      try {
        await fetchCostOptimizationData('invalid-date');
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.details).toBe(errorMessage);
        expect(error.message).toContain('Failed to fetch cost optimization data');
      }
    });

    it('should handle missing auth token', async () => {
      mockGetAuthToken.mockResolvedValue(null);

      await expect(fetchCostOptimizationData()).rejects.toThrow(
        'No authentication token available'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(fetchCostOptimizationData()).rejects.toThrow(CostOptimizationApiError);

      try {
        await fetchCostOptimizationData();
      } catch (error) {
        expect(error.message).toContain('Error fetching cost optimization data');
        expect(error.details).toBe(networkError);
      }
    });

    it('should transform wrapped response data', async () => {
      const wrappedData = {
        data: {
          period_start: '2023-01-01T00:00:00Z',
          period_end: '2023-01-31T23:59:59Z',
          total_baseline_cost: 1000,
          total_optimized_cost: 800,
          // ... other required fields
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => wrappedData,
      });

      const result = await fetchCostOptimizationData();

      expect(result.period_start).toBe('2023-01-01T00:00:00Z');
      expect(result.total_baseline_cost).toBe(1000);
    });

    it('should handle malformed response data with defaults', async () => {
      const malformedData = {
        invalid_field: 'test',
        total_baseline_cost: 'not_a_number',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => malformedData,
      });

      const result = await fetchCostOptimizationData();

      expect(result.total_baseline_cost).toBe(0);
      expect(result.optimization_metrics).toEqual([]);
      expect(result.period_start).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // Should be current date
    });
  });

  describe('trackApiUsage', () => {
    it('should track API usage successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const usageData = {
        request_id: 'req_123',
        model_name: 'gpt-4',
        operation_type: 'completion',
        input_tokens: 100,
        output_tokens: 50,
        total_tokens: 150,
        cost: 0.75,
        latency_ms: 1500,
        quality_score: 0.95,
        status: 'success' as const,
        metadata: { endpoint: '/api/v1/completions' },
      };

      await trackApiUsage(usageData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-content-gen.com/api/v1/cost-optimization/track',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usageData),
        }
      );
    });

    it('should handle failed API usage tracking', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        text: async () => 'Invalid usage data',
      });

      const usageData = {
        request_id: 'req_456',
        model_name: 'invalid-model',
        operation_type: 'completion',
        status: 'failure' as const,
        error_message: 'Model not found',
      };

      await expect(trackApiUsage(usageData)).rejects.toThrow(CostOptimizationApiError);
    });

    it('should track minimal usage data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const minimalUsage = {
        request_id: 'req_minimal',
        model_name: 'gpt-3.5-turbo',
        operation_type: 'completion',
        status: 'success' as const,
      };

      await trackApiUsage(minimalUsage);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(minimalUsage),
        })
      );
    });
  });

  describe('fetchModelComparison', () => {
    it('should fetch model comparison data', async () => {
      const mockComparison = [
        {
          model_name: 'gpt-4',
          requests: 1000,
          total_cost: 500.0,
          average_cost_per_request: 0.5,
          percentage_of_total: 60.0,
          potential_savings: 200.0,
          recommended_alternative: 'gpt-3.5-turbo',
        },
        {
          model_name: 'gpt-3.5-turbo',
          requests: 2000,
          total_cost: 300.0,
          average_cost_per_request: 0.15,
          percentage_of_total: 40.0,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockComparison,
      });

      const startDate = '2023-01-01T00:00:00Z';
      const endDate = '2023-01-07T23:59:59Z';

      const result = await fetchModelComparison(startDate, endDate);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://test-content-gen.com/api/v1/cost-optimization/model-comparison?start_date=${startDate}&end_date=${endDate}`,
        expect.any(Object)
      );

      expect(result).toEqual(mockComparison);
    });

    it('should fetch model comparison without date parameters', async () => {
      const mockComparison = [];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockComparison,
      });

      const result = await fetchModelComparison();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-content-gen.com/api/v1/cost-optimization/model-comparison?',
        expect.any(Object)
      );

      expect(result).toEqual(mockComparison);
    });
  });

  describe('exportCostData', () => {
    it('should export cost data as blob', async () => {
      const mockBlob = new Blob(['csv,data,here'], { type: 'text/csv' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      });

      const startDate = '2023-01-01T00:00:00Z';
      const endDate = '2023-01-31T23:59:59Z';

      const result = await exportCostData(startDate, endDate);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://test-content-gen.com/api/v1/cost-optimization/export?start_date=${startDate}&end_date=${endDate}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );

      expect(result).toBeInstanceOf(Blob);
      expect(result).toBe(mockBlob);
    });

    it('should handle export errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'Export failed',
      });

      await expect(exportCostData()).rejects.toThrow(CostOptimizationApiError);
    });
  });

  describe('updateOptimizationSettings', () => {
    it('should update optimization settings successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const settings = {
        enable_auto_optimization: true,
        quality_threshold: 0.85,
        latency_threshold: 2000,
        cost_threshold: 1000.0,
        preferred_models: ['gpt-3.5-turbo', 'gpt-4'],
      };

      await updateOptimizationSettings(settings);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-content-gen.com/api/v1/cost-optimization/settings',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }
      );
    });

    it('should update partial settings', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const partialSettings = {
        enable_auto_optimization: false,
        quality_threshold: 0.9,
      };

      await updateOptimizationSettings(partialSettings);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(partialSettings),
        })
      );
    });

    it('should handle settings update errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => 'Insufficient permissions',
      });

      const settings = { enable_auto_optimization: true };

      await expect(updateOptimizationSettings(settings)).rejects.toThrow(CostOptimizationApiError);
    });
  });

  describe('generateMockCostData', () => {
    it('should generate valid mock data structure', () => {
      const mockData = generateMockCostData();

      expect(mockData).toMatchObject({
        period_start: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        period_end: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        total_baseline_cost: expect.any(Number),
        total_optimized_cost: expect.any(Number),
        total_absolute_savings: expect.any(Number),
        total_percentage_savings: expect.any(Number),
        projected_annual_savings: expect.any(Number),
        optimization_metrics: expect.any(Array),
        current_model_distribution: expect.any(Object),
        daily_savings: expect.any(Array),
        cost_efficiency_trend: expect.any(Array),
        overall_quality_impact: expect.any(Number),
        quality_by_optimization: expect.any(Object),
        top_savings_by_optimization: expect.any(Array),
        budget_utilization: expect.any(Number),
        cost_alerts: expect.any(Array),
        optimization_recommendations: expect.any(Array),
      });

      // Verify daily savings data is generated for 30 days
      expect(mockData.daily_savings).toHaveLength(30);

      // Verify cost efficiency trend data
      expect(mockData.cost_efficiency_trend).toHaveLength(30);

      // Verify optimization metrics structure
      expect(mockData.optimization_metrics.length).toBeGreaterThan(0);
      mockData.optimization_metrics.forEach((metric) => {
        expect(metric).toMatchObject({
          optimization_type: expect.any(String),
          period_start: expect.any(String),
          period_end: expect.any(String),
          baseline_cost: expect.any(Number),
          baseline_requests: expect.any(Number),
          baseline_cost_per_request: expect.any(Number),
          baseline_model: expect.any(String),
          optimized_cost: expect.any(Number),
          optimized_requests: expect.any(Number),
          optimized_cost_per_request: expect.any(Number),
          optimized_model: expect.any(String),
          absolute_savings: expect.any(Number),
          percentage_savings: expect.any(Number),
          projected_annual_savings: expect.any(Number),
        });
      });
    });

    it('should generate consistent savings calculations', () => {
      const mockData = generateMockCostData();

      const calculatedSavings = mockData.total_baseline_cost - mockData.total_optimized_cost;
      const calculatedPercentage = (calculatedSavings / mockData.total_baseline_cost) * 100;

      expect(mockData.total_absolute_savings).toBeCloseTo(calculatedSavings, 2);
      expect(mockData.total_percentage_savings).toBeCloseTo(calculatedPercentage, 2);
      expect(mockData.projected_annual_savings).toBeCloseTo(calculatedSavings * 12, 2);
    });
  });

  describe('costOptimizationApi object', () => {
    it('should call getDashboardData with correct date range', async () => {
      const mockData = {
        period_start: '2023-01-01T00:00:00Z',
        period_end: '2023-01-31T23:59:59Z',
        total_baseline_cost: 1000,
        total_optimized_cost: 800,
        total_absolute_savings: 200,
        total_percentage_savings: 20,
        projected_annual_savings: 2400,
        optimization_metrics: [],
        current_model_distribution: {},
        daily_savings: [],
        cost_efficiency_trend: [],
        overall_quality_impact: 0,
        quality_by_optimization: {},
        top_savings_by_optimization: [],
        budget_utilization: 0.8,
        cost_alerts: [],
        optimization_recommendations: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await costOptimizationApi.getDashboardData(7);

      // Should calculate date range for 7 days
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('start_date='),
        expect.any(Object)
      );

      const call = mockFetch.mock.calls[0];
      const url = call[0];
      const urlParams = new URL(url).searchParams;

      expect(urlParams.has('start_date')).toBe(true);
      expect(urlParams.has('end_date')).toBe(true);
    });

    it('should use default 30 days when no parameter provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          period_start: '2023-01-01T00:00:00Z',
          period_end: '2023-01-31T23:59:59Z',
          total_baseline_cost: 0,
          total_optimized_cost: 0,
          total_absolute_savings: 0,
          total_percentage_savings: 0,
          projected_annual_savings: 0,
          optimization_metrics: [],
          current_model_distribution: {},
          daily_savings: [],
          cost_efficiency_trend: [],
          overall_quality_impact: 0,
          quality_by_optimization: {},
          top_savings_by_optimization: [],
          budget_utilization: 0,
          cost_alerts: [],
          optimization_recommendations: [],
        }),
      });

      await costOptimizationApi.getDashboardData();

      const call = mockFetch.mock.calls[0];
      const url = call[0];
      const urlParams = new URL(url).searchParams;

      const startDateStr = urlParams.get('start_date');
      const endDateStr = urlParams.get('end_date');

      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      expect(diffDays).toBeCloseTo(30, 1); // Allow for small timing differences
    });

    it('should expose all API methods', () => {
      expect(costOptimizationApi).toHaveProperty('getDashboardData');
      expect(costOptimizationApi).toHaveProperty('trackUsage');
      expect(costOptimizationApi).toHaveProperty('getModelComparison');
      expect(costOptimizationApi).toHaveProperty('exportData');
      expect(costOptimizationApi).toHaveProperty('updateSettings');
      expect(costOptimizationApi).toHaveProperty('generateMockData');

      expect(typeof costOptimizationApi.getDashboardData).toBe('function');
      expect(typeof costOptimizationApi.trackUsage).toBe('function');
      expect(typeof costOptimizationApi.getModelComparison).toBe('function');
      expect(typeof costOptimizationApi.exportData).toBe('function');
      expect(typeof costOptimizationApi.updateSettings).toBe('function');
      expect(typeof costOptimizationApi.generateMockData).toBe('function');
    });
  });

  describe('CostOptimizationApiError', () => {
    it('should create error with message only', () => {
      const error = new CostOptimizationApiError('Test error');

      expect(error.name).toBe('CostOptimizationApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should create error with status and details', () => {
      const details = { field: 'invalid_value' };
      const error = new CostOptimizationApiError('Validation failed', 422, details);

      expect(error.name).toBe('CostOptimizationApiError');
      expect(error.message).toBe('Validation failed');
      expect(error.status).toBe(422);
      expect(error.details).toEqual(details);
    });

    it('should be instance of Error', () => {
      const error = new CostOptimizationApiError('Test');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CostOptimizationApiError);
    });
  });
});
