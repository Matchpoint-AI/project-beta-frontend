/**
 * Cost Optimization API Client
 *
 * Provides methods to interact with the cost optimization tracking backend service.
 * Handles authentication(_error) handling, and data transformation for the frontend.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getToken } from '../features/auth/utils/authFetch';
var CONTENT_GEN_URL = process.env.NEXT_PUBLIC_CONTENT_GEN_URL || 'http://localhost:8080';
var CostOptimizationApiError = /** @class */ (function (_super) {
    __extends(CostOptimizationApiError, _super);
    function CostOptimizationApiError(message, status, details) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.details = details;
        _this.name = 'CostOptimizationApiError';
        return _this;
    }
    return CostOptimizationApiError;
}(Error));
/**
 * Fetches cost optimization dashboard data for the specified period
 * @param startDate - Start date for the period (ISO 8601 format)
 * @param endDate - End date for the period (ISO 8601 format)
 * @returns Promise<CostDashboardData>
 */
export function fetchCostOptimizationData(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var token, params, response, errorBody, data, _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getToken()];
                case 1:
                    token = _a.sent();
                    if (!token) {
                        throw new CostOptimizationApiError('No authentication token available', 401);
                    }
                    params = new URLSearchParams();
                    if (startDate)
                        params.append('start_date', startDate);
                    if (endDate)
                        params.append('end_date', endDate);
                    return [4 /*yield*/, fetch("".concat(CONTENT_GEN_URL, "/api/v1/cost-optimization/dashboard?").concat(params.toString()), {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorBody = _a.sent();
                    throw new CostOptimizationApiError("Failed to fetch cost optimization data: ".concat(response.statusText), response.status, errorBody);
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    return [2 /*return*/, transformDashboardData(data)];
                case 6:
                    _error_1 = _a.sent();
                    if (_error_1 instanceof CostOptimizationApiError) {
                        throw _error_1;
                    }
                    throw new CostOptimizationApiError("Error fetching cost optimization data: ".concat(_error_1 instanceof Error ? _error_1.message : 'Unknown error'), undefined, _error_1);
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Tracks API usage for cost optimization analysis
 * @param usageData - Usage data to track
 * @returns Promise<void>
 */
export function trackApiUsage(usageData) {
    return __awaiter(this, void 0, void 0, function () {
        var token, response, errorBody, _error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getToken()];
                case 1:
                    token = _a.sent();
                    if (!token) {
                        throw new CostOptimizationApiError('No authentication token available', 401);
                    }
                    return [4 /*yield*/, fetch("".concat(CONTENT_GEN_URL, "/api/v1/cost-optimization/track"), {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(usageData),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorBody = _a.sent();
                    throw new CostOptimizationApiError("Failed to track API usage: ".concat(response.statusText), response.status, errorBody);
                case 4: return [3 /*break*/, 6];
                case 5:
                    _error_2 = _a.sent();
                    if (_error_2 instanceof CostOptimizationApiError) {
                        throw _error_2;
                    }
                    throw new CostOptimizationApiError("Error tracking API usage: ".concat(_error_2 instanceof Error ? _error_2.message : 'Unknown error'), undefined, _error_2);
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetches model comparison data for cost optimization
 * @param startDate - Start date for the comparison period
 * @param endDate - End date for the comparison period
 * @returns Promise<OptimizationComparison[]>
 */
export function fetchModelComparison(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var token, params, response, errorBody, _error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getToken()];
                case 1:
                    token = _a.sent();
                    if (!token) {
                        throw new CostOptimizationApiError('No authentication token available', 401);
                    }
                    params = new URLSearchParams();
                    if (startDate)
                        params.append('start_date', startDate);
                    if (endDate)
                        params.append('end_date', endDate);
                    return [4 /*yield*/, fetch("".concat(CONTENT_GEN_URL, "/api/v1/cost-optimization/model-comparison?").concat(params.toString()), {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorBody = _a.sent();
                    throw new CostOptimizationApiError("Failed to fetch model comparison: ".concat(response.statusText), response.status, errorBody);
                case 4: return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    _error_3 = _a.sent();
                    if (_error_3 instanceof CostOptimizationApiError) {
                        throw _error_3;
                    }
                    throw new CostOptimizationApiError("Error fetching model comparison: ".concat(_error_3 instanceof Error ? _error_3.message : 'Unknown error'), undefined, _error_3);
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Exports cost optimization data as CSV
 * @param startDate - Start date for the export period
 * @param endDate - End date for the export period
 * @returns Promise<Blob>
 */
export function exportCostData(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var token, params, response, errorBody, _error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getToken()];
                case 1:
                    token = _a.sent();
                    if (!token) {
                        throw new CostOptimizationApiError('No authentication token available', 401);
                    }
                    params = new URLSearchParams();
                    if (startDate)
                        params.append('start_date', startDate);
                    if (endDate)
                        params.append('end_date', endDate);
                    return [4 /*yield*/, fetch("".concat(CONTENT_GEN_URL, "/api/v1/cost-optimization/export?").concat(params.toString()), {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorBody = _a.sent();
                    throw new CostOptimizationApiError("Failed to export cost data: ".concat(response.statusText), response.status, errorBody);
                case 4: return [4 /*yield*/, response.blob()];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    _error_4 = _a.sent();
                    if (_error_4 instanceof CostOptimizationApiError) {
                        throw _error_4;
                    }
                    throw new CostOptimizationApiError("Error exporting cost data: ".concat(_error_4 instanceof Error ? _error_4.message : 'Unknown error'), undefined, _error_4);
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Updates cost optimization settings
 * @param settings - Settings to update
 * @returns Promise<void>
 */
export function updateOptimizationSettings(settings) {
    return __awaiter(this, void 0, void 0, function () {
        var token, response, errorBody, _error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getToken()];
                case 1:
                    token = _a.sent();
                    if (!token) {
                        throw new CostOptimizationApiError('No authentication token available', 401);
                    }
                    return [4 /*yield*/, fetch("".concat(CONTENT_GEN_URL, "/api/v1/cost-optimization/settings"), {
                            method: 'PUT',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(settings),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorBody = _a.sent();
                    throw new CostOptimizationApiError("Failed to update optimization settings: ".concat(response.statusText), response.status, errorBody);
                case 4: return [3 /*break*/, 6];
                case 5:
                    _error_5 = _a.sent();
                    if (_error_5 instanceof CostOptimizationApiError) {
                        throw _error_5;
                    }
                    throw new CostOptimizationApiError("Error updating optimization settings: ".concat(_error_5 instanceof Error ? _error_5.message : 'Unknown error'), undefined, _error_5);
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Transforms raw dashboard data from the API to the expected frontend format
 * @param data - Raw data from the API
 * @returns Transformed dashboard data
 */
function transformDashboardData(data) {
    // Handle case where data might be wrapped in a response object
    var isWrappedResponse = typeof data === 'object' && data !== null && 'data' in data;
    var dashboardData = isWrappedResponse ? data.data : data;
    var safeData = dashboardData;
    return {
        period_start: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.period_start) === 'string' ? safeData.period_start : new Date().toISOString(),
        period_end: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.period_end) === 'string' ? safeData.period_end : new Date().toISOString(),
        total_baseline_cost: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.total_baseline_cost) === 'number' ? safeData.total_baseline_cost : 0,
        total_optimized_cost: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.total_optimized_cost) === 'number' ? safeData.total_optimized_cost : 0,
        total_absolute_savings: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.total_absolute_savings) === 'number' ? safeData.total_absolute_savings : 0,
        total_percentage_savings: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.total_percentage_savings) === 'number'
            ? safeData.total_percentage_savings
            : 0,
        projected_annual_savings: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.projected_annual_savings) === 'number'
            ? safeData.projected_annual_savings
            : 0,
        optimization_metrics: Array.isArray(safeData === null || safeData === void 0 ? void 0 : safeData.optimization_metrics)
            ? safeData.optimization_metrics
            : [],
        current_model_distribution: typeof (safeData === null || safeData === void 0 ? void 0 : safeData.current_model_distribution) === 'object'
            ? safeData.current_model_distribution
            : {},
        daily_savings: Array.isArray(safeData === null || safeData === void 0 ? void 0 : safeData.daily_savings)
            ? safeData.daily_savings
            : [],
        optimization_recommendations: Array.isArray(safeData === null || safeData === void 0 ? void 0 : safeData.optimization_recommendations)
            ? safeData.optimization_recommendations
            : [],
    };
}
// Mock data generator for testing
export function generateMockCostData() {
    var endDate = new Date();
    var startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    var baselineCost = 1250.0;
    var optimizedCost = 875.0;
    var savings = baselineCost - optimizedCost;
    var percentageSavings = (savings / baselineCost) * 100;
    // Generate daily savings data
    var dailySavings = [];
    var cumulativeSavings = 0;
    for (var i = 0; i < 30; i++) {
        var date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        var dailyBaseline = 35 + Math.random() * 20;
        var dailyOptimized = dailyBaseline * 0.7;
        var dailySaving = dailyBaseline - dailyOptimized;
        cumulativeSavings += dailySaving;
        dailySavings.push({
            date: date.toISOString().split('T')[0],
            daily_savings: dailySaving,
            cumulative_savings: cumulativeSavings,
            baseline_cost: dailyBaseline,
            optimized_cost: dailyOptimized,
        });
    }
    return {
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
        total_baseline_cost: baselineCost,
        total_optimized_cost: optimizedCost,
        total_absolute_savings: savings,
        total_percentage_savings: percentageSavings,
        projected_annual_savings: savings * 12,
        optimization_metrics: [
            {
                optimization_type: 'model_routing',
                period_start: startDate.toISOString(),
                period_end: endDate.toISOString(),
                baseline_cost: 500,
                baseline_requests: 1000,
                baseline_cost_per_request: 0.5,
                baseline_model: 'gpt-4',
                optimized_cost: 300,
                optimized_requests: 1000,
                optimized_cost_per_request: 0.3,
                optimized_model: 'gpt-3.5-turbo',
                absolute_savings: 200,
                percentage_savings: 40,
                projected_annual_savings: 2400,
                quality_before: 0.95,
                quality_after: 0.92,
                quality_impact: -3.16,
                latency_before: 2500,
                latency_after: 1800,
                latency_impact: -28,
            },
            {
                optimization_type: 'prompt_optimization',
                period_start: startDate.toISOString(),
                period_end: endDate.toISOString(),
                baseline_cost: 450,
                baseline_requests: 500,
                baseline_cost_per_request: 0.9,
                baseline_model: 'claude-3-opus',
                optimized_cost: 315,
                optimized_requests: 500,
                optimized_cost_per_request: 0.63,
                optimized_model: 'claude-3-sonnet',
                absolute_savings: 135,
                percentage_savings: 30,
                projected_annual_savings: 1620,
                quality_before: 0.94,
                quality_after: 0.91,
                quality_impact: -3.19,
                latency_before: 3000,
                latency_after: 2200,
                latency_impact: -26.67,
            },
            {
                optimization_type: 'caching',
                period_start: startDate.toISOString(),
                period_end: endDate.toISOString(),
                baseline_cost: 300,
                baseline_requests: 2000,
                baseline_cost_per_request: 0.15,
                baseline_model: 'gpt-3.5-turbo',
                optimized_cost: 260,
                optimized_requests: 2000,
                optimized_cost_per_request: 0.13,
                optimized_model: 'gpt-3.5-turbo',
                absolute_savings: 40,
                percentage_savings: 13.33,
                projected_annual_savings: 480,
                latency_before: 1500,
                latency_after: 50,
                latency_impact: -96.67,
            },
        ],
        current_model_distribution: {
            'gpt-4': {
                requests: 250,
                cost: 375,
                percentage: 42.86,
            },
            'gpt-3.5-turbo': {
                requests: 1500,
                cost: 300,
                percentage: 34.29,
            },
            'claude-3-sonnet': {
                requests: 400,
                cost: 200,
                percentage: 22.86,
            },
        },
        daily_savings: dailySavings,
        optimization_recommendations: [
            {
                recommendation: 'Switch 30% of GPT-4 requests to GPT-3.5-turbo for low-complexity tasks',
                potential_savings: 150,
                difficulty: 'low',
                impact: 'high',
            },
            {
                recommendation: 'Implement response caching for frequently requested content',
                potential_savings: 75,
                difficulty: 'medium',
                impact: 'medium',
            },
            {
                recommendation: 'Optimize prompts to reduce token usage by 20%',
                potential_savings: 100,
                difficulty: 'low',
                impact: 'medium',
            },
            {
                recommendation: 'Use batch processing for non-urgent requests',
                potential_savings: 50,
                difficulty: 'high',
                impact: 'low',
            },
        ],
    };
}
// Export all types and functions
export { CostOptimizationApiError };
//# sourceMappingURL=costOptimizationApi.js.map