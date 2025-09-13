/**
 * Performance Prediction Dashboard component with AI-powered insights.
 */

import React, { useState, useEffect } from 'react';
import {
  FaExclamationCircle as AlertCircle,
  FaBullseye as Target,
  FaUsers as Users,
  FaHeart as Heart,
  FaCommentAlt as MessageCircle,
  FaShareAlt as Share2,
  FaEye as Eye,
  FaStar as Sparkles,
  FaClock as Clock,
  FaChevronUp as ChevronUp,
  FaChevronDown as ChevronDown,
} from 'react-icons/fa';
import { CircularProgress, LinearProgress, Chip } from '@mui/material';
import { useAuth } from '../../auth/context/AuthContext';

// Performance visualization component without external chart dependencies

interface PredictionMetric {
  label: string;
  value: number;
  predicted: number;
  change: number;
  confidence: number;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface CampaignPrediction {
  campaignId: string;
  campaignName: string;
  predictedReach: number;
  predictedEngagement: number;
  predictedConversions: number;
  confidenceScore: number;
  performanceScore: number;
  recommendations: string[];
}

interface ContentPerformance {
  contentType: string;
  currentPerformance: number;
  predictedPerformance: number;
  optimalTime: string;
  suggestedTags: string[];
}

const PerformancePredictionDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [_selectedMetric, _setSelectedMetric] = useState('engagement');
  const [predictions, setPredictions] = useState<PredictionMetric[]>([]);
  const [campaignPredictions, setCampaignPredictions] = useState<CampaignPrediction[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);

  useEffect(() => {
    loadPredictionData();
  }, [timeRange, profile]);

