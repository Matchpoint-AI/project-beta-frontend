var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Performance monitoring dashboard component. */
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { performanceApi } from '../../api/performanceApi';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);
var METRIC_TYPES = ['latency', 'error_rate', 'cost', 'quality', 'throughput'];
var TIME_RANGES = [
    { label: '1 Hour', hours: 1 },
    { label: '6 Hours', hours: 6 },
    { label: '24 Hours', hours: 24 },
    { label: '3 Days', hours: 72 },
    { label: '7 Days', hours: 168 },
];
var TrendIcon = function (_a) {
    var trend = _a.trend;
    var iconClass = 'h-4 w-4';
    switch (trend) {
        case 'increasing':
            return _jsx(TrendingUp, { className: "".concat(iconClass, " text-red-500") });
        case 'decreasing':
            return _jsx(TrendingDown, { className: "".concat(iconClass, " text-green-500") });
        case 'stable':
            return _jsx(Minus, { className: "".concat(iconClass, " text-gray-500") });
        default:
            return _jsx(Activity, { className: "".concat(iconClass, " text-gray-400") });
    }
};
var AlertBadge = function (_a) {
    var severity = _a.severity;
    var baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    var severityClasses = {
        info: 'bg-blue-100 text-blue-800',
        warning: 'bg-yellow-100 text-yellow-800',
        critical: 'bg-red-100 text-red-800',
    };
    return (_jsx("span", { className: "".concat(baseClass, " ").concat(severityClasses[severity]), children: severity.toUpperCase() }));
};
export var PerformanceDashboard = function () {
    var _a, _b, _c, _d, _e;
    var _f = useState(24), selectedTimeRange = _f[0], setSelectedTimeRange = _f[1];
    var _g = useState(''), _selectedMetricType = _g[0], _setSelectedMetricType = _g[1];
    // State for data
    var _h = useState({}), metricsSummaries = _h[0], setMetricsSummaries = _h[1];
    var _j = useState([]), alerts = _j[0], setAlerts = _j[1];
    var _k = useState(null), costAnalysis = _k[0], setCostAnalysis = _k[1];
    var _l = useState(null), healthStatus = _l[0], setHealthStatus = _l[1];
    // Loading states
    var _m = useState({
        metrics: false,
        alerts: false,
        costs: false,
        health: false,
    }), loading = _m[0], setLoading = _m[1];
    // Fetch all data
    var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var metricsPromises, _a, metricsResults, alertsData, costData, healthData, summariesMap, _error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(function (prev) { return (__assign(__assign({}, prev), { metrics: true, alerts: true, costs: true, health: true })); });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    metricsPromises = METRIC_TYPES.map(function (metricType) { return __awaiter(void 0, void 0, void 0, function () {
                        var summary;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, performanceApi.getMetricsSummary({
                                        metric_type: metricType,
                                        hours_back: selectedTimeRange,
                                    })];
                                case 1:
                                    summary = _a.sent();
                                    return [2 /*return*/, [metricType, summary]];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all([
                            Promise.all(metricsPromises),
                            performanceApi.getActiveAlerts(),
                            performanceApi.getCostAnalysis({ hours_back: selectedTimeRange }),
                            performanceApi.getHealthCheck(),
                        ])];
                case 2:
                    _a = _b.sent(), metricsResults = _a[0], alertsData = _a[1], costData = _a[2], healthData = _a[3];
                    summariesMap = Object.fromEntries(metricsResults);
                    setMetricsSummaries(summariesMap);
                    setAlerts(alertsData);
                    setCostAnalysis(costData);
                    setHealthStatus(healthData);
                    return [3 /*break*/, 5];
                case 3:
                    _error_1 = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    setLoading({ metrics: false, alerts: false, costs: false, health: false });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Auto-refresh effect
    useEffect(function () {
        fetchData();
        // Refresh every 30 seconds
        var interval = setInterval(fetchData, 30000);
        return function () { return clearInterval(interval); };
    }, [selectedTimeRange]);
    var resolveAlert = function (alertId) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedAlerts, _error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, performanceApi.resolveAlert(alertId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, performanceApi.getActiveAlerts()];
                case 2:
                    updatedAlerts = _a.sent();
                    setAlerts(updatedAlerts);
                    return [3 /*break*/, 4];
                case 3:
                    _error_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Prepare chart data
    var latencyData = {
        labels: ['P50', 'P95', 'P99', 'Max'],
        datasets: [
            {
                label: 'Response Time (seconds)',
                data: [
                    ((_a = metricsSummaries.latency) === null || _a === void 0 ? void 0 : _a.median_value) || 0,
                    ((_b = metricsSummaries.latency) === null || _b === void 0 ? void 0 : _b.p95_value) || 0,
                    ((_c = metricsSummaries.latency) === null || _c === void 0 ? void 0 : _c.p99_value) || 0,
                    ((_d = metricsSummaries.latency) === null || _d === void 0 ? void 0 : _d.max_value) || 0,
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };
    var costByOperationData = (costAnalysis === null || costAnalysis === void 0 ? void 0 : costAnalysis.cost_by_operation)
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
    var costByModelData = (costAnalysis === null || costAnalysis === void 0 ? void 0 : costAnalysis.cost_by_model)
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
    return (_jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Performance Dashboard" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("select", { value: selectedTimeRange, onChange: function (e) { return setSelectedTimeRange(Number(e.target.value)); }, className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: TIME_RANGES.map(function (_a) {
                                    var label = _a.label, hours = _a.hours;
                                    return (_jsx("option", { value: hours, children: label }, hours));
                                }) }), _jsx("button", { onClick: fetchData, disabled: Object.values(loading).some(Boolean), className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50", children: "Refresh" })] })] }), healthStatus && (_jsxs("div", { className: "p-4 rounded-lg border ".concat(healthStatus.status === 'healthy'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'), children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-3 w-3 rounded-full ".concat(healthStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500') }), _jsxs("h3", { className: "text-lg font-semibold", children: ["System Health: ", healthStatus.status] })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Last check: ", new Date(healthStatus.last_check).toLocaleString()] })] }), _jsxs("div", { className: "mt-2 grid grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: ["Recent Metrics: ", healthStatus.recent_metrics_count] }), _jsxs("div", { children: ["Active Alerts: ", healthStatus.active_alerts_count] }), _jsxs("div", { children: ["Thresholds: ", healthStatus.thresholds_configured] })] }), healthStatus.error && (_jsxs("div", { className: "mt-2 text-sm text-red-600", children: ["Error: ", healthStatus.error] }))] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: METRIC_TYPES.map(function (metricType) {
                    var summary = metricsSummaries[metricType];
                    if (!summary || summary.count === 0)
                        return null;
                    return (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-lg font-semibold capitalize", children: metricType.replace('_', ' ') }), _jsx(TrendIcon, { trend: summary.trend })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Count:" }), _jsx("span", { className: "font-medium", children: summary.count })] }), summary.mean_value !== null && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Average:" }), _jsx("span", { className: "font-medium", children: summary.mean_value.toFixed(3) })] })), summary.p95_value !== null && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "P95:" }), _jsx("span", { className: "font-medium", children: summary.p95_value.toFixed(3) })] })), summary.max_value !== null && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Max:" }), _jsx("span", { className: "font-medium", children: summary.max_value.toFixed(3) })] }))] })] }, metricType));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Response Time Distribution" }), ((_e = metricsSummaries.latency) === null || _e === void 0 ? void 0 : _e.count) > 0 ? (_jsx(Bar, { data: latencyData, options: {
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
                                } })) : (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No latency data available" }))] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Cost by Operation" }), costByOperationData ? (_jsx(Doughnut, { data: costByOperationData, options: {
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                } })) : (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No cost data available" }))] })] }), costAnalysis && (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Cost Analysis" }), _jsx(TrendIcon, { trend: costAnalysis.trend })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["$", costAnalysis.total_cost.toFixed(2)] }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Cost" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: costAnalysis.total_tokens.toLocaleString() }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Tokens" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: ["$", (costAnalysis.cost_per_1k_tokens * 1000).toFixed(3)] }), _jsx("div", { className: "text-sm text-gray-600", children: "Cost per 1K Tokens" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-orange-600", children: ["$", costAnalysis.summary_stats.mean.toFixed(3)] }), _jsx("div", { className: "text-sm text-gray-600", children: "Avg per Operation" })] })] }), costByModelData && (_jsxs("div", { className: "mt-6", children: [_jsx("h4", { className: "text-md font-medium mb-3", children: "Cost by Model" }), _jsx("div", { className: "h-64", children: _jsx(Doughnut, { data: costByModelData, options: {
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                            },
                                        },
                                    } }) })] }))] })), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "p-6 border-b", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Active Alerts" }), _jsxs("span", { className: "text-sm text-gray-600", children: [alerts.length, " active"] })] }) }), _jsx("div", { className: "divide-y", children: alerts.length === 0 ? (_jsx("div", { className: "p-6 text-center text-gray-500", children: "No active alerts" })) : (alerts.map(function (alert) { return (_jsxs("div", { className: "p-4 hover:bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-orange-500" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: alert.message }), _jsxs("div", { className: "text-sm text-gray-600", children: [alert.metric_type, " \u2022 Threshold: ", alert.threshold, " \u2022 Actual:", ' ', alert.actual_value] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertBadge, { severity: alert.severity }), _jsx("button", { onClick: function () { return resolveAlert(alert.id); }, className: "px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded", children: "Resolve" })] })] }), _jsxs("div", { className: "text-xs text-gray-500 ml-8", children: ["Triggered: ", new Date(alert.triggered_at).toLocaleString(), Object.keys(alert.labels).length > 0 && (_jsxs("span", { className: "ml-4", children: ["Labels:", ' ', Object.entries(alert.labels)
                                                    .map(function (_a) {
                                                    var k = _a[0], v = _a[1];
                                                    return "".concat(k, "=").concat(v);
                                                })
                                                    .join(', ')] }))] })] }, alert.id)); })) })] })] }));
};
//# sourceMappingURL=PerformanceDashboard.js.map