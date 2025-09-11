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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CostOptimizationDashboard } from './CostOptimizationDashboard';
import { costOptimizationApi } from '../../api/costOptimizationApi';
// Mock the API module
vi.mock('../../api/costOptimizationApi', function () {
  return {
    costOptimizationApi: {
      getDashboardData: vi.fn(),
    },
  };
});
// Mock Chart.js components
vi.mock('react-chartjs-2', function () {
  return {
    Line: vi.fn(function (_a) {
      var _data = _a.data,
        _options = _a.options;
      return _jsx('div', {
        'data-testid': 'line-chart',
        'data-chart-type': 'line',
        children: 'Mock Line Chart',
      });
    }),
    Bar: vi.fn(function (_a) {
      var _data = _a.data,
        _options = _a.options;
      return _jsx('div', {
        'data-testid': 'bar-chart',
        'data-chart-type': 'bar',
        children: 'Mock Bar Chart',
      });
    }),
    Doughnut: vi.fn(function (_a) {
      var _data = _a.data,
        _options = _a.options;
      return _jsx('div', {
        'data-testid': 'doughnut-chart',
        'data-chart-type': 'doughnut',
        children: 'Mock Doughnut Chart',
      });
    }),
  };
});
// Mock UI components
vi.mock('../ui/LoadingSpinner', function () {
  return {
    LoadingSpinner: vi.fn(function (_a) {
      var size = _a.size;
      return _jsx('div', {
        'data-testid': 'loading-spinner',
        'data-size': size,
        children: 'Loading...',
      });
    }),
  };
});
vi.mock('../ui/Card', function () {
  return {
    Card: vi.fn(function (_a) {
      var children = _a.children,
        className = _a.className,
        props = __rest(_a, ['children', 'className']);
      return _jsx(
        'div',
        __assign({ 'data-testid': 'card', className: className }, props, { children: children })
      );
    }),
  };
});
vi.mock('../ui/Badge', function () {
  return {
    Badge: vi.fn(function (_a) {
      var children = _a.children,
        variant = _a.variant;
      return _jsx('span', { 'data-testid': 'badge', 'data-variant': variant, children: children });
    }),
  };
});
vi.mock('../ui/Button', function () {
  return {
    Button: vi.fn(function (_a) {
      var children = _a.children,
        onClick = _a.onClick,
        variant = _a.variant,
        size = _a.size,
        props = __rest(_a, ['children', 'onClick', 'variant', 'size']);
      return _jsx(
        'button',
        __assign(
          { 'data-testid': 'button', onClick: onClick, 'data-variant': variant, 'data-size': size },
          props,
          { children: children }
        )
      );
    }),
  };
});
var mockDashboardData = {
  period_start: '2024-07-25T00:00:00Z',
  period_end: '2024-08-24T00:00:00Z',
  total_baseline_cost: 10000.0,
  total_optimized_cost: 1000.0,
  total_absolute_savings: 9000.0,
  total_percentage_savings: 90.0,
  projected_annual_savings: 109500.0,
  optimization_metrics: [
    {
      optimization_type: 'vision_model_switch',
      period_start: '2024-07-25T00:00:00Z',
      period_end: '2024-08-24T00:00:00Z',
      baseline_cost: 5000.0,
      baseline_requests: 100,
      baseline_cost_per_request: 50.0,
      baseline_model: 'gpt-4-vision',
      optimized_cost: 300.0,
      optimized_requests: 100,
      optimized_cost_per_request: 3.0,
      optimized_model: 'gpt-4o-mini-vision',
      absolute_savings: 4700.0,
      percentage_savings: 94.0,
      projected_annual_savings: 57135.0,
      quality_before: 0.95,
      quality_after: 0.9,
      quality_impact: -0.05,
      latency_before: 2500.0,
      latency_after: 1200.0,
      latency_impact: -1300.0,
    },
    {
      optimization_type: 'gemini_routing',
      period_start: '2024-07-25T00:00:00Z',
      period_end: '2024-08-24T00:00:00Z',
      baseline_cost: 3000.0,
      baseline_requests: 150,
      baseline_cost_per_request: 20.0,
      baseline_model: 'gpt-4',
      optimized_cost: 990.0,
      optimized_requests: 150,
      optimized_cost_per_request: 6.6,
      optimized_model: 'gemini-2.5-flash-lite',
      absolute_savings: 2010.0,
      percentage_savings: 67.0,
      projected_annual_savings: 24421.5,
      quality_before: 0.92,
      quality_after: 0.85,
      quality_impact: -0.07,
      latency_before: 1800.0,
      latency_after: 900.0,
      latency_impact: -900.0,
    },
  ],
  current_model_distribution: {
    'gpt-4o-mini-vision': { requests: 450, cost: 67.5, percentage: 45.0 },
    'gemini-2.5-flash-lite': { requests: 320, cost: 32.0, percentage: 32.0 },
    'flux-1-schnell': { requests: 150, cost: 0.45, percentage: 15.0 },
    'gpt-4': { requests: 50, cost: 125.0, percentage: 5.0 },
    'imagen-4-fast': { requests: 30, cost: 1.2, percentage: 3.0 },
  },
  daily_savings: [
    {
      date: '2024-08-20',
      daily_savings: 300.0,
      cumulative_savings: 8700.0,
      baseline_cost: 400.0,
      optimized_cost: 100.0,
    },
    {
      date: '2024-08-21',
      daily_savings: 310.0,
      cumulative_savings: 9010.0,
      baseline_cost: 410.0,
      optimized_cost: 100.0,
    },
  ],
  cost_efficiency_trend: [
    {
      date: '2024-08-20',
      cost_efficiency: 0.85,
      requests_per_dollar: 5.0,
      savings_rate: 85.0,
    },
    {
      date: '2024-08-21',
      cost_efficiency: 0.87,
      requests_per_dollar: 5.2,
      savings_rate: 87.0,
    },
  ],
  overall_quality_impact: -0.06,
  quality_by_optimization: {
    vision_model_switch: -0.05,
    gemini_routing: -0.07,
  },
  top_savings_by_optimization: [
    {
      optimization_type: 'vision_model_switch',
      annual_savings: 57135.0,
      percentage_savings: 94.0,
      quality_impact: -0.05,
      implementation_status: 'active',
    },
    {
      optimization_type: 'gemini_routing',
      annual_savings: 24421.5,
      percentage_savings: 67.0,
      quality_impact: -0.07,
      implementation_status: 'active',
    },
  ],
  budget_utilization: 0.2,
  cost_alerts: [
    {
      type: 'quality_degradation',
      optimization: 'gemini_routing',
      severity: 'warning',
      message: 'Gemini routing causing quality degradation of 7%',
      current_value: -0.07,
      threshold: -0.05,
    },
  ],
};
describe('CostOptimizationDashboard', function () {
  beforeEach(function () {
    vi.clearAllMocks();
  });
  afterEach(function () {
    vi.restoreAllMocks();
  });
  describe('Initial Loading', function () {
    it('should show loading spinner initially', function () {
      costOptimizationApi.getDashboardData.mockImplementation(function () {
        return new Promise(function () {});
      });
      render(_jsx(CostOptimizationDashboard, {}));
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    it('should call API with default parameters', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              costOptimizationApi.getDashboardData.mockResolvedValue(mockDashboardData);
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(costOptimizationApi.getDashboardData).toHaveBeenCalledWith(30);
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
  describe('Data Display', function () {
    beforeEach(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          costOptimizationApi.getDashboardData.mockResolvedValue(mockDashboardData);
          return [2 /*return*/];
        });
      });
    });
    it('should display dashboard title and description', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('Cost Optimization Dashboard')).toBeInTheDocument();
                  expect(
                    screen.getByText(
                      'Track the 90% cost reduction achievement through AI model optimizations'
                    )
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
    it('should display key metrics cards', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Total Savings
                  expect(screen.getByText('Total Savings')).toBeInTheDocument();
                  expect(screen.getByText('$9,000')).toBeInTheDocument();
                  expect(screen.getByText('90.0% reduction')).toBeInTheDocument();
                  // Annual Projection
                  expect(screen.getByText('Annual Projection')).toBeInTheDocument();
                  expect(screen.getByText('$109,500')).toBeInTheDocument();
                  // Quality Impact
                  expect(screen.getByText('Quality Impact')).toBeInTheDocument();
                  expect(screen.getByText('-6.0%')).toBeInTheDocument();
                  expect(screen.getByText('Decreased')).toBeInTheDocument();
                  // Budget Utilization
                  expect(screen.getByText('Budget Utilization')).toBeInTheDocument();
                  expect(screen.getByText('20.0%')).toBeInTheDocument();
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should display optimization status cards', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Vision Model Switch
                  var visionModelTexts = screen.getAllByText('Vision Model Switch');
                  expect(visionModelTexts.length).toBeGreaterThan(0);
                  expect(screen.getByText('GPT-4o → GPT-4o-mini')).toBeInTheDocument();
                  expect(screen.getByText('94.0%')).toBeInTheDocument();
                  var savingsTexts = screen.getAllByText('$57,135');
                  expect(savingsTexts.length).toBeGreaterThan(0);
                  // Gemini Routing
                  var geminiTexts = screen.getAllByText('Gemini Routing');
                  expect(geminiTexts.length).toBeGreaterThan(0);
                  expect(screen.getByText('Gemini 2.5 Flash-Lite')).toBeInTheDocument();
                  expect(screen.getByText('67.0%')).toBeInTheDocument();
                  var geminiSavingsTexts = screen.getAllByText('$24,422');
                  expect(geminiSavingsTexts.length).toBeGreaterThan(0);
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should display badge status correctly', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  var badges = screen.getAllByTestId('badge');
                  // Vision model switch should be "On Track" (94% >= 94% target)
                  expect(
                    badges.some(function (badge) {
                      return (
                        badge.textContent === 'On Track' &&
                        badge.getAttribute('data-variant') === 'success'
                      );
                    })
                  ).toBe(true);
                  // Gemini routing should be "On Track" (67% >= 67% target)
                  expect(
                    badges.some(function (badge) {
                      return (
                        badge.textContent === 'On Track' &&
                        badge.getAttribute('data-variant') === 'success'
                      );
                    })
                  ).toBe(true);
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should render charts', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Should have savings trend chart(s)
                  var lineCharts = screen.getAllByTestId('line-chart');
                  expect(lineCharts.length).toBeGreaterThan(0);
                  // Should have optimization comparison chart
                  expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
                  // Should have model distribution chart
                  expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should display cost alerts', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('Cost Alerts')).toBeInTheDocument();
                  var geminiTexts = screen.getAllByText('Gemini Routing');
                  expect(geminiTexts.length).toBeGreaterThan(0);
                  expect(
                    screen.getByText('Gemini routing causing quality degradation of 7%')
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
    it('should display top savings opportunities', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('Top Savings Opportunities')).toBeInTheDocument();
                  // Should show opportunities sorted by annual savings
                  var savingsText = screen.getAllByText(/\$[0-9,]+/);
                  expect(
                    savingsText.some(function (el) {
                      var _a;
                      return (_a = el.textContent) === null || _a === void 0
                        ? void 0
                        : _a.includes('$57,135');
                    })
                  ).toBe(true);
                  expect(
                    savingsText.some(function (el) {
                      var _a;
                      return (_a = el.textContent) === null || _a === void 0
                        ? void 0
                        : _a.includes('$24,422');
                    })
                  ).toBe(true);
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
  describe('User Interactions', function () {
    beforeEach(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          costOptimizationApi.getDashboardData.mockResolvedValue(mockDashboardData);
          return [2 /*return*/];
        });
      });
    });
    it('should handle time range selection', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var select;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByDisplayValue('30 Days')).toBeInTheDocument();
                }),
              ];
            case 1:
              _a.sent();
              select = screen.getByDisplayValue('30 Days');
              fireEvent.change(select, { target: { value: '7' } });
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(costOptimizationApi.getDashboardData).toHaveBeenCalledWith(7);
                }),
              ];
            case 2:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle refresh button click', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var refreshButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('Refresh')).toBeInTheDocument();
                }),
              ];
            case 1:
              _a.sent();
              refreshButton = screen.getByText('Refresh');
              fireEvent.click(refreshButton);
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(costOptimizationApi.getDashboardData).toHaveBeenCalledTimes(2);
                }),
              ];
            case 2:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle optimization card clicks', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  var visionCards = screen.getAllByText('Vision Model Switch');
                  var visionCard = visionCards[0].closest('[data-testid="card"]');
                  expect(visionCard).toBeInTheDocument();
                  if (visionCard) {
                    fireEvent.click(visionCard);
                    // Note: In a real implementation, this might navigate or show details
                    // For now, we just verify the click handler exists
                  }
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
  describe('Error Handling', function () {
    it('should display error message on API failure', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              errorMessage = 'Failed to load dashboard data';
              costOptimizationApi.getDashboardData.mockRejectedValue(new Error(errorMessage));
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(
                    screen.getByText('Error loading cost dashboard: '.concat(errorMessage))
                  ).toBeInTheDocument();
                  expect(screen.getByText('Retry')).toBeInTheDocument();
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle retry after error', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage, retryButton;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              errorMessage = 'Network error';
              costOptimizationApi.getDashboardData
                .mockRejectedValueOnce(new Error(errorMessage))
                .mockResolvedValueOnce(mockDashboardData);
              render(_jsx(CostOptimizationDashboard, {}));
              // Wait for error to appear
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('Retry')).toBeInTheDocument();
                }),
              ];
            case 1:
              // Wait for error to appear
              _a.sent();
              retryButton = screen.getByText('Retry');
              fireEvent.click(retryButton);
              // Wait for success
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('Cost Optimization Dashboard')).toBeInTheDocument();
                  expect(screen.queryByText('Retry')).not.toBeInTheDocument();
                }),
              ];
            case 2:
              // Wait for success
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle unknown error types', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              costOptimizationApi.getDashboardData.mockRejectedValue('String error');
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(
                    screen.getByText(
                      'Error loading cost dashboard: Failed to load cost dashboard data'
                    )
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
  });
  describe('Data Formatting', function () {
    beforeEach(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          costOptimizationApi.getDashboardData.mockResolvedValue(mockDashboardData);
          return [2 /*return*/];
        });
      });
    });
    it('should format currency values correctly', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Should format large numbers with commas and no decimals
                  expect(screen.getByText('$9,000')).toBeInTheDocument();
                  expect(screen.getByText('$109,500')).toBeInTheDocument();
                  // Use getAllByText for elements that appear multiple times
                  var elements = screen.getAllByText('$57,135');
                  expect(elements.length).toBeGreaterThan(0);
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should format percentage values correctly', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('90.0% reduction')).toBeInTheDocument();
                  expect(screen.getByText('94.0%')).toBeInTheDocument();
                  expect(screen.getByText('67.0%')).toBeInTheDocument();
                  expect(screen.getByText('-6.0%')).toBeInTheDocument();
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should apply correct color coding for savings', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // High savings (94%) should have green color class
                  var highSavingsElement = screen.getByText('94.0%');
                  expect(highSavingsElement).toHaveClass('text-green-600');
                  // Medium savings (67%) should have appropriate color
                  var mediumSavingsElement = screen.getByText('67.0%');
                  expect(mediumSavingsElement).toHaveClass('text-green-600'); // Still good
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
  describe('Responsive Design', function () {
    beforeEach(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          costOptimizationApi.getDashboardData.mockResolvedValue(mockDashboardData);
          return [2 /*return*/];
        });
      });
    });
    it('should apply responsive grid classes', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Key metrics grid
                  var metricsGrid = screen.getByText('Total Savings').closest('.grid');
                  expect(metricsGrid).toHaveClass(
                    'grid-cols-1',
                    'md:grid-cols-2',
                    'lg:grid-cols-4'
                  );
                  // Optimization cards grid
                  var optimizationGrid = screen.getByText('Vision Model Switch').closest('.grid');
                  expect(optimizationGrid).toHaveClass(
                    'grid-cols-1',
                    'md:grid-cols-2',
                    'lg:grid-cols-3'
                  );
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
  describe('Accessibility', function () {
    beforeEach(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          costOptimizationApi.getDashboardData.mockResolvedValue(mockDashboardData);
          return [2 /*return*/];
        });
      });
    });
    it('should have proper heading structure', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Main heading
                  expect(
                    screen.getByRole('heading', { level: 1, name: 'Cost Optimization Dashboard' })
                  ).toBeInTheDocument();
                  // Section headings
                  expect(
                    screen.getByRole('heading', { level: 2, name: 'Cost Alerts' })
                  ).toBeInTheDocument();
                  expect(
                    screen.getByRole('heading', { level: 2, name: 'Top Savings Opportunities' })
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
    it('should have accessible form controls', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  var select = screen.getByDisplayValue('30 Days');
                  // Verify select element exists and is selectable
                  expect(select).toBeInTheDocument();
                  expect(select.tagName).toBe('SELECT');
                  var refreshButton = screen.getByText('Refresh');
                  expect(refreshButton).toBeInstanceOf(HTMLButtonElement);
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
  describe('Chart Data Preparation', function () {
    beforeEach(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          costOptimizationApi.getDashboardData.mockResolvedValue(mockDashboardData);
          return [2 /*return*/];
        });
      });
    });
    it('should prepare line chart data correctly', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var Line;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, import('react-chartjs-2')];
            case 1:
              Line = _a.sent().Line;
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(Line).toHaveBeenCalled();
                  var chartProps = Line.mock.calls[0][0];
                  expect(chartProps.data).toBeDefined();
                  // Date format depends on locale, so check length instead of exact values
                  expect(chartProps.data.labels).toHaveLength(2);
                  expect(chartProps.data.datasets).toHaveLength(2);
                  expect(chartProps.data.datasets[0].label).toBe('Daily Savings');
                  expect(chartProps.data.datasets[1].label).toBe('Cumulative Savings');
                }),
              ];
            case 2:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should prepare bar chart data correctly', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var Bar;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, import('react-chartjs-2')];
            case 1:
              Bar = _a.sent().Bar;
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(Bar).toHaveBeenCalled();
                  var chartProps = Bar.mock.calls[0][0];
                  expect(chartProps.data).toBeDefined();
                  expect(chartProps.data.labels).toEqual(['Vision Model Switch', 'Gemini Routing']);
                  expect(chartProps.data.datasets[0].data).toEqual([57135.0, 24421.5]);
                }),
              ];
            case 2:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should prepare doughnut chart data correctly', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var Doughnut;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, import('react-chartjs-2')];
            case 1:
              Doughnut = _a.sent().Doughnut;
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(Doughnut).toHaveBeenCalled();
                  var chartProps = Doughnut.mock.calls[0][0];
                  expect(chartProps.data).toBeDefined();
                  expect(chartProps.data.labels).toHaveLength(5);
                  expect(chartProps.data.datasets[0].data).toEqual([45.0, 32.0, 15.0, 5.0, 3.0]);
                }),
              ];
            case 2:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
  });
  describe('Edge Cases', function () {
    it('should handle empty optimization metrics', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var emptyData;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              emptyData = __assign(__assign({}, mockDashboardData), { optimization_metrics: [] });
              costOptimizationApi.getDashboardData.mockResolvedValue(emptyData);
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Should still render the dashboard but without optimization cards
                  expect(screen.getByText('Cost Optimization Dashboard')).toBeInTheDocument();
                  expect(screen.queryByText('Vision Model Switch')).not.toBeInTheDocument();
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle missing optional data fields', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var incompleteData;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              incompleteData = __assign(__assign({}, mockDashboardData), {
                optimization_metrics: [
                  __assign(__assign({}, mockDashboardData.optimization_metrics[0]), {
                    quality_impact: null,
                    latency_impact: null,
                  }),
                ],
              });
              costOptimizationApi.getDashboardData.mockResolvedValue(incompleteData);
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  // Should still render but handle null values gracefully
                  var visionTexts = screen.getAllByText('Vision Model Switch');
                  expect(visionTexts.length).toBeGreaterThan(0);
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
    it('should handle zero or negative savings', function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var negativeData;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              negativeData = __assign(__assign({}, mockDashboardData), {
                total_percentage_savings: -5.0,
                total_absolute_savings: -500.0,
              });
              costOptimizationApi.getDashboardData.mockResolvedValue(negativeData);
              render(_jsx(CostOptimizationDashboard, {}));
              return [
                4 /*yield*/,
                waitFor(function () {
                  expect(screen.getByText('-5.0% reduction')).toBeInTheDocument();
                  expect(screen.getByText('-$500')).toBeInTheDocument();
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
});
//# sourceMappingURL=CostOptimizationDashboard.test.js.map
