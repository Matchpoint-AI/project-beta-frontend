var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { ClearIcon } from '@mui/x-date-pickers/icons';
import DayContentGalery from './DayContentGalery';
import RawData from '../RawData';
var Transition = React.forwardRef(function Transition(props, ref) {
  return _jsx(Slide, __assign({ direction: 'left', ref: ref }, props));
});
export default function CampaignContentWin(_a) {
  var open = _a.open,
    onClose = _a.onClose,
    content = _a.content;
  var _b = useState(0),
    selectedWeek = _b[0],
    setSelectedWeek = _b[1];
  var _c = useState(false),
    openDrawer = _c[0],
    setOpenDrawer = _c[1];
  return _jsx(Dialog, {
    fullScreen: true,
    open: open,
    onClose: onClose,
    TransitionComponent: Transition,
    sx: { zIndex: 10 },
    children: _jsxs('div', {
      className: 'p-7 bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] h-full overflow-y-auto',
      children: [
        _jsxs('div', {
          className: 'flex items-center justify-between',
          children: [
            _jsxs('div', {
              children: [
                Array.from({ length: content.length }, function (_, i) {
                  return i;
                }).map(function (i) {
                  return _jsx(
                    'button',
                    {
                      onClick: function () {
                        return setSelectedWeek(i);
                      },
                      className: 'mr-5 font-medium pb-2 '.concat(
                        selectedWeek == i
                          ? 'text-[#5145CD] border-b-2 border-[#5145CD]'
                          : 'text-[#6B7280]',
                        ' hover:border-b-2 hover:border-[#5145CD] hover:text-[#5145CD] transition-all duration-75 '
                      ),
                      children: 'Week '.concat(i + 1),
                    },
                    i
                  );
                }),
                _jsx('button', {
                  type: 'button',
                  className: 'py-2 px-5 bg-main-purple text-white font-medium rounded-lg ml-3',
                  onClick: function () {
                    return setOpenDrawer(true);
                  },
                  children: 'Raw',
                }),
              ],
            }),
            _jsx('button', {
              type: 'button',
              onClick: onClose,
              children: _jsx(ClearIcon, {
                sx: {
                  color: '#6B7280',
                },
              }),
            }),
          ],
        }),
        _jsx('div', {
          children:
            open &&
            content[selectedWeek].map(function (d, i) {
              return _jsx(DayContentGalery, { num: i + 1, content: d }, i);
            }),
        }),
        _jsx(RawData, {
          state: openDrawer,
          onClose: function () {
            return setOpenDrawer(false);
          },
          data: content,
        }),
      ],
    }),
  });
}
//# sourceMappingURL=CampaignContentWin.js.map
