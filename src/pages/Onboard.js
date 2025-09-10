import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import OnboardForms from '../components/onboard/OnboardForms';
import BrandProfileEdit from '../components/BrandProfileEdit';
import { CircularProgress } from '@mui/material';
var Onboard = function () {
  var _a = useAuth(),
    profile = _a.profile,
    isLoading = _a.isLoading;
  var _b = useState(false),
    editSavedBrand = _b[0],
    toggleEdit = _b[1];
  if (isLoading) {
    return _jsxs('div', {
      className: 'w-full min-h-screen flex flex-col gap-5 justify-center items-center',
      children: [
        _jsx(CircularProgress, { sx: { color: '#42389D' }, size: 80, thickness: 5 }),
        _jsx('h1', {
          className: 'text-2xl font-semibold leading-9 text-gradient',
          children: 'We are loading your data',
        }),
      ],
    });
  }
  console.log('hasbrand', profile.hasBrand);
  return _jsx('div', {
    className:
      ' min-w-full min-h-screen bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] items-center lg:items-start md:pl-[100px] lg:pl-[100px] md:pr-[20px] lg:pr-[20px] p-4 lg:p-0',
    children:
      (profile === null || profile === void 0 ? void 0 : profile.hasBrand) && !editSavedBrand
        ? _jsx(BrandProfileEdit, { toggleEdit: toggleEdit, hasBrand: profile.hasBrand })
        : _jsx(OnboardForms, { edit: editSavedBrand }),
  });
};
export default Onboard;
//# sourceMappingURL=Onboard.js.map
