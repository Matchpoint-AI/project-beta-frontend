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
import { getServiceURL } from '../helpers/getServiceURL';
var CONTENT_GEN_URL = getServiceURL('content-gen');
// Caption Generator API endpoints
export var captionApi = {
  // Generate new captions for content
  generateCaptions: function (contentId, data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var requestBody, response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            requestBody = {
              content_id: contentId,
              image_description: data.image_description,
              scene_type: data.scene_type,
              brand_voice: data.brand_voice,
              target_audience: data.target_audience,
              campaign_goals: data.campaign_goals || [],
              // Convert hashtags array to hashtag_preferences dict
              hashtag_preferences: data.hashtags
                ? {
                    suggested: data.hashtags,
                    count: Math.min(data.hashtags.length, 30),
                  }
                : undefined,
              // Convert max_length to caption_length
              caption_length:
                data.max_length && data.max_length > 1500
                  ? 'long'
                  : data.max_length && data.max_length < 500
                    ? 'short'
                    : 'medium',
              include_call_to_action: data.include_cta !== undefined ? data.include_cta : true,
              product_features: data.product_features || [],
              // Map tone to custom_instructions if needed
              custom_instructions: data.tone ? 'Use a '.concat(data.tone, ' tone.') : undefined,
            };
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/content/').concat(contentId, '/captions'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(token),
                },
                body: JSON.stringify(requestBody),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Caption generation failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Regenerate a specific caption
  regenerateCaption: function (contentId, captionId, data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var requestBody, response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            requestBody = {
              content_id: contentId,
              caption_id: captionId,
              feedback:
                data.custom_instruction ||
                (data.style === 'shorter'
                  ? 'Make it shorter'
                  : data.style === 'longer'
                    ? 'Make it longer'
                    : data.style === 'different'
                      ? 'Make it different'
                      : 'Generate a similar caption'),
              preserve_elements: data.preserve_hashtags ? ['hashtags'] : [],
            };
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(CONTENT_GEN_URL, '/api/v1/content/')
                  .concat(contentId, '/captions/')
                  .concat(captionId, '/regenerate'),
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token),
                  },
                  body: JSON.stringify(requestBody),
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Caption regeneration failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Get all captions for content
  getCaptions: function (contentId, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/content/').concat(contentId, '/captions'), {
                headers: {
                  Authorization: 'Bearer '.concat(token),
                },
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to fetch captions: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Delete a caption
  deleteCaption: function (contentId, captionId, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(CONTENT_GEN_URL, '/api/v1/content/')
                  .concat(contentId, '/captions/')
                  .concat(captionId),
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: 'Bearer '.concat(token),
                  },
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to delete caption: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Validate caption
  validateCaption: function (data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/captions/validate'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(token),
                },
                body: JSON.stringify(_data),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Caption validation failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
};
// Scene Mix Policy API endpoints
export var policyApi = {
  // Create a new policy
  createPolicy: function (campaignId, data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response, errorText;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(
                ''.concat(CONTENT_GEN_URL, '/api/v1/campaigns/').concat(campaignId, '/policy'),
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token),
                  },
                  body: JSON.stringify(_data),
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!!response.ok) return [3 /*break*/, 3];
            return [4 /*yield*/, response.text()];
          case 2:
            errorText = _a.sent();
            throw new Error(
              'Policy creation failed: '.concat(response.statusText, ' - ').concat(errorText)
            );
          case 3:
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Get policy for a campaign
  getPolicy: function (campaignId, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(
                ''.concat(CONTENT_GEN_URL, '/api/v1/campaigns/').concat(campaignId, '/policy'),
                {
                  headers: {
                    Authorization: 'Bearer '.concat(token),
                  },
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to fetch policy: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Update policy
  updatePolicy: function (campaignId, policyId, data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(CONTENT_GEN_URL, '/api/v1/campaigns/')
                  .concat(campaignId, '/policy/')
                  .concat(policyId),
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '.concat(token),
                  },
                  body: JSON.stringify(data),
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Policy update failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
};
// Scene Mix Planner API endpoints
export var plannerApi = {
  // Create a content plan
  createPlan: function (campaignId, data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/campaigns/').concat(campaignId, '/plan'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(token),
                },
                body: JSON.stringify(_data),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Plan creation failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Get content plan
  getPlan: function (campaignId, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/campaigns/').concat(campaignId, '/plan'), {
                headers: {
                  Authorization: 'Bearer '.concat(token),
                },
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to fetch plan: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Get all plans for user
  getUserPlans: function (token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/plans'), {
                headers: {
                  Authorization: 'Bearer '.concat(token),
                },
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to fetch user plans: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
};
// Image Generation API endpoints
export var imageApi = {
  // Generate image with Flux/FAL
  generateImage: function (data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/images/generate'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(token),
                },
                body: JSON.stringify(_data),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Image generation failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Generate images in batch
  generateBatch: function (requests, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/images/batch'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(token),
                },
                body: JSON.stringify({ requests: requests }),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Batch generation failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Remix existing image
  remixImage: function (imageId, data, token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/images/remix/').concat(imageId), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(token),
                },
                body: JSON.stringify(_data),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Image remix failed: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
  // Get available models
  getModels: function (token) {
    return __awaiter(void 0, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              fetch(''.concat(CONTENT_GEN_URL, '/api/v1/images/models'), {
                headers: {
                  Authorization: 'Bearer '.concat(token),
                },
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('Failed to fetch models: '.concat(response.statusText));
            }
            return [2 /*return*/, response.json()];
        }
      });
    });
  },
};
//# sourceMappingURL=contentGenerationApi.js.map
