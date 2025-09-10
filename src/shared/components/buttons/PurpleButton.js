import { jsx as _jsx } from 'react/jsx-runtime';
export default function PurpleButton(_a) {
  var type = _a.type,
    className = _a.className,
    onClick = _a.onClick,
    children = _a.children,
    disabled = _a.disabled;
  return _jsx('button', {
    disabled: disabled,
    onClick: onClick,
    type: type,
    className:
      'hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold md:w-auto w-full flex items-center justify-center '
        .concat(disabled ? 'cursor-not-allowed bg-[#6875F5]' : 'cursor-pointer bg-[#5145CD]', ' ')
        .concat(className),
    children: children,
  });
}
//# sourceMappingURL=PurpleButton.js.map
