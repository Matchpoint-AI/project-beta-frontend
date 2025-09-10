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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useState, useRef, useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { FaRegEdit } from 'react-icons/fa';
import { LuFileMinus } from 'react-icons/lu';
import { useAuth } from '../features/auth/context/AuthContext';
import { BrandContext } from '../context/BrandContext';
import { getServiceURL } from '../helpers/getServiceURL';
import PurpleButton from '../shared/components/buttons/PurpleButton';
import BrandDetailsInput from '../shared/components/inputs/BrandDetailsInput';
import Sidebar from './shared/Sidebar';
var description = {
  mission: 'The goal you want to achieve as a company',
  values: 'The core beliefs that guide your interactions with customers',
  persona: 'The characteristics that identify who you are and how you behave',
  toneAndVoice: 'How your business speaks and verbally expresses its personality',
  colors: 'Primary brand colors (max 2)',
  summary: 'Brief description of your business',
};
var mergeValues = function (values) {
  var result = [
    { id: 0, label: '', selected: false },
    { id: 1, label: '', selected: false },
    { id: 2, label: '', selected: false },
  ];
  if (values && Array.isArray(values)) {
    values.forEach(function (val, idx) {
      if (idx < 3 && val) {
        result[idx] = __assign(__assign({}, result[idx]), {
          label: val.label || val.name || val,
          selected: !!val.label || !!val.name || !!val,
        });
      }
    });
  }
  return result;
};
export default function BrandProfileEdit(_a) {
  var _this = this;
  var _hasBrand = _a.hasBrand;
  var businessInfo = useContext(BrandContext).businessInfo;
  var _b = useState(''),
    selected = _b[0],
    setSelected = _b[1];
  var _c = useState(businessInfo.mission || ''),
    pMission = _c[0],
    setMission = _c[1];
  var _d = useState(function () {
      return mergeValues(businessInfo.values || []);
    }),
    pValues = _d[0],
    setValues = _d[1];
  var _e = useState(function () {
      return mergeValues(businessInfo.persona || []);
    }),
    pPersona = _e[0],
    setPersona = _e[1];
  var _f = useState(function () {
      return mergeValues(businessInfo.toneAndVoice || []);
    }),
    pTov = _f[0],
    setTOV = _f[1];
  var _g = useState(businessInfo.brandColors || []),
    pColors = _g[0],
    setColors = _g[1];
  var _h = useState(businessInfo.summary || ''),
    pSummary = _h[0],
    setSummary = _h[1];
  var _j = useState(false),
    isSaving = _j[0],
    setIsSaving = _j[1];
  var endpointUrl = getServiceURL('data');
  var profile = useAuth().profile;
  var handleSave = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var response, result, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 3, 4, 5]);
            setIsSaving(true);
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/data/brand/update-profile'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '.concat(profile.token),
                },
                body: JSON.stringify({
                  mission: pMission,
                  values: pValues,
                  persona: pPersona,
                  toneAndVoice: pTov,
                  colors: pColors,
                  summary: pSummary,
                }),
              }),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              throw new Error('HTTP error! status: '.concat(response.status));
            }
            return [4 /*yield*/, response.json()];
          case 2:
            result = _a.sent();
            if (result.success) {
              setMission(result.updatedFields.mission);
              setValues(mergeValues(result.updatedFields.values));
              setPersona(mergeValues(result.updatedFields.persona));
              setTOV(mergeValues(result.updatedFields.toneAndVoice));
              setColors(result.updatedFields.colors || []);
              setSummary(result.updatedFields.summary || '');
              setSelected('');
            }
            return [3 /*break*/, 5];
          case 3:
            error_1 = _a.sent();
            console.error('Update failed:', error_1);
            return [3 /*break*/, 5];
          case 4:
            setIsSaving(false);
            return [7 /*endfinally*/];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  var handleCardSelect = function (cardType) {
    setSelected(selected === cardType ? '' : cardType);
  };
  return _jsxs('div', {
    className: 'flex h-full flex-col max-w-2xl mx-auto gap-2 md:mt-auto mt-16',
    children: [
      _jsx(Sidebar, { currentStep: 0 }),
      _jsxs('div', {
        className: 'w-full bg-white rounded-xl p-5 md:p-10 my-5',
        children: [
          _jsx('div', {
            className: 'flex flex-col gap-4',
            children: _jsx('p', {
              className: 'text-xl text-[#111928] font-semibold mb-5',
              children: "Here's what Matchpoint knows about your business:",
            }),
          }),
          (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.logo) &&
            _jsxs('div', {
              className: 'mb-5',
              children: [
                _jsx('div', {
                  className: 'mb-5 flex items-center gap-3',
                  children: _jsx('label', {
                    className: 'block text-base font-medium text-gray-900',
                    children: 'Logo',
                  }),
                }),
                _jsx('img', {
                  src: 'https://storage.googleapis.com/matchpoint-brands-logos/'.concat(
                    businessInfo.logo
                  ),
                  alt: 'logo',
                  className: 'w-[150px] h-auto',
                }),
              ],
            }),
          _jsx(DetailsCard, {
            title: 'Brand Colors',
            description: description.colors,
            onClick: function () {
              return handleCardSelect('COLORS');
            },
            isSelected: selected === 'COLORS',
            children:
              selected === 'COLORS'
                ? _jsxs('div', {
                    className: 'mt-5',
                    children: [
                      _jsx('div', {
                        className: 'flex gap-3 mb-4',
                        children: [0, 1].map(function (index) {
                          return _jsxs(
                            'div',
                            {
                              className: 'flex flex-col items-center',
                              children: [
                                _jsx('input', {
                                  type: 'color',
                                  value: pColors[index] || '#ffffff',
                                  onChange: function (e) {
                                    var newColors = __spreadArray([], pColors, true);
                                    newColors[index] = e.target.value;
                                    setColors(newColors);
                                  },
                                  className: 'w-12 h-12 cursor-pointer',
                                }),
                                _jsxs('span', {
                                  className: 'text-xs mt-1',
                                  children: ['Color ', index + 1],
                                }),
                              ],
                            },
                            index
                          );
                        }),
                      }),
                      _jsx(PurpleButton, {
                        onClick: handleSave,
                        disabled: isSaving,
                        children: isSaving ? 'Saving...' : 'Save Colors',
                      }),
                    ],
                  })
                : _jsx('div', {
                    className: 'flex gap-2',
                    children: pColors.map(function (color, index) {
                      return _jsx(
                        'div',
                        {
                          className: 'w-8 h-8 rounded-full shadow-md',
                          style: { backgroundColor: color },
                        },
                        index
                      );
                    }),
                  }),
          }),
          _jsx(DetailsCard, {
            title: 'Business Summary',
            description: description.summary,
            onClick: function () {
              return handleCardSelect('SUMMARY');
            },
            isSelected: selected === 'SUMMARY',
            children:
              selected === 'SUMMARY'
                ? _jsxs('div', {
                    className: 'mt-5',
                    children: [
                      _jsx('textarea', {
                        value: pSummary,
                        onChange: function (e) {
                          return setSummary(e.target.value);
                        },
                        className: 'w-full p-2 border rounded-md',
                        rows: 4,
                      }),
                      _jsx(PurpleButton, {
                        className: 'mt-4',
                        onClick: handleSave,
                        disabled: isSaving,
                        children: isSaving ? 'Saving...' : 'Save Summary',
                      }),
                    ],
                  })
                : _jsx('p', { className: 'whitespace-pre-line', children: pSummary }),
          }),
          _jsx(DetailsCard, {
            title: 'Mission',
            description: description.mission,
            onClick: function () {
              return handleCardSelect('MISSION');
            },
            isSelected: selected === 'MISSION',
            children:
              selected === 'MISSION'
                ? _jsxs('div', {
                    className: 'mt-5',
                    children: [
                      _jsx(BrandDetailsInput, {
                        placeholder: 'Mission',
                        value: pMission,
                        onChange: function (e) {
                          return setMission(e.target.value);
                        },
                      }),
                      _jsx(PurpleButton, {
                        className: 'mt-4',
                        onClick: handleSave,
                        disabled: isSaving,
                        children: isSaving ? 'Saving...' : 'Save Mission',
                      }),
                    ],
                  })
                : _jsx('p', { children: pMission }),
          }),
          _jsx(DetailsCard, {
            title: 'Values',
            description: description.values,
            onClick: function () {
              return handleCardSelect('VALUES');
            },
            isSelected: selected === 'VALUES',
            children: _jsx('div', {
              className: 'flex flex-wrap gap-3',
              children:
                selected === 'VALUES'
                  ? _jsx(EditableValuesCard, {
                      values: pValues,
                      onChange: setValues,
                      onSave: handleSave,
                      isSaving: isSaving,
                    })
                  : _jsx(VariablesBadge, { values: pValues }),
            }),
          }),
          _jsx(DetailsCard, {
            title: 'Persona',
            description: description.persona,
            onClick: function () {
              return handleCardSelect('PERSONA');
            },
            isSelected: selected === 'PERSONA',
            children: _jsx('div', {
              className: 'flex flex-wrap gap-3',
              children:
                selected === 'PERSONA'
                  ? _jsx(EditableValuesCard, {
                      values: pPersona,
                      onChange: setPersona,
                      onSave: handleSave,
                      isSaving: isSaving,
                    })
                  : _jsx(VariablesBadge, { values: pPersona }),
            }),
          }),
          _jsx(DetailsCard, {
            title: 'Tone of Voice',
            description: description.toneAndVoice,
            onClick: function () {
              return handleCardSelect('TOV');
            },
            isSelected: selected === 'TOV',
            children: _jsx('div', {
              className: 'flex flex-wrap gap-3',
              children:
                selected === 'TOV'
                  ? _jsx(EditableValuesCard, {
                      values: pTov,
                      onChange: setTOV,
                      onSave: handleSave,
                      isSaving: isSaving,
                    })
                  : _jsx(VariablesBadge, { values: pTov }),
            }),
          }),
        ],
      }),
    ],
  });
}
function DetailsCard(_a) {
  var title = _a.title,
    description = _a.description,
    children = _a.children,
    onClick = _a.onClick,
    isSelected = _a.isSelected;
  var cardRef = useRef(null);
  useEffect(
    function () {
      var handleClickOutside = function (event) {
        if (isSelected && cardRef.current && !cardRef.current.contains(event.target)) {
          onClick(); // This will close the card
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return function () {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [isSelected, onClick]
  );
  return _jsxs('div', {
    ref: cardRef,
    className: 'p-5 mb-[14px] rounded-md w-full bg-[#F6F5FF] border border-[#D1D5DB]',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsx('h1', {
            className: 'capitalize text-[#42389D] font-medium text-lg leading-7 mb-1',
            children: title,
          }),
          _jsx(ButtonBase, {
            onClick: onClick,
            children: _jsx(FaRegEdit, { color: '#3F83F8', size: 16 }),
          }),
        ],
      }),
      _jsx('p', { className: 'text-[#111928] font-medium text-xs mb-5', children: description }),
      children,
    ],
  });
}
function VariablesBadge(_a) {
  var values = _a.values;
  return _jsx(_Fragment, {
    children: values.map(function (c) {
      return c.label.length
        ? _jsx(
            'div',
            {
              className:
                'py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md',
              children: c.label,
            },
            c.id
          )
        : null;
    }),
  });
}
function EditableValuesCard(_a) {
  var values = _a.values,
    onChange = _a.onChange,
    onSave = _a.onSave,
    isSaving = _a.isSaving;
  var handleChange = function (index, newValue) {
    var updated = values.map(function (item, i) {
      return i === index ? __assign(__assign({}, item), { label: newValue }) : __assign({}, item);
    });
    onChange(updated);
  };
  var handleRemove = function (index) {
    var updated = values.map(function (item, i) {
      return i === index
        ? __assign(__assign({}, item), { label: '', selected: false })
        : __assign({}, item);
    });
    onChange(updated);
  };
  return _jsxs('div', {
    className: 'w-full',
    children: [
      _jsx('div', {
        className: 'space-y-3',
        children: __spreadArray([], Array(3), true).map(function (_, index) {
          var _a;
          return _jsxs(
            'div',
            {
              className: 'flex items-center gap-2 w-full',
              children: [
                _jsx('input', {
                  type: 'text',
                  value: values[index] ? values[index].label : '',
                  onChange: function (e) {
                    return handleChange(index, e.target.value);
                  },
                  className:
                    'flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
                }),
                _jsx('button', {
                  onClick: function () {
                    return handleRemove(index);
                  },
                  className: 'text-purple-600 hover:text-purple-800',
                  disabled: !((_a = values[index]) === null || _a === void 0 ? void 0 : _a.label),
                  children: _jsx(LuFileMinus, { size: 18 }),
                }),
              ],
            },
            index
          );
        }),
      }),
      _jsx(PurpleButton, {
        className: 'mt-5',
        onClick: onSave,
        disabled: isSaving,
        children: isSaving ? 'Saving...' : 'Save',
      }),
    ],
  });
}
//# sourceMappingURL=BrandProfileEdit.js.map
