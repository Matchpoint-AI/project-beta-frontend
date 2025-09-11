/** API client for performance monitoring endpoints. */
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
declare class PerformanceApiClient {
  private baseUrl;
  constructor();
  private getAuthToken;
  private makeRequest;
  private makeRequestWithoutAuth;
  recordMetric(request: MetricRequest): Promise<MetricResponse>;
  recordCostMetric(
    operation: string,
    model: string,
    cost: number,
    tokensUsed?: number
  ): Promise<MetricResponse>;
  recordQualityMetric(
    operation: string,
    qualityScore: number,
    details?: Record<string, unknown>
  ): Promise<MetricResponse>;
  getMetricsSummary(params?: MetricsSummaryParams): Promise<MetricsSummary>;
  getCostAnalysis(params?: CostAnalysisParams): Promise<CostAnalysis>;
  getActiveAlerts(severity?: 'info' | 'warning' | 'critical'): Promise<Alert[]>;
  resolveAlert(alertId: string): Promise<{
    success: string;
    message: string;
    resolved_at: string;
  }>;
  getHealthCheck(): Promise<HealthStatus>;
  getMetricTypes(): Promise<string[]>;
  getAlertSeverities(): Promise<string[]>;
  trackOperation<T>(
    operationName: string,
    labels: Record<string, string> | undefined,
    operation: () => Promise<T>
  ): Promise<T>;
  recordMultipleMetrics(requests: MetricRequest[]): Promise<MetricResponse[]>;
  startRealTimeMonitoring(
    callback: (data: { alerts: Alert[]; health: HealthStatus }) => void,
    intervalMs?: number
  ): () => void;
  getPerformanceInsights(hoursBack?: number): Promise<{
    latency: MetricsSummary;
    errors: MetricsSummary;
    costs: CostAnalysis;
    quality: MetricsSummary;
    alerts: Alert[];
  }>;
}
export declare const performanceApi: PerformanceApiClient;
export {};
