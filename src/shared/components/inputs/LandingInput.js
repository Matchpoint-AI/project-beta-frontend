import { jsx as _jsx } from 'react/jsx-runtime';
var LandingInput = function (_a) {
  var placeholder = _a.placeholder,
    handleChange = _a.handleChange;
  return placeholder === 'INDUSTRY'
    ? _jsx('textarea', {
        placeholder: placeholder,
        onChange: handleChange,
        className:
          'h-28 w-full border-[0.5px] border-[#BBAABF] bg-[#EEEAEF] rounded-xl p-3 text-start align-text-top',
        style: { resize: 'none' },
      })
    : _jsx('input', {
        type: 'text',
        placeholder: placeholder,
        onChange: handleChange,
        className: 'p-3 w-full border-[0.5px] border-[#BBAABF] bg-[#EEEAEF] rounded-xl',
      });
};
export default LandingInput;
//# sourceMappingURL=LandingInput.js.map
