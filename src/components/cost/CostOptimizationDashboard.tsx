/**
 * Cost Optimization Dashboard Component
 *
 * Tracks and visualizes the 90% cost reduction achievements from COST-1 through COST-6:
 * - GPT-4o to GPT-4o-mini vision switch (94% reduction, $85K annually)
 * - Gemini 2.5 Flash-Lite routing (67% cheaper than GPT-4o-mini, $50K annually)
 * - FLUX.1 [schnell] for high volume (10x cheaper, $75K annually)
 * - Imagen 4 for text-in-image clarity (95% legibility improvement)
 * - Smart Model Router v2 (90% total cost reduction)
 * - Scene Mix Engine contextual bandits (25% engagement boost)
 */

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  DollarSign,
  TrendingUp,
  Target,
  AlertTriangle,
  Zap,
  Eye,
  Image as ImageIcon,
  Cpu,
  Settings,
  Award,
} from 'lucide-react';

import { costOptimizationApi } from '../../api/costOptimizationApi';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
}

const OPTIMIZATION_CONFIG = {
  vision_model_switch: {
    name: 'Vision Model Switch',
    icon: Eye,
    description: 'GPT-4o → GPT-4o-mini',
    expectedSavings: 94,
    targetAnnualSavings: 85000,
    color: '#10B981', // emerald-500
  },
  gemini_routing: {
    name: 'Gemini Routing',
    icon: Zap,
    description: 'Gemini 2.5 Flash-Lite',
    expectedSavings: 67,
    targetAnnualSavings: 50000,
    color: '#3B82F6', // blue-500
  },
  flux_high_volume: {
    name: 'FLUX High Volume',
    icon: ImageIcon,
    description: 'FLUX.1 [schnell]',
    expectedSavings: 90,
    targetAnnualSavings: 75000,
    color: '#8B5CF6', // violet-500
  },
  imagen_text_clarity: {
    name: 'Imagen Text Clarity',
    icon: Target,
    description: 'Imagen 4 for text-in-image',
    expectedSavings: 50,
    targetAnnualSavings: 25000,
    color: '#F59E0B', // amber-500
  },
  smart_router_v2: {
    name: 'Smart Router v2',
    icon: Cpu,
    description: 'Intelligent model routing',
    expectedSavings: 90,
    targetAnnualSavings: 100000,
    color: '#EF4444', // red-500
  },
  scene_mix_bandits: {
    name: 'Scene Mix Engine',
    icon: Settings,
    description: 'Contextual bandits',
    expectedSavings: 25,
    targetAnnualSavings: 30000,
    color: '#06B6D4', // cyan-500
  },
};

const TIME_RANGES = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
] as const;

