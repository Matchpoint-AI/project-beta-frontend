var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
/** Smart Performance Insights Panel Component. */
import { useState, useEffect } from 'react';
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
var INSIGHT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'cost_optimization', label: 'Cost Optimization' },
  { value: 'anomaly_detection', label: 'Anomaly Detection' },
  { value: 'predictive_scaling', label: 'Predictive Scaling' },
  { value: 'model_recommendation', label: 'Model Recommendations' },
  { value: 'user_experience', label: 'User Experience' },
  { value: 'capacity_planning', label: 'Capacity Planning' },
];
var SEVERITY_LEVELS = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'info', label: 'Info' },
];
var SeverityIcon = function (_a) {
  var severity = _a.severity;
  var iconClass = 'h-4 w-4';
  switch (severity) {
    case 'critical':
      return _jsx(XCircle, { className: ''.concat(iconClass, ' text-red-500') });
    case 'high':
      return _jsx(AlertTriangle, { className: ''.concat(iconClass, ' text-orange-500') });
    case 'medium':
      return _jsx(Info, { className: ''.concat(iconClass, ' text-yellow-500') });
    case 'low':
      return _jsx(CheckCircle, { className: ''.concat(iconClass, ' text-blue-500') });
    case 'info':
      return _jsx(Info, { className: ''.concat(iconClass, ' text-gray-500') });
    default:
      return _jsx(Info, { className: ''.concat(iconClass, ' text-gray-400') });
  }
};
var InsightTypeIcon = function (_a) {
  var insightType = _a.insightType;
  var iconClass = 'h-4 w-4';
  switch (insightType) {
    case 'cost_optimization':
      return _jsx(Target, { className: ''.concat(iconClass, ' text-green-500') });
    case 'anomaly_detection':
      return _jsx(AlertTriangle, { className: ''.concat(iconClass, ' text-red-500') });
    case 'predictive_scaling':
      return _jsx(TrendingUp, { className: ''.concat(iconClass, ' text-blue-500') });
    case 'model_recommendation':
      return _jsx(Settings, { className: ''.concat(iconClass, ' text-purple-500') });
    case 'user_experience':
      return _jsx(Lightbulb, { className: ''.concat(iconClass, ' text-yellow-500') });
    case 'capacity_planning':
      return _jsx(BarChart3, { className: ''.concat(iconClass, ' text-indigo-500') });
    default:
      return _jsx(Info, { className: ''.concat(iconClass, ' text-gray-400') });
  }
};
var SeverityBadge = function (_a) {
  var severity = _a.severity;
  var baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
  var severityClasses = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
    info: 'bg-gray-100 text-gray-800',
  };
  return _jsx('span', {
    className: ''.concat(baseClass, ' ').concat(severityClasses[severity]),
    children: severity.toUpperCase(),
  });
};
var ConfidenceBadge = function (_a) {
  var confidence = _a.confidence;
  var baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
  var confidenceClasses = {
    very_high: 'bg-green-100 text-green-800',
    high: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-orange-100 text-orange-800',
    very_low: 'bg-red-100 text-red-800',
  };
  return _jsx('span', {
    className: ''
      .concat(baseClass, ' ')
      .concat(confidenceClasses[confidence] || 'bg-gray-100 text-gray-800'),
    children: confidence.replace('_', ' ').toUpperCase(),
  });
};
export var SmartInsightsPanel = function () {
  var _a = useState('summary'),
    activeTab = _a[0],
    setActiveTab = _a[1];
  // Filters
  var _b = useState(''),
    selectedInsightType = _b[0],
    setSelectedInsightType = _b[1];
  var _c = useState(''),
    selectedSeverity = _c[0],
    setSelectedSeverity = _c[1];
  var _d = useState(168),
    lookbackHours = _d[0],
    setLookbackHours = _d[1]; // 1 week
  // Data states
  var _e = useState(null),
    summary = _e[0],
    setSummary = _e[1];
  var _f = useState([]),
    insights = _f[0],
    setInsights = _f[1];
  var _g = useState([]),
    predictions = _g[0],
    setPredictions = _g[1];
  var _h = useState([]),
    recommendations = _h[0],
    setRecommendations = _h[1];
  // Loading states
  var _j = useState({
      summary: false,
      insights: false,
      predictions: false,
      recommendations: false,
    }),
    loading = _j[0],
    setLoading = _j[1];
  // Fetch data functions
  var fetchSummary = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, data, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { summary: true });
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            return [
              4 /*yield*/,
              fetch('/api/v1/insights/summary', {
                headers: {
                  Authorization: 'Bearer '.concat(localStorage.getItem('auth_token')),
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            setSummary(data);
            _a.label = 4;
          case 4:
            return [3 /*break*/, 7];
          case 5:
            error_1 = _a.sent();
            console.error('Failed to fetch insights summary:', error_1);
            return [3 /*break*/, 7];
          case 6:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { summary: false });
            });
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var fetchInsights = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var params, response, data, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { insights: true });
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            params = new URLSearchParams();
            params.set('lookback_hours', lookbackHours.toString());
            if (selectedInsightType) params.set('insight_types', selectedInsightType);
            if (selectedSeverity) params.set('min_severity', selectedSeverity);
            return [
              4 /*yield*/,
              fetch('/api/v1/insights/smart?'.concat(params), {
                headers: {
                  Authorization: 'Bearer '.concat(localStorage.getItem('auth_token')),
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            setInsights(data);
            _a.label = 4;
          case 4:
            return [3 /*break*/, 7];
          case 5:
            error_2 = _a.sent();
            console.error('Failed to fetch smart insights:', error_2);
            return [3 /*break*/, 7];
          case 6:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { insights: false });
            });
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var fetchPredictions = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, data, error_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { predictions: true });
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            return [
              4 /*yield*/,
              fetch(
                '/api/v1/insights/predictions?metric_types=latency&metric_types=cost&prediction_hours=24',
                {
                  headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('auth_token')),
                  },
                }
              ),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            setPredictions(data);
            _a.label = 4;
          case 4:
            return [3 /*break*/, 7];
          case 5:
            error_3 = _a.sent();
            console.error('Failed to fetch predictions:', error_3);
            return [3 /*break*/, 7];
          case 6:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { predictions: false });
            });
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var fetchRecommendations = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, data, error_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { recommendations: true });
            });
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            return [
              4 /*yield*/,
              fetch('/api/v1/insights/recommendations?limit=10', {
                headers: {
                  Authorization: 'Bearer '.concat(localStorage.getItem('auth_token')),
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            data = _a.sent();
            setRecommendations(data);
            _a.label = 4;
          case 4:
            return [3 /*break*/, 7];
          case 5:
            error_4 = _a.sent();
            console.error('Failed to fetch recommendations:', error_4);
            return [3 /*break*/, 7];
          case 6:
            setLoading(function (prev) {
              return __assign(__assign({}, prev), { recommendations: false });
            });
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var submitFeedback = function (insightId, feedbackType) {
    return __awaiter(void 0, void 0, void 0, function () {
      var error_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4 /*yield*/,
              fetch(
                '/api/v1/insights/feedback?insight_id='
                  .concat(insightId, '&feedback_type=')
                  .concat(feedbackType),
                {
                  method: 'POST',
                  headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('auth_token')),
                  },
                }
              ),
            ];
          case 1:
            _a.sent();
            return [3 /*break*/, 3];
          case 2:
            error_5 = _a.sent();
            console.error('Failed to submit feedback:', error_5);
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  // Initial data fetch
  useEffect(function () {
    fetchSummary();
  }, []);
  // Fetch data when tab changes
  useEffect(
    function () {
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
    },
    [activeTab, selectedInsightType, selectedSeverity, lookbackHours]
  );
  var renderSummaryTab = function () {
    if (loading.summary) {
      return _jsx('div', { className: 'p-6 text-center', children: 'Loading summary...' });
    }
    if (!summary) {
      return _jsx('div', {
        className: 'p-6 text-center text-gray-500',
        children: 'No summary data available',
      });
    }
    return _jsxs('div', {
      className: 'space-y-6',
      children: [
        _jsxs('div', {
          className: 'bg-white p-6 rounded-lg border',
          children: [
            _jsxs('div', {
              className: 'flex items-center justify-between mb-4',
              children: [
                _jsx('h3', {
                  className: 'text-lg font-semibold',
                  children: 'System Health Overview',
                }),
                _jsxs('div', {
                  className: 'flex items-center gap-2',
                  children: [
                    _jsx('div', {
                      className: 'h-3 w-3 rounded-full '.concat(
                        summary.health_status === 'excellent'
                          ? 'bg-green-500'
                          : summary.health_status === 'good'
                            ? 'bg-blue-500'
                            : summary.health_status === 'fair'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                      ),
                    }),
                    _jsx('span', {
                      className: 'font-medium capitalize',
                      children: summary.health_status,
                    }),
                  ],
                }),
              ],
            }),
            _jsxs('div', {
              className: 'grid grid-cols-2 md:grid-cols-4 gap-4',
              children: [
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-3xl font-bold text-blue-600',
                      children: summary.health_score,
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'Health Score' }),
                  ],
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-3xl font-bold text-red-600',
                      children: summary.key_metrics?.critical_issues || 0,
                    }),
                    _jsx('div', {
                      className: 'text-sm text-gray-600',
                      children: 'Critical Issues',
                    }),
                  ],
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-3xl font-bold text-orange-600',
                      children: summary.key_metrics?.high_priority_issues || 0,
                    }),
                    _jsx('div', { className: 'text-sm text-gray-600', children: 'High Priority' }),
                  ],
                }),
                _jsxs('div', {
                  className: 'text-center',
                  children: [
                    _jsx('div', {
                      className: 'text-3xl font-bold text-green-600',
                      children: summary.key_metrics?.total_recommendations || 0,
                    }),
                    _jsx('div', {
                      className: 'text-sm text-gray-600',
                      children: 'Recommendations',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        _jsxs('div', {
          className: 'bg-white p-6 rounded-lg border',
          children: [
            _jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Top Recommendations',
            }),
            _jsx('div', {
              className: 'space-y-3',
              children: (summary.top_recommendations || []).map(function (rec, index) {
                return _jsxs(
                  'div',
                  {
                    className: 'flex justify-between items-center p-3 bg-gray-50 rounded',
                    children: [
                      _jsxs('div', {
                        children: [
                          _jsx('div', { className: 'font-medium', children: rec.title }),
                          _jsxs('div', {
                            className: 'text-sm text-gray-600 capitalize',
                            children: [rec.category, ' \u2022 ', rec.estimated_impact],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'text-right',
                        children: [
                          _jsx('div', {
                            className: 'font-bold text-blue-600',
                            children: rec.priority_score.toFixed(0),
                          }),
                          _jsx('div', { className: 'text-xs text-gray-500', children: 'Priority' }),
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
        _jsxs('div', {
          className: 'bg-white p-6 rounded-lg border',
          children: [
            _jsx('h3', { className: 'text-lg font-semibold mb-4', children: 'Insights Breakdown' }),
            _jsxs('div', {
              className: 'grid grid-cols-2 gap-4',
              children: [
                _jsxs('div', {
                  children: [
                    _jsx('h4', { className: 'font-medium mb-2', children: 'By Type' }),
                    Object.entries(summary.insights_summary?.by_type || {}).map(function (_a) {
                      var type = _a[0],
                        count = _a[1];
                      return _jsxs(
                        'div',
                        {
                          className: 'flex justify-between text-sm',
                          children: [
                            _jsx('span', {
                              className: 'capitalize',
                              children: type.replace('_', ' '),
                            }),
                            _jsx('span', { className: 'font-medium', children: count }),
                          ],
                        },
                        type
                      );
                    }),
                  ],
                }),
                _jsxs('div', {
                  children: [
                    _jsx('h4', { className: 'font-medium mb-2', children: 'By Severity' }),
                    Object.entries(summary.insights_summary?.by_severity || {}).map(function (_a) {
                      var severity = _a[0],
                        count = _a[1];
                      return _jsxs(
                        'div',
                        {
                          className: 'flex justify-between text-sm',
                          children: [
                            _jsx('span', { className: 'capitalize', children: severity }),
                            _jsx('span', { className: 'font-medium', children: count }),
                          ],
                        },
                        severity
                      );
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };
  var renderInsightsTab = function () {
    return _jsxs('div', {
      className: 'space-y-4',
      children: [
        _jsx('div', {
          className: 'bg-white p-4 rounded-lg border',
          children: _jsxs('div', {
            className: 'grid grid-cols-1 md:grid-cols-3 gap-4',
            children: [
              _jsxs('div', {
                children: [
                  _jsx('label', {
                    className: 'block text-sm font-medium text-gray-700 mb-1',
                    children: 'Insight Type',
                  }),
                  _jsx('select', {
                    value: selectedInsightType,
                    onChange: function (e) {
                      return setSelectedInsightType(e.target.value);
                    },
                    className:
                      'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    children: INSIGHT_TYPES.map(function (type) {
                      return _jsx(
                        'option',
                        { value: type.value, children: type.label },
                        type.value
                      );
                    }),
                  }),
                ],
              }),
              _jsxs('div', {
                children: [
                  _jsx('label', {
                    className: 'block text-sm font-medium text-gray-700 mb-1',
                    children: 'Minimum Severity',
                  }),
                  _jsx('select', {
                    value: selectedSeverity,
                    onChange: function (e) {
                      return setSelectedSeverity(e.target.value);
                    },
                    className:
                      'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    children: SEVERITY_LEVELS.map(function (level) {
                      return _jsx(
                        'option',
                        { value: level.value, children: level.label },
                        level.value
                      );
                    }),
                  }),
                ],
              }),
              _jsxs('div', {
                children: [
                  _jsx('label', {
                    className: 'block text-sm font-medium text-gray-700 mb-1',
                    children: 'Lookback Hours',
                  }),
                  _jsxs('select', {
                    value: lookbackHours,
                    onChange: function (e) {
                      return setLookbackHours(Number(e.target.value));
                    },
                    className:
                      'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    children: [
                      _jsx('option', { value: 24, children: '24 Hours' }),
                      _jsx('option', { value: 72, children: '3 Days' }),
                      _jsx('option', { value: 168, children: '1 Week' }),
                      _jsx('option', { value: 336, children: '2 Weeks' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
        loading.insights
          ? _jsx('div', { className: 'p-6 text-center', children: 'Loading insights...' })
          : _jsxs('div', {
              className: 'space-y-4',
              children: [
                insights.map(function (insight) {
                  return _jsxs(
                    'div',
                    {
                      className: 'bg-white rounded-lg border p-6',
                      children: [
                        _jsxs('div', {
                          className: 'flex justify-between items-start mb-3',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center gap-3',
                              children: [
                                _jsx(InsightTypeIcon, { insightType: insight.insight_type }),
                                _jsx(SeverityIcon, { severity: insight.severity }),
                                _jsx('h3', {
                                  className: 'text-lg font-semibold',
                                  children: insight.title,
                                }),
                              ],
                            }),
                            _jsxs('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx(SeverityBadge, { severity: insight.severity }),
                                _jsx(ConfidenceBadge, { confidence: insight.confidence }),
                              ],
                            }),
                          ],
                        }),
                        _jsx('p', {
                          className: 'text-gray-700 mb-4',
                          children: insight.description,
                        }),
                        _jsxs('div', {
                          className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4',
                          children: [
                            _jsxs('div', {
                              className: 'text-center p-3 bg-gray-50 rounded',
                              children: [
                                _jsx('div', {
                                  className: 'text-2xl font-bold text-blue-600',
                                  children: insight.current_value.toFixed(2),
                                }),
                                _jsx('div', {
                                  className: 'text-sm text-gray-600',
                                  children: 'Current Value',
                                }),
                              ],
                            }),
                            insight.predicted_value !== null &&
                              _jsxs('div', {
                                className: 'text-center p-3 bg-gray-50 rounded',
                                children: [
                                  _jsx('div', {
                                    className: 'text-2xl font-bold text-purple-600',
                                    children: insight.predicted_value.toFixed(2),
                                  }),
                                  _jsx('div', {
                                    className: 'text-sm text-gray-600',
                                    children: 'Predicted Value',
                                  }),
                                ],
                              }),
                            _jsxs('div', {
                              className: 'text-center p-3 bg-gray-50 rounded',
                              children: [
                                _jsx('div', {
                                  className: 'text-2xl font-bold text-green-600',
                                  children: insight.impact_score.toFixed(0),
                                }),
                                _jsx('div', {
                                  className: 'text-sm text-gray-600',
                                  children: 'Impact Score',
                                }),
                              ],
                            }),
                          ],
                        }),
                        _jsxs('div', {
                          className: 'mb-4',
                          children: [
                            _jsx('h4', {
                              className: 'font-medium mb-2',
                              children: 'Recommendations:',
                            }),
                            _jsx('ul', {
                              className: 'list-disc list-inside text-sm text-gray-700 space-y-1',
                              children: (insight.recommendations || []).map(function (rec, index) {
                                return _jsx('li', { children: rec }, index);
                              }),
                            }),
                          ],
                        }),
                        insight.automated_actions &&
                          insight.automated_actions.length > 0 &&
                          _jsxs('div', {
                            className: 'mb-4',
                            children: [
                              _jsxs('h4', {
                                className: 'font-medium mb-2 flex items-center gap-2',
                                children: [
                                  _jsx(Zap, { className: 'h-4 w-4 text-yellow-500' }),
                                  'Automated Actions:',
                                ],
                              }),
                              _jsx('ul', {
                                className: 'list-disc list-inside text-sm text-gray-700 space-y-1',
                                children: (insight.automated_actions || []).map(
                                  function (action, index) {
                                    return _jsx('li', { children: action }, index);
                                  }
                                ),
                              }),
                            ],
                          }),
                        _jsxs('div', {
                          className: 'flex justify-end gap-2',
                          children: [
                            _jsx('button', {
                              onClick: function () {
                                return submitFeedback(insight.id, 'helpful');
                              },
                              className:
                                'px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200',
                              children: 'Helpful',
                            }),
                            _jsx('button', {
                              onClick: function () {
                                return submitFeedback(insight.id, 'not_helpful');
                              },
                              className:
                                'px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200',
                              children: 'Not Helpful',
                            }),
                            _jsx('button', {
                              onClick: function () {
                                return submitFeedback(insight.id, 'dismissed');
                              },
                              className:
                                'px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200',
                              children: 'Dismiss',
                            }),
                          ],
                        }),
                      ],
                    },
                    insight.id
                  );
                }),
                insights.length === 0 &&
                  _jsx('div', {
                    className: 'p-6 text-center text-gray-500',
                    children: 'No insights found for the selected criteria',
                  }),
              ],
            }),
      ],
    });
  };
  var renderPredictionsTab = function () {
    return _jsx('div', {
      className: 'space-y-4',
      children: loading.predictions
        ? _jsx('div', { className: 'p-6 text-center', children: 'Loading predictions...' })
        : _jsxs('div', {
            className: 'space-y-4',
            children: [
              predictions.map(function (prediction, index) {
                return _jsxs(
                  'div',
                  {
                    className: 'bg-white rounded-lg border p-6',
                    children: [
                      _jsxs('div', {
                        className: 'flex justify-between items-start mb-4',
                        children: [
                          _jsxs('h3', {
                            className: 'text-lg font-semibold capitalize',
                            children: [prediction.metric_type.replace('_', ' '), ' Prediction'],
                          }),
                          _jsx(ConfidenceBadge, { confidence: prediction.confidence_level }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4',
                        children: [
                          _jsxs('div', {
                            className: 'text-center p-4 bg-blue-50 rounded',
                            children: [
                              _jsx('div', {
                                className: 'text-3xl font-bold text-blue-600',
                                children: prediction.predicted_value.toFixed(2),
                              }),
                              _jsx('div', {
                                className: 'text-sm text-gray-600',
                                children: 'Predicted Value',
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'text-center p-4 bg-green-50 rounded',
                            children: [
                              _jsxs('div', {
                                className: 'text-lg font-bold text-green-600',
                                children: [
                                  prediction.confidence_interval.lower.toFixed(2),
                                  ' -',
                                  ' ',
                                  prediction.confidence_interval.upper.toFixed(2),
                                ],
                              }),
                              _jsx('div', {
                                className: 'text-sm text-gray-600',
                                children: 'Confidence Interval',
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'text-center p-4 bg-purple-50 rounded',
                            children: [
                              _jsxs('div', {
                                className: 'text-2xl font-bold text-purple-600',
                                children: [prediction.prediction_horizon_hours, 'h'],
                              }),
                              _jsx('div', {
                                className: 'text-sm text-gray-600',
                                children: 'Horizon',
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        children: [
                          _jsx('h4', { className: 'font-medium mb-2', children: 'Key Factors:' }),
                          _jsx('div', {
                            className: 'flex flex-wrap gap-2',
                            children: (prediction.factors || []).map(function (factor, i) {
                              return _jsx(
                                'span',
                                {
                                  className: 'px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded',
                                  children: factor.replace('_', ' '),
                                },
                                i
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
              predictions.length === 0 &&
                _jsx('div', {
                  className: 'p-6 text-center text-gray-500',
                  children: 'No predictions available',
                }),
            ],
          }),
    });
  };
  var renderRecommendationsTab = function () {
    return _jsx('div', {
      className: 'space-y-4',
      children: loading.recommendations
        ? _jsx('div', { className: 'p-6 text-center', children: 'Loading recommendations...' })
        : _jsxs('div', {
            className: 'space-y-4',
            children: [
              recommendations.map(function (rec, index) {
                return _jsxs(
                  'div',
                  {
                    className: 'bg-white rounded-lg border p-6',
                    children: [
                      _jsxs('div', {
                        className: 'flex justify-between items-start mb-3',
                        children: [
                          _jsx('h3', { className: 'text-lg font-semibold', children: rec.title }),
                          _jsxs('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              _jsx('span', {
                                className:
                                  'px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded capitalize',
                                children: rec.category,
                              }),
                              _jsxs('span', {
                                className: 'text-sm text-gray-600',
                                children: ['Priority: ', rec.priority_score.toFixed(0)],
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsx('p', { className: 'text-gray-700 mb-4', children: rec.description }),
                      _jsxs('div', {
                        className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4',
                        children: [
                          _jsxs('div', {
                            className: 'text-center p-3 bg-green-50 rounded',
                            children: [
                              _jsx('div', {
                                className: 'font-bold text-green-600',
                                children: rec.estimated_impact,
                              }),
                              _jsx('div', {
                                className: 'text-sm text-gray-600',
                                children: 'Estimated Impact',
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'text-center p-3 bg-yellow-50 rounded',
                            children: [
                              _jsx('div', {
                                className: 'font-bold text-yellow-600 capitalize',
                                children: rec.effort_required,
                              }),
                              _jsx('div', {
                                className: 'text-sm text-gray-600',
                                children: 'Effort Required',
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            className: 'text-center p-3 bg-purple-50 rounded',
                            children: [
                              _jsxs('div', {
                                className: 'font-bold text-purple-600',
                                children: [rec.priority_score.toFixed(0), '/100'],
                              }),
                              _jsx('div', {
                                className: 'text-sm text-gray-600',
                                children: 'Priority Score',
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs('div', {
                        className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                        children: [
                          _jsxs('div', {
                            children: [
                              _jsx('h4', {
                                className: 'font-medium mb-2',
                                children: 'Implementation Steps:',
                              }),
                              _jsx('ol', {
                                className:
                                  'list-decimal list-inside text-sm text-gray-700 space-y-1',
                                children: (rec.implementation_steps || []).map(function (step, i) {
                                  return _jsx('li', { children: step }, i);
                                }),
                              }),
                            ],
                          }),
                          _jsxs('div', {
                            children: [
                              _jsx('h4', {
                                className: 'font-medium mb-2',
                                children: 'Success Metrics:',
                              }),
                              _jsx('ul', {
                                className: 'list-disc list-inside text-sm text-gray-700 space-y-1',
                                children: (rec.success_metrics || []).map(function (metric, i) {
                                  return _jsx('li', { children: metric }, i);
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      rec.risks &&
                        rec.risks.length > 0 &&
                        _jsxs('div', {
                          className: 'mt-4 p-3 bg-red-50 rounded',
                          children: [
                            _jsx('h4', {
                              className: 'font-medium text-red-800 mb-2',
                              children: 'Risks to Consider:',
                            }),
                            _jsx('ul', {
                              className: 'list-disc list-inside text-sm text-red-700 space-y-1',
                              children: (rec.risks || []).map(function (risk, i) {
                                return _jsx('li', { children: risk }, i);
                              }),
                            }),
                          ],
                        }),
                    ],
                  },
                  index
                );
              }),
              recommendations.length === 0 &&
                _jsx('div', {
                  className: 'p-6 text-center text-gray-500',
                  children: 'No recommendations available',
                }),
            ],
          }),
    });
  };
  return _jsxs('div', {
    className: 'max-w-7xl mx-auto p-6',
    children: [
      _jsxs('div', {
        className: 'mb-6',
        children: [
          _jsx('h1', {
            className: 'text-3xl font-bold text-gray-900',
            children: 'Smart Performance Insights',
          }),
          _jsx('p', {
            className: 'text-gray-600',
            children: 'AI-powered insights, predictions, and optimization recommendations',
          }),
        ],
      }),
      _jsx('div', {
        className: 'border-b border-gray-200 mb-6',
        children: _jsx('nav', {
          className: 'flex space-x-8',
          children: [
            { id: 'summary', label: 'Summary', icon: BarChart3 },
            { id: 'insights', label: 'Smart Insights', icon: Lightbulb },
            { id: 'predictions', label: 'Predictions', icon: TrendingUp },
            { id: 'recommendations', label: 'Recommendations', icon: Target },
          ].map(function (tab) {
            var Icon = tab.icon;
            return _jsxs(
              'button',
              {
                onClick: function () {
                  return setActiveTab(tab.id);
                },
                className:
                  'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm '.concat(
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ),
                children: [_jsx(Icon, { className: 'h-4 w-4' }), tab.label],
              },
              tab.id
            );
          }),
        }),
      }),
      activeTab === 'summary' && renderSummaryTab(),
      activeTab === 'insights' && renderInsightsTab(),
      activeTab === 'predictions' && renderPredictionsTab(),
      activeTab === 'recommendations' && renderRecommendationsTab(),
    ],
  });
};
//# sourceMappingURL=SmartInsightsPanel.js.map
