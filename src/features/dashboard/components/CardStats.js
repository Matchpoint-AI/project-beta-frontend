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
import { useAuth } from '../../auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
var CardStats = function (_a) {
  var id = _a.id;
  var profile = useAuth().profile;
  var _b = useState(0),
    totalContent = _b[0],
    setTotalContent = _b[1];
  var _c = useState(0),
    approved = _c[0],
    setApproved = _c[1];
  var _d = useState(0),
    readyForReview = _d[0],
    setReadyForReview = _d[1];
  var _e = useState(0),
    generating = _e[0],
    setGenerating = _e[1];
  var endpointUrl = getServiceURL('data');
  useEffect(
    function () {
      if (
        (profile === null || profile === void 0 ? void 0 : profile.token) === '' ||
        id === undefined
      )
        return;
      var params = new URLSearchParams({
        query_kind: 'generated_content',
        id: id,
      });
      var fetchSingleWeek = function () {
        return __awaiter(void 0, void 0, void 0, function () {
          var response, data, _a, total_content, approv, ready_for_review, generating_1, _error_1;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                _b.trys.push([0, 3, , 4]);
                return [
                  4 /*yield*/,
                  fetch(endpointUrl + '/api/v1/data/get/complex?'.concat(params.toString()), {
                    method: 'GET',
                    headers: {
                      Authorization: 'Bearer '.concat(
                        profile === null || profile === void 0 ? void 0 : profile.token
                      ),
                    },
                  }),
                ];
              case 1:
                response = _b.sent();
                if (!response.ok) {
                  throw new Error('Failed to fetch data');
                }
                return [4 /*yield*/, response.json()];
              case 2:
                data = _b.sent();
                if (data.length === 0) {
                  return [2 /*return*/];
                }
                ((_a = data[0]),
                  (total_content = _a.total_content),
                  (approv = _a.approved),
                  (ready_for_review = _a.ready_for_review),
                  (generating_1 = _a.generating));
                setTotalContent(total_content);
                setApproved(approv);
                setReadyForReview(ready_for_review);
                setGenerating(generating_1);
                return [3 /*break*/, 4];
              case 3:
                _error_1 = _b.sent();
                return [3 /*break*/, 4];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      fetchSingleWeek();
    },
    [profile, id]
  );
  return _jsxs('div', {
    className: 'flex sm:flex-row flex-col items-start gap-1 w-full',
    children: [
      _jsxs('div', {
        className: 'flex flex-row gap-1 lg:gap-1',
        children: [
          totalContent !== 0 &&
            _jsxs('div', {
              className: 'text-center flex justify-center gap-3',
              children: [
                _jsx('p', {
                  className: 'text-[#6B7280] font-semibold text-xs',
                  children: 'Total Content',
                }),
                _jsx('p', {
                  className:
                    'text-xs font-bold bg-[#E1EFFE] text-[#1E429F] w-10 h-5 rounded-md flex items-center justify-center',
                  children: totalContent,
                }),
              ],
            }),
          approved !== 0 &&
            _jsxs('div', {
              className: 'text-center flex justify-center gap-3',
              children: [
                _jsx('p', {
                  className: 'text-[#6B7280] font-semibold text-xs',
                  children: 'Approved',
                }),
                _jsx('p', {
                  className:
                    'text-xs font-bold bg-[#DEF7EC] text-[#03543F] w-10 h-5 rounded-md flex items-center justify-center',
                  children: approved,
                }),
              ],
            }),
        ],
      }),
      _jsxs('div', {
        className: 'flex flex-row gap-1 lg:gap-1',
        children: [
          readyForReview !== 0 &&
            _jsxs('div', {
              className: 'text-center flex justify-center gap-3',
              children: [
                _jsx('p', {
                  className: 'text-[#6B7280] font-semibold text-xs',
                  children: 'Ready For Review',
                }),
                _jsx('p', {
                  className:
                    'text-xs font-bold bg-[#FDF6B2] text-[#8E4B10] w-10 h-5 rounded-md flex items-center justify-center',
                  children: readyForReview,
                }),
              ],
            }),
          generating !== 0 &&
            _jsxs('div', {
              className: 'text-center flex justify-center gap-3',
              children: [
                _jsx('p', {
                  className: 'text-[#6B7280] font-semibold text-xs',
                  children: 'Generating',
                }),
                _jsx('p', {
                  className:
                    'text-xs font-bold bg-[#FBD5D5] text-[#8E4B10] w-10 h-5 rounded-md flex items-center justify-center',
                  children: generating,
                }),
              ],
            }),
        ],
      }),
    ],
  });
};
export default CardStats;
//# sourceMappingURL=CardStats.js.map
