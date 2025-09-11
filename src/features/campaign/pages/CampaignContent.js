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
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../../../components/shared/Sidebar';
import { useAuth } from '../../auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useNavigate, useParams } from 'react-router-dom';
import { displayDuration, getPostingSchedule } from '../../../helpers/calculateTiming';
import { CampaignHeader, ButtonGroup, ApprovePopup, TabWrapper } from '../../../features/campaign';
import { capitalizeFirstLetterOfEachWord } from '../../../helpers/formatters';
import { trackContentReview, trackCampaignPublish } from '../../../helpers/analytics';
import { CampaignContext } from '../../../context/CampaignContext';
import handleNavigate from '../../../helpers/handleNavigate';
var CampaignContent = function () {
  var _a = React.useState(1),
    currentTab = _a[0],
    setCurrentTab = _a[1];
  var _b = useState(),
    campaignContent = _b[0],
    setCampaign = _b[1];
  var _c = useState(''),
    title = _c[0],
    setTitle = _c[1];
  var _d = useState(''),
    service = _d[0],
    setService = _d[1];
  var _e = useState(''),
    timeFrame = _e[0],
    setTimeFrame = _e[1];
  var _f = useState(''),
    postingSchedule = _f[0],
    setPostingSchedule = _f[1];
  var id = useParams().id;
  var _g = useAuth(),
    profile = _g.profile,
    isAuthenticated = _g.isAuthenticated,
    authLoading = _g.isLoading;
  var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
  var navigate = useNavigate();
  var _h = useState(false),
    approvePopup = _h[0],
    setApprovePopup = _h[1];
  var _j = useState({
      total_content: 0,
      approved: 0,
      ready_for_review: 0,
      generating: 0,
      published: 0,
      total_posts: 0,
      exported: 0,
    }),
    stats = _j[0],
    setStats = _j[1];
  var _k = useState(Date.now()),
    reviewStartTime = _k[0],
    setReviewStartTime = _k[1];
  var _l = useState(true),
    loading = _l[0],
    setLoading = _l[1];
  var _m = useState(null),
    error = _m[0],
    setError = _m[1];
  var _o = useState(0),
    retryTrigger = _o[0],
    setRetryTrigger = _o[1];
  var endpointUrl = getServiceURL('data');
  // Wait for authentication to be ready
  useEffect(
    function () {
      if (!authLoading && !isAuthenticated) {
        navigate('/login');
        return;
      }
    },
    [isAuthenticated, authLoading, navigate]
  );
  // Separate effect for data fetching
  useEffect(
    function () {
      if (
        authLoading ||
        !isAuthenticated ||
        !(profile === null || profile === void 0 ? void 0 : profile.token) ||
        !id
      ) {
        return;
      }
      var pollInterval = null;
      var isUnmounted = { value: false };
      var fetchData = function () {
        return __awaiter(void 0, void 0, void 0, function () {
          var campaignParams,
            campaignResponse,
            campaignData,
            campaign,
            contentParams,
            contentResponse,
            contentData,
            _a,
            total_content,
            approved,
            ready_for_review,
            generating,
            published,
            total_posts,
            exported,
            timeSpent,
            _error_1;
          var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
          return __generator(this, function (_m) {
            switch (_m.label) {
              case 0:
                if (isUnmounted.value) return [2 /*return*/];
                setLoading(true);
                setError(null);
                _m.label = 1;
              case 1:
                _m.trys.push([1, 6, , 7]);
                campaignParams = new URLSearchParams({
                  query_kind: 'campaign',
                  id: id,
                });
                return [
                  4 /*yield*/,
                  fetch(
                    ''
                      .concat(endpointUrl, '/api/v1/data/get/complex?')
                      .concat(campaignParams.toString()),
                    {
                      method: 'GET',
                      headers: {
                        Authorization: 'Bearer '.concat(profile.token),
                        'Content-Type': 'application/json',
                      },
                    }
                  ),
                ];
              case 2:
                campaignResponse = _m.sent();
                if (campaignResponse.status === 401) {
                  navigate('/login');
                  return [2 /*return*/];
                }
                if (!campaignResponse.ok) {
                  throw new Error('Failed to fetch campaign: '.concat(campaignResponse.statusText));
                }
                return [4 /*yield*/, campaignResponse.json()];
              case 3:
                campaignData = _m.sent();
                if (!campaignData.length) {
                  setError('Campaign not found. Please check if the campaign exists or try again.');
                  setLoading(false);
                  return [2 /*return*/];
                }
                campaign = campaignData[0];
                setCampaign(campaign);
                setTitle(
                  capitalizeFirstLetterOfEachWord(
                    ((_c =
                      (_b = campaign.campaign_data) === null || _b === void 0
                        ? void 0
                        : _b.campaign_variables) === null || _c === void 0
                      ? void 0
                      : _c.name) || ''
                  )
                );
                setService(
                  ((_e =
                    (_d = campaign.campaign_data) === null || _d === void 0
                      ? void 0
                      : _d.campaign_variables) === null || _e === void 0
                    ? void 0
                    : _e.product_service) || 'not selected'
                );
                setPostingSchedule(
                  getPostingSchedule(
                    ((_g =
                      (_f = campaign.campaign_data) === null || _f === void 0
                        ? void 0
                        : _f.campaign_variables) === null || _g === void 0
                      ? void 0
                      : _g.frequency) || ''
                  )
                );
                setTimeFrame(
                  displayDuration(
                    ((_j =
                      (_h = campaign.campaign_data) === null || _h === void 0
                        ? void 0
                        : _h.campaign_variables) === null || _j === void 0
                      ? void 0
                      : _j.start_date) || '',
                    ((_l =
                      (_k = campaign.campaign_data) === null || _k === void 0
                        ? void 0
                        : _k.campaign_variables) === null || _l === void 0
                      ? void 0
                      : _l.durationNum) || 0
                  )
                );
                contentParams = new URLSearchParams({
                  query_kind: 'generated_content',
                  id: id,
                });
                return [
                  4 /*yield*/,
                  fetch(
                    ''
                      .concat(endpointUrl, '/api/v1/data/get/complex?')
                      .concat(contentParams.toString()),
                    {
                      method: 'GET',
                      headers: {
                        Authorization: 'Bearer '.concat(profile.token),
                      },
                    }
                  ),
                ];
              case 4:
                contentResponse = _m.sent();
                if (!contentResponse.ok) {
                  throw new Error('Failed to fetch content: '.concat(contentResponse.statusText));
                }
                return [4 /*yield*/, contentResponse.json()];
              case 5:
                contentData = _m.sent();
                if (contentData.length > 0) {
                  ((_a = contentData[0]),
                    (total_content = _a.total_content),
                    (approved = _a.approved),
                    (ready_for_review = _a.ready_for_review),
                    (generating = _a.generating),
                    (published = _a.published),
                    (total_posts = _a.total_posts),
                    (exported = _a.exported));
                  setStats({
                    total_content: total_content || 0,
                    approved: approved || 0,
                    ready_for_review: ready_for_review || 0,
                    generating: generating && generating > 0 ? generating : 0,
                    published: published || 0,
                    total_posts: total_posts || total_content || 0,
                    exported: exported || 0,
                  });
                  if (approved > 0) {
                    timeSpent = Date.now() - reviewStartTime;
                    trackContentReview(id, 'image', timeSpent, 'approve');
                    setReviewStartTime(Date.now());
                  }
                }
                setLoading(false);
                // If campaign content is loaded, clear polling
                if (!isUnmounted.value && campaign && campaign.campaign_data) {
                  if (pollInterval) {
                    clearInterval(pollInterval);
                    pollInterval = null;
                  }
                }
                return [3 /*break*/, 7];
              case 6:
                _error_1 = _m.sent();
                setError(error instanceof Error ? error.message : 'Failed to load campaign data');
                setLoading(false);
                return [3 /*break*/, 7];
              case 7:
                return [2 /*return*/];
            }
          });
        });
      };
      fetchData(); // Initial fetch
      // Only set up polling if we don't have campaign content yet
      if (
        !(campaignContent === null || campaignContent === void 0
          ? void 0
          : campaignContent.campaign_data)
      ) {
        pollInterval = setInterval(fetchData, 10000);
      }
      // return () => {
      //   isUnmounted.value = true;
      //   if (pollInterval) {
      //     clearInterval(pollInterval);
      //   }
      // };
    },
    [
      id,
      profile === null || profile === void 0 ? void 0 : profile.token,
      isAuthenticated,
      authLoading,
      navigate,
      endpointUrl,
      retryTrigger,
    ]
  );
  var handleApprove = function () {
    if (id && campaignContent && campaignContent.campaign_data) {
      trackCampaignPublish(
        id,
        campaignContent.campaign_data.campaign_variables.durationNum,
        stats === null || stats === void 0 ? void 0 : stats.total_content
      );
    }
  };
  if (authLoading) {
    return _jsx('div', {
      className: 'flex w-full bg-custom-gradient min-h-screen',
      children: _jsx('div', {
        className: 'flex justify-center items-center w-full',
        children: _jsx('div', {
          className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-[#5145CD]',
        }),
      }),
    });
  }
  if (!(profile === null || profile === void 0 ? void 0 : profile.token)) {
    return null;
  }
  var navigateToCampaignView = function () {
    var _a, _b;
    var data =
      (_a =
        campaignContent === null || campaignContent === void 0
          ? void 0
          : campaignContent.campaign_data) === null || _a === void 0
        ? void 0
        : _a.campaign_variables;
    if (_data) {
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), {
          summary: data === null || data === void 0 ? void 0 : data.summary,
          name: data === null || data === void 0 ? void 0 : data.name,
          product: data === null || data === void 0 ? void 0 : data.product_service,
          audienceRace: data === null || data === void 0 ? void 0 : data.audience_ethnicity,
          audienceEmotion: data === null || data === void 0 ? void 0 : data.emotion,
          audienceInterests: data === null || data === void 0 ? void 0 : data.audience_interests,
          productDescription:
            data === null || data === void 0 ? void 0 : data.product_service_description,
          purpose: data === null || data === void 0 ? void 0 : data.purpose_topic,
          locations: data === null || data === void 0 ? void 0 : data.scene,
          currentStep: 5,
          product_features: data === null || data === void 0 ? void 0 : data.key_feature,
          purposeAbout: data === null || data === void 0 ? void 0 : data.purpose,
          audienceGender: data === null || data === void 0 ? void 0 : data.audience_gender,
          audienceAgeRange: data === null || data === void 0 ? void 0 : data.audience_age,
          startDate: data === null || data === void 0 ? void 0 : data.start_date,
          duration: data === null || data === void 0 ? void 0 : data.duration,
          durationNum: data === null || data === void 0 ? void 0 : data.durationNum,
          frequency: data === null || data === void 0 ? void 0 : data.frequency,
          postingFrequency: data === null || data === void 0 ? void 0 : data.postingFrequency,
          deliveryDay: data === null || data === void 0 ? void 0 : data.deliveryDay,
          campaign_id:
            campaignContent === null || campaignContent === void 0
              ? void 0
              : campaignContent.campaign_id,
          campaign_brief: true,
          created_at:
            campaignContent === null || campaignContent === void 0
              ? void 0
              : campaignContent.timestamp,
        });
      });
      handleNavigate(
        (_b = profile === null || profile === void 0 ? void 0 : profile.id) !== null &&
          _b !== void 0
          ? _b
          : '',
        '/campaign',
        navigate
      );
    }
  };
  return _jsxs('div', {
    className: 'flex w-full bg-custom-gradient min-h-screen',
    children: [
      _jsx(Sidebar, { currentStep: 0 }),
      _jsx('div', {
        className: 'flex flex-col ml-0 md:ml-20 flex-grow',
        children: _jsxs('div', {
          className: 'text-[#747474] flex flex-col gap-5',
          children: [
            _jsxs('div', {
              className:
                'flex flex-col gap-10 w-full pl-2 md:pl-14 pt-24 md:pt-10 pr-2 md:pr-10 pb-5 bg-white',
              children: [
                _jsx(CampaignHeader, {
                  title: title,
                  service: service,
                  timeFrame: timeFrame,
                  postingSchdule: postingSchedule,
                  currentTab: currentTab,
                  handleNavigate: navigateToCampaignView,
                }),
                _jsx(ButtonGroup, {
                  campaign: campaignContent,
                  currentTab: currentTab,
                  setCurrentTab: setCurrentTab,
                  setApprovePopup: setApprovePopup,
                  stats: stats,
                  onApprove: handleApprove,
                }),
              ],
            }),
            _jsx('div', {
              className: 'flex flex-col pl-2 md:pl-3 lg:pl-5 pt-20 pr-2 md:pr-7',
              children: loading
                ? _jsx('div', {
                    className: 'flex justify-center items-center min-h-[200px]',
                    children: _jsx('div', {
                      className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-[#5145CD]',
                    }),
                  })
                : error
                  ? _jsxs('div', {
                      className: 'text-red-500 text-center p-4',
                      children: [
                        error,
                        _jsx('button', {
                          onClick: function () {
                            setError(null);
                            setRetryTrigger(function (prev) {
                              return prev + 1;
                            });
                          },
                          className: 'ml-2 text-[#5145CD] underline',
                          children: 'Retry',
                        }),
                      ],
                    })
                  : campaignContent &&
                    campaignContent.campaign_data &&
                    _jsx(TabWrapper, {
                      currentTab: currentTab.toString(),
                      campaign: {
                        campaign_id: id,
                        status: 'active',
                        timestamp: new Date().toISOString(),
                        campaign_data: campaignContent.campaign_data,
                      },
                      setStats: setStats,
                    }),
            }),
          ],
        }),
      }),
      approvePopup &&
        _jsx(ApprovePopup, {
          onClose: function () {
            return setApprovePopup(false);
          },
        }),
    ],
  });
};
export default CampaignContent;
//# sourceMappingURL=CampaignContent.js.map
