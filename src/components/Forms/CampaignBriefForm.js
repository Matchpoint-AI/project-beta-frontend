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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { BrandContext } from '../../context/BrandContext';
import { CampaignContext } from '../../context/CampaignContext';
import CustomDialog from '../../features/campaign/components/CustomDialog';
import { useNavigate } from 'react-router-dom';
import FormsContainer from '../shared/FormsContainer';
import BackButton from '../../shared/components/buttons/BackButton';
import ApproveButton from '../../shared/components/buttons/ApproveButton';
import CampaignSetupCompleteDialog from '../../features/campaign/components/CampaignSetupCompleteDialog';
import { getServiceURL } from '../../helpers/getServiceURL';
import CampaignBriefTimingBlock from '../../features/campaign/components/CampaignBriefTimingBlock';
import dayjs from 'dayjs';
import CampaignDetails from '../../features/campaign/components/CampaignDetails';
import CampaignSchedule from '../../features/campaign/components/CampaignSchedule';
import CampaignDetailsBlock from '../../features/campaign/components/CampaignDetailsBlock';
import handleNavigate from '../../helpers/handleNavigate';
import { useAuth } from '../../features/auth/context/AuthContext';
import { trackCampaignBriefCreation } from '../../helpers/analytics';
var CampaignBriefForm = function (_a) {
  var _b;
  var setCurrentStep = _a.setCurrentStep,
    handleBack = _a.handleBack,
    setTiming = _a.setTiming,
    setService = _a.setService,
    parentHandleApprove = _a.handleApprove;
  var _c = useContext(BrandContext),
    businessInfo = _c.businessInfo,
    setBusinessInfo = _c.setBusinessInfo;
  var _d = useState(0),
    isOpen = _d[0],
    setIsOpen = _d[1];
  var _e = useState(false),
    sent = _e[0],
    setSent = _e[1];
  var _f = useContext(CampaignContext),
    campaignInfo = _f.campaignInfo,
    setCampaignInfo = _f.setCampaignInfo;
  var _g = useState(''),
    campaignSummary = _g[0],
    setCampaignSummary = _g[1];
  var profile = useAuth().profile;
  var navigate = useNavigate();
  // const prompt = `Based on the data we've collected for ${
  //   businessInfo.name
  // } which you can find here ${JSON.stringify({
  //   businessInfo,
  // })} including what we scraped in step 1 about the campaign: ${JSON.stringify({
  //   campaignInfo,
  // })} please compile that with the user input variables from the variable list to summarize the campaign.  You can start with the selected campaign summary, product or service. Make the response the campaign summary and just that.`;
  var prompt = 'Based on the data for '
    .concat(
      businessInfo.name,
      ', please create a campaign strategy of 60 words or less that:\n1. Summarizes the industry and business goals\n2. Outlines key products/services\n3. Describes the target consumer\n\nUse this data:\nBusiness Details: '
    )
    .concat(JSON.stringify(businessInfo), '\nCampaign Information: ')
    .concat(
      JSON.stringify(campaignInfo),
      '\n\nFormat the response as a single cohesive summary paragraph following this example style:\nGet '
    )
    .concat(
      campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.audienceGender,
      ' who are interested in '
    )
    .concat(
      campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.audienceInterests,
      ' to see '
    )
    .concat(businessInfo.name, "'s ")
    .concat(businessInfo.products, ' as the best solution for them by showing them ')
    .concat(
      campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.product_features,
      ' supports exactly what they need.'
    );
  var handleApprove = function () {
    setSent(true);
    if (
      (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.campaign_type) &&
      (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.durationNum)
    ) {
      trackCampaignBriefCreation(
        campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.campaign_type,
        campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.durationNum,
        0
      );
    }
    // Call the parent's handleApprove function to continue the flow
    if (parentHandleApprove) {
      parentHandleApprove();
    }
  };
  var generateSummary = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var endpointUrl;
      return __generator(this, function (_a) {
        if (
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.summary) !==
          undefined
        ) {
          setCampaignSummary(
            campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.summary
          );
          return [2 /*return*/];
        }
        endpointUrl = ''.concat(getServiceURL('llm'), '/api/v1/llm/openai');
        fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            var choices = data.response.choices;
            var content = choices[0].message.content;
            console.log(content);
            setCampaignSummary(content);
            setCampaignInfo(function (prev) {
              return __assign(__assign({}, prev), { summary: content });
            });
          })
          .catch(function (error) {
            console.error('Error:', error);
          });
        return [2 /*return*/];
      });
    });
  };
  var editTable = [1, 3, 2, 4];
  useEffect(function () {
    // Fetch initial data when component mounts
    generateSummary();
  }, []);
  var handleRedirect = function () {
    navigate('/');
  };
  var onClose = function () {
    var _a;
    setCampaignInfo({});
    handleNavigate(
      (_a = profile === null || profile === void 0 ? void 0 : profile.id) !== null && _a !== void 0
        ? _a
        : '',
      '/dashboard',
      navigate
    );
  };
  console.log(campaignInfo);
  return _jsxs(_Fragment, {
    children: [
      isOpen !== 0 &&
        _jsx(CustomDialog, {
          onClose: handleRedirect,
          isOpen: isOpen,
          setIsOpen: setIsOpen,
          setCurrentStep: setCurrentStep,
          setTiming: setTiming,
          setService: setService,
        }),
      sent &&
        _jsx(CampaignSetupCompleteDialog, {
          onClose: onClose,
          setCurrentStep: setCurrentStep,
          open: sent,
        }),
      _jsxs(FormsContainer, {
        className: ''.concat(isOpen ? 'blur-md' : ''),
        children: [
          _jsx('div', {
            className: 'mb-5',
            children:
              (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo) !== ''
                ? _jsx('img', {
                    src: 'https://storage.googleapis.com/matchpoint-brands-logos/'.concat(
                      businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo
                    ),
                    alt: 'logo',
                    className: 'w-[100px] h-auto ml-auto',
                  })
                : _jsx('div', {
                    className: 'mb-5 flex ml-auto',
                    children: _jsx('h1', {
                      className: 'text-2xl font-semibold text-gray-900 capitalize',
                      children:
                        businessInfo === null || businessInfo === void 0
                          ? void 0
                          : businessInfo.name,
                    }),
                  }),
          }),
          _jsx('div', {
            className: 'mb-5 flex justify-center',
            children: _jsx('h1', {
              className: 'text-lg font-semibold text-gray-900 capitalize',
              children:
                campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.name,
            }),
          }),
          _jsxs('div', {
            className: 'mb-5 flex md:flex-row flex-col gap-[14px]',
            children: [
              _jsx(CampaignBriefTimingBlock, {
                title: 'Created',
                children: _jsx('span', {
                  className: 'font-bold text-sm leading-5',
                  children: dayjs(
                    (_b =
                      campaignInfo === null || campaignInfo === void 0
                        ? void 0
                        : campaignInfo.created_at) !== null && _b !== void 0
                      ? _b
                      : Date.now()
                  ).format('MM/DD/YY'),
                }),
              }),
              _jsx(CampaignBriefTimingBlock, {
                title: 'campaign timing',
                children: _jsxs('p', {
                  className: 'text-sm font-normal',
                  children: [
                    _jsx('span', { className: 'font-bold', children: campaignInfo.duration }),
                    ' ',
                    campaignInfo === null || campaignInfo === void 0
                      ? void 0
                      : campaignInfo.startDate,
                    ' -',
                    ' ',
                    dayjs(
                      campaignInfo === null || campaignInfo === void 0
                        ? void 0
                        : campaignInfo.startDate
                    )
                      .add(
                        campaignInfo === null || campaignInfo === void 0
                          ? void 0
                          : campaignInfo.durationNum,
                        'weeks'
                      )
                      .format('MM/DD/YY'),
                    ' ',
                  ],
                }),
              }),
            ],
          }),
          _jsx('div', {
            className: 'mb-5',
            children: _jsxs('div', {
              className: ' bg-[#FDF2F8] p-4 rounded-md',
              children: [
                _jsx('h1', {
                  className: 'font-semibold text-sm mb-1 ',
                  children: 'Campaign Strategy:',
                }),
                _jsx('p', {
                  className: 'text-sm text-gray-900',
                  children: campaignSummary
                    ? campaignSummary
                    : 'Campaign Strategy is being generated...',
                }),
              ],
            }),
          }),
          _jsx('h1', { className: 'font-semibold text-lg mb-1 ', children: 'Campaign Details' }),
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name) &&
            _jsx(CampaignDetailsBlock, {
              title: 'Brand',
              text: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name,
              review:
                campaignInfo === null || campaignInfo === void 0
                  ? void 0
                  : campaignInfo.campaign_brief,
            }),
          (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.product) &&
            _jsx(CampaignDetailsBlock, {
              title: 'Brand, Service or Product to advertise:',
              text:
                campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.product,
              review:
                campaignInfo === null || campaignInfo === void 0
                  ? void 0
                  : campaignInfo.campaign_brief,
            }),
          _jsx(CampaignDetails, {}),
          _jsx(CampaignSchedule, {}),
        ],
      }),
      (campaignInfo === null || campaignInfo === void 0 ? void 0 : campaignInfo.campaign_brief) !==
        true &&
        _jsxs('div', {
          className: 'flex justify-between mb-10 w-full '.concat(isOpen ? 'blur-md' : ''),
          children: [
            _jsx(BackButton, {
              onClick: function () {
                return handleBack();
              },
            }),
            _jsx(ApproveButton, { onClick: handleApprove }),
          ],
        }),
    ],
  });
};
export default CampaignBriefForm;
//# sourceMappingURL=CampaignBriefForm.js.map
