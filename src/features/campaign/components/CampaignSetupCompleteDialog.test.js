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
import { render, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CampaignSetupCompleteDialog from './CampaignSetupCompleteDialog';
import { BrandContext } from '../../brand/context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { plannerApi, policyApi } from '../../../api/contentGenerationApi';
// Mock dependencies
vi.mock('../../../features/auth/context/AuthContext');
vi.mock('react-router-dom');
vi.mock('../../../helpers/getServiceURL', function () { return ({
    getServiceURL: function () { return 'https://mock-service.com'; },
}); });
vi.mock('../../../helpers/handleNavigate', function () { return ({
    default: vi.fn(),
}); });
vi.mock('../../../api/contentGenerationApi', function () { return ({
    policyApi: {
        createPolicy: vi.fn(),
        getPolicy: vi.fn(),
        updatePolicy: vi.fn(),
    },
    plannerApi: {
        createPlan: vi.fn(),
        getPlan: vi.fn(),
        getUserPlans: vi.fn(),
    },
    captionApi: {},
    imageApi: {},
}); });
// Mock posthog
global.posthog = {
    __loaded: true,
    capture: vi.fn(),
};
describe('CampaignSetupCompleteDialog - Default Values', function () {
    beforeEach(function () {
        vi.clearAllMocks();
        global.fetch = vi.fn();
        useAuth.mockReturnValue({
            profile: { id: 'test-user-id', token: 'test-token' },
        });
        useNavigate.mockReturnValue(vi.fn());
    });
    it('should provide default values for undefined campaign fields', function () { return __awaiter(void 0, void 0, void 0, function () {
        var minimalCampaignInfo, businessInfo, fetchCall, body, campaignData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    minimalCampaignInfo = { name: 'Test Campaign' };
                    businessInfo = { name: 'Test Business' };
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    render(_jsx(BrandContext.Provider, { value: { businessInfo: businessInfo, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: { campaignInfo: minimalCampaignInfo, setCampaignInfo: vi.fn() }, children: _jsx(CampaignSetupCompleteDialog, { setCurrentStep: vi.fn(), open: true }) }) }));
                    return [4 /*yield*/, waitFor(function () {
                            expect(global.fetch).toHaveBeenCalled();
                        })];
                case 1:
                    _a.sent();
                    fetchCall = global.fetch.mock.calls[0];
                    body = JSON.parse(fetchCall[1].body);
                    campaignData = body.entity_data.campaign_data.campaign_variables;
                    // Verify default values are applied
                    expect(campaignData.product_service).toBe('');
                    expect(campaignData.audience_ethnicity).toEqual([]);
                    expect(campaignData.audience_interests).toEqual([]);
                    expect(campaignData.product_service_description).toBe('');
                    expect(campaignData.emotion).toEqual([]);
                    expect(campaignData.key_feature).toEqual([]);
                    expect(campaignData.purpose).toBe('');
                    expect(campaignData.audience_gender).toEqual([]);
                    expect(campaignData.audience_age).toEqual([]);
                    expect(campaignData.duration).toBe('2 weeks');
                    expect(campaignData.postingFrequency).toBe('Daily');
                    expect(campaignData.deliveryDay).toBe('Monday');
                    expect(campaignData.durationNum).toBe(2);
                    expect(campaignData.frequency).toBe(3);
                    expect(campaignData.summary).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle completely empty campaign info', function () { return __awaiter(void 0, void 0, void 0, function () {
        var businessInfo, fetchCall, body, campaignData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    businessInfo = { name: 'Test Business' };
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    render(_jsx(BrandContext.Provider, { value: { businessInfo: businessInfo, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: { campaignInfo: {}, setCampaignInfo: vi.fn() }, children: _jsx(CampaignSetupCompleteDialog, { setCurrentStep: vi.fn(), open: true }) }) }));
                    return [4 /*yield*/, waitFor(function () {
                            expect(global.fetch).toHaveBeenCalled();
                        })];
                case 1:
                    _a.sent();
                    fetchCall = global.fetch.mock.calls[0];
                    body = JSON.parse(fetchCall[1].body);
                    campaignData = body.entity_data.campaign_data.campaign_variables;
                    // Verify defaults including name
                    expect(campaignData.name).toBe('Untitled Campaign');
                    expect(campaignData.key_feature).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('CampaignSetupCompleteDialog - Scene Mix Integration', function () {
    beforeEach(function () {
        vi.clearAllMocks();
        vi.resetAllMocks();
        global.fetch = vi.fn();
        useAuth.mockReturnValue({
            profile: { id: 'test-user-id', token: 'test-token' },
        });
        useNavigate.mockReturnValue(vi.fn());
        // Reset the API mocks
        policyApi.createPolicy.mockReset();
        plannerApi.createPlan.mockReset();
    });
    it.skip('should create Scene Mix plan with correct parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
        var campaignInfo, businessInfo, _a, _container, _baseElement;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    campaignInfo = {
                        name: 'Test Campaign',
                        purpose: 'Make customers aware/excited',
                        durationNum: 3,
                        frequency: 5,
                        audienceInterests: ['technology', 'innovation'],
                        audienceGender: ['male', 'female'],
                        audienceAgeRange: ['25-34', '35-44'],
                    };
                    businessInfo = {
                        name: 'Test Business',
                        values: ['quality', 'innovation'],
                    };
                    // Mock successful campaign creation
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    // Mock successful policy creation
                    policyApi.createPolicy.mockResolvedValueOnce({
                        id: 'policy-123',
                        scenes: [],
                    });
                    // Mock successful plan creation
                    plannerApi.createPlan.mockResolvedValueOnce({
                        plan_id: 'plan-123',
                        campaign_id: 'test-campaign',
                        status: 'draft',
                    });
                    // Mock successful content generation trigger
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    _a = render(_jsx(BrandContext.Provider, { value: { businessInfo: businessInfo, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: { campaignInfo: campaignInfo, setCampaignInfo: vi.fn() }, children: _jsx(CampaignSetupCompleteDialog, { setCurrentStep: vi.fn(), open: true }) }) })), _container = _a.container, _baseElement = _a.baseElement;
                    // Wait for the initial campaign creation fetch to be called
                    return [4 /*yield*/, waitFor(function () {
                            expect(global.fetch).toHaveBeenCalled();
                        })];
                case 1:
                    // Wait for the initial campaign creation fetch to be called
                    _b.sent();
                    // Wait for the Scene Mix flow to complete
                    return [4 /*yield*/, waitFor(function () {
                            expect(plannerApi.createPlan).toHaveBeenCalled();
                        })];
                case 2:
                    // Wait for the Scene Mix flow to complete
                    _b.sent();
                    // Verify plan creation was called with correct parameters
                    expect(plannerApi.createPlan).toHaveBeenCalledWith(expect.any(String), // campaign ID
                    {
                        campaign_name: 'Test Campaign',
                        campaign_type: 'brand_awareness', // Mapped from purpose
                        duration_weeks: 3,
                        target_audience: ['technology', 'innovation', 'male', 'female', '25-34', '35-44'],
                        content_types: ['post', 'story', 'reel'],
                        weekly_post_count: 5,
                        themes: ['brand_awareness', 'product_showcase', 'user_stories', 'educational'],
                        brand_values: ['quality', 'innovation'],
                    }, 'test-token');
                    return [2 /*return*/];
            }
        });
    }); });
    it.skip('should map campaign purposes to correct campaign types', function () { return __awaiter(void 0, void 0, void 0, function () {
        var purposeMappings, _i, purposeMappings_1, _a, purpose, expectedType, campaignInfo, planCall;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    purposeMappings = [
                        { purpose: 'Make customers aware/excited', expectedType: 'brand_awareness' },
                        { purpose: 'Get customers to buy', expectedType: 'product_launch' },
                        { purpose: 'Build community', expectedType: 'engagement' },
                        { purpose: 'Educate audience', expectedType: 'brand_awareness' },
                    ];
                    _i = 0, purposeMappings_1 = purposeMappings;
                    _b.label = 1;
                case 1:
                    if (!(_i < purposeMappings_1.length)) return [3 /*break*/, 5];
                    _a = purposeMappings_1[_i], purpose = _a.purpose, expectedType = _a.expectedType;
                    vi.clearAllMocks();
                    campaignInfo = {
                        name: 'Test Campaign',
                        purpose: purpose,
                        durationNum: 2,
                        frequency: 3,
                    };
                    // Mock successful campaign creation
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    // Mock successful policy creation
                    policyApi.createPolicy.mockResolvedValueOnce({
                        id: 'policy-123',
                    });
                    // Mock successful plan creation
                    plannerApi.createPlan.mockResolvedValueOnce({
                        plan_id: 'plan-123',
                    });
                    // Mock successful content generation
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    render(_jsx(BrandContext.Provider, { value: { businessInfo: {}, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: { campaignInfo: campaignInfo, setCampaignInfo: vi.fn() }, children: _jsx(CampaignSetupCompleteDialog, { setCurrentStep: vi.fn(), open: true }) }) }));
                    // Wait for initial fetch
                    return [4 /*yield*/, waitFor(function () {
                            expect(global.fetch).toHaveBeenCalled();
                        })];
                case 2:
                    // Wait for initial fetch
                    _b.sent();
                    return [4 /*yield*/, waitFor(function () {
                            expect(plannerApi.createPlan).toHaveBeenCalled();
                        })];
                case 3:
                    _b.sent();
                    planCall = plannerApi.createPlan.mock.calls[0];
                    expect(planCall[1].campaign_type).toBe(expectedType);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it.skip('should handle empty audience data gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var campaignInfo, planCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    campaignInfo = {
                        name: 'Test Campaign',
                        // No purpose, so defaults to brand_awareness
                        durationNum: 1,
                        frequency: 2,
                        // No audience data
                    };
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    policyApi.createPolicy.mockResolvedValueOnce({ id: 'policy-123' });
                    plannerApi.createPlan.mockResolvedValueOnce({ plan_id: 'plan-123' });
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    render(_jsx(BrandContext.Provider, { value: { businessInfo: {}, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: { campaignInfo: campaignInfo, setCampaignInfo: vi.fn() }, children: _jsx(CampaignSetupCompleteDialog, { setCurrentStep: vi.fn(), open: true }) }) }));
                    // Wait for initial fetch
                    return [4 /*yield*/, waitFor(function () {
                            expect(global.fetch).toHaveBeenCalled();
                        })];
                case 1:
                    // Wait for initial fetch
                    _a.sent();
                    return [4 /*yield*/, waitFor(function () {
                            expect(plannerApi.createPlan).toHaveBeenCalled();
                        })];
                case 2:
                    _a.sent();
                    planCall = plannerApi.createPlan.mock.calls[0];
                    // Should have empty array for target_audience
                    expect(planCall[1].target_audience).toEqual([]);
                    // When no purpose is provided, it defaults to 'brand_awareness'
                    expect(planCall[1].campaign_type).toBe('brand_awareness');
                    return [2 /*return*/];
            }
        });
    }); });
    it.skip('should use plan_id from response when triggering content generation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var campaignInfo, contentGenCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    campaignInfo = { name: 'Test Campaign' };
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    policyApi.createPolicy.mockResolvedValueOnce({
                        id: 'policy-456',
                    });
                    plannerApi.createPlan.mockResolvedValueOnce({
                        plan_id: 'plan-789', // This should be used, not 'id'
                    });
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    render(_jsx(BrandContext.Provider, { value: { businessInfo: {}, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: { campaignInfo: campaignInfo, setCampaignInfo: vi.fn() }, children: _jsx(CampaignSetupCompleteDialog, { setCurrentStep: vi.fn(), open: true }) }) }));
                    // Wait for initial fetch
                    return [4 /*yield*/, waitFor(function () {
                            expect(global.fetch).toHaveBeenCalled();
                        })];
                case 1:
                    // Wait for initial fetch
                    _a.sent();
                    return [4 /*yield*/, waitFor(function () {
                            // Check that content generation was triggered (2 fetch calls total)
                            expect(global.fetch.mock.calls.length).toBeGreaterThanOrEqual(2);
                        })];
                case 2:
                    _a.sent();
                    contentGenCall = global.fetch.mock.calls.find(function (call) {
                        return call[0].includes('/contentgen/generate');
                    });
                    expect(contentGenCall).toBeDefined();
                    // The test should check that plan-789 is used (from plannerApi mock)
                    expect(contentGenCall[0]).toContain('plan_id=plan-789');
                    // The test should check that policy-456 is used (from policyApi mock)
                    expect(contentGenCall[0]).toContain('policy_id=policy-456');
                    expect(contentGenCall[0]).toContain('use_scene_mix=true');
                    return [2 /*return*/];
            }
        });
    }); });
    it.skip('should fall back to legacy generation when Scene Mix fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var campaignInfo, legacyCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    campaignInfo = { name: 'Test Campaign' };
                    // Initial campaign creation succeeds
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    // Policy creation fails
                    policyApi.createPolicy.mockRejectedValueOnce(new Error('Policy creation failed'));
                    // Legacy generation succeeds
                    global.fetch.mockResolvedValueOnce({
                        ok: true,
                        json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ success: true })];
                        }); }); },
                    });
                    render(_jsx(BrandContext.Provider, { value: { businessInfo: {}, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: { campaignInfo: campaignInfo, setCampaignInfo: vi.fn() }, children: _jsx(CampaignSetupCompleteDialog, { setCurrentStep: vi.fn(), open: true }) }) }));
                    // Wait for initial fetch
                    return [4 /*yield*/, waitFor(function () {
                            expect(global.fetch).toHaveBeenCalled();
                        })];
                case 1:
                    // Wait for initial fetch
                    _a.sent();
                    return [4 /*yield*/, waitFor(function () {
                            // Should have at least 2 fetch calls (campaign creation + legacy generation)
                            expect(global.fetch.mock.calls.length).toBeGreaterThanOrEqual(2);
                        })];
                case 2:
                    _a.sent();
                    legacyCall = global.fetch.mock.calls.find(function (call) { return call[0].includes('/contentgen/generate') && !call[0].includes('use_scene_mix'); });
                    expect(legacyCall).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=CampaignSetupCompleteDialog.test.js.map