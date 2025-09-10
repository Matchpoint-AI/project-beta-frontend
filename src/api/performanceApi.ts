/** API client for performance monitoring endpoints. */

import { API_BASE_URL } from './config';

export interface MetricRequest {
  metric_type: 'latency' | 'error_rate' | 'cost' | 'quality' | 'throughput' | 'resource_usage';
  value: number;
  labels?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface MetricResponse {
  success: boolean;
  message: string;
  recorded_at: string;
}

export interface MetricsSummaryParams {
  metric_type?: string;
  hours_back?: number;
  operation?: string;
  model?: string;
}

export interface MetricsSummary {
  metric_type: string | null;
  time_range_hours: number;
  count: number;
  min_value: number | null;
  max_value: number | null;
  mean_value: number | null;
  median_value: number | null;
  p95_value: number | null;
  p99_value: number | null;
  trend: string | null;
  labels_filter: Record<string, string> | null;
}

export interface Alert {
  id: string;
  metric_type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  threshold: number;
  actual_value: number;
  labels: Record<string, string>;
  triggered_at: string;
  resolved_at?: string;
}

export interface CostAnalysisParams {
  hours_back?: number;
}

export interface CostAnalysis {
  time_range_hours: number;
  total_cost: number;
  total_tokens: number;
  cost_per_1k_tokens: number;
  cost_by_operation: Record<string, number>;
  cost_by_model: Record<string, number>;
  trend: string | null;
  summary_stats: Record<string, number>;
}

export interface HealthStatus {
  status: string;
  recent_metrics_count: number;
  active_alerts_count: number;
  thresholds_configured: number;
  last_check: string;
  error?: string;
}

class PerformanceApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/performance`;
  }

  private async getAuthToken(): Promise<string> {
    // This would typically get the token from your auth system
    // For now, we'll assume it's stored in localStorage or similar
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If JSON parsing fails, use the default error message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  private async makeRequestWithoutAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If JSON parsing fails, use the default error message
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Metric recording methods
  async recordMetric(request: MetricRequest): Promise<MetricResponse> {
    return this.makeRequest<MetricResponse>('/metrics', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async recordCostMetric(
    operation: string,
    model: string,
    cost: number,
    tokensUsed: number = 0
  ): Promise<MetricResponse> {
    const params = new URLSearchParams({
      operation,
      model,
      cost: cost.toString(),
      tokens_used: tokensUsed.toString(),
    });

    return this.makeRequest<MetricResponse>(`/metrics/cost?${params}`, {
      method: 'POST',
    });
  }

  async recordQualityMetric(
    operation: string,
    qualityScore: number,
    details?: Record<string, unknown>
  ): Promise<MetricResponse> {
    const params = new URLSearchParams({
      operation,
      quality_score: qualityScore.toString(),
    });

    const options: RequestInit = {
      method: 'POST',
    };

    if (details) {
      options.body = JSON.stringify(details);
    }

    return this.makeRequest<MetricResponse>(`/metrics/quality?${params}`, options);
  }

  // Metrics summary and analysis
  async getMetricsSummary(params: MetricsSummaryParams = {}): Promise<MetricsSummary> {
    const searchParams = new URLSearchParams();

    if (params.metric_type) searchParams.set('metric_type', params.metric_type);
    if (params.hours_back) searchParams.set('hours_back', params.hours_back.toString());
    if (params.operation) searchParams.set('operation', params.operation);
    if (params.model) searchParams.set('model', params.model);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/metrics/summary?${queryString}` : '/metrics/summary';

    return this.makeRequest<MetricsSummary>(endpoint);
  }

  async getCostAnalysis(params: CostAnalysisParams = {}): Promise<CostAnalysis> {
    const searchParams = new URLSearchParams();

    if (params.hours_back) {
      searchParams.set('hours_back', params.hours_back.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/costs/analysis?${queryString}` : '/costs/analysis';

    return this.makeRequest<CostAnalysis>(endpoint);
  }

  // Alert management
  async getActiveAlerts(severity?: 'info' | 'warning' | 'critical'): Promise<Alert[]> {
    const params = severity ? `?severity=${severity}` : '';
    return this.makeRequest<Alert[]>(`/alerts${params}`);
  }

  async resolveAlert(
    alertId: string
  ): Promise<{ success: string; message: string; resolved_at: string }> {
    return this.makeRequest(`/alerts/${alertId}/resolve`, {
      method: 'POST',
    });
  }

  // Health check
  async getHealthCheck(): Promise<HealthStatus> {
    return this.makeRequestWithoutAuth<HealthStatus>('/health');
  }

  // Utility methods
  async getMetricTypes(): Promise<string[]> {
    return this.makeRequest<string[]>('/metrics/types');
  }

  async getAlertSeverities(): Promise<string[]> {
    return this.makeRequest<string[]>('/alerts/severities');
  }

  // Convenience methods for tracking operations
  async trackOperation<T>(
    operationName: string,
    labels: Record<string, string> = {},
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    let error: Error | null = null;

    try {
      const result = await operation();

      // Record successful operation latency
      const latency = (Date.now() - startTime) / 1000;
      await this.recordMetric({
        metric_type: 'latency',
        value: latency,
        labels: { ...labels, operation: operationName },
      });

      return result;
    } catch (_err) {
      error = _err instanceof Error ? _err : new Error(String(_err));

      // Record error
      await this.recordMetric({
        metric_type: 'error_rate',
        value: 1.0,
        labels: { ...labels, operation: operationName },
        metadata: { error: error.message },
      });

      throw error;
    }
  }

  // Batch operations
  async recordMultipleMetrics(requests: MetricRequest[]): Promise<MetricResponse[]> {
    const promises = requests.map((request) => this.recordMetric(request));
    return Promise.all(promises);
  }

  // Real-time monitoring helpers
  startRealTimeMonitoring(
    callback: (data: { alerts: Alert[]; health: HealthStatus }) => void,
    intervalMs: number = 30000
  ): () => void {
    const interval = setInterval(async () => {
      try {
        const [alerts, health] = await Promise.all([this.getActiveAlerts(), this.getHealthCheck()]);

        callback({ alerts, health });
      } catch (_error) {
        // Error handled silently
      }
    }, intervalMs);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  // Performance insights
  async getPerformanceInsights(hoursBack: number = 24): Promise<{
    latency: MetricsSummary;
    errors: MetricsSummary;
    costs: CostAnalysis;
    quality: MetricsSummary;
    alerts: Alert[];
  }> {
    const [latency, errors, costs, quality, alerts] = await Promise.all([
      this.getMetricsSummary({ metric_type: 'latency', hours_back: hoursBack }),
      this.getMetricsSummary({ metric_type: 'error_rate', hours_back: hoursBack }),
      this.getCostAnalysis({ hours_back: hoursBack }),
      this.getMetricsSummary({ metric_type: 'quality', hours_back: hoursBack }),
      this.getActiveAlerts(),
    ]);

    return { latency, errors, costs, quality, alerts };
  }
}

export const performanceApi = new PerformanceApiClient();
