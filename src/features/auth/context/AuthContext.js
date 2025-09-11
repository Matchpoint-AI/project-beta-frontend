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
import { jsx as _jsx } from 'react/jsx-runtime';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useAuthentication } from '../../../lib/firebase';
import { getServiceURL } from '../../../helpers/getServiceURL';
export var AuthContext = createContext(undefined);
var cookies = new Cookies();
/**
 * Decode JWT token to get expiration time
 * @param token - JWT token string
 * @returns expiration timestamp or null if invalid
 */
var getTokenExpiration = function (token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    var payload = JSON.parse(jsonPayload);
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch (_error) {
    // Failed to decode token
    return null;
  }
};
/**
 * Check if token will expire soon (within 5 minutes)
 * @param token - JWT token string
 * @returns true if token expires soon
 */
var isTokenExpiringSoon = function (token) {
  var exp = getTokenExpiration(token);
  if (!exp) return true; // Assume expired if we can't decode
  var now = Date.now();
  var fiveMinutes = 5 * 60 * 1000;
  return exp - now < fiveMinutes;
};
export var AuthProvider = function (_a) {
  var children = _a.children;
  var _b = useState(),
    profile = _b[0],
    setProfile = _b[1];
  var _c = useState(true),
    isLoading = _c[0],
    setIsLoading = _c[1];
  var user = useAuthentication().user;
  var location = useLocation();
  var navigate = useNavigate();
  // Memoized token refresh function to prevent unnecessary re-renders
  var performTokenRefresh = useCallback(
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var newToken, updatedProfile, _error_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              if (!user) {
                return [2 /*return*/, null];
              }
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4 /*yield*/, user.getIdToken(true)];
            case 2:
              newToken = _a.sent();
              // Update profile with new token
              if (profile) {
                updatedProfile = __assign(__assign({}, profile), { token: newToken });
                setProfile(updatedProfile);
              }
              // Store new token in cookie
              cookies.set('token', newToken, {
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60, // 30 days
              });
              return [2 /*return*/, newToken];
            case 3:
              _error_1 = _a.sent();
              // Token refresh failed
              return [2 /*return*/, null];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    },
    [user, profile]
  );
  var login = function (token, email, remember, id, name, plan, role, is_admin, hasBrand) {
    var newProfile = {
      id: id,
      email: email,
      name: name,
      role: role || 'USER',
      token: token,
      plan: plan,
      is_admin: is_admin,
      hasBrand: hasBrand,
    };
    setProfile(newProfile);
    // Set cookie with proper options
    cookies.set('token', token, {
      path: '/',
      maxAge: remember ? 30 * 24 * 60 * 60 : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
    });
    // Cookie set
    if (newProfile.hasBrand) {
      navigate('/dashboard');
    } else {
      navigate('/onboard');
    }
  };
  var validateToken = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var token,
        response_1,
        data_1,
        newProfile_1,
        storedToken,
        response,
        data,
        newProfile,
        _error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 7, , 8]);
            setIsLoading(true);
            if (!user) return [3 /*break*/, 4];
            return [4 /*yield*/, user.getIdToken(true)];
          case 1:
            token = _a.sent();
            return [
              4 /*yield*/,
              fetch(''.concat(getServiceURL('data'), '/api/v1/user'), {
                headers: {
                  Authorization: 'Bearer '.concat(token),
                },
              }),
            ];
          case 2:
            response_1 = _a.sent();
            if (!response_1.ok) {
              throw new Error('Token validation failed');
            }
            return [4 /*yield*/, response_1.json()];
          case 3:
            data_1 = _a.sent();
            newProfile_1 = __assign(__assign({}, data_1), { token: token });
            setProfile(newProfile_1);
            // Set cookie with proper options
            cookies.set('token', token, {
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 30 * 24 * 60 * 60, // 30 days
            });
            // Cookie set from Firebase
            setIsLoading(false);
            return [2 /*return*/];
          case 4:
            storedToken = cookies.get('token');
            if (!storedToken) {
              setProfile(null);
              setIsLoading(false);
              if (location.pathname !== '/login' && location.pathname !== '/signup') {
                navigate('/login');
              }
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              fetch(''.concat(getServiceURL('data'), '/api/v1/user'), {
                headers: {
                  Authorization: 'Bearer '.concat(storedToken),
                },
              }),
            ];
          case 5:
            response = _a.sent();
            if (!response.ok) {
              // Only clear token and navigate if we're on a protected route
              if (location.pathname !== '/login' && location.pathname !== '/signup') {
                cookies.remove('token', { path: '/' });
                setProfile(null);
                navigate('/login');
              }
              setIsLoading(false);
              return [2 /*return*/];
            }
            return [4 /*yield*/, response.json()];
          case 6:
            data = _a.sent();
            newProfile = __assign(__assign({}, data), { token: storedToken });
            setProfile(newProfile);
            // Refresh the token in the cookie
            cookies.set('token', storedToken, {
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 30 * 24 * 60 * 60, // 30 days
            });
            setIsLoading(false);
            return [3 /*break*/, 8];
          case 7:
            _error_2 = _a.sent();
            // Only clear token and navigate if we're on a protected route
            if (location.pathname !== '/login' && location.pathname !== '/signup') {
              cookies.remove('token', { path: '/' });
              setProfile(null);
              navigate('/login');
            }
            setIsLoading(false);
            return [3 /*break*/, 8];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  // Run validation when user changes
  useEffect(
    function () {
      validateToken();
    },
    [user]
  );
  // Intelligent token refresh system
  useEffect(
    function () {
      if (!user || !(profile === null || profile === void 0 ? void 0 : profile.token)) return;
      var scheduleTokenRefresh = function () {
        var currentToken = profile.token;
        if (!currentToken) return;
        // Check if token is expiring soon
        if (isTokenExpiringSoon(currentToken)) {
          performTokenRefresh().catch(function (_error) {
            logout();
          });
          return;
        }
        // Calculate next refresh time based on token expiration
        var expiration = getTokenExpiration(currentToken);
        if (expiration) {
          var now = Date.now();
          var timeUntilExpiry = expiration - now;
          var refreshTime = Math.max(timeUntilExpiry - 10 * 60 * 1000, 5 * 60 * 1000); // Refresh 10 min before expiry, but at least 5 min from now
          var refreshTimeout_1 = setTimeout(function () {
            return __awaiter(void 0, void 0, void 0, function () {
              var newToken;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [4 /*yield*/, performTokenRefresh()];
                  case 1:
                    newToken = _a.sent();
                    if (!newToken) {
                      logout();
                    }
                    return [2 /*return*/];
                }
              });
            });
          }, refreshTime);
          return function () {
            return clearTimeout(refreshTimeout_1);
          };
        }
      };
      // Schedule initial refresh
      var cleanup = scheduleTokenRefresh();
      // Also set up a backup interval every 30 minutes as a safety net
      var backupInterval = setInterval(
        function () {
          return __awaiter(void 0, void 0, void 0, function () {
            var currentToken, newToken;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  currentToken = profile.token;
                  if (!(currentToken && isTokenExpiringSoon(currentToken))) return [3 /*break*/, 2];
                  return [4 /*yield*/, performTokenRefresh()];
                case 1:
                  newToken = _a.sent();
                  if (!newToken) {
                    logout();
                  }
                  _a.label = 2;
                case 2:
                  return [2 /*return*/];
              }
            });
          });
        },
        30 * 60 * 1000
      );
      return function () {
        cleanup === null || cleanup === void 0 ? void 0 : cleanup();
        clearInterval(backupInterval);
      };
    },
    [user, profile === null || profile === void 0 ? void 0 : profile.token, performTokenRefresh]
  );
  var logout = function () {
    cookies.remove('token', { path: '/' });
    setProfile(null);
    navigate('/login');
  };
  var isAuthenticated = !!(profile === null || profile === void 0 ? void 0 : profile.token);
  return _jsx(AuthContext.Provider, {
    value: {
      profile: profile,
      setProfile: setProfile,
      isAuthenticated: isAuthenticated,
      isLoading: isLoading,
      logout: logout,
      login: login,
    },
    children: children,
  });
};
export var useAuth = function () {
  var context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
//# sourceMappingURL=AuthContext.js.map
