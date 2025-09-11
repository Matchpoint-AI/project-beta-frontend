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
import BrandDetailsInput from '../../shared/components/inputs/BrandDetailsInput';
import PurpleButton from '../../shared/components/buttons/PurpleButton';
// import { TbArrowBackUp } from "react-icons/tb";
import { CampaignContext } from '../../context/CampaignContext';
export default function ChipsEditBlock(_a) {
  var initValues = _a.initValues,
    saveValues = _a.saveValues,
    closeEdit = _a.closeEdit,
    className = _a.className,
    max = _a.max,
    genre = _a.genre;
  var campaignInfo = useContext(CampaignContext).campaignInfo;
  var _b = useState(
      Array.from({ length: max }, function () {
        return '';
      })
    ),
    values = _b[0],
    setValues = _b[1];
  var handleRemove = function (chipIndex) {
    var newChips = Array.from(values);
    newChips[chipIndex] = '';
    setValues(newChips);
  };
  var handleChange = function (chipIndex, value) {
    setValues(function (old) {
      var newValues = Array.from(old);
      newValues[chipIndex] = value;
      return newValues;
    });
  };
  var handleSave = function () {
    saveValues(
      values.filter(function (v) {
        return v;
      })
    );
    closeEdit();
  };
  var handleReset = function () {
    if (campaignInfo.audienceEmotion && genre === 'emotion')
      setValues(campaignInfo.audienceEmotion);
    else if (campaignInfo.audienceInterests && genre === 'interests')
      setValues(campaignInfo.audienceInterests);
  };
  useEffect(
    function () {
      setValues(function (old) {
        var newArr = Array.from(old);
        var chuncked =
          (initValues === null || initValues === void 0 ? void 0 : initValues.splice(0, 3)) || [];
        newArr.splice.apply(newArr, __spreadArray([0, chuncked.length], chuncked, false));
        return newArr;
      });
    },
    [initValues]
  );
  return _jsxs('div', {
    className: className,
    children: [
      _jsx('div', {
        children: values.map(function (v, i) {
          return _jsxs(
            'div',
            {
              className: 'flex items-center justify-between gap-[10px] mb-5',
              children: [
                _jsx(BrandDetailsInput, {
                  value: v,
                  onChange: function (e) {
                    return handleChange(i, e.target.value);
                  },
                }),
                _jsx('button', {
                  type: 'button',
                  onClick: function () {
                    return handleRemove(i);
                  },
                  children: _jsx('img', { src: '/remove_tag.svg', alt: 'remove tag' }),
                }),
              ],
            },
            i
          );
        }),
      }),
      _jsxs('div', {
        className: 'flex items-center gap-3',
        children: [
          genre &&
            ((genre === 'emotion' && campaignInfo.audienceEmotion) ||
              (genre === 'interests' && campaignInfo.audienceInterests)) &&
            _jsx('button', {
              type: 'button',
              onClick: handleReset,
              className:
                'px-5 py-3 flex items-center justify-center gap-2 border border-[#6B7280] rounded-lg disabled:cursor-not-allowed',
              children: _jsx('span', {
                className: 'capitalize text-[#6B7280] font-medium text-sm',
                children: 'Reset',
              }),
            }),
          _jsx(PurpleButton, { type: 'button', onClick: handleSave, children: 'Save' }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=ChipsEditBlock.js.map
