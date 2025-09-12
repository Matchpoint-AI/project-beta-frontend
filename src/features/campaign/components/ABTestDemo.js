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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { FaFlask, FaPlay, FaChartBar } from 'react-icons/fa';
import ABTestVariantComparison from './ABTestVariantComparison';
// Demo data for the A/B test
var demoTestConfig = {
    id: 'demo-test-123',
    name: 'Caption Engagement Test',
    description: 'Testing emoji vs. text-only captions for engagement',
    status: 'running',
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-02-03T23:59:59Z',
    minSampleSize: 2000,
    significanceThreshold: 0.95,
    primaryMetric: 'ctr',
    variants: [
        {
            id: 'demo-variant-1',
            name: 'Text-Only Control',
            type: 'caption',
            content: {
                text: 'Discover our premium skincare line. Transform your daily routine with science-backed formulas. #skincare #premium #beauty',
            },
            status: 'running',
            trafficAllocation: 40,
            performance: {
                clicks: 320,
                impressions: 5200,
                ctr: 0.0615,
                engagement: 890,
                conversions: 47,
                cost: 124.8,
                confidenceLevel: 0.92,
            },
            created_at: '2024-01-20T09:00:00Z',
            updated_at: '2024-01-20T09:00:00Z',
            author: 'Marketing Team',
            notes: 'Clean, professional tone without emojis',
        },
        {
            id: 'demo-variant-2',
            name: 'Emoji-Rich Test',
            type: 'caption',
            content: {
                text: 'Discover our premium skincare line ✨ Transform your daily routine with science-backed formulas 🧴💫 #skincare #premium #beauty',
            },
            status: 'running',
            trafficAllocation: 40,
            performance: {
                clicks: 425,
                impressions: 5200,
                ctr: 0.0817,
                engagement: 1240,
                conversions: 63,
                cost: 118.4,
                confidenceLevel: 0.97,
            },
            created_at: '2024-01-20T09:15:00Z',
            updated_at: '2024-01-20T09:15:00Z',
            author: 'Marketing Team',
            notes: 'Engaging emojis to increase visual appeal',
        },
        {
            id: 'demo-variant-3',
            name: 'Question Format',
            type: 'caption',
            content: {
                text: 'Ready to transform your skin? 🤔 Our premium skincare line combines science with luxury. What are you waiting for? ✨ #skincare #transformation',
            },
            status: 'running',
            trafficAllocation: 20,
            performance: {
                clicks: 298,
                impressions: 2600,
                ctr: 0.1146,
                engagement: 780,
                conversions: 41,
                cost: 89.4,
                confidenceLevel: 0.89,
            },
            created_at: '2024-01-20T10:00:00Z',
            updated_at: '2024-01-20T10:00:00Z',
            author: 'Creative Team',
            notes: 'Conversational tone with direct questions',
        },
    ],
};
var ABTestDemo = function () {
    var _a;
    var _b = useState(false), isComparisonOpen = _b[0], setIsComparisonOpen = _b[1];
    var _c = useState(demoTestConfig), demoData = _c[0], setDemoData = _c[1];
    var handleOpenComparison = function () {
        setIsComparisonOpen(true);
    };
    var handleCloseComparison = function () {
        setIsComparisonOpen(false);
    };
    var handleSaveVariant = function (variantId, content, notes) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Simulate API call
            // Update demo data
            setDemoData(function (prev) { return (__assign(__assign({}, prev), { variants: prev.variants.map(function (v) {
                    return v.id === variantId
                        ? __assign(__assign({}, v), { content: content, notes: notes || v.notes, updated_at: new Date().toISOString() }) : v;
                }) })); });
            return [2 /*return*/];
        });
    }); };
    var handleUpdateTrafficAllocation = function (allocations) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setDemoData(function (prev) { return (__assign(__assign({}, prev), { variants: prev.variants.map(function (v) { return (__assign(__assign({}, v), { trafficAllocation: allocations[v.id] || v.trafficAllocation })); }) })); });
            return [2 /*return*/];
        });
    }); };
    var handleStartTest = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setDemoData(function (prev) { return (__assign(__assign({}, prev), { status: 'running' })); });
            return [2 /*return*/];
        });
    }); };
    var handlePauseTest = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setDemoData(function (prev) { return (__assign(__assign({}, prev), { status: 'paused' })); });
            return [2 /*return*/];
        });
    }); };
    var handleDeclareWinner = function (variantId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setDemoData(function (prev) { return (__assign(__assign({}, prev), { status: 'completed', variants: prev.variants.map(function (v) { return (__assign(__assign({}, v), { status: v.id === variantId ? 'winner' : 'completed' })); }) })); });
            return [2 /*return*/];
        });
    }); };
    var handleCreateVariant = function (variant) { return __awaiter(void 0, void 0, void 0, function () {
        var newVariant;
        return __generator(this, function (_a) {
            newVariant = __assign({ id: "demo-variant-".concat(Date.now()), name: "Variant ".concat(demoData.variants.length + 1), type: 'caption', content: { text: 'New variant content...' }, status: 'draft', trafficAllocation: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), author: 'Demo User' }, variant);
            setDemoData(function (prev) { return (__assign(__assign({}, prev), { variants: __spreadArray(__spreadArray([], prev.variants, true), [newVariant], false) })); });
            return [2 /*return*/];
        });
    }); };
    var getWinningVariant = function () {
        return (demoData.variants.find(function (v) { return v.status === 'winner'; }) ||
            demoData.variants.reduce(function (best, current) { var _a, _b; return (((_a = current.performance) === null || _a === void 0 ? void 0 : _a.ctr) || 0) > (((_b = best.performance) === null || _b === void 0 ? void 0 : _b.ctr) || 0) ? current : best; }));
    };
    var winningVariant = getWinningVariant();
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsxs(Typography, { variant: "h4", sx: { mb: 3, display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(FaFlask, { color: "#2196f3" }), "A/B Test Demo - Caption Variants"] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2,
                                        }, children: [_jsx(Typography, { variant: "h6", children: demoData.name }), _jsx(Chip, { label: demoData.status.toUpperCase(), color: demoData.status === 'running' ? 'success' : 'primary', icon: _jsx(FaPlay, {}) })] }), _jsx(Typography, { variant: "body2", color: "textSecondary", sx: { mb: 2 }, children: demoData.description }), _jsxs(Box, { sx: { display: 'flex', gap: 2, mb: 2 }, children: [_jsxs(Typography, { variant: "caption", children: [_jsx("strong", { children: "Variants:" }), " ", demoData.variants.length] }), _jsxs(Typography, { variant: "caption", children: [_jsx("strong", { children: "Primary Metric:" }), " ", demoData.primaryMetric.toUpperCase()] }), _jsxs(Typography, { variant: "caption", children: [_jsx("strong", { children: "Min Sample:" }), " ", demoData.minSampleSize.toLocaleString()] })] }), _jsx(Button, { variant: "contained", onClick: handleOpenComparison, startIcon: _jsx(FaChartBar, {}), size: "large", children: "View A/B Test Comparison" })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Current Leader" }), winningVariant && (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(Typography, { variant: "h5", color: "success.main", children: winningVariant.name }), winningVariant.status === 'winner' && (_jsx(Typography, { variant: "h6", sx: { ml: 1 }, children: "\uD83D\uDC51" }))] }), _jsxs(Typography, { variant: "body2", color: "textSecondary", sx: { mb: 2 }, children: [(_a = winningVariant.content.text) === null || _a === void 0 ? void 0 : _a.substring(0, 80), "..."] }), winningVariant.performance && (_jsxs(Box, { children: [_jsxs(Typography, { variant: "h4", color: "primary", children: [(winningVariant.performance.ctr * 100).toFixed(2), "%"] }), _jsx(Typography, { variant: "caption", children: "Click-through rate" }), _jsxs(Box, { sx: { mt: 2 }, children: [_jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Confidence:" }), ' ', (winningVariant.performance.confidenceLevel * 100).toFixed(1), "%"] }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Conversions:" }), " ", winningVariant.performance.conversions] })] })] }))] }))] }) }) }), _jsxs(Grid, { item: true, xs: 12, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Variant Previews" }), _jsx(Grid, { container: true, spacing: 2, children: demoData.variants.map(function (variant, _index) { return (_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { variant: "outlined", children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: {
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mb: 2,
                                                    }, children: [_jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: variant.name }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Chip, { label: "".concat(variant.trafficAllocation, "%"), size: "small", color: "primary" }), variant.status === 'winner' && _jsx(Typography, { variant: "body2", children: "\uD83D\uDC51" })] })] }), _jsx(Typography, { variant: "body2", sx: { mb: 2, minHeight: 60 }, children: variant.content.text }), variant.performance && (_jsx(Box, { children: _jsxs(Typography, { variant: "caption", color: "textSecondary", children: ["CTR: ", (variant.performance.ctr * 100).toFixed(2), "% | Engagement:", ' ', variant.performance.engagement.toLocaleString()] }) }))] }) }) }, variant.id)); }) })] })] }), _jsx(ABTestVariantComparison, { isOpen: isComparisonOpen, onClose: handleCloseComparison, testConfig: demoData, onSaveVariant: handleSaveVariant, onUpdateTrafficAllocation: handleUpdateTrafficAllocation, onStartTest: handleStartTest, onPauseTest: handlePauseTest, onDeclareWinner: handleDeclareWinner, onCreateVariant: handleCreateVariant, title: "A/B Test Variant Comparison - Demo" })] }));
};
export default ABTestDemo;
//# sourceMappingURL=ABTestDemo.js.map