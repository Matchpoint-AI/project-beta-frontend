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
/**
 * Cost Optimization Dashboard Component
 *
 * Tracks and visualizes the 90% cost reduction achievements from COST-1 through COST-6:
 * - GPT-4o to GPT-4o-mini vision switch (94% reduction, $85K annually)
 * - Gemini 2.5 Flash-Lite routing (67% cheaper than GPT-4o-mini, $50K annually)
 * - FLUX.1 [schnell] for high volume (10x cheaper, $75K annually)
 * - Imagen 4 for text-in-image clarity (95% legibility improvement)
 * - Smart Model Router v2 (90% total cost reduction)
 * - Scene Mix Engine contextual bandits (25% engagement boost)
 */
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { DollarSign, TrendingUp, Target, AlertTriangle, Zap, Eye, Image as ImageIcon, Cpu, Settings, Award, } from 'lucide-react';
import { costOptimizationApi } from '../../api/costOptimizationApi';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);
var OPTIMIZATION_CONFIG = {
    vision_model_switch: {
        name: 'Vision Model Switch',
        icon: Eye,
        description: 'GPT-4o → GPT-4o-mini',
        expectedSavings: 94,
        targetAnnualSavings: 85000,
        color: '#10B981', // emerald-500
    },
    gemini_routing: {
        name: 'Gemini Routing',
        icon: Zap,
        description: 'Gemini 2.5 Flash-Lite',
        expectedSavings: 67,
        targetAnnualSavings: 50000,
        color: '#3B82F6', // blue-500
    },
    flux_high_volume: {
        name: 'FLUX High Volume',
        icon: ImageIcon,
        description: 'FLUX.1 [schnell]',
        expectedSavings: 90,
        targetAnnualSavings: 75000,
        color: '#8B5CF6', // violet-500
    },
    imagen_text_clarity: {
        name: 'Imagen Text Clarity',
        icon: Target,
        description: 'Imagen 4 for text-in-image',
        expectedSavings: 50,
        targetAnnualSavings: 25000,
        color: '#F59E0B', // amber-500
    },
    smart_router_v2: {
        name: 'Smart Router v2',
        icon: Cpu,
        description: 'Intelligent model routing',
        expectedSavings: 90,
        targetAnnualSavings: 100000,
        color: '#EF4444', // red-500
    },
    scene_mix_bandits: {
        name: 'Scene Mix Engine',
        icon: Settings,
        description: 'Contextual bandits',
        expectedSavings: 25,
        targetAnnualSavings: 30000,
        color: '#06B6D4', // cyan-500
    },
};
var TIME_RANGES = [
    { label: '7 Days', days: 7 },
    { label: '30 Days', days: 30 },
    { label: '90 Days', days: 90 },
];
export var CostOptimizationDashboard = function () {
    var _a = useState(null), dashboardData = _a[0], setDashboardData = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(30), selectedTimeRange = _d[0], setSelectedTimeRange = _d[1];
    var _e = useState(null), _selectedOptimization = _e[0], setSelectedOptimization = _e[1];
    useEffect(function () {
        fetchDashboardData();
    }, [selectedTimeRange]);
    var fetchDashboardData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, _err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, costOptimizationApi.getDashboardData(selectedTimeRange)];
                case 1:
                    data = _a.sent();
                    setDashboardData(data);
                    return [3 /*break*/, 4];
                case 2:
                    _err_1 = _a.sent();
                    setError(_err_1 instanceof Error ? _err_1.message : 'Failed to load cost dashboard data');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getSavingsColor = function (percentage) {
        if (percentage >= 80)
            return 'text-green-600';
        if (percentage >= 50)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    var getOptimizationIcon = function (type) {
        var config = OPTIMIZATION_CONFIG[type];
        var IconComponent = (config === null || config === void 0 ? void 0 : config.icon) || Settings;
        return _jsx(IconComponent, { className: "h-5 w-5" });
    };
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    var formatPercentage = function (value) {
        return "".concat(value.toFixed(1), "%");
    };
    var createSavingsTrendChart = function () {
        if (!(dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.daily_savings))
            return null;
        var data = {
            labels: dashboardData.daily_savings.map(function (d) { return new Date(d.date).toLocaleDateString(); }),
            datasets: [
                {
                    label: 'Daily Savings',
                    data: dashboardData.daily_savings.map(function (d) { return d.daily_savings; }),
                    borderColor: '#10B981',
                    backgroundColor: '#10B98120',
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: 'Cumulative Savings',
                    data: dashboardData.daily_savings.map(function (d) { return d.cumulative_savings; }),
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F620',
                    tension: 0.4,
                    yAxisID: 'y1',
                },
            ],
        };
        var options = {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Cost Savings Trend Over Time',
                },
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date',
                    },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Daily Savings ($)',
                    },
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Cumulative Savings ($)',
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
        };
        return _jsx(Line, { data: data, options: options });
    };
    var createOptimizationComparisonChart = function () {
        if (!(dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.optimization_metrics))
            return null;
        var metrics = dashboardData.optimization_metrics.filter(function (m) { return OPTIMIZATION_CONFIG[m.optimization_type]; });
        var data = {
            labels: metrics.map(function (m) {
                var _a;
                return ((_a = OPTIMIZATION_CONFIG[m.optimization_type]) === null || _a === void 0 ? void 0 : _a.name) ||
                    m.optimization_type;
            }),
            datasets: [
                {
                    label: 'Annual Savings ($)',
                    data: metrics.map(function (m) { return m.projected_annual_savings; }),
                    backgroundColor: metrics.map(function (m) {
                        var _a;
                        return ((_a = OPTIMIZATION_CONFIG[m.optimization_type]) === null || _a === void 0 ? void 0 : _a.color) ||
                            '#6B7280';
                    }),
                    borderWidth: 1,
                },
            ],
        };
        var options = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Savings by Optimization Type',
                },
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Annual Savings ($)',
                    },
                },
            },
        };
        return _jsx(Bar, { data: data, options: options });
    };
    var createModelDistributionChart = function () {
        if (!(dashboardData === null || dashboardData === void 0 ? void 0 : dashboardData.current_model_distribution))
            return null;
        var models = Object.entries(dashboardData.current_model_distribution);
        var data = {
            labels: models.map(function (_a) {
                var model = _a[0];
                return model.replace(/-/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); });
            }),
            datasets: [
                {
                    data: models.map(function (_a) {
                        var _data = _a[1];
                        return _data.percentage;
                    }),
                    backgroundColor: [
                        '#10B981', // emerald
                        '#3B82F6', // blue
                        '#8B5CF6', // violet
                        '#F59E0B', // amber
                        '#EF4444', // red
                        '#06B6D4', // cyan
                    ],
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                },
            ],
        };
        var options = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Current Model Usage Distribution',
                },
                legend: {
                    position: 'right',
                },
            },
        };
        return _jsx(Doughnut, { data: data, options: options });
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    if (error) {
        return (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center space-x-2 text-red-600", children: [_jsx(AlertTriangle, { className: "h-5 w-5" }), _jsxs("span", { children: ["Error loading cost dashboard: ", error] })] }), _jsx(Button, { onClick: fetchDashboardData, className: "mt-4", children: "Retry" })] }));
    }
    if (!dashboardData) {
        return null;
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Cost Optimization Dashboard" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Track the 90% cost reduction achievement through AI model optimizations" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("select", { value: selectedTimeRange, onChange: function (e) { return setSelectedTimeRange(Number(e.target.value)); }, className: "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", children: TIME_RANGES.map(function (range) { return (_jsx("option", { value: range.days, children: range.label }, range.days)); }) }), _jsx(Button, { onClick: fetchDashboardData, variant: "outline", size: "sm", children: "Refresh" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(Card, { className: "p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx(DollarSign, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Savings" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(dashboardData.total_absolute_savings) }), _jsxs("p", { className: "text-sm text-green-600", children: [formatPercentage(dashboardData.total_percentage_savings), " reduction"] })] })] }) }), _jsx(Card, { className: "p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(TrendingUp, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Annual Projection" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(dashboardData.projected_annual_savings) }), _jsx("p", { className: "text-sm text-blue-600", children: "Based on current trend" })] })] }) }), _jsx(Card, { className: "p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-purple-100 rounded-lg", children: _jsx(Award, { className: "h-6 w-6 text-purple-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Quality Impact" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [dashboardData.overall_quality_impact > 0 ? '+' : '', formatPercentage(dashboardData.overall_quality_impact * 100)] }), _jsx("p", { className: "text-sm ".concat(dashboardData.overall_quality_impact >= 0 ? 'text-green-600' : 'text-red-600'), children: dashboardData.overall_quality_impact >= 0 ? 'Maintained' : 'Decreased' })] })] }) }), _jsx(Card, { className: "p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-amber-100 rounded-lg", children: _jsx(Target, { className: "h-6 w-6 text-amber-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Budget Utilization" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatPercentage(dashboardData.budget_utilization * 100) }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-1", children: _jsx("div", { className: "bg-amber-600 h-2 rounded-full", style: { width: "".concat(dashboardData.budget_utilization * 100, "%") } }) })] })] }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: dashboardData.optimization_metrics.map(function (metric) {
                    var config = OPTIMIZATION_CONFIG[metric.optimization_type];
                    if (!config)
                        return null;
                    return (_jsxs(Card, { className: "p-6 cursor-pointer hover:shadow-md transition-shadow", onClick: function () { return setSelectedOptimization(metric.optimization_type); }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: "".concat(config.color, "20") }, children: getOptimizationIcon(metric.optimization_type) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: config.name }), _jsx("p", { className: "text-sm text-gray-600", children: config.description })] })] }), _jsx(Badge, { variant: metric.percentage_savings >= config.expectedSavings ? 'success' : 'warning', children: metric.percentage_savings >= config.expectedSavings
                                            ? 'On Track'
                                            : 'Below Target' })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Savings:" }), _jsx("span", { className: "font-semibold ".concat(getSavingsColor(metric.percentage_savings)), children: formatPercentage(metric.percentage_savings) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Annual:" }), _jsx("span", { className: "font-semibold text-gray-900", children: formatCurrency(metric.projected_annual_savings) })] }), metric.quality_impact !== null && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Quality:" }), _jsxs("span", { className: "font-semibold ".concat(metric.quality_impact >= 0 ? 'text-green-600' : 'text-red-600'), children: [metric.quality_impact > 0 ? '+' : '', formatPercentage(metric.quality_impact * 100)] })] })), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "h-2 rounded-full transition-all duration-300", style: {
                                                width: "".concat(Math.min(100, (metric.percentage_savings / config.expectedSavings) * 100), "%"),
                                                backgroundColor: config.color,
                                            } }) })] })] }, metric.optimization_type));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(Card, { className: "p-6", children: _jsx("div", { className: "h-80", children: createSavingsTrendChart() }) }), _jsx(Card, { className: "p-6", children: _jsx("div", { className: "h-80", children: createOptimizationComparisonChart() }) }), _jsx(Card, { className: "p-6", children: _jsx("div", { className: "h-80 flex items-center justify-center", children: createModelDistributionChart() }) }), _jsx(Card, { className: "p-6", children: _jsx("div", { className: "h-80", children: _jsx(Line, { data: {
                                    labels: dashboardData.cost_efficiency_trend.map(function (d) {
                                        return new Date(d.date).toLocaleDateString();
                                    }),
                                    datasets: [
                                        {
                                            label: 'Cost Efficiency',
                                            data: dashboardData.cost_efficiency_trend.map(function (d) { return d.cost_efficiency * 100; }),
                                            borderColor: '#8B5CF6',
                                            backgroundColor: '#8B5CF620',
                                            tension: 0.4,
                                            fill: true,
                                        },
                                    ],
                                }, options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Cost Efficiency Trend',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 100,
                                            title: {
                                                display: true,
                                                text: 'Efficiency (%)',
                                            },
                                        },
                                    },
                                } }) }) })] }), dashboardData.cost_alerts.length > 0 && (_jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Cost Alerts" }), _jsx("div", { className: "space-y-3", children: dashboardData.cost_alerts.map(function (alert, index) {
                            var _a;
                            return (_jsx("div", { className: "p-4 rounded-lg border-l-4 ".concat(alert.severity === 'critical'
                                    ? 'bg-red-50 border-red-500'
                                    : alert.severity === 'warning'
                                        ? 'bg-yellow-50 border-yellow-500'
                                        : 'bg-blue-50 border-blue-500'), children: _jsxs("div", { className: "flex items-start", children: [_jsx(AlertTriangle, { className: "h-5 w-5 mt-0.5 ".concat(alert.severity === 'critical'
                                                ? 'text-red-500'
                                                : alert.severity === 'warning'
                                                    ? 'text-yellow-500'
                                                    : 'text-blue-500') }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "font-medium text-gray-900", children: ((_a = OPTIMIZATION_CONFIG[alert.optimization]) === null || _a === void 0 ? void 0 : _a.name) || alert.optimization }), _jsx("p", { className: "text-sm text-gray-700", children: alert.message }), alert.expected_value && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Expected: ", alert.expected_value, ", Current: ", alert.current_value.toFixed(1)] }))] })] }) }, index));
                        }) })] })), _jsxs(Card, { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Top Savings Opportunities" }), _jsx("div", { className: "space-y-3", children: dashboardData.top_savings_by_optimization.slice(0, 5).map(function (opportunity, index) {
                            var config = OPTIMIZATION_CONFIG[opportunity.optimization_type];
                            return (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: "".concat((config === null || config === void 0 ? void 0 : config.color) || '#6B7280', "20") }, children: getOptimizationIcon(opportunity.optimization_type) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: (config === null || config === void 0 ? void 0 : config.name) || opportunity.optimization_type }), _jsxs("p", { className: "text-sm text-gray-600", children: [formatPercentage(opportunity.percentage_savings), " savings"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-semibold text-gray-900", children: formatCurrency(opportunity.annual_savings) }), _jsx("p", { className: "text-sm text-gray-600", children: "Annual potential" })] })] }, index));
                        }) })] })] }));
};
//# sourceMappingURL=CostOptimizationDashboard.js.map