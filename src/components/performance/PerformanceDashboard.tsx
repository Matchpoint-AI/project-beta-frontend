/** Performance monitoring dashboard component. */

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
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

import { performanceApi } from '../../api/performanceApi';

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

interface MetricsSummary {
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
}

interface Alert {
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

interface CostAnalysis {
  time_range_hours: number;
  total_cost: number;
  total_tokens: number;
  cost_per_1k_tokens: number;
  cost_by_operation: Record<string, number>;
  cost_by_model: Record<string, number>;
  trend: string | null;
  summary_stats: Record<string, number>;
}

interface HealthStatus {
  status: string;
  recent_metrics_count: number;
  active_alerts_count: number;
  thresholds_configured: number;
  last_check: string;
  error?: string;
}

const METRIC_TYPES = ['latency', 'error_rate', 'cost', 'quality', 'throughput'] as const;
const TIME_RANGES = [
  { label: '1 Hour', hours: 1 },
  { label: '6 Hours', hours: 6 },
  { label: '24 Hours', hours: 24 },
  { label: '3 Days', hours: 72 },
  { label: '7 Days', hours: 168 },
] as const;

const TrendIcon: React.FC<{ trend: string | null }> = ({ trend }) => {
  const iconClass = 'h-4 w-4';

  switch (trend) {
    case 'increasing':
      return <TrendingUp className={`${iconClass} text-red-500`} />;
    case 'decreasing':
      return <TrendingDown className={`${iconClass} text-green-500`} />;
    case 'stable':
      return <Minus className={`${iconClass} text-gray-500`} />;
    default:
      return <Activity className={`${iconClass} text-gray-400`} />;
  }
};

const AlertBadge: React.FC<{ severity: Alert['severity'] }> = ({ severity }) => {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';

  const severityClasses = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`${baseClass} ${severityClasses[severity]}`}>{severity.toUpperCase()}</span>
  );
};

