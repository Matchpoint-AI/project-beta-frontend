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
import { useAuth } from '../context/AuthContext';
import { useAuthentication } from '../../../lib/firebase';
/**
 * Custom hook for handling token refresh and API request retry logic
 */
export var useTokenRefresh = function () {
  var _a = useAuth(),
    profile = _a.profile,
    setProfile = _a.setProfile,
    logout = _a.logout;
  var user = useAuthentication().user;
  /**
   * Attempts to refresh the current token
   * @returns Promise<string | null> - New token or null if refresh failed
   */
  var refreshToken = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var newToken, updatedProfile, cookies, cookieInstance, _error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!user) {
              return [2 /*return*/, null];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, user.getIdToken(true)];
          case 2:
            newToken = _a.sent();
            if (!profile) return [3 /*break*/, 4];
            updatedProfile = __assign(__assign({}, profile), { token: newToken });
            setProfile(updatedProfile);
            return [4 /*yield*/, import('universal-cookie')];
          case 3:
            cookies = _a.sent();
            cookieInstance = new cookies.default();
            cookieInstance.set('token', newToken, {
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 30 * 24 * 60 * 60, // 30 days
            });
            _a.label = 4;
          case 4:
            return [2 /*return*/, newToken];
          case 5:
            _error_1 = _a.sent();
            // Error handled silently
            return [2 /*return*/, null];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Makes an API request with automatic token refresh retry on 401 errors
   * @param url - API endpoint URL
   * @param options - fetch options
   * @returns Promise<Response>
   */
  var fetchWithTokenRefresh = function (url_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([url_1], args_1, true), void 0, function (url, options) {
      var makeRequest, response, newToken;
      if (options === void 0) {
        options = {};
      }
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            makeRequest = function (token) {
              return __awaiter(void 0, void 0, void 0, function () {
                var headers;
                return __generator(this, function (_a) {
                  headers = __assign({ 'Content-Type': 'application/json' }, options.headers);
                  if (token) {
                    headers['Authorization'] = 'Bearer '.concat(token);
                  }
                  return [
                    2 /*return*/,
                    fetch(url, __assign(__assign({}, options), { headers: headers })),
                  ];
                });
              });
            };
            return [
              4 /*yield*/,
              makeRequest(profile === null || profile === void 0 ? void 0 : profile.token),
            ];
          case 1:
            response = _a.sent();
            if (!(response.status === 401 && user)) return [3 /*break*/, 5];
            return [4 /*yield*/, refreshToken()];
          case 2:
            newToken = _a.sent();
            if (!newToken) return [3 /*break*/, 4];
            return [4 /*yield*/, makeRequest(newToken)];
          case 3:
            // Retry with new token
            response = _a.sent();
            return [3 /*break*/, 5];
          case 4:
            // Token refresh failed, logout user
            logout();
            throw new Error('Authentication failed. Please log in again.');
          case 5:
            return [2 /*return*/, response];
        }
      });
    });
  };
  return {
    refreshToken: refreshToken,
    fetchWithTokenRefresh: fetchWithTokenRefresh,
  };
};
//# sourceMappingURL=useTokenRefresh.js.map
