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
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captionApi, plannerApi, policyApi } from './contentGenerationApi';
// Mock getServiceURL
vi.mock('../helpers/getServiceURL', function () { return ({
    getServiceURL: function () { return 'https://mock-service.com'; },
}); });
describe('contentGenerationApi', function () {
    var mockFetch = vi.fn();
    beforeEach(function () {
        vi.clearAllMocks();
        global.fetch = mockFetch;
        mockFetch.mockClear();
    });
    describe('captionApi', function () {
        describe('generateCaptions', function () {
            it('should include content_id in request body', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResponse = {
                                success: true,
                                captions: [{ text: 'Test caption', score: 0.9 }],
                            };
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, mockResponse];
                                }); }); },
                            });
                            return [4 /*yield*/, captionApi.generateCaptions('content-123', {
                                    image_description: 'A beautiful product shot',
                                    scene_type: 'product',
                                    brand_voice: 'Professional',
                                    target_audience: 'Young professionals',
                                }, 'test-token')];
                        case 1:
                            _a.sent();
                            expect(mockFetch).toHaveBeenCalledWith('https://mock-service.com/api/v1/content/content-123/captions', expect.objectContaining({
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer test-token',
                                },
                                body: expect.stringContaining('"content_id":"content-123"'),
                            }));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should transform hashtags to hashtag_preferences', function () { return __awaiter(void 0, void 0, void 0, function () {
                var callArgs, body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            return [4 /*yield*/, captionApi.generateCaptions('content-123', {
                                    image_description: 'Test',
                                    scene_type: 'lifestyle',
                                    hashtags: ['#brand', '#product', '#lifestyle'],
                                }, 'test-token')];
                        case 1:
                            _a.sent();
                            callArgs = mockFetch.mock.calls[0];
                            body = JSON.parse(callArgs[1].body);
                            expect(body.hashtag_preferences).toEqual({
                                suggested: ['#brand', '#product', '#lifestyle'],
                                count: 3,
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should convert max_length to caption_length', function () { return __awaiter(void 0, void 0, void 0, function () {
                var body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            // Test long caption
                            return [4 /*yield*/, captionApi.generateCaptions('content-123', {
                                    image_description: 'Test',
                                    scene_type: 'product',
                                    max_length: 2000,
                                }, 'test-token')];
                        case 1:
                            // Test long caption
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.caption_length).toBe('long');
                            mockFetch.mockClear();
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            // Test short caption
                            return [4 /*yield*/, captionApi.generateCaptions('content-123', {
                                    image_description: 'Test',
                                    scene_type: 'product',
                                    max_length: 300,
                                }, 'test-token')];
                        case 2:
                            // Test short caption
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.caption_length).toBe('short');
                            mockFetch.mockClear();
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            // Test medium caption
                            return [4 /*yield*/, captionApi.generateCaptions('content-123', {
                                    image_description: 'Test',
                                    scene_type: 'product',
                                    max_length: 800,
                                }, 'test-token')];
                        case 3:
                            // Test medium caption
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.caption_length).toBe('medium');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should map include_cta to include_call_to_action', function () { return __awaiter(void 0, void 0, void 0, function () {
                var body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            return [4 /*yield*/, captionApi.generateCaptions('content-123', {
                                    image_description: 'Test',
                                    scene_type: 'product',
                                    include_cta: false,
                                }, 'test-token')];
                        case 1:
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.include_call_to_action).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should convert tone to custom_instructions', function () { return __awaiter(void 0, void 0, void 0, function () {
                var body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            return [4 /*yield*/, captionApi.generateCaptions('content-123', {
                                    image_description: 'Test',
                                    scene_type: 'product',
                                    tone: 'playful',
                                }, 'test-token')];
                        case 1:
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.custom_instructions).toBe('Use a playful tone.');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should handle API errors', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: false,
                                statusText: 'Unprocessable Entity',
                            });
                            return [4 /*yield*/, expect(captionApi.generateCaptions('content-123', {
                                    image_description: 'Test',
                                    scene_type: 'product',
                                }, 'test-token')).rejects.toThrow('Caption generation failed: Unprocessable Entity')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('regenerateCaption', function () {
            it('should include content_id and caption_id in request body', function () { return __awaiter(void 0, void 0, void 0, function () {
                var body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            return [4 /*yield*/, captionApi.regenerateCaption('content-123', 'caption-456', {
                                    style: 'different',
                                    preserve_hashtags: true,
                                }, 'test-token')];
                        case 1:
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.content_id).toBe('content-123');
                            expect(body.caption_id).toBe('caption-456');
                            expect(body.feedback).toBe('Make it different');
                            expect(body.preserve_elements).toEqual(['hashtags']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should convert style to feedback message', function () { return __awaiter(void 0, void 0, void 0, function () {
                var styleMappings, _i, styleMappings_1, _a, style, expectedFeedback, body;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            styleMappings = [
                                { style: 'shorter', expectedFeedback: 'Make it shorter' },
                                { style: 'longer', expectedFeedback: 'Make it longer' },
                                { style: 'different', expectedFeedback: 'Make it different' },
                                { style: 'similar', expectedFeedback: 'Generate a similar caption' },
                            ];
                            _i = 0, styleMappings_1 = styleMappings;
                            _b.label = 1;
                        case 1:
                            if (!(_i < styleMappings_1.length)) return [3 /*break*/, 4];
                            _a = styleMappings_1[_i], style = _a.style, expectedFeedback = _a.expectedFeedback;
                            mockFetch.mockClear();
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            return [4 /*yield*/, captionApi.regenerateCaption('content-123', 'caption-456', { style: style }, 'test-token')];
                        case 2:
                            _b.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.feedback).toBe(expectedFeedback);
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            it('should use custom_instruction as feedback when provided', function () { return __awaiter(void 0, void 0, void 0, function () {
                var body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ success: true })];
                                }); }); },
                            });
                            return [4 /*yield*/, captionApi.regenerateCaption('content-123', 'caption-456', {
                                    custom_instruction: 'Make it more engaging with emojis',
                                }, 'test-token')];
                        case 1:
                            _a.sent();
                            body = JSON.parse(mockFetch.mock.calls[0][1].body);
                            expect(body.feedback).toBe('Make it more engaging with emojis');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('plannerApi', function () {
        describe('createPlan', function () {
            it('should send correct request with all required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResponse, campaignId, planData, token, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResponse = {
                                plan_id: 'test-plan-id',
                                campaign_id: 'test-campaign',
                                campaign_name: 'Test Campaign',
                                status: 'draft',
                                created_at: '2025-01-23T00:00:00Z',
                                updated_at: '2025-01-23T00:00:00Z',
                                duration_weeks: 2,
                                total_content_slots: 6,
                                content_schedule: [],
                                metrics: {
                                    estimated_reach: 6000,
                                    estimated_engagement_rate: 0.68,
                                    content_diversity_score: 0.85,
                                    brand_alignment_score: 0.92,
                                },
                                optimization_score: 0.87,
                            };
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, mockResponse];
                                }); }); },
                            });
                            campaignId = 'test-campaign';
                            planData = {
                                campaign_name: 'Test Campaign',
                                campaign_type: 'brand_awareness',
                                duration_weeks: 2,
                                target_audience: ['millennials', 'gen-z'],
                                content_types: ['post', 'story', 'reel'],
                                weekly_post_count: 3,
                                themes: ['brand_awareness', 'product_showcase'],
                                brand_values: ['innovation', 'quality'],
                            };
                            token = 'test-token';
                            return [4 /*yield*/, plannerApi.createPlan(campaignId, planData, token)];
                        case 1:
                            result = _a.sent();
                            // Verify fetch was called with correct parameters
                            expect(mockFetch).toHaveBeenCalledWith('https://mock-service.com/api/v1/campaigns/test-campaign/plan', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer test-token',
                                },
                                body: JSON.stringify(planData),
                            });
                            expect(result).toEqual(mockResponse);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should handle only required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResponse, planData, fetchCall, body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResponse = { plan_id: 'test-plan-id' };
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, mockResponse];
                                }); }); },
                            });
                            planData = {
                                campaign_name: 'Minimal Campaign',
                                campaign_type: 'product_launch',
                                duration_weeks: 1,
                                target_audience: ['general'],
                            };
                            return [4 /*yield*/, plannerApi.createPlan('campaign-id', planData, 'token')];
                        case 1:
                            _a.sent();
                            fetchCall = mockFetch.mock.calls[0];
                            body = JSON.parse(fetchCall[1].body);
                            // Verify required fields are present
                            expect(body.campaign_name).toBe('Minimal Campaign');
                            expect(body.campaign_type).toBe('product_launch');
                            expect(body.duration_weeks).toBe(1);
                            expect(body.target_audience).toEqual(['general']);
                            // Optional fields should be undefined (not sent)
                            expect(body.content_types).toBeUndefined();
                            expect(body.weekly_post_count).toBeUndefined();
                            expect(body.themes).toBeUndefined();
                            expect(body.brand_values).toBeUndefined();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should handle all campaign types', function () { return __awaiter(void 0, void 0, void 0, function () {
                var campaignTypes, _i, campaignTypes_1, campaignType, lastCall, body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            campaignTypes = [
                                'product_launch',
                                'brand_awareness',
                                'seasonal',
                                'engagement',
                            ];
                            _i = 0, campaignTypes_1 = campaignTypes;
                            _a.label = 1;
                        case 1:
                            if (!(_i < campaignTypes_1.length)) return [3 /*break*/, 4];
                            campaignType = campaignTypes_1[_i];
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ plan_id: 'test' })];
                                }); }); },
                            });
                            return [4 /*yield*/, plannerApi.createPlan('campaign-id', {
                                    campaign_name: 'Test',
                                    campaign_type: campaignType,
                                    duration_weeks: 1,
                                    target_audience: ['test'],
                                }, 'token')];
                        case 2:
                            _a.sent();
                            lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
                            body = JSON.parse(lastCall[1].body);
                            expect(body.campaign_type).toBe(campaignType);
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            it('should throw error when API returns non-ok response', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: false,
                                statusText: 'Unprocessable Entity',
                            });
                            return [4 /*yield*/, expect(plannerApi.createPlan('campaign-id', {
                                    campaign_name: 'Test',
                                    campaign_type: 'brand_awareness',
                                    duration_weeks: 1,
                                    target_audience: ['test'],
                                }, 'token')).rejects.toThrow('Plan creation failed: Unprocessable Entity')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should include optional fields when provided', function () { return __awaiter(void 0, void 0, void 0, function () {
                var planData, fetchCall, body;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ plan_id: 'test' })];
                                }); }); },
                            });
                            planData = {
                                campaign_name: 'Full Campaign',
                                campaign_type: 'engagement',
                                duration_weeks: 4,
                                target_audience: ['young adults', 'professionals'],
                                content_types: ['post', 'story', 'reel', 'carousel'],
                                weekly_post_count: 7,
                                themes: ['community', 'user_stories', 'behind_the_scenes'],
                                brand_values: ['authenticity', 'community', 'sustainability'],
                            };
                            return [4 /*yield*/, plannerApi.createPlan('campaign-id', planData, 'token')];
                        case 1:
                            _a.sent();
                            fetchCall = mockFetch.mock.calls[0];
                            body = JSON.parse(fetchCall[1].body);
                            expect(body).toEqual(planData);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getPlan', function () {
            it('should fetch plan with correct endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockPlan, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockPlan = { plan_id: 'test-plan', status: 'active' };
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, mockPlan];
                                }); }); },
                            });
                            return [4 /*yield*/, plannerApi.getPlan('campaign-id', 'token')];
                        case 1:
                            result = _a.sent();
                            expect(mockFetch).toHaveBeenCalledWith('https://mock-service.com/api/v1/campaigns/campaign-id/plan', {
                                headers: {
                                    Authorization: 'Bearer token',
                                },
                            });
                            expect(result).toEqual(mockPlan);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getUserPlans', function () {
            it('should fetch user plans with correct endpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockPlans, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockPlans = [{ plan_id: 'plan1' }, { plan_id: 'plan2' }];
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, mockPlans];
                                }); }); },
                            });
                            return [4 /*yield*/, plannerApi.getUserPlans('token')];
                        case 1:
                            result = _a.sent();
                            expect(mockFetch).toHaveBeenCalledWith('https://mock-service.com/api/v1/plans', {
                                headers: {
                                    Authorization: 'Bearer token',
                                },
                            });
                            expect(result).toEqual(mockPlans);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('policyApi', function () {
        describe('createPolicy', function () {
            it('should maintain existing policy structure', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockPolicy, policyData, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockPolicy = { id: 'policy-id', scenes: [] };
                            mockFetch.mockResolvedValueOnce({
                                ok: true,
                                json: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, mockPolicy];
                                }); }); },
                            });
                            policyData = {
                                campaign_id: 'campaign-id',
                                intent: 'awareness',
                                industry: 'saas',
                                brand_tier: 'standard',
                                target_audience: { demographics: ['young adults'] },
                                brand_personality: ['innovative', 'friendly'],
                                product_features: ['cloud-based', 'scalable'],
                            };
                            return [4 /*yield*/, policyApi.createPolicy('campaign-id', policyData, 'token')];
                        case 1:
                            result = _a.sent();
                            expect(mockFetch).toHaveBeenCalledWith('https://mock-service.com/api/v1/campaigns/campaign-id/policy', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer token',
                                },
                                body: JSON.stringify(policyData),
                            });
                            expect(result).toEqual(mockPolicy);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=contentGenerationApi.test.js.map