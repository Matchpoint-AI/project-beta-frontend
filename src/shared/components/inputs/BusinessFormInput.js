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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useContext, useEffect } from 'react';
import FormInputBox from './FormInputBox';
import { LinkSymbol } from '../ui/LinkSymbol';
import ClearIcon from '@mui/icons-material/Clear';
import { BrandContext } from '../../../features/brand/context/BrandContext';
import { useAuth } from '../../../features/auth/context/AuthContext';
export default function BusinessFormInput(props) {
    var _a = useContext(BrandContext), businessInfo = _a.businessInfo, setBusinessInfo = _a.setBusinessInfo;
    var profile = useAuth().profile;
    var _b = useState(null), error = _b[0], setError = _b[1];
    var _c = useState(''), value = _c[0], setValue = _c[1];
    var handleChange = function (e) {
        if (profile === null || profile === void 0 ? void 0 : profile.hasBrand)
            return;
        var input = e.target.value;
        setValue(input);
        setError(!props.validateInput(input));
    };
    var clearInput = function () {
        var _a;
        if (profile === null || profile === void 0 ? void 0 : profile.hasBrand)
            return;
        setValue('');
        setBusinessInfo(__assign(__assign({}, businessInfo), (_a = {}, _a[props.subject] = '', _a)));
        setError(true);
    };
    var saveValue = function () {
        var _a;
        if (profile === null || profile === void 0 ? void 0 : profile.hasBrand)
            return;
        var finalValue = error ? '' : value;
        setError(!props.validateInput(finalValue));
        setBusinessInfo(__assign(__assign({}, businessInfo), (_a = {}, _a[props.subject] = finalValue, _a)));
    };
    useEffect(function () {
        if (props.runValidation === 0)
            return;
        var inputError = props.validateInput(value);
        setError(!inputError);
        props.setFormError(function (old) { return ({
            count: old.count + 1,
            error: !inputError,
        }); });
    }, [props.runValidation]);
    useEffect(function () {
        if (businessInfo.name && props.subject === 'name') {
            setValue(businessInfo.name);
            setError(!props.validateInput(businessInfo.name));
        }
        if (businessInfo.website && props.subject === 'website') {
            setValue(businessInfo.website);
            setError(!props.validateInput(businessInfo.website));
        }
    }, [businessInfo]);
    return (_jsxs("div", { children: [_jsx("h1", { className: "mb-3 text-xl font-semibold text-gray-900", children: props.title }), props.description && _jsx("p", { className: "text-[14px] mb-3", children: props.description }), _jsxs(FormInputBox, { color: error === null ? '#d1d5db' : error ? '#F05252' : '#0E9F6E', children: [props.type === 'link' && (_jsx(LinkSymbol, { color: error === null ? '#6B7280' : error ? '#6c0404' : '#046C4E' })), _jsx("input", { value: value, type: "text", disabled: profile === null || profile === void 0 ? void 0 : profile.hasBrand, placeholder: props === null || props === void 0 ? void 0 : props.placeholder, onChange: handleChange, onBlur: saveValue, className: "text-sm w-full bg-transparent outline-none", style: {
                            color: "".concat(error === null ? '#111827' : error ? '#6c0404' : '#046C4E'),
                        } }), _jsx("button", { disabled: profile === null || profile === void 0 ? void 0 : profile.hasBrand, type: "button", onClick: clearInput, className: "disabled:cursor-not-allowed", children: _jsx(ClearIcon, { sx: {
                                color: "".concat(error === null ? '#6B7280' : error ? '#6c0404' : '#046C4E'),
                            } }) })] }), error !== null && error && (_jsx("p", { className: "text-[#F05252] text-sm font-medium mt-1", children: "Please provide a valid value" }))] }));
}
//# sourceMappingURL=BusinessFormInput.js.map