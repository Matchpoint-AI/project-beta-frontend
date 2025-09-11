/** API client for performance monitoring endpoints. */
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
import { API_BASE_URL } from './config';
var PerformanceApiClient = /** @class */ (function () {
  function PerformanceApiClient() {
    this.baseUrl = ''.concat(API_BASE_URL, '/api/v1/performance');
  }
  PerformanceApiClient.prototype.getAuthToken = function () {
    return __awaiter(this, void 0, void 0, function () {
      var token;
      return __generator(this, function (_a) {
        token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        return [2 /*return*/, token];
      });
    });
  };
  PerformanceApiClient.prototype.makeRequest = function (endpoint_1) {
    return __awaiter(this, arguments, void 0, function (endpoint, options) {
      var token, response, errorMessage, errorData, _a;
      if (options === void 0) {
        options = {};
      }
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4 /*yield*/, this.getAuthToken()];
          case 1:
            token = _b.sent();
            return [
              4 /*yield*/,
              fetch(
                ''.concat(this.baseUrl).concat(endpoint),
                __assign(__assign({}, options), {
                  headers: __assign(
                    { 'Content-Type': 'application/json', Authorization: 'Bearer '.concat(token) },
                    options.headers
                  ),
                })
              ),
            ];
          case 2:
            response = _b.sent();
            if (response.ok) return [3 /*break*/, 7];
            errorMessage = 'HTTP '.concat(response.status, ': ').concat(response.statusText);
            _b.label = 3;
          case 3:
            _b.trys.push([3, 5, , 6]);
            return [4 /*yield*/, response.json()];
          case 4:
            errorData = _b.sent();
            errorMessage = errorData.detail || errorMessage;
            return [3 /*break*/, 6];
          case 5:
            _a = _b.sent();
            return [3 /*break*/, 6];
          case 6:
            throw new Error(errorMessage);
          case 7:
            return [2 /*return*/, response.json()];
        }
      });
    });
  };
  PerformanceApiClient.prototype.makeRequestWithoutAuth = function (endpoint_1) {
    return __awaiter(this, arguments, void 0, function (endpoint, options) {
      var response, errorMessage, errorData, _a;
      if (options === void 0) {
        options = {};
      }
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(
                ''.concat(this.baseUrl).concat(endpoint),
                __assign(__assign({}, options), {
                  headers: __assign({ 'Content-Type': 'application/json' }, options.headers),
                })
              ),
            ];
          case 1:
            response = _b.sent();
            if (response.ok) return [3 /*break*/, 6];
            errorMessage = 'HTTP '.concat(response.status, ': ').concat(response.statusText);
            _b.label = 2;
          case 2:
            _b.trys.push([2, 4, , 5]);
            return [4 /*yield*/, response.json()];
          case 3:
            errorData = _b.sent();
            errorMessage = errorData.detail || errorMessage;
            return [3 /*break*/, 5];
          case 4:
            _a = _b.sent();
            return [3 /*break*/, 5];
          case 5:
            throw new Error(errorMessage);
          case 6:
            return [2 /*return*/, response.json()];
        }
      });
    });
  };
  // Metric recording methods
  PerformanceApiClient.prototype.recordMetric = function (request) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.makeRequest('/metrics', {
            method: 'POST',
            body: JSON.stringify(request),
          }),
        ];
      });
    });
  };
  PerformanceApiClient.prototype.recordCostMetric = function (operation_1, model_1, cost_1) {
    return __awaiter(this, arguments, void 0, function (operation, model, cost, tokensUsed) {
      var params;
      if (tokensUsed === void 0) {
        tokensUsed = 0;
      }
      return __generator(this, function (_a) {
        params = new URLSearchParams({
          operation: operation,
          model: model,
          cost: cost.toString(),
          tokens_used: tokensUsed.toString(),
        });
        return [
          2 /*return*/,
          this.makeRequest('/metrics/cost?'.concat(params), {
            method: 'POST',
          }),
        ];
      });
    });
  };
  PerformanceApiClient.prototype.recordQualityMetric = function (operation, qualityScore, details) {
    return __awaiter(this, void 0, void 0, function () {
      var params, options;
      return __generator(this, function (_a) {
        params = new URLSearchParams({
          operation: operation,
          quality_score: qualityScore.toString(),
        });
        options = {
          method: 'POST',
        };
        if (details) {
          options.body = JSON.stringify(details);
        }
        return [2 /*return*/, this.makeRequest('/metrics/quality?'.concat(params), options)];
      });
    });
  };
  // Metrics summary and analysis
  PerformanceApiClient.prototype.getMetricsSummary = function () {
    return __awaiter(this, arguments, void 0, function (params) {
      var searchParams, queryString, endpoint;
      if (params === void 0) {
        params = {};
      }
      return __generator(this, function (_a) {
        searchParams = new URLSearchParams();
        if (params.metric_type) searchParams.set('metric_type', params.metric_type);
        if (params.hours_back) searchParams.set('hours_back', params.hours_back.toString());
        if (params.operation) searchParams.set('operation', params.operation);
        if (params.model) searchParams.set('model', params.model);
        queryString = searchParams.toString();
        endpoint = queryString ? '/metrics/summary?'.concat(queryString) : '/metrics/summary';
        return [2 /*return*/, this.makeRequest(endpoint)];
      });
    });
  };
  PerformanceApiClient.prototype.getCostAnalysis = function () {
    return __awaiter(this, arguments, void 0, function (params) {
      var searchParams, queryString, endpoint;
      if (params === void 0) {
        params = {};
      }
      return __generator(this, function (_a) {
        searchParams = new URLSearchParams();
        if (params.hours_back) {
          searchParams.set('hours_back', params.hours_back.toString());
        }
        queryString = searchParams.toString();
        endpoint = queryString ? '/costs/analysis?'.concat(queryString) : '/costs/analysis';
        return [2 /*return*/, this.makeRequest(endpoint)];
      });
    });
  };
  // Alert management
  PerformanceApiClient.prototype.getActiveAlerts = function (severity) {
    return __awaiter(this, void 0, void 0, function () {
      var params;
      return __generator(this, function (_a) {
        params = severity ? '?severity='.concat(severity) : '';
        return [2 /*return*/, this.makeRequest('/alerts'.concat(params))];
      });
    });
  };
  PerformanceApiClient.prototype.resolveAlert = function (alertId) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          this.makeRequest('/alerts/'.concat(alertId, '/resolve'), {
            method: 'POST',
          }),
        ];
      });
    });
  };
  // Health check
  PerformanceApiClient.prototype.getHealthCheck = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, this.makeRequestWithoutAuth('/health')];
      });
    });
  };
  // Utility methods
  PerformanceApiClient.prototype.getMetricTypes = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, this.makeRequest('/metrics/types')];
      });
    });
  };
  PerformanceApiClient.prototype.getAlertSeverities = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2 /*return*/, this.makeRequest('/alerts/severities')];
      });
    });
  };
  // Convenience methods for tracking operations
  PerformanceApiClient.prototype.trackOperation = function (operationName_1) {
    return __awaiter(this, arguments, void 0, function (operationName, labels, operation) {
      var startTime, error, result, latency, err_1;
      if (labels === void 0) {
        labels = {};
      }
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            startTime = Date.now();
            error = null;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 6]);
            return [4 /*yield*/, operation()];
          case 2:
            result = _a.sent();
            latency = (Date.now() - startTime) / 1000;
            return [
              4 /*yield*/,
              this.recordMetric({
                metric_type: 'latency',
                value: latency,
                labels: __assign(__assign({}, labels), { operation: operationName }),
              }),
            ];
          case 3:
            _a.sent();
            return [2 /*return*/, result];
          case 4:
            err_1 = _a.sent();
            error = err_1 instanceof Error ? err_1 : new Error(String(err_1));
            // Record error
            return [
              4 /*yield*/,
              this.recordMetric({
                metric_type: 'error_rate',
                value: 1.0,
                labels: __assign(__assign({}, labels), { operation: operationName }),
                metadata: { error: error.message },
              }),
            ];
          case 5:
            // Record error
            _a.sent();
            throw error;
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  // Batch operations
  PerformanceApiClient.prototype.recordMultipleMetrics = function (requests) {
    return __awaiter(this, void 0, void 0, function () {
      var promises;
      var _this = this;
      return __generator(this, function (_a) {
        promises = requests.map(function (request) {
          return _this.recordMetric(request);
        });
        return [2 /*return*/, Promise.all(promises)];
      });
    });
  };
  // Real-time monitoring helpers
  PerformanceApiClient.prototype.startRealTimeMonitoring = function (callback, intervalMs) {
    var _this = this;
    if (intervalMs === void 0) {
      intervalMs = 30000;
    }
    var interval = setInterval(function () {
      return __awaiter(_this, void 0, void 0, function () {
        var _a, alerts, health, error_1;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 2, , 3]);
              return [4 /*yield*/, Promise.all([this.getActiveAlerts(), this.getHealthCheck()])];
            case 1:
              ((_a = _b.sent()), (alerts = _a[0]), (health = _a[1]));
              callback({ alerts: alerts, health: health });
              return [3 /*break*/, 3];
            case 2:
              error_1 = _b.sent();
              console.error('Real-time monitoring error:', error_1);
              return [3 /*break*/, 3];
            case 3:
              return [2 /*return*/];
          }
        });
      });
    }, intervalMs);
    // Return cleanup function
    return function () {
      return clearInterval(interval);
    };
  };
  // Performance insights
  PerformanceApiClient.prototype.getPerformanceInsights = function () {
    return __awaiter(this, arguments, void 0, function (hoursBack) {
      var _a, latency, errors, costs, quality, alerts;
      if (hoursBack === void 0) {
        hoursBack = 24;
      }
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4 /*yield*/,
              Promise.all([
                this.getMetricsSummary({ metric_type: 'latency', hours_back: hoursBack }),
                this.getMetricsSummary({ metric_type: 'error_rate', hours_back: hoursBack }),
                this.getCostAnalysis({ hours_back: hoursBack }),
                this.getMetricsSummary({ metric_type: 'quality', hours_back: hoursBack }),
                this.getActiveAlerts(),
              ]),
            ];
          case 1:
            ((_a = _b.sent()),
              (latency = _a[0]),
              (errors = _a[1]),
              (costs = _a[2]),
              (quality = _a[3]),
              (alerts = _a[4]));
            return [
              2 /*return*/,
              { latency: latency, errors: errors, costs: costs, quality: quality, alerts: alerts },
            ];
        }
      });
    });
  };
  return PerformanceApiClient;
})();
export var performanceApi = new PerformanceApiClient();
//# sourceMappingURL=performanceApi.js.map
