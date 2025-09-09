/**
 * Cost Optimization API Client
 * 
 * Provides methods to interact with the cost optimization tracking backend service.
 * Handles authentication, error handling, and data transformation for the frontend.
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
  current_model_distribution: Record<string, { requests: number; cost: number; percentage: number }>;
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
}

interface OptimizationComparison {
  optimization_type: string;
  period_days: number;
  total_requests: number;
  cost_metrics: {
    optimized_cost: number;
    baseline_cost: number;
    absolute_savings: number;
    percentage_savings: number;
    cost_per_request: number;
  };
  quality_metrics: {
    average_quality_score: number;
    quality_distribution: Record<string, number>;
  };
  performance_metrics: {
    average_latency_ms: number;
    latency_percentiles: Record<string, number>;
  };
  model_usage: Record<string, number>;
  usage_patterns: Record<string, any>;
  recommendations: string[];
}

interface TrackUsageData {
  model_used: string;
  task_type: string;
  tokens_used: number;
  cost_incurred: number;
  quality_score?: number;
  latency_ms?: number;
  user_id?: string;
  brand_id?: string;
}

class CostOptimizationApiError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'CostOptimizationApiError';
  }
}

/**
 * API client for cost optimization tracking and analytics
 */
export const costOptimizationApi = {
  /**
   * Get comprehensive cost optimization dashboard data
   */
  getDashboardData: async (days: number = 30, brandId?: string): Promise<CostDashboardData> => {
    try {
      const token = await getToken();
      const params = new URLSearchParams({ days: days.toString() });
      if (brandId) {
        params.append('brand_id', brandId);
      }

      const response = await fetch(
        `${CONTENT_GEN_URL}/api/v1/cost-optimization/dashboard?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new CostOptimizationApiError(
          error.detail || 'Failed to fetch dashboard data',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof CostOptimizationApiError) {
        throw error;
      }
      throw new CostOptimizationApiError('Network error fetching dashboard data');
    }
  },

  /**
   * Get detailed comparison for specific optimization type
   */
  getOptimizationComparison: async (
    optimizationType: string,
    days: number = 7
  ): Promise<OptimizationComparison> => {
    try {
      const token = await getToken();
      const params = new URLSearchParams({ 
        days: days.toString(),
        optimization_type: optimizationType 
      });

      const response = await fetch(
        `${CONTENT_GEN_URL}/api/v1/cost-optimization/comparison?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new CostOptimizationApiError(
          error.detail || 'Failed to fetch optimization comparison',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof CostOptimizationApiError) {
        throw error;
      }
      throw new CostOptimizationApiError('Network error fetching optimization comparison');
    }
  },

  /**
   * Track usage of an optimized model for cost analysis
   */
  trackOptimizationUsage: async (data: TrackUsageData): Promise<{ document_id: string }> => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${CONTENT_GEN_URL}/api/v1/cost-optimization/track-usage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new CostOptimizationApiError(
          error.detail || 'Failed to track optimization usage',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof CostOptimizationApiError) {
        throw error;
      }
      throw new CostOptimizationApiError('Network error tracking optimization usage');
    }
  },

  /**
   * Get cost savings summary for a specific time period
   */
  getCostSavingsSummary: async (days: number = 30, brandId?: string): Promise<{
    total_savings: number;
    percentage_savings: number;
    projected_annual: number;
    by_optimization: Record<string, number>;
  }> => {
    try {
      const dashboardData = await costOptimizationApi.getDashboardData(days, brandId);
      
      const byOptimization: Record<string, number> = {};
      dashboardData.optimization_metrics.forEach(metric => {
        byOptimization[metric.optimization_type] = metric.absolute_savings;
      });

      return {
        total_savings: dashboardData.total_absolute_savings,
        percentage_savings: dashboardData.total_percentage_savings,
        projected_annual: dashboardData.projected_annual_savings,
        by_optimization: byOptimization
      };
    } catch (error) {
      if (error instanceof CostOptimizationApiError) {
        throw error;
      }
      throw new CostOptimizationApiError('Failed to get cost savings summary');
    }
  },

  /**
   * Get model usage statistics
   */
  getModelUsageStats: async (days: number = 30): Promise<{
    total_requests: number;
    models: Record<string, {
      requests: number;
      cost: number;
      percentage: number;
      avg_cost_per_request: number;
    }>;
  }> => {
    try {
      const dashboardData = await costOptimizationApi.getDashboardData(days);
      
      let totalRequests = 0;
      const models: Record<string, any> = {};

      Object.entries(dashboardData.current_model_distribution).forEach(([model, data]) => {
        totalRequests += data.requests;
        models[model] = {
          ...data,
          avg_cost_per_request: data.cost / data.requests || 0
        };
      });

      return {
        total_requests: totalRequests,
        models
      };
    } catch (error) {
      if (error instanceof CostOptimizationApiError) {
        throw error;
      }
      throw new CostOptimizationApiError('Failed to get model usage stats');
    }
  },

  /**
   * Get budget utilization and alerts
   */
  getBudgetStatus: async (days: number = 30): Promise<{
    utilization: number;
    alerts: Array<{
      type: string;
      severity: string;
      message: string;
    }>;
    projected_monthly_cost: number;
    monthly_budget: number;
  }> => {
    try {
      const dashboardData = await costOptimizationApi.getDashboardData(days);
      
      // Calculate projected monthly cost
      const dailyAvgCost = dashboardData.total_optimized_cost / days;
      const projectedMonthlyCost = dailyAvgCost * 30;
      const monthlyBudget = 5000; // This would come from user settings

      return {
        utilization: dashboardData.budget_utilization,
        alerts: dashboardData.cost_alerts,
        projected_monthly_cost: projectedMonthlyCost,
        monthly_budget: monthlyBudget
      };
    } catch (error) {
      if (error instanceof CostOptimizationApiError) {
        throw error;
      }
      throw new CostOptimizationApiError('Failed to get budget status');
    }
  },

  /**
   * Get cost trends over time
   */
  getCostTrends: async (days: number = 30): Promise<{
    daily_costs: Array<{ date: string; cost: number; savings: number }>;
    weekly_summary: Array<{ week: string; cost: number; savings: number }>;
    efficiency_trend: Array<{ date: string; efficiency: number }>;
  }> => {
    try {
      const dashboardData = await costOptimizationApi.getDashboardData(days);

      // Transform daily savings data
      const dailyCosts = dashboardData.daily_savings.map(day => ({
        date: day.date,
        cost: day.optimized_cost,
        savings: day.daily_savings
      }));

      // Calculate weekly summaries
      const weeklySummary: Record<string, { cost: number; savings: number; days: number }> = {};
      
      dashboardData.daily_savings.forEach(day => {
        const date = new Date(day.date);
        const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
        
        if (!weeklySummary[week]) {
          weeklySummary[week] = { cost: 0, savings: 0, days: 0 };
        }
        
        weeklySummary[week].cost += day.optimized_cost;
        weeklySummary[week].savings += day.daily_savings;
        weeklySummary[week].days += 1;
      });

      const weeklyArray = Object.entries(weeklySummary).map(([week, data]) => ({
        week,
        cost: data.cost,
        savings: data.savings
      }));

      // Efficiency trend
      const efficiencyTrend = dashboardData.cost_efficiency_trend.map(point => ({
        date: point.date,
        efficiency: point.cost_efficiency
      }));

      return {
        daily_costs: dailyCosts,
        weekly_summary: weeklyArray,
        efficiency_trend: efficiencyTrend
      };
    } catch (error) {
      if (error instanceof CostOptimizationApiError) {
        throw error;
      }
      throw new CostOptimizationApiError('Failed to get cost trends');
    }
  }
};

export { CostOptimizationApiError };
export type { CostDashboardData, CostOptimizationMetrics, OptimizationComparison, TrackUsageData };