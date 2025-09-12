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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import { BrandContext } from '../../features/brand/context/BrandContext';
import CustomComponent from '../../features/campaign/components/CustomComponent';
import BrandForm from '../../features/brand/components/BrandForm';
import ReviewForm from '../onboard/ReviewForm';
import { CampaignContext } from '../../context/CampaignContext';
import OnboardStepsBar from '../onboard/OnboardStepsBar';
import { useAuth } from '../../features/auth/context/AuthContext';
import { getServiceURL } from '../../helpers/getServiceURL';
import BusinessForm from '../onboard/BusinessForm';
import ErrorToast from '../../shared/components/feedback/ErrorToast';
import StepContainer from '../onboard/StepContainer';
import handleNavigate from '../../helpers/handleNavigate';
var Onboard = function (_a) {
    var _b = _a.edit, edit = _b === void 0 ? false : _b;
    var profile = useAuth().profile;
    var _c = useState(1), currentStep = _c[0], setCurrentStep = _c[1];
    var _d = useState(false), errorSaving = _d[0], setErrorSaving = _d[1];
    var _e = useContext(BrandContext), businessInfo = _e.businessInfo, setBusinessInfo = _e.setBusinessInfo;
    var setCampaignInfo = useContext(CampaignContext).setCampaignInfo;
    var _f = useState(false), saveAndStart = _f[0], setSaveAndStart = _f[1];
    var endpointUrl = getServiceURL('data');
    var navigate = useNavigate();
    var handleBack = function () {
        if (currentStep === 4) {
            setBusinessInfo(function (prev) { return (__assign(__assign({}, prev), { summary: undefined, product_features: undefined })); });
        }
        if (currentStep > 2) {
            setCurrentStep(currentStep - 1);
        }
    };
    var toBase64 = function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () { return resolve(reader.result); };
            reader.onerror = reject;
        });
    };
    var handleNext = function () {
        setCurrentStep(function (step) { return step + 1; });
    };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, date, year, month, day, hours, minutes, seconds, formattedDateTime, cleanBusinessInfo, logoData, fileDetails, payload;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    formData = new FormData();
                    date = new Date();
                    year = date.getFullYear();
                    month = String(date.getMonth() + 1).padStart(2, '0');
                    day = String(date.getDate()).padStart(2, '0');
                    hours = String(date.getHours()).padStart(2, '0');
                    minutes = String(date.getMinutes()).padStart(2, '0');
                    seconds = String(date.getSeconds()).padStart(2, '0');
                    formattedDateTime = "".concat(month, "/").concat(day, "/").concat(year, ", ").concat(hours, ":").concat(minutes, ":").concat(seconds);
                    businessInfo.timestamp = formattedDateTime;
                    cleanBusinessInfo = __assign(__assign({}, businessInfo), { timestamp: formattedDateTime, values: (_a = businessInfo.values) === null || _a === void 0 ? void 0 : _a.filter(function (t) { return t === null || t === void 0 ? void 0 : t.selected; }).map(function (t) { return t.label; }), toneAndVoice: (_b = businessInfo.toneAndVoice) === null || _b === void 0 ? void 0 : _b.filter(function (t) { return t === null || t === void 0 ? void 0 : t.selected; }).map(function (t) { return t.label; }), persona: (_c = businessInfo.persona) === null || _c === void 0 ? void 0 : _c.filter(function (t) { return t === null || t === void 0 ? void 0 : t.selected; }).map(function (t) { return t.label; }) });
                    delete cleanBusinessInfo.brandLogo;
                    logoData = {};
                    if (!(businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo)) return [3 /*break*/, 2];
                    return [4 /*yield*/, toBase64(businessInfo.brandLogo)];
                case 1:
                    fileDetails = _j.sent();
                    logoData = {
                        file: fileDetails.split(',')[1],
                        type: (_d = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo) === null || _d === void 0 ? void 0 : _d.type,
                        fileName: (_e = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo) === null || _e === void 0 ? void 0 : _e.name,
                    };
                    _j.label = 2;
                case 2:
                    payload = {
                        timestamp: {
                            timestamp: businessInfo.timestamp,
                        },
                        biz_variables: {
                            brand_name: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name,
                            brand_website: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.website,
                            industry: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.industry,
                            vertical: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.vertical,
                        },
                        brand_variables: {
                            mission: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission,
                            values: (_f = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.values) === null || _f === void 0 ? void 0 : _f.filter(function (t) { return t === null || t === void 0 ? void 0 : t.selected; }).map(function (t) { return t.label; }),
                            tov: (_g = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.toneAndVoice) === null || _g === void 0 ? void 0 : _g.filter(function (t) { return t === null || t === void 0 ? void 0 : t.selected; }).map(function (t) { return t.label; }),
                            persona: (_h = businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.persona) === null || _h === void 0 ? void 0 : _h.filter(function (t) { return t === null || t === void 0 ? void 0 : t.selected; }).map(function (t) { return t.label; }),
                            products: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.products,
                            colors: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandColors,
                            brand_visual_style: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.style,
                            locations: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.physical_locations,
                            isFetched: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.locations_fetched,
                            checkzip: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.checkZip,
                            summary: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.summary,
                            scenes: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.scenes,
                            themes: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.themes,
                            negative_prompts: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.negative_prompts,
                            product_features: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.product_features,
                        },
                        logo: logoData,
                        campaigns: [], // Empty campaigns array
                    };
                    formData.append('entity_json', JSON.stringify({
                        entity_name: 'brand_data',
                        entity_data: payload,
                        brandId: String(businessInfo.id),
                        isEdit: Boolean(edit),
                    }));
                    setCampaignInfo(function (prev) { return (__assign(__assign({}, prev), { brandLogo: businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.brandLogo })); });
                    setSaveAndStart(true);
                    fetch(endpointUrl + '/api/v1/data/brand', {
                        method: 'POST',
                        headers: {
                            Authorization: "Bearer ".concat(profile === null || profile === void 0 ? void 0 : profile.token),
                        },
                        body: formData,
                    })
                        .then(function (response) {
                        if (!response.ok) {
                            throw new Error('Failed to post data');
                        }
                        return response.json();
                    })
                        .then(function (data) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                        setBusinessInfo({
                            name: (_a = data === null || data === void 0 ? void 0 : data.biz_variables) === null || _a === void 0 ? void 0 : _a.brand_name,
                            website: (_b = data === null || data === void 0 ? void 0 : data.biz_variables) === null || _b === void 0 ? void 0 : _b.brand_website,
                            industry: (_c = data === null || data === void 0 ? void 0 : data.biz_variables) === null || _c === void 0 ? void 0 : _c.industry,
                            vertical: (_d = data === null || data === void 0 ? void 0 : data.biz_variables) === null || _d === void 0 ? void 0 : _d.vertical,
                            physical_locations: (_e = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _e === void 0 ? void 0 : _e.locations,
                            locations_fetched: (_f = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _f === void 0 ? void 0 : _f.isFetched,
                            checkZip: (_g = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _g === void 0 ? void 0 : _g.checkZip,
                            brandColors: (_h = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _h === void 0 ? void 0 : _h.colors,
                            values: (_j = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _j === void 0 ? void 0 : _j.values,
                            toneAndVoice: (_k = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _k === void 0 ? void 0 : _k.tov,
                            mission: (_l = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _l === void 0 ? void 0 : _l.mission,
                            persona: (_m = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _m === void 0 ? void 0 : _m.persona,
                            summary: (_o = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _o === void 0 ? void 0 : _o.summary,
                            isSaved: true,
                            logo: (_p = data === null || data === void 0 ? void 0 : data.biz_variables) === null || _p === void 0 ? void 0 : _p.brand_logo,
                            products: (_q = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _q === void 0 ? void 0 : _q.products,
                            product_features: (_r = data === null || data === void 0 ? void 0 : data.brand_variables) === null || _r === void 0 ? void 0 : _r.product_features,
                            id: data.id,
                        });
                        setSaveAndStart(false);
                        setCurrentStep(4);
                    })
                        .catch(function (_error) {
                        setErrorSaving(true);
                        setSaveAndStart(false);
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var customComponentData = [
        {
            title: 'Tell us about your business',
            subtitle: "Enter some info about the business you'd like to advertise today and a bit about its brand.",
        },
        {
            title: 'Share your Brand guidelines, colors & logo',
            subtitle: "Sharing visual guidance for your brand helps us make content that matches your business's unique style.",
        },
        {
            title: 'Review your business & brand info',
            subtitle: "We'll use the below as the foundation of your campaign content made with Matchpoint.",
        },
        {
            title: 'Start Campaign',
            subtitle: "Please provide the primary name of the business or brand you'd like to build campaigns around.",
        },
    ];
    useEffect(function () {
        if (currentStep === 4) {
            handleNavigate((profile === null || profile === void 0 ? void 0 : profile.id) || '', '/campaign', navigate);
        }
    }, [currentStep, navigate]);
    return (_jsxs("div", { className: "flex h-full flex-col max-w-6xl mx-auto gap-2", children: [currentStep === 1 && businessInfo.name === undefined && (_jsxs("div", { className: "flex flex-col  mt-32 md:mt-16", children: [_jsxs("h1", { className: " text-[#5145CD] text-2xl font-bold", children: ["Welcome to Matchpoint ", _jsx("span", { className: "capitalize", children: profile === null || profile === void 0 ? void 0 : profile.name.split(' ')[0] }), ", let's get started."] }), _jsx("h3", { className: " text-md w-full mb-4", children: "You've got 3 steps and then boom \u2013 your campaign content is on the way!" }), _jsxs("div", { className: "flex-wrap items-center justify-between grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsx(StepContainer, { icon: "/briefcase.svg", title: "Business & Brand info", children: "Ensures your campaign content is unique to you" }), _jsx(StepContainer, { icon: "/palette_active.svg", title: "Campaign Brief", children: "Creates a guide that keeps your campaign targeted and timely" }), _jsx(StepContainer, { icon: "/notes.svg", title: "Campaign Content Review", children: "Allows you to review and tweak your content as you like" })] })] })), _jsx(Sidebar, { currentStep: currentStep }), _jsxs("div", { className: "flex lg:flex-row flex-col", children: [_jsx("div", { className: "w-full lg:w-1/3", children: _jsx(OnboardStepsBar, { currentStep: currentStep, setStep: setCurrentStep }) }), _jsx("div", { className: "w-full lg:w-2/3", children: currentStep !== 4 && (_jsx(_Fragment, { children: _jsxs(CustomComponent, { title: customComponentData[currentStep - 1].title, subtitle: customComponentData[currentStep - 1].subtitle, children: [currentStep === 1 && _jsx(BusinessForm, { handleNext: handleNext }), currentStep === 2 && _jsx(BrandForm, { handleNext: handleNext, handleBack: handleBack }), currentStep === 3 && (_jsx(ReviewForm, { setFormStep: setCurrentStep, handleSave: handleSave, handleBack: handleBack, saving: saveAndStart }))] }) })) })] }), _jsx(ErrorToast, { message: "Something wrong happened when saving, try again!", open: errorSaving, onClose: function () { return setErrorSaving(false); } })] }));
};
export default Onboard;
//# sourceMappingURL=OnboardForms.js.map