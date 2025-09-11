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
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { RiErrorWarningLine } from 'react-icons/ri';
import Sidebar from '../components/shared/Sidebar';
import { useAuth } from '../features/auth/context/AuthContext';
import fetchPrompts from '../helpers/fetchPrompts';
import { PromptEditor } from '../features/campaign';
export default function PromptsSettings() {
  var _this = this;
  var _a = useState(null),
    prompts = _a[0],
    setPrompts = _a[1];
  var _b = useState(true),
    loading = _b[0],
    setLoading = _b[1];
  var _c = useState(''),
    error = _c[0],
    setError = _c[1];
  var profile = useAuth().profile;
  var content_gen_args = [
    'campaign_data',
    'frequency',
    'post_structure',
    'campaign_themes',
    'brand_profile',
    'negative_prompts',
  ];
  var scraping_args = ['html_content'];
  var getPrompts = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var app_prompts;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            setLoading(true);
            return [
              4 /*yield*/,
              fetchPrompts((profile === null || profile === void 0 ? void 0 : profile.token) || ''),
            ];
          case 1:
            app_prompts = _a.sent();
            if (app_prompts) setPrompts(app_prompts);
            else setError('error loading prompts');
            setLoading(false);
            return [2 /*return*/];
        }
      });
    });
  };
  var switchPrompts = function (version, target) {
    setPrompts(function (old) {
      var newPrompts = __assign({}, old);
      var promptIndex = version - 1;
      var arrLength = newPrompts[target].length;
      newPrompts[target][promptIndex].version = arrLength;
      newPrompts[target][arrLength - 1].version = version;
      var tmp = newPrompts[target][promptIndex];
      newPrompts[target][promptIndex] = newPrompts[target][arrLength - 1];
      newPrompts[target][arrLength - 1] = tmp;
      return newPrompts;
    });
  };
  var addPrompt = function (prompt, target) {
    var version = prompts[target].length + 1;
    setPrompts(function (old) {
      var newPrompts = __assign({}, old);
      newPrompts[target] = __spreadArray(
        __spreadArray([], newPrompts[target], true),
        [
          {
            prompt: prompt,
            version: version,
          },
        ],
        false
      );
      return newPrompts;
    });
  };
  useEffect(
    function () {
      getPrompts();
    },
    [profile]
  );
  return _jsx('div', {
    className: 'w-full h-full',
    children: _jsxs('div', {
      className:
        'flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]',
      children: [
        _jsx(Sidebar, {}),
        loading &&
          _jsxs('div', {
            className: 'w-full min-h-screen flex flex-col gap-5 justify-center items-center',
            children: [
              _jsx(CircularProgress, { sx: { color: '#42389D' }, size: 80, thickness: 5 }),
              _jsx('h1', {
                className: 'text-2xl font-semibold leading-9 text-gradient',
                children: 'Fetching Prompts',
              }),
            ],
          }),
        !loading &&
          error &&
          _jsxs('div', {
            className: 'w-full min-h-screen flex flex-col gap-5 justify-center items-center',
            children: [
              _jsx(RiErrorWarningLine, { size: 64, color: '#F05252' }),
              _jsx('h1', {
                className:
                  'font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]',
                children: 'Unexpected Error',
              }),
              _jsxs('p', {
                className: 'text-[#30175A] md:text-lg text-base text-center max-w-[600px]',
                children: [
                  'Sorry, unexpected error happend while fetching prompts',
                  _jsx('br', {}),
                  'Please retry.',
                ],
              }),
              _jsx('button', {
                className:
                  'flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5',
                onClick: function () {
                  return getPrompts();
                },
                children: 'Retry',
              }),
            ],
          }),
        !loading &&
          !error &&
          _jsxs('div', {
            className: 'md:ml-[80px] flex-grow flex flex-col gap-8 p-8 md:mt-8 mt-[80px]',
            children: [
              (prompts === null || prompts === void 0 ? void 0 : prompts.content_generation) &&
                _jsx(PromptEditor, {
                  promptsArr: prompts.content_generation,
                  placeholders: content_gen_args,
                  target: 'content_generation',
                  switchPrompts: switchPrompts,
                  addPrompts: addPrompt,
                }),
              (prompts === null || prompts === void 0 ? void 0 : prompts.scrape_website) &&
                _jsx(PromptEditor, {
                  promptsArr: prompts.scrape_website,
                  placeholders: scraping_args,
                  target: 'scrape_website',
                  switchPrompts: switchPrompts,
                  addPrompts: addPrompt,
                }),
            ],
          }),
      ],
    }),
  });
}
//# sourceMappingURL=PromptSettings.js.map
