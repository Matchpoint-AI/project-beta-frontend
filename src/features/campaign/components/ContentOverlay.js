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
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import PostPreview from './PostPreview';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import moment from 'moment-timezone';
var ContentOverlay = function (_a) {
  var day = _a.day,
    closeOverlay = _a.closeOverlay,
    content = _a.content,
    brandName = _a.brandName,
    id = _a.id,
    week = _a.week,
    setOpen = _a.setOpen,
    updataImage = _a.updataImage,
    approved = _a.approved,
    onApprovalUpdate = _a.onApprovalUpdate;
  var endpointUrl = getServiceURL('content-gen');
  var imageIndex = [1, 1, 1];
  var profile = useAuth().profile;
  var _b = useState(false),
    loading = _b[0],
    setLoading = _b[1]; // Loading state
  var _c = useState(approved),
    isApproved = _c[0],
    setIsApproved = _c[1]; // Track if approved
  var _d = useState(false),
    errorSaving = _d[0],
    setErrorSaving = _d[1]; // Track loading state
  var _e = useState(''),
    errorText = _e[0],
    setErrorText = _e[1];
  var validateTimezone = function (timezone) {
    return moment.tz.zone(timezone) !== null;
  };
  var handleApprove = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var userTimezone, validTimezone, payload, response, errorData, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
            setLoading(true);
            payload = {
              campaign_content_id: id,
              week: week,
              day: day,
              approved: true,
              timezone: validTimezone,
              posts: content.reduce(function (acc, item, index) {
                var postKey = 'post_'.concat(index + 1);
                acc[postKey] = {
                  selected_image: item.image_url[imageIndex[index] - 1], // Adjust the image index accordingly
                  text: item.text,
                };
                return acc;
              }, {}),
            };
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, 6, 7]);
            return [
              4 /*yield*/,
              fetch(endpointUrl + '/api/v1/contentgen/approve', {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              }),
            ];
          case 2:
            response = _a.sent();
            if (response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            errorData = _a.sent();
            throw new Error(errorData.detail || 'Failed to fetch data');
          case 4:
            setIsApproved(true); // Mark as approved
            onApprovalUpdate();
            closeOverlay();
            return [3 /*break*/, 7];
          case 5:
            error_1 = _a.sent();
            console.error('Error fetching data:', error_1);
            setErrorText(
              (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) ||
                'An unknown error occurred'
            );
            setErrorSaving(true);
            return [3 /*break*/, 7];
          case 6:
            setLoading(false); // Stop loading spinner
            return [7 /*endfinally*/];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  var handlePrevious = function () {
    setOpen(day - 1);
  };
  var handleNext = function () {
    setOpen(day + 1);
  };
  return _jsxs(Dialog, {
    fullScreen: true,
    open: day !== 0,
    onClose: closeOverlay,
    PaperProps: {
      style: {
        backgroundColor: '#F3F3F3',
      },
    },
    scroll: 'body',
    children: [
      _jsxs(DialogContent, {
        sx: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingY: '20px',
          paddingX: '0px',
        },
        children: [
          _jsx('div', {
            className: 'flex items-center justify-center h-[40px] w-[40px]',
            children:
              day !== 1 &&
              _jsx('button', {
                className: '',
                onClick: handlePrevious,
                children: _jsx(IoIosArrowBack, { size: 40 }),
              }),
          }),
          _jsxs('div', {
            className: 'w-full h-full flex flex-col  justify-center items-center',
            children: [
              _jsxs('div', {
                className: 'flex flex-row justify-between items-center w-full',
                children: [
                  _jsxs('h1', {
                    className:
                      'text-2xl font-semibold bg-gradient-to-r from-[#681DBA] to-[#FF43E1] bg-clip-text text-transparent',
                    children: ['Day ', day, ' content preview'],
                  }),
                  _jsx('button', {
                    onClick: closeOverlay,
                    children: _jsx(IoClose, { color: '#4b5563', size: 32 }),
                  }),
                ],
              }),
              _jsx('div', {
                className: 'w-full flex justify-evenly items-center flex-wrap mt-5 sm:mt-10',
                children: content.map(function (val, index) {
                  return _jsx(
                    PostPreview,
                    {
                      week: week,
                      day: day,
                      index: index,
                      content: val,
                      brandName: brandName,
                      imageIndex: imageIndex,
                      campaign_content_id: id,
                      updataImage: updataImage,
                    },
                    index
                  );
                }),
              }),
              !isApproved &&
                _jsx('div', {
                  className: 'w-full h-[52px] flex justify-center items-center mt-4',
                  children: _jsx('button', {
                    onClick: handleApprove,
                    disabled: loading,
                    className:
                      'sm:w-[182px] w-full h-full border border-gray-200 bg-green-200 rounded-lg text-gray-900 font-medium mt-3',
                    children: loading
                      ? _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 })
                      : 'Approve Full Day',
                  }),
                }),
            ],
          }),
          _jsx('div', {
            className: 'flex items-center justify-center h-[40px] w-[40px]',
            children:
              day !== 7 &&
              _jsx('button', {
                className: '',
                onClick: handleNext,
                children: _jsx(IoIosArrowForward, { size: 40 }),
              }),
          }),
        ],
      }),
      _jsx(ErrorToast, {
        message: errorText,
        open: errorSaving,
        onClose: function () {
          return setErrorSaving(false);
        },
      }),
    ],
  });
};
export default ContentOverlay;
//# sourceMappingURL=ContentOverlay.js.map
