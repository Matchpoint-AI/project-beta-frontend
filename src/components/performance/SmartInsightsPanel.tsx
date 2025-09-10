/** Smart Performance Insights Panel Component. */

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  BarChart3,
  Settings,
} from 'lucide-react';

interface SmartInsight {
  id: string;
  insight_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  confidence: string;
  title: string;
  description: string;
  current_value: number;
  predicted_value: number | null;
  impact_score: number;
  time_to_impact_minutes: number | null;
  recommendations: string[];
  automated_actions: string[];
  related_metrics: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

interface PerformancePrediction {
  metric_type: string;
  predicted_value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  prediction_horizon_hours: number;
  confidence_level: string;
  factors: string[];
  methodology: string;
}

interface OptimizationRecommendation {
  title: string;
  description: string;
  category: string;
  estimated_impact: string;
  effort_required: string;
  priority_score: number;
  implementation_steps: string[];
  risks: string[];
  success_metrics: string[];
}

interface InsightsSummary {
  timestamp: string;
  brand_id: string | null;
  insights_summary: {
    total_insights: number;
    by_type: Record<string, number>;
    by_severity: Record<string, number>;
  };
  health_score: number;
  health_status: string;
  top_recommendations: Array<{
    title: string;
    category: string;
    priority_score: number;
    estimated_impact: string;
  }>;
  key_metrics: {
    critical_issues: number;
    high_priority_issues: number;
    total_recommendations: number;
  };
}

const INSIGHT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'cost_optimization', label: 'Cost Optimization' },
  { value: 'anomaly_detection', label: 'Anomaly Detection' },
  { value: 'predictive_scaling', label: 'Predictive Scaling' },
  { value: 'model_recommendation', label: 'Model Recommendations' },
  { value: 'user_experience', label: 'User Experience' },
  { value: 'capacity_planning', label: 'Capacity Planning' },
];

const SEVERITY_LEVELS = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'info', label: 'Info' },
];

const SeverityIcon: React.FC<{ severity: SmartInsight['severity'] }> = ({ severity }) => {
  const iconClass = 'h-4 w-4';

  switch (severity) {
    case 'critical':
      return <XCircle className={`${iconClass} text-red-500`} />;
    case 'high':
      return <AlertTriangle className={`${iconClass} text-orange-500`} />;
    case 'medium':
      return <Info className={`${iconClass} text-yellow-500`} />;
    case 'low':
      return <CheckCircle className={`${iconClass} text-blue-500`} />;
    case 'info':
      return <Info className={`${iconClass} text-gray-500`} />;
    default:
      return <Info className={`${iconClass} text-gray-400`} />;
  }
};

const InsightTypeIcon: React.FC<{ insightType: string }> = ({ insightType }) => {
  const iconClass = 'h-4 w-4';

  switch (insightType) {
    case 'cost_optimization':
      return <Target className={`${iconClass} text-green-500`} />;
    case 'anomaly_detection':
      return <AlertTriangle className={`${iconClass} text-red-500`} />;
    case 'predictive_scaling':
      return <TrendingUp className={`${iconClass} text-blue-500`} />;
    case 'model_recommendation':
      return <Settings className={`${iconClass} text-purple-500`} />;
    case 'user_experience':
      return <Lightbulb className={`${iconClass} text-yellow-500`} />;
    case 'capacity_planning':
      return <BarChart3 className={`${iconClass} text-indigo-500`} />;
    default:
      return <Info className={`${iconClass} text-gray-400`} />;
  }
};

const SeverityBadge: React.FC<{ severity: SmartInsight['severity'] }> = ({ severity }) => {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';

  const severityClasses = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
    info: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`${baseClass} ${severityClasses[severity]}`}>{severity.toUpperCase()}</span>
  );
};

const ConfidenceBadge: React.FC<{ confidence: string }> = ({ confidence }) => {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';

  const confidenceClasses = {
    very_high: 'bg-green-100 text-green-800',
    high: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-orange-100 text-orange-800',
    very_low: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`${baseClass} ${confidenceClasses[confidence as keyof typeof confidenceClasses] || 'bg-gray-100 text-gray-800'}`}
    >
      {confidence.replace('_', ' ').toUpperCase()}
    </span>
  );
};

