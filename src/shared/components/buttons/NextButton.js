import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
var NextButton = function (_a) {
  var text = _a.text,
    formId = _a.formId,
    _b = _a.disabled,
    disabled = _b === void 0 ? false : _b;
  return _jsxs('button', {
    disabled: disabled,
    form: formId,
    className:
      'bg-[#5145CD] hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold mb-0 ml-auto md:w-auto w-full flex items-center justify-center disabled:cursor-not-allowed',
    children: [
      text,
      _jsx('img', {
        src: '/angle-right-outline.svg',
        alt: 'arrow-right',
        className: 'w-4 h-4 inline-block ms-2',
      }),
    ],
  });
};
export default NextButton;
//# sourceMappingURL=NextButton.js.map
