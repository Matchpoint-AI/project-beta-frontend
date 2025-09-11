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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useContext, useEffect, useState } from 'react';
import BrandDetailsInput from '../../../shared/components/inputs/BrandDetailsInput';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
import { BrandContext } from '../context/BrandContext';
export default function BrandDetailsEditBlock(_a) {
  var initValues = _a.initValues,
    category = _a.category,
    closeEdit = _a.closeEdit;
  var _b = useState(
      Array.from({ length: 3 }, function (_, i) {
        return {
          id: i,
          label: '',
          selected: true,
        };
      })
    ),
    values = _b[0],
    setValues = _b[1];
  var _c = useContext(BrandContext),
    businessInfo = _c.businessInfo,
    setBusinessInfo = _c.setBusinessInfo;
  var handleRemove = function (chipIndex) {
    var newChips = Array.from(values);
    newChips[chipIndex].label = '';
    setValues(newChips);
  };
  var handleChange = function (chipIndex, value) {
    setValues(function (old) {
      var newValues = Array.from(old);
      newValues[chipIndex].label = value;
      return newValues;
    });
  };
  var handleSave = function () {
    var _a;
    setBusinessInfo(
      __assign(
        __assign({}, businessInfo),
        ((_a = {}),
        (_a[category] = values.filter(function (v) {
          return v.label;
        })),
        _a)
      )
    );
    closeEdit();
  };
  useEffect(
    function () {
      var newValues = initValues.splice(0, 3).map(function (v, i) {
        return __assign(__assign({}, v), { id: i });
      });
      setValues(function (old) {
        var newChips = Array.from(old);
        newChips.splice.apply(newChips, __spreadArray([0, newValues.length], newValues, false));
        return newChips;
      });
    },
    [initValues]
  );
  return _jsxs('div', {
    children: [
      _jsx('div', {
        children: values.map(function (v, i) {
          return _jsxs(
            'div',
            {
              className: 'flex items-center justify-between gap-[10px] mb-5',
              children: [
                _jsx(BrandDetailsInput, {
                  value: v.label,
                  onChange: function (e) {
                    return handleChange(i, e.target.value);
                  },
                }),
                _jsx('button', {
                  onClick: function () {
                    return handleRemove(i);
                  },
                  children: _jsx('img', { src: '/remove_tag.svg', alt: 'remove tag' }),
                }),
              ],
            },
            v.id
          );
        }),
      }),
      _jsx(PurpleButton, { type: 'button', onClick: handleSave, children: 'Save' }),
    ],
  });
}
//# sourceMappingURL=BrandDetailsEditBlock.js.map