export const SmartInsightsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'insights' | 'predictions' | 'recommendations' | 'summary'
  >('summary');

  // Filters
  const [selectedInsightType, setSelectedInsightType] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [lookbackHours, setLookbackHours] = useState(168); // 1 week

  // Data states
  const [summary, setSummary] = useState<InsightsSummary | null>(null);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [predictions, setPredictions] = useState<PerformancePrediction[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    summary: false,
    insights: false,
    predictions: false,
    recommendations: false,
  });

  // Fetch data functions
  const fetchSummary = async () => {
    setLoading((prev) => ({ ...prev, summary: true }));
    try {
      const response = await fetch('/api/v1/insights/summary', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const _data = await response.json();
        setSummary(_data);
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading((prev) => ({ ...prev, summary: false }));
    }
  };

  const fetchInsights = async () => {
    setLoading((prev) => ({ ...prev, insights: true }));
    try {
      const params = new URLSearchParams();
      params.set('lookback_hours', lookbackHours.toString());
      if (selectedInsightType) params.set('insight_types', selectedInsightType);
      if (selectedSeverity) params.set('min_severity', selectedSeverity);

      const response = await fetch(`/api/v1/insights/smart?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const _data = await response.json();
        setInsights(_data);
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading((prev) => ({ ...prev, insights: false }));
    }
  };

  const fetchPredictions = async () => {
    setLoading((prev) => ({ ...prev, predictions: true }));
    try {
      const response = await fetch(
        '/api/v1/insights/predictions?metric_types=latency&metric_types=cost&prediction_hours=24',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );
      if (response.ok) {
        const _data = await response.json();
        setPredictions(_data);
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading((prev) => ({ ...prev, predictions: false }));
    }
  };

  const fetchRecommendations = async () => {
    setLoading((prev) => ({ ...prev, recommendations: true }));
    try {
      const response = await fetch('/api/v1/insights/recommendations?limit=10', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const _data = await response.json();
        setRecommendations(_data);
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading((prev) => ({ ...prev, recommendations: false }));
    }
  };

  const submitFeedback = async (insightId: string, feedbackType: string) => {
    try {
      await fetch(
        `/api/v1/insights/feedback?insight_id=${insightId}&feedback_type=${feedbackType}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );
      // Optionally show success message
    } catch (_error) {
      // Error handled silently
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSummary();
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'insights':
        fetchInsights();
        break;
      case 'predictions':
        fetchPredictions();
        break;
      case 'recommendations':
        fetchRecommendations();
        break;
    }
  }, [activeTab, selectedInsightType, selectedSeverity, lookbackHours]);

  const renderSummaryTab = () => {
    if (loading.summary) {
      return <div className="p-6 text-center">Loading summary...</div>;
    }

    if (!summary) {
      return <div className="p-6 text-center text-gray-500">No summary data available</div>;
    }

    return (
      <div className="space-y-6">
        {/* Health Overview */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Health Overview</h3>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  summary.health_status === 'excellent'
                    ? 'bg-green-500'
                    : summary.health_status === 'good'
                      ? 'bg-blue-500'
                      : summary.health_status === 'fair'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                }`}
              />
              <span className="font-medium capitalize">{summary.health_status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{summary.health_score}</div>
              <div className="text-sm text-gray-600">Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {summary.key_metrics.critical_issues}
              </div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {summary.key_metrics.high_priority_issues}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {summary.key_metrics.total_recommendations}
              </div>
              <div className="text-sm text-gray-600">Recommendations</div>
            </div>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Top Recommendations</h3>
          <div className="space-y-3">
            {summary.top_recommendations.map((rec, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {rec.category} • {rec.estimated_impact}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{rec.priority_score.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">Priority</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Breakdown */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Insights Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">By Type</h4>
              {Object.entries(summary.insights_summary.by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-2">By Severity</h4>
              {Object.entries(summary.insights_summary.by_severity).map(([severity, count]) => (
                <div key={severity} className="flex justify-between text-sm">
                  <span className="capitalize">{severity}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInsightsTab = () => {
    return (
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insight Type</label>
              <select
                value={selectedInsightType}
                onChange={(e) => setSelectedInsightType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {INSIGHT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Severity
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SEVERITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lookback Hours</label>
              <select
                value={lookbackHours}
                onChange={(e) => setLookbackHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={24}>24 Hours</option>
                <option value={72}>3 Days</option>
                <option value={168}>1 Week</option>
                <option value={336}>2 Weeks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Insights List */}
        {loading.insights ? (
          <div className="p-6 text-center">Loading insights...</div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <InsightTypeIcon insightType={insight.insight_type} />
                    <SeverityIcon severity={insight.severity} />
                    <h3 className="text-lg font-semibold">{insight.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={insight.severity} />
                    <ConfidenceBadge confidence={insight.confidence} />
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{insight.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {insight.current_value.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Current Value</div>
                  </div>
                  {insight.predicted_value !== null && (
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-purple-600">
                        {insight.predicted_value.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Predicted Value</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {insight.impact_score.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Impact Score</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {insight.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {/* Automated Actions */}
                {insight.automated_actions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Automated Actions:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {insight.automated_actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => submitFeedback(insight.id, 'helpful')}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Helpful
                  </button>
                  <button
                    onClick={() => submitFeedback(insight.id, 'not_helpful')}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Not Helpful
                  </button>
                  <button
                    onClick={() => submitFeedback(insight.id, 'dismissed')}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
            {insights.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No insights found for the selected criteria
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPredictionsTab = () => {
    return (
      <div className="space-y-4">
        {loading.predictions ? (
          <div className="p-6 text-center">Loading predictions...</div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold capitalize">
                    {prediction.metric_type.replace('_', ' ')} Prediction
                  </h3>
                  <ConfidenceBadge confidence={prediction.confidence_level} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="text-3xl font-bold text-blue-600">
                      {prediction.predicted_value.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Predicted Value</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {prediction.confidence_interval.lower.toFixed(2)} -{' '}
                      {prediction.confidence_interval.upper.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Confidence Interval</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {prediction.prediction_horizon_hours}h
                    </div>
                    <div className="text-sm text-gray-600">Horizon</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Factors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.factors.map((factor, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {factor.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {predictions.length === 0 && (
              <div className="p-6 text-center text-gray-500">No predictions available</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRecommendationsTab = () => {
    return (
      <div className="space-y-4">
        {loading.recommendations ? (
          <div className="p-6 text-center">Loading recommendations...</div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{rec.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded capitalize">
                      {rec.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      Priority: {rec.priority_score.toFixed(0)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{rec.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{rec.estimated_impact}</div>
                    <div className="text-sm text-gray-600">Estimated Impact</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="font-bold text-yellow-600 capitalize">
                      {rec.effort_required}
                    </div>
                    <div className="text-sm text-gray-600">Effort Required</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="font-bold text-purple-600">
                      {rec.priority_score.toFixed(0)}/100
                    </div>
                    <div className="text-sm text-gray-600">Priority Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Implementation Steps:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                      {rec.implementation_steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Success Metrics:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {rec.success_metrics.map((metric, i) => (
                        <li key={i}>{metric}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {rec.risks.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded">
                    <h4 className="font-medium text-red-800 mb-2">Risks to Consider:</h4>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {rec.risks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {recommendations.length === 0 && (
              <div className="p-6 text-center text-gray-500">No recommendations available</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Smart Performance Insights</h1>
        <p className="text-gray-600">
          AI-powered insights, predictions, and optimization recommendations
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'summary', label: 'Summary', icon: BarChart3 },
            { id: 'insights', label: 'Smart Insights', icon: Lightbulb },
            { id: 'predictions', label: 'Predictions', icon: TrendingUp },
            { id: 'recommendations', label: 'Recommendations', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'insights' | 'predictions' | 'recommendations' | 'summary')
                }
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && renderSummaryTab()}
      {activeTab === 'insights' && renderInsightsTab()}
      {activeTab === 'predictions' && renderPredictionsTab()}
      {activeTab === 'recommendations' && renderRecommendationsTab()}
    </div>
  );
};
