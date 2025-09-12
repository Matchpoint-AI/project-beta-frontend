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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Alert, Snackbar } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';
import VerifyEmail from '../components/VerifyEmail';
export default function AuthActions() {
    var params = useSearchParams()[0];
    var _a = useState({
        open: false,
        error: false,
        message: '',
    }), openToast = _a[0], setOpenToast = _a[1];
    var mode = params.get('mode');
    var navigate = useNavigate();
    var closeTestWindow = function () {
        setOpenToast(function (old) { return (__assign(__assign({}, old), { open: false })); });
    };
    useEffect(function () {
        if (!mode)
            navigate('/login');
    }, [mode, navigate]);
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), mode === 'resetPassword' && _jsx(ResetPassword, { setOpen: setOpenToast }), mode === 'verifyEmail' && _jsx(VerifyEmail, { setOpen: setOpenToast }), _jsx(Snackbar, { open: openToast.open, onClose: closeTestWindow, autoHideDuration: 6000, children: _jsx(Alert, { onClose: closeTestWindow, severity: "".concat(openToast.error ? 'error' : 'success'), sx: {
                        backgroundColor: openToast.error ? '#F05252' : '#388e3c',
                        color: 'white',
                    }, icon: false, children: openToast.message }) }), _jsx(Footer, {})] }));
}
//# sourceMappingURL=AuthActions.js.map