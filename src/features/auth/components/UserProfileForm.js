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
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import updateUserProfile from '../../../helpers/updateUserProfile';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import { CircularProgress } from '@mui/material';
import EditProfileInput from '../../../shared/components/inputs/EditProfileInput';
export default function UserProfileForm(_a) {
    var _this = this;
    var edit = _a.edit;
    var _b = useAuth(), profile = _b.profile, setProfile = _b.setProfile;
    var _c = useState(''), name = _c[0], setName = _c[1];
    var _d = useState(''), email = _d[0], setEmail = _d[1];
    var _e = useState(''), password = _e[0], setPassword = _e[1];
    var _f = useState(''), requestError = _f[0], setRequestError = _f[1];
    var _g = useState(false), submiting = _g[0], setSubmiting = _g[1];
    useEffect(function () {
        var _a, _b;
        setName((_a = profile === null || profile === void 0 ? void 0 : profile.name) !== null && _a !== void 0 ? _a : '');
        setEmail((_b = profile === null || profile === void 0 ? void 0 : profile.email) !== null && _b !== void 0 ? _b : '');
    }, [profile]);
    var nameIsInvalid = useCallback(function (newName) {
        if (newName.trim() === '')
            return true;
        return false;
    }, []);
    var emailIsInvalid = useCallback(function (newEmail) {
        return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newEmail);
    }, []);
    var passwordIsInvalid = useCallback(function (newPassword) {
        if (newPassword.length >= 1 && newPassword.length <= 5)
            return true;
        if (newPassword.length == 0)
            return null;
        return false;
    }, []);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var _a, updatedEmail, updatedName, _error_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    e.preventDefault();
                    setSubmiting(true);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, , 6]);
                    if (!(nameIsInvalid(name) || emailIsInvalid(email) || passwordIsInvalid(password))) return [3 /*break*/, 2];
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, updateUserProfile((_b = profile === null || profile === void 0 ? void 0 : profile.token) !== null && _b !== void 0 ? _b : '', name, email, password)];
                case 3:
                    _a = _e.sent(), updatedEmail = _a.email, updatedName = _a.name;
                    setProfile(__assign(__assign({}, profile), { id: (_c = profile === null || profile === void 0 ? void 0 : profile.id) !== null && _c !== void 0 ? _c : '', role: (_d = profile === null || profile === void 0 ? void 0 : profile.role) !== null && _d !== void 0 ? _d : '', email: updatedEmail, name: updatedName }));
                    setRequestError(null);
                    setTimeout(function () { return setRequestError(''); }, 2000);
                    _e.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    _error_1 = _e.sent();
                    setRequestError(error.message);
                    return [3 /*break*/, 6];
                case 6:
                    setSubmiting(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(_Fragment, { children: [_jsxs("form", { className: "mt-16", onSubmit: handleSubmit, children: [_jsxs("div", { className: "flex sm:flex-row flex-col sm:gap-0 gap-3 sm:items-center items-start my-6 justify-between max-w-[633px]", children: [_jsx("div", { className: "text-gray-600 text-xs font-semibold leading-[18px]", children: "NAME" }), edit ? (_jsx(EditProfileInput, { type: "text", value: name, setValue: setName, placeholder: "New Name", subject: "name", validateInput: nameIsInvalid })) : (_jsx("div", { className: "text-gray-800 text-base font-medium leading-normal py-[11px] pr-[11px] sm:w-4/5 w-full max-w-[550px] overflow-x-auto", children: profile === null || profile === void 0 ? void 0 : profile.name }))] }), _jsx("div", { className: "max-w-[633px] h-[0px] border-[0.5px] border-gray-400" }), _jsxs("div", { className: "flex sm:flex-row flex-col sm:gap-0 gap-3 sm:items-center items-start my-6 justify-between max-w-[633px]", children: [_jsx("div", { className: "text-gray-600 text-xs font-semibold leading-[18px]", children: "EMAIL" }), edit ? (_jsx(EditProfileInput, { type: "email", value: email, setValue: setEmail, placeholder: "New Email", subject: "email", validateInput: emailIsInvalid })) : (_jsx("div", { className: "text-gray-800 text-base font-medium leading-normal py-[11px] pr-[11px] sm:w-4/5 w-full max-w-[550px] overflow-x-auto", children: profile === null || profile === void 0 ? void 0 : profile.email }))] }), _jsx("div", { className: "max-w-[633px] h-[0px] border-[0.5px] border-gray-400" }), _jsxs("div", { className: "flex sm:flex-row flex-col sm:gap-0 gap-3 sm:items-center items-start my-6 justify-between max-w-[633px]", children: [_jsx("div", { className: "text-gray-600 text-xs font-semibold leading-[18px]", children: "PASSWORD" }), edit ? (_jsx(EditProfileInput, { type: "password", value: password, setValue: setPassword, placeholder: "New Password", subject: "password", validateInput: passwordIsInvalid })) : (_jsx("div", { className: "text-gray-800 text-base font-medium leading-normal py-[11px] pr-[11px] sm:w-4/5 w-full max-w-[550px] overflow-x-auto", children: "**************" }))] }), _jsx("div", { className: "max-w-[633px] h-[0px] border-[0.5px] border-gray-400" }), _jsx("button", { type: "submit", disabled: !edit || submiting, className: "w-[98px] h-12 bg-main-purple  rounded-lg justify-center items-center gap-2 inline-flex text-white text-base font-medium leading-normal mt-32 disabled:cursor-not-allowed", style: {
                            opacity: edit ? '1' : '.4',
                        }, children: submiting ? (_jsx(CircularProgress, { sx: { color: '#ffffff' }, size: 25, thickness: 5 })) : ('Save') })] }), _jsx(ErrorToast, { open: requestError === null || requestError !== '', onClose: function () { return setRequestError(''); }, message: requestError !== null && requestError !== void 0 ? requestError : 'Profile updated successfully', success: true })] }));
}
//# sourceMappingURL=UserProfileForm.js.map