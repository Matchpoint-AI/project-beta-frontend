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
import React, { useState, useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { CircularProgress } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers/icons';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useAuth } from '../../../features/auth/context/AuthContext';
var Transition = React.forwardRef(function Transition(props, ref) {
  return _jsx(Slide, __assign({ direction: 'left', ref: ref }, props));
});
export default function CampaignThreadWin(_a) {
  var _this = this;
  var open = _a.open,
    onClose = _a.onClose,
    messages = _a.messages,
    addMessage = _a.addMessage,
    popMessage = _a.popMessage;
  var _b = useState(''),
    prompt = _b[0],
    setPrompt = _b[1];
  var textareaRef = useRef(null);
  var divRef = useRef(null);
  var profile = useAuth().profile;
  var _c = useState(false),
    loading = _c[0],
    setLoading = _c[1];
  var handleKeyDown = function (e) {
    return __awaiter(_this, void 0, void 0, function () {
      var endpointUrl, response, message;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(e.key === 'Enter' && !e.shiftKey)) return [3 /*break*/, 3];
            endpointUrl = getServiceURL('llm');
            setLoading(true);
            addMessage(prompt);
            setPrompt('');
            return [
              4 /*yield*/,
              fetch(
                ''
                  .concat(endpointUrl, '/api/v1/threads/')
                  .concat(messages === null || messages === void 0 ? void 0 : messages.thread_id),
                {
                  method: 'POST',
                  headers: {
                    Authorization: 'Bearer '.concat(
                      profile === null || profile === void 0 ? void 0 : profile.token
                    ),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    prompt: prompt,
                  }),
                }
              ),
            ];
          case 1:
            response = _a.sent();
            if (!response.ok) {
              setLoading(false);
              popMessage();
              return [2 /*return*/];
            }
            return [4 /*yield*/, response.json()];
          case 2:
            message = _a.sent();
            addMessage(message);
            setLoading(false);
            _a.label = 3;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  useEffect(
    function () {
      var textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = ''.concat(textarea.scrollHeight, 'px');
        if (textarea.scrollHeight < 60) textarea.style.height = '60px';
      }
      if (prompt === '\n') setPrompt('');
    },
    [prompt]
  );
  useEffect(
    function () {
      if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }
    },
    [messages]
  );
  if (!messages) return;
  return _jsx(Dialog, {
    fullScreen: true,
    open: open,
    onClose: onClose,
    TransitionComponent: Transition,
    sx: { zIndex: 10 },
    children: _jsxs('div', {
      className: 'p-7 bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] h-full relative',
      children: [
        _jsxs('div', {
          className: 'px-5 py-3 absolute top-0 left-0 w-full flex items-center justify-between',
          children: [
            _jsxs('p', {
              className: 'font-semibold text-[#111928] text-lg',
              children: [
                'Thread: ',
                _jsx('span', { className: 'font-medium', children: messages.thread_id }),
              ],
            }),
            _jsx('button', {
              type: 'button',
              onClick: onClose,
              children: _jsx(ClearIcon, {
                sx: {
                  color: '#6B7280',
                },
              }),
            }),
          ],
        }),
        _jsxs('div', {
          className: 'flex flex-col items-center h-full w-full max-w-[700px] mx-auto mt-6 pb-4',
          children: [
            _jsxs('div', {
              ref: divRef,
              className: 'flex-grow flex flex-col overflow-y-auto messages-box',
              children: [
                messages.messages.map(function (m, i) {
                  return _jsx(
                    'article',
                    {
                      className:
                        'rounded-lg py-3 px-4 md:max-w-[75%] mb-5 max-w-full shadow-lg '.concat(
                          i % 2 === 0 ? 'ml-auto bg-[#F1FDFF]' : 'mr-auto bg-[#F5D9FF]'
                        ),
                      children: m.startsWith('{"response"') ? JSON.parse(m).response : m,
                    },
                    i
                  );
                }),
                loading &&
                  _jsx(CircularProgress, {
                    sx: { color: '#42389D' },
                    size: 25,
                    thickness: 5,
                    className: 'mx-auto mb-5',
                  }),
              ],
            }),
            _jsx('div', {
              className: ' bg-white px-3 py-3 rounded-2xl w-full flex-grow-0',
              children: _jsx('textarea', {
                value: prompt,
                onChange: function (e) {
                  return setPrompt(e.target.value);
                },
                ref: textareaRef,
                onKeyDown: handleKeyDown,
                className:
                  'w-full text-[#111928] outline-none border-none resize-none min-h-[60px] max-h-[150px]',
                placeholder: 'Enter Prompt',
                rows: 3,
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
//# sourceMappingURL=CampaignThreadWin.js.map
