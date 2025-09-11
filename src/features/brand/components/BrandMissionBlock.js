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
import { BrandContext } from '../context/BrandContext';
import EditBlock from '../../../components/shared/EditBlock';
import BrandDetailsInput from '../../../shared/components/inputs/BrandDetailsInput';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
import { useLocation, useNavigate } from 'react-router-dom';
export default function BrandMissionBlock() {
  var _a = useContext(BrandContext),
    businessInfo = _a.businessInfo,
    setBusinessInfo = _a.setBusinessInfo;
  var _b = useState(false),
    edit = _b[0],
    setEdit = _b[1];
  var _c = useState(''),
    mission = _c[0],
    setMission = _c[1];
  var location = useLocation();
  var navigate = useNavigate();
  var handleSave = function () {
    setBusinessInfo(__assign(__assign({}, businessInfo), { mission: mission }));
    setEdit(false);
  };
  useEffect(
    function () {
      if (businessInfo.mission) setMission(businessInfo.mission);
    },
    [businessInfo]
  );
  useEffect(
    function () {
      var params = new URLSearchParams(location.search);
      var isEdit = params.get('edit') === 'true';
      var isMissionHash = location.hash === '#mission';
      if (isEdit && isMissionHash) {
        var target = document.getElementById('mission');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        setEdit(true);
        // Clean the URL: remove ?edit=true
        var newUrl = location.pathname;
        navigate(newUrl, { replace: true });
      }
    },
    [location, navigate]
  );
  return _jsxs('div', {
    id: 'mission',
    className: 'p-[20px] bg-[#F0F5FF] rounded-lg mt-7',
    children: [
      _jsxs('div', {
        className: 'flex items-center justify-between',
        children: [
          _jsx('h3', {
            className: 'text-[#111928] font-semibold leading-6 capitalize',
            children: 'mission',
          }),
          _jsx(EditBlock, {
            disabled: edit,
            onClick: function () {
              return setEdit(true);
            },
          }),
        ],
      }),
      _jsx('p', {
        className: 'text-[#111928] font-medium text-xs mb-5',
        children: 'The goal you want to achieve as a company',
      }),
      !edit &&
        _jsx('p', {
          className: 'mt-5 font-medium text-[#111928] leading-5 text-sm',
          children: businessInfo.mission,
        }),
      edit &&
        _jsxs('div', {
          className: 'mt-5',
          children: [
            _jsx(BrandDetailsInput, {
              placeholder: 'Mission',
              value: mission,
              onChange: function (e) {
                return setMission(e.target.value);
              },
            }),
            _jsx(PurpleButton, { className: 'mt-4', onClick: handleSave, children: 'Save' }),
          ],
        }),
    ],
  });
}
//# sourceMappingURL=BrandMissionBlock.js.map