export const PerformanceDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(24);
  const [selectedMetricType, setSelectedMetricType] = useState<string>('');

  // State for data
  const [metricsSummaries, setMetricsSummaries] = useState<Record<string, MetricsSummary>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

  // Loading states
  const [loading, setLoading] = useState({
    metrics: false,
    alerts: false,
    costs: false,
    health: false,
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading((prev) => ({ ...prev, metrics: true, alerts: true, costs: true, health: true }));

    try {
      // Fetch metrics summaries for each type
      const metricsPromises = METRIC_TYPES.map(async (metricType) => {
        const summary = await performanceApi.getMetricsSummary({
          metric_type: metricType,
          hours_back: selectedTimeRange,
        });
        return [metricType, summary];
      });

      const [metricsResults, alertsData, costData, healthData] = await Promise.all([
        Promise.all(metricsPromises),
        performanceApi.getActiveAlerts(),
        performanceApi.getCostAnalysis({ hours_back: selectedTimeRange }),
        performanceApi.getHealthCheck(),
      ]);

      // Update state
      const summariesMap = Object.fromEntries(metricsResults);
      setMetricsSummaries(summariesMap);
      setAlerts(alertsData);
      setCostAnalysis(costData);
      setHealthStatus(healthData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading({ metrics: false, alerts: false, costs: false, health: false });
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const resolveAlert = async (alertId: string) => {
    try {
      await performanceApi.resolveAlert(alertId);
      // Refresh alerts
      const updatedAlerts = await performanceApi.getActiveAlerts();
      setAlerts(updatedAlerts);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  // Prepare chart data
  const latencyData = {
    labels: ['P50', 'P95', 'P99', 'Max'],
    datasets: [
      {
        label: 'Response Time (seconds)',
        data: [
          metricsSummaries.latency?.median_value || 0,
          metricsSummaries.latency?.p95_value || 0,
          metricsSummaries.latency?.p99_value || 0,
          metricsSummaries.latency?.max_value || 0,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const costByOperationData = costAnalysis?.cost_by_operation
    ? {
        labels: Object.keys(costAnalysis.cost_by_operation),
        datasets: [
          {
            data: Object.values(costAnalysis.cost_by_operation),
            backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
          },
        ],
      }
    : null;

  const costByModelData = costAnalysis?.cost_by_model
    ? {
        labels: Object.keys(costAnalysis.cost_by_model),
        datasets: [
          {
            data: Object.values(costAnalysis.cost_by_model),
            backgroundColor: ['#06B6D4', '#84CC16', '#F97316', '#6366F1', '#EF4444', '#8B5CF6'],
          },
        ],
      }
    : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
        <div className="flex gap-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TIME_RANGES.map(({ label, hours }) => (
              <option key={hours} value={hours}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            disabled={Object.values(loading).some(Boolean)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Health Status */}
      {healthStatus && (
        <div
          className={`p-4 rounded-lg border ${
            healthStatus.status === 'healthy'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  healthStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <h3 className="text-lg font-semibold">System Health: {healthStatus.status}</h3>
            </div>
            <div className="text-sm text-gray-600">
              Last check: {new Date(healthStatus.last_check).toLocaleString()}
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
            <div>Recent Metrics: {healthStatus.recent_metrics_count}</div>
            <div>Active Alerts: {healthStatus.active_alerts_count}</div>
            <div>Thresholds: {healthStatus.thresholds_configured}</div>
          </div>
          {healthStatus.error && (
            <div className="mt-2 text-sm text-red-600">Error: {healthStatus.error}</div>
          )}
        </div>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {METRIC_TYPES.map((metricType) => {
          const summary = metricsSummaries[metricType];
          if (!summary || summary.count === 0) return null;

          return (
            <div key={metricType} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold capitalize">{metricType.replace('_', ' ')}</h3>
                <TrendIcon trend={summary.trend} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Count:</span>
                  <span className="font-medium">{summary.count}</span>
                </div>
                {summary.mean_value !== null && (
                  <div className="flex justify-between">
                    <span>Average:</span>
                    <span className="font-medium">{summary.mean_value.toFixed(3)}</span>
                  </div>
                )}
                {summary.p95_value !== null && (
                  <div className="flex justify-between">
                    <span>P95:</span>
                    <span className="font-medium">{summary.p95_value.toFixed(3)}</span>
                  </div>
                )}
                {summary.max_value !== null && (
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span className="font-medium">{summary.max_value.toFixed(3)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Response Time Distribution</h3>
          {metricsSummaries.latency?.count > 0 ? (
            <Bar
              data={latencyData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Seconds',
                    },
                  },
                },
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">No latency data available</div>
          )}
        </div>

        {/* Cost by Operation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Cost by Operation</h3>
          {costByOperationData ? (
            <Doughnut
              data={costByOperationData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">No cost data available</div>
          )}
        </div>
      </div>

      {/* Cost Analysis */}
      {costAnalysis && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Cost Analysis</h3>
            <TrendIcon trend={costAnalysis.trend} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${costAnalysis.total_cost.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {costAnalysis.total_tokens.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${(costAnalysis.cost_per_1k_tokens * 1000).toFixed(3)}
              </div>
              <div className="text-sm text-gray-600">Cost per 1K Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${costAnalysis.summary_stats.mean.toFixed(3)}
              </div>
              <div className="text-sm text-gray-600">Avg per Operation</div>
            </div>
          </div>

          {/* Cost by Model Chart */}
          {costByModelData && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Cost by Model</h4>
              <div className="h-64">
                <Doughnut
                  data={costByModelData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            <span className="text-sm text-gray-600">{alerts.length} active</span>
          </div>
        </div>
        <div className="divide-y">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No active alerts</div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-gray-600">
                        {alert.metric_type} • Threshold: {alert.threshold} • Actual:{' '}
                        {alert.actual_value}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertBadge severity={alert.severity} />
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-8">
                  Triggered: {new Date(alert.triggered_at).toLocaleString()}
                  {Object.keys(alert.labels).length > 0 && (
                    <span className="ml-4">
                      Labels:{' '}
                      {Object.entries(alert.labels)
                        .map(([k, v]) => `${k}=${v}`)
                        .join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
