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
import React, { useContext, useEffect, useState } from 'react';
import { CampaignContext } from '../../context/CampaignContext';
import EditBlock from '../shared/EditBlock';
import ChipComponent from '../../shared/components/ui/ChipComponent';
import ChipsEditBlock from '../onboard/ChipsEditBlock';
export default function KeyFeatures(_a) {
  var _b;
  var pros = _a.pros;
  var _c = useContext(CampaignContext),
    campaignInfo = _c.campaignInfo,
    setCampaignInfo = _c.setCampaignInfo;
  var _d = React.useState(
      (_b =
        campaignInfo === null || campaignInfo === void 0
          ? void 0
          : campaignInfo.product_features) !== null && _b !== void 0
        ? _b
        : []
    ),
    features = _d[0],
    setFeatures = _d[1];
  var _e = useState(false),
    edit = _e[0],
    setEdit = _e[1];
  useEffect(
    function () {
      setCampaignInfo(function (prev) {
        return __assign(__assign({}, prev), { product_features: features });
      });
    },
    [features]
  );
  useEffect(
    function () {
      if (!Array.isArray(pros)) {
        return;
      }
      setFeatures(pros);
    },
    [pros]
  );
  var handleChipClose = function (index) {
    var newChips = Array.from(features);
    newChips.splice(index, 1);
    setFeatures(newChips);
  };
  return _jsxs('div', {
    className: 'p-[20px] rounded-lg mt-7',
    children: [
      _jsxs('div', {
        className: 'flex items-center',
        children: [
          _jsx('h3', {
            className: 'text-[#111928] font-semibold leading-6 capitalize',
            children: 'Key competitive service or product features',
          }),
          _jsx(EditBlock, {
            disabled: edit,
            onClick: function () {
              return setEdit(true);
            },
            className: 'ml-auto',
          }),
        ],
      }),
      _jsx('p', {
        className: 'font-medium text-xs mb-5',
        children:
          'What makes your service or product standout\u2014feel free to edit/add more up to 3 total.',
      }),
      !edit &&
        _jsx('div', {
          className: 'bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg flex items-center',
          style: {
            height: features.length > 0 ? 'fit-content' : '56px',
            padding: features.length > 0 ? '14px 16px' : '0px 16px',
          },
          children: _jsx('div', {
            className: 'block',
            children:
              features === null || features === void 0
                ? void 0
                : features.map(function (feature, index) {
                    return _jsx(
                      ChipComponent,
                      {
                        label: feature,
                        index: index,
                        selected: true,
                        onClose: handleChipClose,
                        onSelect: function () {},
                        className: 'inline-block whitespace-normal my-[2px]',
                      },
                      index
                    );
                  }),
          }),
        }),
      edit &&
        _jsx(ChipsEditBlock, {
          max: 3,
          initValues: features,
          saveValues: setFeatures,
          closeEdit: function () {
            return setEdit(false);
          },
        }),
    ],
  });
}
//# sourceMappingURL=KeyFeatures.js.map
