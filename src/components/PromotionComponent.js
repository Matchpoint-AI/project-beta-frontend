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
// src/components/PromotionComponent.tsx
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CampaignContext } from '../context/CampaignContext';
import CardStats from '../features/dashboard/components/CardStats';
import CampaignReviewButton from '../features/dashboard/components/CampaignReviewButton';
import handleNavigate from '../helpers/handleNavigate';
import { useAuth } from '../features/auth/context/AuthContext';
import { GiElectric } from 'react-icons/gi';
import CampaignThreadWin from '../features/campaign/components/CampaignThreadWin';
import useFetchThreadMessages from '../hooks/useFetchThreadMessages';
import { CircularProgress } from '@mui/material';
var PromotionComponent = function (_a) {
  var _b, _c, _d, _e, _f, _g;
  var campaign = _a.campaign,
    status = _a.status;
  var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
  var profile = useAuth().profile;
  var _h = useState(false),
    loadingMessages = _h[0],
    setLoadingMessage = _h[1];
  var _j = useFetchThreadMessages(),
    messages = _j[0],
    openThreadWin = _j[1],
    setOpenThreadWin = _j[2],
    fetchMessages = _j[3],
    addMessage = _j[4],
    popMessage = _j[5];
  var handleOpenThreadWin = function (thread_id) {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoadingMessage(true);
            return [4 /*yield*/, fetchMessages(thread_id)];
          case 1:
            _a.sent();
            setLoadingMessage(false);
            return [2 /*return*/];
        }
      });
    });
  };
  var capitalizeFirstLetterOfEachWord = function (str) {
    if (!str) return '';
    return str
      .split(' ')
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };
  var title = capitalizeFirstLetterOfEachWord(
    (_c =
      (_b = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null ||
      _b === void 0
        ? void 0
        : _b.campaign_variables) === null || _c === void 0
      ? void 0
      : _c.name
  );
  var formatMonthDayYear = function (date) {
    var options = {
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };
  var formatMonth = function (date) {
    var options = {
      month: 'short',
    };
    return date.toLocaleDateString('en-US', options);
  };
  var formatFullDate = function (date) {
    var options = { year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  var calculateWeekNumber = function (startDate, durationWeeks) {
    var now = new Date();
    var endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationWeeks * 7);
    // Calculate the difference in milliseconds
    var daysBetween = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    // Calculate the week number
    return Math.ceil(daysBetween / 7);
  };
  var displayPeriod = function (startDate, duration) {
    var _a, _b;
    if (!startDate || !duration || status === 'Draft') return '';
    var _c = startDate.split('/').map(Number),
      month = _c[0],
      day = _c[1],
      year = _c[2];
    var start = new Date(year, month - 1, day);
    var tmp =
      ((_b =
        (_a = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) ===
          null || _a === void 0
          ? void 0
          : _a.campaign_variables) === null || _b === void 0
        ? void 0
        : _b.product_service) || '';
    // Parse the duration
    var durationParts = duration.split(' ');
    var durationValue = Number(durationParts[0]);
    var durationUnit = durationParts[1].toLowerCase(); // e.g., "weeks"
    // Calculate the end date
    var end;
    if (durationUnit === 'weeks' || durationUnit === 'week') {
      end = new Date(start);
      end.setDate(start.getDate() + durationValue * 7); // Add duration in days
    } else {
      throw new Error('Unsupported duration unit: '.concat(durationUnit));
    }
    var now = new Date();
    // Calculate week number
    var isCompleted = now >= end;
    var weekNumber = isCompleted ? durationValue : calculateWeekNumber(start, durationValue);
    var startMonth = formatMonth(start);
    var startDayMonth = formatMonthDayYear(start);
    var endDayMonth = formatMonthDayYear(end);
    var startYear = formatFullDate(start);
    var endYear = formatFullDate(end);
    // Format date range
    var dateRange;
    if (startYear === endYear) {
      if (start.getMonth() === end.getMonth()) {
        dateRange = ''
          .concat(startMonth, ' ')
          .concat(startDayMonth, ' - ')
          .concat(endDayMonth, ', ')
          .concat(startYear);
      } else {
        dateRange = ''
          .concat(startMonth, ' ')
          .concat(startDayMonth, ' - ')
          .concat(endDayMonth, ', ')
          .concat(startYear);
      }
    } else {
      dateRange = ''
        .concat(startMonth, ' ')
        .concat(startDayMonth, ', ')
        .concat(startYear, ' - ')
        .concat(endDayMonth, ', ')
        .concat(endYear);
    }
    if (isCompleted || weekNumber <= 0) {
      return ''.concat(tmp, ' | ').concat(duration, ' | ').concat(dateRange);
    } else {
      return ''
        .concat(tmp, ' | Week ')
        .concat(weekNumber, ' of ')
        .concat(durationValue, ' | ')
        .concat(dateRange);
    }
  };
  var info = displayPeriod(
    (_e =
      (_d = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null ||
      _d === void 0
        ? void 0
        : _d.campaign_variables) === null || _e === void 0
      ? void 0
      : _e.start_date,
    (_g =
      (_f = campaign === null || campaign === void 0 ? void 0 : campaign.campaign_data) === null ||
      _f === void 0
        ? void 0
        : _f.campaign_variables) === null || _g === void 0
      ? void 0
      : _g.duration
  );
  var navigate = useNavigate();
  var statusColor = function () {
    var color;
    if (status === 'Current') color = 'text-[#0E9F6E]';
    else if (status === 'Past') color = 'text-[#D61F69]';
    else if (status === 'Inactive') color = 'text-[#111928]';
    else if (status === 'Draft') color = 'text-orange-700';
    return color;
  };
  var handleDraft = function () {
    var _a;
    var data = campaign.campaign_data.campaign_variables;
    setCampaignInfo(function (prev) {
      return __assign(__assign({}, prev), {
        name: data.name,
        product: data.product_service,
        audienceRace: data.audience_ethnicity,
        audienceEmotion: data.emotion,
        audienceInterests: data.audience_interests,
        productDescription: data.product_service_description,
        purpose: data.purpose_topic,
        locations: data.scene,
        currentStep: data.currentStep,
        product_features: data.key_feature,
        purposeAbout: data.purpose,
        audienceGender: data.audience_gender,
        audienceAgeRange: data.audience_age,
        startDate: data.start_date,
        duration: data.duration,
        postingFrequency: data.postingFrequency,
        deliveryDay: data.deliveryDay,
        campaign_id: campaign.campaign_id,
        summary: data.summary,
      });
    });
    handleNavigate(
      (_a = profile === null || profile === void 0 ? void 0 : profile.id) !== null && _a !== void 0
        ? _a
        : '',
      '/campaign',
      navigate
    );
  };
  return _jsxs('div', {
    className:
      'bg-white p-5 rounded-lg shadow-md w-full flex flex-col lg:flex-row lg:justify-between lg:items-center justify-start border border-gray-400 relative',
    children: [
      _jsxs('div', {
        children: [
          _jsx('h1', {
            className: 'text-sm  '.concat(statusColor(), ' font-medium mb-2 uppercase'),
            children: status,
          }),
          status !== 'Draft'
            ? _jsx(Link, {
                to: '/campaign/content/'.concat(campaign.campaign_id),
                className: 'text-2xl text-[#362F78] font-semibold mb-2',
                children: title,
              })
            : _jsx('h1', {
                className: 'text-2xl text-[#362F78] font-semibold mb-2 hover:cursor-pointer',
                onClick: handleDraft,
                children: title,
              }),
          info !== '' &&
            _jsx('p', { className: 'text-lg font-normal text-gray-900 mb-4', children: info }),
          status !== 'Draft' && _jsx(CardStats, { id: campaign.campaign_id }),
        ],
      }),
      _jsx('div', {
        className: 'mt-4 flex lg:justify-center',
        children:
          status === 'Draft'
            ? _jsx('button', {
                onClick: handleDraft,
                className:
                  'text-[#5145CD] border border-[#5145CD] text-sm px-2 py-1 rounded-md mr-2 w-32 h-9',
                children: 'Continue',
              })
            : _jsxs(_Fragment, {
                children: [
                  _jsx(CampaignReviewButton, { campaign: campaign }),
                  _jsx('button', {
                    onClick: function () {
                      var _a;
                      return handleNavigate(
                        (_a = profile === null || profile === void 0 ? void 0 : profile.id) !==
                          null && _a !== void 0
                          ? _a
                          : '',
                        '/campaign/content/'.concat(campaign.campaign_id),
                        navigate
                      );
                    },
                    className:
                      'text-[#5145CD] border border-[#5145CD] text-sm px-2 py-1 rounded-md  h-9',
                    children: 'Content Library',
                  }),
                ],
              }),
      }),
      campaign.thread_id &&
        (profile === null || profile === void 0 ? void 0 : profile.role) === 'ADMIN' &&
        _jsx('button', {
          className: 'absolute top-5 right-5',
          onClick: function () {
            var _a;
            return handleOpenThreadWin(
              (_a = campaign === null || campaign === void 0 ? void 0 : campaign.thread_id) !==
                null && _a !== void 0
                ? _a
                : ''
            );
          },
          disabled: loadingMessages,
          children: loadingMessages
            ? _jsx(CircularProgress, {
                sx: { color: '#42389D' },
                size: 18,
                thickness: 5,
                className: 'mx-auto mb-5',
              })
            : _jsx(GiElectric, { color: '#5145CD', size: 25 }),
        }),
      _jsx(CampaignThreadWin, {
        open: openThreadWin,
        onClose: function () {
          return setOpenThreadWin(false);
        },
        messages: messages,
        addMessage: addMessage,
        popMessage: popMessage,
      }),
    ],
  });
};
export default PromotionComponent;
//# sourceMappingURL=PromotionComponent.js.map
