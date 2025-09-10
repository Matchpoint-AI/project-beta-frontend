import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthForm from './AuthForm';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
var AuthUIWrapper = function (_a) {
  var _b = _a.login,
    login = _b === void 0 ? false : _b;
  var _c = useState(''),
    authError = _c[0],
    setAuthError = _c[1];
  return _jsxs(_Fragment, {
    children: [
      _jsx(Navbar, {}),
      _jsx('div', {
        className:
          'flex flex-col items-center py-20 bg-gradient-to-br from-white to-[#b4b1d5] min-h-screen ',
        children: _jsxs('div', {
          className: 'flex flex-col w-[90%] md:w-[600px]',
          children: [
            _jsxs('h1', {
              className:
                'sm:text-2xl text-xl text-start font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#681DBA] to-[#FF43E1] mt-10',
              children: [
                'Welcome to Matchpoint.',
                _jsx('br', { className: 'sm:hidden block' }),
                ' Let\u2019s get you in!',
              ],
            }),
            _jsx('div', {
              className: 'w-full bg-white mt-5 py-10 rounded-lg mb-14',
              children: _jsx(AuthForm, { login: login, setAuthError: setAuthError }),
            }),
          ],
        }),
      }),
      _jsx(ErrorToast, {
        message: authError,
        open: authError !== '',
        onClose: function () {
          return setAuthError('');
        },
      }),
      _jsx(Footer, {}),
    ],
  });
};
export default AuthUIWrapper;
//# sourceMappingURL=AuthUIWrapper.js.map
