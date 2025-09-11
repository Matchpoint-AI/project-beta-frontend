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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { Button, Dialog, DialogContent, TextField } from '@mui/material';
import { getServiceURL } from '../../../helpers/getServiceURL';
import Cookies from 'universal-cookie';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import styled from '@emotion/styled';
import { MdClose } from 'react-icons/md';
import { imageApi } from '../../../api/contentGenerationApi';
var PurpleButton = styled(Button)(function (_a) {
  var _theme = _a.theme;
  return {
    backgroundColor: '#5145CD',
    color: 'white',
    padding: '0.5rem 2rem',
    borderRadius: '0.3rem',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#5145CD',
    },
    '&:disabled': {
      backgroundColor: '#5145CD',
      opacity: 0.7,
    },
  };
});
var CancelButton = styled(Button)(function (_a) {
  var rest = __rest(_a, []);
  return {
    backgroundColor: '#fce4ec',
    color: '#ad1457',
    padding: '0.5rem 2rem',
    borderRadius: '0.3rem',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#f8bbd9',
    },
  };
});
var StyledTextField = styled(TextField)(function (_a) {
  var _theme = _a.theme;
  return {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f5f5f5',
      '& fieldset': {
        borderColor: '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: '#9c27b0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#9c27b0',
        borderWidth: '2px',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#424242',
      fontSize: '14px',
    },
  };
});
export default function ModifyPrompt(_a) {
  var _this = this;
  var week = _a.week,
    day = _a.day,
    post = _a.post,
    content_id = _a.content_id,
    setOpen = _a.setOpen,
    regenerate = _a.regenerate,
    open = _a.open,
    image = _a.image,
    _totalAllowed = _a.totalAllowed;
  var _b = useState(''),
    prompt = _b[0],
    setPrompt = _b[1];
  var _c = useState(false),
    submited = _c[0],
    setSubmited = _c[1];
  var profile = useAuth().profile;
  var _d = useState(false),
    limitReached = _d[0],
    setLimitReached = _d[1];
  var _e = useState(0),
    remainingGenerations = _e[0],
    setRemainingGenerations = _e[1];
  var splitPrompt = function (fullPrompt) {
    if (!fullPrompt) return { firstPart: '', rest: '' };
    // Remove common prefixes but be more flexible
    var prefixes = [
      'A realistic photograph of',
      'A photograph of',
      'A realistic image of',
      'An image of',
    ];
    var withoutPrefix = fullPrompt;
    for (var _i = 0, prefixes_1 = prefixes; _i < prefixes_1.length; _i++) {
      var prefix = prefixes_1[_i];
      if (fullPrompt.startsWith(prefix)) {
        withoutPrefix = fullPrompt.replace(prefix, '').trim();
        break;
      }
    }
    var _a = withoutPrefix.split('.'),
      firstPart = _a[0],
      rest = _a.slice(1);
    var remainingText = rest.length > 0 ? '. '.concat(rest.join('.')) : '';
    return { firstPart: firstPart, rest: remainingText };
  };
  var handleSavePrompt = function (e) {
    return __awaiter(_this, void 0, void 0, function () {
      var useFlux, imageData, endpointUrl_1, fluxError_1, endpointUrl, response, data, e_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            e.preventDefault();
            if (remainingGenerations <= 0) {
              setLimitReached(true);
              return [2 /*return*/];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 12, , 13]);
            setSubmited(true);
            useFlux = true;
            if (!(useFlux && (profile === null || profile === void 0 ? void 0 : profile.token)))
              return [3 /*break*/, 7];
            _a.label = 2;
          case 2:
            _a.trys.push([2, 6, , 7]);
            return [
              4 /*yield*/,
              imageApi.generateImage(
                {
                  prompt: prompt,
                  model: 'flux-pro', // Use Flux Pro for best quality
                  style: 'photorealistic',
                  aspect_ratio: '1:1', // Instagram square
                  negative_prompt: 'blurry, low quality, distorted',
                  enhance_prompt: true, // Enable prompt enhancement
                },
                profile.token
              ),
            ];
          case 3:
            imageData = _a.sent();
            if (!imageData.image_url) return [3 /*break*/, 5];
            endpointUrl_1 = getServiceURL('content-gen');
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl_1, '/api/v1/image_prompt'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(profile.token),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  week_num: week,
                  day_num: day,
                  post_num: post + 1,
                  content_id: content_id,
                  image_prompt: prompt,
                  image_url: imageData.image_url, // Include new image URL
                }),
              }),
            ];
          case 4:
            _a.sent();
            setSubmited(false);
            regenerate(imageData.image_url); // Pass new image URL
            setOpen(false);
            return [2 /*return*/];
          case 5:
            return [3 /*break*/, 7];
          case 6:
            fluxError_1 = _a.sent();
            console.error('Flux generation failed, falling back to legacy:', fluxError_1);
            return [3 /*break*/, 7];
          case 7:
            endpointUrl = getServiceURL('content-gen');
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/image_prompt'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(
                    (profile === null || profile === void 0 ? void 0 : profile.token) || ''
                  ),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  week_num: week,
                  day_num: day,
                  post_num: post + 1,
                  content_id: content_id,
                  image_prompt: prompt,
                }),
              }),
            ];
          case 8:
            response = _a.sent();
            if (response.ok) return [3 /*break*/, 10];
            return [4 /*yield*/, response.json()];
          case 9:
            data = _a.sent();
            throw new Error(
              (data === null || data === void 0 ? void 0 : data.detail) || 'Failed to update prompt'
            );
          case 10:
            return [4 /*yield*/, response.json()];
          case 11:
            _a.sent();
            setSubmited(false);
            // Pass the prompt directly to regenerate
            regenerate(prompt);
            setOpen(false);
            return [3 /*break*/, 13];
          case 12:
            e_1 = _a.sent();
            console.error('Error:', e_1);
            setSubmited(false);
            return [3 /*break*/, 13];
          case 13:
            return [2 /*return*/];
        }
      });
    });
  };
  var getImagePrompt = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var endpointUrl, params, response, cookies, prompt_1, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(profile === null || profile === void 0 ? void 0 : profile.token)) {
              console.warn('No authentication token available');
              return [2 /*return*/];
            }
            endpointUrl = getServiceURL('content-gen');
            params = new URLSearchParams();
            params.append('week_num', week.toString());
            params.append('day_num', day.toString());
            params.append('post_num', (post + 1).toString());
            params.append('content_id', content_id);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [
              4 /*yield*/,
              fetch(endpointUrl + '/api/v1/image_prompt?'.concat(params.toString()), {
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                },
              }),
            ];
          case 2:
            response = _a.sent();
            if (!response.ok) {
              if (response.status === 401) {
                console.warn('Authentication failed - token may be invalid or expired');
                cookies = new Cookies();
                cookies.remove('access_token');
                window.location.href = '/login';
                return [2 /*return*/];
              }
              throw new Error('HTTP error! status: '.concat(response.status));
            }
            return [4 /*yield*/, response.json()];
          case 3:
            prompt_1 = _a.sent().prompt;
            setPrompt(prompt_1);
            return [3 /*break*/, 5];
          case 4:
            error_1 = _a.sent();
            console.error('Error fetching image prompt:', error_1);
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  useEffect(
    function () {
      getImagePrompt();
    },
    [profile]
  );
  var fetchRemainingGenerations = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var endpointUrl, params, response, data, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 4, , 5]);
            endpointUrl = getServiceURL('content-gen');
            params = new URLSearchParams();
            params.append('week_num', week.toString());
            params.append('day_num', day.toString());
            params.append('post_num', (post + 1).toString());
            params.append('content_id', content_id);
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(endpointUrl, '/api/v1/contentgen/remaining_generations?')
                  .concat(params.toString()),
                {
                  headers: {
                    Authorization: 'Bearer '.concat(
                      profile === null || profile === void 0 ? void 0 : profile.token
                    ),
                  },
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) return [3 /*break*/, 3];
            return [4 /*yield*/, response.json()];
          case 2:
            data = _a.sent();
            setRemainingGenerations(data.remaining);
            _a.label = 3;
          case 3:
            return [3 /*break*/, 5];
          case 4:
            error_2 = _a.sent();
            console.error('Error fetching remaining generations:', error_2);
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  useEffect(function () {
    fetchRemainingGenerations();
  });
  return _jsxs(_Fragment, {
    children: [
      _jsx(Dialog, {
        className: 'min-w-3xl border border-red-600',
        open: open,
        onClose: function () {
          return setOpen(false);
        },
        maxWidth: 'sm',
        fullWidth: true,
        children: _jsxs(DialogContent, {
          children: [
            _jsxs('div', {
              className: 'text-center mb-2',
              children: [
                _jsx('h1', {
                  className:
                    'text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2',
                  children: 'Regenerate Your Image',
                }),
                _jsx('p', {
                  className: 'text-gray-700 font-bold text-md',
                  children: "Let's regenerate your image together.",
                }),
              ],
            }),
            _jsx('div', {
              className: 'mb-4',
              children: _jsx('img', {
                src: image,
                className: 'w-full h-64 object-cover object-top rounded-md',
              }),
            }),
            _jsxs('div', {
              className: 'mb-4',
              children: [
                _jsx('h2', {
                  className: 'text-lg font-semibold text-purple-600 ',
                  children: 'What change would you like to see in your image?',
                }),
                _jsx('p', {
                  className: 'text-gray-600 text-sm mb-3',
                  children: 'Be as direct as possible.',
                }),
                _jsxs('form', {
                  onSubmit: handleSavePrompt,
                  className: 'w-full',
                  role: 'form',
                  children: [
                    _jsx(StyledTextField, {
                      fullWidth: true,
                      multiline: true,
                      rows: 3,
                      value: splitPrompt(prompt).firstPart,
                      onChange: function (e) {
                        var rest = splitPrompt(prompt).rest;
                        // Don't automatically add prefix - let the campaign data drive the prompt
                        setPrompt(''.concat(e.target.value).concat(rest));
                      },
                      sx: { mb: 2 },
                    }),
                    _jsxs('div', {
                      className: 'flex gap-3 justify-center pt-4',
                      children: [
                        _jsx(CancelButton, {
                          type: 'button',
                          onClick: function () {
                            return setOpen(false);
                          },
                          children: 'Cancel',
                        }),
                        _jsx(PurpleButton, {
                          type: 'submit',
                          disabled: submited || remainingGenerations <= 0,
                          children: submited
                            ? _jsx('span', {
                                className: 'flex items-center gap-2',
                                children: 'Regenerating',
                              })
                            : _jsxs('span', {
                                className: 'flex items-center gap-2',
                                children: [
                                  'Regenerate',
                                  _jsx('span', {
                                    className:
                                      'absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center',
                                    children: remainingGenerations,
                                  }),
                                  _jsx(PiArrowsClockwiseBold, { size: 16 }),
                                ],
                              }),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            _jsxs('div', {
              className: 'text-center text-sm text-gray-500',
              children: [
                remainingGenerations,
                ' ',
                remainingGenerations > 1 ? 'Regenerations' : 'Regenration',
                ' left for this post',
              ],
            }),
          ],
        }),
      }),
      _jsx(Dialog, {
        open: limitReached,
        onClose: function () {
          return setLimitReached(false);
        },
        maxWidth: 'sm',
        fullWidth: true,
        children: _jsxs(DialogContent, {
          className: 'relative',
          children: [
            _jsx('button', {
              className: 'absolute z-50 right-4 text-gray-500 hover:text-gray-700',
              onClick: function () {
                return setLimitReached(false);
              },
              'aria-label': 'Close',
              children: _jsx(MdClose, { size: 20 }),
            }),
            _jsxs('div', {
              className: 'relative text-center',
              children: [
                _jsx('h2', {
                  className: 'text-xl font-bold text-purple-600 mb-4',
                  children: 'Regeneration Limit Reached',
                }),
                _jsxs('p', {
                  className: 'text-gray-700 mb-6',
                  children: [
                    "You've hit your regeneration limit for this content. We'll keep you posted when Matchpoint Unlimited\u2014with more regenerations\u2014is ready for you.",
                    ' ',
                  ],
                }),
                _jsx('div', {
                  className: 'flex flex-col gap-3',
                  children: _jsx(PurpleButton, {
                    onClick: function () {
                      setLimitReached(false);
                      setOpen(false);
                    },
                    children: 'Keep Current Image',
                  }),
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
//# sourceMappingURL=ModifyPrompt.js.map
