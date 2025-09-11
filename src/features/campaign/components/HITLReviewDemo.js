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
import { useState, useCallback } from 'react';
import { Button, Box, Typography, Card, CardContent, Grid } from '@mui/material';
import HITLReviewPanel from './HITLReviewPanel';
import QualityGatePanel from './QualityGatePanel';
import ContentComparisonModal from './ContentComparisonModal';
/**
 * Demo component showcasing the HITL Review UI components
 * This demonstrates how to integrate all the review components together
 */
var HITLReviewDemo = function () {
    var _a = useState(false), showReviewPanel = _a[0], setShowReviewPanel = _a[1];
    var _b = useState(false), showComparisonModal = _b[0], setShowComparisonModal = _b[1];
    // Mock data for demonstration
    var mockContentItems = [
        {
            id: 'item-1',
            type: 'caption',
            content: 'Discover the perfect blend of style and comfort with our new collection. Elevate your wardrobe today! #Fashion #Style #NewCollection',
            originalContent: 'Check out our new collection of stylish and comfortable clothes.',
            status: 'pending',
            qualityScore: 0.87,
            metadata: {
                sceneType: 'product',
                sceneSubtype: 'lifestyle',
                brandCompliance: 0.92,
                diversityScore: 0.78,
            },
        },
        {
            id: 'item-2',
            type: 'image',
            content: 'A modern, minimalist photo of a diverse group of people wearing our latest fashion collection, shot in natural lighting with a clean white background',
            status: 'approved',
            qualityScore: 0.94,
            metadata: {
                sceneType: 'human',
                sceneSubtype: 'group',
                brandCompliance: 0.96,
                diversityScore: 0.89,
            },
        },
        {
            id: 'item-3',
            type: 'prompt',
            content: 'Create an Instagram-style image featuring our premium skincare products arranged aesthetically with natural elements like flowers and stones',
            status: 'rejected',
            qualityScore: 0.71,
            feedback: 'Needs more brand-specific elements and clearer product focus',
            metadata: {
                sceneType: 'product',
                sceneSubtype: 'flatlay',
                brandCompliance: 0.65,
                diversityScore: 0.82,
            },
        },
    ];
    var mockVersions = [
        {
            id: 'v1',
            content: 'Discover the perfect blend of style and comfort with our new collection. Elevate your wardrobe today! #Fashion #Style #NewCollection',
            timestamp: new Date().toISOString(),
            author: 'AI Assistant',
            type: 'ai_generated',
            metadata: {
                model: 'gpt-4',
                qualityScore: 0.87,
                prompt: 'Generate an engaging Instagram caption for a fashion collection launch',
            },
        },
        {
            id: 'v2',
            content: 'Check out our new collection of stylish and comfortable clothes.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            author: 'Content Team',
            type: 'original',
        },
        {
            id: 'v3',
            content: 'Transform your style with our latest collection – where comfort meets elegance. Shop now and redefine your wardrobe! ✨ #FashionForward #Comfort #Style',
            timestamp: new Date(Date.now() + 1800000).toISOString(),
            author: 'Sarah Johnson',
            type: 'human_edited',
            metadata: {
                feedback: 'Added more engaging language and relevant emojis',
            },
        },
    ];
    // Mock handlers for the HITL Review Panel
    var handleApprove = useCallback(function (_itemId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleReject = useCallback(function (_itemId, _feedback) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleEdit = useCallback(function (_itemId, _newContent) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleRegenerate = useCallback(function (_itemId, _targetedChanges) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // Mock handlers for Content Comparison Modal
    var handleSave = useCallback(function (_itemId, _content, _notes) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleRevert = useCallback(function (_itemId, _versionId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleQualityRecheck = useCallback(function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
                case 1:
                    _a.sent();
                    // Return mock quality result
                    return [2 /*return*/, {
                            itemId: itemId,
                            overallScore: Math.random() * 0.3 + 0.7, // 0.7-1.0
                            passed: true,
                            checks: [],
                            recommendations: ['Consider adding more engaging call-to-action'],
                            blockers: [],
                            timestamp: new Date().toISOString(),
                        }];
            }
        });
    }); }, []);
    return (_jsxs(Box, { sx: { p: 3 }, children: [_jsx(Typography, { variant: "h4", sx: { mb: 3 }, children: "HITL Review UI Components Demo" }), _jsx(Typography, { variant: "body1", sx: { mb: 4, color: 'text.secondary' }, children: "This demo showcases the Human-In-The-Loop (HITL) review UI components for AI content generation systems. These components enable content reviewers to assess, edit, approve, and regenerate AI-generated content with quality gates and version comparison capabilities." }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Demo Controls" }), _jsxs(Box, { sx: { display: 'flex', gap: 2, flexWrap: 'wrap' }, children: [_jsx(Button, { variant: "contained", onClick: function () { return setShowReviewPanel(true); }, color: "primary", children: "Open Review Panel" }), _jsx(Button, { variant: "contained", onClick: function () { return setShowComparisonModal(true); }, color: "secondary", children: "Open Content Comparison" })] })] }) }) }), _jsxs(Grid, { item: true, xs: 12, lg: 6, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Quality Gate Panel" }), _jsx(QualityGatePanel, { itemId: "demo-item-1", itemType: "caption", content: "Discover the perfect blend of style and comfort with our new collection. Elevate your wardrobe today! #Fashion #Style #NewCollection", metadata: {
                                    sceneType: 'product',
                                    sceneSubtype: 'lifestyle',
                                    brandId: 'fashion-brand-123',
                                    campaignId: 'spring-collection-2024',
                                }, onRecheck: handleQualityRecheck })] }), _jsxs(Grid, { item: true, xs: 12, lg: 6, children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Quality Gate Panel (Image Content)" }), _jsx(QualityGatePanel, { itemId: "demo-item-2", itemType: "image", content: "A modern, minimalist photo of a diverse group of people wearing our latest fashion collection", metadata: {
                                    sceneType: 'human',
                                    sceneSubtype: 'group',
                                    brandId: 'fashion-brand-123',
                                    campaignId: 'spring-collection-2024',
                                }, onRecheck: handleQualityRecheck })] }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Component Features" }), _jsx(Typography, { variant: "subtitle1", sx: { mb: 1, fontWeight: 'bold' }, children: "HITLReviewPanel:" }), _jsxs(Typography, { variant: "body2", sx: { mb: 2 }, children: ["\u2022 Multi-item review interface with side-by-side layout", _jsx("br", {}), "\u2022 Individual item approval, rejection, editing, and regeneration", _jsx("br", {}), "\u2022 Quality score display and metadata visualization", _jsx("br", {}), "\u2022 Diff view for content changes", _jsx("br", {}), "\u2022 Targeted feedback and regeneration requests"] }), _jsx(Typography, { variant: "subtitle1", sx: { mb: 1, fontWeight: 'bold' }, children: "QualityGatePanel:" }), _jsxs(Typography, { variant: "body2", sx: { mb: 2 }, children: ["\u2022 Automated quality assessment with multiple check categories", _jsx("br", {}), "\u2022 Brand compliance, diversity, consistency, completeness, and policy checks", _jsx("br", {}), "\u2022 Expandable detailed results with explanations", _jsx("br", {}), "\u2022 Score visualization and pass/fail status", _jsx("br", {}), "\u2022 Recommendations and blocker identification"] }), _jsx(Typography, { variant: "subtitle1", sx: { mb: 1, fontWeight: 'bold' }, children: "ContentComparisonModal:" }), _jsxs(Typography, { variant: "body2", children: ["\u2022 Multi-version content comparison and editing", _jsx("br", {}), "\u2022 Side-by-side diff view with syntax highlighting", _jsx("br", {}), "\u2022 Version history with metadata and timestamps", _jsx("br", {}), "\u2022 In-place editing with notes and change tracking", _jsx("br", {}), "\u2022 Revert capabilities and fullscreen mode"] })] }) }) })] }), _jsx(HITLReviewPanel, { items: mockContentItems, onApprove: handleApprove, onReject: handleReject, onEdit: handleEdit, onRegenerate: handleRegenerate, onClose: function () { return setShowReviewPanel(false); }, isOpen: showReviewPanel, campaignId: "demo-campaign" }), _jsx(ContentComparisonModal, { isOpen: showComparisonModal, onClose: function () { return setShowComparisonModal(false); }, itemId: "demo-item-1", itemType: "caption", versions: mockVersions, onSave: handleSave, onRevert: handleRevert, title: "Caption Content History & Editor" })] }));
};
export default HITLReviewDemo;
//# sourceMappingURL=HITLReviewDemo.js.map