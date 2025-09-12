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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import FileInput from '../../../shared/components/inputs/FileInput';
import { BrandContext } from '../context/BrandContext';
import ColorPicker from '../../../shared/components/ui/ColorPicker';
import FormsContainer from '../../../components/shared/FormsContainer';
import ColorSpan from '../../../shared/components/ui/ColorSpan';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker&url';
import CircularProgress from '@mui/material/CircularProgress';
import BackButton from '../../../shared/components/buttons/BackButton';
import NextButton from '../../../shared/components/buttons/NextButton';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { LuPlus } from 'react-icons/lu';
import { trackBrandGuideUpload } from '../../../helpers/analytics';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
var BrandForm = function (_a) {
    var handleBack = _a.handleBack, handleNext = _a.handleNext;
    var _b = useContext(BrandContext), businessInfo = _b.businessInfo, setBusinessInfo = _b.setBusinessInfo;
    var _c = useState([]), selectedColors = _c[0], setSelectedColors = _c[1];
    var _d = useState(false), colorPickerVisibility = _d[0], setColorPickerVisibility = _d[1];
    var _e = useState(false), analysePdf = _e[0], setAnalysePdf = _e[1];
    var _f = useState(false), error = _f[0], setError = _f[1];
    var removeColor = function (index) {
        var updatedColors = selectedColors.filter(function (color) { return color !== selectedColors[index]; });
        setSelectedColors(updatedColors);
        setBusinessInfo(__assign(__assign({}, businessInfo), { brandColors: updatedColors }));
    };
    var extractBrandInfo = function (guideLines) { return __awaiter(void 0, void 0, void 0, function () {
        var endpointUrl, res, data, choices, content, parsedContent;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    endpointUrl = "".concat(getServiceURL('llm'), "/api/v1/llm/openai");
                    return [4 /*yield*/, fetch(endpointUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                prompt: "from this brand guidelines '".concat(guideLines, "' extract information about the brand and return anything you find in paired JSON output following this structure {\n\t\t\t\tcolors: {\n\t\t\t\t\tprimary: ['#000000', '#000000', '#000000', '#000000],\n\t\t\t\t\tsecondary: ['#000000', '#000000', '#000000']\n\t\t\t\t},\n\t\t\t\ttypography: {\n\t\t\t\t\tprimary: ['arial', 'helvetica'],\n\t\t\t\t\tsecondary: ['times new roman', 'roboto']\n\t\t\t\t},\n\t\t\t\tphotography: ['candid', 'screenshots']\n\t\t\t  }"),
                                json_mode: true,
                            }),
                        })];
                case 1:
                    res = _e.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _e.sent();
                    choices = data.response.choices;
                    content = choices[0].message.content;
                    parsedContent = JSON.parse(content);
                    setSelectedColors(function (old) {
                        var _a, _b, _c, _d;
                        var newColors = __spreadArray(__spreadArray([], ((_b = (_a = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.colors) === null || _a === void 0 ? void 0 : _a.primary) !== null && _b !== void 0 ? _b : []), true), ((_d = (_c = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.colors) === null || _c === void 0 ? void 0 : _c.secondary) !== null && _d !== void 0 ? _d : []), true);
                        return __spreadArray(__spreadArray([], old, true), newColors, true);
                    });
                    setBusinessInfo(__assign(__assign({}, businessInfo), { brandColors: __spreadArray(__spreadArray(__spreadArray([], selectedColors, true), ((_b = (_a = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.colors) === null || _a === void 0 ? void 0 : _a.primary) !== null && _b !== void 0 ? _b : []), true), ((_d = (_c = parsedContent === null || parsedContent === void 0 ? void 0 : parsedContent.colors) === null || _c === void 0 ? void 0 : _c.secondary) !== null && _d !== void 0 ? _d : []), true) }));
                    setAnalysePdf(false);
                    trackBrandGuideUpload('guide');
                    return [2 /*return*/];
            }
        });
    }); };
    var handleGuidelines = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var arrayBuffer, typedarray, pdf, extractedText, pageNum, page, textContent, pageText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setAnalysePdf(true);
                    return [4 /*yield*/, file.arrayBuffer()];
                case 1:
                    arrayBuffer = _a.sent();
                    typedarray = new Uint8Array(arrayBuffer);
                    return [4 /*yield*/, pdfjsLib.getDocument({ data: typedarray }).promise];
                case 2:
                    pdf = _a.sent();
                    extractedText = '';
                    pageNum = 1;
                    _a.label = 3;
                case 3:
                    if (!(pageNum <= pdf.numPages)) return [3 /*break*/, 7];
                    return [4 /*yield*/, pdf.getPage(pageNum)];
                case 4:
                    page = _a.sent();
                    return [4 /*yield*/, page.getTextContent()];
                case 5:
                    textContent = _a.sent();
                    pageText = textContent.items.map(function (item) { return item.str; }).join(' ');
                    extractedText += pageText + '\n\n';
                    _a.label = 6;
                case 6:
                    pageNum++;
                    return [3 /*break*/, 3];
                case 7: return [4 /*yield*/, extractBrandInfo(extractedText)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLogo = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setBusinessInfo(__assign(__assign({}, businessInfo), { brandLogo: file }));
            setError(false);
            trackBrandGuideUpload('logo');
            return [2 /*return*/];
        });
    }); };
    var handleSubmit = function (e) {
        e.preventDefault();
        handleNext();
    };
    useEffect(function () {
        var _a;
        setSelectedColors((_a = businessInfo.brandColors) !== null && _a !== void 0 ? _a : []);
    }, [businessInfo]);
    return (_jsxs(_Fragment, { children: [_jsx(FormsContainer, { children: _jsxs("form", { onSubmit: handleSubmit, id: "brand_form", children: [_jsxs("div", { className: "mb-5", children: [_jsxs("label", { title: "email", className: "block mb-2 sm:text-xl text-lg font-medium text-gray-900 ", children: ["1. Add your brand guidelines (PDF, etc)", ' '] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileInput, { accept: "application/pdf", onChange: handleGuidelines, required: false, error: error }), analysePdf && _jsx(CircularProgress, { sx: { color: '#5145CD' }, size: 25, thickness: 5 })] }), _jsx("p", { className: "py-1 text-xs text-[#6B7280]", children: "Upload your brand guidelines. Supported files: pdf" })] }), _jsxs("div", { className: "mb-5", children: [_jsx("label", { title: "password", className: "block mb-2 sm:text-xl text-lg font-medium text-gray-900", children: "2. Upload your logo" }), _jsx(FileInput, { accept: "image/png, image/jpeg", onChange: handleLogo, required: false, error: error }), _jsx("p", { className: "py-1 text-xs text-[#6B7280]", children: "Supported files: png, jpeg, jpg" })] }), _jsxs("div", { className: "mb-5 w-full", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("label", { title: "brand-colors", className: "block sm:text-xl text-lg font-medium text-gray-900", children: "3. Pick brand colors" }), _jsx("img", { src: "/info.svg", alt: "info", className: "w-4 h-4 inline-block mt-1" })] }), _jsx("p", { className: "py-2 text-xs text-[#6B7280]", children: "We've detected these are your colors. If you'd like to change these please click each color or add more up to 2 colors total" }), _jsxs("div", { className: "flex gap-3 mt-3 w-full", children: [_jsxs("div", { className: "relative w-10", children: [_jsx("button", { type: "button", disabled: selectedColors.length >= 2, onClick: function () { return setColorPickerVisibility(function (old) { return !old; }); }, className: "w-10 aspect-square rounded-full ".concat(selectedColors.length >= 2 ? 'bg-gray-500' : 'bg-[#5145CD]', " flex items-center justify-center"), children: _jsx(LuPlus, { color: "#fff", size: 20 }) }), colorPickerVisibility && (_jsx(ColorPicker, { selectedColors: selectedColors, saveColor: setBusinessInfo, selectColor: setSelectedColors, conseilPicker: setColorPickerVisibility, className: "mp-color-picker" }))] }), _jsx("div", { className: "w-full overflow-x-auto whitespace-nowrap", children: selectedColors.map(function (color, index) { return (_jsx(ColorSpan, { index: index, color: color, removeColor: removeColor }, index)); }) })] })] })] }) }), _jsx("div", { className: "mb-5 md:min-w-[400px] w-full", children: _jsx("p", { className: "text-xs text-[#6B7280]", children: "By clicking \"Next\", you represent and warrant that you own or have permission to use all the content from these websites and documents." }) }), _jsxs("div", { className: "flex justify-between mb-10 w-full", children: [_jsx(BackButton, { text: "Back", onClick: handleBack }), _jsx(NextButton, { text: "Next", formId: "brand_form" })] })] }));
};
export default BrandForm;
//# sourceMappingURL=BrandForm.js.map