/**
 * Cost Optimization API Client
 *
 * Provides methods to interact with the cost optimization tracking backend service.
 * Handles authentication(_error) handling, and data transformation for the frontend.
 */

import { getToken } from '../features/auth/utils/authFetch';

const CONTENT_GEN_URL = process.env.NEXT_PUBLIC_CONTENT_GEN_URL || 'http://localhost:8080';

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
    { requests: number; cost: number; percentage: number }
  >;
  daily_savings: Array<{
    date: string;
    daily_savings: number;
    cumulative_savings: number;
    baseline_cost: number;
    optimized_cost: number;
  }>;
  cost_efficiency_trend: Array<{
    date: string;
    cost_efficiency: number;
    requests_per_dollar: number;
    savings_rate: number;
  }>;
  overall_quality_impact: number;
  quality_by_optimization: Record<string, number>;
  top_savings_by_optimization: Array<{
    optimization_type: string;
    annual_savings: number;
    percentage_savings: number;
    quality_impact: number;
    implementation_status: string;
  }>;
  budget_utilization: number;
  cost_alerts: Array<{
    type: string;
    optimization: string;
    severity: string;
    message: string;
    current_value: number;
    expected_value?: number;
    threshold?: number;
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

class CostOptimizationApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CostOptimizationApiError';
  }
}

/**
 * Fetches cost optimization dashboard data for the specified period
 * @param startDate - Start date for the period (ISO 8601 format)
 * @param endDate - End date for the period (ISO 8601 format)
 * @returns Promise<CostDashboardData>
 */
export async function fetchCostOptimizationData(
  startDate?: string,
  endDate?: string
): Promise<CostDashboardData> {
  try {
    const token = await getToken();
    if (!token) {
      throw new CostOptimizationApiError('No authentication token available', 401);
    }

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/cost-optimization/dashboard?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new CostOptimizationApiError(
        `Failed to fetch cost optimization data: ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    const data = await response.json();
    return transformDashboardData(data);
  } catch (_error) {
    if (_error instanceof CostOptimizationApiError) {
      throw _error;
    }
    throw new CostOptimizationApiError(
      `Error fetching cost optimization data: ${_error instanceof Error ? _error.message : 'Unknown error'}`,
      undefined,
      _error
    );
  }
}

/**
 * Tracks API usage for cost optimization analysis
 * @param usageData - Usage data to track
 * @returns Promise<void>
 */
export async function trackApiUsage(usageData: TrackUsageData): Promise<void> {
  try {
    const token = await getToken();
    if (!token) {
      throw new CostOptimizationApiError('No authentication token available', 401);
    }

    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/cost-optimization/track`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usageData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new CostOptimizationApiError(
        `Failed to track API usage: ${response.statusText}`,
        response.status,
        errorBody
      );
    }
  } catch (_error) {
    if (_error instanceof CostOptimizationApiError) {
      throw _error;
    }
    throw new CostOptimizationApiError(
      `Error tracking API usage: ${_error instanceof Error ? _error.message : 'Unknown error'}`,
      undefined,
      _error
    );
  }
}

/**
 * Fetches model comparison data for cost optimization
 * @param startDate - Start date for the comparison period
 * @param endDate - End date for the comparison period
 * @returns Promise<OptimizationComparison[]>
 */
