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
import { useContext } from 'react';
import FormInputBox from './FormInputBox';
import ClearIcon from '@mui/icons-material/Clear';
import { CampaignContext } from '../../../context/CampaignContext';
export default function CampaignFormInput(props) {
  var _a = useContext(CampaignContext),
    campaignInfo = _a.campaignInfo,
    setCampaignInfo = _a.setCampaignInfo;
  var handleChange = function (e) {
    var input = e.target.value;
    props.setName(input);
    props.setError(input === '');
    // Also update the context immediately to avoid timing issues
    setCampaignInfo(__assign(__assign({}, campaignInfo), { name: input }));
  };
  var clearInput = function () {
    props.setName('');
    setCampaignInfo(__assign(__assign({}, campaignInfo), { name: '' }));
    props.setError(true);
  };
  var saveValue = function () {
    var finalValue = props.name; // Use the current name value directly
    props.setError(finalValue === '');
    setCampaignInfo(__assign(__assign({}, campaignInfo), { name: finalValue }));
  };
  return _jsxs('div', {
    children: [
      _jsxs(FormInputBox, {
        color: props.error === null ? '#d1d5db' : props.error ? '#F05252' : '#0E9F6E',
        children: [
          _jsx('input', {
            value: props.name,
            type: 'text',
            placeholder: 'Campaign Name',
            onChange: handleChange,
            onBlur: saveValue,
            className: 'text-sm w-full bg-transparent outline-none',
            style: {
              color: ''.concat(
                props.error === null ? '#111827' : props.error ? '#6c0404' : '#046C4E'
              ),
            },
          }),
          _jsx('button', {
            type: 'button',
            onClick: clearInput,
            children: _jsx(ClearIcon, {
              sx: {
                color: ''.concat(
                  props.error === null ? '#6B7280' : props.error ? '#6c0404' : '#046C4E'
                ),
              },
            }),
          }),
        ],
      }),
      props.error !== null &&
        props.error &&
        _jsx('p', {
          className: 'text-[#F05252] text-sm font-medium mt-1',
          children: 'Please provide a valid value',
        }),
    ],
  });
}
//# sourceMappingURL=CampaignFormInput.js.map
