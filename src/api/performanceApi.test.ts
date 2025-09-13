import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { performanceApi } from './performanceApi';

// Mock the config module
vi.mock('./config', () => ({
  API_BASE_URL: 'https://test-api.com',
}));

describe('performanceApi', () => {
  const mockFetch = vi.fn();
  const mockToken = 'test-auth-token';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;

    // Mock localStorage for token retrieval
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => mockToken),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('recordMetric', () => {
    it('should successfully record a metric', async () => {
      const mockResponse = {
        success: true,
        message: 'Metric recorded successfully',
        recorded_at: '2023-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const metricRequest = {
        metric_type: 'latency' as const,
        value: 150.5,
        labels: { operation: 'api_call', service: 'content-gen' },
        metadata: { endpoint: '/api/v1/generate' },
      };

      const result = await performanceApi.recordMetric(metricRequest);

      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/api/v1/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(metricRequest),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors properly', async () => {
      const errorResponse = {
        detail: 'Invalid metric type',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => errorResponse,
      });

      const metricRequest = {
        metric_type: 'invalid' as any,
        value: 100,
      };

      await expect(performanceApi.recordMetric(metricRequest)).rejects.toThrow(
        'Invalid metric type'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const metricRequest = {
        metric_type: 'latency' as const,
        value: 100,
      };

      await expect(performanceApi.recordMetric(metricRequest)).rejects.toThrow('Network error');
    });

    it('should throw error when no auth token is available', async () => {
      window.localStorage.getItem = vi.fn(() => null);

      const metricRequest = {
        metric_type: 'latency' as const,
        value: 100,
      };

      await expect(performanceApi.recordMetric(metricRequest)).rejects.toThrow(
        'No authentication token found'
      );
    });

    it('should handle JSON parsing errors in error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const metricRequest = {
        metric_type: 'error_rate' as const,
        value: 1.0,
      };

      await expect(performanceApi.recordMetric(metricRequest)).rejects.toThrow(
        'HTTP 500: Internal Server Error'
      );
    });
  });

  describe('recordCostMetric', () => {
    it('should record cost metrics with correct query parameters', async () => {
      const mockResponse = {
        success: true,
        message: 'Cost metric recorded',
        recorded_at: '2023-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await performanceApi.recordCostMetric('generate_content', 'gpt-4', 0.25, 1500);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/metrics/cost?operation=generate_content&model=gpt-4&cost=0.25&tokens_used=1500',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle optional tokens parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await performanceApi.recordCostMetric('generate_image', 'dall-e-3', 0.04);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/metrics/cost?operation=generate_image&model=dall-e-3&cost=0.04&tokens_used=0',
        expect.any(Object)
      );
    });
  });

  describe('recordQualityMetric', () => {
    it('should record quality metrics with details', async () => {
      const mockResponse = {
        success: true,
        message: 'Quality metric recorded',
        recorded_at: '2023-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const details = {
        content_type: 'caption',
        user_rating: 4.5,
        engagement_score: 0.85,
      };

      const result = await performanceApi.recordQualityMetric('caption_generation', 0.92, details);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/metrics/quality?operation=caption_generation&quality_score=0.92',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(details),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle request without details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await performanceApi.recordQualityMetric('image_generation', 0.88);

      const call = mockFetch.mock.calls[0];
      const requestOptions = call[1];

      expect(requestOptions.body).toBeUndefined();
    });
  });

  describe('getMetricsSummary', () => {
    it('should fetch metrics summary with all parameters', async () => {
      const mockSummary = {
        metric_type: 'latency',
        time_range_hours: 24,
        count: 1000,
        min_value: 50,
        max_value: 2000,
        mean_value: 250,
        median_value: 200,
        p95_value: 800,
        p99_value: 1200,
        trend: 'improving',
        labels_filter: { operation: 'generate_content' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary,
      });

      const params = {
        metric_type: 'latency',
        hours_back: 24,
        operation: 'generate_content',
        model: 'gpt-4',
      };

      const result = await performanceApi.getMetricsSummary(params);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/metrics/summary?metric_type=latency&hours_back=24&operation=generate_content&model=gpt-4',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );

      expect(result).toEqual(mockSummary);
    });

    it('should fetch metrics summary with no parameters', async () => {
      const mockSummary = {
        metric_type: null,
        time_range_hours: 24,
        count: 500,
        min_value: null,
        max_value: null,
        mean_value: null,
        median_value: null,
        p95_value: null,
        p99_value: null,
        trend: null,
        labels_filter: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary,
      });

      const result = await performanceApi.getMetricsSummary();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/metrics/summary',
        expect.any(Object)
      );

      expect(result).toEqual(mockSummary);
    });
  });

  describe('getCostAnalysis', () => {
    it('should fetch cost analysis with time range', async () => {
      const mockAnalysis = {
        time_range_hours: 168,
        total_cost: 1250.75,
        total_tokens: 2500000,
        cost_per_1k_tokens: 0.5003,
        cost_by_operation: {
          generate_content: 800.25,
          generate_image: 450.5,
        },
        cost_by_model: {
          'gpt-4': 600.0,
          'gpt-3.5-turbo': 200.25,
          'dall-e-3': 450.5,
        },
        trend: 'increasing',
        summary_stats: {
          avg_daily_cost: 178.68,
          peak_hourly_cost: 85.5,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalysis,
      });

      const result = await performanceApi.getCostAnalysis({ hours_back: 168 });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/costs/analysis?hours_back=168',
        expect.any(Object)
      );

      expect(result).toEqual(mockAnalysis);
    });
  });

  describe('getActiveAlerts', () => {
    it('should fetch active alerts with severity filter', async () => {
      const mockAlerts = [
        {
          id: 'alert-1',
          metric_type: 'latency',
          severity: 'warning' as const,
          message: 'High latency detected',
          threshold: 1000,
          actual_value: 1250,
          labels: { operation: 'generate_content' },
          triggered_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 'alert-2',
          metric_type: 'cost',
          severity: 'critical' as const,
          message: 'Budget exceeded',
          threshold: 1000,
          actual_value: 1500,
          labels: { model: 'gpt-4' },
          triggered_at: '2023-01-01T01:00:00Z',
          resolved_at: '2023-01-01T02:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      const result = await performanceApi.getActiveAlerts('warning');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/alerts?severity=warning',
        expect.any(Object)
      );

      expect(result).toEqual(mockAlerts);
    });

    it('should fetch all active alerts when no severity specified', async () => {
      const mockAlerts = [];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      await performanceApi.getActiveAlerts();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/alerts',
        expect.any(Object)
      );
    });
  });

  describe('resolveAlert', () => {
    it('should resolve an alert successfully', async () => {
      const mockResponse = {
        success: 'true',
        message: 'Alert resolved successfully',
        resolved_at: '2023-01-01T12:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await performanceApi.resolveAlert('alert-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/alerts/alert-123/resolve',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getHealthCheck', () => {
    it('should perform health check without authentication', async () => {
      const mockHealth = {
        status: 'healthy',
        recent_metrics_count: 1000,
        active_alerts_count: 2,
        thresholds_configured: 10,
        last_check: '2023-01-01T12:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
      });

      const result = await performanceApi.getHealthCheck();

      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/api/v1/performance/health', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual(mockHealth);
    });

    it('should handle health check with error', async () => {
      const mockHealth = {
        status: 'unhealthy',
        recent_metrics_count: 0,
        active_alerts_count: 5,
        thresholds_configured: 10,
        last_check: '2023-01-01T12:00:00Z',
        error: 'Database connection failed',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
      });

      const result = await performanceApi.getHealthCheck();

      expect(result).toEqual(mockHealth);
      expect(result.error).toBe('Database connection failed');
    });
  });

  describe('trackOperation', () => {
    it('should track successful operation and record latency', async () => {
      const mockMetricResponse = {
        success: true,
        message: 'Metric recorded',
        recorded_at: '2023-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetricResponse,
      });

      const mockOperation = vi.fn().mockResolvedValue('operation result');
      const labels = { service: 'content-gen', version: 'v1' };

      const result = await performanceApi.trackOperation('test_operation', labels, mockOperation);

      expect(mockOperation).toHaveBeenCalled();
      expect(result).toBe('operation result');

      // Should have recorded latency metric
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/metrics',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"metric_type":"latency"'),
        })
      );

      const recordedCall = mockFetch.mock.calls[0];
      const body = JSON.parse(recordedCall[1].body);
      expect(body.labels).toEqual({
        ...labels,
        operation: 'test_operation',
      });
      expect(typeof body.value).toBe('number');
      expect(body.value).toBeGreaterThanOrEqual(0);
    });

    it('should track failed operation and record error', async () => {
      // Mock two responses: one for error metric, one for expected second call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const mockError = new Error('Operation failed');
      const mockOperation = vi.fn().mockRejectedValue(mockError);
      const labels = { service: 'content-gen' };

      await expect(
        performanceApi.trackOperation('failing_operation', labels, mockOperation)
      ).rejects.toThrow('Operation failed');

      expect(mockOperation).toHaveBeenCalled();

      // Should have recorded error metric
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/api/v1/performance/metrics',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"metric_type":"error_rate"'),
        })
      );

      const recordedCall = mockFetch.mock.calls[0];
      const body = JSON.parse(recordedCall[1].body);
      expect(body.labels).toEqual({
        ...labels,
        operation: 'failing_operation',
      });
      expect(body.value).toBe(1.0);
      expect(body.metadata).toEqual({ error: 'Operation failed' });
    });

    it('should handle non-Error exceptions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const mockOperation = vi.fn().mockRejectedValue('String error');

      await expect(performanceApi.trackOperation('operation', {}, mockOperation)).rejects.toThrow(
        'String error'
      );

      const recordedCall = mockFetch.mock.calls[0];
      const body = JSON.parse(recordedCall[1].body);
      expect(body.metadata.error).toBe('String error');
    });
  });

  describe('recordMultipleMetrics', () => {
    it('should record multiple metrics concurrently', async () => {
      const mockResponse = {
        success: true,
        message: 'Metric recorded',
        recorded_at: '2023-01-01T00:00:00Z',
      };

      // Mock multiple successful responses
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse })
        .mockResolvedValueOnce({ ok: true, json: async () => mockResponse });

      const metrics = [
        { metric_type: 'latency' as const, value: 100 },
        { metric_type: 'cost' as const, value: 0.25 },
        { metric_type: 'quality' as const, value: 0.95 },
      ];

      const results = await performanceApi.recordMultipleMetrics(metrics);

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle partial failures in batch recording', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          json: async () => ({ detail: 'Invalid metric' }),
        });

      const metrics = [
        { metric_type: 'latency' as const, value: 100 },
        { metric_type: 'invalid' as any, value: 200 },
      ];

      await expect(performanceApi.recordMultipleMetrics(metrics)).rejects.toThrow();
    });
  });

  describe('startRealTimeMonitoring', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should start real-time monitoring and call callback with data', async () => {
      const mockAlerts = [
        {
          id: 'alert-1',
          metric_type: 'latency',
          severity: 'warning' as const,
          message: 'High latency',
          threshold: 1000,
          actual_value: 1200,
          labels: {},
          triggered_at: '2023-01-01T00:00:00Z',
        },
      ];

      const mockHealth = {
        status: 'healthy',
        recent_metrics_count: 1000,
        active_alerts_count: 1,
        thresholds_configured: 10,
        last_check: '2023-01-01T12:00:00Z',
      };

      // Mock the API responses - Need to swap them as Promise.all seems to return them in different order
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockHealth }) // Actually returns health first
        .mockResolvedValueOnce({ ok: true, json: async () => mockAlerts }); // Then alerts

      const mockCallback = vi.fn();
      const cleanup = performanceApi.startRealTimeMonitoring(mockCallback, 10000);

      // Fast-forward time to trigger the interval
      await vi.advanceTimersByTimeAsync(10000);

      expect(mockCallback).toHaveBeenCalledWith({
        alerts: mockAlerts,
        health: mockHealth,
      });

      cleanup();
    });

    it('should handle errors in real-time monitoring gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const mockCallback = vi.fn();
      const cleanup = performanceApi.startRealTimeMonitoring(mockCallback, 5000);

      // Fast-forward time to trigger the interval
      await vi.advanceTimersByTimeAsync(5000);

      // Callback should not be called due to error
      expect(mockCallback).not.toHaveBeenCalled();

      cleanup();
    });
  });

  describe('getPerformanceInsights', () => {
    it('should fetch comprehensive performance insights', async () => {
      const mockLatency = {
        metric_type: 'latency',
        time_range_hours: 24,
        count: 1000,
        min_value: 50,
        max_value: 2000,
        mean_value: 250,
        median_value: 200,
        p95_value: 800,
        p99_value: 1200,
        trend: 'stable',
        labels_filter: null,
      };

      const mockErrors = {
        metric_type: 'error_rate',
        time_range_hours: 24,
        count: 50,
        min_value: 0,
        max_value: 0.1,
        mean_value: 0.05,
        median_value: 0.04,
        p95_value: 0.08,
        p99_value: 0.1,
        trend: 'improving',
        labels_filter: null,
      };

      const mockCosts = {
        time_range_hours: 24,
        total_cost: 125.5,
        total_tokens: 250000,
        cost_per_1k_tokens: 0.502,
        cost_by_operation: { generate_content: 100.0, generate_image: 25.5 },
        cost_by_model: { 'gpt-4': 75.0, 'dall-e-3': 50.5 },
        trend: 'stable',
        summary_stats: { avg_hourly_cost: 5.23 },
      };

      const mockQuality = {
        metric_type: 'quality',
        time_range_hours: 24,
        count: 800,
        min_value: 0.6,
        max_value: 1.0,
        mean_value: 0.85,
        median_value: 0.87,
        p95_value: 0.95,
        p99_value: 0.98,
        trend: 'improving',
        labels_filter: null,
      };

      const mockAlerts = [];

      // Mock all the API calls
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockLatency })
        .mockResolvedValueOnce({ ok: true, json: async () => mockErrors })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCosts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockQuality })
        .mockResolvedValueOnce({ ok: true, json: async () => mockAlerts });

      const result = await performanceApi.getPerformanceInsights(24);

      expect(result).toEqual({
        latency: mockLatency,
        errors: mockErrors,
        costs: mockCosts,
        quality: mockQuality,
        alerts: mockAlerts,
      });

      expect(mockFetch).toHaveBeenCalledTimes(5);

      // Verify the correct endpoints were called
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        'https://test-api.com/api/v1/performance/metrics/summary?metric_type=latency&hours_back=24',
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://test-api.com/api/v1/performance/metrics/summary?metric_type=error_rate&hours_back=24',
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        3,
        'https://test-api.com/api/v1/performance/costs/analysis?hours_back=24',
        expect.any(Object)
      );
    });
  });
});
