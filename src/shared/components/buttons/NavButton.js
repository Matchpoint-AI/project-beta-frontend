import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Link } from 'react-router-dom';
var NavButton = function (_a) {
  var href = _a.href,
    text = _a.text,
    onClick = _a.onClick;
  return _jsx(Link, {
    to: href,
    children: _jsxs('button', {
      className:
        'bg-[#5145CD] hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold mb-0 ml-auto md:w-auto w-full flex items-center justify-center',
      onClick: onClick || function () {},
      children: [
        text,
        _jsx('img', {
          src: '/angle-right-outline.svg',
          alt: 'arrow-right',
          className: 'w-4 h-4 inline-block ms-2',
        }),
      ],
    }),
  });
};
export default NavButton;
//# sourceMappingURL=NavButton.js.map
