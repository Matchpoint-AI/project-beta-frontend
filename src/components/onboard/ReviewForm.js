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
import { useContext, useEffect, useState } from 'react';
import { BrandContext } from '../../context/BrandContext';
import BackButton from '../../shared/components/buttons/BackButton';
import { getServiceURL } from '../../helpers/getServiceURL';
import { CircularProgress } from '@mui/material';
import FormsContainer from '../shared/FormsContainer';
import BrandDetailsReview from '../BrandDetailsReview';
var ReviewForm = function (_a) {
  var _b, _c, _d;
  var setFormStep = _a.setFormStep,
    handleBack = _a.handleBack,
    handleSave = _a.handleSave,
    saving = _a.saving;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var _e = useContext(BrandContext),
    businessInfo = _e.businessInfo,
    setBusinessInfo = _e.setBusinessInfo;
  var _f = useState(''),
    logo = _f[0],
    setLogo = _f[1];
  var _g = useState(''),
    summary = _g[0],
    setSummary = _g[1];
  var _h = useState(0),
    setRunValidation = _h[1];
  var getSummary = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var url;
      var _a, _b, _c, _d, _e, _f;
      return __generator(this, function (_g) {
        url = ''.concat(getServiceURL('llm'), '/api/v1/llm/openai');
        if (
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.summary) !==
          undefined
        ) {
          setSummary(
            businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.summary
          );
          return [2 /*return*/];
        }
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: 'Using the data for '
              .concat(
                businessInfo.name,
                ", please create a brand summary that:\n               1. Highlights the brand's mission, vision, and values\n               2. Describes the brand tone and voice\n               3. Outlines the brand persona and style\n               4. Summarizes the industry and vertical\n               5. Is 60 words or less\n               6. Summarizes the industry the business operates within and the goals of the business\n               7. Summary of products or services the business provides\n               8. Describes the general target consumer\n               9. Describes general brand style and personality\n               10. Does not include: Brand colors, List of services, Location of business\n\n               Use this data:\n               Brand Details: "
              )
              .concat(
                JSON.stringify(
                  __assign(__assign({}, businessInfo), {
                    values:
                      (_a = businessInfo.values) === null || _a === void 0
                        ? void 0
                        : _a
                            .filter(function (t) {
                              return t === null || t === void 0 ? void 0 : t.selected;
                            })
                            .map(function (t) {
                              return t.label;
                            }),
                    persona:
                      (_b = businessInfo.persona) === null || _b === void 0
                        ? void 0
                        : _b
                            .filter(function (t) {
                              return t === null || t === void 0 ? void 0 : t.selected;
                            })
                            .map(function (t) {
                              return t.label;
                            }),
                    toneAndVoice:
                      (_c = businessInfo.toneAndVoice) === null || _c === void 0
                        ? void 0
                        : _c
                            .filter(function (t) {
                              return t === null || t === void 0 ? void 0 : t.selected;
                            })
                            .map(function (t) {
                              return t.label;
                            }),
                  })
                ),
                '\n\n               Format the response as a single cohesive summary paragraph following this example style:\n               "'
              )
              .concat(businessInfo.name, ' is committed to ')
              .concat(businessInfo.mission, ', envisioning a future where ')
              .concat(businessInfo.vision, '. Operating in the ')
              .concat(businessInfo.industry, ' industry, the brand emphasizes ')
              .concat(
                (_d = businessInfo.values) === null || _d === void 0
                  ? void 0
                  : _d
                      .filter(function (t) {
                        return t === null || t === void 0 ? void 0 : t.selected;
                      })
                      .map(function (t) {
                        return t.label;
                      }),
                ' and communicates with a '
              )
              .concat(
                (_e = businessInfo.toneAndVoice) === null || _e === void 0
                  ? void 0
                  : _e
                      .filter(function (t) {
                        return t === null || t === void 0 ? void 0 : t.selected;
                      })
                      .map(function (t) {
                        return t.label;
                      }),
                ' voice. Known for its '
              )
              .concat(businessInfo.style, ', it embodies a ')
              .concat(
                (_f = businessInfo.persona) === null || _f === void 0
                  ? void 0
                  : _f
                      .filter(function (t) {
                        return t === null || t === void 0 ? void 0 : t.selected;
                      })
                      .map(function (t) {
                        return t.label;
                      }),
                ' persona, effectively serving the '
              )
              .concat(businessInfo.vertical, ' vertical."'),
          }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            var choices = data.response.choices;
            var content = choices[0].message.content;
            setSummary(content);
            setBusinessInfo(__assign(__assign({}, businessInfo), { summary: content }));
          })
          .catch(function (error) {
            console.error('Error:', error);
          });
        return [2 /*return*/];
      });
    });
  };
  var checkSelectedTickets = function () {
    var _a, _b, _c;
    var brandData = ['values', 'persona', 'toneAndVoice'];
    for (var i = 0; i < brandData.length; i++) {
      var selectedData =
        brandData[i] === 'values'
          ? (_a = businessInfo.values) === null || _a === void 0
            ? void 0
            : _a.filter(function (ticket) {
                return ticket === null || ticket === void 0 ? void 0 : ticket.selected;
              })
          : brandData[i] === 'persona'
            ? (_b = businessInfo.persona) === null || _b === void 0
              ? void 0
              : _b.filter(function (ticket) {
                  return ticket === null || ticket === void 0 ? void 0 : ticket.selected;
                })
            : (_c = businessInfo.toneAndVoice) === null || _c === void 0
              ? void 0
              : _c.filter(function (ticket) {
                  return ticket === null || ticket === void 0 ? void 0 : ticket.selected;
                });
      if ((selectedData === null || selectedData === void 0 ? void 0 : selectedData.length) === 0)
        return false;
    }
    return true;
  };
  var loadBrandImage = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var fileReader;
      return __generator(this, function (_a) {
        fileReader = new FileReader();
        fileReader.onload = function () {
          setLogo(fileReader.result);
        };
        if (
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo) &&
          typeof (businessInfo === null || businessInfo === void 0
            ? void 0
            : businessInfo.brandLogo) !== 'string'
        ) {
          fileReader.readAsDataURL(
            businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo
          );
        } else if (
          typeof (businessInfo === null || businessInfo === void 0
            ? void 0
            : businessInfo.brandLogo) === 'string' &&
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo) !==
            ''
        ) {
          setLogo(
            businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo
          );
        } else if (
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo) !==
            undefined &&
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo) !== ''
        ) {
          setLogo(
            'https://storage.googleapis.com/matchpoint-brands-logos/'.concat(
              businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo
            )
          );
        }
        return [2 /*return*/];
      });
    });
  };
  var handleSubmit = function (e) {
    e.preventDefault();
    if (checkSelectedTickets()) {
      handleSave();
    } else
      setRunValidation(function (prev) {
        return prev + 1;
      });
  };
  useEffect(function () {
    getSummary();
    loadBrandImage();
  });
  return _jsxs(_Fragment, {
    children: [
      _jsx(FormsContainer, {
        children: _jsxs('form', {
          onSubmit: handleSubmit,
          id: 'review_form',
          children: [
            _jsx('p', {
              className: 'text-xl text-[#111928] font-semibold mb-5',
              children: "Here's what Matchpoint knows about your business:",
            }),
            logo !== '' &&
              _jsxs('div', {
                className: 'mb-5',
                children: [
                  _jsxs('div', {
                    className: 'mb-5 flex items-center gap-3',
                    children: [
                      _jsx('label', {
                        title: 'logo',
                        className: 'block text-base font-medium text-gray-900',
                        children: 'Logo',
                      }),
                      _jsx('button', {
                        onClick: function () {
                          return setFormStep(2);
                        },
                        children: _jsx('img', {
                          src: '/edit-outline.svg',
                          alt: 'brand',
                          className: 'w-4 h-4',
                        }),
                      }),
                    ],
                  }),
                  _jsx('img', { src: logo, alt: 'logo', className: 'w-[150px] h-auto' }),
                ],
              }),
            logo === '' &&
              _jsxs('div', {
                className: 'mb-5',
                children: [
                  _jsxs('div', {
                    className: 'mb-5 flex items-center gap-3',
                    children: [
                      _jsx('label', {
                        title: 'logo',
                        className: 'block text-base font-medium text-gray-900',
                        children: 'Brand Name',
                      }),
                      _jsx('button', {
                        onClick: function () {
                          return setFormStep(1);
                        },
                        children: _jsx('img', {
                          src: '/edit-outline.svg',
                          alt: 'brand',
                          className: 'w-4 h-4',
                        }),
                      }),
                    ],
                  }),
                  _jsx('h2', {
                    className: 'text-lg capitalize text-[#111928]',
                    children: businessInfo.name,
                  }),
                ],
              }),
            ((_c =
              (_b =
                businessInfo === null || businessInfo === void 0
                  ? void 0
                  : businessInfo.brandColors) === null || _b === void 0
                ? void 0
                : _b.length) !== null && _c !== void 0
              ? _c
              : 0) > 0 &&
              _jsxs('div', {
                className: 'mb-5',
                children: [
                  _jsxs('div', {
                    className: 'mb-5 flex items-center gap-3',
                    children: [
                      _jsx('label', {
                        className: 'block text-base font-medium text-gray-900',
                        children: 'Brand Colors',
                      }),
                      _jsx('button', {
                        onClick: function () {
                          return setFormStep(2);
                        },
                        children: _jsx('img', {
                          src: '/edit-outline.svg',
                          alt: 'brand',
                          className: 'w-4 h-4',
                        }),
                      }),
                    ],
                  }),
                  _jsx('div', {
                    className: 'gap-3 overflow-x-auto whitespace-nowrap',
                    children:
                      (_d =
                        businessInfo === null || businessInfo === void 0
                          ? void 0
                          : businessInfo.brandColors) === null || _d === void 0
                        ? void 0
                        : _d.map(function (color, index) {
                            return _jsx(
                              'div',
                              {
                                className: 'w-10 h-10 rounded-full inline-block mr-2 shadow-md',
                                style: { backgroundColor: color },
                              },
                              index
                            );
                          }),
                  }),
                ],
              }),
            _jsxs('div', {
              children: [
                _jsx('label', {
                  title: 'logo',
                  className: 'block text-base font-medium text-gray-900',
                  children: 'Business and Brand Summary',
                }),
                _jsx('div', {
                  className: 'bg-[#EBF5FF] p-4 my-5 rounded-md',
                  children: _jsxs('p', {
                    children: [
                      summary && _jsx(_Fragment, { children: summary }),
                      !summary &&
                        _jsx(_Fragment, {
                          children: 'Brand industry & vertical information is being fetched...',
                        }),
                    ],
                  }),
                }),
              ],
            }),
            _jsx(BrandDetailsReview, { stepHandler: setFormStep }),
          ],
        }),
      }),
      _jsxs('div', {
        className: 'flex justify-between mb-10 w-full',
        children: [
          _jsx(BackButton, { onClick: handleBack }),
          _jsx('button', {
            className:
              'bg-[#5145CD] hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold mb-0 ml-auto md:w-auto w-full flex items-center justify-center disabled:cursor-not-allowed',
            disabled: saving,
            form: 'review_form',
            children: saving
              ? _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 })
              : 'Save Profile and Start Campaign',
          }),
        ],
      }),
    ],
  });
};
export default ReviewForm;
//# sourceMappingURL=ReviewForm.js.map
