import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams } from 'react-router-dom';
import EmailInputForReset from './EmailInputForReset';
import PasswordResetForm from '../PasswordResetForm';
export default function ResetPassword(_a) {
    var setOpen = _a.setOpen;
    var params = useSearchParams()[0];
    var actionCode = params.get('oobCode');
    return (_jsx("div", { className: "flex flex-col items-center py-20 bg-gradient-to-br from-white to-[#b4b1d5] h-screen", children: _jsxs("div", { className: "flex flex-col w-[90%] md:w-[600px]", children: [_jsxs("h1", { className: "sm:text-2xl text-xl text-start font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#681DBA] to-[#FF43E1] mt-10", children: ["Welcome to Matchpoint.", _jsx("br", { className: "sm:hidden block" }), " Let\u2019s get you in!"] }), actionCode && _jsx(PasswordResetForm, { setOpenToast: setOpen }), !actionCode && _jsx(EmailInputForReset, { setOpenToast: setOpen })] }) }));
}
//# sourceMappingURL=ResetPassword.js.map