import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useAuthentication } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
export default function UserProfile() {
  var auth = useAuthentication().auth;
  var navigate = useNavigate();
  var handleLogout = function () {
    if (!auth) return;
    signOut(auth)
      .then(function () {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      })
  };
  return _jsxs('div', {
    className: 'flex flex-col mx-auto flex-grow',
    children: [
      _jsxs('div', {
        className: 'mb-32',
        children: [
          _jsxs('div', {
            className: 'flex gap-x-14 mb-6',
            children: [
              _jsx('div', {
                className: "text-gray-600 text-xs font-semibold font-['Inter'] leading-[18px]",
                children: 'COMPANY',
              }),
              _jsx('img', {
                className: 'w-[156px] h-[18.69px]',
                src: '/business_logo.svg',
                alt: 'logo',
              }),
            ],
          }),
          _jsx('div', { className: 'w-[633px] h-[0px] border-[0.5px] border-gray-400' }),
          _jsxs('div', {
            className: 'flex items-center my-8 gap-20',
            children: [
              _jsx('div', { className: 'text-gray-600 text-xs font-semibold ', children: 'NAME' }),
              _jsx('div', {
                className: 'text-gray-800 text-base font-medium ',
                children: 'Andre Smith',
              }),
            ],
          }),
          _jsx('div', { className: 'w-[633px] h-[0px] border-[0.5px] border-gray-400' }),
          _jsxs('div', {
            className: 'flex items-center my-8 gap-20',
            children: [
              _jsx('div', {
                className: 'text-gray-600 text-xs font-semibold  ',
                children: 'EMAIL',
              }),
              _jsx('div', {
                className: 'text-gray-800 text-base font-medium  ',
                children: 'AndreSmith@outschool.com',
              }),
            ],
          }),
          _jsx('div', { className: 'w-[633px] h-[0px] border-[0.5px] border-gray-400' }),
          _jsxs('div', {
            className: 'flex items-center my-8 gap-20',
            children: [
              _jsx('div', {
                className: 'text-gray-600 text-xs font-semibold ',
                children: 'PASSWORD',
              }),
              _jsx('div', {
                className: 'text-gray-800 text-base font-medium ',
                children: '**************',
              }),
            ],
          }),
          _jsx('div', { className: 'w-[633px] h-[0px] border-[0.5px] border-gray-400' }),
          _jsxs('div', {
            className: 'flex items-center my-8 gap-20',
            children: [
              _jsx('div', {
                className: 'text-gray-600 text-xs font-semibold ',
                children: 'WEBSITE',
              }),
              _jsx('div', {
                className: 'text-gray-800 text-base font-medium ',
                children: 'www.outschool.com',
              }),
            ],
          }),
          _jsx('div', { className: 'w-[633px] h-[0px] border-[0.5px] border-gray-400' }),
        ],
      }),
      _jsxs('div', {
        className: 'flex flex-row justify-between gap-2  w-fit h-fit',
        children: [
          _jsx('div', {
            className:
              'w-[98px] h-12 px-5 py-3 opacity-40 bg-indigo-700 rounded-lg justify-center items-center gap-2 inline-flex',
            children: _jsx('div', {
              className: "text-white text-base font-medium font-['Inter'] leading-normal",
              children: 'Save',
            }),
          }),
          _jsx('button', {
            className:
              " p-2 rounded-md bg-indigo-700 w-[98px] text-white text-base font-medium font-['Inter'] leading-normal ",
            onClick: handleLogout,
            children: 'log out',
          }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=profile.js.map
