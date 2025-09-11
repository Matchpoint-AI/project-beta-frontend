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
import { useEffect, useState } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
import { getServiceURL } from '../../../helpers/getServiceURL';
export default function ModifyPromptForm(props) {
  var _this = this;
  var _a = useState(''),
    prompt = _a[0],
    setPrompt = _a[1];
  var _b = useState(false),
    submited = _b[0],
    setSubmited = _b[1];
  var profile = useAuth().profile;
  var handleSavePrompt = function (e) {
    return __awaiter(_this, void 0, void 0, function () {
      var endpointUrl, e_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            e.preventDefault();
            endpointUrl = getServiceURL('content-gen');
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            setSubmited(true);
            return [
              4 /*yield*/,
              fetch(''.concat(endpointUrl, '/api/v1/image_prompt'), {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer '.concat(
                    profile === null || profile === void 0 ? void 0 : profile.token
                  ),
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  week_num: props === null || props === void 0 ? void 0 : props.week,
                  day_num: props === null || props === void 0 ? void 0 : props.day,
                  post_num: (props === null || props === void 0 ? void 0 : props.post) + 1,
                  content_id: props === null || props === void 0 ? void 0 : props.content_id,
                  image_prompt: prompt,
                }),
              }),
            ];
          case 2:
            _a.sent();
            setSubmited(false);
            return [3 /*break*/, 4];
          case 3:
            e_1 = _a.sent();
            setSubmited(false);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  var getImagePrompt = function () {
    return __awaiter(_this, void 0, void 0, function () {
      var endpointUrl, params, response, prompt_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            endpointUrl = getServiceURL('content-gen');
            params = new URLSearchParams({
              week_num: props === null || props === void 0 ? void 0 : props.week.toString(),
              day_num: props === null || props === void 0 ? void 0 : props.day.toString(),
              post_num: ((props === null || props === void 0 ? void 0 : props.post) + 1).toString(),
              content_id: props === null || props === void 0 ? void 0 : props.content_id,
            });
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
          case 1:
            response = _a.sent();
            if (!response.ok) return [3 /*break*/, 3];
            return [4 /*yield*/, response.json()];
          case 2:
            prompt_1 = _a.sent().prompt;
            setPrompt(prompt_1);
            _a.label = 3;
          case 3:
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
  return _jsx(Dialog, {
    open: props.open,
    onClose: function () {
      return props.setOpen(false);
    },
    maxWidth: 'sm',
    fullWidth: true,
    children: _jsxs(DialogContent, {
      children: [
        _jsx('h1', { className: 'text-xl font-medium ', children: 'Image Prompt' }),
        _jsx('p', {
          className: 'text-sm mt-2 mb-4',
          children: 'below is the prompt used to generate images for your post',
        }),
        _jsxs('form', {
          onSubmit: handleSavePrompt,
          children: [
            _jsx('textarea', {
              className:
                'w-full aspect-video p-3 outline-none border text-gray-900 rounded-md bg-gray-50',
              name: 'prompt',
              value: prompt,
              onChange: function (e) {
                return setPrompt(e.target.value);
              },
              style: { resize: 'none' },
            }),
            _jsx(PurpleButton, {
              type: 'submit',
              className: 'mt-2 capitalize',
              children: submited
                ? _jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 })
                : 'save prompt',
            }),
          ],
        }),
      ],
    }),
  });
}
//# sourceMappingURL=ModifyPromptForm.js.map
