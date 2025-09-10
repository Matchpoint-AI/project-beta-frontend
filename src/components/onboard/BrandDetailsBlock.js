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
import { useState, useContext, useEffect } from 'react';
import { BrandContext } from '../../context/BrandContext';
import EditBlock from '../shared/EditBlock';
import ChipComponent from '../../shared/components/ui/ChipComponent';
import BrandDetailsEditBlock from '../BrandDetailsEditBlock';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
export default function BrandDetailsBlock(_a) {
  var category = _a.category;
  var _b = useContext(BrandContext),
    businessInfo = _b.businessInfo,
    setBusinessInfo = _b.setBusinessInfo;
  // const isMounted = useRef(false);
  var _c = useState(false),
    edit = _c[0],
    setEdit = _c[1];
  var _d = useState(false),
    error = _d[0],
    setError = _d[1];
  var location = useLocation();
  var navigate = useNavigate();
  var description = {
    mission: 'The goal you want to achieve as a company',
    values: 'The core beliefs that guide your interactions with customers',
    persona: 'The characteristics that identify who you are and how you behave',
    toneAndVoice: 'How your business speaks and verbally expresses its personality',
  };
  var handleChipClose = function (chipIndex) {
    var _a;
    var _b;
    var newChips = Array.from((_b = businessInfo[category]) !== null && _b !== void 0 ? _b : []);
    newChips.splice(chipIndex, 1);
    setBusinessInfo(
      __assign(__assign({}, businessInfo), ((_a = {}), (_a[category] = newChips), _a))
    );
    if (newChips.length === 0) setError(true);
  };
  var handleChipSelect = function (chipIndex) {
    var _a;
    var _b;
    var newChips = Array.from((_b = businessInfo[category]) !== null && _b !== void 0 ? _b : []);
    newChips[chipIndex].selected = !newChips[chipIndex].selected;
    setBusinessInfo(
      __assign(__assign({}, businessInfo), ((_a = {}), (_a[category] = newChips), _a))
    );
    var selectedTags = newChips.filter(function (c) {
      return c.selected;
    });
    if (selectedTags.length === 0) setError(true);
    else setError(false);
  };
  var chips =
    Array.isArray(businessInfo[category]) && typeof businessInfo[category][0] === 'object'
      ? businessInfo[category]
      : [];
  useEffect(
    function () {
      var params = new URLSearchParams(location.search);
      var isEdit = params.get('edit') === 'true';
      var isTarget = location.hash === '#'.concat(category);
      if (isEdit && isTarget) {
        var target = document.getElementById(''.concat(category));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        setEdit(true);
        var newUrl = location.pathname;
        navigate(newUrl, { replace: true });
      }
    },
    [location, navigate]
  );
  return _jsxs('div', {
    id: category,
    style: { backgroundColor: error ? '#FDE8E8' : '#F0F5FF' },
    className: 'p-[20px] rounded-lg mt-7',
    children: [
      _jsxs('div', {
        className: 'flex items-center',
        children: [
          _jsx('h3', {
            className: 'text-[#111928] font-semibold leading-6 capitalize',
            children: category === 'toneAndVoice' ? 'Tone of Voice' : category,
          }),
          error &&
            _jsxs('span', {
              className: 'flex items-start gap-1 ml-3',
              children: [
                _jsx(ReportProblemOutlinedIcon, { sx: { color: '#F05252', fontSize: '18px' } }),
                _jsx('span', {
                  className: 'text-sm text-[#F05252] font-medium',
                  children: 'Select at least one tag',
                }),
              ],
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
        className: 'text-[#111928] font-medium text-xs mb-5',
        children: description[category],
      }),
      !edit &&
        _jsx('div', {
          children: chips.map(function (chip, index) {
            var _a, _b;
            return _jsx(
              ChipComponent,
              {
                label: chip.label,
                index: (_a = chip.id) !== null && _a !== void 0 ? _a : index,
                selected: chip.selected,
                onClose: handleChipClose,
                onSelect: handleChipSelect,
              },
              ''.concat(category, '-').concat((_b = chip.id) !== null && _b !== void 0 ? _b : index)
            );
          }),
        }),
      edit &&
        _jsx(BrandDetailsEditBlock, {
          initValues: chips,
          category: category,
          closeEdit: function () {
            return setEdit(false);
          },
        }),
    ],
  });
}
//# sourceMappingURL=BrandDetailsBlock.js.map