  const loadPredictionData = async () => {
    setLoading(true);
    try {
      // Simulate AI prediction calculation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate prediction metrics
      const mockPredictions: PredictionMetric[] = [
        {
          label: 'Engagement Rate',
          value: 4.8,
          predicted: 6.2,
          change: 29.2,
          confidence: 87,
          icon: <Heart className="w-5 h-5" />,
          color: '#EF4444',
          trend: 'up',
        },
        {
          label: 'Reach',
          value: 15234,
          predicted: 19804,
          change: 30.0,
          confidence: 92,
          icon: <Users className="w-5 h-5" />,
          color: '#3B82F6',
          trend: 'up',
        },
        {
          label: 'Comments',
          value: 342,
          predicted: 425,
          change: 24.3,
          confidence: 78,
          icon: <MessageCircle className="w-5 h-5" />,
          color: '#10B981',
          trend: 'up',
        },
        {
          label: 'Shares',
          value: 89,
          predicted: 112,
          change: 25.8,
          confidence: 82,
          icon: <Share2 className="w-5 h-5" />,
          color: '#8B5CF6',
          trend: 'up',
        },
        {
          label: 'Impressions',
          value: 48392,
          predicted: 58470,
          change: 20.8,
          confidence: 90,
          icon: <Eye className="w-5 h-5" />,
          color: '#F59E0B',
          trend: 'up',
        },
        {
          label: 'Click Rate',
          value: 2.3,
          predicted: 3.1,
          change: 34.8,
          confidence: 75,
          icon: <Target className="w-5 h-5" />,
          color: '#EC4899',
          trend: 'up',
        },
      ];

      // Generate campaign predictions
      const mockCampaignPredictions: CampaignPrediction[] = [
        {
          campaignId: '1',
          campaignName: 'Summer Collection Launch',
          predictedReach: 45000,
          predictedEngagement: 8.5,
          predictedConversions: 320,
          confidenceScore: 88,
          performanceScore: 92,
          recommendations: [
            'Post at 2 PM on weekdays for 35% better engagement',
            'Include user-generated content for 28% reach boost',
            'Add trending hashtags #SummerVibes #NewCollection',
          ],
        },
        {
          campaignId: '2',
          campaignName: 'Product Tutorial Series',
          predictedReach: 28000,
          predictedEngagement: 12.3,
          predictedConversions: 185,
          confidenceScore: 85,
          performanceScore: 78,
          recommendations: [
            'Create 60-second video tutorials for 45% better retention',
            'Use carousel posts for product features',
            'Schedule posts at 6 PM for working professionals',
          ],
        },
      ];

      // Generate content performance predictions
      const mockContentPerformance: ContentPerformance[] = [
        {
          contentType: 'Video Reels',
          currentPerformance: 75,
          predictedPerformance: 92,
          optimalTime: '7:00 PM - 9:00 PM',
          suggestedTags: ['#Trending', '#ViralContent', '#MustWatch'],
        },
        {
          contentType: 'Product Photos',
          currentPerformance: 68,
          predictedPerformance: 81,
          optimalTime: '12:00 PM - 2:00 PM',
          suggestedTags: ['#ProductLaunch', '#NewArrival', '#ShopNow'],
        },
        {
          contentType: 'User Stories',
          currentPerformance: 82,
          predictedPerformance: 89,
          optimalTime: '8:00 AM - 10:00 AM',
          suggestedTags: ['#CustomerLove', '#RealStories', '#Testimonial'],
        },
      ];

      setPredictions(mockPredictions);
      setCampaignPredictions(mockCampaignPredictions);
      setContentPerformance(mockContentPerformance);
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  // Simple visualization data for CSS-based charts
  const performanceTrendData = [
    { label: 'Mon', actual: 65, predicted: null },
    { label: 'Tue', actual: 68, predicted: null },
    { label: 'Wed', actual: 70, predicted: null },
    { label: 'Thu', actual: 74, predicted: null },
    { label: 'Fri', actual: 72, predicted: null },
    { label: 'Sat', actual: 78, predicted: null },
    { label: 'Sun', actual: 82, predicted: 82 },
    { label: 'Mon*', actual: null, predicted: 88 },
    { label: 'Tue*', actual: null, predicted: 92 },
    { label: 'Wed*', actual: null, predicted: 95 },
  ];

  const engagementDistribution = [
    { label: 'Likes', value: 35, color: '#EF4444' },
    { label: 'Comments', value: 25, color: '#3B82F6' },
    { label: 'Shares', value: 15, color: '#10B981' },
    { label: 'Saves', value: 15, color: '#F59E0B' },
    { label: 'Clicks', value: 10, color: '#8B5CF6' },
  ];

  const confidenceColors = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <CircularProgress size={60} thickness={4} />
          <p className="mt-4 text-gray-600">Analyzing performance patterns...</p>
          <p className="text-sm text-gray-500 mt-2">AI is predicting future metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Performance Predictions
          </h2>
          <p className="text-gray-600 mt-1">AI-powered insights for future campaign performance</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Prediction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {predictions.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${metric.color}20` }}>
                <div style={{ color: metric.color }}>{metric.icon}</div>
              </div>
              <Chip
                label={`${metric.confidence}% sure`}
                size="small"
                className={confidenceColors(metric.confidence)}
              />
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">
                {metric.value < 100 ? `${metric.value}%` : metric.value.toLocaleString()}
              </p>
              <div className="flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <ChevronUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {metric.change}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Predicted</span>
                <span className="font-medium">
                  {metric.predicted < 100
                    ? `${metric.predicted}%`
                    : metric.predicted.toLocaleString()}
                </span>
              </div>
              <LinearProgress
                variant="determinate"
                value={(metric.predicted / (metric.predicted + metric.value)) * 100}
                className="h-2 rounded-full"
                sx={{
                  backgroundColor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: metric.color,
                  },
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Performance Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trajectory</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Predicted</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-2 px-4">
            {performanceTrendData.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative h-48 w-8 bg-gray-100 rounded-t">
                  {point.actual && (
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t opacity-80"
                      style={{ height: `${(point.actual / 100) * 192}px` }}
                    />
                  )}
                  {point.predicted && (
                    <div
                      className="absolute bottom-0 w-full bg-green-500 rounded-t opacity-60"
                      style={{ height: `${(point.predicted / 100) * 192}px` }}
                    />
                  )}
                </div>
                <span className="text-xs mt-1 text-gray-600">{point.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>AI Insight:</strong> Your content performance is expected to increase by 32%
              over the next 3 days based on current engagement patterns and seasonal trends.
            </p>
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Mix</h3>
          <div className="h-48 relative flex items-center justify-center">
            <div className="relative w-32 h-32">
              {engagementDistribution.map((item, index) => {
                const radius = 64;
                const circumference = 2 * Math.PI * radius;
                const offset = engagementDistribution
                  .slice(0, index)
                  .reduce((acc, curr) => acc + curr.value, 0);
                const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((offset / 100) * circumference);

                return (
                  <svg
                    key={index}
                    className="absolute inset-0 transform -rotate-90"
                    width="128"
                    height="128"
                  >
                    <circle
                      cx="64"
                      cy="64"
                      r="64"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="12"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      opacity="0.8"
                    />
                  </svg>
                );
              })}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-600">Engagement</div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            {engagementDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-600">
              <strong>Optimize for:</strong> Comments & Shares
            </p>
            <p className="text-xs text-gray-500">These metrics show highest growth potential</p>
          </div>
        </div>
      </div>

      {/* Campaign Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaignPredictions.map((campaign) => (
          <div key={campaign.campaignId} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{campaign.campaignName}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Performance Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${campaign.performanceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {campaign.performanceScore}
                    </span>
                  </div>
                </div>
              </div>
              <Chip
                label={`${campaign.confidenceScore}% confidence`}
                size="small"
                color={campaign.confidenceScore >= 85 ? 'success' : 'warning'}
                variant="outlined"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Predicted Reach</p>
                <p className="text-lg font-bold text-gray-900">
                  {(campaign.predictedReach / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Heart className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Engagement</p>
                <p className="text-lg font-bold text-gray-900">{campaign.predictedEngagement}%</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Conversions</p>
                <p className="text-lg font-bold text-gray-900">{campaign.predictedConversions}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                AI Recommendations
              </p>
              <ul className="space-y-1">
                {campaign.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                    <span className="text-green-500 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Content Performance Predictions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Content Type Performance Forecast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contentPerformance.map((content, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{content.contentType}</h4>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Current</span>
                  <span className="text-gray-600">Predicted</span>
                </div>
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{ width: `${content.currentPerformance}%` }}
                  />
                  <div
                    className="absolute h-full bg-green-500 opacity-60 rounded-full"
                    style={{ width: `${content.predictedPerformance}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      +{(content.predictedPerformance - content.currentPerformance).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">Best time: {content.optimalTime}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {content.suggestedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Alert */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-900">
              Performance Optimization Opportunity
            </p>
            <p className="text-sm text-purple-700 mt-1">
              Based on AI analysis, posting video content on Thursday evenings could increase your
              engagement by up to 45%. Consider scheduling your next campaign launch for maximum
              impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePredictionDashboard;