export async function fetchModelComparison(
  startDate?: string,
  endDate?: string
): Promise<OptimizationComparison[]> {
  try {
    const token = await getToken();
    if (!token) {
      throw new CostOptimizationApiError('No authentication token available', 401);
    }

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/cost-optimization/model-comparison?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new CostOptimizationApiError(
        `Failed to fetch model comparison: ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    return await response.json();
  } catch (_error) {
    if (_error instanceof CostOptimizationApiError) {
      throw _error;
    }
    throw new CostOptimizationApiError(
      `Error fetching model comparison: ${_error instanceof Error ? _error.message : 'Unknown error'}`,
      undefined,
      _error
    );
  }
}

/**
 * Exports cost optimization data as CSV
 * @param startDate - Start date for the export period
 * @param endDate - End date for the export period
 * @returns Promise<Blob>
 */
export async function exportCostData(startDate?: string, endDate?: string): Promise<Blob> {
  try {
    const token = await getToken();
    if (!token) {
      throw new CostOptimizationApiError('No authentication token available', 401);
    }

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await fetch(
      `${CONTENT_GEN_URL}/api/v1/cost-optimization/export?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new CostOptimizationApiError(
        `Failed to export cost data: ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    return await response.blob();
  } catch (_error) {
    if (_error instanceof CostOptimizationApiError) {
      throw _error;
    }
    throw new CostOptimizationApiError(
      `Error exporting cost data: ${_error instanceof Error ? _error.message : 'Unknown error'}`,
      undefined,
      _error
    );
  }
}

/**
 * Updates cost optimization settings
 * @param settings - Settings to update
 * @returns Promise<void>
 */
export async function updateOptimizationSettings(settings: {
  enable_auto_optimization?: boolean;
  quality_threshold?: number;
  latency_threshold?: number;
  cost_threshold?: number;
  preferred_models?: string[];
}): Promise<void> {
  try {
    const token = await getToken();
    if (!token) {
      throw new CostOptimizationApiError('No authentication token available', 401);
    }

    const response = await fetch(`${CONTENT_GEN_URL}/api/v1/cost-optimization/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new CostOptimizationApiError(
        `Failed to update optimization settings: ${response.statusText}`,
        response.status,
        errorBody
      );
    }
  } catch (_error) {
    if (_error instanceof CostOptimizationApiError) {
      throw _error;
    }
    throw new CostOptimizationApiError(
      `Error updating optimization settings: ${_error instanceof Error ? _error.message : 'Unknown error'}`,
      undefined,
      _error
    );
  }
}

/**
 * Transforms raw dashboard data from the API to the expected frontend format
 * @param data - Raw data from the API
 * @returns Transformed dashboard data
 */
function transformDashboardData(data: unknown): CostDashboardData {
  // Handle case where data might be wrapped in a response object
  const isWrappedResponse = typeof data === 'object' && data !== null && 'data' in data;
  const dashboardData = isWrappedResponse ? (data as { data: unknown }).data : data;
  const safeData = dashboardData as Record<string, unknown>;

  return {
    period_start:
      typeof safeData?.period_start === 'string' ? safeData.period_start : new Date().toISOString(),
    period_end:
      typeof safeData?.period_end === 'string' ? safeData.period_end : new Date().toISOString(),
    total_baseline_cost:
      typeof safeData?.total_baseline_cost === 'number' ? safeData.total_baseline_cost : 0,
    total_optimized_cost:
      typeof safeData?.total_optimized_cost === 'number' ? safeData.total_optimized_cost : 0,
    total_absolute_savings:
      typeof safeData?.total_absolute_savings === 'number' ? safeData.total_absolute_savings : 0,
    total_percentage_savings:
      typeof safeData?.total_percentage_savings === 'number'
        ? safeData.total_percentage_savings
        : 0,
    projected_annual_savings:
      typeof safeData?.projected_annual_savings === 'number'
        ? safeData.projected_annual_savings
        : 0,
    optimization_metrics: Array.isArray(safeData?.optimization_metrics)
      ? (safeData.optimization_metrics as CostOptimizationMetrics[])
      : [],
    current_model_distribution:
      typeof safeData?.current_model_distribution === 'object'
        ? (safeData.current_model_distribution as Record<
            string,
            { requests: number; cost: number; percentage: number }
          >)
        : {},
    daily_savings: Array.isArray(safeData?.daily_savings)
      ? (safeData.daily_savings as Array<{
          date: string;
          daily_savings: number;
          cumulative_savings: number;
          baseline_cost: number;
          optimized_cost: number;
        }>)
      : [],
    cost_efficiency_trend: Array.isArray(safeData?.cost_efficiency_trend)
      ? (safeData.cost_efficiency_trend as Array<{
          date: string;
          cost_efficiency: number;
          requests_per_dollar: number;
          savings_rate: number;
        }>)
      : [],
    overall_quality_impact:
      typeof safeData?.overall_quality_impact === 'number' ? safeData.overall_quality_impact : 0,
    quality_by_optimization:
      typeof safeData?.quality_by_optimization === 'object'
        ? (safeData.quality_by_optimization as Record<string, number>)
        : {},
    top_savings_by_optimization: Array.isArray(safeData?.top_savings_by_optimization)
      ? (safeData.top_savings_by_optimization as Array<{
          optimization_type: string;
          annual_savings: number;
          percentage_savings: number;
          quality_impact: number;
          implementation_status: string;
        }>)
      : [],
    budget_utilization:
      typeof safeData?.budget_utilization === 'number' ? safeData.budget_utilization : 0,
    cost_alerts: Array.isArray(safeData?.cost_alerts)
      ? (safeData.cost_alerts as Array<{
          type: string;
          optimization: string;
          severity: string;
          message: string;
          current_value: number;
          expected_value?: number;
          threshold?: number;
        }>)
      : [],
    optimization_recommendations: Array.isArray(safeData?.optimization_recommendations)
      ? (safeData.optimization_recommendations as Array<{
          recommendation: string;
          potential_savings: number;
          difficulty: 'low' | 'medium' | 'high';
          impact: 'low' | 'medium' | 'high';
        }>)
      : [],
  };
}

// Mock data generator for testing
export function generateMockCostData(): CostDashboardData {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const baselineCost = 1250.0;
  const optimizedCost = 875.0;
  const savings = baselineCost - optimizedCost;
  const percentageSavings = (savings / baselineCost) * 100;

  // Generate daily savings data
  const dailySavings = [];
  const costEfficiencyTrend = [];
  let cumulativeSavings = 0;
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dailyBaseline = 35 + Math.random() * 20;
    const dailyOptimized = dailyBaseline * 0.7;
    const dailySaving = dailyBaseline - dailyOptimized;
    cumulativeSavings += dailySaving;

    dailySavings.push({
      date: date.toISOString().split('T')[0],
      daily_savings: dailySaving,
      cumulative_savings: cumulativeSavings,
      baseline_cost: dailyBaseline,
      optimized_cost: dailyOptimized,
    });

    costEfficiencyTrend.push({
      date: date.toISOString().split('T')[0],
      cost_efficiency: 0.7 + Math.random() * 0.2,
      requests_per_dollar: 20 + Math.random() * 10,
      savings_rate: 0.3 + Math.random() * 0.4,
    });
  }

  return {
    period_start: startDate.toISOString(),
    period_end: endDate.toISOString(),
    total_baseline_cost: baselineCost,
    total_optimized_cost: optimizedCost,
    total_absolute_savings: savings,
    total_percentage_savings: percentageSavings,
    projected_annual_savings: savings * 12,
    overall_quality_impact: 0.05,
    quality_by_optimization: {
      vision_model_switch: 0.1,
      gemini_routing: 0.02,
      flux_high_volume: -0.01,
      imagen_text_clarity: 0.95,
      smart_router_v2: 0.08,
      scene_mix_bandits: 0.25,
    },
    budget_utilization: 0.75,
    cost_efficiency_trend: costEfficiencyTrend,
    top_savings_by_optimization: [
      {
        optimization_type: 'vision_model_switch',
        annual_savings: 85000,
        percentage_savings: 94,
        quality_impact: 0.1,
        implementation_status: 'completed',
      },
      {
        optimization_type: 'flux_high_volume',
        annual_savings: 75000,
        percentage_savings: 90,
        quality_impact: -0.01,
        implementation_status: 'completed',
      },
      {
        optimization_type: 'gemini_routing',
        annual_savings: 50000,
        percentage_savings: 67,
        quality_impact: 0.02,
        implementation_status: 'in_progress',
      },
    ],
    cost_alerts: [
      {
        type: 'threshold_exceeded',
        optimization: 'vision_model_switch',
        severity: 'warning',
        message: 'Usage spike detected - 15% above normal',
        current_value: 1150,
        expected_value: 1000,
        threshold: 1200,
      },
    ],
    optimization_metrics: [
      {
        optimization_type: 'model_routing',
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
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
      {
        optimization_type: 'prompt_optimization',
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
        baseline_cost: 450,
        baseline_requests: 500,
        baseline_cost_per_request: 0.9,
        baseline_model: 'claude-3-opus',
        optimized_cost: 315,
        optimized_requests: 500,
        optimized_cost_per_request: 0.63,
        optimized_model: 'claude-3-sonnet',
        absolute_savings: 135,
        percentage_savings: 30,
        projected_annual_savings: 1620,
        quality_before: 0.94,
        quality_after: 0.91,
        quality_impact: -3.19,
        latency_before: 3000,
        latency_after: 2200,
        latency_impact: -26.67,
      },
      {
        optimization_type: 'caching',
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
        baseline_cost: 300,
        baseline_requests: 2000,
        baseline_cost_per_request: 0.15,
        baseline_model: 'gpt-3.5-turbo',
        optimized_cost: 260,
        optimized_requests: 2000,
        optimized_cost_per_request: 0.13,
        optimized_model: 'gpt-3.5-turbo',
        absolute_savings: 40,
        percentage_savings: 13.33,
        projected_annual_savings: 480,
        latency_before: 1500,
        latency_after: 50,
        latency_impact: -96.67,
      },
    ],
    current_model_distribution: {
      'gpt-4': {
        requests: 250,
        cost: 375,
        percentage: 42.86,
      },
      'gpt-3.5-turbo': {
        requests: 1500,
        cost: 300,
        percentage: 34.29,
      },
      'claude-3-sonnet': {
        requests: 400,
        cost: 200,
        percentage: 22.86,
      },
    },
    daily_savings: dailySavings,
    optimization_recommendations: [
      {
        recommendation: 'Switch 30% of GPT-4 requests to GPT-3.5-turbo for low-complexity tasks',
        potential_savings: 150,
        difficulty: 'low',
        impact: 'high',
      },
      {
        recommendation: 'Implement response caching for frequently requested content',
        potential_savings: 75,
        difficulty: 'medium',
        impact: 'medium',
      },
      {
        recommendation: 'Optimize prompts to reduce token usage by 20%',
        potential_savings: 100,
        difficulty: 'low',
        impact: 'medium',
      },
      {
        recommendation: 'Use batch processing for non-urgent requests',
        potential_savings: 50,
        difficulty: 'high',
        impact: 'low',
      },
    ],
  };
}

// Create API object for convenient usage
export const costOptimizationApi = {
  getDashboardData: async (days?: number): Promise<CostDashboardData> => {
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - (days || 30) * 24 * 60 * 60 * 1000).toISOString();
    return fetchCostOptimizationData(startDate, endDate);
  },
  trackUsage: trackApiUsage,
  getModelComparison: fetchModelComparison,
  exportData: exportCostData,
  updateSettings: updateOptimizationSettings,
  generateMockData: generateMockCostData,
};

// Export all types and functions
export { CostOptimizationApiError };
export type { CostDashboardData, CostOptimizationMetrics, OptimizationComparison, TrackUsageData };
