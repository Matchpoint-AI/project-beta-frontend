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
import Sidebar from '../components/shared/Sidebar';
import useFetchUserData from '../hooks/useFetchUserData';
import UserDataBlocks from '../components/userdata/UserDataBlocks';
import { CircularProgress } from '@mui/material';
import { RiErrorWarningLine } from 'react-icons/ri';
import { getServiceURL } from '../helpers/getServiceURL';
import { CampaignContentWin, CampaignThreadWin } from '../features/campaign';
import { useAuth } from '../features/auth/context/AuthContext';
import useFetchThreadMessages from '../hooks/useFetchThreadMessages';
export default function UserDataPage() {
    var _this = this;
    var _a = useFetchUserData(), data = _a[0], loading = _a[1], __error = _a[2], handleRetry = _a[3];
    var profile = useAuth().profile;
    var _b = useState(false), openContentWin = _b[0], setOpenContentWin = _b[1];
    var _c = useState([]), content = _c[0], setContent = _c[1];
    var _d = useFetchThreadMessages(), messages = _d[0], openThreadWin = _d[1], setOpenThreadWin = _d[2], fetchMessages = _d[3], addMessage = _d[4], popMessage = _d[5];
    var handleOpenWindow = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var endpointUrl, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpointUrl = getServiceURL('data');
                    return [4 /*yield*/, fetch("".concat(endpointUrl, "/api/v1/users/campaign/").concat(id), {
                            headers: {
                                Authorization: "Bearer ".concat(profile === null || profile === void 0 ? void 0 : profile.token),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setContent(data);
                    setOpenContentWin(true);
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "w-full h-full", children: [_jsxs("div", { className: "flex w-full lg:flex-row flex-col bg-gradient-to-b min-h-screen from-[#F1FDFF] to-[#F5D9FF]", children: [_jsx(Sidebar, {}), loading && (_jsxs("div", { className: "w-full min-h-screen flex flex-col gap-5 justify-center items-center", children: [_jsx(CircularProgress, { sx: { color: '#42389D' }, size: 80, thickness: 5 }), _jsx("h1", { className: "text-2xl font-semibold leading-9 text-gradient", children: "Fetching user data" })] })), !loading && _error && (_jsxs("div", { className: "w-full min-h-screen flex flex-col gap-5 justify-center items-center", children: [_jsx(RiErrorWarningLine, { size: 64, color: "#F05252" }), _jsx("h1", { className: "font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]", children: "Unexpected Error" }), _jsxs("p", { className: "text-[#30175A] md:text-lg text-base text-center max-w-[600px]", children: ["Sorry, unexpected _error happend while fetching user data", _jsx("br", {}), "Please retry."] }), _jsx("button", { className: "flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg py-3 px-5", onClick: handleRetry, children: "Retry" })] })), !loading && !_error && (_jsx("div", { className: "md:ml-[80px] flex-grow flex flex-col gap-8 p-8 md:mt-8 mt-[80px]", children: _jsx(UserDataBlocks, { data: data, viewContent: handleOpenWindow, viewThread: fetchMessages }) }))] }), _jsx(CampaignContentWin, { open: openContentWin, onClose: function () { return setOpenContentWin(false); }, content: content }), _jsx(CampaignThreadWin, { open: openThreadWin, onClose: function () { return setOpenThreadWin(false); }, messages: messages, addMessage: addMessage, popMessage: popMessage })] }));
}
//# sourceMappingURL=UserDataPage.js.map