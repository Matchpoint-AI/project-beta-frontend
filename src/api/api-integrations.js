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
import { getServiceURL } from '../helpers/getServiceURL';
import axios from 'axios';
import useApi from './useApi';
var API_URL = getServiceURL('data');
var _axios = axios.create({
    baseURL: "".concat(API_URL, "/api/v1"),
});
export default function useIntegrationApi(action, manual) {
    return useApi(integrationApi, action, manual);
}
export function integrationApi(action, token) {
    return __awaiter(this, void 0, void 0, function () {
        var type, app, config, response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    type = action.type, app = action.payload;
                    if (!token) {
                        throw new Error('No authentication token available');
                    }
                    config = {
                        headers: {
                            Authorization: "Bearer ".concat(token),
                        },
                    };
                    _a = type;
                    switch (_a) {
                        case 'AUTHORIZE': return [3 /*break*/, 1];
                        case 'FETCH_DATA': return [3 /*break*/, 3];
                        case 'REVOKE_AUTH': return [3 /*break*/, 5];
                        case 'AVAILABLE': return [3 /*break*/, 7];
                        case 'USER': return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 11];
                case 1: return [4 /*yield*/, _axios.get("/".concat(app), config)];
                case 2:
                    response = _b.sent();
                    return [3 /*break*/, 11];
                case 3: return [4 /*yield*/, _axios.get("/".concat(app, "/data"), config)];
                case 4:
                    response = _b.sent();
                    return [3 /*break*/, 11];
                case 5: return [4 /*yield*/, _axios.delete("/".concat(app), config)];
                case 6:
                    response = _b.sent();
                    return [3 /*break*/, 11];
                case 7: return [4 /*yield*/, _axios.get("/integrations", config)];
                case 8:
                    response = _b.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, _axios.get("/".concat(app, "/me"), config)];
                case 10:
                    response = _b.sent();
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, response.data];
            }
        });
    });
}
export function authenticateApp(app) {
    return { type: 'AUTHORIZE', payload: app };
}
export function fetcheDataApp(app) {
    return { type: 'FETCH_DATA', payload: app };
}
export function revokeAuthApp(app) {
    return { type: 'REVOKE_AUTH', payload: app };
}
export function getAvailableIntegrations() {
    return { type: 'AVAILABLE' };
}
export function getAppUser(app) {
    return { type: 'USER', payload: app };
}
//# sourceMappingURL=api-integrations.js.map