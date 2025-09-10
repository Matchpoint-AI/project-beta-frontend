var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
/**
 * Performance Prediction Dashboard component with AI-powered insights.
 */
import { useState, useEffect } from 'react';
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
import { useAuth } from '../../features/auth/context/AuthContext';
var PerformancePredictionDashboard = function () {
  var profile = useAuth().profile;
  var _a = useState(true),
    loading = _a[0],
    setLoading = _a[1];
  var _b = useState('7d'),
    timeRange = _b[0],
    setTimeRange = _b[1];
  var _c = useState('engagement'),
    _selectedMetric = _c[0],
    _setSelectedMetric = _c[1];
  var _d = useState([]),
    predictions = _d[0],
    setPredictions = _d[1];
  var _e = useState([]),
    campaignPredictions = _e[0],
    setCampaignPredictions = _e[1];
  var _f = useState([]),
    contentPerformance = _f[0],
    setContentPerformance = _f[1];
  useEffect(
    function () {
      loadPredictionData();
    },
    [timeRange, profile]
  );
  var loadPredictionData = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var mockPredictions, mockCampaignPredictions, mockContentPerformance, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(true);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            // Simulate AI prediction calculation
            return [
              4 /*yield*/,
              new Promise(function (resolve) {
                return setTimeout(resolve, 1000);
              }),
            ];
          case 2:
            // Simulate AI prediction calculation
            _a.sent();
            mockPredictions = [
              {
                label: 'Engagement Rate',
                value: 4.8,
                predicted: 6.2,
                change: 29.2,
                confidence: 87,
                icon: _jsx(Heart, { className: 'w-5 h-5' }),
                color: '#EF4444',
                trend: 'up',
              },
              {
                label: 'Reach',
                value: 15234,
                predicted: 19804,
                change: 30.0,
                confidence: 92,
                icon: _jsx(Users, { className: 'w-5 h-5' }),
                color: '#3B82F6',
                trend: 'up',
              },
              {
                label: 'Comments',
                value: 342,
                predicted: 425,
                change: 24.3,
                confidence: 78,
                icon: _jsx(MessageCircle, { className: 'w-5 h-5' }),
                color: '#10B981',
                trend: 'up',
              },
              {
                label: 'Shares',
                value: 89,
                predicted: 112,
                change: 25.8,
                confidence: 82,
                icon: _jsx(Share2, { className: 'w-5 h-5' }),
                color: '#8B5CF6',
                trend: 'up',
              },
              {
                label: 'Impressions',
                value: 48392,
                predicted: 58470,
                change: 20.8,
                confidence: 90,
                icon: _jsx(Eye, { className: 'w-5 h-5' }),
                color: '#F59E0B',
                trend: 'up',
              },
              {
                label: 'Click Rate',
                value: 2.3,
                predicted: 3.1,
                change: 34.8,
                confidence: 75,
                icon: _jsx(Target, { className: 'w-5 h-5' }),
                color: '#EC4899',
                trend: 'up',
              },
            ];
            mockCampaignPredictions = [
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
            mockContentPerformance = [
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
            return [3 /*break*/, 5];
          case 3:
            error_1 = _a.sent();
            console.error('Error loading predictions:', error_1);
            return [3 /*break*/, 5];
          case 4:
            setLoading(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  // Simple visualization data for CSS-based charts
  var performanceTrendData = [
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
  var engagementDistribution = [
    { label: 'Likes', value: 35, color: '#EF4444' },
    { label: 'Comments', value: 25, color: '#3B82F6' },
    { label: 'Shares', value: 15, color: '#10B981' },
    { label: 'Saves', value: 15, color: '#F59E0B' },
    { label: 'Clicks', value: 10, color: '#8B5CF6' },
  ];
  var confidenceColors = function (confidence) {
    if (confidence >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };
  if (loading) {
    return _jsx('div', {
      className: 'flex justify-center items-center h-96',
      children: _jsxs('div', {
        className: 'text-center',
        children: [
          _jsx(CircularProgress, { size: 60, thickness: 4 }),
          _jsx('p', {
            className: 'mt-4 text-gray-600',
            children: 'Analyzing performance patterns...',
          }),
          _jsx('p', {
            className: 'text-sm text-gray-500 mt-2',
            children: 'AI is predicting future metrics',
          }),
        ],
      }),
    });
  }
  return _jsxs('div', {
    className: 'p-6 space-y-6',
    children: [
      _jsxs('div', {
        className: 'flex justify-between items-center',
        children: [
          _jsxs('div', {
            children: [
              _jsxs('h2', {
                className: 'text-2xl font-bold text-gray-900 flex items-center gap-2',
                children: [
                  _jsx(Sparkles, { className: 'w-6 h-6 text-purple-500' }),
                  'Performance Predictions',
                ],
              }),
              _jsx('p', {
                className: 'text-gray-600 mt-1',
                children: 'AI-powered insights for future campaign performance',
              }),
            ],
          }),
          _jsx('div', {
            className: 'flex gap-2',
            children: ['24h', '7d', '30d', '90d'].map(function (range) {
              return _jsx(
                'button',
                {
                  onClick: function () {
                    return setTimeRange(range);
                  },
                  className: 'px-4 py-2 rounded-lg font-medium transition-colors '.concat(
                    timeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ),
                  children: range,
                },
                range
              );
            }),
          }),
        ],
      }),
      _jsx('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4',
        children: predictions.map(function (metric, index) {
          return _jsxs(
            'div',
            {
              className:
                'bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer',
              children: [
                _jsxs('div', {
                  className: 'flex items-center justify-between mb-3',
                  children: [
                    _jsx('div', {
                      className: 'p-2 rounded-lg',
                      style: { backgroundColor: ''.concat(metric.color, '20') },
                      children: _jsx('div', {
                        style: { color: metric.color },
                        children: metric.icon,
                      }),
                    }),
                    _jsx(Chip, {
                      label: ''.concat(metric.confidence, '% sure'),
                      size: 'small',
                      className: confidenceColors(metric.confidence),
                    }),
                  ],
                }),
                _jsx('p', { className: 'text-sm text-gray-600 mb-1', children: metric.label }),
                _jsxs('div', {
                  className: 'flex items-baseline gap-2',
                  children: [
                    _jsx('p', {
                      className: 'text-2xl font-bold text-gray-900',
                      children:
                        metric.value < 100
                          ? ''.concat(metric.value, '%')
                          : metric.value.toLocaleString(),
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-1',
                      children: [
                        metric.trend === 'up'
                          ? _jsx(ChevronUp, { className: 'w-4 h-4 text-green-500' })
                          : _jsx(ChevronDown, { className: 'w-4 h-4 text-red-500' }),
                        _jsxs('span', {
                          className: 'text-sm font-medium '.concat(
                            metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                          ),
                          children: [metric.change, '%'],
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'mt-2',
                  children: [
                    _jsxs('div', {
                      className: 'flex justify-between text-xs text-gray-500 mb-1',
                      children: [
                        _jsx('span', { children: 'Predicted' }),
                        _jsx('span', {
                          className: 'font-medium',
                          children:
                            metric.predicted < 100
                              ? ''.concat(metric.predicted, '%')
                              : metric.predicted.toLocaleString(),
                        }),
                      ],
                    }),
                    _jsx(LinearProgress, {
                      variant: 'determinate',
                      value: (metric.predicted / (metric.predicted + metric.value)) * 100,
                      className: 'h-2 rounded-full',
                      sx: {
                        backgroundColor: '#E5E7EB',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: metric.color,
                        },
                      },
                    }),
                  ],
                }),
              ],
            },
            index
          );
        }),
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
        children: [
          _jsxs('div', {
            className: 'lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6',
            children: [
              _jsxs('div', {
                className: 'flex justify-between items-center mb-4',
                children: [
                  _jsx('h3', {
                    className: 'text-lg font-semibold text-gray-900',
                    children: 'Performance Trajectory',
                  }),
                  _jsxs('div', {
                    className: 'flex items-center gap-2 text-sm',
                    children: [
                      _jsxs('div', {
                        className: 'flex items-center gap-1',
                        children: [
                          _jsx('div', { className: 'w-3 h-3 bg-blue-500 rounded-full' }),
                          _jsx('span', { className: 'text-gray-600', children: 'Actual' }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'flex items-center gap-1',
                        children: [
                          _jsx('div', { className: 'w-3 h-3 bg-green-500 rounded-full' }),
                          _jsx('span', { className: 'text-gray-600', children: 'Predicted' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              _jsx('div', {
                className: 'h-64 flex items-end gap-2 px-4',
                children: performanceTrendData.map(function (point, index) {
                  return _jsxs(
                    'div',
                    {
                      className: 'flex-1 flex flex-col items-center',
                      children: [
                        _jsxs('div', {
                          className: 'relative h-48 w-8 bg-gray-100 rounded-t',
                          children: [
                            point.actual &&
                              _jsx('div', {
                                className:
                                  'absolute bottom-0 w-full bg-blue-500 rounded-t opacity-80',
                                style: { height: ''.concat((point.actual / 100) * 192, 'px') },
                              }),
                            point.predicted &&
                              _jsx('div', {
                                className:
                                  'absolute bottom-0 w-full bg-green-500 rounded-t opacity-60',
                                style: { height: ''.concat((point.predicted / 100) * 192, 'px') },
                              }),
                          ],
                        }),
                        _jsx('span', {
                          className: 'text-xs mt-1 text-gray-600',
                          children: point.label,
                        }),
                      ],
                    },
                    index
                  );
                }),
              }),
              _jsx('div', {
                className: 'mt-4 p-3 bg-green-50 rounded-lg border border-green-200',
                children: _jsxs('p', {
                  className: 'text-sm text-green-800',
                  children: [
                    _jsx('strong', { children: 'AI Insight:' }),
                    ' Your content performance is expected to increase by 32% over the next 3 days based on current engagement patterns and seasonal trends.',
                  ],
                }),
              }),
            ],
          }),
          _jsxs('div', {
            className: 'bg-white rounded-xl border border-gray-200 p-6',
            children: [
              _jsx('h3', {
                className: 'text-lg font-semibold text-gray-900 mb-4',
                children: 'Engagement Mix',
              }),
              _jsxs('div', {
                className: 'h-48 relative flex items-center justify-center',
                children: [
                  _jsx('div', {
                    className: 'relative w-32 h-32',
                    children: engagementDistribution.map(function (item, index) {
                      var radius = 64;
                      var circumference = 2 * Math.PI * radius;
                      var offset = engagementDistribution.slice(0, index).reduce(function (
                        acc,
                        curr
                      ) {
                        return acc + curr.value;
                      }, 0);
                      var strokeDasharray = ''
                        .concat((item.value / 100) * circumference, ' ')
                        .concat(circumference);
                      var strokeDashoffset = -((offset / 100) * circumference);
                      return _jsx(
                        'svg',
                        {
                          className: 'absolute inset-0 transform -rotate-90',
                          width: '128',
                          height: '128',
                          children: _jsx('circle', {
                            cx: '64',
                            cy: '64',
                            r: '64',
                            fill: 'none',
                            stroke: item.color,
                            strokeWidth: '12',
                            strokeDasharray: strokeDasharray,
                            strokeDashoffset: strokeDashoffset,
                            opacity: '0.8',
                          }),
                        },
                        index
                      );
                    }),
                  }),
                  _jsx('div', {
                    className: 'absolute inset-0 flex items-center justify-center',
                    children: _jsxs('div', {
                      className: 'text-center',
                      children: [
                        _jsx('div', {
                          className: 'text-lg font-bold text-gray-900',
                          children: '100%',
                        }),
                        _jsx('div', { className: 'text-xs text-gray-600', children: 'Engagement' }),
                      ],
                    }),
                  }),
                ],
              }),
              _jsx('div', {
                className: 'space-y-1',
                children: engagementDistribution.map(function (item, index) {
                  return _jsxs(
                    'div',
                    {
                      className: 'flex items-center justify-between text-sm',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            _jsx('div', {
                              className: 'w-3 h-3 rounded-full',
                              style: { backgroundColor: item.color },
                            }),
                            _jsx('span', { className: 'text-gray-700', children: item.label }),
                          ],
                        }),
                        _jsxs('span', {
                          className: 'font-medium text-gray-900',
                          children: [item.value, '%'],
                        }),
                      ],
                    },
                    index
                  );
                }),
              }),
              _jsxs('div', {
                className: 'mt-4 space-y-2',
                children: [
                  _jsxs('p', {
                    className: 'text-xs text-gray-600',
                    children: [_jsx('strong', { children: 'Optimize for:' }), ' Comments & Shares'],
                  }),
                  _jsx('p', {
                    className: 'text-xs text-gray-500',
                    children: 'These metrics show highest growth potential',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
        children: campaignPredictions.map(function (campaign) {
          return _jsxs(
            'div',
            {
              className: 'bg-white rounded-xl border border-gray-200 p-6',
              children: [
                _jsxs('div', {
                  className: 'flex justify-between items-start mb-4',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('h3', {
                          className: 'text-lg font-semibold text-gray-900',
                          children: campaign.campaignName,
                        }),
                        _jsxs('div', {
                          className: 'flex items-center gap-4 mt-2',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center gap-1',
                              children: [
                                _jsx(Target, { className: 'w-4 h-4 text-gray-500' }),
                                _jsx('span', {
                                  className: 'text-sm text-gray-600',
                                  children: 'Performance Score',
                                }),
                              ],
                            }),
                            _jsxs('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx('div', {
                                  className: 'w-32 h-2 bg-gray-200 rounded-full overflow-hidden',
                                  children: _jsx('div', {
                                    className:
                                      'h-full bg-gradient-to-r from-purple-500 to-pink-500',
                                    style: { width: ''.concat(campaign.performanceScore, '%') },
                                  }),
                                }),
                                _jsx('span', {
                                  className: 'text-sm font-bold text-gray-900',
                                  children: campaign.performanceScore,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsx(Chip, {
                      label: ''.concat(campaign.confidenceScore, '% confidence'),
                      size: 'small',
                      color: campaign.confidenceScore >= 85 ? 'success' : 'warning',
                      variant: 'outlined',
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'grid grid-cols-3 gap-4 mb-4',
                  children: [
                    _jsxs('div', {
                      className: 'text-center p-3 bg-blue-50 rounded-lg',
                      children: [
                        _jsx(Users, { className: 'w-5 h-5 text-blue-600 mx-auto mb-1' }),
                        _jsx('p', {
                          className: 'text-xs text-gray-600',
                          children: 'Predicted Reach',
                        }),
                        _jsxs('p', {
                          className: 'text-lg font-bold text-gray-900',
                          children: [(campaign.predictedReach / 1000).toFixed(1), 'K'],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'text-center p-3 bg-green-50 rounded-lg',
                      children: [
                        _jsx(Heart, { className: 'w-5 h-5 text-green-600 mx-auto mb-1' }),
                        _jsx('p', { className: 'text-xs text-gray-600', children: 'Engagement' }),
                        _jsxs('p', {
                          className: 'text-lg font-bold text-gray-900',
                          children: [campaign.predictedEngagement, '%'],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'text-center p-3 bg-purple-50 rounded-lg',
                      children: [
                        _jsx(Target, { className: 'w-5 h-5 text-purple-600 mx-auto mb-1' }),
                        _jsx('p', { className: 'text-xs text-gray-600', children: 'Conversions' }),
                        _jsx('p', {
                          className: 'text-lg font-bold text-gray-900',
                          children: campaign.predictedConversions,
                        }),
                      ],
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'border-t pt-4',
                  children: [
                    _jsxs('p', {
                      className: 'text-sm font-medium text-gray-700 mb-2 flex items-center gap-1',
                      children: [
                        _jsx(Sparkles, { className: 'w-4 h-4 text-purple-500' }),
                        'AI Recommendations',
                      ],
                    }),
                    _jsx('ul', {
                      className: 'space-y-1',
                      children: campaign.recommendations.map(function (rec, idx) {
                        return _jsxs(
                          'li',
                          {
                            className: 'text-xs text-gray-600 flex items-start gap-1',
                            children: [
                              _jsx('span', {
                                className: 'text-green-500 mt-0.5',
                                children: '\u2022',
                              }),
                              rec,
                            ],
                          },
                          idx
                        );
                      }),
                    }),
                  ],
                }),
              ],
            },
            campaign.campaignId
          );
        }),
      }),
      _jsxs('div', {
        className: 'bg-white rounded-xl border border-gray-200 p-6',
        children: [
          _jsx('h3', {
            className: 'text-lg font-semibold text-gray-900 mb-4',
            children: 'Content Type Performance Forecast',
          }),
          _jsx('div', {
            className: 'grid grid-cols-1 md:grid-cols-3 gap-4',
            children: contentPerformance.map(function (content, index) {
              return _jsxs(
                'div',
                {
                  className: 'border border-gray-200 rounded-lg p-4',
                  children: [
                    _jsx('h4', {
                      className: 'font-medium text-gray-900 mb-2',
                      children: content.contentType,
                    }),
                    _jsxs('div', {
                      className: 'mb-3',
                      children: [
                        _jsxs('div', {
                          className: 'flex justify-between text-sm mb-1',
                          children: [
                            _jsx('span', { className: 'text-gray-600', children: 'Current' }),
                            _jsx('span', { className: 'text-gray-600', children: 'Predicted' }),
                          ],
                        }),
                        _jsxs('div', {
                          className: 'relative h-8 bg-gray-200 rounded-full overflow-hidden',
                          children: [
                            _jsx('div', {
                              className: 'absolute h-full bg-blue-500 rounded-full',
                              style: { width: ''.concat(content.currentPerformance, '%') },
                            }),
                            _jsx('div', {
                              className: 'absolute h-full bg-green-500 opacity-60 rounded-full',
                              style: { width: ''.concat(content.predictedPerformance, '%') },
                            }),
                            _jsx('div', {
                              className: 'absolute inset-0 flex items-center justify-center',
                              children: _jsxs('span', {
                                className: 'text-xs font-bold text-white',
                                children: [
                                  '+',
                                  (
                                    content.predictedPerformance - content.currentPerformance
                                  ).toFixed(0),
                                  '%',
                                ],
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    _jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        _jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            _jsx(Clock, { className: 'w-4 h-4 text-gray-500' }),
                            _jsxs('span', {
                              className: 'text-xs text-gray-600',
                              children: ['Best time: ', content.optimalTime],
                            }),
                          ],
                        }),
                        _jsx('div', {
                          className: 'flex flex-wrap gap-1',
                          children: content.suggestedTags.map(function (tag, idx) {
                            return _jsx(
                              'span',
                              {
                                className:
                                  'text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full',
                                children: tag,
                              },
                              idx
                            );
                          }),
                        }),
                      ],
                    }),
                  ],
                },
                index
              );
            }),
          }),
        ],
      }),
      _jsx('div', {
        className:
          'bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4',
        children: _jsxs('div', {
          className: 'flex items-start gap-3',
          children: [
            _jsx(AlertCircle, { className: 'w-5 h-5 text-purple-600 mt-0.5' }),
            _jsxs('div', {
              children: [
                _jsx('p', {
                  className: 'text-sm font-medium text-purple-900',
                  children: 'Performance Optimization Opportunity',
                }),
                _jsx('p', {
                  className: 'text-sm text-purple-700 mt-1',
                  children:
                    'Based on AI analysis, posting video content on Thursday evenings could increase your engagement by up to 45%. Consider scheduling your next campaign launch for maximum impact.',
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
};
export default PerformancePredictionDashboard;
//# sourceMappingURL=PerformancePredictionDashboard.js.map
