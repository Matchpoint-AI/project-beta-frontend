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
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useAuth } from '../../auth/context/AuthContext';
import { BrandContext } from '../context/BrandContext';
// import { useNavigate } from "react-router-dom";
import { RiErrorWarningLine } from 'react-icons/ri';
import convertToChipsArray from '../../../helpers/convertToChips';
export default function BrandDataLoader(_a) {
    var _this = this;
    var children = _a.children;
    var profile = useAuth().profile;
    var setBusinessInfo = useContext(BrandContext).setBusinessInfo;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(false), error = _c[0], setError = _c[1];
    var _d = useState(false), success = _d[0], setSuccess = _d[1];
    useEffect(function () {
        if (!profile || !(profile === null || profile === void 0 ? void 0 : profile.token))
            return;
        var fetchBrandData = function () { return __awaiter(_this, void 0, void 0, function () {
            var endpointUrl, response, data, convertedValues, convertedPersona, convertedToneAndVoice;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        setLoading(true);
                        setError(false);
                        endpointUrl = getServiceURL('data');
                        return [4 /*yield*/, fetch(endpointUrl + '/api/v1/data/get/complex?query_kind=brand_data', {
                                method: 'GET',
                                headers: {
                                    Authorization: "Bearer ".concat(profile === null || profile === void 0 ? void 0 : profile.token),
                                },
                            })];
                    case 1:
                        response = _g.sent();
                        if (!response.ok) {
                            setError(true);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _g.sent();
                        if (data.length > 0) {
                            convertedValues = convertToChipsArray((data[0].brand_variables.values || []).filter(Boolean));
                            convertedPersona = convertToChipsArray((data[0].brand_variables.persona || []).filter(Boolean));
                            convertedToneAndVoice = convertToChipsArray((data[0].brand_variables.tov || []).filter(Boolean));
                            setBusinessInfo({
                                id: data[0].id,
                                name: data[0].biz_variables.brand_name,
                                website: data[0].biz_variables.brand_website,
                                industry: data[0].biz_variables.industry,
                                vertical: data[0].biz_variables.vertical,
                                physical_locations: data[0].brand_variables.locations,
                                locations_fetched: data[0].brand_variables.isFetched,
                                checkZip: data[0].brand_variables.checkZip,
                                brandColors: ((_a = data[0].brand_variables.colors) === null || _a === void 0 ? void 0 : _a.slice(0, 3)) || [],
                                mission: data[0].brand_variables.mission,
                                summary: data[0].brand_variables.summary,
                                isSaved: true,
                                logo: data[0].biz_variables.brand_logo,
                                products: data[0].brand_variables.products,
                                product_features: (_b = data[0].brand_variables.product_features) !== null && _b !== void 0 ? _b : [],
                                product_description: (_c = data[0].brand_variables.product_description) !== null && _c !== void 0 ? _c : '',
                                product_link: (_d = data[0].brand_variables.product_link) !== null && _d !== void 0 ? _d : '',
                                start_date: (_e = data[0].brand_variables.start_date) !== null && _e !== void 0 ? _e : '',
                                durationNum: (_f = data[0].brand_variables.durationNum) !== null && _f !== void 0 ? _f : 0,
                                persona: convertedPersona,
                                toneAndVoice: convertedToneAndVoice,
                                values: convertedValues,
                            });
                        }
                        else {
                            setBusinessInfo({
                                name: '',
                                website: '',
                                product_features: [],
                                product_description: '',
                                product_link: '',
                                key_features: [],
                                isFetched: false,
                                start_date: '',
                                durationNum: 0,
                            });
                        }
                        setSuccess(true);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchBrandData();
    }, [profile]);
    if (!profile || profile.token === '') {
        return _jsx(_Fragment, { children: children });
    }
    return (_jsxs(_Fragment, { children: [!loading && success && children, !loading && error && (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#F1FDFF] to-[#F5D9FF] min-h-screen", children: [_jsx(RiErrorWarningLine, { size: 64, color: "#F05252" }), _jsx("h1", { className: "font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]", children: "Error" }), _jsx("p", { className: "text-[#30175A] md:text-lg text-base text-center max-w-[600px]", children: "Unexpected error, please reload the page if the problem persists try again later!" }), _jsx("button", { className: "flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5", onClick: function () { return window.location.reload(); }, children: "Reload" })] }))] }));
}
//# sourceMappingURL=BrandDataLoader.js.map