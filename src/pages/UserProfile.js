import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// UserProfile.tsx
import { useState } from 'react';
import { UserProfileForm } from '../features/auth';
var UserProfile = function () {
  var _a = useState(false),
    edit = _a[0],
    setEdit = _a[1];
  return _jsx('div', {
    className: 'w-full h-full',
    children: _jsx('div', {
      className: 'flex w-full lg:flex-row flex-col',
      children: _jsx('div', {
        className: 'flex-grow flex flex-col sm:p-8 p-0 text-[#747474] ',
        children: _jsxs('div', {
          className: 'p-3',
          children: [
            _jsx('div', {
              className:
                'w-[211px] bg-gradient-to-r bg-clip-text text-transparent from-[#681DBA] to-[#FF43E1] text-2xl font-semibold leading-9',
              children: 'My Profile',
            }),
            _jsxs('div', {
              className: 'mb-4 mt-8 flex items-center gap-3',
              children: [
                _jsx('div', {
                  className: 'text-zinc-600 text-[17px] font-bold leading-relaxed',
                  children: 'BASIC INFO',
                }),
                _jsx('button', {
                  className: 'text-fuchsia-500 text-xs font-bold leading-[18px]',
                  onClick: function () {
                    return setEdit(function (old) {
                      return !old;
                    });
                  },
                  children: 'EDIT',
                }),
              ],
            }),
            _jsx('div', { className: 'w-full h-[0px] border border-violet-800' }),
            _jsx(UserProfileForm, { edit: edit }),
          ],
        }),
      }),
    }),
  });
};
export default UserProfile;
//# sourceMappingURL=UserProfile.js.map
