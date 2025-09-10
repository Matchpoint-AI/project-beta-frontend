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
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CampaignStepsBar from '../components/CampaignStepsBar';
import CustomComponent from '../components/CustomComponent';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import AudienceForm from '../../../components/Forms/AudienceForm';
import CampaignBriefForm from '../../../components/Forms/CampaignBriefForm';
import PurposeForm from '../../../components/Forms/PurposeForm';
import ServiceForm from '../../../components/onboard/ServiceForm';
import TimingForm from '../../../components/Forms/TimingForm';
import Sidebar from '../../../components/shared/Sidebar';
import { useAuth } from '../../auth/context/AuthContext';
import { BrandContext } from '../../../context/BrandContext';
import { CampaignContext } from '../../../context/CampaignContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { displayPeriod } from '../../../helpers/calculateTiming';
import handleNavigate from '../../../helpers/handleNavigate';
import { trackCampaignBriefCreation, trackFeatureUsage } from '../../../helpers/analytics';
var Campaign = function () {
  var _a = useContext(CampaignContext),
    campaignInfo = _a.campaignInfo,
    setCampaignInfo = _a.setCampaignInfo;
  var _b = useState(1),
    currentStep = _b[0],
    setCurrentStep = _b[1];
  var setBusinessInfo = useContext(BrandContext).setBusinessInfo;
  var _c = useState('Timing not selected'),
    timing = _c[0],
    setTiming = _c[1];
  var _d = useState(' not selected'),
    service = _d[0],
    setService = _d[1];
  var profile = useAuth().profile;
  var endpointUrl = getServiceURL('data');
  var _e = useState(false),
    error = _e[0],
    setError = _e[1];
  var navigate = useNavigate();
  var location = useLocation();
  var _f = useState(Date.now()),
    stepStartTime = _f[0],
    setStepStartTime = _f[1];
  useEffect(
    function () {
      setCurrentStep(1);
    },
    [location]
  );
  useEffect(
    function () {
      if ((profile === null || profile === void 0 ? void 0 : profile.token) === '') return;
      var fetchBrandData = function () {
        return __awaiter(void 0, void 0, void 0, function () {
          var response, data;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [
                  4 /*yield*/,
                  fetch(endpointUrl + '/api/v1/data/get/complex?query_kind=brand_data', {
                    method: 'GET',
                    headers: {
                      Authorization: 'Bearer '.concat(
                        profile === null || profile === void 0 ? void 0 : profile.token
                      ),
                    },
                  }),
                ];
              case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
              case 2:
                data = _a.sent();
                if (data.length > 0) {
                  setCampaignInfo(function (prev) {
                    return __assign(__assign({}, prev), {
                      brandLogo: data[0].logo !== undefined ? data[0].logo.file : undefined,
                    });
                  });
                  setBusinessInfo({
                    products: data[0].brand_variables.products,
                    name: data[0].biz_variables.brand_name,
                    website: data[0].biz_variables.brand_website,
                    industry: data[0].biz_variables.industry,
                    vertical: data[0].biz_variables.vertical,
                    physical_locations: data[0].brand_variables.locations,
                    locations_fetched: data[0].brand_variables.isFetched,
                    checkZip: data[0].brand_variables.checkZip,
                    brandColors: data[0].brand_variables.colors,
                    values: data[0].brand_variables.values,
                    toneAndVoice: data[0].brand_variables.tov,
                    mission: data[0].brand_variables.mission,
                    persona: data[0].brand_variables.persona,
                    summary: data[0].brand_variables.summary,
                    isSaved: true,
                    logo: data[0].biz_variables.brand_logo,
                  });
                } else {
                  console.log('returning to onboard');
                  setError(true);
                  setTimeout(function () {
                    handleNavigate(
                      (profile === null || profile === void 0 ? void 0 : profile.id) || '',
                      '/onboard',
                      navigate
                    );
                  }, 1000);
                }
                return [2 /*return*/];
            }
          });
        });
      };
      fetchBrandData();
    },
    [profile]
  );
  var handleBack = function (step) {
    if (step === void 0) {
      step = 1;
    }
    if (currentStep > 1) {
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), { currentStep: currentStep - step });
      });
      setCurrentStep(currentStep - step);
      setStepStartTime(Date.now());
    }
  };
  var handleNext = function (step) {
    if (step === void 0) {
      step = 1;
    }
    var timeSpent = Date.now() - stepStartTime;
    trackFeatureUsage('Campaign Creation', 'Step '.concat(currentStep, ' Completed'), timeSpent);
    if (currentStep < 6) {
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), { currentStep: currentStep + step });
      });
      setCurrentStep(currentStep + step);
      setStepStartTime(Date.now());
    }
    if (currentStep === 5) {
      trackCampaignBriefCreation(
        campaignInfo.campaignType || 'awareness',
        campaignInfo.duration || 4,
        timeSpent
      );
    }
  };
  var customComponentData = [
    {
      title: "Let's create a brief for your campaign.",
      subtitle:
        'The below info will allow us to express your business with targeted messaging to the right audience',
    },
    {
      title: "Let's select the focus of your campaign.",
      subtitle: "We'll show this in your campaign with pictures and captions.",
    },
    {
      title: "Let's define who your campaign is for.",
      subtitle:
        'The inputs below will decide how people look in your campaign to help your audience connect with your business.',
    },
    {
      title: "Let's set timing for your campaign",
      subtitle: 'Select your start date and campaign length',
    },
    {
      title: 'Review your Campaign Brief',
      subtitle:
        "We made this brief to guide your campaign creation. You can edit or approve it, and we'll start creating your content.",
    },
    {
      title: 'Campaign Brief Review',
      subtitle: 'Select your start date and campaign length',
    },
  ];
  useEffect(
    function () {
      if (campaignInfo.currentStep !== undefined) setCurrentStep(campaignInfo.currentStep);
      var info = displayPeriod(
        campaignInfo.startDate || new Date().toISOString(),
        ''.concat(campaignInfo.duration || 4, ' weeks')
      );
      setTiming(info);
      var tmp = campaignInfo.product;
      if (tmp !== undefined && tmp !== '') setService(tmp);
      else setService('not selected');
    },
    [campaignInfo]
  );
  return _jsx('div', {
    className: 'h-full w-full',
    children: _jsxs('div', {
      className:
        'flex lg:flex-row flex-col gap-2 min-h-screen bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] items-center lg:items-start md:pl-[100px] lg:pl-[100px] md:pr-[20px] lg:pr-[20px] p-4 lg:p-0',
      children: [
        _jsx(ErrorToast, {
          open: error,
          onClose: function () {
            return setError(false);
          },
          message: 'Error Fill Your Brand First',
        }),
        _jsx(Sidebar, { currentStep: currentStep }),
        _jsxs('div', {
          className: 'flex lg:flex-row w-full md:w-[95%] lg:w-[1024px] flex-col mx-auto gap-4',
          children: [
            _jsx('div', {
              className: 'w-full lg:w-1/3 grow',
              children: _jsx(CampaignStepsBar, {
                timing: timing,
                service: service,
                currentStep: currentStep,
                campaignInfo: campaignInfo,
              }),
            }),
            _jsx('div', {
              className: 'w-full lg:w-2/3 grow lg:grow-0',
              children: _jsxs(CustomComponent, {
                title: customComponentData[currentStep - 1].title,
                subtitle: customComponentData[currentStep - 1].subtitle,
                children: [
                  currentStep === 1 && _jsx(PurposeForm, { handleNext: handleNext }),
                  currentStep === 2 &&
                    _jsx(ServiceForm, {
                      handleNext: handleNext,
                      handleBack: handleBack,
                      setService: setService,
                    }),
                  currentStep === 3 &&
                    _jsx(AudienceForm, { handleNext: handleNext, handleBack: handleBack }),
                  currentStep === 4 &&
                    _jsx(TimingForm, {
                      handleNext: handleNext,
                      handleBack: handleBack,
                      setTiming: setTiming,
                    }),
                  currentStep >= 5 &&
                    _jsx(CampaignBriefForm, {
                      setTiming: setTiming,
                      setService: setService,
                      setCurrentStep: setCurrentStep,
                      handleBack: handleBack,
                      handleApprove: handleNext,
                    }),
                ],
              }),
            }),
          ],
        }),
      ],
    }),
  });
};
export default Campaign;
//# sourceMappingURL=Campaign.js.map
