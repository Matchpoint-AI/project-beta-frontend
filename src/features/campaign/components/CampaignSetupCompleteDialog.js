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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import Dialog from '@mui/material/Dialog';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { BrandContext } from '../../brand/context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import handleNavigate from '../../../helpers/handleNavigate';
import posthog from '../../../helpers/posthog';
import { plannerApi, policyApi } from '../../../api/contentGenerationApi';
var CampaignSetupCompleteDialog = function (_a) {
  var setCurrentStep = _a.setCurrentStep,
    open = _a.open;
  var _b = useContext(CampaignContext),
    campaignInfo = _b.campaignInfo,
    setCampaignInfo = _b.setCampaignInfo;
  var businessInfo = useContext(BrandContext).businessInfo;
  var profile = useAuth().profile;
  var _c = useState(null),
    error = _c[0],
    setError = _c[1];
  // const [progress, setProgress] = useState(0);
  // Endpoint URL
  var endpointUrl = getServiceURL('data');
  var navigate = useNavigate();
  var updateStatus = function (startDate) {
    if (!startDate) {
      // If no start date provided, default to Inactive
      return 'Inactive';
    }
    var _a = startDate.split('/').map(Number),
      month = _a[0],
      day = _a[1],
      year = _a[2];
    var inputDate = new Date(year, month - 1, day); // JavaScript Date months are 0-based
    // Get the current date
    var currentDate = new Date();
    var status = inputDate >= currentDate ? 'Inactive' : 'Active';
    return status;
  };
  useEffect(function () {
    var campaignId;
    var apiEndpoint = '/api/v1/data';
    if (
      (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.campaign_id) !==
      undefined
    ) {
      campaignId =
        campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.campaign_id;
      apiEndpoint = '/api/v1/update';
    } else campaignId = crypto.randomUUID();
    var payload = {
      brand_variables: {
        TOV: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.toneAndVoice,
        values: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.values,
        Persona: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.persona,
        Colors:
          businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandColors,
        mission: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission,
        brand_visual_style:
          businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.style,
        scenes: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.scenes,
        themes: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.themes,
      },
      campaign_variables: {
        id: campaignId,
        name:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.name) ||
          'Untitled Campaign',
        product_service:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.product) || '',
        audience_ethnicity:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.audienceRace) ||
          [],
        audience_interests:
          (campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.audienceInterests) || [],
        product_service_description:
          (campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.productDescription) || '',
        purpose_topic:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purpose) ||
          'Make customers aware/excited',
        emotion:
          (campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.audienceEmotion) || [],
        scene:
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.locations) ||
          [],
        lighting: 'bright',
        key_feature:
          (campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.product_features) || [],
        purpose:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.purposeAbout) ||
          '',
        camera_position: 'normal',
        audience_gender:
          (campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.audienceGender) || [],
        mood: ['electric', ' fun', ' chic'],
        audience_age:
          (campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.audienceAgeRange) || [],
        start_date:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.startDate) ||
          new Date().toLocaleDateString('en-US'),
        duration:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.duration) ||
          '2 weeks',
        postingFrequency:
          (campaignInfo === null || campaignInfo === void 0
            ? void 0
            : campaignInfo.postingFrequency) || 'Daily',
        deliveryDay:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.deliveryDay) ||
          'Monday',
        durationNum:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.durationNum) ||
          2,
        frequency:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.frequency) || 3,
        summary:
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.summary) || '',
      },
      biz_variables: {
        industry: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.industry,
        brand_name: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name,
        vertical: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.vertical,
      },
    };
    var date = new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');
    var formattedDateTime = ''
      .concat(month, '/')
      .concat(day, '/')
      .concat(year, ', ')
      .concat(hours, ':')
      .concat(minutes, ':')
      .concat(seconds);
    var status = updateStatus(campaignInfo.startDate);
    fetch(endpointUrl + apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '.concat(
          profile === null || profile === void 0 ? void 0 : profile.token
        ),
      },
      body: JSON.stringify({
        entity_name: 'campaign',
        entity_data: {
          campaign_id: campaignId,
          status: status,
          timestamp: formattedDateTime,
          user_id: profile === null || profile === void 0 ? void 0 : profile.id,
          campaign_data: payload,
        },
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (_err) {
            throw new Error(err.detail || 'Failed to create campaign');
          });
        }
        return response.json();
      })
      .then(function (_data) {
        if (posthog.__loaded) {
          posthog.capture('Campaign Created', {
            distinct_id: profile === null || profile === void 0 ? void 0 : profile.id,
            campaign_id: campaignId, // Replace with actual campaign ID
          });
        }
        startCampaignContentGeneration();
      })
      .catch(function (_error) {
        setError('Failed to create campaign. Please check your campaign details and try again.');
      });
    var startCampaignContentGeneration = function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var purposeToIntent,
          getIndustry,
          policyData,
          purposeToCampaignType,
          planData,
          baseParams,
          params,
          generateUrl,
          response,
          errorText,
          _responseData,
          _error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              // Wait for campaign to propagate (increased to prevent 404 errors)
              return [
                4 /*yield*/,
                new Promise(function (resolve) {
                  return setTimeout(resolve, 8000);
                }),
              ];
            case 1:
              // Wait for campaign to propagate (increased to prevent 404 errors)
              _a.sent();
              _a.label = 2;
            case 2:
              _a.trys.push([2, 9, , 10]);
              purposeToIntent = {
                'Make customers aware/excited': 'awareness',
                'Get customers to buy': 'conversion',
                'Build community': 'engagement',
                'Educate audience': 'education',
              };
              getIndustry = function (industry, vertical) {
                var mapping = {
                  food: 'food_beverage',
                  beverage: 'food_beverage',
                  food_beverage: 'food_beverage',
                  cosmetics: 'cosmetic',
                  cosmetic: 'cosmetic',
                  supplement: 'supplement',
                  supplements: 'supplement',
                  clothing: 'wearable',
                  apparel: 'wearable',
                  fashion: 'wearable',
                  technology: 'device',
                  electronics: 'device',
                  software: 'saas',
                  saas: 'saas',
                  service: 'service',
                  venue: 'venue',
                  restaurant: 'venue',
                  retail: 'venue',
                };
                var industryLower = (industry || '').toLowerCase();
                var verticalLower = (vertical || '').toLowerCase();
                return mapping[industryLower] || mapping[verticalLower] || 'service';
              };
              return [
                4 /*yield*/,
                policyApi.createPolicy(
                  campaignId,
                  {
                    campaign_id: campaignId,
                    intent:
                      purposeToIntent[
                        campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.purpose
                      ] || 'awareness',
                    industry: getIndustry(
                      businessInfo === null || businessInfo === void 0
                        ? void 0
                        : businessInfo.industry,
                      businessInfo === null || businessInfo === void 0
                        ? void 0
                        : businessInfo.vertical
                    ),
                    brand_tier: 'standard', // Default to standard, could be derived from business info
                    target_audience: {
                      age_range:
                        (campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.audienceAgeRange) || [],
                      gender:
                        (campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.audienceGender) || [],
                      interests:
                        (campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.audienceInterests) || [],
                      ethnicity:
                        (campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.audienceRace) || [],
                    },
                    brand_personality:
                      (campaignInfo === null || campaignInfo === void 0
                        ? void 0
                        : campaignInfo.audienceEmotion) || [],
                    product_features:
                      (campaignInfo === null || campaignInfo === void 0
                        ? void 0
                        : campaignInfo.product_features) || [],
                    seasonal_context:
                      campaignInfo === null || campaignInfo === void 0
                        ? void 0
                        : campaignInfo.startDate,
                    has_ingredients: false,
                    visual_restrictions: [],
                    force_regenerate: false,
                  },
                  (profile === null || profile === void 0 ? void 0 : profile.token) || ''
                ),
              ];
            case 3:
              policyData = _a.sent();
              purposeToCampaignType = {
                'Make customers aware/excited': 'brand_awareness',
                'Get customers to buy': 'product_launch',
                'Build community': 'engagement',
                'Educate audience': 'brand_awareness',
              };
              return [
                4 /*yield*/,
                plannerApi.createPlan(
                  campaignId,
                  {
                    campaign_name:
                      (campaignInfo === null || campaignInfo === void 0
                        ? void 0
                        : campaignInfo.name) || 'Untitled Campaign',
                    campaign_type:
                      purposeToCampaignType[
                        campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.purpose
                      ] || 'brand_awareness',
                    duration_weeks: campaignInfo.durationNum || 2,
                    target_audience: (function () {
                      var audience = __spreadArray(
                        __spreadArray(
                          __spreadArray(
                            [],
                            (campaignInfo === null || campaignInfo === void 0
                              ? void 0
                              : campaignInfo.audienceInterests) || [],
                            true
                          ),
                          (campaignInfo === null || campaignInfo === void 0
                            ? void 0
                            : campaignInfo.audienceGender) || [],
                          true
                        ),
                        (campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.audienceAgeRange) || [],
                        true
                      ).filter(Boolean);
                      // Ensure at least one target audience item (backend requires min_items=1)
                      return audience.length > 0 ? audience : ['general'];
                    })(),
                    content_types: ['post', 'story', 'reel'],
                    weekly_post_count: campaignInfo.frequency || 3,
                    themes: ['brand_awareness', 'product_showcase', 'user_stories', 'educational'],
                    brand_values:
                      (businessInfo === null || businessInfo === void 0
                        ? void 0
                        : businessInfo.values) || [],
                  },
                  (profile === null || profile === void 0 ? void 0 : profile.token) || ''
                ),
              ];
            case 4:
              planData = _a.sent();
              baseParams = {
                campaign_id: campaignId,
                use_scene_mix: 'true', // Flag to use new Scene Mix generation
                plan_id: planData.plan_id,
              };
              // Only add policy_id if it exists and is not undefined
              if (
                (policyData === null || policyData === void 0 ? void 0 : policyData.id) &&
                policyData.id !== 'undefined'
              ) {
                baseParams.policy_id = policyData.id;
              }
              params = new URLSearchParams(baseParams);
              generateUrl = ''
                .concat(getServiceURL('content-gen'), '/api/v1/contentgen/generate?')
                .concat(params.toString());
              return [
                4 /*yield*/,
                fetch(generateUrl, {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                    Authorization: 'Bearer '.concat(
                      profile === null || profile === void 0 ? void 0 : profile.token
                    ),
                    'Content-Type': 'application/json',
                  },
                }),
              ];
            case 5:
              response = _a.sent();
              if (!!response.ok) return [3 /*break*/, 7];
              return [4 /*yield*/, response.text()];
            case 6:
              errorText = _a.sent();
              throw new Error(
                'Failed to start content generation: '
                  .concat(response.status, ' - ')
                  .concat(errorText || response.statusText)
              );
            case 7:
              return [4 /*yield*/, response.json()];
            case 8:
              _responseData = _a.sent();
              return [2 /*return*/];
            case 9:
              _error_1 = _a.sent();
              // Don't fall back to legacy - we want Scene Mix to work properly
              // This ensures we fix Scene Mix issues rather than masking them
              setError(
                'Scene Mix generation failed: '.concat(
                  error.message || error,
                  '. Please try again or contact support.'
                )
              );
              throw new Error('Scene Mix generation failed: '.concat(error.message || error));
            case 10:
              return [2 /*return*/];
          }
        });
      });
    };
  }, []);
  var onStartNewCampaign = function () {
    setCurrentStep(1);
    setCampaignInfo({});
    handleNavigate(
      (profile === null || profile === void 0 ? void 0 : profile.id) || '',
      '/campaign',
      navigate
    );
  };
  return _jsx(Dialog, {
    open: open,
    slotProps: {
      backdrop: {
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    children: _jsxs('div', {
      className: ' bg-white p-8 rounded-lg text-center max-w-[608px] sm:w-auto w-[95%]',
      children: [
        _jsx('h2', {
          className:
            'bg-gradient-to-r bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-2xl font-semibold mb-4',
          children: 'Campaign Setup Complete!',
        }),
        error &&
          _jsx('div', {
            className:
              'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4',
            role: 'alert',
            children: _jsx('span', { className: 'block sm:inline', children: error }),
          }),
        _jsx('p', {
          className: 'mb-4 font-medium sm:text-2xl text-lg',
          children:
            "We're creating your content now and will email you when it's ready. And if you're ready for more campaigns, just hit the start button below",
        }),
        _jsx('div', {
          className: 'flex items-center justify-center my-10',
          children: _jsx('img', {
            src: '/campaignCompleted.png',
            className: 'max-w-[450px] h-auto w-full',
          }),
        }),
        _jsxs('div', {
          className: 'flex flex-col-reverse sm:flex-row justify-center gap-4',
          children: [
            _jsxs('button', {
              onClick: onStartNewCampaign,
              className:
                'bg-[#5145CD] text-white py-2 px-4 rounded flex items-center justify-center',
              children: [
                'Start a New Campaign',
                _jsx('div', { className: 'inline-block ml-2', children: _jsx(IoArrowForward, {}) }),
              ],
            }),
            _jsx('button', {
              onClick: function () {
                return handleNavigate(
                  (profile === null || profile === void 0 ? void 0 : profile.id) || '',
                  '/dashboard',
                  navigate
                );
              },
              className: 'border border-[#E5E7EB] text-black py-2 px-4 rounded font-medium',
              children: 'Go to my dashboard',
            }),
          ],
        }),
      ],
    }),
  });
};
export default CampaignSetupCompleteDialog;
//# sourceMappingURL=CampaignSetupCompleteDialog.js.map
