import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useContext } from 'react';
import DetailsBlock from './shared/DetailsBlock';
import { BrandContext } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';
export default function BrandDetailsReview(_a) {
  var _b, _c, _d, _e;
  var stepHandler = _a.stepHandler,
    _f = _a.edit,
    edit = _f === void 0 ? true : _f;
  var businessInfo = useContext(BrandContext).businessInfo;
  var description = {
    mission: 'The goal you want to achieve as a company',
    values: 'The core beliefs that guide your interactions with customers',
    persona: 'The characteristics that identify who you are and how you behave',
    toneAndVoice: 'How your business speaks and verbally expresses its personality',
  };
  var navigate = useNavigate();
  var clickHandler = function (value) {
    stepHandler(1);
    navigate(
      {
        pathname: window.location.pathname,
        search: '?edit=true',
        hash: '#'.concat(value),
      },
      { replace: true }
    );
  };
  return _jsxs('div', {
    children: [
      typeof (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission) ===
        'string' &&
        _jsx(DetailsBlock, {
          edit: edit,
          title: 'mission',
          description: description.mission,
          onClick: function () {
            return clickHandler('mission');
          },
          children:
            businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission,
        }),
      typeof (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission) !==
        'string' &&
        _jsx(DetailsBlock, {
          edit: edit,
          title: 'mission',
          description: description.mission,
          onClick: function () {
            return clickHandler('mission');
          },
          children: _jsx('div', {
            className: 'flex flex-wrap gap-3',
            children: ((_b =
              businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.mission) !==
              null && _b !== void 0
              ? _b
              : []
            )
              .filter(function (c) {
                return c.selected;
              })
              .map(function (c) {
                return _jsx(
                  'div',
                  {
                    className:
                      'py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md',
                    children: String(c.label),
                  },
                  String(c.id)
                );
              }),
          }),
        }),
      _jsx(DetailsBlock, {
        edit: edit,
        title: 'values',
        description: description.values,
        onClick: function () {
          return clickHandler('values');
        },
        children: _jsx('div', {
          className: 'flex flex-wrap gap-3',
          children: ((_c =
            businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.values) !==
            null && _c !== void 0
            ? _c
            : []
          )
            .filter(function (c) {
              return c.selected;
            })
            .map(function (c) {
              return _jsx(
                'div',
                {
                  className:
                    'py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md',
                  children: String(c.label),
                },
                String(c.id)
              );
            }),
        }),
      }),
      _jsx(DetailsBlock, {
        edit: edit,
        title: 'persona',
        description: description.persona,
        onClick: function () {
          return clickHandler('persona');
        },
        children: _jsx('div', {
          className: 'flex flex-wrap gap-3',
          children: ((_d =
            businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.persona) !==
            null && _d !== void 0
            ? _d
            : []
          )
            .filter(function (c) {
              return c.selected;
            })
            .map(function (c) {
              return _jsx(
                'div',
                {
                  className:
                    'py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md',
                  children: String(c.label),
                },
                String(c.id)
              );
            }),
        }),
      }),
      _jsx(DetailsBlock, {
        edit: edit,
        title: 'tone of voice',
        description: description.toneAndVoice,
        onClick: function () {
          return clickHandler('toneAndVoice');
        },
        children: _jsx('div', {
          className: 'flex flex-wrap gap-3',
          children: ((_e =
            businessInfo === null || businessInfo === void 0
              ? void 0
              : businessInfo.toneAndVoice) !== null && _e !== void 0
            ? _e
            : []
          )
            .filter(function (c) {
              return c.selected;
            })
            .map(function (c) {
              return _jsx(
                'div',
                {
                  className:
                    'py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md',
                  children: c.label,
                },
                c.id
              );
            }),
        }),
      }),
    ],
  });
}
//# sourceMappingURL=BrandDetailsReview.js.map
