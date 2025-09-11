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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { applyActionCode } from 'firebase/auth';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useAuthentication } from '../../../lib/firebase';
import { CircularProgress } from '@mui/material';
import { getServiceURL } from '../../../helpers/getServiceURL';
import Cookies from 'universal-cookie';
export default function VerifyEmail(_a) {
    var _this = this;
    var setOpen = _a.setOpen;
    var params = useSearchParams()[0];
    var auth = useAuthentication().auth;
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(false), error = _c[0], setError = _c[1];
    var _d = useState(false), verified = _d[0], setVerified = _d[1];
    var _e = useState(false), resendLoading = _e[0], setResendLoading = _e[1];
    var code = params.get('oobCode');
    var navigate = useNavigate();
    var cookies = new Cookies();
    var handleVerifyEmail = function () { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, applyActionCode(auth, code)];
                case 1:
                    _a.sent();
                    setVerified(true);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    setError(true);
                    return [3 /*break*/, 3];
                case 3:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var resendVerification = function () { return __awaiter(_this, void 0, void 0, function () {
        var endpointUrl, email, name, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpointUrl = getServiceURL('data');
                    email = cookies.get('email');
                    name = cookies.get('name');
                    setResendLoading(true);
                    return [4 /*yield*/, fetch("".concat(endpointUrl, "/api/v1/user/resend-verification"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email, name: name }),
                        })];
                case 1:
                    resp = _a.sent();
                    if (!resp.ok) {
                        setOpen({
                            open: true,
                            error: true,
                            message: 'Could not resend verification link',
                        });
                    }
                    else {
                        setOpen({
                            open: true,
                            error: false,
                            message: 'Verification link was sent to your email',
                        });
                    }
                    setResendLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        if (!auth)
            return;
        if (code) {
            setLoading(true);
            handleVerifyEmail();
        }
        else
            navigate('/login');
    }, [code, navigate, auth]);
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#F9D2FF] to-[#8DA6FF] min-h-screen", children: [loading && (_jsxs(_Fragment, { children: [_jsx(CircularProgress, { sx: { color: '#30175A' }, size: 64, thickness: 4 }), _jsx("h1", { className: "font-medium md:text-[36px] sm:text-[28px] text-[20px] text-center text-[#30175A] capitalize mt-5", children: "We are Verifying Your Email ..." })] })), verified && (_jsxs(_Fragment, { children: [_jsx(IoMdCheckmarkCircleOutline, { size: 64, color: "#30175A" }), _jsx("h1", { className: "font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A]", children: "Email Verified Successfully" }), _jsx("p", { className: "text-[#30175A] md:text-lg text-base text-center max-w-[600px]", children: "Thank you for verifying your email address! Your account is now fully activated, and you can explore all our features." }), _jsx(Link, { to: "/login", className: "font-semibold mt-5 bg-[#5145CD] text-white py-3 px-8 rounded-lg", children: "Login" })] })), error && (_jsxs(_Fragment, { children: [_jsx(RiErrorWarningLine, { size: 64, color: "#F05252" }), _jsx("h1", { className: "font-medium md:text-[42px] sm:text-[32px] text-[28px] text-center text-[#30175A] capitalize", children: "Error verifying your email" }), _jsxs("p", { className: "text-[#30175A] md:text-lg text-base text-center max-w-[600px]", children: ["We couldn't verify your email address. This might be due to an expired or invalid verification link.", _jsx("br", {}), "Please try again by requesting a new verification email."] }), _jsx("button", { className: "flex items-center justify-center font-semibold mt-5 bg-[#5145CD] text-white rounded-lg w-[95%] max-w-[120px] min-h-[50px]", onClick: resendVerification, children: resendLoading ? (_jsx(CircularProgress, { sx: { color: '#fff' }, size: 25, thickness: 5 })) : ('Resend') })] }))] }));
}
//# sourceMappingURL=VerifyEmail.js.map