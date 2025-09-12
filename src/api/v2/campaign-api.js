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
/**
 * Campaign API V2 Service
 *
 * Implements campaign-related operations using protobuf messages.
 * All payloads are constructed using protobuf.js as per requirements.
 */
import { ProtoService } from './proto-service';
/**
 * Campaign status enum matching proto definition
 */
export var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["CAMPAIGN_STATUS_UNSPECIFIED"] = "CAMPAIGN_STATUS_UNSPECIFIED";
    CampaignStatus["CAMPAIGN_STATUS_DRAFT"] = "CAMPAIGN_STATUS_DRAFT";
    CampaignStatus["CAMPAIGN_STATUS_READY"] = "CAMPAIGN_STATUS_READY";
    CampaignStatus["CAMPAIGN_STATUS_ACTIVE"] = "CAMPAIGN_STATUS_ACTIVE";
    CampaignStatus["CAMPAIGN_STATUS_PAUSED"] = "CAMPAIGN_STATUS_PAUSED";
    CampaignStatus["CAMPAIGN_STATUS_COMPLETED"] = "CAMPAIGN_STATUS_COMPLETED";
    CampaignStatus["CAMPAIGN_STATUS_ARCHIVED"] = "CAMPAIGN_STATUS_ARCHIVED";
})(CampaignStatus || (CampaignStatus = {}));
/**
 * Generation status enum
 */
export var GenerationStatus;
(function (GenerationStatus) {
    GenerationStatus["GENERATION_STATUS_UNSPECIFIED"] = "GENERATION_STATUS_UNSPECIFIED";
    GenerationStatus["GENERATION_STATUS_ACCEPTED"] = "GENERATION_STATUS_ACCEPTED";
    GenerationStatus["GENERATION_STATUS_PROCESSING"] = "GENERATION_STATUS_PROCESSING";
    GenerationStatus["GENERATION_STATUS_COMPLETED"] = "GENERATION_STATUS_COMPLETED";
    GenerationStatus["GENERATION_STATUS_FAILED"] = "GENERATION_STATUS_FAILED";
})(GenerationStatus || (GenerationStatus = {}));
/**
 * Campaign API V2 Service
 */
var CampaignApiV2 = /** @class */ (function (_super) {
    __extends(CampaignApiV2, _super);
    function CampaignApiV2() {
        return _super.call(this, {
            serviceName: 'Campaign V2 API',
            baseUrl: '/api/v2',
        }) || this;
    }
    /**
     * Get campaign details
     */
    CampaignApiV2.prototype.getCampaign = function (campaignId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = {
                    campaign_id: campaignId,
                };
                return [2 /*return*/, this.post("/campaigns/".concat(campaignId), request, { package: 'protos', message: 'GetCampaignRequest' }, { package: 'protos', message: 'GetCampaignResponse' }, { token: token })];
            });
        });
    };
    /**
     * Create a new campaign
     */
    CampaignApiV2.prototype.createCampaign = function (data, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.post('/campaigns', data, { package: 'protos', message: 'Campaign' }, { package: 'protos', message: 'Campaign' }, { token: token })];
            });
        });
    };
    /**
     * Update campaign details
     */
    CampaignApiV2.prototype.updateCampaign = function (campaignId, data, token) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = __assign({ campaign_id: campaignId }, data);
                return [2 /*return*/, this.put("/campaigns/".concat(campaignId), request, { package: 'protos', message: 'Campaign' }, { package: 'protos', message: 'Campaign' }, { token: token })];
            });
        });
    };
    /**
     * Generate content for a campaign
     */
    CampaignApiV2.prototype.generateContent = function (campaignId, options, token) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = __assign({ campaign_id: campaignId }, options);
                return [2 /*return*/, this.post("/campaigns/".concat(campaignId, "/content"), request, { package: 'protos', message: 'GenerationRequest' }, { package: 'protos', message: 'GenerationRequest' }, { token: token })];
            });
        });
    };
    /**
     * Get generated content for a campaign
     */
    CampaignApiV2.prototype.getCampaignContent = function (campaignId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = {
                    campaign_id: campaignId,
                };
                return [2 /*return*/, this.post("/campaigns/".concat(campaignId, "/content"), request, { package: 'protos', message: 'GetCampaignContentRequest' }, { package: 'protos', message: 'GetCampaignContentResponse' }, { token: token })];
            });
        });
    };
    /**
     * Approve a campaign
     */
    CampaignApiV2.prototype.approveCampaign = function (campaignId, approvalNotes, token) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = {
                    campaign_id: campaignId,
                    approval_notes: approvalNotes,
                };
                return [2 /*return*/, this.post("/campaigns/".concat(campaignId, "/approve"), request, { package: 'protos', message: 'Campaign' }, { package: 'protos', message: 'Campaign' }, { token: token })];
            });
        });
    };
    /**
     * Delete a campaign
     */
    CampaignApiV2.prototype.deleteCampaign = function (campaignId, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.delete("/campaigns/".concat(campaignId), { package: 'protos', message: 'Empty' }, { token: token })];
            });
        });
    };
    /**
     * Get all campaigns for the user
     */
    CampaignApiV2.prototype.getUserCampaigns = function (token, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParams, endpoint;
            return __generator(this, function (_a) {
                queryParams = new URLSearchParams();
                if (filters) {
                    if (filters.status)
                        queryParams.append('status', filters.status);
                    if (filters.brand_id)
                        queryParams.append('brand_id', filters.brand_id);
                    if (filters.limit)
                        queryParams.append('limit', filters.limit.toString());
                    if (filters.offset)
                        queryParams.append('offset', filters.offset.toString());
                }
                endpoint = "/campaigns".concat(queryParams.toString() ? "?".concat(queryParams.toString()) : '');
                return [2 /*return*/, this.get(endpoint, { package: 'protos', message: 'Campaign' }, { token: token })];
            });
        });
    };
    /**
     * Get campaign generation status
     */
    CampaignApiV2.prototype.getGenerationStatus = function (campaignId, requestId, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get("/campaigns/".concat(campaignId, "/generation/").concat(requestId, "/status"), { package: 'protos', message: 'GenerationRequest' }, { token: token })];
            });
        });
    };
    /**
     * Cancel content generation
     */
    CampaignApiV2.prototype.cancelGeneration = function (campaignId, requestId, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeProtoRequest('POST', "/campaigns/".concat(campaignId, "/generation/").concat(requestId, "/cancel"), null, null, { package: 'protos', message: 'Empty' }, { token: token })];
            });
        });
    };
    /**
     * Export campaign content
     */
    CampaignApiV2.prototype.exportCampaign = function (campaignId, format, token) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/campaigns/").concat(campaignId, "/export?format=").concat(format), {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Export failed: ".concat(response.statusText));
                        }
                        return [2 /*return*/, response.blob()];
                }
            });
        });
    };
    return CampaignApiV2;
}(ProtoService));
export { CampaignApiV2 };
// Export singleton instance
export var campaignApiV2 = new CampaignApiV2();
//# sourceMappingURL=campaign-api.js.map