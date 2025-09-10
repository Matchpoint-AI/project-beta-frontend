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
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PerformancePredictionDashboard from './PerformancePredictionDashboard';
import { useAuth } from '../../features/auth/context/AuthContext';
// Mock the dependencies
vi.mock('../../api/performanceApi');
vi.mock('../../features/auth/context/AuthContext');
// No chart mocking needed - using CSS-based visualizations
describe('PerformancePredictionDashboard', function () {
  var mockProfile = {
    uid: 'test-user-id',
    email: 'test@example.com',
    token: 'test-token',
  };
  beforeEach(function () {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      profile: mockProfile,
      isAuthenticated: true,
    });
  });
  afterEach(function () {
    vi.clearAllMocks();
  });
  it('renders loading state initially', function () {
    render(_jsx(PerformancePredictionDashboard, {}));
    expect(screen.getByText('Analyzing performance patterns...')).toBeInTheDocument();
    expect(screen.getByText('AI is predicting future metrics')).toBeInTheDocument();
  });
  it('renders dashboard header with title and time range buttons', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Performance Predictions')).toBeInTheDocument();
                expect(
                  screen.getByText('AI-powered insights for future campaign performance')
                ).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            // Check time range buttons
            ['24h', '7d', '30d', '90d'].forEach(function (range) {
              expect(screen.getByRole('button', { name: range })).toBeInTheDocument();
            });
            return [2 /*return*/];
        }
      });
    });
  });
  it('renders all prediction metric cards', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
                expect(screen.getByText('Reach')).toBeInTheDocument();
                expect(screen.getByText('Comments')).toBeInTheDocument();
                expect(screen.getByText('Shares')).toBeInTheDocument();
                expect(screen.getByText('Impressions')).toBeInTheDocument();
                expect(screen.getByText('Click Rate')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays confidence scores for predictions', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                var confidenceChips = screen.getAllByText(/\d+% sure/);
                expect(confidenceChips.length).toBeGreaterThan(0);
                // Check that confidence scores are within valid range
                confidenceChips.forEach(function (chip) {
                  var _a, _b;
                  var confidence = parseInt(
                    ((_b =
                      (_a = chip.textContent) === null || _a === void 0
                        ? void 0
                        : _a.match(/\d+/)) === null || _b === void 0
                      ? void 0
                      : _b[0]) || '0'
                  );
                  expect(confidence).toBeGreaterThanOrEqual(0);
                  expect(confidence).toBeLessThanOrEqual(100);
                });
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('renders performance trajectory chart', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Performance Trajectory')).toBeInTheDocument();
                expect(screen.getByText('Actual')).toBeInTheDocument();
                expect(screen.getByText('Predicted')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('renders engagement distribution chart', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Engagement Mix')).toBeInTheDocument();
                expect(screen.getByText('Optimize for:')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('renders campaign predictions with recommendations', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Summer Collection Launch')).toBeInTheDocument();
                expect(screen.getByText('Product Tutorial Series')).toBeInTheDocument();
                // Check for AI recommendations
                var recommendations = screen.getAllByText(/AI Recommendations/);
                expect(recommendations.length).toBeGreaterThan(0);
                // Check for specific recommendation content
                expect(screen.getByText(/Post at 2 PM on weekdays/)).toBeInTheDocument();
                expect(screen.getByText(/Create 60-second video tutorials/)).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays campaign metrics correctly', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                // Check for metric labels
                expect(screen.getAllByText('Predicted Reach').length).toBeGreaterThan(0);
                expect(screen.getAllByText('Engagement').length).toBeGreaterThan(0);
                expect(screen.getAllByText('Conversions').length).toBeGreaterThan(0);
                // Check for metric values
                expect(screen.getByText('45.0K')).toBeInTheDocument(); // Predicted reach
                expect(screen.getByText('8.5%')).toBeInTheDocument(); // Engagement rate
                expect(screen.getByText('320')).toBeInTheDocument(); // Conversions
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('renders content performance forecast section', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Content Type Performance Forecast')).toBeInTheDocument();
                expect(screen.getByText('Video Reels')).toBeInTheDocument();
                expect(screen.getByText('Product Photos')).toBeInTheDocument();
                expect(screen.getByText('User Stories')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays optimal posting times', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Best time: 7:00 PM - 9:00 PM')).toBeInTheDocument();
                expect(screen.getByText('Best time: 12:00 PM - 2:00 PM')).toBeInTheDocument();
                expect(screen.getByText('Best time: 8:00 AM - 10:00 AM')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('shows suggested hashtags for content types', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('#Trending')).toBeInTheDocument();
                expect(screen.getByText('#ProductLaunch')).toBeInTheDocument();
                expect(screen.getByText('#CustomerLove')).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays performance optimization alert', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(
                  screen.getByText('Performance Optimization Opportunity')
                ).toBeInTheDocument();
                expect(
                  screen.getByText(/posting video content on Thursday evenings/)
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
  it('handles time range selection', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                var sevenDayButton = screen.getByRole('button', { name: '7d' });
                var thirtyDayButton = screen.getByRole('button', { name: '30d' });
                // Initially 7d should be selected
                expect(sevenDayButton).toHaveClass('bg-purple-600');
                expect(thirtyDayButton).toHaveClass('bg-gray-100');
                // Click 30d button
                fireEvent.click(thirtyDayButton);
                // Check classes are updated
                expect(thirtyDayButton).toHaveClass('bg-purple-600');
                expect(sevenDayButton).toHaveClass('bg-gray-100');
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays trend indicators correctly', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                // Check for trend percentages
                var trendElements = screen.getAllByText(/\d+\.\d+%/);
                expect(trendElements.length).toBeGreaterThan(0);
                // Verify trend indicators are present
                trendElements.forEach(function (element) {
                  var _a, _b;
                  var percentage = parseFloat(
                    ((_b =
                      (_a = element.textContent) === null || _a === void 0
                        ? void 0
                        : _a.match(/\d+\.\d+/)) === null || _b === void 0
                      ? void 0
                      : _b[0]) || '0'
                  );
                  expect(percentage).toBeGreaterThan(0);
                });
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('shows performance scores for campaigns', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('92')).toBeInTheDocument(); // Performance score
                expect(screen.getByText('78')).toBeInTheDocument(); // Performance score
                var performanceLabels = screen.getAllByText('Performance Score');
                expect(performanceLabels.length).toBeGreaterThan(0);
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays AI insight in performance chart section', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText(/AI Insight:/)).toBeInTheDocument();
                expect(screen.getByText(/expected to increase by 32%/)).toBeInTheDocument();
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('renders metric icons correctly', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                // Check that metric cards are rendered with proper structure
                var metricCards = document.querySelectorAll('.bg-white.rounded-xl');
                expect(metricCards.length).toBeGreaterThan(0);
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('handles missing authentication gracefully', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            useAuth.mockReturnValue({
              profile: null,
              isAuthenticated: false,
            });
            render(_jsx(PerformancePredictionDashboard, {}));
            // Should still render but may show limited data
            return [
              4 /*yield*/,
              waitFor(function () {
                expect(screen.getByText('Analyzing performance patterns...')).toBeInTheDocument();
              }),
            ];
          case 1:
            // Should still render but may show limited data
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('displays correct confidence score styling', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                var highConfidenceChips = screen.getAllByText(/8[5-9]% confidence|9\d% confidence/);
                var _mediumConfidenceChips = screen.getAllByText(
                  /7[0-9]% confidence|8[0-4]% confidence/
                );
                // At least some high confidence predictions should exist
                expect(highConfidenceChips.length).toBeGreaterThan(0);
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('shows performance improvement percentages', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                // Check for improvement indicators
                var improvements = screen.getAllByText(/\+\d+%/);
                expect(improvements.length).toBeGreaterThan(0);
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  it('renders all three content performance cards', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            render(_jsx(PerformancePredictionDashboard, {}));
            return [
              4 /*yield*/,
              waitFor(function () {
                var contentSection = screen.getByText(
                  'Content Type Performance Forecast'
                ).parentElement;
                expect(contentSection).toBeInTheDocument();
                // Check that all three content types are present
                var contentTypes = ['Video Reels', 'Product Photos', 'User Stories'];
                contentTypes.forEach(function (type) {
                  expect(within(contentSection).getByText(type)).toBeInTheDocument();
                });
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
//# sourceMappingURL=PerformancePredictionDashboard.test.js.map
