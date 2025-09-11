/**
 * Auth-aware fetch wrapper that automatically adds authentication headers
 * This ensures ALL API calls to backend services include proper authentication
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { getServiceURL } from '../../../helpers/getServiceURL';
/**
 * Get the authentication token from localStorage or sessionStorage
 * This matches how the auth context stores the token
 */
export var getAuthToken = function () {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
        return null;
    }
    try {
        // Check if we have a profile with token in localStorage
        var profileStr = localStorage.getItem('profile');
        if (profileStr) {
            try {
                var profile = JSON.parse(profileStr);
                if (profile.token) {
                    return profile.token;
                }
            }
            catch (e) {
                // Error handled silently
                // Failed to parse profile from localStorage
            }
        }
        // Fallback to sessionStorage if needed
        if (window.sessionStorage) {
            var sessionProfileStr = sessionStorage.getItem('profile');
            if (sessionProfileStr) {
                try {
                    var profile = JSON.parse(sessionProfileStr);
                    if (profile.token) {
                        return profile.token;
                    }
                }
                catch (e) {
                    // Error handled silently
                    // Failed to parse profile from sessionStorage
                }
            }
        }
    }
    catch (_error) {
        // Error handled silently
        // Handle cases where localStorage/sessionStorage access is blocked
    }
    return null;
};
/**
 * Enhanced fetch that automatically adds authentication headers
 * Use this instead of regular fetch for all API calls
 */
export var authFetch = function (url_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([url_1], args_1, true), void 0, function (url, options) {
        var _a, skipAuth, fetchOptions, token, headers, response;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = options.skipAuth, skipAuth = _a === void 0 ? false : _a, fetchOptions = __rest(options, ["skipAuth"]);
                    token = getAuthToken();
                    headers = new Headers(fetchOptions.headers || {});
                    // Add auth header if we have a token and skipAuth is false
                    if (token && !skipAuth) {
                        headers.set('Authorization', "Bearer ".concat(token));
                    }
                    // Add Content-Type if not present and body exists
                    if (fetchOptions.body && !headers.has('Content-Type')) {
                        // Check if body is FormData (for file uploads)
                        if (!(fetchOptions.body instanceof FormData)) {
                            headers.set('Content-Type', 'application/json');
                        }
                    }
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, fetchOptions), { headers: headers }))];
                case 1:
                    response = _b.sent();
                    // Log response status for debugging
                    // Debugging logs removed
                    return [2 /*return*/, response];
            }
        });
    });
};
/**
 * Helper function to make authenticated API calls to specific services
 */
export var serviceAuthFetch = function (service_1, path_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([service_1, path_1], args_1, true), void 0, function (service, path, options) {
        var baseUrl, url;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            baseUrl = getServiceURL(service);
            url = "".concat(baseUrl).concat(path);
            return [2 /*return*/, authFetch(url, __assign(__assign({}, options), { service: service }))];
        });
    });
};
/**
 * Convenience methods for common HTTP methods
 */
export var authApi = {
    get: function (url, options) { return authFetch(url, __assign(__assign({}, options), { method: 'GET' })); },
    post: function (url, body, options) {
        return authFetch(url, __assign(__assign({}, options), { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }));
    },
    put: function (url, body, options) {
        return authFetch(url, __assign(__assign({}, options), { method: 'PUT', body: typeof body === 'string' ? body : JSON.stringify(body) }));
    },
    delete: function (url, options) {
        return authFetch(url, __assign(__assign({}, options), { method: 'DELETE' }));
    },
    patch: function (url, body, options) {
        return authFetch(url, __assign(__assign({}, options), { method: 'PATCH', body: typeof body === 'string' ? body : JSON.stringify(body) }));
    },
};
/**
 * Service-specific auth fetch helpers
 */
export var dataApi = {
    get: function (path, options) {
        return serviceAuthFetch('data', path, __assign(__assign({}, options), { method: 'GET' }));
    },
    post: function (path, body, options) {
        return serviceAuthFetch('data', path, __assign(__assign({}, options), { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }));
    },
};
export var contentGenApi = {
    get: function (path, options) {
        return serviceAuthFetch('content-gen', path, __assign(__assign({}, options), { method: 'GET' }));
    },
    post: function (path, body, options) {
        return serviceAuthFetch('content-gen', path, __assign(__assign({}, options), { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }));
    },
};
export var llmApi = {
    get: function (path, options) {
        return serviceAuthFetch('llm', path, __assign(__assign({}, options), { method: 'GET' }));
    },
    post: function (path, body, options) {
        return serviceAuthFetch('llm', path, __assign(__assign({}, options), { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }));
    },
};
// Export campaignManagerApi for campaign management
export var campaignManagerApi = {
    get: function (path, options) {
        return serviceAuthFetch('campaign-manager', path, __assign(__assign({}, options), { method: 'GET' }));
    },
    post: function (path, body, options) {
        return serviceAuthFetch('campaign-manager', path, __assign(__assign({}, options), { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }));
    },
};
// Export default for backward compatibility
// Export getAuthToken as getToken for backward compatibility
export { getAuthToken as getToken };
export default authFetch;
//# sourceMappingURL=authFetch.js.map