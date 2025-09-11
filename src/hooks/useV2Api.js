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
/**
 * React Hook for V2 API Integration
 *
 * Provides a clean interface for components to interact with
 * the V2 API while handling loading states and errors.
 */
import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeV2Api, campaignApiV2, brandApiV2 } from '../api/v2';
/**
 * Hook for V2 API usage
 */
export function useV2Api() {
  var _this = this;
  var _a = useState({
      isInitialized: false,
      isLoading: true,
      error: null,
    }),
    state = _a[0],
    setState = _a[1];
  // Initialize V2 API on mount
  useEffect(function () {
    var init = function () {
      return __awaiter(_this, void 0, void 0, function () {
        var _error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              setState(function (prev) {
                return __assign(__assign({}, prev), { isLoading: true });
              });
              return [4 /*yield*/, initializeV2Api()];
            case 1:
              _a.sent();
              // Update API version state
              setState(function (prev) {
                return __assign(__assign({}, prev), { isInitialized: true, isLoading: false });
              });
              return [3 /*break*/, 3];
            case 2:
              _error_1 = _a.sent();
              setState(function (prev) {
                return __assign(__assign({}, prev), {
                  isInitialized: false,
                  isLoading: false,
                  error: _error_1,
                });
              });
              return [3 /*break*/, 3];
            case 3:
              return [2 /*return*/];
          }
        });
      });
    };
    init();
  }, []);
  // Get current user token
  var getToken = useCallback(function () {
    return __awaiter(_this, void 0, void 0, function () {
      var auth, user;
      return __generator(this, function (_a) {
        auth = getAuth();
        user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
        return [2 /*return*/, user.getIdToken()];
      });
    });
  }, []);
  // Campaign operations
  var campaign = {
    /**
     * Get campaign details
     */
    get: useCallback(
      function (campaignId) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, campaignApiV2.getCampaign(campaignId, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Create a new campaign
     */
    create: useCallback(
      function (data) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, campaignApiV2.createCampaign(data, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Update campaign
     */
    update: useCallback(
      function (campaignId, data) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, campaignApiV2.updateCampaign(campaignId, data, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Delete campaign
     */
    delete: useCallback(
      function (campaignId) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, campaignApiV2.deleteCampaign(campaignId, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Generate content for campaign
     */
    generateContent: useCallback(
      function (campaignId, options) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [
                  2 /*return*/,
                  campaignApiV2.generateContent(campaignId, options || {}, token),
                ];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Get campaign content
     */
    getContent: useCallback(
      function (campaignId) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, campaignApiV2.getCampaignContent(campaignId, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * List campaigns
     */
    list: useCallback(
      function (filters) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, campaignApiV2.getUserCampaigns(token, filters)];
            }
          });
        });
      },
      [getToken]
    ),
  };
  // Brand operations
  var brand = {
    /**
     * Create brand
     */
    create: useCallback(
      function (data) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, brandApiV2.createBrand(data, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Get brand details
     */
    get: useCallback(
      function (brandId) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, brandApiV2.getBrand(brandId, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Update brand
     */
    update: useCallback(
      function (brandId, data) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, brandApiV2.updateBrand(brandId, data, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Delete brand
     */
    delete: useCallback(
      function (brandId) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, brandApiV2.deleteBrand(brandId, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * List brands
     */
    list: useCallback(
      function (filters) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, brandApiV2.getUserBrands(token, filters)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Crawl website
     */
    crawlWebsite: useCallback(
      function (data) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, brandApiV2.crawlWebsite(data, token)];
            }
          });
        });
      },
      [getToken]
    ),
    /**
     * Get brand knowledge
     */
    getKnowledge: useCallback(
      function (brandId) {
        return __awaiter(_this, void 0, void 0, function () {
          var token;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, getToken()];
              case 1:
                token = _a.sent();
                return [2 /*return*/, brandApiV2.getBrandKnowledge(brandId, token)];
            }
          });
        });
      },
      [getToken]
    ),
  };
  return __assign(__assign({}, state), { campaign: campaign, brand: brand, getToken: getToken });
}
/**
 * Example usage in a React component:
 *
 * ```tsx
 * function CampaignList() {
 *   const v2Api = useV2Api();
 *   const [campaigns, setCampaigns] = useState([]);
 *   const [loading, setLoading] = useState(false);
 *
 *   useEffect(() => {
 *     const loadCampaigns = async () => {
 *       if (!v2Api.isInitialized) return;
 *
 *       setLoading(true);
 *       try {
 *         const result = await v2Api.campaign.list();
 *         setCampaigns(result.campaigns);
 *       } catch (_error) {
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadCampaigns();
 *   }, [v2Api.isInitialized]);
 *
 *   return (
 *     <div>
 *       <p>Using V2 API with Protobuf</p>
 *       {loading ? (
 *         <p>Loading campaigns...</p>
 *       ) : (
 *         <ul>
 *           {campaigns.map(campaign => (
 *             <li key={campaign.id}>{campaign.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
//# sourceMappingURL=useV2Api.js.map
