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
/**
 * Base Proto Service for V2 API (JSON-only implementation)
 *
 * Provides base functionality for all V2 API services using JSON.
 * Protobuf support has been removed.
 */
import { V2_PUBLIC_API_URL } from '../config';
/**
 * Base class for all V2 API services using JSON
 */
var ProtoService = /** @class */ (function () {
    function ProtoService(config) {
        this.serviceName = config.serviceName;
        this.baseUrl = config.baseUrl || V2_PUBLIC_API_URL;
        this.defaultTimeout = config.timeout || 30000;
    }
    /**
     * Make a JSON-based API request
     */
    ProtoService.prototype.makeProtoRequest = function (method, endpoint, requestData, requestMessagePath, responseMessagePath, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, body, controller, timeout, timeoutId, response, json, _error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl).concat(endpoint);
                        headers = __assign({ Accept: 'application/json' }, options === null || options === void 0 ? void 0 : options.headers);
                        if (options === null || options === void 0 ? void 0 : options.token) {
                            headers['Authorization'] = "Bearer ".concat(options.token);
                        }
                        if (requestData && requestMessagePath) {
                            body = JSON.stringify(requestData);
                            headers['Content-Type'] = 'application/json';
                        }
                        controller = new AbortController();
                        timeout = (options === null || options === void 0 ? void 0 : options.timeout) || this.defaultTimeout;
                        timeoutId = setTimeout(function () { return controller.abort(); }, timeout);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, fetch(url, {
                                method: method,
                                headers: headers,
                                body: body,
                                signal: controller.signal,
                            })];
                    case 2:
                        response = _a.sent();
                        clearTimeout(timeoutId);
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.handleErrorResponse(response)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _a.sent();
                        return [2 /*return*/, json];
                    case 6:
                        _error_1 = _a.sent();
                        clearTimeout(timeoutId);
                        if (error instanceof Error) {
                            if (error.name === 'AbortError') {
                                throw new Error("Request timeout after ".concat(timeout, "ms"));
                            }
                        }
                        throw error;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Make a GET request with JSON support
     */
    ProtoService.prototype.get = function (endpoint, responseMessagePath, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeProtoRequest('GET', endpoint, null, null, responseMessagePath, options)];
            });
        });
    };
    /**
     * Make a POST request with JSON support
     */
    ProtoService.prototype.post = function (endpoint, data, requestMessagePath, responseMessagePath, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeProtoRequest('POST', endpoint, data, requestMessagePath, responseMessagePath, options)];
            });
        });
    };
    /**
     * Make a PUT request with JSON support
     */
    ProtoService.prototype.put = function (endpoint, data, requestMessagePath, responseMessagePath, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeProtoRequest('PUT', endpoint, data, requestMessagePath, responseMessagePath, options)];
            });
        });
    };
    /**
     * Make a DELETE request with JSON support
     */
    ProtoService.prototype.delete = function (endpoint, responseMessagePath, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.makeProtoRequest('DELETE', endpoint, null, null, responseMessagePath, options)];
            });
        });
    };
    /**
     * Handle error responses
     */
    ProtoService.prototype.handleErrorResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var errorMessage, contentType, errorData, errorText, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        errorMessage = "".concat(this.serviceName, " API error: ").concat(response.status, " ").concat(response.statusText);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        contentType = response.headers.get('content-type');
                        if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json'))) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        errorData = _b.sent();
                        if (errorData.detail) {
                            errorMessage = errorData.detail;
                        }
                        else if (errorData.message) {
                            errorMessage = errorData.message;
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes('text/'))) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.text()];
                    case 4:
                        errorText = _b.sent();
                        if (errorText) {
                            errorMessage = errorText;
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _a = _b.sent();
                        return [3 /*break*/, 7];
                    case 7: throw new Error(errorMessage);
                }
            });
        });
    };
    /**
     * Validate a message - always returns null for JSON
     */
    ProtoService.prototype.validateMessage = function (_packageName, _messageName, _data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // No validation in JSON mode
                return [2 /*return*/, null];
            });
        });
    };
    /**
     * Create headers for multipart form data
     */
    ProtoService.prototype.createMultipartFormData = function (fields, protoFields) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, _i, _a, _b, key, value, _c, _d, _e, key, protoField, jsonString, blob;
            return __generator(this, function (_f) {
                formData = new FormData();
                // Add regular fields
                for (_i = 0, _a = Object.entries(fields); _i < _a.length; _i++) {
                    _b = _a[_i], key = _b[0], value = _b[1];
                    if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                }
                // Add JSON fields (previously protobuf fields)
                for (_c = 0, _d = Object.entries(protoFields); _c < _d.length; _c++) {
                    _e = _d[_c], key = _e[0], protoField = _e[1];
                    jsonString = JSON.stringify(protoField.data);
                    blob = new Blob([jsonString], { type: 'application/json' });
                    formData.append(key, blob, "".concat(key, ".json"));
                }
                return [2 /*return*/, formData];
            });
        });
    };
    return ProtoService;
}());
export { ProtoService };
//# sourceMappingURL=proto-service.js.map