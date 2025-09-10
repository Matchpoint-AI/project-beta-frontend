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
import { useContext, useState } from 'react';
import { CampaignContext } from '../context/CampaignContext';
import { BrandContext } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';
// import { getAuth } from "firebase/auth";
// import { useAuthentication } from "../firebase";
import { useAuth } from '../features/auth/context/AuthContext';
import { getServiceURL } from '../helpers/getServiceURL';
import { CircularProgress } from '@mui/material';
import handleNavigate from '../helpers/handleNavigate';
import scrapeProduct from './onboard/scrapeProduct';
function isProduct(obj) {
  return typeof obj === 'object' && obj !== null && typeof obj.name === 'string';
}
var StepCampaignComponent = function (_a) {
  var name = _a.name,
    // title, // Remove unused
    // description, // Remove unused
    isActive = _a.isActive,
    currentStep = _a.currentStep,
    globalStep = _a.globalStep;
  var isBeforeCurrentStep = currentStep >= globalStep;
  var _b = useContext(CampaignContext),
    campaignInfo = _b.campaignInfo,
    setCampaignInfo = _b.setCampaignInfo;
  var businessInfo = useContext(BrandContext).businessInfo;
  var _c = useState(false),
    saving = _c[0],
    setSaving = _c[1];
  var navigate = useNavigate();
  var profile = useAuth().profile;
  var endpointUrl = getServiceURL('data');
  // const endpointUrl = "http://localhost:5000";
  var handleSave = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var info,
        campaignId,
        apiEndpoint,
        features,
        productLinkToUse,
        selectedProduct,
        products,
        scraped,
        err_1,
        payload,
        date,
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        formattedDateTime,
        status;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setSaving(true);
            console.log('Saving ...');
            info = campaignInfo;
            apiEndpoint = '/api/v1/data';
            if (info.campaign_id !== undefined) {
              campaignId = info.campaign_id;
              apiEndpoint = '/api/v1/update';
            } else campaignId = crypto.randomUUID();
            features = info.product_features || [];
            productLinkToUse = info.product_link;
            selectedProduct = undefined;
            products = [];
            if (
              Array.isArray(businessInfo.products) &&
              businessInfo.products.length > 0 &&
              businessInfo.products.every(function (item) {
                return typeof item === 'object' && item !== null;
              })
            ) {
              products = businessInfo.products.filter(isProduct);
            }
            if ((!productLinkToUse || productLinkToUse === '') && products && info.product) {
              selectedProduct = products.find(function (p) {
                return p.name === info.product;
              });
              if (selectedProduct) {
                productLinkToUse = selectedProduct.product_link || selectedProduct.link || '';
              }
            }
            if (!(!features || features.length === 0)) return [3 /*break*/, 7];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 6, , 7]);
            scraped = void 0;
            if (!productLinkToUse) return [3 /*break*/, 3];
            return [4 /*yield*/, scrapeProduct(productLinkToUse)];
          case 2:
            scraped = _a.sent();
            return [3 /*break*/, 5];
          case 3:
            if (!(info.product || (selectedProduct && selectedProduct.description)))
              return [3 /*break*/, 5];
            return [
              4 /*yield*/,
              scrapeProduct(
                undefined,
                info.product ||
                  (selectedProduct === null || selectedProduct === void 0
                    ? void 0
                    : selectedProduct.name),
                info.product_description ||
                  (selectedProduct === null || selectedProduct === void 0
                    ? void 0
                    : selectedProduct.description)
              ),
            ];
          case 4:
            scraped = _a.sent();
            _a.label = 5;
          case 5:
            if (scraped) {
              features = scraped.product_features;
              setCampaignInfo(function (prev) {
                return __assign(__assign({}, prev), { product_features: features });
              });
              console.log('LLM-generated product features:', features);
            }
            return [3 /*break*/, 7];
          case 6:
            err_1 = _a.sent();
            console.error('Failed to generate product features via LLM:', err_1);
            return [3 /*break*/, 7];
          case 7:
            payload = {
              brand_variables: {
                TOV: businessInfo.toneAndVoice,
                values: businessInfo.values,
                Persona: businessInfo.persona,
                Colors: businessInfo.brandColors,
                mission: businessInfo.mission,
                brand_visual_style: businessInfo.style,
              },
              campaign_variables: {
                id: campaignId,
                name: info.name,
                product_service: info.product,
                audience_ethnicity: info.audienceRace,
                audience_interests: info.audienceInterests,
                product_service_description: info.product_description,
                product_link: info.product_link,
                purpose_topic: info.purpose,
                emotion: info.audienceEmotion,
                scene: businessInfo.physical_locations,
                lighting: 'bright',
                currentStep: globalStep,
                key_feature: features,
                purpose: info.purposeAbout,
                camera_position: 'normal',
                audience_gender: info.audienceGender,
                mood: ['electric', ' fun', ' chic'],
                audience_age: info.audienceAgeRange,
                start_date: info.start_date,
                duration: info.duration,
                postingFrequency: info.postingFrequency,
                deliveryDay: info.deliveryDay,
                durationNum: info.durationNum,
                frequency: info.frequency,
                summary: info.summary,
              },
              biz_variables: {
                industry: businessInfo.industry,
                brand_name: businessInfo.name,
                vertical: businessInfo.vertical,
              },
            };
            date = new Date();
            year = date.getFullYear();
            month = String(date.getMonth() + 1).padStart(2, '0');
            day = String(date.getDate()).padStart(2, '0');
            hours = String(date.getHours()).padStart(2, '0');
            minutes = String(date.getMinutes()).padStart(2, '0');
            seconds = String(date.getSeconds()).padStart(2, '0');
            formattedDateTime = ''
              .concat(month, '/')
              .concat(day, '/')
              .concat(year, ', ')
              .concat(hours, ':')
              .concat(minutes, ':')
              .concat(seconds);
            status = 'Draft';
            if (!profile) {
              setSaving(false);
              return [2 /*return*/];
            }
            fetch(endpointUrl + apiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer '.concat(profile.token),
              },
              body: JSON.stringify({
                entity_name: 'campaign',
                entity_data: {
                  campaign_id: campaignId,
                  status: status,
                  timestamp: formattedDateTime,
                  campaign_data: payload,
                },
              }),
            })
              .then(function (response) {
                if (!response.ok) {
                  throw new Error('Failed to post data');
                }
                return response.json();
              })
              .then(function (data) {
                console.log('Data posted successfully:', data);
                setCampaignInfo({});
                setTimeout(function () {
                  // setMessage(newMessage);
                  setSaving(false);
                  handleNavigate(profile.id, '/dashboard', navigate);
                }, 3000);
              })
              .catch(function (error) {
                console.error('Error posting data:', error);
              });
            return [2 /*return*/];
        }
      });
    });
  };
  return _jsxs('div', {
    className: 'flex flex-col justify-center',
    children: [
      _jsxs('div', {
        className: 'flex items-center gap-2',
        children: [
          isBeforeCurrentStep
            ? _jsx('div', {
                className: 'w-4 h-4 '.concat(
                  isActive ? 'bg-[#5145CD]' : 'bg-[#6B7280]',
                  ' rounded-full'
                ),
              })
            : _jsx('div', {
                className: 'w-4 h-4 bg-[#5145CD] rounded-full items-center flex justify-center',
                children: _jsx('img', {
                  src: '/thumbs_up.svg',
                  alt: 'step_inactive',
                  width: 10,
                  height: 10,
                }),
              }),
          _jsx('p', {
            className: 'text-lg font-semibold '.concat(
              isActive
                ? 'text-[#5145CD]'
                : ''.concat(!isBeforeCurrentStep ? 'text-[#5145CD]' : 'text-[#6B7280]')
            ),
            children: name,
          }),
        ],
      }),
      globalStep !== 1 &&
        campaignInfo.campaign_brief !== true &&
        _jsx('button', {
          type: 'button',
          onClick: handleSave,
          disabled: saving,
          className: ''.concat(
            currentStep !== 5 ? 'hidden' : '',
            ' h-[41px] w-[142.5px] my-5 p-2 text-sm font-medium border border-[#6B7280] text-[#6B7280] bg-white hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center'
          ),
          children: saving
            ? _jsx(CircularProgress, { sx: { color: 'gray' }, size: 25, thickness: 5 })
            : 'Save For Later',
        }),
    ],
  });
};
export default StepCampaignComponent;
//# sourceMappingURL=StepComponentCampaign.js.map
