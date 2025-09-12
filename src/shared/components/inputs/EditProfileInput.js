import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import FormInputBox from './FormInputBox';
import ClearIcon from '@mui/icons-material/Clear';
export default function EditProfileInput(props) {
    var _a = useState(null), error = _a[0], setError = _a[1];
    var handleChange = function (e) {
        setError(props.validateInput(e.target.value));
        props.setValue(e.target.value);
    };
    var handleClear = function () {
        setError(true);
        props.setValue('');
    };
    return (_jsxs("div", { className: "sm:w-4/5 w-full max-w-[550px]", children: [_jsxs(FormInputBox, { color: error === null ? '#d1d5db' : error ? '#F05252' : '#0E9F6E', children: [_jsx("input", { type: props.type, value: props.value, onChange: handleChange, placeholder: props.placeholder, className: "text-sm w-full bg-transparent outline-none ", style: {
                            color: "".concat(error === null ? '#111827' : error ? '#6c0404' : '#046C4E'),
                        } }), _jsx("button", { type: "button", onClick: handleClear, children: _jsx(ClearIcon, { sx: {
                                color: "".concat(error === null ? '#6B7280' : error ? '#6c0404' : '#046C4E'),
                            } }) })] }), error && (_jsx("p", { className: "text-[#F05252] text-sm font-medium mt-1", children: props.subject === 'password'
                    ? 'Password must be at least 6 characters'
                    : "Please provide a valid ".concat(props.subject) }))] }));
}
//# sourceMappingURL=EditProfileInput.js.map