export const CostOptimizationDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<CostDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(30);
  const [_selectedOptimization, setSelectedOptimization] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await costOptimizationApi.getDashboardData(selectedTimeRange);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cost dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getSavingsColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOptimizationIcon = (type: string) => {
    const config = OPTIMIZATION_CONFIG[type as keyof typeof OPTIMIZATION_CONFIG];
    const IconComponent = config?.icon || Settings;
    return <IconComponent className="h-5 w-5" />;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const createSavingsTrendChart = () => {
    if (!dashboardData?.daily_savings) return null;

    const data = {
      labels: dashboardData.daily_savings.map((d) => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Daily Savings',
          data: dashboardData.daily_savings.map((d) => d.daily_savings),
          borderColor: '#10B981',
          backgroundColor: '#10B98120',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Cumulative Savings',
          data: dashboardData.daily_savings.map((d) => d.cumulative_savings),
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F620',
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };

    const options = {
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: 'Cost Savings Trend Over Time',
        },
        legend: {
          position: 'top' as const,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Daily Savings ($)',
          },
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Cumulative Savings ($)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const createOptimizationComparisonChart = () => {
    if (!dashboardData?.optimization_metrics) return null;

    const metrics = dashboardData.optimization_metrics.filter(
      (m) => OPTIMIZATION_CONFIG[m.optimization_type as keyof typeof OPTIMIZATION_CONFIG]
    );

    const data = {
      labels: metrics.map(
        (m) =>
          OPTIMIZATION_CONFIG[m.optimization_type as keyof typeof OPTIMIZATION_CONFIG]?.name ||
          m.optimization_type
      ),
      datasets: [
        {
          label: 'Annual Savings ($)',
          data: metrics.map((m) => m.projected_annual_savings),
          backgroundColor: metrics.map(
            (m) =>
              OPTIMIZATION_CONFIG[m.optimization_type as keyof typeof OPTIMIZATION_CONFIG]?.color ||
              '#6B7280'
          ),
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Annual Savings by Optimization Type',
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Annual Savings ($)',
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const createModelDistributionChart = () => {
    if (!dashboardData?.current_model_distribution) return null;

    const models = Object.entries(dashboardData.current_model_distribution);

    const data = {
      labels: models.map(([model]) =>
        model.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      ),
      datasets: [
        {
          data: models.map(([, data]) => data.percentage),
          backgroundColor: [
            '#10B981', // emerald
            '#3B82F6', // blue
            '#8B5CF6', // violet
            '#F59E0B', // amber
            '#EF4444', // red
            '#06B6D4', // cyan
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Current Model Usage Distribution',
        },
        legend: {
          position: 'right' as const,
        },
      },
    };

    return <Doughnut data={data} options={options} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Error loading cost dashboard: {error}</span>
        </div>
        <Button onClick={fetchDashboardData} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cost Optimization Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track the 90% cost reduction achievement through AI model optimizations
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.days} value={range.days}>
                {range.label}
              </option>
            ))}
          </select>

          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Savings */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData.total_absolute_savings)}
              </p>
              <p className="text-sm text-green-600">
                {formatPercentage(dashboardData.total_percentage_savings)} reduction
              </p>
            </div>
          </div>
        </Card>

        {/* Annual Projection */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annual Projection</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData.projected_annual_savings)}
              </p>
              <p className="text-sm text-blue-600">Based on current trend</p>
            </div>
          </div>
        </Card>

        {/* Quality Impact */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quality Impact</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.overall_quality_impact > 0 ? '+' : ''}
                {formatPercentage(dashboardData.overall_quality_impact * 100)}
              </p>
              <p
                className={`text-sm ${
                  dashboardData.overall_quality_impact >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {dashboardData.overall_quality_impact >= 0 ? 'Maintained' : 'Decreased'}
              </p>
            </div>
          </div>
        </Card>

        {/* Budget Utilization */}
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Target className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(dashboardData.budget_utilization * 100)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-amber-600 h-2 rounded-full"
                  style={{ width: `${dashboardData.budget_utilization * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Optimization Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.optimization_metrics.map((metric) => {
          const config =
            OPTIMIZATION_CONFIG[metric.optimization_type as keyof typeof OPTIMIZATION_CONFIG];
          if (!config) return null;

          return (
            <Card
              key={metric.optimization_type}
              className="p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedOptimization(metric.optimization_type)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${config.color}20` }}>
                    {getOptimizationIcon(metric.optimization_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{config.name}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    metric.percentage_savings >= config.expectedSavings ? 'success' : 'warning'
                  }
                >
                  {metric.percentage_savings >= config.expectedSavings
                    ? 'On Track'
                    : 'Below Target'}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Savings:</span>
                  <span className={`font-semibold ${getSavingsColor(metric.percentage_savings)}`}>
                    {formatPercentage(metric.percentage_savings)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Annual:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(metric.projected_annual_savings)}
                  </span>
                </div>

                {metric.quality_impact !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality:</span>
                    <span
                      className={`font-semibold ${
                        metric.quality_impact >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.quality_impact > 0 ? '+' : ''}
                      {formatPercentage(metric.quality_impact * 100)}
                    </span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (metric.percentage_savings / config.expectedSavings) * 100)}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Trend */}
        <Card className="p-6">
          <div className="h-80">{createSavingsTrendChart()}</div>
        </Card>

        {/* Optimization Comparison */}
        <Card className="p-6">
          <div className="h-80">{createOptimizationComparisonChart()}</div>
        </Card>

        {/* Model Distribution */}
        <Card className="p-6">
          <div className="h-80 flex items-center justify-center">
            {createModelDistributionChart()}
          </div>
        </Card>

        {/* Efficiency Trend */}
        <Card className="p-6">
          <div className="h-80">
            <Line
              data={{
                labels: dashboardData.cost_efficiency_trend.map((d) =>
                  new Date(d.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: 'Cost Efficiency',
                    data: dashboardData.cost_efficiency_trend.map((d) => d.cost_efficiency * 100),
                    borderColor: '#8B5CF6',
                    backgroundColor: '#8B5CF620',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Cost Efficiency Trend',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Efficiency (%)',
                    },
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {dashboardData.cost_alerts.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Alerts</h2>
          <div className="space-y-3">
            {dashboardData.cost_alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : alert.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start">
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical'
                        ? 'text-red-500'
                        : alert.severity === 'warning'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                    }`}
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">
                      {OPTIMIZATION_CONFIG[alert.optimization as keyof typeof OPTIMIZATION_CONFIG]
                        ?.name || alert.optimization}
                    </h3>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    {alert.expected_value && (
                      <p className="text-xs text-gray-500 mt-1">
                        Expected: {alert.expected_value}, Current: {alert.current_value.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Savings Opportunities */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Savings Opportunities</h2>
        <div className="space-y-3">
          {dashboardData.top_savings_by_optimization.slice(0, 5).map((opportunity, index) => {
            const config =
              OPTIMIZATION_CONFIG[
                opportunity.optimization_type as keyof typeof OPTIMIZATION_CONFIG
              ];
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${config?.color || '#6B7280'}20` }}
                  >
                    {getOptimizationIcon(opportunity.optimization_type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {config?.name || opportunity.optimization_type}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatPercentage(opportunity.percentage_savings)} savings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(opportunity.annual_savings)}
                  </p>
                  <p className="text-sm text-gray-600">Annual potential</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
