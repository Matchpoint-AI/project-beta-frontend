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
import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import HITLReviewPanel from './HITLReviewPanel';
import QualityGatePanel from './QualityGatePanel';
import ContentComparisonModal from './ContentComparisonModal';
// Mock AuthContext
var mockProfile = { uid: 'test-user-123', email: 'test@example.com' };
vi.mock('../../../features/auth/context/AuthContext', function () { return ({
    useAuth: function () { return ({ profile: mockProfile }); },
}); });
// Mock ResizeObserver for Material-UI components
global.ResizeObserver = vi.fn(function () { return ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}); });
// Mock Material-UI components to avoid conflicts
vi.mock('@mui/material', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vi.importActual('@mui/material')];
            case 1:
                actual = _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { Dialog: function (_a) {
                            var open = _a.open, children = _a.children;
                            return open ? _jsx("div", { "data-testid": "hitl-dialog", children: children }) : null;
                        }, DialogContent: function (_a) {
                            var children = _a.children;
                            return (_jsx("div", { "data-testid": "hitl-dialog-content", children: children }));
                        }, Card: function (_a) {
                            var children = _a.children;
                            return (_jsx("div", { "data-testid": "hitl-card", children: children }));
                        }, Accordion: function (_a) {
                            var children = _a.children;
                            return (_jsx("div", { "data-testid": "hitl-accordion", children: children }));
                        } })];
        }
    });
}); });
describe('HITL Review Components', function () {
    describe('Component Rendering', function () {
        it('HITLReviewPanel renders without crashing', function () {
            var mockItems = [
                {
                    id: 'test-1',
                    type: 'caption',
                    content: 'Test content',
                    status: 'pending',
                },
            ];
            var container = render(_jsx(HITLReviewPanel, { items: mockItems, onApprove: vi.fn(), onReject: vi.fn(), onEdit: vi.fn(), onRegenerate: vi.fn(), onClose: vi.fn(), isOpen: true })).container;
            expect(container).toBeTruthy();
        });
        it('QualityGatePanel renders without crashing', function () {
            var container = render(_jsx(QualityGatePanel, { itemId: "test-item", itemType: "caption", content: "Test content for quality assessment" })).container;
            expect(container).toBeTruthy();
        });
        it('ContentComparisonModal renders without crashing', function () {
            var mockVersions = [
                {
                    id: 'v1',
                    content: 'Test content version 1',
                    timestamp: '2023-01-01T00:00:00Z',
                    author: 'Test Author',
                    type: 'original',
                },
            ];
            var container = render(_jsx(ContentComparisonModal, { isOpen: false, onClose: vi.fn(), itemId: "test-item", itemType: "caption", versions: mockVersions, onSave: vi.fn(), onRevert: vi.fn() })).container;
            expect(container).toBeTruthy();
        });
    });
    describe('Component Props', function () {
        it('HITLReviewPanel handles empty items array', function () {
            var container = render(_jsx(HITLReviewPanel, { items: [], onApprove: vi.fn(), onReject: vi.fn(), onEdit: vi.fn(), onRegenerate: vi.fn(), onClose: vi.fn(), isOpen: true })).container;
            expect(container).toBeTruthy();
        });
        it('QualityGatePanel handles different content types', function () {
            var container = render(_jsx(QualityGatePanel, { itemId: "test-item-2", itemType: "image", content: "A test image prompt" })).container;
            expect(container).toBeTruthy();
        });
        it('ContentComparisonModal handles closed state', function () {
            var container = render(_jsx(ContentComparisonModal, { isOpen: false, onClose: vi.fn(), itemId: "test-item", itemType: "caption", versions: [], onSave: vi.fn(), onRevert: vi.fn() })).container;
            expect(container).toBeTruthy();
        });
    });
});
//# sourceMappingURL=HITLReview.test.js.map