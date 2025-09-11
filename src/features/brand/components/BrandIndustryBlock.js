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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useContext, useEffect, useState } from 'react';
import { BrandContext } from '../context/BrandContext';
import EditBlock from '../../../components/shared/EditBlock';
import BrandDetailsInput from '../../../shared/components/inputs/BrandDetailsInput';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
export default function BrandIndustryBlock() {
  var _a = useState(''),
    industry = _a[0],
    setIndustry = _a[1];
  var _b = useState(''),
    vertical = _b[0],
    setVertical = _b[1];
  var _c = useState({
      industry: false,
      vertical: false,
    }),
    error = _c[0],
    setError = _c[1];
  var _d = useState(false),
    edit = _d[0],
    setEdit = _d[1];
  var _e = useContext(BrandContext),
    businessInfo = _e.businessInfo,
    setBusinessInfo = _e.setBusinessInfo;
  var handleIndustryChange = function (e) {
    var value = e.target.value;
    setError(function (old) {
      return __assign(__assign({}, old), { industry: !value });
    });
    setIndustry(value);
  };
  var handleVerticalChange = function (e) {
    var value = e.target.value;
    setError(function (old) {
      return __assign(__assign({}, old), { vertical: !value });
    });
    setVertical(value);
  };
  var handleSubmit = function () {
    if (!error.industry && !error.vertical) {
      setBusinessInfo(
        __assign(__assign({}, businessInfo), { industry: industry, vertical: vertical })
      );
      setEdit(false);
    }
  };
  useEffect(
    function () {
      if (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.industry)
        setIndustry(
          businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.industry
        );
      if (businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.vertical)
        setVertical(
          businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.vertical
        );
    },
    [businessInfo]
  );
  return _jsxs('div', {
    className: 'p-[20px] bg-[#F0F5FF] rounded-lg mt-7',
    children: [
      edit &&
        _jsxs(_Fragment, {
          children: [
            _jsx(EditBlock, {
              onClick: function () {
                return setEdit(true);
              },
              disabled: edit,
              className: 'ml-auto',
            }),
            _jsxs('div', {
              children: [
                _jsxs('div', {
                  className: 'mb-5',
                  children: [
                    _jsx('label', {
                      htmlFor: 'industry',
                      className: 'block mb-2 font-medium capitalize',
                      children: 'industry',
                    }),
                    _jsx(BrandDetailsInput, {
                      id: 'industry',
                      type: 'text',
                      value: industry,
                      onChange: handleIndustryChange,
                    }),
                    error.industry &&
                      _jsx('p', {
                        className: 'text-[#F05252] text-sm font-medium mt-1',
                        children: 'Please provide your brand industry',
                      }),
                  ],
                }),
                _jsxs('div', {
                  className: 'mb-3',
                  children: [
                    _jsx('label', {
                      htmlFor: 'vertical',
                      className: 'block mb-2 font-medium capitalize',
                      children: 'vertical',
                    }),
                    _jsx(BrandDetailsInput, {
                      id: 'vertical',
                      type: 'text',
                      value: vertical,
                      onChange: handleVerticalChange,
                    }),
                    error.vertical &&
                      _jsx('p', {
                        className: 'text-[#F05252] text-sm font-medium mt-1',
                        children: 'Please provide your brand vertical',
                      }),
                  ],
                }),
                _jsx(PurpleButton, {
                  disabled: error.vertical || error.industry,
                  type: 'button',
                  onClick: handleSubmit,
                  className: 'mt-4',
                  children: 'Save',
                }),
              ],
            }),
          ],
        }),
      !edit &&
        industry &&
        _jsx(_Fragment, {
          children: _jsxs('div', {
            className: 'flex items-center justify-between align-top',
            children: [
              _jsxs('p', {
                className: 'text-sm font-medium leading-[18px]',
                children: [
                  businessInfo === null || businessInfo === void 0 ? void 0 : businessInfo.name,
                  ' is in the ',
                  industry,
                  ' industry in the ',
                  vertical,
                  ' vertical.',
                ],
              }),
              _jsx(EditBlock, {
                onClick: function () {
                  return setEdit(true);
                },
                disabled: edit,
              }),
            ],
          }),
        }),
    ],
  });
}
//# sourceMappingURL=BrandIndustryBlock.js.map
