/**
 * Cost Optimization API Client
 *
 * Provides methods to interact with the cost optimization tracking backend service.
 * Handles authentication, error handling, and data transformation for the frontend.
 */
interface CostOptimizationMetrics {
  optimization_type: string;
  period_start: string;
  period_end: string;
  baseline_cost: number;
  baseline_requests: number;
  baseline_cost_per_request: number;
  baseline_model: string;
  optimized_cost: number;
  optimized_requests: number;
  optimized_cost_per_request: number;
  optimized_model: string;
  absolute_savings: number;
  percentage_savings: number;
  projected_annual_savings: number;
  quality_before?: number;
  quality_after?: number;
  quality_impact?: number;
  latency_before?: number;
  latency_after?: number;
  latency_impact?: number;
}
interface CostDashboardData {
  period_start: string;
  period_end: string;
  total_baseline_cost: number;
  total_optimized_cost: number;
  total_absolute_savings: number;
  total_percentage_savings: number;
  projected_annual_savings: number;
  optimization_metrics: CostOptimizationMetrics[];
  current_model_distribution: Record<
    string,
    {
      requests: number;
      cost: number;
      percentage: number;
    }
  >;
  daily_savings: Array<{
    date: string;
    daily_savings: number;
    cumulative_savings: number;
    baseline_cost: number;
    optimized_cost: number;
  }>;
  optimization_recommendations: Array<{
    recommendation: string;
    potential_savings: number;
    difficulty: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
  }>;
}
interface OptimizationComparison {
  model_name: string;
  requests: number;
  total_cost: number;
  average_cost_per_request: number;
  percentage_of_total: number;
  potential_savings?: number;
  recommended_alternative?: string;
}
interface TrackUsageData {
  request_id: string;
  model_name: string;
  operation_type: string;
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  cost?: number;
  latency_ms?: number;
  quality_score?: number;
  status: 'success' | 'failure';
  error_message?: string;
  metadata?: Record<string, unknown>;
}
declare class CostOptimizationApiError extends Error {
  status?: number | undefined;
  details?: unknown | undefined;
  constructor(message: string, status?: number | undefined, details?: unknown | undefined);
}
/**
 * Fetches cost optimization dashboard data for the specified period
 * @param startDate - Start date for the period (ISO 8601 format)
 * @param endDate - End date for the period (ISO 8601 format)
 * @returns Promise<CostDashboardData>
 */
export declare function fetchCostOptimizationData(
  startDate?: string,
  endDate?: string
): Promise<CostDashboardData>;
/**
 * Tracks API usage for cost optimization analysis
 * @param usageData - Usage data to track
 * @returns Promise<void>
 */
export declare function trackApiUsage(usageData: TrackUsageData): Promise<void>;
/**
 * Fetches model comparison data for cost optimization
 * @param startDate - Start date for the comparison period
 * @param endDate - End date for the comparison period
 * @returns Promise<OptimizationComparison[]>
 */
export declare function fetchModelComparison(
  startDate?: string,
  endDate?: string
): Promise<OptimizationComparison[]>;
/**
 * Exports cost optimization data as CSV
 * @param startDate - Start date for the export period
 * @param endDate - End date for the export period
 * @returns Promise<Blob>
 */
export declare function exportCostData(startDate?: string, endDate?: string): Promise<Blob>;
/**
 * Updates cost optimization settings
 * @param settings - Settings to update
 * @returns Promise<void>
 */
export declare function updateOptimizationSettings(settings: {
  enable_auto_optimization?: boolean;
  quality_threshold?: number;
  latency_threshold?: number;
  cost_threshold?: number;
  preferred_models?: string[];
}): Promise<void>;
export declare function generateMockCostData(): CostDashboardData;
export { CostOptimizationApiError };
export type { CostDashboardData, CostOptimizationMetrics, OptimizationComparison, TrackUsageData };
