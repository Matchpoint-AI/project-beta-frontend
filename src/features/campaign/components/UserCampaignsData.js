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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
function SecondaryButton(_a) {
    var label = _a.label, loading = _a.loading, onClick = _a.onClick;
    return (_jsx("button", { onClick: onClick, className: "text-[#5145CD] border border-[#5145CD] text-sm rounded-md w-32 h-9 sm:ml-0 flex items-center justify-center capitalize", children: loading ? _jsx(CircularProgress, { sx: { color: '#5145CD' }, size: 20, thickness: 4 }) : label }));
}
export default function UserCampaignsData(_a) {
    var _this = this;
    var campaign = _a.campaign, viewContent = _a.viewContent, viewThread = _a.viewThread;
    var _b = useState(false), loadingContent = _b[0], setLoadingContent = _b[1];
    var _c = useState(false), loadingPrompts = _c[0], setLoadingPrompts = _c[1];
    var statusColors = {
        Active: 'text-[#0E9F6E]',
        Current: 'text-[#0E9F6E]',
        Past: 'text-[#D61F69]',
        Inactive: 'text-[#111928]',
        Draft: 'text-orange-700',
    };
    var handleViewContent = function (id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingContent(true);
                    return [4 /*yield*/, viewContent(id)];
                case 1:
                    _a.sent();
                    setLoadingContent(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handlePromptThread = function (thread_id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingPrompts(true);
                    return [4 /*yield*/, viewThread(thread_id)];
                case 1:
                    _a.sent();
                    setLoadingPrompts(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "p-5 bg-white rounded-md mb-5 flex sm:flex-row flex-col sm:items-center items-start justify-between gap-5", children: [_jsxs("div", { className: "flex-grow w-full", children: [_jsx("p", { className: "".concat(statusColors[campaign.status], " font-medium"), children: campaign.status }), _jsxs("div", { className: "flex sm:flex-row flex-col sm:items-center justify-between sm:gap-0 gap-3", children: [_jsx("h2", { className: "text-lg text-[#111928] capitalize font-semibold mr-5", children: campaign.name }), _jsxs("div", { className: "flex sm:flex-row flex-col sm:items-center sm:gap-12 gap-3 flex-wrap mt-1 flex-grow max-w-[70%]", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[#6B7280] text-sm capitalize", children: "duration: " }), _jsx("p", { className: "font-medium text-[#111928] capitalize", children: campaign.duration > 0
                                                    ? "".concat(campaign.duration, " ").concat(campaign.duration > 1 ? 'weeks' : 'week')
                                                    : 'not selected' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[#6B7280] text-sm capitalize", children: "post/day: " }), _jsx("p", { className: "font-medium text-[#111928] capitalize", children: campaign.frequency > 0 ? campaign.frequency : 'not selected' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[#6B7280] text-sm capitalize", children: "created at: " }), _jsx("p", { className: "font-medium text-[#111928]", children: campaign.created_at })] })] })] })] }), campaign.thread_id && (_jsx(SecondaryButton, { label: "prompt thread", loading: loadingPrompts, onClick: function () { return handlePromptThread(campaign.thread_id); } })), campaign.status !== 'Draft' && (_jsx(SecondaryButton, { label: "View Content", loading: loadingContent, onClick: function () { return handleViewContent(campaign.id); } }))] }));
}
//# sourceMappingURL=UserCampaignsData.js.map