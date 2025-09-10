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
import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartInsightsPanel } from './SmartInsightsPanel';
// Mock the performance API
jest.mock('../../api/performanceApi', function () {
  return {
    performanceApi: {
      getPerformanceInsights: jest.fn(),
      recordMetric: jest.fn(),
    },
  };
});
// Mock fetch for API calls
var mockFetch = jest.fn();
global.fetch = mockFetch;
// Mock localStorage
var mockLocalStorage = {
  getItem: jest.fn(function () {
    return 'mock_token';
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
describe('SmartInsightsPanel', function () {
  beforeEach(function () {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });
  var mockSummaryResponse = {
    timestamp: '2024-08-24T12:00:00Z',
    brand_id: null,
    insights_summary: {
      total_insights: 5,
      by_type: {
        cost_optimization: 2,
        anomaly_detection: 1,
        user_experience: 2,
      },
      by_severity: {
        critical: 1,
        high: 2,
        medium: 2,
      },
    },
    health_score: 75,
    health_status: 'good',
    top_recommendations: [
      {
        title: 'Implement Multi-Model Strategy',
        category: 'cost',
        priority_score: 85.0,
        estimated_impact: '35% cost reduction',
      },
      {
        title: 'Add Response Caching',
        category: 'performance',
        priority_score: 75.0,
        estimated_impact: '40% latency reduction',
      },
    ],
    key_metrics: {
      critical_issues: 1,
      high_priority_issues: 2,
      total_recommendations: 8,
    },
  };
  var mockInsightsResponse = [
    {
      id: 'insight_1',
      insight_type: 'cost_optimization',
      severity: 'high',
      confidence: 'high',
      title: 'High Cost Per Generation',
      description: 'Cost per generation is above optimal threshold',
      current_value: 0.65,
      predicted_value: 0.75,
      impact_score: 85.0,
      time_to_impact_minutes: 10080, // 7 days
      recommendations: ['Switch to GPT-4o-mini for routine tasks', 'Implement request batching'],
      automated_actions: ['Auto-route low-priority requests'],
      related_metrics: ['cost_efficiency'],
      metadata: {
        threshold: 0.5,
        potential_savings: '$350 per 1K generations',
      },
      created_at: '2024-08-24T12:00:00Z',
    },
    {
      id: 'insight_2',
      insight_type: 'anomaly_detection',
      severity: 'critical',
      confidence: 'very_high',
      title: 'Latency Spike Detected',
      description: 'Unusual latency increase detected in the last hour',
      current_value: 3500.0,
      predicted_value: 1200.0,
      impact_score: 95.0,
      time_to_impact_minutes: 30,
      recommendations: ['Check model provider status', 'Implement automatic failover'],
      automated_actions: ['Enable failover mechanism'],
      related_metrics: ['latency'],
      metadata: {
        z_score: 3.2,
        baseline: 1200.0,
      },
      created_at: '2024-08-24T12:00:00Z',
    },
  ];
  var mockPredictionsResponse = [
    {
      metric_type: 'latency',
      predicted_value: 1800.0,
      confidence_interval: {
        lower: 1600.0,
        upper: 2000.0,
      },
      prediction_horizon_hours: 24,
      confidence_level: 'high',
      factors: ['historical_trend', 'seasonal_pattern'],
      methodology: 'linear_regression',
    },
    {
      metric_type: 'cost',
      predicted_value: 0.42,
      confidence_interval: {
        lower: 0.38,
        upper: 0.46,
      },
      prediction_horizon_hours: 24,
      confidence_level: 'medium',
      factors: ['usage_pattern', 'model_mix'],
      methodology: 'time_series',
    },
  ];
  var mockRecommendationsResponse = [
    {
      title: 'Implement Multi-Model Cost Strategy',
      description: 'Route requests to cost-effective models based on content complexity',
      category: 'cost',
      estimated_impact: '35-50% cost reduction',
      effort_required: 'medium',
      priority_score: 85.0,
      implementation_steps: [
        'Implement content complexity scoring',
        'Create routing rules for different models',
        'Set up A/B testing framework',
      ],
      risks: ['Potential quality reduction for complex content'],
      success_metrics: ['Cost per generation < $0.25', 'Quality score maintained > 0.85'],
    },
    {
      title: 'Add Response Time Optimization',
      description: 'Reduce average response time through caching and parallel processing',
      category: 'performance',
      estimated_impact: '40% latency reduction',
      effort_required: 'high',
      priority_score: 75.0,
      implementation_steps: [
        'Implement intelligent caching layer',
        'Add parallel request processing',
      ],
      risks: ['Cache invalidation complexity'],
      success_metrics: ['Average latency < 1.5 seconds'],
    },
  ];
  it('renders the component correctly', function () {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: function () {
        return Promise.resolve(mockSummaryResponse);
      },
    });
    render(_jsx(SmartInsightsPanel, {}));
    expect(screen.getByText('Smart Performance Insights')).toBeInTheDocument();
    expect(
      screen.getByText('AI-powered insights, predictions, and optimization recommendations')
    ).toBeInTheDocument();
  });
  it('displays tab navigation', function () {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: function () {
        return Promise.resolve(mockSummaryResponse);
      },
    });
    render(_jsx(SmartInsightsPanel, {}));
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Smart Insights')).toBeInTheDocument();
    expect(screen.getByText('Predictions')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });
  it('fetches and displays summary data on initial load', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch.mockResolvedValueOnce({
              ok: true,
              json: function () {
                return Promise.resolve(mockSummaryResponse);
              },
            });
            render(_jsx(SmartInsightsPanel, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('System Health Overview')).toBeInTheDocument();
                expect(screen.getByText('75')).toBeInTheDocument(); // health score
                expect(screen.getByText('Good')).toBeInTheDocument(); // health status
              }),
            ];
          case 1:
            _a.sent();
            expect(mockFetch).toHaveBeenCalledWith('/api/v1/insights/summary', {
              headers: {
                Authorization: 'Bearer mock_token',
              },
            });
            return [2 /*return*/];
        }
      });
    });
  });
  it('switches tabs and fetches appropriate data', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockInsightsResponse);
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Wait for initial summary load
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('System Health Overview')).toBeInTheDocument();
              }),
            ];
          case 1:
            // Wait for initial summary load
            _a.sent();
            // Click on Smart Insights tab
            fireEvent.click(screen.getByText('Smart Insights'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(mockFetch).toHaveBeenCalledWith(
                  expect.stringContaining('/api/v1/insights/smart'),
                  expect.objectContaining({
                    headers: {
                      Authorization: 'Bearer mock_token',
                    },
                  })
                );
              }),
            ];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays insights correctly', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockInsightsResponse);
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to insights tab
            fireEvent.click(screen.getByText('Smart Insights'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('High Cost Per Generation')).toBeInTheDocument();
                expect(screen.getByText('Latency Spike Detected')).toBeInTheDocument();
                expect(
                  screen.getByText('Cost per generation is above optimal threshold')
                ).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            // Check that severity badges are displayed
            expect(screen.getByText('HIGH')).toBeInTheDocument();
            expect(screen.getByText('CRITICAL')).toBeInTheDocument();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays predictions correctly', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockPredictionsResponse);
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to predictions tab
            fireEvent.click(screen.getByText('Predictions'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Latency Prediction')).toBeInTheDocument();
                expect(screen.getByText('Cost Prediction')).toBeInTheDocument();
                expect(screen.getByText('1800.00')).toBeInTheDocument(); // predicted latency
                expect(screen.getByText('0.42')).toBeInTheDocument(); // predicted cost
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays recommendations correctly', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockRecommendationsResponse);
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to recommendations tab
            fireEvent.click(screen.getByText('Recommendations'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Implement Multi-Model Cost Strategy')).toBeInTheDocument();
                expect(screen.getByText('Add Response Time Optimization')).toBeInTheDocument();
                expect(screen.getByText('35-50% cost reduction')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            // Check implementation steps are shown
            expect(screen.getByText('Implementation Steps:')).toBeInTheDocument();
            expect(screen.getByText('Implement content complexity scoring')).toBeInTheDocument();
            return [2 /*return*/];
        }
      });
    });
  });
  it('allows filtering insights', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var typeSelect;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockInsightsResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve([mockInsightsResponse[0]]);
                }, // Filtered response
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to insights tab
            fireEvent.click(screen.getByText('Smart Insights'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            typeSelect = screen.getByDisplayValue('All Types');
            fireEvent.change(typeSelect, { target: { value: 'cost_optimization' } });
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(mockFetch).toHaveBeenCalledWith(
                  expect.stringContaining('insight_types=cost_optimization'),
                  expect.any(Object)
                );
              }),
            ];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('submits feedback for insights', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var helpfulButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockInsightsResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve({ status: 'success' });
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to insights tab
            fireEvent.click(screen.getByText('Smart Insights'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('High Cost Per Generation')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            helpfulButton = screen.getAllByText('Helpful')[0];
            fireEvent.click(helpfulButton);
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(mockFetch).toHaveBeenCalledWith(
                  '/api/v1/insights/feedback?insight_id=insight_1&feedback_type=helpful',
                  expect.objectContaining({
                    method: 'POST',
                    headers: {
                      Authorization: 'Bearer mock_token',
                    },
                  })
                );
              }),
            ];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('handles loading states', function () {
    // Mock fetch to never resolve to test loading state
    mockFetch.mockImplementation(function () {
      return new Promise(function () {});
    });
    render(_jsx(SmartInsightsPanel, {}));
    expect(screen.getByText('Loading summary...')).toBeInTheDocument();
  });
  it('handles empty data states', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve([]);
                }, // Empty insights
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to insights tab
            fireEvent.click(screen.getByText('Smart Insights'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(
                  screen.getByText('No insights found for the selected criteria')
                ).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('handles API errors gracefully', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var consoleSpy;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockFetch.mockRejectedValueOnce(new Error('API Error')).mockResolvedValueOnce({
              ok: false,
              status: 500,
            });
            render(_jsx(SmartInsightsPanel, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(consoleSpy).toHaveBeenCalledWith(
                  'Failed to fetch insights summary:',
                  expect.any(Error)
                );
              }),
            ];
          case 1:
            _a.sent();
            consoleSpy.mockRestore();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays severity and confidence badges correctly', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockInsightsResponse);
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to insights tab
            fireEvent.click(screen.getByText('Smart Insights'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('HIGH')).toBeInTheDocument();
                expect(screen.getByText('CRITICAL')).toBeInTheDocument();
                expect(screen.getByText('VERY HIGH')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('shows automated actions when available', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockInsightsResponse);
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to insights tab
            fireEvent.click(screen.getByText('Smart Insights'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Automated Actions:')).toBeInTheDocument();
                expect(screen.getByText('Auto-route low-priority requests')).toBeInTheDocument();
                expect(screen.getByText('Enable failover mechanism')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('shows risk information in recommendations', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mockFetch
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockSummaryResponse);
                },
              })
              .mockResolvedValueOnce({
                ok: true,
                json: function () {
                  return Promise.resolve(mockRecommendationsResponse);
                },
              });
            render(_jsx(SmartInsightsPanel, {}));
            // Switch to recommendations tab
            fireEvent.click(screen.getByText('Recommendations'));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Risks to Consider:')).toBeInTheDocument();
                expect(
                  screen.getByText('Potential quality reduction for complex content')
                ).toBeInTheDocument();
                expect(screen.getByText('Cache invalidation complexity')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
});
//# sourceMappingURL=SmartInsightsPanel.test.js.map
